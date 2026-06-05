# 🌿 Ginkgo Clinical Case Simulator

Welcome to the **Ginkgo Clinical Case Simulator**, an organic botanical-styled Objective Structured Clinical Examination (OSCE) virtual training platform. This application allows medical students to engage in simulated patient encounters—taking comprehensive clinical histories, performing targeted organ system examinations, managing cost-effective diagnostic-laboratory workups, and documenting findings in standardized SOAP format for automated evaluation by simulated AI Attending Physicians.

---

## 🏗️ Technical Architecture & Workflow

1. **Simulated Roleplay Engine**: The student converses directly with a simulated patient. Conversational exchanges are backed by the Google Gemini API, which roleplays based on the hidden clinical persona (`aiBackground`).
2. **Interactive Clinical Workstation**:
   - **History Taking**: Structured real-time natural language dialogue.
   - **Physical Exam**: Perform targeted systems-level checks (General, Cardiac, Pulmonary, Abdominal, Neurological) to unearth clinical findings.
   - **Labs & Diagnostics**: Order essential labs (e.g., ECG, Troponins, CT scan, D-Dimer, Pregnancy) with live billing calculations to train providers on cost awareness.
3. **SOAP Note Submission**: The student records their formal clinical findings—Subjective (S), Objective (O), Assessment (A), and Plan (P)—alongside differential diagnosis weights summing to 100%.
4. **AI Attending appraisal**: The final SOAP notebook is programmatically audited by a simulated Attending Physician via the Gemini core, grading students on history proficiency, physical accuracy, logical diagnostics, and correct primary diagnosis.

---

## 📋 Schema Definition (`PatientCase`)

All interactive patient simulations are structured dynamically in standard TypeScript. The interface is defined as follows inside `src/cases.ts`:

```typescript
export interface PatientCase {
  id: string;               // Unique alphanumeric identifier (e.g., 'case_cardiology_stemi')
  name: string;             // Human patient name used in patient dialogues
  age: number;              // Age of patient (for clinical reasoning constraints)
  gender: string;           // Biological/demographic gender
  chiefComplaint: string;   // Single-sentence chief complaint (quotes) in the patient's voice
  presentationText: string; // Background introduction displayed at the Clinical Desk
  vitals: {
    bloodPressure: string;  // e.g. "120/80 mmHg"
    heartRate: number;      // Beats per minute (BPM)
    respiratoryRate: number;// Breaths per minute
    temperatureF: number;   // Temperature in Fahrenheit
    o2Sat: string;          // e.g. "97% on room air"
  };
  physicalExams: {
    [key: string]: {
      label: string;        // System evaluated (e.g., "Cardiovascular System")
      findings: string;     // Automated findings revealed on click
    };
  };
  labsAndDiagnostics: {
    [key: string]: {
      label: string;        // Name of diagnostic protocol ordered
      cost: number;         // Dollar cost to register running charge
      result: string;       // Clinical outcome text of order
      comments?: string;    // Educator annotations/clinical reasoning backup
    };
  };
  aiBackground: {
    personality: string;    // Directing voice, tone, anxiety levels, physical symptoms during roleplay
    detailedHpi: string;    // History of Present Illness details (OPQRST elements)
    medicalHistory: string; // Patient chronic conditions, surgeries
    socialHistory: string;  // Substance use, occupational background, active habits
    familyHistory: string;  // Heritable risk backgrounds
    medications: string;    // Active drug listings and patient compliance
    allergies: string;      // Allergic drug or non-drug responses
    nonDisclosedSecrets: string; // Vital clues NOT confessed unless explicitly/pointedly requested
  };
  correctDiagnosis: string; // Target primary diagnosis matching the final golden key
}
```

---

## 🚀 How to Add a New Clinical Case

To expand Ginkgo's list of clinical cases:

1. Open `src/cases.ts`.
2. Scroll to the bottom of the `CLINICAL_CASES` array.
3. Fill out the template below with your clinical scenario.
4. Paste the case object directly into the array.
5. Save the file. The hot development environment will instantly display your new case under the **Interactive Clinical OSCE Desk**.

