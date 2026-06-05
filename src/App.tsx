import { useState, useEffect, FormEvent } from "react";
import {
  Stethoscope,
  Activity,
  User,
  Heart,
  DollarSign,
  ClipboardCheck,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  Send,
  Loader2,
  Flame,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Info,
  Settings,
  Key,
  Globe,
  LogOut,
  Check,
  Sprout,
  Leaf
} from "lucide-react";
import { CLINICAL_CASES, PatientCase } from "./cases.ts";
import { askPatientClientSide, evaluateSoapNoteClientSide } from "./utils/gemini-client.ts";

interface Differential {
  id: string;
  diagnosis: string;
  probability: number;
  reasoning: string;
}

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: {
    diagnosis: string;
    reasoning: string;
    differentials: Differential[];
  };
  plan: string;
}

interface EvaluationReport {
  overallGrade: string;
  overallSummary: string;
  diagnosisAccuracy: {
    score: number;
    correctDiagnosis: string;
    feedback: string;
  };
  historyTaking: {
    grade: string;
    score: number;
    strengths: string[];
    missedOpportunityQuestions: string[];
    feedback: string;
  };
  physicalExamChoices: {
    grade: string;
    score: number;
    feedback: string;
  };
  diagnosticOrdering: {
    grade: string;
    score: number;
    totalCost: number;
    costEfficiencyFeedback: string;
    optimalTests: string[];
    redundantTests: string[];
  };
  soapDocumentation: {
    grade: string;
    score: number;
    subjectiveFeedback: string;
    objectiveFeedback: string;
    assessmentFeedback: string;
    planFeedback: string;
  };
}

