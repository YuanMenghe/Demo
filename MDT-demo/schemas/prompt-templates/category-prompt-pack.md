# Category Prompt Pack (v1.0.0)

This pack provides reusable prompt templates for extracting document-specific fragments into:

- `patient-canonical.schema.json`
- `patient-ui.schema.json`
- `extraction-result.schema.json` (envelope sections such as `fieldProvenance`, `quality`, `issues`)

Use together with:

- `document-classification.schema.json`
- `category-routing.map.json`

---

## 1) Shared system prompt (all categories)

```text
You are a medical document extraction engine for Chinese clinical documents.
Return exactly one JSON object, no markdown and no extra text.

Rules:
1) Extract only facts explicitly supported by source text; do not infer missing values.
2) If a field is unknown, omit it from partial payload instead of guessing.
3) Normalize dates to YYYY-MM-DD when day is known.
4) Use canonical enums exactly as required by target schemas.
5) Every critical extracted field must include provenance with confidence in [0,1].
6) Put ambiguities/conflicts into issues; do not silently choose if conflict is unresolved.
7) Output must follow the response contract exactly.
```

## 2) Shared user prompt shell

```text
Task:
Extract from one uploaded document using category template: {{promptTemplateId}}.

Document metadata:
{{document_metadata_json}}

Classification result:
{{classification_json}}

OCR/plain text:
{{document_text}}

Response contract:
{
  "documentId": "string",
  "category": "one category enum",
  "targetPaths": ["json-pointer", "..."],
  "payload": {
    "sourceDocuments": [ ...optional SourceDocument items... ],
    "patientRecord": { ...optional canonical fragments... },
    "uiProjection": { ...optional UI fragments... },
    "fieldProvenance": [ ...optional provenance items... ],
    "quality": {
      "overallConfidence": 0.0,
      "completenessScore": 0.0,
      "validationStatus": "pass|warn|fail",
      "missingCriticalFields": ["..."],
      "conflicts": [ ... ],
      "notes": "..."
    },
    "issues": [ ...optional extraction issues... ]
  }
}

Only include fragments listed in targetPaths.
```

## 3) Category-specific templates

### cat.identity_admin.1.0.0

```text
Category: identity_admin
targetPaths:
- /sourceDocuments
- /patientRecord/patient
- /patientRecord/documents
- /fieldProvenance
- /issues

Extract:
- patient demographics and identifiers: patientId, mrn, name, sex, age, dateOfBirth
- identifiers[] and contacts[] when explicitly present
- address and source document metadata

Do NOT extract diagnosis, timeline, observations, procedures, medications unless explicitly administrative metadata is tied to them.
```

### cat.admission_discharge.1.0.0

```text
Category: admission_discharge
targetPaths:
- /patientRecord/clinicalSummary
- /patientRecord/timeline
- /fieldProvenance
- /issues

Extract:
- chiefComplaint, presentHistory (if present), treatmentStatus
- admission/discharge events into timeline with date/title/hospital/type=admission|followup|other
- diagnosis statements only if explicitly documented in this note
```

### cat.history_physical.1.0.0

```text
Category: history_physical
targetPaths:
- /patientRecord/clinicalSummary
- /uiProjection/basicInfo
- /fieldProvenance
- /issues

Extract:
- chiefComplaint, presentHistory, pastHistory, familyHistory, personalHistory
- comorbidities with display and status when supported

UI mapping:
- Also project history text fields into uiProjection.basicInfo.
```

### cat.diagnosis_staging.1.0.0

```text
Category: diagnosis_staging
targetPaths:
- /patientRecord/clinicalSummary
- /patientRecord/timeline
- /uiProjection
- /fieldProvenance
- /issues

Extract:
- primaryDiagnosis and secondaryDiagnoses
- stageGroup and TNM (t/n/m/version/assessmentDate)
- diagnosis-confirmed dates and treatmentStatus
- diagnosis/evaluation timeline events

UI projection:
- set disease/stage/treatment if directly available from extracted canonical fields.
```

