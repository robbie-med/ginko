import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import { CLINICAL_CASES } from "./cases.ts";

export const apiRouter = express.Router();
apiRouter.use(express.json());

// Keep API initialization lazy so we don't crash on boot if the key is missing.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing. Please enter it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. POST /api/cases/respond: Roleplay as the patient in the dialogue
apiRouter.post("/cases/respond", async (req, res) => {
  try {
    const { caseId, history, newQuestion } = req.body;
    
    if (!caseId || !newQuestion) {
      res.status(400).json({ error: "Missing required parameters: caseId or newQuestion." });
      return;
    }

    const patientCase = CLINICAL_CASES.find((c) => c.id === caseId);
    if (!patientCase) {
      res.status(404).json({ error: "Patient case not found." });
      return;
    }

    // Roleplay system instructions
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

    const ai = getGeminiClient();
    
    // Map history to Google GenAI format (user and model)
    const contents = [];
    if (Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === "user" || msg.role === "assistant") {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          });
        }
      }
    }
    // Append the last message
    contents.push({
      role: "user",
      parts: [{ text: newQuestion }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "I am feeling too unwell to answer, doctor.";
    res.json({ response: text });
  } catch (error: any) {
    console.error("Error in /cases/respond:", error);
    res.status(500).json({ error: error?.message || "An unexpected error occurred." });
  }
});

// 2. POST /api/cases/evaluate: Evaluates SOAP Note and Clinical Performance
apiRouter.post("/cases/evaluate", async (req, res) => {
  try {
    const { caseId, conversationHistory, examsPerformed, labsOrdered, soapNote } = req.body;

    if (!caseId || !soapNote) {
      res.status(400).json({ error: "Missing required parameters: caseId or soapNote." });
      return;
    }

    const patientCase = CLINICAL_CASES.find((c) => c.id === caseId);
    if (!patientCase) {
      res.status(404).json({ error: "Patient case not found." });
      return;
    }

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

Format your entire evaluation response strictly as a JSON object matching the provided Schema.
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallGrade: {
              type: Type.STRING,
              description: "Final alphabetical grade, e.g. A, A-, B+, B, C, D, or F.",
            },
            overallSummary: {
              type: Type.STRING,
              description: "A professional constructive summary statement of their strengths, diagnostic insight, and overall OSCE score performance.",
            },
            diagnosisAccuracy: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER, description: "Numerical percentage from 0 to 100." },
                correctDiagnosis: { type: Type.STRING, description: "The true correct diagnosis that should have been formulated." },
                feedback: { type: Type.STRING, description: "Feedback on their primary diagnosis choice and differentials." },
              },
              required: ["score", "correctDiagnosis", "feedback"],
            },
            historyTaking: {
              type: Type.OBJECT,
              properties: {
                grade: { type: Type.STRING },
                score: { type: Type.INTEGER, description: "Percentage score 0 to 100." },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of history questions they did well or uncovered key patient clues.",
                },
                missedOpportunityQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Specific details the student failed to ask or missed asking (e.g. forgot social history, travel history, or allergies).",
                },
                feedback: { type: Type.STRING, description: "Direct developmental feedback on patient rapport, depth of inquiry, and style." },
              },
              required: ["grade", "score", "strengths", "missedOpportunityQuestions", "feedback"],
            },
            physicalExamChoices: {
              type: Type.OBJECT,
              properties: {
                grade: { type: Type.STRING },
                score: { type: Type.INTEGER },
                feedback: { type: Type.STRING, description: "Critique of exams they ran or missed. For instance, did they palpate McBurney's point? Did they check pupils or Brudzinski's sign?" },
              },
              required: ["grade", "score", "feedback"],
            },
            diagnosticOrdering: {
              type: Type.OBJECT,
              properties: {
                grade: { type: Type.STRING },
                score: { type: Type.INTEGER },
                totalCost: { type: Type.INTEGER, description: "The literal total USD cost of tests ordered." },
                costEfficiencyFeedback: { type: Type.STRING, description: "Critique of whether they ordered excessive, expensive, or gold-standard indicated tests." },
                optimalTests: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "The ideal essential baseline diagnostics they ordered.",
                },
                redundantTests: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Redundant, expensive, or secondary diagnostics they ordered that were unnecessary for initial triage.",
                },
              },
              required: ["grade", "score", "totalCost", "costEfficiencyFeedback", "optimalTests", "redundantTests"],
            },
            soapDocumentation: {
              type: Type.OBJECT,
              properties: {
                grade: { type: Type.STRING },
                score: { type: Type.INTEGER },
                subjectiveFeedback: { type: Type.STRING, description: "Assessment of Subjective documentation." },
                objectiveFeedback: { type: Type.STRING, description: "Assessment of Objective documentation (checking labs and exams)." },
                assessmentFeedback: { type: Type.STRING, description: "Assessment of diagnostic logic and differential layout." },
                planFeedback: { type: Type.STRING, description: "Assessment of treatment plan viability, medication dosages, or next monitoring steps." },
              },
              required: ["grade", "score", "subjectiveFeedback", "objectiveFeedback", "assessmentFeedback", "planFeedback"],
            },
          },
          required: [
            "overallGrade",
            "overallSummary",
            "diagnosisAccuracy",
            "historyTaking",
            "physicalExamChoices",
            "diagnosticOrdering",
            "soapDocumentation",
          ],
        },
      },
    });

    const reportText = response.text || "{}";
    res.json(JSON.parse(reportText));
  } catch (error: any) {
    console.error("Error in /cases/evaluate:", error);
    res.status(500).json({ error: error?.message || "An unexpected error occurred." });
  }
});
