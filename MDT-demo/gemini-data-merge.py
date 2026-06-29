import argparse
import asyncio
import hashlib
import json
import os
import re
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from google import genai
from google.genai import types
from google.genai.types import HttpOptions


DEFAULT_MODEL = "gemini-3-flash-preview"
MD_DIR = "/Users/andy/Downloads/zhihui-mdt/md"
SCHEMA_DIR = "/Users/andy/Downloads/zhihui-mdt/schemas"

# ---------------------------------------------------------------------------
# Gemini structured-output schemas (uppercase types required by the API).
# These mirror the minimized JSON schemas so the model is constrained to only
# produce fields the UI actually consumes.
# ---------------------------------------------------------------------------

_TIMELINE_EVENT_ITEM = {
	"type": "OBJECT",
	"properties": {
		"date":        {"type": "STRING"},
		"title":       {"type": "STRING"},
		"hospital":    {"type": "STRING"},
		"type":        {"type": "STRING"},
		"description": {"type": "STRING"},
	},
	"required": ["date", "title", "type"],
}

_OBSERVATION_ITEM = {
	"type": "OBJECT",
	"properties": {
		"code":          {"type": "STRING"},
		"display":       {"type": "STRING"},
		"effectiveDate": {"type": "STRING"},
		"valueNumber":   {"type": "NUMBER"},
	},
	"required": ["code", "effectiveDate", "valueNumber"],
}

EXTRACTION_PATCH_SCHEMA = {
	"type": "OBJECT",
	"properties": {
		"patientRecordPatch": {
			"type": "OBJECT",
			"properties": {
				"timeline":     {"type": "ARRAY", "items": _TIMELINE_EVENT_ITEM},
				"observations": {"type": "ARRAY", "items": _OBSERVATION_ITEM},
			},
		},
	},
}


def now_iso() -> str:
	return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_json(path: Path) -> dict[str, Any]:
	with path.open("r", encoding="utf-8") as file:
		return json.load(file)


def save_json(path: Path, payload: dict[str, Any]) -> None:
	path.parent.mkdir(parents=True, exist_ok=True)
	with path.open("w", encoding="utf-8") as file:
		json.dump(payload, file, ensure_ascii=False, indent=2)


def file_sha256(path: Path) -> str:
	digest = hashlib.sha256()
	with path.open("rb") as file:
		for chunk in iter(lambda: file.read(65536), b""):
			digest.update(chunk)
	return digest.hexdigest()


def strip_code_fences(text: str) -> str:
	text = text.strip()
	text = re.sub(r"^```[a-zA-Z0-9_-]*\s*", "", text)
	text = re.sub(r"\s*```$", "", text)
	return text.strip()


def extract_first_json_blob(text: str) -> str:
	text = strip_code_fences(text)
	if not text:
		raise ValueError("Empty response from model")

	starts = [index for index, char in enumerate(text) if char in "[{"]
	for start in starts:
		opener = text[start]
		closer = "}" if opener == "{" else "]"
		depth = 0
		for index in range(start, len(text)):
			char = text[index]
			if char == opener:
				depth += 1
			elif char == closer:
				depth -= 1
				if depth == 0:
					return text[start : index + 1]

	return text


def parse_json_response(text: str) -> Any:
	blob = extract_first_json_blob(text)
	return json.loads(blob)


def safe_string(value: Any, default: str = "") -> str:
	if isinstance(value, str):
		return value
	return default


def deep_merge(base: Any, patch: Any) -> Any:
	if patch is None:
		return base

	if isinstance(base, dict) and isinstance(patch, dict):
		merged = dict(base)
		for key, value in patch.items():
			if key in merged:
				merged[key] = deep_merge(merged[key], value)
			else:
				merged[key] = value
		return merged

	if isinstance(base, list) and isinstance(patch, list):
		out = list(base)
		seen = {json.dumps(item, ensure_ascii=False, sort_keys=True) for item in out}
		for item in patch:
			token = json.dumps(item, ensure_ascii=False, sort_keys=True)
			if token not in seen:
				out.append(item)
				seen.add(token)
		return out

	if patch in ["", []]:
		return base

	if base in ["未知", "待补充", None, ""]:
		return patch

	return patch