### cat.pathology_molecular.1.0.0

```text
Category: pathology_molecular
targetPaths:
- /patientRecord/clinicalSummary
- /patientRecord/observations
- /patientRecord/timeline
- /fieldProvenance
- /issues

Extract:
- pathology confirmation cues for diagnosis (e.g., pathologyConfirmed)
- pathology/molecular findings as observations (category=pathology)
- biopsy/pathology report date as timeline event (type=examination|diagnosis)

Use valueText for qualitative findings and valueNumber only when numeric value exists.
```

### cat.imaging_report.1.0.0

```text
Category: imaging_report
targetPaths:
- /patientRecord/observations
- /patientRecord/timeline
- /fieldProvenance
- /issues

Extract:
- imaging findings into observations (category=imaging)
- effectiveDate from report/exam date
- timeline event type=imaging with concise description

Prefer one observation per major finding or measured metric.
```

### cat.laboratory_report.1.0.0

```text
Category: laboratory_report
targetPaths:
- /patientRecord/observations
- /patientRecord/timeline
- /uiProjection/indicators
- /fieldProvenance
- /issues

Extract:
- structured lab results as observations (category=lab)
- code/display/valueNumber or valueText/unit/referenceRange/abnormalFlag/effectiveDate
- key tumor markers to uiProjection.indicators.{code}[] as {date,value}

If unit is missing, keep value but add warning issue.
```

### cat.procedure_surgery.1.0.0

```text
Category: procedure_surgery
targetPaths:
- /patientRecord/procedures
- /patientRecord/timeline
- /fieldProvenance
- /issues

Extract:
- procedure name, date, type, hospital, outcome
- surgery/intervention/biopsy events into timeline linked by date/title

Do not output medication arrays in this category.
```

### cat.medication_therapy.1.0.0

```text
Category: medication_therapy
targetPaths:
- /patientRecord/medications
- /patientRecord/timeline
- /patientRecord/clinicalSummary
- /uiProjection
- /fieldProvenance
- /issues

Extract:
- medication regimen (name, dose, route, frequency, startDate, endDate, status)
- therapy timeline events (type=treatment)
- treatmentStatus if explicitly documented

UI projection:
- set uiProjection.treatment when reliable from treatmentStatus.
```

### cat.mdt_record.1.0.0

```text
Category: mdt_record
targetPaths:
- /patientRecord/clinicalSummary
- /patientRecord/timeline
- /fieldProvenance
- /issues

Extract:
- clinicalSummary.mdtPurpose
- clinicalSummary.mdtRecommendation
- MDT meeting timeline event (type=mdt) with date/title/hospital/description
```

### cat.followup_outcome.1.0.0

```text
Category: followup_outcome
targetPaths:
- /patientRecord/timeline
- /patientRecord/clinicalSummary
- /patientRecord/observations
- /uiProjection/timeline
- /fieldProvenance
- /issues

Extract:
- follow-up, relapse, progression, evaluation events
- status updates into treatmentStatus when explicit
- new outcome observations (lab/imaging/pathology) if included in follow-up report

UI mapping:
- project extracted timeline items to uiProjection.timeline using desc field.
```

### cat.other_nonclinical.1.0.0

```text
Category: other_nonclinical
targetPaths:
- /sourceDocuments
- /quality
- /issues

Extraction mode: metadata_only

Extract:
- only source document metadata
- quality note that the document is non-clinical or not extractable
- warning issue with code NON_CLINICAL_OR_UNSUPPORTED

Do not emit patientRecord or uiProjection data.
```

---

## 4) Suggested pipeline usage

1. Run document classification and validate against `document-classification.schema.json`.
2. Load category config from `category-routing.map.json` to resolve `promptTemplateId` + `targetPaths`.
3. Execute shared system prompt + shared shell + category template.
4. Validate extracted fragments against relevant schema sections.
5. Merge fragments into final extraction envelope, then run full validation on `extraction-result.schema.json`.
