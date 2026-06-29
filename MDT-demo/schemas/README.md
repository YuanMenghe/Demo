# Extraction Data Schemas (智汇MDT)

This folder defines the target contracts for document parsing and patient information extraction.

## Files

- `extraction-result.schema.json`
  - Top-level extraction output envelope.
  - Includes pipeline metadata, source documents, canonical patient record, optional UI projection, provenance, and quality report.

- `patient-canonical.schema.json`
  - Canonical medical record model for downstream storage/search/audit.
  - Separates patient demographics, clinical summary, timeline, observations, procedures, medications, and document refs.

- `patient-ui.schema.json`
  - UI view model compatible with current frontend usage (`mockPatients` shape).
  - Designed to be the payload consumed by `renderPatients`, `renderDashboard`, and `renderDetailPage`.

- `document-classification.schema.json`
  - Pre-extraction document classification and routing contract.
  - Defines category enum, confidence, and target schema paths for prompt routing.

- `prompt-templates/category-routing.map.json`
  - Machine-readable category -> prompt template -> target paths mapping.

- `prompt-templates/category-prompt-pack.md`
  - Reusable base prompt + per-category extraction template pack.

- `examples/extraction-result.example.json`
  - Minimal valid example payload for testing parser output and validator wiring.

## Recommended pipeline contract

1. OCR + NLP + de-identification
2. Classify each uploaded document (validate with `document-classification.schema.json`)
3. Route to category-specific prompt (`prompt-templates/category-routing.map.json`)
4. Extract partial fragments by category and merge into `patientRecord`
5. Build `fieldProvenance` and `quality`
6. Project canonical to `uiProjection` (UI schema)
7. Validate:
   - full payload against `extraction-result.schema.json`
   - `uiProjection` against `patient-ui.schema.json` before rendering

## Document classification categories

- `identity_admin`
- `admission_discharge`
- `history_physical`
- `diagnosis_staging`
- `pathology_molecular`
- `imaging_report`
- `laboratory_report`
- `procedure_surgery`
- `medication_therapy`
- `mdt_record`
- `followup_outcome`
- `other_nonclinical`

Use `primaryCategory` + optional `secondaryCategories` (max 2) for mixed documents.

## Canonical -> UI field mapping

| Canonical path | UI path | Mapping rule |
|---|---|---|
| `/patient/patientId` | `id` | Use canonical patient ID; if absent generate temporary ID |
| `/patient/name` | `name` | Direct |
| `/patient/sex` | `gender` | Direct (display value) |
| `/patient/age` | `age` | Direct |
| `/clinicalSummary/primaryDiagnosis/display` | `disease` | Direct |
| `/clinicalSummary/stage/stageGroup` | `stage` | Optional |
| `/clinicalSummary/comorbidities[].display` | `complications[]` | Flatten to string list |
| `/clinicalSummary/treatmentStatus` | `treatment` | Direct |
| (routing strategy) | `group` | Set by disease routing rule or empty string |
| `/timeline[].date/title/hospital/type/description` | `timeline[].date/title/hospital/type/desc` | Rename `description -> desc` |
| `/observations[]` grouped by code | `indicators.{code}[]` | Build date-value series (`date`, `value`) |
| `/clinicalSummary/chiefComplaint` | `basicInfo.chiefComplaint` | Direct |
| `/clinicalSummary/presentHistory` | `basicInfo.presentHistory` | Direct |
| `/clinicalSummary/pastHistory` | `basicInfo.pastHistory` | Direct |
| `/clinicalSummary/familyHistory` | `basicInfo.familyHistory` | Direct |
| `/clinicalSummary/personalHistory` | `basicInfo.personalHistory` | Direct |
| extraction timestamp | `lastUpdate` | Format as `YYYY-MM-DD HH:mm` |

## Minimum UI render-safe fields

The frontend can render reliably when these are present:

- `id`, `name`, `gender`, `age`
- `disease`, `treatment`, `group`, `lastUpdate`
- `timeline` (>=1 event)
- `indicators` (can be empty object if no labs yet)
- `basicInfo` with 5 text fields

## Quality and safety notes

- Keep `fieldProvenance` for every critical field (`name`, `disease`, `stage`, `chiefComplaint`, key labs).
- Use `quality.validationStatus = fail` when critical fields are missing or conflicting.
- De-identification should run before persistence/export; keep original snippets in controlled storage only.
