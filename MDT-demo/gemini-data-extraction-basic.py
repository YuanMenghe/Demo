import argparse
import asyncio
import json
import os
import re
from pathlib import Path
from typing import Any

from google import genai
from google.genai.types import HttpOptions


DEFAULT_MODEL = "gemini-3-flash-preview"
MD_DIR = "/Users/andy/Downloads/zhihui-mdt/md"


def save_json(path: Path, payload: Any) -> None:
	path.parent.mkdir(parents=True, exist_ok=True)
	with path.open("w", encoding="utf-8") as f:
		json.dump(payload, f, ensure_ascii=False, indent=2)


def strip_code_fences(text: str) -> str:
	text = text.strip()
	text = re.sub(r"^```[a-zA-Z0-9_-]*\s*", "", text)
	text = re.sub(r"\s*```$", "", text)
	return text.strip()


def parse_json_response(text: str) -> Any:
	text = strip_code_fences(text)
	starts = [i for i, c in enumerate(text) if c in "[{"]
	for start in starts:
		opener = text[start]
		closer = "}" if opener == "{" else "]"
		depth = 0
		for i in range(start, len(text)):
			if text[i] == opener:
				depth += 1
			elif text[i] == closer:
				depth -= 1
				if depth == 0:
					return json.loads(text[start : i + 1])
	return json.loads(text)


# Step 1: decide whether a file contains qualitative patient info
CLASSIFY_PROMPT = """\
你是医疗文档筛选器。仅输出 true 或 false，不要有任何其他文字。

判断以下 markdown 文档是否包含患者定性信息（例如：姓名、性别、年龄、诊断、主诉、现病史、\
既往史、家族史、个人史、合并症、分期等）。
如果文档主要是详细的定量数据（例如：检验数字报告、影像测量数据、药物剂量记录等），返回 false。
只要含有任何定性患者信息，返回 true。

文件名: {file_name}

文档内容:
{content}
"""

# Step 2: summarize qualitative info from a single file into free-form text
SUMMARIZE_PROMPT = """\
你是医疗信息摘要员。从以下 markdown 文档中提取所有定性患者信息，\
用简洁的中文自然语言输出摘要，不需要 JSON 格式。
仅保留定性内容（姓名、性别、年龄、诊断、分期、主诉、现病史、既往史、家族史、个人史、合并症等），\
忽略详细定量数据（检验数字、影像测量值等）。

文件名: {file_name}

文档内容:
{content}
"""

# Step 3: final structured extraction from all combined summaries
EXTRACT_PROMPT = """\
你是医疗信息结构化抽取器。严格输出 JSON 对象，不要输出任何解释或多余文字。

以下是来自同一患者多份文档的定性信息摘要，请综合所有摘要提取患者信息，\
仅输出以下字段（无法确定的字段填 null）：

{{
  "name": "患者姓名（字符串）",
  "sex": "性别，只能是 '男' 或 '女' 或 null",
  "age": "年龄（整数）或 null",
  "primaryDiagnosis": "主要诊断（字符串）",
  "stage": "临床分期（字符串，如 'III期'）或 null",
  "chiefComplaint": "主诉（字符串）",
  "presentHistory": "现病史（字符串）",
  "pastHistory": "既往史（字符串）,
  "familyHistory": "家族史（字符串）或 null",
  "personalHistory": "个人史（字符串）或 null",
  "comorbidities": ["合并症列表，每项为字符串"]
}}

字段说明：
家族史：如父亲因肝癌去世，母亲健在
既往史：如吸烟史30年，每日1包；饮酒史25年"
合并症：高血压、糖尿病

综合摘要内容：
{combined_summaries}
"""


def apply_google_env() -> None:
	gcp_key_path = "/Users/andy/repos/NoahAgent/noah_agent/gcp_key.json"
	if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", ""):
		os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = gcp_key_path
	os.environ["GOOGLE_CLOUD_PROJECT"] = "noahai-440408"
	os.environ["GOOGLE_CLOUD_LOCATION"] = "global"
	os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "true"


