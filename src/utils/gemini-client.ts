import { PatientCase } from "../cases.ts";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: {
    diagnosis: string;
    reasoning: string;
    differentials: {
      diagnosis: string;
      probability: number;
      reasoning: string;
    }[];
  };
  plan: string;
}

export async function askPatientClientSide(
  patientCase: PatientCase,
  history: ChatMessage[],
  newQuestion: string,
  credentials: { apiKey?: string; accessToken?: string }
): Promise<string> {
  const systemInstruction = `
You are roleplaying as a real medical patient in an Objective Structured Clinical Examination (OSCE) for medical students.
Your identity and clinical scenario are as follows:
- Name: ${patientCase.name}
- Age: ${patientCase.age}
- Gender: ${patientCase.gender}
- Chief Complaint: "${patientCase.chiefComplaint}"
- Overall Presentation: ${patientCase.presentationText}
- Vitals: BP ${patientCase.vitals.bloodPressure}, HR ${patientCase.vitals.heartRate} bpm, RR ${patientCase.vitals.respiratoryRate}, Temp ${patientCase.vitals.temperatureF}F, O2 ${patientCase.vitals.o2Sat}

Your BACKGROUND DETAILS (use this to answer questions):
- Personality & Affect: ${patientCase.aiBackground.personality}
- History of Present Illness (HPI): ${patientCase.aiBackground.detailedHpi}
- Medical History: ${patientCase.aiBackground.medicalHistory}
- Social History: ${patientCase.aiBackground.socialHistory}
- Family History: ${patientCase.aiBackground.familyHistory}
- Current Medications: ${patientCase.aiBackground.medications}
- Allergies: ${patientCase.aiBackground.allergies}
- Non-Disclosed Secrets (Only reveal if the user asks directly about them! Do NOT initiate or volunteer this details at first): ${patientCase.aiBackground.nonDisclosedSecrets}

INSTRUCTIONS FOR ROLEPLAY:
1. Stay in character 100%. Speak in the first person ("I", "my").
2. Align your emotional tone with your personality. If you are anxious or have crushing chest pain, sound breathless, stressed, pause often, or express fear as appropriate.
3. Keep answers concise and realistic—usually 1 to 4 sentences maximum. Real patients do not dump a block of textbook medical histories in one single breath. They answer exactly what they are asked!
4. Avoid any advanced clinical or medical jargon that a layperson wouldn't know. Say "heart attack" instead of "myocardial infarction", "high blood pressure" instead of "hypertension", and "kidney stones" instead of "nephrolithiasis".
5. If the user asks about physical exams, say: "I'm not sure, doctor, you'd need to examine my chest/stomach directly or look at the terminal computer to check those clinical findings."
6. If the student repeats questions, express subtle confusion or fatigue, as a tiring patient would.
`;

  const contents = [];
  for (const msg of history) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    });
  }
  contents.push({
    role: "user",
    parts: [{ text: newQuestion }]
  });

  const body = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.7
    }
  };

  return callGeminiAPI("gemini-3.5-flash", body, credentials);
}