def normalize_patient_record(record: dict[str, Any]) -> dict[str, Any]:
	if not isinstance(record.get("patient"), dict):
		record["patient"] = {}
	patient = record["patient"]
	patient.setdefault("name", "未知")
	patient.setdefault("sex", "未知")
	if patient.get("sex") not in ["男", "女", "未知", "其他"]:
		patient["sex"] = "未知"
	patient.setdefault("identifiers", [])
	patient.setdefault("contacts", [])

	if not isinstance(record.get("clinicalSummary"), dict):
		record["clinicalSummary"] = {}
	summary = record["clinicalSummary"]
	if not isinstance(summary.get("primaryDiagnosis"), dict):
		summary["primaryDiagnosis"] = {}
	primary_diagnosis = summary["primaryDiagnosis"]
	primary_diagnosis.setdefault("display", "待补充")
	summary.setdefault("secondaryDiagnoses", [])
	summary.setdefault("comorbidities", [])

	record.setdefault("timeline", [])
	record.setdefault("observations", [])
	record.setdefault("procedures", [])
	record.setdefault("medications", [])
	record.setdefault("documents", [])
	return record


def _build_date_hospital_index(patient_record: dict[str, Any]) -> dict[str, str]:
	"""Build a YYYY-MM-DD → hospital-name index from all documents and procedures
	in the patient record so we can enrich timeline events that lack a hospital."""
	index: dict[str, str] = {}

	def _register(date_raw: Any, name: Any) -> None:
		if not isinstance(name, str) or not name.strip():
			return
		name = name.strip()
		date_str = safe_string(date_raw, "")
		if "T" in date_str:
			date_str = date_str.split("T")[0]
		date_str = date_str[:10]
		if len(date_str) == 10 and name not in ("未知", ""):
			# Prefer an already-known value only if not yet set
			if date_str not in index:
				index[date_str] = name

	for doc in patient_record.get("documents", []):
		if not isinstance(doc, dict):
			continue
		hospital = (
			doc.get("facility")
			or doc.get("hospital")
			or doc.get("institution")
			or doc.get("provider")
		)
		date_raw = (
			doc.get("date")
			or doc.get("documentDate")
			or doc.get("effectiveDateTime")
			or doc.get("createdDateTime")
		)
		_register(date_raw, hospital)

	for proc in patient_record.get("procedures", []):
		if not isinstance(proc, dict):
			continue
		hospital = proc.get("facility") or proc.get("hospital") or proc.get("institution")
		_register(proc.get("date") or proc.get("performedDateTime"), hospital)

	return index


