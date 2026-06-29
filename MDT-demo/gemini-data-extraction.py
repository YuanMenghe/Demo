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
from google.genai.types import HttpOptions


DEFAULT_MODEL = "gemini-3.1-pro-preview"
MD_DIR = "/Users/andy/Downloads/zhihui-mdt/md"
SCHEMA_DIR = "/Users/andy/Downloads/zhihui-mdt/schemas"


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


def build_ui_projection(patient_record: dict[str, Any], extracted_at: str) -> dict[str, Any]:
	patient = patient_record.get("patient", {})
	summary = patient_record.get("clinicalSummary", {})
	timeline = patient_record.get("timeline", [])
	observations = patient_record.get("observations", [])

	timeline_ui = []
	for event in timeline:
		if not isinstance(event, dict):
			continue
		timeline_ui.append(
			{
				"date": safe_string(event.get("date"), datetime.now().strftime("%Y-%m-%d")),
				"title": safe_string(event.get("title"), "诊疗事件"),
				"hospital": safe_string(event.get("hospital"), "未知"),
				"type": safe_string(event.get("type"), "default")
				if safe_string(event.get("type"), "default")
				in [
					"admission",
					"imaging",
					"diagnosis",
					"treatment",
					"surgery",
					"followup",
					"mdt",
					"relapse",
					"progression",
					"evaluation",
					"examination",
					"default",
					"other",
				]
				else "default",
				"desc": safe_string(event.get("description"), ""),
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
	def __init__(self, model: str, schemas: Schemas, max_concurrency: int = 10):
		self.model = model
		self.schemas = schemas
		self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
		self.semaphore = asyncio.Semaphore(max_concurrency)
		self.category_enum = self.schemas.classification_schema["$defs"]["DocumentCategory"]["enum"]
		self.routing_by_category = {
			category["id"]: category for category in self.schemas.routing_map.get("categories", [])
		}

	async def call_json(self, prompt: str) -> Any:
		response = await self.client.aio.models.generate_content(
			model=self.model,
			contents=prompt,
			config={"temperature": 0},
		)
		return parse_json_response(response.text or "")

	async def classify_document(self, document_id: str, file_name: str, content: str) -> dict[str, Any]:
		routing_template = {
			"promptTemplateId": "cat.<category>.1.0.0",
			"extractionMode": "extract | metadata_only | skip",
			"targetSchemas": ["patient-canonical", "patient-ui", "extraction-result-envelope"],
			"targetPaths": [
				"/sourceDocuments",
				"/patientRecord/patient",
				"/patientRecord/clinicalSummary",
				"/patientRecord/timeline",
				"/patientRecord/observations",
				"/patientRecord/procedures",
				"/patientRecord/medications",
				"/patientRecord/documents",
				"/uiProjection",
				"/uiProjection/timeline",
				"/uiProjection/indicators",
				"/uiProjection/basicInfo",
				"/fieldProvenance",
				"/quality",
				"/issues",
			],
		}

		prompt = (
			"你是临床文档分类器。严格输出 JSON 对象，不要输出任何解释。\n"
			"请根据给定 markdown 文本，识别文档类别并给出置信度与简短理由。\n"
			f"可选 primaryCategory 枚举：{json.dumps(self.category_enum, ensure_ascii=False)}\n"
			"返回 JSON 字段仅包含：language, primaryCategory, secondaryCategories, categoryConfidence, reasoning。\n"
			"secondaryCategories 最多2个，且不包含 primaryCategory。\n"
			"置信度范围 0~1。\n"
			f"文档内容:\n{content[:16000]}"
		)

		raw = await self.call_json(prompt)
		primary_category = raw.get("primaryCategory")
		if primary_category not in self.category_enum:
			primary_category = "other_nonclinical"

		routing = self.routing_by_category.get(primary_category, {})
		routing_plan = {
			"promptTemplateId": routing.get("promptTemplateId", f"cat.{primary_category}.1.0.0"),
			"extractionMode": routing.get("extractionMode", "extract"),
			"targetSchemas": routing.get("targetSchemas", ["patient-canonical", "extraction-result-envelope"]),
			"targetPaths": routing.get("targetPaths", ["/issues"]),
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
			"你是医疗信息结构化抽取器。严格输出 JSON 对象，不要输出任何解释。\n"
			"根据给定 markdown 文本，输出一个‘增量补丁’用于合并到 extraction-result。\n"
			"字段必须遵守项目 schema 命名。尽量只填能从文本确定的信息，不确定就留空或不填。\n"
			"输出 JSON 顶层仅允许这些字段：\n"
			"patientRecordPatch, uiProjectionPatch, fieldProvenance, issues, qualityHints\n"
			"其中：\n"
			"- patientRecordPatch 可包含 patient/clinicalSummary/timeline/observations/procedures/medications/documents/notes\n"
		"  observations 中每个检验/检查指标应包含字段：category, code(指标名称), value(字符串原值), valueNumber(数值，必填), unit, effectiveDateTime(ISO格式)\n"
		"  优先提取有明确数值的实验室或检查指标（如心率、SDNN、AFP、CEA 等），以便生成趋势图\n"
		"- uiProjectionPatch 可包含 timeline/indicators/basicInfo 及其他 UI 字段（可选）\n"
		"  indicators 格式：{ \"指标名\": [{\"date\": \"YYYY-MM-DD\", \"value\": 数值}, ...] }\n"
			"- fieldProvenance 为数组，每个元素包含 jsonPath/confidence/sourceSpans\n"
			"- issues 为数组，每个元素包含 severity/code/message\n"
			"- qualityHints 包含 overallConfidence/completenessScore/missingCriticalFields(数组)\n"
			f"当前文档分类: {category}\n"
			f"当前分类重点字段: {json.dumps(focus_fields, ensure_ascii=False)}\n"
			f"文档内容:\n{content[:24000]}"
		)

		raw = await self.call_json(prompt)
		if not isinstance(raw, dict):
			raise ValueError("Extraction response is not a JSON object")
		return raw

	async def process_file(self, file_path: Path) -> dict[str, Any]:
		async with self.semaphore:
			content = file_path.read_text(encoding="utf-8", errors="ignore")
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

	print(f"Processing {len(markdown_files)} files in parallel (max_concurrency=10)...")
	file_results = await asyncio.gather(
		*[pipeline.process_file(fp) for fp in markdown_files],
		return_exceptions=False,
	)

	for index, result in enumerate(file_results, start=1):
		print(f"[{index}/{len(file_results)}] Merging {result['file_name']}")
		extraction_result["sourceDocuments"].append(result["source_document"])

		classification = result["classification"]
		classifications.append(classification)

		patch = result["patch"]
		patient_patch = patch.get("patientRecordPatch", {})
		ui_patch = patch.get("uiProjectionPatch", {})
		provenance = patch.get("fieldProvenance", [])
		issues = patch.get("issues", [])
		quality_hints = patch.get("qualityHints", {})

		if isinstance(patient_patch, dict):
			extraction_result["patientRecord"] = deep_merge(extraction_result["patientRecord"], patient_patch)
			extraction_result["patientRecord"] = normalize_patient_record(extraction_result["patientRecord"])

		if isinstance(ui_patch, dict):
			existing_ui = extraction_result.get("uiProjection") or {}
			extraction_result["uiProjection"] = deep_merge(existing_ui, ui_patch)

		if isinstance(provenance, list):
			extraction_result["fieldProvenance"] = deep_merge(extraction_result["fieldProvenance"], provenance)

		if isinstance(issues, list):
			extraction_result["issues"] = deep_merge(extraction_result["issues"], issues)

		doc_confidence = classification.get("categoryConfidence", 0.0)
		if isinstance(doc_confidence, (int, float)):
			confidence_list.append(float(doc_confidence))

		if isinstance(quality_hints, dict):
			hint_confidence = quality_hints.get("overallConfidence")
			hint_completeness = quality_hints.get("completenessScore")
			if isinstance(hint_confidence, (int, float)):
				confidence_list.append(float(hint_confidence))
			if isinstance(hint_completeness, (int, float)):
				completeness_list.append(float(hint_completeness))

			missing_fields = quality_hints.get("missingCriticalFields", [])
			if isinstance(missing_fields, list):
				extraction_result["quality"]["missingCriticalFields"] = deep_merge(
					extraction_result["quality"].get("missingCriticalFields", []),
					missing_fields,
				)

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