---

## 📝 Case Template (Copy & Paste)

You can use the template below as a starting point to author a new case structure:

```typescript
  {
    id: "case_specialty_shortname",
    name: "Patient Full Name",
    age: 45,
    gender: "Male / Female / Other",
    chiefComplaint: "A quote of the patient describing what hurts or why they are at the clinic.",
    presentationText: "A paragraph introducing the patient's general appearance, dress, and immediate situation.",
    vitals: {
      bloodPressure: "130/85 mmHg",
      heartRate: 78,
      respiratoryRate: 16,
      temperatureF: 98.6,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Describe what the provider sees (e.g., breathing status, distress level, alert and cooperative status)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Detail heart rate, rhythm, specific heart sounds (S1, S2, murmurs, gallops, rubs), and peripheral pulses."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Detail breath sounds, crackles, wheezes, tactile indicators, asymmetry, or clear status."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Detail abdominal contour, tenderness, localized rebound, guarding, organomegaly, or normal active bowel sounds."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Detail orientation, cranial nerves, sensation, symmetric motor strength, cerebellar tests, or mental status indicators."
      }
    },
    labsAndDiagnostics: {
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes 7.2 x10^3/uL, Hb 14.1 g/dL, Platelets 220 x10^3/uL (All within reference limits).",
        comments: "Rules out acute leukocytosis or thrombocytopenic factors."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 140 mEq/L, Potassium: 4.2 mEq/L, Glucose: 98 mg/dL, Creatinine: 0.8 mg/dL.",
        comments: "Confirms normal electrolyte balance and baseline renal function."
      },
      imaging_placeholder: {
        label: "Specific Imaging or Diagnostic Procedure Name (e.g. Ultrasound / CT / ECG)",
        cost: 350,
        result: "Provide clear diagnostics for the root pathology.",
        comments: "Indicate whether this test holds premium clinical value, or if it represents an unnecessary billing weight."
      }
    },
    aiBackground: {
      personality: "Give conversational instructions. E.g. 'Cooperative but visibly tired. Answers questions clearly but remains reserved about personal topics.'",
      detailedHpi: "Detail dates, timing, triggers, quality, radiation, and aggravating or alleviating indicators of their chief complaint.",
      medicalHistory: "Provide previous diagnoses, surgical history, hospitalizations, or child-bearing status.",
      socialHistory: "Provide details on employment, smoking status, alcohol use, drug use, housing, or stress factors.",
      familyHistory: "Detail relevant chronic illness or genetic predispositions in first-degree relatives.",
      medications: "List current prescription and non-prescription meds, plus compliance status.",
      allergies: "List severe or mild allergies (NKDA if none) with corresponding biological reactions.",
      nonDisclosedSecrets: "Vital hidden details of the history that the simulated patient WILL NOT disclose unless asked with high clinical precision (e.g., 'Do you use recreational substances?', 'Have you had this mild symptom before?')."
    },
    correctDiagnosis: "Target Clinical Diagnosis Name (Must be matching the primary target medical diagnosis)"
  }
```

---

## 🧠 Best Practices for Clinical Case Design

* **Vague to Specific HPI**: Keep the `chiefComplaint` conversational and loose, but provide all parameters for OPQRST (Onset, Provocation, Quality, Radiation, Severity, Time) inside the `detailedHpi` to reward comprehensive history-takers.
* **Cost vs. Value in Labs**: Balance the `labsAndDiagnostics` parameters so that some cheaper tests are highly suggestive of the diagnosis (rewarding high-efficacy triage), or certain gold standards are expensive but diagnostic (rewarding safety), and some high-cost scans are completely unnecessary (penalizing redundant ordering).
* **Organized Under Specialties**: Keep names and backgrounds consistent with the medical category (Cardiology, Neurology, Pulmonology, Gastroenterology, Endocrinology, etc.).