def build_ui_projection(patient_record: dict[str, Any], extracted_at: str) -> dict[str, Any]:
	patient = patient_record.get("patient", {})
	summary = patient_record.get("clinicalSummary", {})
	timeline = patient_record.get("timeline", [])
	observations = patient_record.get("observations", [])

	# Pre-build date → hospital lookup from documents/procedures
	date_hospital_index = _build_date_hospital_index(patient_record)

	VALID_TYPES = {
		"admission", "imaging", "diagnosis", "treatment", "surgery",
		"followup", "mdt", "relapse", "progression", "evaluation",
		"examination", "default", "other",
	}

	timeline_ui = []
	for event in timeline:
		if not isinstance(event, dict):
			continue
		event_date = safe_string(event.get("date"), datetime.now().strftime("%Y-%m-%d"))
		# Normalise to YYYY-MM-DD for the lookup
		event_date_short = event_date.split("T")[0][:10]

		# Title: prefer explicit title, fall back to description (raw events often omit title)
		title = (
			safe_string(event.get("title"), "")
			or safe_string(event.get("description"), "")
			or "诊疗事件"
		)

		# Hospital: prefer event-level value, then date-based lookup, then "未知"
		hospital_raw = safe_string(event.get("hospital"), "") or safe_string(event.get("facility"), "")
		if not hospital_raw or hospital_raw == "未知":
			hospital_raw = date_hospital_index.get(event_date_short, "未知")

		event_type = safe_string(event.get("type"), "default")
		if event_type not in VALID_TYPES:
			event_type = "default"

		timeline_ui.append(
			{
				"date": event_date,
				"title": title,
				"hospital": hospital_raw,
				"type": event_type,
				"desc": safe_string(event.get("description") or event.get("desc"), ""),
			}
		)

	if not timeline_ui:
		timeline_ui = [
			{
				"date": datetime.now().strftime("%Y-%m-%d"),
				"title": "资料导入",
				"hospital": "未知",
				"type": "default",
				"desc": "由文档自动抽取生成",
			}
		]

	indicators: dict[str, list[dict[str, Any]]] = {}
	for obs in observations:
		if not isinstance(obs, dict):
			continue
		name = safe_string(obs.get("code")) or safe_string(obs.get("display")) or "未命名指标"
		# Support both effectiveDate (date-only) and effectiveDateTime (ISO datetime)
		raw_date = obs.get("effectiveDate") or obs.get("effectiveDateTime") or ""
		effective_date = safe_string(raw_date, datetime.now().strftime("%Y-%m-%d"))
		# Normalise to YYYY-MM-DD
		if "T" in effective_date:
			effective_date = effective_date.split("T")[0]
		# Accept valueNumber (preferred) or fall back to value string
		value_number = obs.get("valueNumber")
		if not isinstance(value_number, (int, float)):
			try:
				value_number = float(obs.get("value", ""))
			except (TypeError, ValueError):
				continue
		indicators.setdefault(name, []).append({"date": effective_date, "value": float(value_number)})

	# ── Bundle observations onto timeline events by matching date ─────────────
	date_obs_index: dict[str, list[dict[str, Any]]] = {}
	for obs_name, pts in indicators.items():
		for pt in pts:
			date_obs_index.setdefault(pt["date"], []).append({"name": obs_name, "value": pt["value"]})
	for ev in timeline_ui:
		ev_date = ev["date"].split("T")[0][:10]
		ev["observations"] = date_obs_index.get(ev_date, [])

	ui = {
		"id": safe_string(patient.get("patientId")) or f"TEMP-{uuid.uuid4().hex[:8]}",
		"name": safe_string(patient.get("name"), "未知"),
		"gender": safe_string(patient.get("sex"), "未知"),
		"age": patient.get("age") if isinstance(patient.get("age"), int) else 0,
		"disease": safe_string(summary.get("primaryDiagnosis", {}).get("display"), "待补充"),
		"stage": safe_string(summary.get("stage", {}).get("stageGroup"), ""),
		"complications": [
			item.get("display")
			for item in summary.get("comorbidities", [])
			if isinstance(item, dict) and isinstance(item.get("display"), str)
		],
		"treatment": safe_string(summary.get("treatmentStatus"), "待补充"),
		"group": "",
		"lastUpdate": datetime.fromisoformat(extracted_at.replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M"),
		"timeline": timeline_ui,
		"indicators": indicators,
		"basicInfo": {
			"chiefComplaint": safe_string(summary.get("chiefComplaint"), ""),
			"presentHistory": safe_string(summary.get("presentHistory"), ""),
			"pastHistory": safe_string(summary.get("pastHistory"), ""),
			"familyHistory": safe_string(summary.get("familyHistory"), ""),
			"personalHistory": safe_string(summary.get("personalHistory"), ""),
		},
	}
	return ui


@dataclass
class Schemas:
	classification_schema: dict[str, Any]
	extraction_schema: dict[str, Any]
	patient_canonical_schema: dict[str, Any]
	patient_ui_schema: dict[str, Any]
	routing_map: dict[str, Any]


class GeminiExtractionPipeline:
	def __init__(self, model: str, schemas: Schemas, max_concurrency: int = 50):
		self.model = model
		self.schemas = schemas
		self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
		self.semaphore = asyncio.Semaphore(max_concurrency)
		self.category_enum = self.schemas.classification_schema["$defs"]["DocumentCategory"]["enum"]
		self.routing_by_category = {
			category["id"]: category for category in self.schemas.routing_map.get("categories", [])
		}
		# Build classification response schema with the live category enum.
		self._classification_schema = {
			"type": "OBJECT",
			"properties": {
				"language":            {"type": "STRING"},
				"primaryCategory":     {"type": "STRING", "enum": self.category_enum},
				"secondaryCategories": {"type": "ARRAY", "items": {"type": "STRING"}},
				"categoryConfidence":  {"type": "NUMBER"},
				"reasoning":           {"type": "STRING"},
			},
			"required": ["language", "primaryCategory", "categoryConfidence", "reasoning"],
		}

	async def call_json(self, prompt: str, schema: dict | None = None) -> Any:
		"""Call the model and return a parsed JSON value.

		When *schema* is supplied the request uses Gemini's native structured-output
		mode (response_mime_type + response_schema), which forces the model to emit
		valid JSON that is constrained to the given schema.  When *schema* is None
		the legacy free-form JSON extraction path is used as a fallback.
		"""
		if schema is not None:
			config = types.GenerateContentConfig(
				temperature=0,
				response_mime_type="application/json",
				response_schema=schema,
				thinking_config=types.ThinkingConfig(thinking_level="low"),
			)
			response = await self.client.aio.models.generate_content(
				model=self.model,
				contents=prompt,
				config=config,
			)
			return json.loads(response.text or "{}")
		# Fallback: free-form generation with manual JSON extraction.
		response = await self.client.aio.models.generate_content(
			model=self.model,
			contents=prompt,
			config=types.GenerateContentConfig(temperature=0),
		)
		return parse_json_response(response.text or "")

	async def classify_document(self, document_id: str, file_name: str, content: str) -> dict[str, Any]:
		prompt = (
			"你是临床文档分类器。根据给定 markdown 文本，识别文档类别并给出置信度与简短理由。\n"
			f"可选 primaryCategory 枚举：{json.dumps(self.category_enum, ensure_ascii=False)}\n"
			"secondaryCategories 最多2个，且不包含 primaryCategory。置信度范围 0~1。\n"
			f"文档内容:\n{content[:16000]}"
		)

		raw = await self.call_json(prompt, schema=self._classification_schema)
		primary_category = raw.get("primaryCategory")
		if primary_category not in self.category_enum:
			primary_category = "other_nonclinical"

		routing = self.routing_by_category.get(primary_category, {})
		routing_plan = {
			"promptTemplateId": routing.get("promptTemplateId", f"cat.{primary_category}.1.0.0"),
			"extractionMode": routing.get("extractionMode", "extract"),
			"targetSchemas": routing.get("targetSchemas", ["patient-canonical", "extraction-result-envelope"]),
			"priority": 3,
			"notes": "auto-routed by local category-routing.map.json",
		}

		secondary_categories = raw.get("secondaryCategories", [])
		if not isinstance(secondary_categories, list):
			secondary_categories = []
		secondary_categories = [
			category
			for category in secondary_categories
			if isinstance(category, str) and category in self.category_enum and category != primary_category
		][:2]

		confidence = raw.get("categoryConfidence", 0.3)
		if not isinstance(confidence, (int, float)):
			confidence = 0.3
		confidence = max(0.0, min(1.0, float(confidence)))

		return {
			"schemaVersion": "1.0.0",
			"classificationId": f"cls-{uuid.uuid4()}",
			"classifiedAt": now_iso(),
			"language": safe_string(raw.get("language"), "zh-CN"),
			"document": {
				"documentId": document_id,
				"fileName": file_name,
			},
			"primaryCategory": primary_category,
			"secondaryCategories": secondary_categories,
			"categoryConfidence": confidence,
			"reasoning": safe_string(raw.get("reasoning"), ""),
			"routing": routing_plan,
			"issues": [],
		}

	async def extract_document_patch(
		self,
		document_id: str,
		file_name: str,
		content: str,
		classification: dict[str, Any],
	) -> dict[str, Any]:
		category = classification["primaryCategory"]
		routing = self.routing_by_category.get(category, {})
		focus_fields = routing.get("focusFields", [])

		prompt = (
			"你是医疗信息结构化抽取器。根据给定 markdown 文本抽取时间轴事件与实验室/检查指标。\n"
			"patientRecordPatch.observations 中优先提取有明确数值的实验室或检查指标（如 AFP、CEA、心率等），以便生成趋势图。\n"
			"每条 observation 必须包含 code（指标名称）、effectiveDate（YYYY-MM-DD）、valueNumber（数值）。\n"
			"timeline 中每条事件必须包含 date（YYYY-MM-DD）、title（简明事件标题）、type（事件类型）。\n"            
			f"当前文档分类: {category}\n"
			f"文档内容:\n{content[:24000]}"
		)

		return await self.call_json(prompt, schema=EXTRACTION_PATCH_SCHEMA)
	async def deduplicate_timeline(self, timeline: list[dict[str, Any]]) -> list[dict[str, Any]]:
		"""Group timeline events by date, then run LLM merge only on groups with >1 event.

		Single-event date groups are passed through unchanged.  Multi-event groups
		are sent to the LLM in parallel so the model can identify and collapse entries
		that describe the same clinical encounter.  All results are combined and sorted
		chronologically.
		"""
		if len(timeline) <= 1:
			return timeline

		log_path = Path(__file__).parent / "output" / f"dedup-llm-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"
		log_path.parent.mkdir(parents=True, exist_ok=True)
		log_file = log_path.open("w", encoding="utf-8")
		print(f"  ⟳ Logging dedup LLM calls to: {log_path}")

		VALID_TYPES = {
			"admission", "imaging", "diagnosis", "treatment", "surgery",
			"followup", "mdt", "relapse", "progression", "evaluation",
			"examination", "default", "other",
		}

		dedup_schema = {
			"type": "OBJECT",
			"properties": {
				"events": {
					"type": "ARRAY",
					"items": {
						"type": "OBJECT",
						"properties": {
							"date":     {"type": "STRING"},
							"title":    {"type": "STRING"},
							"hospital": {"type": "STRING"},
							"type":     {"type": "STRING"},
							"desc":     {"type": "STRING"},
						},
						"required": ["date", "title", "type"],
					},
				},
			},
			"required": ["events"],
		}

		def _sanitise(event: dict[str, Any], obs_backup: dict[str, list] | None = None) -> dict[str, Any]:
			event_type = safe_string(event.get("type"), "default")
			if event_type not in VALID_TYPES:
				event_type = "default"
			date_key = safe_string(event.get("date"), "").split("T")[0][:10]
			# Prefer observations already on the event; fall back to the backup index
			obs = event.get("observations")
			if not isinstance(obs, list) and obs_backup is not None:
				obs = obs_backup.get(date_key, [])
			elif not isinstance(obs, list):
				obs = []
			return {
				"date":         date_key,
				"title":        safe_string(event.get("title"), "诊疗事件"),
				"hospital":     safe_string(event.get("hospital"), "未知"),
				"type":         event_type,
				"desc":         safe_string(event.get("desc"), ""),
				"observations": obs,
			}

		async def _merge_group(date_key: str, group: list[dict[str, Any]]) -> list[dict[str, Any]]:
			"""Ask the LLM to merge all events in a single date group."""
			# Collect all observations for this date so we can reattach them after LLM merge
			date_obs_combined: list[dict[str, Any]] = []
			seen_obs: set[str] = set()
			for ev in group:
				for ob in (ev.get("observations") or []):
					tok = f"{ob.get('name')}:{ob.get('value')}"
					if tok not in seen_obs:
						date_obs_combined.append(ob)
						seen_obs.add(tok)
			prompt = (
				"你是临床数据后处理专家。\n"
				f"以下是同一日期（{date_key}）从多份病历文档中分别抽取的时间轴事件（JSON 数组）。\n"
				"其中可能存在重复条目——不同文档对同一次就诊/检查/手术事件的描述。\n"
				"请你：\n"
				"1. 识别指向同一临床事件的条目并将其合并为一条。\n"
				"   判断依据：事件类型相同、医院/科室相同或相似、标题语义相近。\n"
				"2. 合并规则：\n"
				"   - date：取最精确的日期（优先 YYYY-MM-DD 格式）\n"
				"   - title：取最具体、信息量最大的标题，避免保留'诊疗事件'等泛称\n"
				"   - hospital：取已知、最具体的医院名，避免保留'未知'\n"
				"   - type：保持原值；若有冲突取语义最具体的；必须是以下之一：\n"
				f"     {sorted(VALID_TYPES)}\n"
				"   - desc：将各条目非重复的描述片段拼接，用'；'分隔，去除冗余重复内容\n"
				"3. 不是重复的条目保持原样输出。\n"
				"4. 结果放入 \"events\" 字段，每个对象只保留字段：date, title, hospital, type, desc\n"
				"\n输入事件（JSON 数组）：\n"
				+ json.dumps(group, ensure_ascii=False, indent=2)
			)
			input_block = json.dumps(group, ensure_ascii=False, indent=4)
			print(f"  [dedup-llm] INPUT  date={date_key}  n={len(group)}")
			log_file.write(f"=== INPUT  date={date_key}  n={len(group)} ===\n{input_block}\n\n")
			log_file.flush()
			try:
				result = await self.call_json(prompt, schema=dedup_schema)
			except Exception as exc:
				print(f"  ⚠ Timeline LLM dedup failed for date {date_key} ({exc}), keeping originals")
				log_file.write(f"=== ERROR  date={date_key}: {exc} ===\n\n")
				log_file.flush()
				return [_sanitise(e) for e in group]

			output_block = json.dumps(result, ensure_ascii=False, indent=4)
			print(f"  [dedup-llm] OUTPUT date={date_key}")
			log_file.write(f"=== OUTPUT date={date_key} ===\n{output_block}\n\n")
			log_file.flush()

			if isinstance(result, dict):
				result = result.get("events", result)
			if not isinstance(result, list):
				print(f"  ⚠ Timeline LLM dedup for {date_key} returned non-list, keeping originals")
				return [_sanitise(e) for e in group]

			# obs_backup maps the single date_key to the merged observations list
			obs_backup = {date_key: date_obs_combined}
			return [_sanitise(e, obs_backup) for e in result if isinstance(e, dict)]

		# Step 1: group events by YYYY-MM-DD
		groups: dict[str, list[dict[str, Any]]] = {}
		for event in timeline:
			if not isinstance(event, dict):
				continue
			date_key = safe_string(event.get("date"), "").split("T")[0][:10]
			groups.setdefault(date_key, []).append(event)

		# Step 2: pass single-event groups through; fan out LLM calls for multi-event groups
		solo: list[dict[str, Any]] = []
		multi_dates: list[str] = []
		for date_key, group in groups.items():
			if len(group) == 1:
				solo.append(_sanitise(group[0]))
			else:
				multi_dates.append(date_key)

		if multi_dates:
			print(f"  ⟳ Running LLM merge on {len(multi_dates)} date group(s) with duplicate events...")
			merged_groups = await asyncio.gather(
				*[_merge_group(d, groups[d]) for d in multi_dates],
				return_exceptions=False,
			)
			merged_events: list[dict[str, Any]] = [e for group in merged_groups for e in group]
		else:
			merged_events = []

		log_file.close()
		combined = solo + merged_events
		combined.sort(key=lambda e: safe_string(e.get("date"), ""))
		return combined

	async def has_date_information(self, content: str) -> bool:
		"""Ask the LLM whether the document contains at least one identifiable date.
		Defaults to True on any error so borderline files are never silently dropped.
		"""
		schema = {
			"type": "OBJECT",
			"properties": {
				"hasDate": {"type": "BOOLEAN"},
				"reason": {"type": "STRING"},
			},
			"required": ["hasDate", "reason"],
		}
		prompt = (
			"判断以下 markdown 文本是否包含至少一个可识别的日期信息（如就诊日期、检查日期、入院日期等）。"
			"返回 JSON：{\"hasDate\": true/false, \"reason\": \"一句话说明\"}。\n"
			f"文档内容:\n{content[:4000]}"
		)
		try:
			raw = await self.call_json(prompt, schema=schema)
			return bool(raw.get("hasDate", True))
		except Exception as exc:
			print(f"  ⚠ Date check failed ({exc}), defaulting to process")
			return True

	async def process_file(self, file_path: Path) -> dict[str, Any] | None:
		async with self.semaphore:
			content = file_path.read_text(encoding="utf-8", errors="ignore")
			if not await self.has_date_information(content):
				print(f"  ⊘ {file_path.name} → skipped (no identifiable date information)")
				return None
			document_id = f"doc-{uuid.uuid4().hex[:12]}"
			checksum = file_sha256(file_path)
			source_document = {
				"documentId": document_id,
				"fileName": file_path.name,
				"mimeType": "text/markdown",
				"checksumSha256": checksum,
				"sourceSystem": "local-md-folder",
			}
			classification = await self.classify_document(document_id, file_path.name, content)
			patch = await self.extract_document_patch(document_id, file_path.name, content, classification)
			print(f"  ✓ {file_path.name} → {classification.get('primaryCategory')}")
			return {
				"source_document": source_document,
				"classification": classification,
				"patch": patch,
				"document_id": document_id,
				"file_name": file_path.name,
			}


def list_markdown_files(md_dir: Path) -> list[Path]:
	return sorted(path for path in md_dir.glob("*.md") if path.is_file())


def load_schemas(schema_dir: Path) -> Schemas:
	return Schemas(
		classification_schema=load_json(schema_dir / "document-classification.schema.json"),
		extraction_schema=load_json(schema_dir / "extraction-result.schema.json"),
		patient_canonical_schema=load_json(schema_dir / "patient-canonical.schema.json"),
		patient_ui_schema=load_json(schema_dir / "patient-ui.schema.json"),
		routing_map=load_json(schema_dir / "prompt-templates" / "category-routing.map.json"),
	)


def apply_google_env() -> None:
	gcp_key_path = "/Users/andy/repos/NoahAgent/noah_agent/gcp_key.json"
	if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", ""):
		os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = gcp_key_path

	os.environ["GOOGLE_CLOUD_PROJECT"] = "noahai-440408"
	os.environ["GOOGLE_CLOUD_LOCATION"] = "global"
	os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "true"


async def run_pipeline(args: argparse.Namespace) -> dict[str, Any]:
	apply_google_env()

	schema_dir = Path(SCHEMA_DIR)
	md_dir = Path(MD_DIR)

	schemas = load_schemas(schema_dir)
	pipeline = GeminiExtractionPipeline(model=args.model, schemas=schemas)

	markdown_files = list_markdown_files(md_dir)
	if not markdown_files:
		raise FileNotFoundError(f"No markdown files found in: {md_dir}")

	started_at = datetime.now(timezone.utc)

	extraction_result: dict[str, Any] = {
		"schemaVersion": "1.0.0",
		"extractionId": f"ext-{uuid.uuid4()}",
		"extractedAt": now_iso(),
		"pipeline": {
			"ocrEngine": "markdown-input",
			"nlpModel": args.model,
			"parserVersion": "gemini-data-extraction.py@1.0.0",
			"language": "zh-CN",
		},
		"sourceDocuments": [],
		"patientRecord": {
			"patient": {"name": "未知", "sex": "未知", "identifiers": [], "contacts": []},
			"clinicalSummary": {
				"primaryDiagnosis": {"display": "待补充"},
				"secondaryDiagnoses": [],
				"comorbidities": [],
			},
			"timeline": [],
			"observations": [],
			"procedures": [],
			"medications": [],
			"documents": [],
		},
		"fieldProvenance": [],
		"quality": {
			"overallConfidence": 0.0,
			"completenessScore": 0.0,
			"validationStatus": "warn",
			"missingCriticalFields": [],
			"conflicts": [],
			"notes": "Generated by Gemini markdown extraction pipeline",
		},
		"issues": [],
	}

	classifications: list[dict[str, Any]] = []
	per_document_results: list[dict[str, Any]] = []
	confidence_list: list[float] = []
	completeness_list: list[float] = []

	print(f"Processing {len(markdown_files)} files in parallel (max_concurrency=50)...")
	all_results = await asyncio.gather(
		*[pipeline.process_file(fp) for fp in markdown_files],
		return_exceptions=False,
	)
	file_results = [r for r in all_results if r is not None]
	skipped = len(all_results) - len(file_results)
	if skipped:
		print(f"  ⊘ Skipped {skipped} file(s) with no identifiable date information.")

	for index, result in enumerate(file_results, start=1):
		print(f"[{index}/{len(file_results)}] Merging {result['file_name']}")
		extraction_result["sourceDocuments"].append(result["source_document"])

		classification = result["classification"]
		classifications.append(classification)

		patch = result["patch"]
		patient_patch = patch.get("patientRecordPatch", {})

		if isinstance(patient_patch, dict):
			extraction_result["patientRecord"] = deep_merge(extraction_result["patientRecord"], patient_patch)
			extraction_result["patientRecord"] = normalize_patient_record(extraction_result["patientRecord"])

		doc_confidence = classification.get("categoryConfidence", 0.0)
		if isinstance(doc_confidence, (int, float)):
			confidence_list.append(float(doc_confidence))

		per_document_results.append(
			{
				"documentId": result["document_id"],
				"fileName": result["file_name"],
				"classificationId": classification.get("classificationId"),
				"primaryCategory": classification.get("primaryCategory"),
			}
		)

	runtime_ms = int((datetime.now(timezone.utc) - started_at).total_seconds() * 1000)
	extraction_result["pipeline"]["runtimeMs"] = runtime_ms

	if confidence_list:
		extraction_result["quality"]["overallConfidence"] = max(0.0, min(1.0, sum(confidence_list) / len(confidence_list)))
	else:
		extraction_result["quality"]["overallConfidence"] = 0.5

	if completeness_list:
		extraction_result["quality"]["completenessScore"] = max(
			0.0,
			min(1.0, sum(completeness_list) / len(completeness_list)),
		)
	else:
		missing = extraction_result["quality"].get("missingCriticalFields", [])
		extraction_result["quality"]["completenessScore"] = 0.9 if not missing else 0.6

	missing_critical = extraction_result["quality"].get("missingCriticalFields", [])
	if missing_critical:
		extraction_result["quality"]["validationStatus"] = "warn"
	else:
		extraction_result["quality"]["validationStatus"] = "pass"

	extraction_result["patientRecord"] = normalize_patient_record(extraction_result["patientRecord"])

	if "uiProjection" not in extraction_result or not isinstance(extraction_result.get("uiProjection"), dict):
		extraction_result["uiProjection"] = build_ui_projection(
			extraction_result["patientRecord"], extraction_result["extractedAt"]
		)
	else:
		extraction_result["uiProjection"] = deep_merge(
			build_ui_projection(extraction_result["patientRecord"], extraction_result["extractedAt"]),
			extraction_result["uiProjection"],
		)

	# Deduplicate timeline events that were extracted independently from multiple documents
	ui = extraction_result["uiProjection"]
	if isinstance(ui.get("timeline"), list):
		before = len(ui["timeline"])
		print(f"  ⟳ Deduplicating {before} timeline events via LLM...")
		ui["timeline"] = await pipeline.deduplicate_timeline(ui["timeline"])
		after = len(ui["timeline"])
		print(f"  ⟳ Timeline dedup: {before} → {after} events")

	bundle = {
		"bundleSchemaVersion": "1.0.0",
		"generatedAt": now_iso(),
		"inputDirectory": str(md_dir.resolve()),
		"schemaDirectory": str(schema_dir.resolve()),
		"model": args.model,
		"classifications": classifications,
		"extractionResult": extraction_result,
		"documents": per_document_results,
	}
	return bundle


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(
		description="Gemini pipeline: classify markdown documents and extract merged patient JSON"
	)
	parser.add_argument(
		"--output",
		default="output/gemini-extraction-bundle.json",
		help="Output JSON path",
	)
	parser.add_argument("--model", default=DEFAULT_MODEL, help="Gemini model name")
	return parser.parse_args()


def _write_bundle_js(bundle: dict, output_path: Path) -> None:
	"""Write a js/bundle-data.js sibling so index.html works without a server."""
	js_dir = Path(__file__).parent / "js"
	js_dir.mkdir(exist_ok=True)
	js_path = js_dir / "bundle-data.js"
	header = (
		"// Auto-generated from output/gemini-extraction-bundle.json – do not edit by hand.\n"
		"// Re-run gemini-data-extraction-single.py to refresh.\n"
	)
	body = json.dumps(bundle, ensure_ascii=False, indent=2)
	js_path.write_text(header + "const BUNDLE_DATA = " + body + ";\n", encoding="utf-8")
	print(f"✅ Wrote {js_path}  ({js_path.stat().st_size:,} bytes)")


def main() -> None:
	args = parse_args()
	bundle = asyncio.run(run_pipeline(args))
	output_path = Path(args.output)
	save_json(output_path, bundle)
	print(f"✅ Done. Wrote aggregated JSON to: {output_path}")
	_write_bundle_js(bundle, output_path)


if __name__ == "__main__":
	main()