export default function App() {
  const [activeCase, setActiveCase] = useState<PatientCase | null>(null);
  const [currentTab, setCurrentTab] = useState<"history" | "exam" | "labs">("history");
  
  // History Taking / Chat state
  const [dialogHistory, setDialogHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isPatientResponding, setIsPatientResponding] = useState(false);
  
  // Physical Exam and Labs states
  const [examsPerformed, setExamsPerformed] = useState<string[]>([]);
  const [labsOrdered, setLabsOrdered] = useState<string[]>([]);
  
  // SOAP Note state
  const [soapNote, setSoapNote] = useState<SOAPNote>({
    subjective: "",
    objective: "",
    assessment: {
      diagnosis: "",
      reasoning: "",
      differentials: [
        { id: "1", diagnosis: "", probability: 50, reasoning: "" },
        { id: "2", diagnosis: "", probability: 30, reasoning: "" },
        { id: "3", diagnosis: "", probability: 20, reasoning: "" }
      ]
    },
    plan: ""
  });

  // UI Flow & API states
  const [submitting, setSubmitting] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showApiSetupInstructions, setShowApiSetupInstructions] = useState(false);

  // Hybrid Connection Modes for GitHub Pages / Static Deployment
  const [connectionMode, setConnectionMode] = useState<"server" | "local-key" | "google-pro">(() => {
    const savedMode = localStorage.getItem("osce_connection_mode");
    if (savedMode === "local-key" || savedMode === "google-pro" || savedMode === "server") {
      return savedMode as "local-key" | "google-pro" | "server";
    }
    if (localStorage.getItem("gemini_api_key")) return "local-key";
    if (localStorage.getItem("google_access_token")) return "google-pro";
    return "server";
  });
  
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [googleClientId, setGoogleClientId] = useState(() => localStorage.getItem("google_client_id") || "");
  const [googleAccessToken, setGoogleAccessToken] = useState(() => localStorage.getItem("google_access_token") || "");
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; picture: string } | null>(() => {
    const saved = localStorage.getItem("google_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  useEffect(() => {
    localStorage.setItem("osce_connection_mode", connectionMode);
  }, [connectionMode]);

  useEffect(() => {
    // Check if redirect has Google OAuth tokens in hash
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        localStorage.setItem("google_access_token", accessToken);
        setGoogleAccessToken(accessToken);
        
        // Clear hash from address bar so it stays polished
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        
        // Fetch user profile details
        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to load profile");
            return res.json();
          })
          .then((profile) => {
            const user = {
              name: profile.name || "",
              email: profile.email || "",
              picture: profile.picture || ""
            };
            localStorage.setItem("google_user", JSON.stringify(user));
            setGoogleUser(user);
            setConnectionMode("google-pro");
          })
          .catch((err) => {
            console.error("Google userinfo failed", err);
          });
      }
    }
  }, []);

  const handleGoogleLogin = () => {
    const clientId = googleClientId.trim();
    if (!clientId) {
      setErrorMessage("Please supply your custom Google Client ID in the Static Deployment panel first.");
      return;
    }
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = encodeURIComponent("openid profile email https://www.googleapis.com/auth/generative-language.tuning");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleGoogleLogout = () => {
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_user");
    setGoogleAccessToken("");
    setGoogleUser(null);
    setConnectionMode("server");
  };

  // Global Performance metrics (stored in localStorage)
  const [completedEncountersCount, setCompletedEncountersCount] = useState<number>(() => {
    const saved = localStorage.getItem("osce_completed_count");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Track the primary main view tab when not actively doing a case
  const [activeTabSubView, setActiveTabSubView] = useState<"cases" | "analytics">("cases");

  // Detailed Evaluation History array for student performance over time and weakness tracking
  const [evaluationHistory, setEvaluationHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("osce_evaluation_history");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ID of selected historical log run when expanding
  const [selectedHistoricalReportId, setSelectedHistoricalReportId] = useState<string | null>(null);

  const loadDemoPerformanceData = () => {
    const demoItems = [
      {
        id: "encounter_demo_1",
        caseId: "case_cardiology_stemi",
        caseName: "Arthur Pendelton",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        report: {
          overallGrade: "A-",
          overallSummary: "Excellent performance in this anterior-wall myocardial infarction encounter. History taking was comprehensive, but you failed to inquire about erectile dysfunction medications (Sildenafil) before ordering treatment, which is a major drug interaction concern.",
          diagnosisAccuracy: {
            score: 100,
            correctDiagnosis: "ST-Elevation Myocardial Infarction (STEMI)",
            feedback: "Perfect diagnosis! You accurately identified the anterior wall STEMI based on the 12-lead ECG findings."
          },
          historyTaking: {
            grade: "B+",
            score: 85,
            strengths: ["Asked about timing of onset", "Explored radiation to jaw and left arm"],
            missedOpportunityQuestions: ["Inquired about erectile dysfunction medications (Viagra/Sildenafil)"],
            feedback: "Highly systematic assessment overall. However, checking for Sildenafil usage is a critical safety parameter in suspected coronary syndromes before administering nitrates."
          },
          physicalExamChoices: {
            grade: "A",
            score: 95,
            feedback: "Strong choice of systems evaluated. You focused on key thoracic organs matching his cardiovascular chief complaint."
          },
          diagnosticOrdering: {
            grade: "B-",
            score: 75,
            totalCost: 770,
            costEfficiencyFeedback: "You ordered a Portable Chest X-ray and serial serum Troponins, which are standard, but also ordered an excessive amount of background metabolic screenings. In STEMI, do not delay standard catheterization labs waiting for non-critical lab work.",
            optimalTests: ["12-Lead Electrocardiogram (ECG)", "Serum Troponin I (Initial)"],
            redundantTests: ["Complete Blood Count (CBC)"]
          },
          soapDocumentation: {
            grade: "A-",
            score: 88,
            subjectiveFeedback: "Very detailed history of present illness. Good tracing of risk factor history.",
            objectiveFeedback: "Accurately recorded the telemetry and cardiopulmonary findings.",
            assessmentFeedback: "Differentials list was balanced, and diagnostic weights summed perfectly to 100%.",
            planFeedback: "Excellent plan detailing immediate chewable aspirin, heparin boluses, and emergent cath lab activation."
          }
        }
      },
      {
        id: "encounter_demo_2",
        caseId: "case_neurology_stroke",
        caseName: "Elena Rostova",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        report: {
          overallGrade: "B",
          overallSummary: "Solid workup of a suspected hyper-acute ischemic stroke. Your neurological examination was detailed, but your diagnostic ordering of labs was expensive, and you missed some key risk disclosures.",
          diagnosisAccuracy: {
            score: 90,
            correctDiagnosis: "Acute Ischemic Stroke (Left MCA Territory)",
            feedback: "Good final targeting. You correctly identified the acute ischemic event."
          },
          historyTaking: {
            grade: "C+",
            score: 78,
            strengths: ["Established last known well time", "Traced local relative weaknesses"],
            missedOpportunityQuestions: ["Asked grandmother's guardian about recent falls or mechanical injuries"],
            feedback: "You missed asking about her mechanical fall 2 weeks ago, which is important to gauge relative risks of post-thrombolytic hemorrhage."
          },
          physicalExamChoices: {
            grade: "A+",
            score: 100,
            feedback: "Exquisite physical diagnostics. You performed a perfect focal NIHSS equivalents layout."
          },
          diagnosticOrdering: {
            grade: "C",
            score: 70,
            totalCost: 720,
            costEfficiencyFeedback: "Ordered a non-contrast CT Head, POC glucose, and Coagulations promptly. However, ordering an invasive ABG and a full 12-lead ECG delayed initial stroke-team reperfusion workups.",
            optimalTests: ["CT Head Non-Contrast", "Point-of-Care Fingerstick Glucose"],
            redundantTests: ["12-Lead Electrocardiogram (ECG)"]
          },
          soapDocumentation: {
            grade: "A-",
            score: 92,
            subjectiveFeedback: "Brief but clearly stated timeline.",
            objectiveFeedback: "Thoroughly documented the Broca's aphasia and right-sided upper motor weakness.",
            assessmentFeedback: "Strong reasoning backing.",
            planFeedback: "Good management structure. Remember to note the absolute blood pressure control threshold (below 185/110 mmHg) for tPA safety."
          }
        }
      },
      {
        id: "encounter_demo_3",
        caseId: "case_endo_dk_acidosis",
        caseName: "Chloe Vance",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        report: {
          overallGrade: "C-",
          overallSummary: "Your workup of Chloe Vance is marked by diagnostic redundancy. While you managed to identify diabetic ketoacidosis, your diagnostic cost is highly excessive and you ordered multiple redundant scans.",
          diagnosisAccuracy: {
            score: 80,
            correctDiagnosis: "Diabetic Ketoacidosis (DKA)",
            feedback: "DKA identified. However, the diagnosis was delayed due to excess tests."
          },
          historyTaking: {
            grade: "B",
            score: 82,
            strengths: ["Explored history of medication compliance", "Traced constitutional weight loss patterns"],
            missedOpportunityQuestions: ["Asked directly about compliance with modern pump hardware"],
            feedback: "Good exploration of her insulin use, leading she confessing her pump had broken, causing severe progressive hyperglycemia."
          },
          physicalExamChoices: {
            grade: "B-",
            score: 80,
            feedback: "You checked her abdominal and pulmonary systems, which was fine, but you performed unneeded neurological tests on an alert metabolic patient."
          },
          diagnosticOrdering: {
            grade: "D",
            score: 60,
            totalCost: 1150,
            costEfficiencyFeedback: "You ordered a highly expensive CT Abdomen and Pelvis scan ($550) for generalized abdominal pain, which was completely unnecessary given she presented with severe wide anion-gap metabolic acidosis and large ketones, typical of DKA-related abdominal pain. This is a severe billing waste.",
            optimalTests: ["Basic Metabolic Panel (BMP)", "Urinalysis (UA)"],
            redundantTests: ["Arterial Blood Gas (ABG)", "CT Abdomen & Pelvis"]
          },
          soapDocumentation: {
            grade: "B+",
            score: 85,
            subjectiveFeedback: "Accurate tracking of nausea and vomiting.",
            objectiveFeedback: "Good record of Kussmaul respirations and parched mucous membranes.",
            assessmentFeedback: "Differential deck summed perfectly.",
            planFeedback: "Incomplete therapeutic parameters. You did not detail aggressive isotonic fluid hydration and continuous intravenous insulin infusion protocols properly."
          }
        }
      }
    ];

    setCompletedEncountersCount(prev => prev + 3);
    localStorage.setItem("osce_completed_count", (completedEncountersCount + 3).toString());
    setEvaluationHistory(demoItems);
    localStorage.setItem("osce_evaluation_history", JSON.stringify(demoItems));
  };

  const clearPerformanceHistory = () => {
    if (window.confirm("Are you sure you want to completely clear your performance tracking and analytics logs? This cannot be undone.")) {
      setCompletedEncountersCount(0);
      localStorage.setItem("osce_completed_count", "0");
      setEvaluationHistory([]);
      localStorage.setItem("osce_evaluation_history", "[]");
      setSelectedHistoricalReportId(null);
    }
  };
  
  // Load initial cases or reset states when choosing a case
  const startEncounter = (patientCase: PatientCase) => {
    setActiveCase(patientCase);
    setDialogHistory([
      {
        role: "assistant",
        content: `Hello doctor. ${patientCase.chiefComplaint ? `I am here today because of ${patientCase.chiefComplaint.toLowerCase()}` : "I'm not feeling well."}`
      }
    ]);
    setExamsPerformed([]);
    setLabsOrdered([]);
    setErrorMessage(null);
    setEvaluationReport(null);
    
    // Auto-prepopulate some of the objective findings based on baseline measurements and simple tools
    setSoapNote({
      subjective: "",
      objective: `vitals: BP ${patientCase.vitals.bloodPressure}, HR ${patientCase.vitals.heartRate} bpm, RR ${patientCase.vitals.respiratoryRate}, Temp ${patientCase.vitals.temperatureF}°F, O2 ${patientCase.vitals.o2Sat}.`,
      assessment: {
        diagnosis: "",
        reasoning: "",
        differentials: [
          { id: "1", diagnosis: "", probability: 50, reasoning: "" },
          { id: "2", diagnosis: "", probability: 30, reasoning: "" },
          { id: "3", diagnosis: "", probability: 20, reasoning: "" }
        ]
      },
      plan: ""
    });
    setCurrentTab("history");
  };

  // Ask question to patient API call
  const handleAskQuestion = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuestion.trim() || isPatientResponding || !activeCase) return;

    const questionText = userQuestion;
    setUserQuestion("");
    setErrorMessage(null);

    // Optimistically add user question to history
    const updatedHistory = [...dialogHistory, { role: "user" as const, content: questionText }];
    setDialogHistory(updatedHistory);
    setIsPatientResponding(true);

    try {
      let patientResponseText = "";
      
      if (connectionMode === "local-key" && apiKey) {
        patientResponseText = await askPatientClientSide(
          activeCase,
          updatedHistory.slice(0, -1),
          questionText,
          { apiKey: apiKey.trim() }
        );
      } else if (connectionMode === "google-pro" && googleAccessToken) {
        patientResponseText = await askPatientClientSide(
          activeCase,
          updatedHistory.slice(0, -1),
          questionText,
          { accessToken: googleAccessToken.trim() }
        );
      } else {
        const response = await fetch("/api/cases/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId: activeCase.id,
            history: updatedHistory.slice(0, -1), // sending history without the new question
            newQuestion: questionText
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to get patient response.");
        }
        patientResponseText = data.response;
      }

      setDialogHistory([...updatedHistory, { role: "assistant" as const, content: patientResponseText }]);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message || "Could not connect to the simulator.");
      if (error?.message?.includes("GEMINI_API_KEY")) {
        setShowApiSetupInstructions(true);
      }
    } finally {
      setIsPatientResponding(false);
    }
  };

  // Perform physical exam
  const performExam = (key: string) => {
    if (!examsPerformed.includes(key)) {
      const newExams = [...examsPerformed, key];
      setExamsPerformed(newExams);
      
      // Auto-append finding to objective SOAP notes
      if (activeCase) {
        const examObj = activeCase.physicalExams[key];
        const newFindings = `${examObj.label}: ${examObj.findings}`;
        setSoapNote((prev) => {
          const original = prev.objective;
          const separator = original.endsWith(".") || original.trim() === "" ? "" : "; ";
          return {
            ...prev,
            objective: `${original}${separator}${newFindings}.`
          };
        });
      }
    }
  };

  // Order diagnostic test / lab
  const orderLab = (key: string) => {
    if (!labsOrdered.includes(key)) {
      const newLabs = [...labsOrdered, key];
      setLabsOrdered(newLabs);
      
      // Auto-append lab details to objective SOAP notes
      if (activeCase) {
        const labObj = activeCase.labsAndDiagnostics[key];
        const newResult = `${labObj.label}: ${labObj.result}`;
        setSoapNote((prev) => {
          const original = prev.objective;
          const separator = original.endsWith(".") || original.trim() === "" ? "" : "; ";
          return {
            ...prev,
            objective: `${original}${separator}${newResult}.`
          };
        });
      }
    }
  };

  // Calculate current financial cost of ordered diagnostics
  const calculateTotalCost = () => {
    if (!activeCase) return 0;
    return labsOrdered.reduce((total, key) => {
      const lab = activeCase.labsAndDiagnostics[key];
      return total + (lab ? lab.cost : 0);
    }, 0);
  };

  // Manage SOAP Differential Notes Rows
  const updateDifferential = (id: string, field: keyof Differential, value: any) => {
    setSoapNote((prev) => {
      const updatedDiffs = prev.assessment.differentials.map((diff) => {
        if (diff.id === id) {
          return { ...diff, [field]: value };
        }
        return diff;
      });
      return {
        ...prev,
        assessment: {
          ...prev.assessment,
          differentials: updatedDiffs
        }
      };
    });
  };

  const addDifferentialRow = () => {
    setSoapNote((prev) => {
      const newId = (prev.assessment.differentials.length + 1).toString();
      return {
        ...prev,
        assessment: {
          ...prev.assessment,
          differentials: [
            ...prev.assessment.differentials,
            { id: newId, diagnosis: "", probability: 10, reasoning: "" }
          ]
        }
      };
    });
  };

  const deleteDifferentialRow = (id: string) => {
    setSoapNote((prev) => {
      const filtered = prev.assessment.differentials.filter((d) => d.id !== id);
      return {
        ...prev,
        assessment: {
          ...prev.assessment,
          differentials: filtered
        }
      };
    });
  };

  // Submit complete note for attendings evaluation
  const submitForAttendingEvaluation = async () => {
    if (!activeCase) return;
    setErrorMessage(null);

    // Basic client checks
    const totalDiffProbability = soapNote.assessment.differentials.reduce((acc, curr) => acc + (Number(curr.probability) || 0), 0);
    if (totalDiffProbability !== 100) {
      setErrorMessage(`Your Differential probabilities add up to ${totalDiffProbability}%. They must equal strictly 100% before submission to the Attending Physician.`);
      return;
    }

    if (!soapNote.subjective.trim()) {
      setErrorMessage("Please complete the 'Subjective (S)' portion of your notes summarizing what the patient told you.");
      return;
    }

    if (!soapNote.assessment.diagnosis.trim()) {
      setErrorMessage("Please supply your final suspected primary Diagnosis under the Assessment portion.");
      return;
    }

    if (!soapNote.plan.trim()) {
      setErrorMessage("Please write down your target therapeutic plan under the Plan (P) portion.");
      return;
    }

    setSubmitting(true);

    try {
      let evaluationData;

      if (connectionMode === "local-key" && apiKey) {
        evaluationData = await evaluateSoapNoteClientSide(
          activeCase,
          dialogHistory,
          examsPerformed.map(k => activeCase.physicalExams[k]?.label || k),
          labsOrdered,
          {
            subjective: soapNote.subjective,
            objective: soapNote.objective,
            assessment: {
              diagnosis: soapNote.assessment.diagnosis,
              reasoning: soapNote.assessment.reasoning,
              differentials: soapNote.assessment.differentials.map(d => ({
                diagnosis: d.diagnosis,
                probability: Number(d.probability) || 0,
                reasoning: d.reasoning
              }))
            },
            plan: soapNote.plan
          },
          { apiKey: apiKey.trim() }
        );
      } else if (connectionMode === "google-pro" && googleAccessToken) {
        evaluationData = await evaluateSoapNoteClientSide(
          activeCase,
          dialogHistory,
          examsPerformed.map(k => activeCase.physicalExams[k]?.label || k),
          labsOrdered,
          {
            subjective: soapNote.subjective,
            objective: soapNote.objective,
            assessment: {
              diagnosis: soapNote.assessment.diagnosis,
              reasoning: soapNote.assessment.reasoning,
              differentials: soapNote.assessment.differentials.map(d => ({
                diagnosis: d.diagnosis,
                probability: Number(d.probability) || 0,
                reasoning: d.reasoning
              }))
            },
            plan: soapNote.plan
          },
          { accessToken: googleAccessToken.trim() }
        );
      } else {
        const response = await fetch("/api/cases/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId: activeCase.id,
            conversationHistory: dialogHistory,
            examsPerformed: examsPerformed.map(k => activeCase.physicalExams[k]?.label || k),
            labsOrdered: labsOrdered,
            soapNote: {
              subjective: soapNote.subjective,
              objective: soapNote.objective,
              assessment: {
                diagnosis: soapNote.assessment.diagnosis,
                reasoning: soapNote.assessment.reasoning,
                differentials: soapNote.assessment.differentials.map(d => ({
                  diagnosis: d.diagnosis,
                  probability: d.probability,
                  reasoning: d.reasoning
                }))
              },
              plan: soapNote.plan
            }
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to submit note for evaluation.");
        }
        evaluationData = data;
      }

      setEvaluationReport(evaluationData);
      
      // Save encounter to local performance history
      const historyItem = {
        id: `encounter_${Date.now()}`,
        caseId: activeCase.id,
        caseName: activeCase.name,
        timestamp: new Date().toISOString(),
        report: evaluationData
      };
      const updatedHistory = [historyItem, ...evaluationHistory];
      setEvaluationHistory(updatedHistory);
      localStorage.setItem("osce_evaluation_history", JSON.stringify(updatedHistory));
      
      // Increment encounter tally globally and backup to storage
      const newCount = completedEncountersCount + 1;
      setCompletedEncountersCount(newCount);
      localStorage.setItem("osce_completed_count", newCount.toString());
      
      // Scroll to top of evaluation page
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Attending clinician evaluation failed. Check connectivity.");
    } finally {
      setSubmitting(false);
    }
  };

  const endEncounterReset = () => {
    setActiveCase(null);
    setEvaluationReport(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header Desk Row */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
              <Sprout className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-black tracking-tight text-stone-900 flex items-center gap-2">
                Ginkgo Clinical Case Simulator
              </h1>
              <p className="text-[10px] text-stone-550 uppercase tracking-widest font-mono">Organic Diagnostic OSCE Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Active Mode indicator badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              connectionMode === "google-pro" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : connectionMode === "local-key"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-sky-50 text-sky-700 border-sky-100"
            }`}>
              {connectionMode === "google-pro" && googleUser ? (
                <>
                  {googleUser.picture ? (
                    <img src={googleUser.picture} alt="Avatar" className="w-4 h-4 rounded-full" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>Google Pro ({googleUser.name.split(' ')[0]})</span>
                </>
              ) : connectionMode === "local-key" ? (
                <>
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Local Key Active</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-sky-500" />
                  <span>Sandbox Server</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Student Provider</span>
              </div>
              <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-700">
                <Activity className="w-3.5 h-3.5 text-sky-500" />
                <span>{completedEncountersCount} OSCE Completed</span>
              </div>
              
              {/* Settings Toggle Button */}
              <button
                id="btn-settings-toggle"
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  showSettingsDrawer 
                    ? "bg-sky-100 border-sky-300 text-sky-700 shadow-inner" 
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 shadow-sm"
                }`}
                title="Configure Deployments & Keys (GitHub Pages / Local)"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings slide drawer */}
      {showSettingsDrawer && (
        <div className="bg-slate-100 border-b border-slate-200 px-4 md:px-8 py-5 shadow-inner transition-all animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wide">Static Host (GitHub Pages) & Client-Side Configuration</h3>
                <p className="text-xs text-slate-500">Configure client-side models to skip local backends when hosting statically.</p>
              </div>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕ Close Options
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mode Selection Column */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase">1. Connection Router</h4>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 border border-slate-100 cursor-pointer text-xs transition-colors">
                    <input
                      type="radio"
                      name="conn-mode"
                      checked={connectionMode === "server"}
                      onChange={() => setConnectionMode("server")}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Workspace Server Mode</div>
                      <div className="text-[10px] text-slate-500">Calls secure developer-attaching backend endpoints.</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 border border-slate-100 cursor-pointer text-xs transition-colors">
                    <input
                      type="radio"
                      name="conn-mode"
                      checked={connectionMode === "local-key"}
                      onChange={() => setConnectionMode("local-key")}
                      disabled={!apiKey}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <div className={`font-semibold ${!apiKey ? "text-slate-400" : "text-slate-900"}`}>Local API Key Mode</div>
                      <div className="text-[10px] text-slate-500">Saves direct queries to Gemini locally. Required for hostings.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 border border-slate-100 cursor-pointer text-xs transition-colors">
                    <input
                      type="radio"
                      name="conn-mode"
                      checked={connectionMode === "google-pro"}
                      onChange={() => setConnectionMode("google-pro")}
                      disabled={!googleAccessToken}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <div className={`font-semibold ${!googleAccessToken ? "text-slate-400" : "text-slate-900"}`}>Google Sign-In Direct</div>
                      <div className="text-[10px] text-slate-500">Use your own credential/project client-side token inside.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* API Key management */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase">2. Local Gemini API Key</h4>
                <div className="space-y-2">
                  <label className="block text-[11px] text-slate-500 font-medium">Input your personal browser-stored Gemini Key:</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:bg-white text-slate-800 font-mono"
                    />
                    <button
                      onClick={() => {
                        const trimmed = apiKey.trim();
                        if (trimmed) {
                          localStorage.setItem("gemini_api_key", trimmed);
                          setConnectionMode("local-key");
                        } else {
                          localStorage.removeItem("gemini_api_key");
                          setApiKey("");
                          setConnectionMode("server");
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Save
                    </button>
                  </div>
                  {apiKey && (
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Key stored. Direct REST interface ready.
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 leading-normal">Your key is stored purely locally in Google Local Storage and is never transmitted to our backend servers.</p>
                </div>
              </div>

              {/* Google Sign-in config */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase">3. Google Pro Account</h4>
                <div className="space-y-2 text-xs">
                  {!googleAccessToken ? (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-500 font-medium">Client ID from Google Cloud:</label>
                        <input
                          type="text"
                          value={googleClientId}
                          onChange={(e) => setGoogleClientId(e.target.value)}
                          placeholder="xxxxxxxxxx.apps.googleusercontent.com"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none focus:bg-white text-slate-800 font-mono"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const id = googleClientId.trim();
                          if (id) {
                            localStorage.setItem("google_client_id", id);
                            handleGoogleLogin();
                          } else {
                            setErrorMessage("Please enter your Google Cloud Web Client ID first.");
                          }
                        }}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer text-center text-xs flex justify-center items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5" /> Sign In with Google
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {googleUser && (
                        <div className="flex items-center gap-2.5 bg-slate-50 px-2.5 py-2 rounded-lg border border-slate-150">
                          {googleUser.picture && (
                            <img src={googleUser.picture} alt="Profile" className="w-8 h-8 rounded-full border shrink-0" />
                          )}
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-900 leading-tight text-xs truncate">{googleUser.name}</div>
                            <div className="text-[10px] text-slate-500 leading-none truncate">{googleUser.email}</div>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={handleGoogleLogout}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold py-1.5 rounded-lg transition-colors cursor-pointer text-xs flex justify-center items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Disconnect Google Account
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 leading-normal">Allows students and faculty to use their institutional or Google developer accounts for clinical runs without leaking keys.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        
        {/* Error Alert Bar */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800" id="error-alert">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-rose-950">Attending Assessment Blocked</p>
              <p className="mt-1">{errorMessage}</p>
              {showApiSetupInstructions && (
                <div className="mt-2 text-xs bg-white p-3 border border-rose-100 rounded-lg text-slate-700">
                  <p className="font-bold">How to resolve:</p>
                  <ol className="list-decimal ml-4 mt-1 space-y-1">
                    <li>This server requires a Gemini API Key to run simulations.</li>
                    <li>Open clinical controls: Click on the <strong>Settings &gt; Secrets</strong> panel in Google AI Studio to enter your Gemini secret.</li>
                    <li>Add a key named <strong className="font-mono">GEMINI_API_KEY</strong> and apply.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 1. VIEW A: CASE SELECTION & ANALYTICS DUAL DESK */}
        {!activeCase ? (
          <div>
            {/* Sub View Choice Tab switcher */}
            <div className="flex border-b border-stone-200 mb-8 mt-2 gap-6" id="analytics-tab-bar">
              <button
                id="btn-sub-view-cases"
                onClick={() => setActiveTabSubView("cases")}
                className={`pb-3 text-sm font-bold tracking-wide uppercase cursor-pointer relative transition-all ${
                  activeTabSubView === "cases"
                    ? "text-emerald-800 font-extrabold"
                    : "text-stone-400 hover:text-stone-600 font-medium"
                }`}
              >
                Available Patient Cases
                {activeTabSubView === "cases" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />
                )}
              </button>
              <button
                id="btn-sub-view-analytics"
                onClick={() => setActiveTabSubView("analytics")}
                className={`pb-3 text-sm font-bold tracking-wide uppercase cursor-pointer relative transition-all flex items-center gap-2 ${
                  activeTabSubView === "analytics"
                    ? "text-emerald-800 font-extrabold"
                    : "text-stone-400 hover:text-stone-600 font-medium"
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Performance Analytics
                {evaluationHistory.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-850 text-[10px] font-black px-2 py-0.5 rounded-full select-none">
                    {evaluationHistory.length}
                  </span>
                )}
                {activeTabSubView === "analytics" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700" />
                )}
              </button>
            </div>

            {activeTabSubView === "cases" ? (
              <div>
                <div className="mb-8 text-center sm:text-left">
                  <h2 className="text-3xl font-serif font-black tracking-tight text-stone-900 animate-in fade-in slide-in-from-left-4 duration-300">Interactive Clinical OSCE Desk</h2>
                  <p className="text-stone-600 mt-1.5 max-w-2xl text-sm leading-relaxed">
                    Select a simulated patient case below to begin your physical examination and diagnostic evaluation program. Document findings into your clinical SOAP record for Ginkgo attending evaluation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300" id="cases-grid">
                  {CLINICAL_CASES.map((patient) => {
                    let systemType = "General Medicine";
                    if (patient.id.includes("cardiology")) systemType = "Cardiology";
                    if (patient.id.includes("neurology")) systemType = "Neurology";
                    if (patient.id.includes("pulmonology") || patient.id.includes("pulm")) systemType = "Pulmonology / EM";
                    if (patient.id.includes("gastroenterology") || patient.id.includes("gastro") || patient.id.includes("gi")) systemType = "Gastroenterology";
                    if (patient.id.includes("endo")) systemType = "Endocrinology";
                    if (patient.id.includes("rheum")) systemType = "Rheumatology";
                    if (patient.id.includes("tox")) systemType = "Toxicology";
                    if (patient.id.includes("id_")) systemType = "Infectious Diseases";
                    if (patient.id.includes("nephro")) systemType = "Nephrology";

                    return (
                      <div
                        key={patient.id}
                        id={`case-card-${patient.id}`}
                        className="bg-white border border-stone-200 hover:border-emerald-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-100/50">
                              {systemType}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-stone-550 font-mono">
                              <User className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Age {patient.age} • {patient.gender}</span>
                            </div>
                          </div>

                          <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">Patient: {patient.name}</h3>
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-650 mb-4 h-24 overflow-y-auto leading-relaxed">
                            <strong className="text-stone-800 font-serif">Chief Complaint (CC):</strong> &ldquo;{patient.chiefComplaint}&rdquo;
                            <p className="mt-1 font-sans">{patient.presentationText}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-3 border-t border-stone-150">
                            <div className="text-center">
                              <p className="text-[10px] text-stone-400 font-bold uppercase font-mono">Blood Pressure</p>
                              <p className="text-xs font-semibold text-stone-700 mt-0.5">{patient.vitals.bloodPressure.split(" ")[0]}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-stone-400 font-bold uppercase font-mono">Heart Rate</p>
                              <p className="text-xs font-semibold text-stone-700 mt-0.5">{patient.vitals.heartRate} bpm</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-stone-400 font-bold uppercase font-mono">O2 Saturation</p>
                              <p className="text-xs font-semibold text-stone-700 mt-0.5">{patient.vitals.o2Sat.split(" ")[0]}</p>
                            </div>
                          </div>
                        </div>

                        <button
                          id={`btn-start-${patient.id}`}
                          onClick={() => startEncounter(patient)}
                          className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
                        >
                          <ClipboardCheck className="w-4 h-4 text-emerald-200" />
                          Begin Assessment
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* DYNAMIC LONGITUDINAL STUDENT ANALYTICS DASHBOARD */
              (() => {
                const getReportOverallScore = (r: any) => {
                  if (!r) return 0;
                  const s1 = r.diagnosisAccuracy?.score ?? 0;
                  const s2 = r.historyTaking?.score ?? 0;
                  const s3 = r.physicalExamChoices?.score ?? 0;
                  const s4 = r.diagnosticOrdering?.score ?? 0;
                  const s5 = r.soapDocumentation?.score ?? 0;
                  return Math.round((s1 + s2 + s3 + s4 + s5) / 5);
                };

                const totalOverall = evaluationHistory.reduce((sum, item) => sum + getReportOverallScore(item.report), 0);
                const avgScoreOverall = evaluationHistory.length > 0 ? Math.round(totalOverall / evaluationHistory.length) : 0;

                const acount = evaluationHistory.filter(item => item.report?.overallGrade?.startsWith("A")).length;
                const bcount = evaluationHistory.filter(item => item.report?.overallGrade?.startsWith("B")).length;
                const ccount = evaluationHistory.filter(item => item.report?.overallGrade?.startsWith("C")).length;
                const dPlusFcount = evaluationHistory.length - (acount + bcount + ccount);

                const totalCosts = evaluationHistory.reduce((sum, item) => sum + (item.report?.diagnosticOrdering?.totalCost || 0), 0);
                const avgCost = evaluationHistory.length > 0 ? Math.round(totalCosts / evaluationHistory.length) : 0;

                const avgDiagnosis = evaluationHistory.length > 0 
                  ? Math.round(evaluationHistory.reduce((sum, item) => sum + (item.report.diagnosisAccuracy?.score || 0), 0) / evaluationHistory.length) 
                  : 0;
                const avgHistory = evaluationHistory.length > 0 
                  ? Math.round(evaluationHistory.reduce((sum, item) => sum + (item.report.historyTaking?.score || 0), 0) / evaluationHistory.length) 
                  : 0;
                const avgPhysical = evaluationHistory.length > 0 
                  ? Math.round(evaluationHistory.reduce((sum, item) => sum + (item.report.physicalExamChoices?.score || 0), 0) / evaluationHistory.length) 
                  : 0;
                const avgOrdering = evaluationHistory.length > 0 
                  ? Math.round(evaluationHistory.reduce((sum, item) => sum + (item.report.diagnosticOrdering?.score || 0), 0) / evaluationHistory.length) 
                  : 0;
                const avgSoap = evaluationHistory.length > 0 
                  ? Math.round(evaluationHistory.reduce((sum, item) => sum + (item.report.soapDocumentation?.score || 0), 0) / evaluationHistory.length) 
                  : 0;

                const competencyCategories = [
                  { id: "diagnosisAccuracy", label: "Diagnosis Accuracy", score: avgDiagnosis, description: "Accurate identification of final primary clinical pathology." },
                  { id: "historyTaking", label: "History Taking Mastery", score: avgHistory, description: "Clinical interview depth and risk factor inquiry completeness." },
                  { id: "physicalExamChoices", label: "Physical Exam Target Efficacy", score: avgPhysical, description: "Choosing high-yield organ/system elements related to presentation." },
                  { id: "diagnosticOrdering", label: "Diagnostic Ordering Cost-Efficiency", score: avgOrdering, description: "Eliminating unneeded high-expense scans and managing fees." },
                  { id: "soapDocumentation", label: "SOAP Documentation Quality", score: avgSoap, description: "Writing professional structured narrative notes & plans." }
                ];

                const sortedCompetency = [...competencyCategories].sort((a, b) => a.score - b.score);
                const weakestCategory = evaluationHistory.length > 0 ? sortedCompetency[0] : null;
                const strongestCategory = evaluationHistory.length > 0 ? sortedCompetency[sortedCompetency.length - 1] : null;

                const chronologicalHistory = [...evaluationHistory].sort(
                  (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );

                return (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    {evaluationHistory.length === 0 ? (
                      /* EMPTY ANALYTICS STATE */
                      <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-2xl mx-auto my-6" id="analytics-empty-state">
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 mb-4">
                          <TrendingUp className="w-10 h-10 text-emerald-600 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">No Simulated OSCE History Yet</h3>
                        <p className="text-stone-600 text-xs leading-relaxed mb-6 max-w-md font-sans">
                          Complete one of the available clinical OSCE cases below and submit your SOAP clinical note for attending evaluation. Ginkgo will automatically track your performance over time, chart your progress, and compile diagnostic weak spots here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => setActiveTabSubView("cases")}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 px-6 rounded-xl text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <ClipboardCheck className="w-4 h-4 text-emerald-250" />
                            Start Your First Case
                          </button>
                          <button
                            onClick={loadDemoPerformanceData}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 px-6 rounded-xl text-xs font-bold tracking-wide uppercase border border-stone-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Activity className="w-4 h-4 text-emerald-600 animate-spin" />
                            Pre-populate Demo Dataset
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* RENDERED METRICS PANEL */
                      <div className="space-y-8">
                        {/* Page header controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-150 pb-5">
                          <div>
                            <h2 className="text-2xl font-serif font-black text-stone-900 flex items-center gap-2">
                              <span>🌿 Student Provider Dashboard</span>
                            </h2>
                            <p className="text-stone-500 text-xs mt-1">Provider Competency Tracking, Cost Stewardship & Longitudinal Analytics</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={loadDemoPerformanceData}
                              className="bg-white hover:bg-stone-50 text-stone-700 hover:text-emerald-700 py-1.5 px-3 rounded-lg text-xs font-bold border border-stone-250 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              title="Add more mock evaluations for testing"
                            >
                              <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Inject Demo Runs
                            </button>
                            <button
                              onClick={clearPerformanceHistory}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 py-1.5 px-3 rounded-lg text-xs font-bold border border-rose-200 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" /> Clear History Logs
                            </button>
                          </div>
                        </div>

                        {/* Top Highlights Grid cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                          {/* Average Score block */}
                          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                            <div>
                              <p className="text-stone-400 text-[10px] uppercase font-bold font-mono tracking-wider">Average Composite Score</p>
                              <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-4xl font-serif font-black text-emerald-800">{avgScoreOverall}%</span>
                                <span className="text-[10px] font-extrabold font-mono tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                                  {avgScoreOverall >= 90 ? "Honors" : avgScoreOverall >= 80 ? "High Pass" : avgScoreOverall >= 70 ? "Pass" : "Remediation"}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-4 overflow-hidden">
                              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${avgScoreOverall}%` }} />
                            </div>
                          </div>

                          {/* Completed metrics */}
                          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                            <div>
                              <p className="text-stone-400 text-[10px] uppercase font-bold font-mono tracking-wider">Finished OSCE Encounters</p>
                              <div className="flex items-baseline gap-1.5 mt-2">
                                <span className="text-4xl font-serif font-black text-stone-900">{evaluationHistory.length}</span>
                                <span className="text-xs text-stone-500 font-sans font-medium">Cases evaluated</span>
                              </div>
                            </div>
                            <p className="text-[9px] text-stone-400 font-mono mt-4">Calculating clinical records dynamically</p>
                          </div>

                          {/* Grade metrics */}
                          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                            <div>
                              <p className="text-stone-400 text-[10px] uppercase font-bold font-mono tracking-wider">Litteral Grade Tally</p>
                              <div className="grid grid-cols-4 gap-1 mt-3">
                                <div className="text-center">
                                  <span className="block text-[10px] font-mono font-bold text-emerald-700">A</span>
                                  <span className="text-lg font-serif font-black text-stone-800">{acount}</span>
                                </div>
                                <div className="text-center">
                                  <span className="block text-[10px] font-mono font-bold text-sky-700">B</span>
                                  <span className="text-lg font-serif font-black text-stone-800">{bcount}</span>
                                </div>
                                <div className="text-center">
                                  <span className="block text-[10px] font-mono font-bold text-amber-700">C</span>
                                  <span className="text-lg font-serif font-black text-stone-800">{ccount}</span>
                                </div>
                                <div className="text-center">
                                  <span className="block text-[10px] font-mono font-bold text-rose-700">D/F</span>
                                  <span className="text-lg font-serif font-black text-stone-800">{dPlusFcount}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-[9px] text-stone-400 font-mono mt-4">Derived from final feedback grades</p>
                          </div>

                          {/* Cost effectiveness card */}
                          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                            <div>
                              <p className="text-stone-400 text-[10px] uppercase font-bold font-mono tracking-wider">Average Diagnostic Cost</p>
                              <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-4xl font-serif font-black text-stone-900">${avgCost}</span>
                                <span className="text-[10px] text-stone-400 font-mono">/ encounter</span>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-sans font-bold">
                              <div className={`w-2.5 h-2.5 rounded-full ${avgCost < 600 ? "bg-emerald-500" : avgCost < 1000 ? "bg-amber-400 animate-pulse" : "bg-rose-500 animate-bounce"}`} />
                              <span className={avgCost < 600 ? "text-emerald-700" : avgCost < 1000 ? "text-amber-700" : "text-rose-700"}>
                                {avgCost < 600 ? "High Cost stewardship" : avgCost < 1000 ? "Borderline Test Redundancy" : "Excessive Clinical Waste"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Middle split: Chart & weakness advice */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                          
                          {/* Left 3 units: Longitudinal progress line chart */}
                          <div className="lg:col-span-3 space-y-6">
                            
                            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
                              <h4 className="text-xs font-bold text-stone-800 mb-4 uppercase tracking-widest font-mono flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                OSCE Scores Trend (Longitudinal Clinical Progression)
                              </h4>

                              <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 flex flex-col items-center justify-center relative">
                                <svg viewBox="0 0 500 150" className="w-full h-auto overflow-visible select-none my-2">
                                  {/* Guidelines benchmarks */}
                                  <line x1="40" y1="20" x2="485" y2="20" stroke="#ebdcd0" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-40" />
                                  <line x1="40" y1="20" x2="485" y2="20" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                                  <text x="5" y="24" className="text-[8px] fill-stone-400 font-mono font-semibold">100%</text>

                                  <line x1="40" y1="70" x2="485" y2="70" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                                  <text x="5" y="74" className="text-[8px] fill-stone-400 font-mono font-semibold">50%</text>

                                  <line x1="40" y1="120" x2="485" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
                                  <text x="5" y="124" className="text-[8px] fill-stone-400 font-mono font-semibold">0%</text>

                                  {/* Shaded Area Under Curve Gradient */}
                                  {chronologicalHistory.length > 1 ? (
                                    <polygon
                                      points={`40,120 ` + chronologicalHistory.map((item, i) => {
                                        const x = 40 + i * (440 / (chronologicalHistory.length - 1));
                                        const score = getReportOverallScore(item.report);
                                        const y = 120 - (score * 100 / 100);
                                        return `${x},${y}`;
                                      }).join(" ") + ` ${40 + (chronologicalHistory.length - 1) * (440 / (chronologicalHistory.length - 1))},120`}
                                      fill="url(#chartGradient)"
                                    />
                                  ) : null}

                                  {/* Connector Line path */}
                                  {chronologicalHistory.length > 1 ? (
                                    <path
                                      d={`M ` + chronologicalHistory.map((item, i) => {
                                        const x = 40 + i * (440 / (chronologicalHistory.length - 1));
                                        const score = getReportOverallScore(item.report);
                                        const y = 120 - (score * 100 / 100);
                                        return `${x} ${y}`;
                                      }).join(" L ")}
                                      fill="none"
                                      stroke="#059669"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  ) : null}

                                  {/* Nodes */}
                                  {chronologicalHistory.map((item, i) => {
                                    const x = chronologicalHistory.length === 1 ? 260 : 40 + i * (440 / (chronologicalHistory.length - 1));
                                    const score = getReportOverallScore(item.report);
                                    const y = 120 - (score * 100 / 100);
                                    const isSelected = selectedHistoricalReportId === item.id;

                                    return (
                                      <g key={item.id} className="cursor-pointer group">
                                        <circle
                                          cx={x}
                                          cy={y}
                                          r={isSelected ? "7" : "5"}
                                          className={`fill-white stroke-2 hover:r-7 transition-all duration-150 ${
                                            isSelected ? "stroke-emerald-800 fill-emerald-100" : "stroke-emerald-600 hover:stroke-emerald-800"
                                          }`}
                                          onClick={() => setSelectedHistoricalReportId(isSelected ? null : item.id)}
                                        />
                                        
                                        {/* Floating pill tooltips */}
                                        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                                          <rect
                                            x={x - 30}
                                            y={y - 28}
                                            width="60"
                                            height="18"
                                            rx="4"
                                            className="fill-stone-950"
                                          />
                                          <text
                                            x={x}
                                            y={y - 16}
                                            textAnchor="middle"
                                            className="text-[8px] fill-white font-mono font-bold"
                                          >
                                            {item.caseName}: {score}%
                                          </text>
                                        </g>

                                        {/* Horizontal label */}
                                        <text
                                          x={x}
                                          y="142"
                                          textAnchor="middle"
                                          className="text-[8px] font-mono fill-stone-500 font-medium"
                                        >
                                          Run #{chronologicalHistory.length - (chronologicalHistory.length - 1 - i)}
                                        </text>
                                      </g>
                                    );
                                  })}
                                </svg>
                                <p className="text-[10px] text-stone-400 font-sans mt-3 text-center">
                                  * Click any node point on the progression map above to review specific SOAP evaluations below.
                                </p>
                              </div>
                            </div>

                            {/* Detailed categories bars */}
                            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
                              <h4 className="text-xs font-bold text-stone-850 mb-4 uppercase tracking-widest font-mono flex items-center gap-1.5">
                                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                                Core OSCE Category Competency Domain Analysis
                              </h4>
                              
                              <div className="space-y-4">
                                {competencyCategories.map((cat) => {
                                  const score = cat.score;
                                  const statusLabel = score >= 90 ? "Mastery" : score >= 80 ? "Proficient" : score >= 70 ? "Competent" : "Needs Training";
                                  const isWeakest = weakestCategory && weakestCategory.id === cat.id;
                                  const isStrongest = strongestCategory && strongestCategory.id === cat.id;

                                  return (
                                    <div key={cat.id} className={`p-4 rounded-xl border transition-colors ${
                                      isWeakest ? "bg-rose-50/50 border-rose-100" : isStrongest ? "bg-emerald-50/10 border-emerald-100" : "bg-stone-50/30 border-stone-200/60"
                                    }`}>
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-stone-900 font-sans">{cat.label}</span>
                                            {isWeakest && (
                                              <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wider">
                                                <AlertTriangle className="w-2.5 h-2.5 text-rose-600" /> Need Action
                                              </span>
                                            )}
                                            {isStrongest && (
                                              <span className="bg-emerald-100 text-emerald-850 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                ★ Best Domain
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-stone-500 font-sans leading-tight mt-0.5">{cat.description}</p>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-sm font-mono font-bold text-stone-800">{score}%</span>
                                          <span className={`block text-[9px] font-bold font-mono uppercase tracking-wider ${
                                            score >= 90 ? "text-emerald-700" : score >= 80 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-rose-600"
                                          }`}>{statusLabel}</span>
                                        </div>
                                      </div>
                                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-300 ${
                                          score >= 90 ? "bg-emerald-600" : score >= 80 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-rose-500"
                                        }`} style={{ width: `${score}%` }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Right 2 units: Remediation and weak spot analysis */}
                          <div className="lg:col-span-2 space-y-6">
                            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800 h-full flex flex-col justify-between relative overflow-hidden">
                              <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-white p-12 rounded-full">
                                <AlertTriangle className="w-48 h-48 text-stone-400" />
                              </div>

                              <div className="space-y-5">
                                <div className="flex items-center gap-2 mb-4 bg-amber-500/25 text-amber-300 border border-amber-500/35 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  Improvement Action Gap
                                </div>
                                
                                <h3 className="text-lg font-serif font-bold text-stone-100 leading-snug">
                                  Aggregate Weak Spot:<br/>
                                  <span className="text-amber-400 font-sans text-sm font-bold block mt-1.5">{weakestCategory ? weakestCategory.label : "N/A"}</span>
                                </h3>
                                
                                <p className="text-xs text-stone-400 font-sans mt-2 leading-relaxed">
                                  Your lowest scoring focus domain across finished evaluations is <strong className="text-stone-250 font-semibold">{weakestCategory ? weakestCategory.label : "N/A"}</strong>, operating at an average rate of <strong className="text-amber-450 font-mono font-bold">{weakestCategory ? weakestCategory.score : 0}%</strong>.
                                </p>

                                <div className="border-t border-stone-800/80 pt-5 space-y-4">
                                  <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest font-bold">Actionable Clinical Remedies:</p>
                                  
                                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 text-xs text-stone-300 leading-relaxed font-sans shadow-inner">
                                    {weakestCategory?.id === "diagnosisAccuracy" && (
                                      <p>
                                        <strong>Diagnostic synthesis must be improved:</strong> Spend more time analyzing objective findings and differential probability charts before committing to a final primary diagnosis. Always double check if your differential weights sum to 100%. Don't jump to conclusions purely on the chief complaint. Make sure clinical grounds are fully justified.
                                      </p>
                                    )}
                                    {weakestCategory?.id === "historyTaking" && (
                                      <p>
                                        <strong>Inquiry depth is insufficient:</strong> Always query the mock patients deeply about social history habits (alcohol, tobacco, travel), current home pharmaceuticals, hereditary risk factors, and timeline milestones before invoking diagnostics. Important hints are hidden in the conversational dialogue! Use open-ended inquiry.
                                      </p>
                                    )}
                                    {weakestCategory?.id === "physicalExamChoices" && (
                                      <p>
                                        <strong>Organ investigations are fragmented:</strong> Keep clinical assessments highly concentrated on the key system pathways matching the clinical presentation. For cardiac symptoms (chest tightness, palpitations), always check both lungs and cardiovascular system. Avoid clicking non-related bodily organs blindly.
                                      </p>
                                    )}
                                    {weakestCategory?.id === "diagnosticOrdering" && (
                                      <p>
                                        <strong>Frugal financial stewardship is essential:</strong> Patient economic health is a key metric. Avoid tests that yield zero pathognomonic evidence. Do not order multiple redundant scans (e.g., loading an anatomical full-body CT scan when a basic bedside fingerstick glucose or blood gas can definitively isolate acidosis). Keep ordering clean.
                                      </p>
                                    )}
                                    {weakestCategory?.id === "soapDocumentation" && (
                                      <p>
                                        <strong>Medical records writing requires work:</strong> Ensure that your clinical narrative notes are comprehensive yet brief. State exact vitals in Objective, and formulate exhaustive Management Plan (P) blocks—expressing acute therapeutic drug dosages, continuous telemetry monitoring guidelines, and warning signs for emergency discharge.
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2 mt-4 text-[11px] text-stone-400 font-medium">
                                    <p className="flex items-start gap-1.5">
                                      <span className="text-emerald-500 font-bold">✓</span> Verify chronic complaints and baseline vitals.
                                    </p>
                                    <p className="flex items-start gap-1.5">
                                      <span className="text-emerald-500 font-bold">✓</span> Formulate distinct differentials with clear probabilities.
                                    </p>
                                    <p className="flex items-start gap-1.5">
                                      <span className="text-emerald-500 font-bold">✓</span> Build clean, concise plans with concrete dosage thresholds.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setActiveTabSubView("cases");
                                  window.scrollTo({ top: 300, behavior: "smooth" });
                                }}
                                className="mt-8 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
                              >
                                Launch Next OSCE Case <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Longitudinal Log Accordion */}
                        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs mt-4">
                          <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 flex justify-between items-center px-0.5">
                            <span className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-emerald-600" />
                              Clinical SOAP Encounter Vault & Logs
                            </span>
                            <span className="text-xs font-mono text-stone-400 font-medium bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-full">
                              Total {evaluationHistory.length} Runs recorded
                            </span>
                          </h3>

                          <div className="space-y-4">
                            {evaluationHistory.map((item, idx) => {
                              const itemScore = getReportOverallScore(item.report);
                              const isSelected = selectedHistoricalReportId === item.id;

                              return (
                                <div key={item.id} className="border border-stone-150 rounded-xl overflow-hidden transition-all shadow-2xs hover:shadow-sm">
                                  {/* Accordion trigger box */}
                                  <div
                                    onClick={() => setSelectedHistoricalReportId(isSelected ? null : item.id)}
                                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 cursor-pointer transition-colors select-none ${
                                      isSelected ? "bg-emerald-50/20 border-b border-stone-150" : "bg-stone-50/40 hover:bg-stone-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg font-serif text-sm w-10 h-10 flex items-center justify-center font-black ${
                                        item.report?.overallGrade?.startsWith("A") 
                                          ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                                          : item.report?.overallGrade?.startsWith("B")
                                          ? "bg-sky-50 text-sky-800 border border-sky-100"
                                          : "bg-amber-50 text-amber-800 border border-amber-100"
                                      }`}>
                                        {item.report?.overallGrade || "B"}
                                      </div>
                                      <div>
                                        <h4 className="text-xs font-bold text-stone-900">Encounter Run #{evaluationHistory.length - idx} • Patient: {item.caseName}</h4>
                                        <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                                          Completed {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3 sm:mt-0 font-mono text-xs text-stone-650">
                                      <div>
                                        <span className="text-stone-400">Score:</span> <strong className="text-emerald-800 font-bold">{itemScore}%</strong>
                                      </div>
                                      <div className="hidden md:block">
                                        <span className="text-stone-400">Lab Cost:</span> <strong className="text-stone-800">${item.report?.diagnosticOrdering?.totalCost || 0}</strong>
                                      </div>
                                      <div className="text-emerald-700 font-black uppercase tracking-widest text-[9.5px]">
                                        {isSelected ? "▲ Hide Case File" : "▼ Review Case File"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Accordion panel contents */}
                                  {isSelected && (
                                    <div className="p-6 bg-white space-y-6 border-t border-stone-100 animate-in slide-in-from-top-3 duration-250">
                                      {/* Attending statement banner */}
                                      <div className="bg-emerald-950 text-emerald-50 p-4 rounded-xl border border-emerald-900 text-xs">
                                        <p className="font-bold flex items-center gap-1.5 text-emerald-300">
                                          <BrainCircuit className="w-4 h-4" />
                                          Attending Clinician Summary Appraisal (Run #{evaluationHistory.length - idx}):
                                        </p>
                                        <p className="mt-2 text-stone-200 leading-relaxed font-sans">{item.report.overallSummary}</p>
                                      </div>

                                      {/* Component summaries breakdown cards */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Diagnosis accuracy block */}
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs text-stone-750 space-y-1 shadow-2xs">
                                          <p className="font-bold text-stone-900 flex justify-between">
                                            <span>🎯 Diagnostic Accuracy:</span>
                                            <span className="text-emerald-700 font-mono font-bold">{item.report.diagnosisAccuracy.score}/100</span>
                                          </p>
                                          <p className="text-emerald-800 font-serif font-black mt-1 leading-snug">Confirmed Diagnosis: {item.report.diagnosisAccuracy.correctDiagnosis}</p>
                                          <p className="text-stone-550 pt-1 leading-relaxed font-sans text-xs">{item.report.diagnosisAccuracy.feedback}</p>
                                        </div>

                                        {/* History Inquiry block */}
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs text-stone-750 space-y-1 shadow-2xs">
                                          <p className="font-bold text-stone-900 flex justify-between">
                                            <span>🗣️ History Taking Inquiry:</span>
                                            <span className="text-emerald-700 font-mono font-bold">{item.report.historyTaking.score}% ({item.report.historyTaking.grade})</span>
                                          </p>
                                          <p className="text-stone-550 pt-1 leading-relaxed font-sans text-xs">{item.report.historyTaking.feedback}</p>
                                          {item.report.historyTaking?.missedOpportunityQuestions?.length > 0 && (
                                            <div className="mt-2.5 pt-2 border-t border-stone-250">
                                              <p className="font-bold text-rose-800 text-[10px] uppercase font-mono tracking-wider">Missed Opportunities:</p>
                                              <ul className="list-disc ml-4 text-[10px] text-stone-600 mt-1 space-y-0.5 font-sans">
                                                {item.report.historyTaking.missedOpportunityQuestions.map((q: string, i: number) => (
                                                  <li key={i}>{q}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>

                                        {/* Physical Exam block */}
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs text-stone-750 space-y-1 shadow-2xs">
                                          <p className="font-bold text-stone-900 flex justify-between">
                                            <span>🩺 Physical Examination Focus:</span>
                                            <span className="text-emerald-700 font-mono font-bold">{item.report.physicalExamChoices.score}% ({item.report.physicalExamChoices.grade})</span>
                                          </p>
                                          <p className="text-stone-550 pt-1 leading-relaxed font-sans text-xs">{item.report.physicalExamChoices.feedback}</p>
                                        </div>

                                        {/* Labs expenditure block */}
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs text-stone-750 space-y-1 shadow-2xs">
                                          <p className="font-bold text-stone-900 flex justify-between">
                                            <span>🧪 Lab Stewardship & Wastages:</span>
                                            <span className="text-emerald-700 font-mono font-bold">{item.report.diagnosticOrdering.score}% ({item.report.diagnosticOrdering.grade})</span>
                                          </p>
                                          <p className="text-amber-850 font-bold mt-1 font-mono text-[11px]">${item.report.diagnosticOrdering.totalCost} Accumulated Patient Fees</p>
                                          <p className="text-stone-550 pt-1 leading-relaxed font-sans text-xs">{item.report.diagnosticOrdering.costEfficiencyFeedback}</p>
                                        </div>
                                      </div>

                                      {/* SOAP notes reviews */}
                                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-stone-750 space-y-2">
                                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                          <FileText className="w-4 h-4 text-slate-500" />
                                          Custom Documented SOAP Notes Feedback:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[11px] pt-1">
                                          <div>
                                            <p className="font-semibold text-slate-800 uppercase font-mono text-[9px] tracking-widest">Subjective (S)</p>
                                            <p className="text-stone-550 mt-1 leading-relaxed font-sans">{item.report.soapDocumentation.subjectiveFeedback}</p>
                                          </div>
                                          <div>
                                            <p className="font-semibold text-slate-800 uppercase font-mono text-[9px] tracking-widest">Objective (O)</p>
                                            <p className="text-stone-550 mt-1 leading-relaxed font-sans">{item.report.soapDocumentation.objectiveFeedback}</p>
                                          </div>
                                          <div>
                                            <p className="font-semibold text-slate-800 uppercase font-mono text-[9px] tracking-widest">Assessment (A)</p>
                                            <p className="text-stone-550 mt-1 leading-relaxed font-sans">{item.report.soapDocumentation.assessmentFeedback}</p>
                                          </div>
                                          <div>
                                            <p className="font-semibold text-slate-800 uppercase font-mono text-[9px] tracking-widest">Plan (P)</p>
                                            <p className="text-stone-550 mt-1 leading-relaxed font-sans">{item.report.soapDocumentation.planFeedback}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        ) : evaluationReport ? (
          /* 2. VIEW B: ATTENDING ASSESSMENT REPORT AFTER SUBMISSION */
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto" id="evaluation-card">
            <div className="border-b border-stone-150 pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  OSCE Attending Appraisal Report
                </span>
                <h2 className="text-2xl font-serif font-black text-stone-900 mt-2">Encounter Review: {activeCase.name}</h2>
                <p className="text-stone-500 text-xs font-mono mt-1">Provider ID: GNK-OSCE-2026 • Attesting via Gemini Flash</p>
              </div>
              <button
                id="btn-return-cases-top"
                onClick={endEncounterReset}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 px-4 rounded-xl text-sm font-semibold border border-stone-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-stone-500" />
                Return to Clinic Desk
              </button>
            </div>

            {/* Scoreboard Jumbo Grade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-emerald-950 text-white rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10 bg-white/10 text-white p-12 rounded-full">
                  <Activity className="w-24 h-24 text-emerald-500" />
                </div>
                <p className="text-emerald-200/80 text-xs font-mono font-semibold uppercase tracking-wider">Overall Attending Grade</p>
                <div className="text-6xl font-serif font-black text-emerald-300 my-2">{evaluationReport.overallGrade}</div>
                <div className="w-full bg-emerald-900/50 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                    style={{
                      width:
                        evaluationReport.overallGrade.startsWith("A")
                          ? "95%"
                          : evaluationReport.overallGrade.startsWith("B")
                          ? "82%"
                          : evaluationReport.overallGrade.startsWith("C")
                          ? "72%"
                          : "50%"
                    }}
                  ></div>
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-sky-500" />
                    Attending Physician Case Summary
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5 font-sans">
                    {evaluationReport.overallSummary}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4 text-xs font-mono text-slate-500">
                  <span>Diagnostic cost of ordered labs: <strong className="text-slate-800">${evaluationReport.diagnosticOrdering.totalCost}</strong></span>
                  <span className="flex items-center gap-1"><BrainCircuit className="w-3.5 h-3.5 text-sky-500" /> Attested using Gemini AI Rules</span>
                </div>
              </div>
            </div>

            {/* Detailed Component Breakdown Cards */}
            <div className="space-y-6">
              
              {/* 1. Diagnostic Accuracy */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-bold text-slate-950 flex items-center gap-2 text-sm md:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Diagnostic & Assessment Accuracy
                  </h4>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                    Score: {evaluationReport.diagnosisAccuracy.score}/100
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/50">
                    <div>
                      <p className="font-semibold text-slate-500 text-[10px] uppercase font-mono">Your suspected diagnosis:</p>
                      <p className="text-slate-900 font-semibold mt-0.5">{soapNote.assessment.diagnosis || "No primary formulary selected"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500 text-[10px] uppercase font-mono">Confirmed OSCE Case Diagnosis:</p>
                      <p className="text-emerald-950 font-bold mt-0.5">{evaluationReport.diagnosisAccuracy.correctDiagnosis}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-2 font-sans">{evaluationReport.diagnosisAccuracy.feedback}</p>
                </div>
              </div>

              {/* 2. History Taking */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-bold text-slate-950 flex items-center gap-2 text-sm md:text-base">
                    <User className="w-5 h-5 text-indigo-500" />
                    History Taking Inquiry
                  </h4>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                    Attending Grade: {evaluationReport.historyTaking.grade} ({evaluationReport.historyTaking.score}%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">{evaluationReport.historyTaking.feedback}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/40">
                    <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> High-Yield Clues Uncovered
                    </h5>
                    {evaluationReport.historyTaking.strengths.length > 0 ? (
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed font-sans">
                        {evaluationReport.historyTaking.strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No historical inquiries identified</p>
                    )}
                  </div>

                  {/* Missed Diagnostic Questions */}
                  <div className="bg-rose-50/30 p-3.5 rounded-xl border border-rose-100/40">
                    <h5 className="font-bold text-rose-900 text-xs flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Missed Inquiries & Systems Reviews
                    </h5>
                    {evaluationReport.historyTaking.missedOpportunityQuestions.length > 0 ? (
                      <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed font-sans">
                        {evaluationReport.historyTaking.missedOpportunityQuestions.map((mis, idx) => (
                          <li key={idx}>{mis}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Perfect clinical screening!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Physical Exam Selection */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-bold text-slate-950 flex items-center gap-2 text-sm md:text-base">
                    <Stethoscope className="w-5 h-5 text-teal-500" />
                    Physical Examination Selection
                  </h4>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full">
                    Grade: {evaluationReport.physicalExamChoices.grade} ({evaluationReport.physicalExamChoices.score}%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{evaluationReport.physicalExamChoices.feedback}</p>
              </div>

              {/* 4. Diagnostic Ordering & Stewardship */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-bold text-slate-950 flex items-center gap-2 text-sm md:text-base">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    Diagnostic Resource Stewardship
                  </h4>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                    Grade: {evaluationReport.diagnosticOrdering.grade} ({evaluationReport.diagnosticOrdering.score}%)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-sans mb-4">
                  <div className="bg-amber-50/30 p-3 rounded-xl border border-amber-100/50 flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Total Diagnostics Cost</p>
                    <p className="text-xl font-bold text-amber-800 mt-1">${evaluationReport.diagnosticOrdering.totalCost}</p>
                  </div>
                  <div className="sm:col-span-2 flex flex-col justify-center">
                    <p className="text-slate-600 leading-relaxed">{evaluationReport.diagnosticOrdering.costEfficiencyFeedback}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  {/* Indispensable ordered items */}
                  <div className="bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/30">
                    <h5 className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1">
                      Indispensable Labs Obtained
                    </h5>
                    {evaluationReport.diagnosticOrdering.optimalTests.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        {evaluationReport.diagnosticOrdering.optimalTests.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic">No core diagnostics ordered</p>
                    )}
                  </div>
                  
                  {/* Redundant items */}
                  <div className="bg-amber-50/10 p-3 rounded-xl border border-amber-100/20">
                    <h5 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1">
                      Excessive / Redundant Orders
                    </h5>
                    {evaluationReport.diagnosticOrdering.redundantTests.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        {evaluationReport.diagnosticOrdering.redundantTests.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 italic font-medium text-[11px]">Excellent stewardship! Minimal cost path.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. SOAP Note Documentation */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                  <h4 className="font-bold text-slate-950 flex items-center gap-2 text-sm md:text-base">
                    <FileText className="w-5 h-5 text-blue-500" />
                    SOAP Clinical Note Quality
                  </h4>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                    Grade: {evaluationReport.soapDocumentation.grade} ({evaluationReport.soapDocumentation.score}%)
                  </span>
                </div>
                
                <div className="space-y-4 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900 border-b border-slate-200 pb-1 mb-1.5 block">Subjective (S) Feedback:</strong>
                      <p className="text-slate-600 leading-relaxed mt-1">{evaluationReport.soapDocumentation.subjectiveFeedback}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900 border-b border-slate-200 pb-1 mb-1.5 block">Objective (O) Feedback:</strong>
                      <p className="text-slate-600 leading-relaxed mt-1">{evaluationReport.soapDocumentation.objectiveFeedback}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900 border-b border-slate-200 pb-1 mb-1.5 block">Assessment (A) Feedback:</strong>
                      <p className="text-slate-600 leading-relaxed mt-1">{evaluationReport.soapDocumentation.assessmentFeedback}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900 border-b border-slate-200 pb-1 mb-1.5 block">Plan (P) Feedback:</strong>
                      <p className="text-slate-600 leading-relaxed mt-1">{evaluationReport.soapDocumentation.planFeedback}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Reset Actions */}
            <div className="mt-8 pt-6 border-t border-slate-150 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                id="btn-restart-encounter"
                onClick={() => activeCase && startEncounter(activeCase)}
                className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 px-6 rounded-xl text-sm border border-stone-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                Re-Try This Patient Case
              </button>
              <button
                id="btn-return-desk-bottom"
                onClick={endEncounterReset}
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
              >
                <Sprout className="w-4 h-4 text-emerald-200" />
                Proceed to Clinic Desk
              </button>
            </div>
          </div>
        ) : (
          /* 3. VIEW C: ACTIVE ENCOUNTER SPLIT DECK */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: History / Exams / Labs Pane (Cols 1-5) */}
            <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl flex flex-col h-[650px] shadow-xs relative overflow-hidden" id="left-diagnostic-pane">
              
              {/* Patient Basic Card Header */}
              <div className="bg-emerald-950 text-white p-4 flex justify-between items-center shrink-0 border-b border-emerald-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-emerald-900/60 border border-emerald-800/60 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm leading-tight">{activeCase.name}</h3>
                    <p className="text-[10px] text-emerald-100/80 mt-0.5">{activeCase.gender}, {activeCase.age} years old • CC: {activeCase.chiefComplaint.split(" ").slice(0,4).join(" ")}...</p>
                  </div>
                </div>
                <button
                  id="btn-cancel-encounter"
                  onClick={endEncounterReset}
                  className="text-stone-300 hover:text-white hover:bg-emerald-900/50 p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Exit Case
                </button>
              </div>

              {/* Left Column Tabs Selector */}
              <div className="flex bg-stone-100 shrink-0 p-1 border-b border-stone-250">
                <button
                  id="tab-btn-history"
                  onClick={() => setCurrentTab("history")}
                  className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    currentTab === "history"
                      ? "bg-white text-emerald-850 shadow-xs border border-stone-200/50"
                      : "text-stone-600 hover:bg-stone-200/50"
                  }`}
                >
                  1. History Taking
                </button>
                <button
                  id="tab-btn-exam"
                  onClick={() => setCurrentTab("exam")}
                  className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    currentTab === "exam"
                      ? "bg-white text-emerald-850 shadow-xs border border-stone-200/50"
                      : "text-stone-600 hover:bg-stone-200/50"
                  }`}
                >
                  2. Physical Exam
                </button>
                <button
                  id="tab-btn-labs"
                  onClick={() => setCurrentTab("labs")}
                  className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    currentTab === "labs"
                      ? "bg-white text-emerald-850 shadow-xs border border-stone-200/50"
                      : "text-stone-600 hover:bg-stone-200/50"
                  }`}
                >
                  3. Diagnostic Labs
                </button>
              </div>

              {/* Tab Display Area */}
              <div className="flex-1 overflow-y-auto p-4 relative min-h-0 bg-stone-50/30">
                
                {/* TAB 1: HISTORY TAKING DIALOG */}
                {currentTab === "history" && (
                  <div className="flex flex-col h-full bg-none" id="history-talking-area">
                    <div className="bg-emerald-50/60 border border-emerald-150 rounded-xl p-3 text-xs text-emerald-850 leading-relaxed mb-3 flex items-start gap-2">
                      <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        Ask clinical questions to explore and document the clinical history. Uncover symptoms, family risk, and timeline clues.
                      </div>
                    </div>

                    {/* Chat Bubble Container */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 pb-4">
                      {dialogHistory.map((msg, index) => {
                        const isStudent = msg.role === "user";
                        return (
                          <div
                            key={index}
                            className={`flex flex-col ${isStudent ? "items-end" : "items-start"}`}
                          >
                            <span className="text-[10px] text-stone-400 font-mono mb-1 capitalize text-right">
                              {isStudent ? "Student Provider" : activeCase.name}
                            </span>
                            <div
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                                isStudent
                                  ? "bg-emerald-750 text-white font-medium rounded-tr-none"
                                  : "bg-white text-stone-850 border border-stone-200/80 rounded-tl-none shadow-xs"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        );
                      })}
                      {isPatientResponding && (
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] text-stone-400 font-mono mb-1">{activeCase.name}</span>
                          <div className="bg-stone-100 text-stone-500 rounded-2xl rounded-tl-none px-4 py-2 text-xs border border-stone-200/50 flex items-center gap-1.5 font-sans font-medium">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
                            <span>Patient is answering...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input Console */}
                    <form onSubmit={handleAskQuestion} className="flex gap-2 mt-2 shrink-0 pt-2 border-t border-stone-200">
                      <input
                        id="chat-input"
                        type="text"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        placeholder="e.g. Can you describe where you feel the pain?"
                        disabled={isPatientResponding}
                        className="flex-1 bg-white border border-stone-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 min-h-[38px] disabled:bg-stone-50 text-stone-850"
                      />
                      <button
                        id="btn-chat-submit"
                        type="submit"
                        disabled={isPatientResponding || !userQuestion.trim()}
                        className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-250 text-white rounded-xl px-4 py-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer min-h-[38px]"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 2: PHYSICAL EXAMS */}
                {currentTab === "exam" && (
                  <div className="space-y-4" id="physical-exams-area">
                    <div className="bg-stone-100 border border-stone-200/60 p-3 rounded-xl text-xs text-stone-650 leading-relaxed flex items-start gap-2">
                      <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                      <div>
                        Review findings from physical body evaluations. Click to perform exams; findings will register automatically to your SOAP notebook records.
                      </div>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(activeCase.physicalExams).map(([key, val]) => {
                        const value = val as { label: string; findings: string };
                        const isDone = examsPerformed.includes(key);
                        return (
                          <div
                            key={key}
                            id={`exam-box-${key}`}
                            className={`border rounded-xl p-3.5 transition-all ${
                              isDone
                                ? "bg-emerald-50/20 border-emerald-300 shadow-xs"
                                : "bg-white border-stone-200 hover:border-stone-300"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <h5 className="font-bold text-xs text-stone-900">{value.label}</h5>
                              {!isDone ? (
                                <button
                                  id={`btn-exam-run-${key}`}
                                  onClick={() => performExam(key)}
                                  className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                                >
                                  Evaluate System
                                </button>
                              ) : (
                                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                                  Done
                                </span>
                              )}
                            </div>
                            {isDone && (
                              <p className="text-xs text-stone-700 leading-relaxed mt-2 p-2 bg-stone-50/55 rounded border border-emerald-100/50 font-sans font-medium">
                                {value.findings}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: DIAGNOSTIC LABS & COST CONTROL */}
                {currentTab === "labs" && (
                  <div className="space-y-4" id="labs-orders-area">
                    <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed flex items-start gap-2.5 mb-3">
                      <DollarSign className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Clinical Value & Cost Awareness</p>
                        <p className="mt-0.5">Every test carries financial costs ($) for the patient. Select essential gold-standard diagnostic orders to secure safety, avoiding diagnostic redundancy.</p>
                      </div>
                    </div>
                                       {/* Labs Running Cost Sticker */}
                    <div className="bg-emerald-950 text-white rounded-xl p-3 flex justify-between items-center text-xs font-mono border border-emerald-900">
                      <span>RUNNING DIAGNOSTICS COST:</span>
                      <span className="text-sm font-bold text-amber-300 font-sans">${calculateTotalCost()}</span>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(activeCase.labsAndDiagnostics).map(([key, val]) => {
                        const value = val as { label: string; cost: number; result: string; comments?: string };
                        const isOrdered = labsOrdered.includes(key);
                        return (
                          <div
                            key={key}
                            id={`lab-box-${key}`}
                            className={`border rounded-xl p-3.5 transition-all ${
                              isOrdered
                                ? "bg-emerald-50/20 border-emerald-300 shadow-xs"
                                : "bg-white border-stone-200 hover:border-stone-300"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <h5 className="font-bold text-xs text-stone-900">{value.label}</h5>
                                <p className="text-[10px] text-stone-500 font-medium font-sans mt-0.5">Procedural Charge: <strong className="text-amber-700">${value.cost}</strong></p>
                              </div>
                              {!isOrdered ? (
                                <button
                                  id={`btn-lab-buy-${key}`}
                                  onClick={() => orderLab(key)}
                                  className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                                >
                                  Order Test
                                </button>
                              ) : (
                                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                                  Obtained
                                </span>
                              )}
                            </div>
                            
                            {isOrdered && (
                              <div className="mt-1.5 space-y-2">
                                <div className="text-xs text-amber-800 bg-amber-50/50 border border-amber-100/30 p-2.5 rounded-lg leading-relaxed font-sans font-medium">
                                  <strong className="text-[10px] font-bold uppercase block text-amber-900">Result Values:</strong>
                                  {value.result}
                                </div>
                                {value.comments && (
                                  <p className="text-[10px] italic text-stone-500 pl-1 font-sans">{value.comments}</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN: The SOAP Notebook & Diagnostics Panel (Cols 6-12) */}
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-5 md:p-6 flex flex-col justify-between shadow-xs overflow-y-auto max-h-[1200px]" id="soap-notebook-pane">
              <div>
                <div className="border-b border-stone-150 pb-4 mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-750 font-medium" />
                    <div>
                      <h4 className="font-serif font-black text-stone-900 text-sm md:text-base">Ginkgo Provider Work Station</h4>
                      <p className="text-[10px] text-stone-500">Document history, exams, and assessments into a clinical SOAP structure.</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                    Active SOAP Notes
                  </span>
                </div>

                <div className="space-y-5">
                  {/* S: SUBJECTIVE */}
                  <div>
                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Subjective (S) — History taking logs</span>
                      <span className="text-[10px] font-medium text-stone-400 lowercase font-mono">CC, HPI, Past Med, Social</span>
                    </label>
                    <textarea
                      id="soap-subjective"
                      value={soapNote.subjective}
                      onChange={(e) => setSoapNote({ ...soapNote, subjective: e.target.value })}
                      placeholder="David Miller is a 58yo male presenting with sudden onset retrosternal crushing pressure (8/10 pain) that started 1hr ago while mowing lawn..."
                      rows={4}
                      className="w-full bg-stone-50 border border-stone-200 focus:bg-white rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 font-sans text-stone-850"
                    />
                  </div>

                  {/* O: OBJECTIVE */}
                  <div>
                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Objective (O) — Vitals & Findings</span>
                      <span className="text-[10px] font-medium text-rose-600 tracking-normal lowercase font-sans">Automated from exams performed</span>
                    </label>
                    <textarea
                      id="soap-objective"
                      value={soapNote.objective}
                      onChange={(e) => setSoapNote({ ...soapNote, objective: e.target.value })}
                      placeholder="Add exams in left column to populate findings automatically..."
                      rows={3}
                      className="w-full bg-stone-105 border border-stone-200 rounded-xl p-3 text-xs leading-relaxed focus:outline-none font-mono text-stone-650 text-xs"
                      disabled
                    />
                  </div>

                  {/* A: ASSESSMENT */}
                  <div className="border-t border-stone-150 pt-4">
                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Assessment (A) — Differential Diagnostic Deck</span>
                      <span className="text-[10px] font-medium text-emerald-700 bold tracking-normal font-sans">Total must equal 100%</span>
                    </label>

                    {/* Differentials Rows List */}
                    <div className="space-y-3 mb-4">
                      {soapNote.assessment.differentials.map((diff, index) => (
                        <div key={diff.id} className="grid grid-cols-12 gap-2 items-center bg-stone-50/55 p-2.5 rounded-xl border border-stone-200/50">
                          <div className="col-span-5">
                            <input
                              id={`soap-diff-diag-${diff.id}`}
                              type="text"
                              value={diff.diagnosis}
                              onChange={(e) => updateDifferential(diff.id, "diagnosis", e.target.value)}
                              placeholder={`Differential #${index + 1}`}
                              className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-stone-850"
                            />
                          </div>
                          
                          <div className="col-span-3 flex items-center gap-1 bg-white border border-stone-300 rounded-lg px-2 py-1.5">
                            <input
                              id={`soap-diff-prob-${diff.id}`}
                              type="number"
                              min={0}
                              max={100}
                              value={diff.probability}
                              onChange={(e) => updateDifferential(diff.id, "probability", Number(e.target.value) || 0)}
                              className="w-full bg-transparent focus:outline-none text-right font-semibold text-xs text-stone-850"
                            />
                            <span className="text-stone-400 text-xs font-bold">%</span>
                          </div>

                          <div className="col-span-3">
                            <input
                              id={`soap-diff-reason-${diff.id}`}
                              type="text"
                              value={diff.reasoning}
                              onChange={(e) => updateDifferential(diff.id, "reasoning", e.target.value)}
                              placeholder="Clinical Rationale"
                              className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-stone-850"
                            />
                          </div>

                          <div className="col-span-1 text-center">
                            <button
                              id={`btn-diff-delete-${diff.id}`}
                              onClick={() => deleteDifferentialRow(diff.id)}
                              className="p-1 px-2.5 text-rose-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-md border border-rose-200 transition-colors cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs mb-4">
                      <button
                        id="btn-diff-add-row"
                        onClick={addDifferentialRow}
                        className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Diagnosis Row
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-stone-500">Probability Sum:</span>
                        <span
                          className={`font-semibold font-mono rounded px-2 py-0.5 border ${
                            soapNote.assessment.differentials.reduce((a, c) => a + (Number(c.probability) || 0), 0) === 100
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {soapNote.assessment.differentials.reduce((a, c) => a + (Number(c.probability) || 0), 0)}% / 100%
                        </span>
                      </div>
                    </div>

                    {/* Primary suspected diagnosis */}
                    <div className="mt-4 bg-emerald-50/20 border border-emerald-150 p-3 rounded-xl">
                      <label className="block text-xs font-bold text-emerald-950 mb-1">SUSPECTED PRIMARY CLINICAL DIAGNOSIS:</label>
                      <input
                        id="soap-primary-diag"
                        type="text"
                        value={soapNote.assessment.diagnosis}
                        onChange={(e) =>
                          setSoapNote({
                            ...soapNote,
                            assessment: { ...soapNote.assessment, diagnosis: e.target.value }
                          })
                        }
                        placeholder="e.g. Acute ST-Elevation Myocardial Infarction of the Anterior Wall"
                        className="w-full bg-white border border-emerald-250 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 font-sans font-semibold text-stone-850"
                      />
                    </div>
                  </div>

                  {/* P: PLAN */}
                  <div className="border-t border-stone-150 pt-4">
                    <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Therapeutic & Management Plan (P)</span>
                      <span className="text-[10px] font-medium text-stone-400 lowercase font-mono">Admission status, pharmacology, monitorings</span>
                    </label>
                    <textarea
                      id="soap-plan"
                      value={soapNote.plan}
                      onChange={(e) => setSoapNote({ ...soapNote, plan: e.target.value })}
                      placeholder="Immediately administer 324mg non-enteric chewed Aspirin, IV Heparin bolus. Active Cath Lab emergent. Admit CCU, monitor cardiac metrics..."
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 focus:bg-white rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 font-sans text-stone-850"
                    />
                  </div>
                </div>
              </div>

              {/* Attending evaluate dispatcher */}
              <div className="mt-8 pt-4 border-t border-stone-155 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="text-[10px] text-stone-400 leading-normal text-center sm:text-left">
                  Note submission locks the current encounter and sends your SOAP note and test records to the AI Attending Physician engine for diagnostic scoring.
                </div>
                <button
                  id="btn-soap-submit"
                  onClick={submitForAttendingEvaluation}
                  disabled={submitting}
                  className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-extrabold tracking-wide uppercase py-3.5 px-6 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md shrink-0 border border-emerald-800"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Attending is analyzing SOAP Note...</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="w-4 h-4 text-emerald-200" />
                      <span>Submit SOAP Note to Attending</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="bg-stone-100 border-t border-stone-200 py-8 mt-16 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center font-mono text-[11px] text-stone-500 gap-4">
          <p className="flex items-center gap-1.5 font-sans">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>© 2026 Ginkgo Simulation Project. Designed for botanical OSCE educational reasoning only.</span>
          </p>
          <p className="flex items-center gap-1.5 font-sans">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Supported by client-vetted Google Gemini API
          </p>
        </div>
      </footer>
    </div>
  );
}