class ExtractionPipeline:
	def __init__(self, model: str, max_concurrency: int = 10):
		self.model = model
		self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
		self.semaphore = asyncio.Semaphore(max_concurrency)

	async def _call(self, prompt: str) -> str:
		response = await self.client.aio.models.generate_content(
			model=self.model,
			contents=prompt,
			config={"temperature": 0},
		)
		return (response.text or "").strip()

	async def classify(self, file_name: str, content: str) -> bool:
		"""Step 1: returns True if file contains qualitative patient info."""
		result = await self._call(CLASSIFY_PROMPT.format(file_name=file_name, content=content[:16000]))
		return result.lower().startswith("true")

	async def summarize(self, file_name: str, content: str) -> str:
		"""Step 2: returns a free-form text summary of qualitative info."""
		return await self._call(SUMMARIZE_PROMPT.format(file_name=file_name, content=content[:24000]))

	async def process_file(self, file_path: Path) -> tuple[str, str | None]:
		"""Returns (file_name, summary_text_or_None)."""
		async with self.semaphore:
			content = file_path.read_text(encoding="utf-8", errors="ignore")
			has_qualitative = await self.classify(file_path.name, content)
			if not has_qualitative:
				print(f"  – {file_path.name} → skipped (no qualitative info)")
				return file_path.name, None
			summary = await self.summarize(file_path.name, content)
			print(f"  ✓ {file_path.name} → summarized")
			return file_path.name, summary

	async def extract(self, combined_summaries: str) -> dict[str, Any]:
		"""Step 3: structured extraction from all combined summaries."""
		prompt = EXTRACT_PROMPT.format(combined_summaries=combined_summaries)
		raw = await self._call(prompt)
		return parse_json_response(raw)


async def run(args: argparse.Namespace) -> dict[str, Any]:
	apply_google_env()
	md_dir = Path(MD_DIR)
	files = sorted(p for p in md_dir.glob("*.md") if p.is_file())
	if not files:
		raise FileNotFoundError(f"No markdown files found in: {md_dir}")

	pipeline = ExtractionPipeline(model=args.model)

	# Steps 1 & 2: classify and summarize all files concurrently
	print(f"Step 1+2: classifying and summarizing {len(files)} files...")
	file_results = await asyncio.gather(*[pipeline.process_file(fp) for fp in files])

	summaries: list[dict[str, str]] = []
	for file_name, summary in file_results:
		if summary is not None:
			summaries.append({"fileName": file_name, "summary": summary})

	print(f"  → {len(summaries)}/{len(files)} files contained qualitative info")

	if not summaries:
		raise ValueError("No qualitative content found in any file.")

	# Step 3: combine summaries and extract structured data in one call
	combined = "\n\n".join(
		f"【来源文件: {s['fileName']}】\n{s['summary']}" for s in summaries
	)
	print("Step 3: extracting structured patient record from combined summaries...")
	patient_data = await pipeline.extract(combined)

	return {
		"model": args.model,
		"filesProcessed": len(files),
		"filesWithQualitativeInfo": len(summaries),
		"summaries": summaries,
		"patientData": patient_data,
	}


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(description="Extract patient fields from markdown files")
	parser.add_argument("--output", default="output/gemini-extraction-basic.json", help="Output JSON path")
	parser.add_argument("--model", default=DEFAULT_MODEL, help="Gemini model name")
	return parser.parse_args()


def _write_bundle_js(bundle: dict, output_path: Path) -> None:
	"""Write a js/bundle-basic.js sibling so index.html works without a server."""
	js_dir = Path(__file__).parent / "js"
	js_dir.mkdir(exist_ok=True)
	js_path = js_dir / "bundle-basic.js"
	header = (
		"// Auto-generated from output/gemini-extraction-basic.json – do not edit by hand.\n"
		"// Re-run gemini-data-extraction-basic.py to refresh.\n"
	)
	body = json.dumps(bundle, ensure_ascii=False, indent=2)
	js_path.write_text(header + "const BUNDLE_BASIC = " + body + ";\n", encoding="utf-8")
	print(f"✅ Wrote {js_path}  ({js_path.stat().st_size:,} bytes)")


def main() -> None:
	args = parse_args()
	result = asyncio.run(run(args))
	output_path = Path(args.output)
	save_json(output_path, result)
	print(f"✅ Done. Wrote result to: {output_path}")
	_write_bundle_js(result, output_path)


if __name__ == "__main__":
	main()