export async function evaluateSoapNoteClientSide(
  patientCase: PatientCase,
  conversationHistory: ChatMessage[],
  examsPerformed: string[],
  labsOrdered: string[],
  soapNote: SOAPNote,
  credentials: { apiKey?: string; accessToken?: string }
): Promise<any> {
  const prompt = `
Evaluate the clinical performance of a medical student who just completed an OSCE patient encounter and submitted a clinical SOAP note.

PATIENT CASE PROFILE:
- Patient Name: ${patientCase.name} (${patientCase.gender}, ${patientCase.age})
- Chief Complaint: ${patientCase.chiefComplaint}
- True Underlying Diagnosis: ${patientCase.correctDiagnosis}

STUDENT INTERACTION DATA:
1. Dialog History (History Taking):
${JSON.stringify(conversationHistory, null, 2)}

2. Physical Exams Performed:
${JSON.stringify(examsPerformed, null, 2)}

3. Diagnostic Tests / Labs Ordered:
${JSON.stringify(labsOrdered, null, 2)}

4. SOAP Note Submitted by Student:
- Subjective Portion: "${soapNote.subjective}"
- Objective Portion: "${soapNote.objective}"
- Assessment (Differential Diagnosis details and weights):
${JSON.stringify(soapNote.assessment, null, 2)}
- Plan Portion: "${soapNote.plan}"

INSTRUCTIONS FOR ASSESSMENT EVALUATION:
- Assess the diagnosis correctness: Did the student list the true underlying diagnosis ("${patientCase.correctDiagnosis}") with high probability?
- Assess History Taking: Did the student ask about HPI symptoms, medical history, medications, lifestyle, and uncover important clues like non-disclosed secrets?
- Assess Physical Exams: Did they perform the key indicated physical exams (e.g., listening to heart/lungs for chest pain, belly palpation for appendicitis, or checking pupil/neck stiffness for thunderclap headache)? Did they order unnecessary exams?
- Assess Labs & Imaging: Evaluate cost-efficiency. Every test ordered has a cost. For example, did they order unnecessary head CT scans or cardiac tests for appendicitis? Did they order critical diagnostic tests (like ECG/Troponins for chest pain, Head CT for thunderclap headache, CTPA for shortness of breath, Abdominal Ultrasound for lower belly pain)?
- Assess SOAP Documentation quality: Is the description professional? Are objective measurements correct? Is the plan physiologically sound and compliant with standard clinical guidelines (e.g., immediate cath lab activation or aspirin for STEMI; surgery consult and NPO for appendicitis; heparin and CTA for PE; emergency CT and neurosurgery for SAH)?

Format your entire evaluation response strictly as a JSON object matching the requested Schema.
`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          overallGrade: {
            type: "STRING",
            description: "Final alphabetical grade, e.g. A, A-, B+, B, C, D, or F."
          },
          overallSummary: {
            type: "STRING",
            description: "A professional constructive summary statement of their strengths, diagnostic insight, and overall OSCE score performance."
          },
          diagnosisAccuracy: {
            type: "OBJECT",
            properties: {
              score: { type: "INTEGER", description: "Numerical percentage from 0 to 100." },
              correctDiagnosis: { type: "STRING", description: "The true correct diagnosis that should have been formulated." },
              feedback: { type: "STRING", description: "Feedback on their primary diagnosis choice and differentials." }
            },
            required: ["score", "correctDiagnosis", "feedback"]
          },
          historyTaking: {
            type: "OBJECT",
            properties: {
              grade: { type: "STRING" },
              score: { type: "INTEGER", description: "Percentage score 0 to 100." },
              strengths: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "List of history questions they did well or uncovered key patient clues."
              },
              missedOpportunityQuestions: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Specific details the student failed to ask or missed asking (e.g. forgot social history, travel history, or allergies)."
              },
              feedback: { type: "STRING", description: "Direct developmental feedback on patient rapport, depth of inquiry, and style." }
            },
            required: ["grade", "score", "strengths", "missedOpportunityQuestions", "feedback"]
          },
          physicalExamChoices: {
            type: "OBJECT",
            properties: {
              grade: { type: "STRING" },
              score: { type: "INTEGER" },
              feedback: { type: "STRING", description: "Critique of exams they ran or missed. For instance, did they palpate McBurney's point? Did they check pupils or Brudzinski's sign?" }
            },
            required: ["grade", "score", "feedback"]
          },
          diagnosticOrdering: {
            type: "OBJECT",
            properties: {
              grade: { type: "STRING" },
              score: { type: "INTEGER" },
              totalCost: { type: "INTEGER", description: "The literal total USD cost of tests ordered." },
              costEfficiencyFeedback: { type: "STRING", description: "Critique of whether they ordered excessive, expensive, or gold-standard indicated tests." },
              optimalTests: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "The ideal essential baseline diagnostics they ordered."
              },
              redundantTests: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Redundant, expensive, or secondary diagnostics they ordered that were unnecessary for initial triage."
              }
            },
            required: ["grade", "score", "totalCost", "costEfficiencyFeedback", "optimalTests", "redundantTests"]
          },
          soapDocumentation: {
            type: "OBJECT",
            properties: {
              grade: { type: "STRING" },
              score: { type: "INTEGER" },
              subjectiveFeedback: { type: "STRING", description: "Assessment of Subjective documentation." },
              objectiveFeedback: { type: "STRING", description: "Assessment of Objective documentation (checking labs and exams)." },
              assessmentFeedback: { type: "STRING", description: "Assessment of diagnostic logic and differential layout." },
              planFeedback: { type: "STRING", description: "Assessment of treatment plan viability, medication dosages, or next monitoring steps." }
            },
            required: ["grade", "score", "subjectiveFeedback", "objectiveFeedback", "assessmentFeedback", "planFeedback"]
          }
        },
        required: [
          "overallGrade",
          "overallSummary",
          "diagnosisAccuracy",
          "historyTaking",
          "physicalExamChoices",
          "diagnosticOrdering",
          "soapDocumentation"
        ]
      }
    }
  };

  const responseJsonString = await callGeminiAPI("gemini-3.5-flash", body, credentials);
  return JSON.parse(responseJsonString);
}

async function callGeminiAPI(
  model: string,
  body: any,
  credentials: { apiKey?: string; accessToken?: string }
): Promise<string> {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (credentials.apiKey) {
    url += `?key=${credentials.apiKey}`;
  } else if (credentials.accessToken) {
    headers["Authorization"] = `Bearer ${credentials.accessToken}`;
  } else {
    throw new Error("No Gemini API key or Google Pro access token provided for client-side evaluation.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP ${response.status} from Gemini API`;
    throw new Error(`Gemini API Error: ${message}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response from Gemini API.");
  }

  return text;
}
