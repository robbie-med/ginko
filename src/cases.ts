export interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  presentationText: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    temperatureF: number;
    o2Sat: string;
  };
  physicalExams: {
    [key: string]: {
      label: string;
      findings: string;
    };
  };
  labsAndDiagnostics: {
    [key: string]: {
      label: string;
      cost: number;
      result: string;
      comments?: string;
    };
  };
  // Secret details for the AI roleplay
  aiBackground: {
    personality: string;
    detailedHpi: string; // History of Present Illness
    medicalHistory: string;
    socialHistory: string;
    familyHistory: string;
    medications: string;
    allergies: string;
    nonDisclosedSecrets: string; // Secrets they don't say unless asked directly
  };
  correctDiagnosis: string;
}

export const CLINICAL_CASES: PatientCase[] = [
  {
    id: "case_cardiology_stemi",
    name: "Arthur Pendelton",
    age: 62,
    gender: "Male",
    chiefComplaint: "My chest feels like an elephant is sitting right in the middle of it, and it's moving up into my jaw.",
    presentationText: "A 62-year-old male is wheeled into the emergency department. He is clutching his chest, visibly diaphoretic, pale, and breathing rapidly. He appears in severe acute distress.",
    vitals: {
      bloodPressure: "158/94 mmHg",
      heartRate: 104,
      respiratoryRate: 24,
      temperatureF: 98.9,
      o2Sat: "92% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is anxious, pale, markedly diaphoretic, and leaning forward. He is tachypneic but speaking in short, full sentences."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. S1 and S2 are distinct; a faint S4 gallop is audible at the apex. No carotid bruits. Peripheral pulses are 2+ but equal throughout."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Bilateral basilar crackles extending roughly 1/3 up both lung fields. No expiratory wheezing."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-distended, completely non-tender with normal active bowel sounds. No hepatosplenomegaly."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Grossly intact. Oriented to person, place, and time. Pupils are equal, round, and reactive to light."
      }
    },
    labsAndDiagnostics: {
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 11.2 x10^3/uL (mild leukocytosis), Hb: 14.5 g/dL, Platelets: 240 x10^3/uL.",
        comments: "Mild reactive leukocytosis common in acute tissue injury."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 138 mEq/L, Potassium: 4.0 mEq/L, Glucose: 142 mg/dL (mild stress hyperglycemia), Creatinine: 1.1 mg/dL.",
        comments: "Electrolytes and renal baseline within safe operational parameters for urgent interventions."
      },
      ecg_12_lead: {
        label: "12-Lead Electrocardiogram (ECG)",
        cost: 150,
        result: "Sinus tachycardia at 105 bpm. Notable >2mm ST-segment elevations in leads V1-V4 with reciprocal ST depressions in leads II, III, and aVF.",
        comments: "CRITICAL VALUE. Confirms acute anterior wall myocardial infarction. Immediate reperfusion protocol required."
      },
      troponin_i: {
        label: "Serum Troponin I (Initial)",
        cost: 120,
        result: "0.45 ng/mL (Elevated; Reference <0.04 ng/mL).",
        comments: "Confirms acute myocardial necrosis. Note: Reperfusion should not be delayed waiting for serial updates if ECG is definitive."
      },
      cxr_portable: {
        label: "Chest X-Ray (Portable AP)",
        cost: 220,
        result: "Mild cardiomegaly with clear evidence of pulmonary venous congestion and cephalization of vessels. No widening of the mediastinum.",
        comments: "Confirms early congestive heart failure secondary to ischemia; rules out obvious aortic dissection presentation."
      }
    },
    aiBackground: {
      personality: "Highly anxious, fearful of dying, keeps rubbing his chest and left shoulder. Answers questions urgently and repeatedly asks if he is having a heart attack.",
      detailedHpi: "Onset was sudden, approximately 45 minutes prior to arrival while shoveling his driveway. The pain is described as a crushing, heavy pressure, rated 9/10 in severity. It radiates intensely into his left jaw and down the medial aspect of his left arm. Unrelieved by rest or taking two old aspirin tablets from his medicine cabinet.",
      medicalHistory: "Essential hypertension diagnosed 10 years ago. Hyperlipidemia. Mild osteoarthritis of the knees.",
      socialHistory: "Works as an accountant. 30 pack-year cigarette smoking history; currently smokes half a pack a day. Drinks alcohol socially on weekends (2-3 beers). Sedentary lifestyle.",
      familyHistory: "Father died suddenly of a 'heart attack' at age 51. Mother has Type 2 Diabetes.",
      medications: "Lisinopril 20mg daily (poorly compliant, often forgets), Atorvastatin 20mg daily (rarely takes due to reported mild muscle aches).",
      allergies: "NKDA (No Known Drug Allergies).",
      nonDisclosedSecrets: "If explicitly asked about erectile dysfunction medications, he will admit he took Sildenafil (Viagra) approximately 4 hours ago. This is a critical contraindication for administration of nitrates!"
    },
    correctDiagnosis: "ST-Elevation Myocardial Infarction (STEMI)"
  },
  {
    id: "case_neurology_stroke",
    name: "Elena Rostova",
    age: 74,
    gender: "Female",
    chiefComplaint: "My grandmother suddenly stopped talking clearly over breakfast, and her right hand keeps dropping her coffee cup.",
    presentationText: "A 74-year-old female is brought in by her granddaughter. The patient is awake but looks confused, demonstrating a distinct right-sided facial droop and flaccid weakness of her right upper extremity.",
    vitals: {
      bloodPressure: "182/105 mmHg",
      heartRate: 92,
      respiratoryRate: 18,
      temperatureF: 98.2,
      o2Sat: "96% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is awake, sitting up on the gurney. She appears frustrated, attempting to speak but producing mostly fragmented syllables."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Irregularly irregular rhythm noted. Pulse matches heart rate. No murmurs or rubs heard. No carotid bruits appreciated."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally. Normal inspiratory effort without accessory muscle use."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-tender, non-distended. Bowel sounds present in all quadrants."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Expressive (Broca's) aphasia noted. Right lower facial droop with sparing of the forehead. Right upper extremity motor strength is 1/5; right lower extremity is 3/5. Left-sided extremities are 5/5. Decreased sensation to light touch on the right side of the body."
      }
    },
    labsAndDiagnostics: {
      ct_head_nc: {
        label: "CT Head Non-Contrast",
        cost: 450,
        result: "No evidence of acute intracranial hemorrhage, mass effect, or midline shift. Very subtle loss of gray-white matter differentiation in the left middle cerebral artery (MCA) territory.",
        comments: "CRITICAL VALUE. Rules out hemorrhagic stroke, making the patient a potential candidate for thrombolytics depending on the time window."
      },
      fingerstick_glucose: {
        label: "Point-of-Care Fingerstick Glucose",
        cost: 25,
        result: "112 mg/dL.",
        comments: "Essential immediate triage test to rule out severe hypoglycemia acting as a stroke mimic."
      },
      coagulation_panel: {
        label: "Coagulation Panel (PT/INR/PTT)",
        cost: 95,
        result: "PT: 11.5s, INR: 1.0, PTT: 28s.",
        comments: "Confirms normal coagulation pathways; establishes baseline parameters prior to any systemic thrombolytic administration."
      },
      ecg_12_lead: {
        label: "12-Lead Electrocardiogram (ECG)",
        cost: 150,
        result: "Atrial Fibrillation with controlled ventricular response at 92 bpm. No acute ST/T wave changes.",
        comments: "Reveals the likely embolic source of the stroke (cardioembolic event secondary to atrial fibrillation)."
      }
    },
    aiBackground: {
      personality: "Expresses deep frustration due to inability to accurately form words. Can follow simple commands (e.g., 'close your eyes', 'squeeze my left hand') but cannot clearly verbalize answers.",
      detailedHpi: "Per the granddaughter, the patient was completely normal when she woke up at 7:00 AM. At 8:15 AM, while eating breakfast, she suddenly dropped her mug, slurry speech began, and she was unable to stand up without drifting to the right. Arrived at the ED at 9:10 AM (Last Known Well is established exactly at 7:00 AM, within the 4.5-hour thrombolytic window).",
      medicalHistory: "Chronic hypertension, Hyperlipidemia, and Osteoporosis. Granddaughter suspects a history of 'heart flutters' but states patient hates seeing doctors.",
      socialHistory: "Retired schoolteacher. Lives with her granddaughter. Never smoked. Drinks 1 glass of white wine occasionally.",
      familyHistory: "Mother had a history of vascular dementia; father died of a colon malignancy.",
      medications: "Amlodipine 5mg daily, Simvastatin 20mg nightly. Compliance is reported as fair.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If the granddaughter is thoroughly questioned regarding recent events, she reveals the patient had a major mechanical fall 2 weeks ago resulting in severe bruising on her torso, but denied hitting her head. (Important for evaluating relative bleeding risks)."
    },
    correctDiagnosis: "Acute Ischemic Stroke (Left MCA Territory)"
  },
  {
    id: "case_endo_dk_acidosis",
    name: "Chloe Vance",
    age: 21,
    gender: "Female",
    chiefComplaint: "I feel incredibly weak, my stomach hurts terribly, and I can't stop throwing up.",
    presentationText: "A 21-year-old female college student presents to urgent care accompanied by her roommate. She is breathing deeply and rapidly, appears severely dehydrated, and there is a distinctly fruity odor emanating from her breath.",
    vitals: {
      bloodPressure: "98/58 mmHg",
      heartRate: 118,
      respiratoryRate: 28,
      temperatureF: 99.1,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Lethargic, responds slowly to questions. Mucous membranes are dry and parched with poor skin turgor. Tachypneic with deep, labored inspirations (Kussmaul breathing)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm, normal S1/S2. Peripheral pulses are weak, thready, but symmetric."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Lungs are completely clear to auscultation bilaterally. No wheezing, rales, or rhonchi."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Diffuse, generalized tenderness across all quadrants. No rebound tenderness, rigid guarding, or localized masses. Bowel sounds are somewhat hypoactive."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Somnolent but easily arousable. Oriented to person and place, but confused about the exact date. Cranial nerves II-XII are intact."
      }
    },
    labsAndDiagnostics: {
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 132 mEq/L (mild hyponatremia), Potassium: 5.4 mEq/L (elevated), Chloride: 96 mEq/L, Bicarbonate: 8 mEq/L (severely depressed), Bun: 32 mg/dL, Creatinine: 1.4 mg/dL, Glucose: 485 mg/dL.",
        comments: "Calculated Anion Gap is 28 mEq/L ($132 - (96 + 8)$), indicating a severe wide anion gap metabolic acidosis."
      },
      abg: {
        label: "Arterial Blood Gas (ABG)",
        cost: 140,
        result: "pH: 7.12, pCO2: 22 mmHg, pO2: 95 mmHg, HCO3: 7 mEq/L.",
        comments: "Confirms uncompensated metabolic acidosis with partial respiratory compensation (hyperventilation)."
      },
      urinalysis: {
        label: "Urinalysis (UA)",
        cost: 50,
        result: "Specific Gravity: 1.030, Glucose: >1000 mg/dL, Ketones: Large (4+), Nitrites: Negative, WBCs: 2-3 /hpf.",
        comments: "Strong presence of glucosuria and marked ketonuria confirms diabetic ketoacidosis pathways."
      },
      serum_ketones: {
        label: "Serum Beta-Hydroxybutyrate",
        cost: 110,
        result: "4.8 mmol/L (Significantly elevated; normal <0.4 mmol/L).",
        comments: "Confirms the highly elevated systemic circulation of ketone bodies."
      }
    },
    aiBackground: {
      personality: "Exhausted, listless, complains of extreme thirst and a pounding headache. Frequently asks for water during the interview.",
      detailedHpi: "Symptoms began approximately 3 days ago with polyuria, polydipsia, and unexplained malaise. Over the past 24 hours, she developed progressive, generalized abdominal cramping, nausea, and persistent non-bilious vomiting. She reports losing about 6 pounds unexpectedly over the last two weeks.",
      medicalHistory: "Diagnosed with Type 1 Diabetes Mellitus at age 14.",
      socialHistory: "College junior studying architecture. Does not smoke. Drinks alcohol occasionally at social events. Denies recreational drug use.",
      familyHistory: "Mother has Hashimoto's thyroiditis. Maternal uncle has Type 1 Diabetes.",
      medications: "Insulin Glargine (Lantus) 22 units at bedtime, Insulin Lispro (Humalog) sliding scale with meals.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If asked directly about her medication compliance or recent stress, she breaks down crying and admits her subcutaneous insulin pump broke 4 days ago, and she was too ashamed and busy with final exams to go buy regular syringes and manually calculate doses."
    },
    correctDiagnosis: "Diabetic Ketoacidosis (DKA)"
  },
  {
    id: "case_gi_appendicitis",
    name: "Marcus Miller",
    age: 24,
    gender: "Male",
    chiefComplaint: "My belly hurts really bad. It started around my belly button yesterday but now it's moved down to the right side.",
    presentationText: "A 24-year-old male walks into the emergency clinic hunched over, holding his right lower abdomen. He walks slowly and carefully, visibly wincing with every step he takes.",
    vitals: {
      bloodPressure: "122/78 mmHg",
      heartRate: 98,
      respiratoryRate: 18,
      temperatureF: 101.2,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient appears in moderate acute discomfort. Grimaces when climbing onto the examination table and prefers to lie completely still with his right hip slightly flexed."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Mildly tachycardic, regular rhythm, normal S1 and S2. No murmurs appreciated."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; normal lung volumes. Shallow breathing pattern secondary to abdominal pain."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Hyperesthesia and severe focal tenderness localized to McBurney's point. Prominent rebound tenderness and voluntary guarding present. Positive Rovsing's sign (left-sided pressure elicits right-sided pain). Positive psoas sign."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Alert and completely oriented. Cranial nerves intact. Motor strength 5/5 globally."
      }
    },
    labsAndDiagnostics: {
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 14.8 x10^3/uL with 82% neutrophils (left shift), Hb: 15.1 g/dL, Platelets: 210 x10^3/uL.",
        comments: "Significant leukocytosis with neutrophilia strongly implies an acute localized bacterial or inflammatory process."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 139 mEq/L, Potassium: 3.9 mEq/L, Bicarbonate: 24 mEq/L, Glucose: 92 mg/dL, Creatinine: 0.9 mg/dL.",
        comments: "Normal basic baseline parameters; rules out severe acute metabolic or renal derangement."
      },
      ct_abdomen_pelvis: {
        label: "CT Abdomen and Pelvis with IV Contrast",
        cost: 550,
        result: "Dilated, blind-ending tubular structure in the right lower quadrant measuring 9mm in diameter. Evidence of wall thickening, prominent surrounding fat stranding, and a small calcified appendicolith at the base.",
        comments: "CRITICAL VALUE. Highly diagnostic for acute uncomplicated appendicitis. Surgical consultation indicated."
      },
      urinalysis: {
        label: "Urinalysis (UA)",
        cost: 50,
        result: "Color: Straw, WBCs: 1-2 /hpf, RBCs: 0 /hpf, Nitrites: Negative, Leukocyte Esterase: Negative.",
        comments: "Useful test to rule out acute nephrolithiasis or a urinary tract infection mimicking acute abdomen symptoms."
      }
    },
    aiBackground: {
      personality: "Guarded, quiet, speaks in a low voice. Visibly annoyed if the clinician presses on his abdomen too hard or asks him to jump up and down.",
      detailedHpi: "The pain began roughly 28 hours ago as a dull, vague, aching sensation centered directly around his umbilicus. He also noticed a complete loss of appetite and mild nausea. Around midnight, the pain migrated down into the right lower quadrant, transforming into a sharp, constant, localized ache (rated 8/10) that is severely worsened by coughing or bumping into things.",
      medicalHistory: "No prior major medical chronic illnesses. No previous surgeries.",
      socialHistory: "Graduate student in computer science. Nonsmoker. Drinks 2-3 drinks on weekends. Denies illicit drug use.",
      familyHistory: "Father had an appendectomy at age 19. No other major family medical history.",
      medications: "None. Took Acetaminophen 500mg 4 hours ago with no relief.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about his bowel movements, he mentions he hasn't been able to pass gas or have a bowel movement since the pain began, feeling intensely bloated."
    },
    correctDiagnosis: "Acute Appendicitis"
  },
  {
    id: "case_pulm_pulmonary_embolism",
    name: "Eleanor Vance",
    age: 58,
    gender: "Female",
    chiefComplaint: "I suddenly caught this sharp pain in my side when I take a deep breath, and I feel like I can't catch my air.",
    presentationText: "A 58-year-old female presents to the triage desk holding her right chest wall. She is visibly tachypneic, hypoxic on room air, and appears remarkably anxious.",
    vitals: {
      bloodPressure: "114/76 mmHg",
      heartRate: 112,
      respiratoryRate: 26,
      temperatureF: 99.4,
      o2Sat: "89% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Moderate respiratory distress, using intercostal accessory muscles. Speaking in broken 3-4 word phrases due to shortness of breath."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. Accentuated pulmonic component of S2 (loud P2). No murmurs or rubs. Jugular venous distension (JVD) is noted at 4cm above the sternal angle."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Lungs are completely clear to auscultation bilaterally with symmetric expansion. No audible wheezes, crackles, or decreased breath sounds."
      },
      extremities: {
        label: "Extremities (Vascular)",
        findings: "The right lower calf is visibly swollen, erythematous, and warm to the touch compared to the left. Exquisite tenderness elicited upon deep palpation of the right gastrocnemius."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-tender, non-distended, with normal bowel sounds throughout."
      }
    },
    labsAndDiagnostics: {
      d_dimer: {
        label: "Quantitative D-Dimer Test",
        cost: 90,
        result: "1,850 ng/mL (Significantly elevated; Reference <500 ng/mL).",
        comments: "Highly sensitive but non-specific indicator of intravascular coagulation; mandates immediate advanced imaging given her high pre-test probability."
      },
      ctpa: {
        label: "CT Pulmonary Angiography (CTPA)",
        cost: 600,
        result: "Large filling defect filling the main right pulmonary artery branching down into the lower lobe, causing near-total occlusion of the vascular lumen.",
        comments: "CRITICAL DIAGNOSTIC VALUE. Confirms an acute large segmental pulmonary embolism."
      },
      ecg_12_lead: {
        label: "12-Lead Electrocardiogram (ECG)",
        cost: 150,
        result: "Sinus tachycardia at 115 bpm. Classic S1Q3T3 pattern present (prominent S wave in lead I, Q wave in lead III, inverted T wave in lead III).",
        comments: "Classic signature of right ventricular strain secondary to acute pulmonary vascular obstruction."
      },
      abg: {
        label: "Arterial Blood Gas (ABG)",
        cost: 140,
        result: "pH: 7.49, pCO2: 30 mmHg, pO2: 58 mmHg.",
        comments: "Demonstrates acute hypoxemia accompanied by respiratory alkalosis due to compensatory hyperventilation."
      }
    },
    aiBackground: {
      personality: "Highly panicky and hyperventilating. Frequently states, 'Something is horribly wrong, I feel like I'm suffocating.'",
      detailedHpi: "The shortness of breath and chest pain began abruptly 2 hours ago while she was sitting on her couch reading. The chest pain is located on the right side, sharp and stabbing in quality, and gets severely aggravated by deep inhalation (pleuritic chest pain). No radiation to the jaw or left arm.",
      medicalHistory: "Stage II Invasive Ductal Carcinoma of the left breast, diagnosed 6 months ago; currently undergoing active systemic chemotherapy.",
      socialHistory: "Retired bank teller. Non-smoker. Never used recreational drugs. Lives with her husband.",
      familyHistory: "Mother had a history of deep vein thrombosis after a hip surgery. Father has hypertension.",
      medications: "Anastrozole 1mg daily, Ondansetron 4mg as needed for chemotherapy-induced nausea.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about recent travel or immobilization, she reveals she just returned 3 days ago from an 11-hour international flight from Europe, during which she never got up from her window seat."
    },
    correctDiagnosis: "Acute Pulmonary Embolism"
  },
  {
    id: "case_rheum_septic_arthritis",
    name: "James Sterling",
    age: 44,
    gender: "Male",
    chiefComplaint: "My left knee is completely blown up, bright red, and it hurts so bad I literally cannot stand on it.",
    presentationText: "A 44-year-old male is brought to the clinic via wheelchair. He has his left leg held rigidly out in extension, shielding his knee with his hands, looking flushed and sweaty.",
    vitals: {
      bloodPressure: "134/82 mmHg",
      heartRate: 102,
      respiratoryRate: 18,
      temperatureF: 102.4,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is toxic-appearing, febrile, diaphoretic, and in significant acute distress localized to his left lower extremity."
      },
      musculoskeletal: {
        label: "Musculoskeletal (Left Knee)",
        findings: "The left knee joint is massively erythematous, swollen, warm, and tense with a large effusion. Both active and passive ranges of motion are completely restricted (<10 degrees) due to extreme excruciating pain. Right knee is entirely normal."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Mildly tachycardic, regular rhythm. No murmurs or abnormal rubs appreciated."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; vesicular breath sounds throughout."
      },
      skin: {
        label: "Integumentary System",
        findings: "Warm skin with diffuse diaphoresis. A healing 3cm superficial laceration with some residual crusting is noted over his left patella."
      }
    },
    labsAndDiagnostics: {
      synovial_fluid_analysis: {
        label: "Arthrocentesis & Synovial Fluid Analysis",
        cost: 250,
        result: "Appearance: Purulent/Turbid. WBC Count: 85,000 /uL with 92% PMNs. Glucose: 28 mg/dL (markedly depressed). Gram Stain: Gram-positive cocci in clusters.",
        comments: "CRITICAL VALUE. Highly diagnostic for acute septic arthritis. Gram stain strongly suggests Staphylococcus aureus infection."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 16.4 x10^3/uL with a marked left shift, Hb: 13.8 g/dL, Platelets: 320 x10^3/uL.",
        comments: "Reflects a highly elevated, severe systemic inflammatory response."
      },
      esr_crp: {
        label: "Erythrocyte Sedimentation Rate & CRP",
        cost: 70,
        result: "ESR: 78 mm/hr (Elevated), CRP: 12.4 mg/dL (Significantly elevated).",
        comments: "Confirms profound active systemic inflammation."
      },
      xray_knee: {
        label: "X-Ray Left Knee (AP & Lateral)",
        cost: 180,
        result: "Large joint effusion and mild soft tissue swelling. No acute fractures, dislocations, or chronic erosive bone changes.",
        comments: "Rules out an occult structural fracture but confirms massive fluid collection within the joint space."
      }
    },
    aiBackground: {
      personality: "Very guarded, groans in pain whenever the bed is bumped. Begs for pain medication and asks if his knee will require surgery.",
      detailedHpi: "Symptoms began 48 hours ago as a mild ache in the left knee that progressed rapidly over 24 hours into an excruciating, throbbing pain (10/10) accompanied by massive swelling and rigors/chills at home. He can no longer bear any weight on the left leg.",
      medicalHistory: "Gouty arthritis (typically affecting his right 1st MTP joint), Hypertension.",
      socialHistory: "Works as a construction foreman. Does not smoke. Drinks 1-2 daily after work. No history of IV drug use.",
      familyHistory: "Father has osteoarthritis and gout.",
      medications: "Allopurinol 300mg daily (compliant), Lisinopril 10mg daily. Uses Ibuprofen as needed for joint flares.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about recent skin injuries or wounds, he reveals that 5 days ago he scraped his knee badly on a rusty metal bar at his work site. He washed it with tap water but didn't put any antibiotic ointment or bandage on it."
    },
    correctDiagnosis: "Septic Arthritis (Left Knee)"
  },
  {
    id: "case_tox_acetaminophen_overdose",
    name: "Liam O'Connor",
    age: 19,
    gender: "Male",
    chiefComplaint: "I feel really sick to my stomach, I've been throwing up, and I'm just so sorry for what I did.",
    presentationText: "A 19-year-old male is brought to the emergency department by his emotional mother. The patient is pale, appears profoundly lethargic, and is holding a plastic emesis basin.",
    vitals: {
      bloodPressure: "108/64 mmHg",
      heartRate: 88,
      respiratoryRate: 16,
      temperatureF: 98.4,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Mildly somnolent, cooperative but makes poor eye contact. Pale skin, actively nauseous with dry heaving observed during the exam."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, mild generalized tenderness to deep palpation, but notably maximal in the right upper quadrant (RUQ). No guarding, rebound, or palpable organomegaly at this time."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Normal S1, S2, regular rate and rhythm. Peripheral pulses are symmetric and intact."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation throughout all lung fields. Normal effort."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Somnolent but answers questions coherently when stimulated. No asterixis (flapping tremor) noted. Cranial nerves fully intact."
      }
    },
    labsAndDiagnostics: {
      acetaminophen_level: {
        label: "Serum Acetaminophen (APAP) Level",
        cost: 110,
        result: "165 mcg/mL (Obtained exactly 6 hours post-ingestion).",
        comments: "CRITICAL VALUE. When plotted on the Rumack-Matthew Nomogram, this level sits safely above the treatment line, indicating high risk for severe hepatotoxicity. Immediate N-Acetylcysteine (NAC) therapy is mandatory."
      },
      liver_function_tests: {
        label: "Liver Function Tests (LFTs)",
        cost: 100,
        result: "AST: 54 U/L, ALT: 48 U/L, Total Bilirubin: 0.9 mg/dL, Alkaline Phosphatase: 72 U/L.",
        comments: "Currently near normal limits; patient is within Stage I of toxicity (0-24 hours) where overt transaminitis has not yet fully peaked."
      },
      salicylate_level: {
        label: "Serum Salicylate Level",
        cost: 95,
        result: "Undetectable.",
        comments: "Standard co-ingestion screening protocol for intentional self-harm presentations."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 141 mEq/L, Potassium: 4.0 mEq/L, Bicarbonate: 22 mEq/L, Creatinine: 0.8 mg/dL, Glucose: 104 mg/dL.",
        comments: "Renal function and acid-base status are stable at presentation."
      }
    },
    aiBackground: {
      personality: "Deeply withdrawn, crying softly, embarrassed, and avoids direct eye contact. Speaks in a low whisper.",
      detailedHpi: "Following a severe emotional breakup with his partner, the patient intentionally swallowed a large quantity of pills from the family medicine cabinet approximately 6 hours prior to arrival. He developed progressive, severe nausea and three episodes of non-bilious emesis starting 2 hours ago.",
      medicalHistory: "History of Major Depressive Disorder diagnosed 2 years ago.",
      socialHistory: "University freshman. Denies alcohol, tobacco, or recreational drug use.",
      familyHistory: "Mother has a history of generalized anxiety disorder; maternal grandfather committed suicide.",
      medications: "Sertraline (Zoloft) 50mg daily (reports stopping it completely 3 weeks ago because he 'felt better').",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If directly and non-judgmentally asked exactly what bottle he took and how many, he confesses he swallowed approximately forty (40) Extra-Strength 500mg Tylenol caplets (totaling 20 grams) in a single handful."
    },
    correctDiagnosis: "Acetaminophen Overdose"
  },
  {
    id: "case_id_bacterial_meningitis",
    name: "Samuel Choi",
    age: 20,
    gender: "Male",
    chiefComplaint: "My son has an incredibly high fever, a terrible headache, and light is hurting his eyes so bad he won't look at me.",
    presentationText: "A 20-year-old male college student is brought in by his parents. He is wearing dark sunglasses indoors, lying curled up on his side on the gurney, and moaning softly in obvious discomfort.",
    vitals: {
      bloodPressure: "104/62 mmHg",
      heartRate: 114,
      respiratoryRate: 22,
      temperatureF: 103.8,
      o2Sat: "97% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Ill-appearing, toxic, altered and lethargic. Highly sensitive to ambient room light (photophobia)."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Confused, oriented to person only. Severe nuchal rigidity present (marked resistance and extreme pain on passive neck flexion). Positive Brudzinski's sign (flexion of the neck causes involuntary flexion of the hips and knees). Positive Kernig's sign."
      },
      skin: {
        label: "Integumentary System",
        findings: "Multiple scattered, non-blanching petechiae and purpuric macules noted across his lower extremities and lower abdomen."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. No murmurs or rubs."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; tachypneic but equal chest rise."
      }
    },
    labsAndDiagnostics: {
      lumbar_puncture: {
        label: "Lumbar Puncture & CSF Analysis",
        cost: 400,
        result: "Opening Pressure: 280 mmH2O (Elevated). Appearance: Turbid/Cloudy. WBCs: 2,400 /uL (Predominantly 90% Neutrophils). Protein: 180 mg/dL (Significantly elevated). Glucose: 18 mg/dL (Severely depressed relative to serum). Gram Stain: Gram-negative diplococci.",
        comments: "CRITICAL VALUE. Highly diagnostic for acute bacterial meningitis; morphology strongly points to Neisseria meningitidis. Urgent broad-spectrum antibiotics and steroids must be started immediately."
      },
      blood_cultures: {
        label: "Blood Cultures (2 Sets)",
        cost: 120,
        result: "Pending (Initial 12-hour flash indicates Gram-negative diplococci growing in broth).",
        comments: "Confirms bacteremia accompanying the meningococcal syndrome."
      },
      ct_head_nc: {
        label: "CT Head Non-Contrast",
        cost: 450,
        result: "No space-occupying lesions, no midline shift, no evidence of obstructive hydrocephalus.",
        comments: "Performed rapidly prior to lumbar puncture to safely rule out risk of uncal herniation."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 22.1 x10^3/uL with severe bandemia, Hb: 13.9 g/dL, Platelets: 110 x10^3/uL (mild thrombocytopenia).",
        comments: "Reflects profound, life-threatening systemic bacterial infection."
      }
    },
    aiBackground: {
      personality: "Agitated when touched, disoriented, groans heavily and covers his eyes from any light source. Confused when responding.",
      detailedHpi: "Per parents, the patient was completely fine yesterday afternoon. He awoke at 3:00 AM with a sudden, bursting, severe generalized headache, violent shaking chills, and a skyrocketing temperature. Over the morning, he became progressively confused, lethargic, and complained that his neck felt 'stuck'.",
      medicalHistory: "No significant medical history. Up to date on standard childhood vaccinations.",
      socialHistory: "College sophomore, lives in a crowded high-density university dorm building. Smokes electronic cigarettes socially. Alcohol use on weekends.",
      familyHistory: "Non-contributory.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If the parents are thoroughly interviewed regarding specific vaccines, they recall that he missed his booster dose of the Meningococcal B vaccine before moving into the college dorms due to an appointment scheduling conflict."
    },
    correctDiagnosis: "Meningococcal Meningitis"
  },
  {
    id: "case_gastro_acute_cholecystitis",
    name: "Miriam Gallagher",
    age: 46,
    gender: "Female",
    chiefComplaint: "I have this horrible, sharp squeezing pain under my right ribs, and it's traveling all the way into my right shoulder blade.",
    presentationText: "A 46-year-old female presents to the acute care clinic. She is overweight, visibly uncomfortable, holding her hand over her right upper abdomen, and complaining of severe nausea.",
    vitals: {
      bloodPressure: "138/86 mmHg",
      heartRate: 94,
      respiratoryRate: 20,
      temperatureF: 101.4,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Moderately obese female in acute distress. She is restless on the bed, turning frequently to find a comfortable position."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, markedly tender to palpation in the right upper quadrant. Positive Murphy's sign (abrupt cessation of inspiration occurs when the clinician deep-palpates under the right costal margin as the patient inhales). Voluntary guarding is present over the RUQ. No rebound tenderness."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Rhythm is regular, mild tachycardia. S1 and S2 normal; no murmurs."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally. Breath sounds are clear, though inspiration is shortened due to abdominal splinting."
      },
      skin: {
        label: "Integumentary System",
        findings: "Warm, flushed skin. Sclerae are completely anicteric (no jaundice observed)."
      }
    },
    labsAndDiagnostics: {
      ultrasound_gball: {
        label: "Right Upper Quadrant Abdominal Ultrasound",
        cost: 320,
        result: "Gallbladder is distended, measuring 9cm, with multiple shadowing cholelithiasis (gallstones) impacted in the neck. Gallbladder wall is significantly thickened at 5.5mm (normal <3mm) with prominent pericholecystic fluid. Positive sonographic Murphy's sign.",
        comments: "PREMIUM VALUE. Definitive diagnostic imaging modality for acute calculous cholecystitis."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 13.5 x10^3/uL (leukocytosis with neutrophilia), Hb: 13.2 g/dL, Platelets: 280 x10^3/uL.",
        comments: "Supports the diagnosis of an active acute inflammatory/infectious visceral process."
      },
      liver_function_tests: {
        label: "Liver Function Tests & Lipase",
        cost: 130,
        result: "AST: 32 U/L, ALT: 28 U/L, Total Bilirubin: 1.0 mg/dL, Alkaline Phosphatase: 85 U/L, Lipase: 40 U/L.",
        comments: "Normal values rule out choledocholithiasis (common bile duct obstruction) or secondary gallstone pancreatitis."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 140 mEq/L, Potassium: 3.8 mEq/L, Creatinine: 0.7 mg/dL, Glucose: 110 mg/dL.",
        comments: "Confirms normal renal and baseline metabolic values."
      }
    },
    aiBackground: {
      personality: "Talkative but frequently interrupts her sentences to groan or adjust her position. Complains of feeling hot and sweaty.",
      detailedHpi: "The pain began roughly 5 hours ago, waking her up from sleep. It started as a severe, sharp, steady squeezing pressure in the epigastric region that rapidly localized to her right upper quadrant. The pain radiates directly to her right scapula and is rated 8/10. It is accompanied by profound nausea and two episodes of bilious vomiting.",
      medicalHistory: "Hyperlipidemia, obesity, multiparity (has 4 children via uncomplicated vaginal deliveries).",
      socialHistory: "Stay-at-home mother. Non-smoker. Does not drink alcohol. Denies illicit substances.",
      familyHistory: "Mother and two sisters underwent cholecystectomies in their late 30s.",
      medications: "Simvastatin 40mg daily at bedtime.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If explicitly asked about dietary triggers before the event, she admits she ate a large, celebratory deep-fried bacon cheeseburger and a basket of French fries at a local diner about 2 hours before the pain suddenly struck."
    },
    correctDiagnosis: "Acute Cholecystitis"
  },
  {
    id: "case_nephro_renal_colic",
    name: "David Vance",
    age: 38,
    gender: "Male",
    chiefComplaint: "I have this absolute killer, agonizing pain in my left flank that comes in waves, and I noticed my pee looks pink.",
    presentationText: "A 38-year-old male arrives at the emergency clinic pacing back and forth across the room, unable to sit still. He is writhing, grimacing, and repeatedly changing positions in an attempt to find comfort.",
    vitals: {
      bloodPressure: "148/92 mmHg",
      heartRate: 106,
      respiratoryRate: 20,
      temperatureF: 98.8,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is in severe acute distress. Demonstrates classic 'renal colic pacing'—completely unable to stay still or lie down flat due to visceral agony."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, completely non-distended, non-tender to light or deep abdominal palpation. Normal active bowel sounds. No signs of rebound or focal anterior guarding."
      },
      musculoskeletal: {
        label: "Musculoskeletal (Back/Flank)",
        findings: "Exquisite, severe, severe tenderness to light percussion over the left costovertebral angle (CVA tenderness). Right CVA is entirely non-tender."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Mildly tachycardic, regular rhythm. Elevated blood pressure likely secondary to severe acute pain response."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; normal chest excursion."
      }
    },
    labsAndDiagnostics: {
      urinalysis: {
        label: "Urinalysis (UA)",
        cost: 50,
        result: "Color: Pink/Turbid. RBCs: >50 /hpf (Gross/Microscopic hematuria), WBCs: 1-2 /hpf, Nitrites: Negative, pH: 5.5. Abundant calcium oxalate crystals noted.",
        comments: "Strong presence of marked hematuria without signs of active pyuria supporting clean mechanical stone migration."
      },
      ct_stone_survey: {
        label: "CT Abdomen and Pelvis Non-Contrast (Stone Survey)",
        cost: 500,
        result: "A 5mm radiopaque crystalline calculus located precisely at the left ureterovesical junction (UVJ). Associated mild left-sided hydroureter and moderate hydronephrosis.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Confirms obstructing left ureteral stone. 5mm size indicates high probability of spontaneous passage with medical expulsive therapy."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 142 mEq/L, Potassium: 4.1 mEq/L, Creatinine: 1.1 mg/dL, Bun: 18 mg/dL, Calcium: 10.8 mg/dL (Mildly elevated).",
        comments: "Establishes baseline normal renal function; mild hypercalcemia may provide a clue to the etiology of his stone formulation."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 9.8 x10^3/uL, Hb: 14.8 g/dL, Platelets: 215 x10^3/uL.",
        comments: "No significant leukocytosis; rules out an infected or obstructed upper urinary tract emergency at present."
      }
    },
    aiBackground: {
      personality: "Extremely restless, desperate for fast-acting pain relief, sweating, and constantly asking for a trash can because the sheer intensity of the pain is making him dry heave.",
      detailedHpi: "The pain began abruptly around 4:00 AM as a sudden, excruciating, stabbing sensation (10/10) localized to his left flank. The pain occurs in intense paroxysms or 'waves' lasting 20-30 minutes, radiating downward into his left lower abdominal quadrant and directly into his left groin/testicle.",
      medicalHistory: "No prior chronic diagnoses. First time ever experiencing this type of flank pain.",
      socialHistory: "Works as a long-haul truck driver. Smokes 1 pack of cigarettes per week. Confesses to drinking very little water on his long driving shifts, surviving mostly on energy drinks and black coffee.",
      familyHistory: "Father and paternal uncle both have a history of recurrent kidney stones.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If directly asked about his urination habits over the last 24 hours, he notes he has felt a constant, painful, urgent need to urinate every 10 minutes, but only tiny drops of pinkish urine come out each time."
    },
    correctDiagnosis: "Nephrolithiasis (Left Ureteral Stone)"
  },
  {
    id: "case_pulm_acute_asthma_exacerbation",
    name: "Maya Lin",
    age: 12,
    gender: "Female",
    chiefComplaint: "My chest feels super tight, I can't stop coughing, and my inhaler isn't working at all today.",
    presentationText: "A 12-year-old female is rushed into the pediatric emergency bay by her anxious father. She is sitting upright in a rigid 'tripod' position, gasping for breath, with audible expiratory wheezing heard across the room.",
    vitals: {
      bloodPressure: "110/72 mmHg",
      heartRate: 122,
      respiratoryRate: 34,
      temperatureF: 98.9,
      o2Sat: "87% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Severe respiratory distress. Pediatric patient is sitting in a tripod position (leaning forward on arms). Notable supraclavicular and intercostal retractions. Nasal flaring present. Able to speak only in single words due to dyspnea."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Prolonged expiratory phase with diffuse, high-pitched expiratory and inspiratory wheezing throughout all lung fields. Remarkably diminished air entry at both lung bases."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Marked tachycardia, regular rhythm. Pulsus paradoxus noted (systolic BP drops by 14 mmHg during inspiration). No murmurs."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-tender, with significant utilization of abdominal musculature to aid in forced exhalation."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Alert but visibly panicked and wide-eyed. Moves all extremities symmetrically."
      }
    },
    labsAndDiagnostics: {
      peak_flow: {
        label: "Peak Expiratory Flow Rate (PEFR)",
        cost: 30,
        result: "140 L/min (Predicted baseline is 350 L/min; currently at 40% of her personal best).",
        comments: "Confirms a severe airflow obstruction placing her within the dangerous 'Red Zone' requiring intensive bronchodilator therapy."
      },
      cxr_pediatric: {
        label: "Chest X-Ray (PA & Lateral)",
        cost: 200,
        result: "Bilateral lung hyperinflation with flattening of the diaphragms. No focal consolidations, no pneumothorax, and no foreign body visualized.",
        comments: "Confirms classic air trapping; rules out acute focal bacterial pneumonia or pneumothorax mimicking the presentation."
      },
      abg: {
        label: "Arterial Blood Gas (ABG)",
        cost: 140,
        result: "pH: 7.40, pCO2: 40 mmHg, pO2: 62 mmHg.",
        comments: "CRITICAL FINDING. A normal pCO2 (40 mmHg) in a severely tachypneic patient indicates impending respiratory muscle fatigue. She should be hypocapnic due to hyperventilation; a normalizing pCO2 is an ominous sign of impending respiratory failure."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 8.5 x10^3/uL, Hb: 12.4 g/dL, Platelets: 290 x10^3/uL. Eosinophils: 6% (mildly elevated).",
        comments: "Eosinophilia aligns with an active atopic/allergic airway presentation."
      }
    },
    aiBackground: {
      personality: "Terrified, breathless, nods or shakes her head mostly. Whispers single words like 'Tight... chest... help...'",
      detailedHpi: "Symptoms began last night with a dry cough and mild wheezing. Her father administered her Albuterol rescue inhaler twice overnight with temporary relief. This morning, she developed sudden, severe worsening after walking outside. Over the past two hours, she has used her rescue inhaler six times without any symptomatic relief.",
      medicalHistory: "Moderate persistent asthma since age 5, Atopic Dermatitis (Eczema), and seasonal allergic rhinitis.",
      socialHistory: "Attends middle school. Lives in an old apartment building with her father. Family recently adopted a long-haired cat two weeks ago.",
      familyHistory: "Mother has a history of severe environmental allergies; older brother has asthma.",
      medications: "Fluticasone/Salmeterol (Advair) 100/50 mcg 1 puff twice daily (father admits compliance has been poor recently because she 'felt fine'), Albuterol HFA inhaler 2 puffs every 4 hours as needed.",
      allergies: "Severe allergy to cat dander, mold, and tree pollen.",
      nonDisclosedSecrets: "If the father is questioned explicitly about compliance, he admits that they ran out of her daily preventer steroid inhaler (Advair) over three weeks ago and hadn't had a chance to refill it at the pharmacy."
    },
    correctDiagnosis: "Severe Acute Asthma Exacerbation"
  },
  {
    id: "case_cardiology_acute_pericarditis",
    name: "Julian Mercer",
    age: 29,
    gender: "Male",
    chiefComplaint: "I have this sharp, stabbing pain right in the middle of my chest that gets unbearable whenever I lie flat on my back.",
    presentationText: "A 29-year-old male presents to the clinic sitting rigidly upright and leaning forward on his knees. He is taking shallow breaths and appears to be in moderate distress whenever he tries to adjust his posture.",
    vitals: {
      bloodPressure: "124/78 mmHg",
      heartRate: 96,
      respiratoryRate: 22,
      temperatureF: 100.6,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is alert and cooperative but visibly splinting his respirations. He refuses to lie down flat on the examination table, stating it makes the pain a 10/10."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. A high-pitched, scratching, or squeaking extra cardiac sound with three distinct components (systolic, mid-diastolic, and presystolic) is clearly audible at the left lower sternal border when the patient leans forward during expiration. (Pericardial friction rub)."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally. No crackles or wheezing. Lungs expand symmetrically, though breath depth is restricted by pain."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-tender, non-distended with normal active bowel sounds."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Grossly intact, fully oriented, cranial nerves II-XII normal."
      }
    },
    labsAndDiagnostics: {
      ecg_12_lead: {
        label: "12-Lead Electrocardiogram (ECG)",
        cost: 150,
        result: "Diffuse, widespread, concave upward ST-segment elevations across nearly all leads (I, II, III, aVL, aVF, V2-V6) accompanied by widespread PR-segment depression. Notable PR-segment elevation and ST-segment depression in lead aVR.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Widespread diffuse ST elevations without reciprocal changes and concurrent PR depressions are highly pathognomonic for acute pericarditis."
      },
      troponin_i: {
        label: "Serum Troponin I (Initial)",
        cost: 120,
        result: "<0.01 ng/mL (Normal).",
        comments: "Rules out concurrent acute myocardial necrosis (myopericarditis)."
      },
      esr_crp: {
        label: "Inflammatory Markers (ESR & CRP)",
        cost: 70,
        result: "ESR: 45 mm/hr (Elevated), CRP: 4.2 mg/dL (Elevated).",
        comments: "Confirms an active systemic inflammatory process matching pericardial irritation."
      },
      echocardiogram_transthoracic: {
        label: "Transthoracic Echocardiogram (TTE)",
        cost: 450,
        result: "Normal left ventricular ejection fraction (60%). No regional wall motion abnormalities. A very small, trace physiological pericardial effusion is noted, but there is zero evidence of right ventricular collapse or tamponade physiology.",
        comments: "Essential safety scan to rule out dangerous fluid accumulation or early cardiac tamponade."
      }
    },
    aiBackground: {
      personality: "Cooperative, young, and conversational. Relieved when he is allowed to stay leaning forward over a small bedside table.",
      detailedHpi: "The pain began suddenly 2 days ago and has been constant. It is described as a sharp, severe, knife-like pain located retrosternally. It radiates to his left trapezius ridge/shoulder. The pain is drastically aggravated by taking a deep breath (pleuritic), coughing, or lying completely flat. It is dramatically alleviated by sitting completely upright and leaning his torso forward.",
      medicalHistory: "No significant chronic medical conditions. No prior surgeries.",
      socialHistory: "Works as a software technical support agent. Non-smoker. Drinks 1-2 beers socially on weekends. Denies recreational drug use.",
      familyHistory: "Father has hypertension; mother has hypothyroidism.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If pointedly asked about recent illnesses, he recalls that he had a severe 'bad cold' or viral upper respiratory infection about 2 weeks ago, featuring a sore throat, runny nose, and dry cough that resolved spontaneously."
    },
    correctDiagnosis: "Acute Pericarditis"
  },
  {
    id: "case_peds_pyloric_stenosis",
    name: "Baby Boy Liam Davis",
    age: 0.1,
    gender: "Male",
    chiefComplaint: "My 5-week-old son shoots his formula out of his mouth across the room every single time I try to feed him.",
    presentationText: "A 5-week-old first-born infant male is presented by his highly distressed, tearful mother. The infant looks small, awake but lethargic, with noticeably sunken eyes and a dry appearance to his lips.",
    vitals: {
      bloodPressure: "74/46 mmHg",
      heartRate: 148,
      respiratoryRate: 28,
      temperatureF: 98.6,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Infant is awake but appears listless and weak. Signs of moderate dehydration include dry mucous membranes, delayed capillary refill (~3 seconds), and a mildly sunken anterior fontanelle."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-distended. Visible peristaltic waves are occasionally seen moving from the left upper quadrant across the epigastrium. Upon deep, gentle palpation of the right upper quadrant/epigastrium, a distinct, firm, mobile, olive-shaped mass roughly 2cm in size is palpated near the lateral edge of the rectus abdominis muscle."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. S1 and S2 are normal. Peripheral pulses are thin but equal."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Lungs are completely clear to auscultation bilaterally. No signs of respiratory distress or aspiration."
      }
    },
    labsAndDiagnostics: {
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 134 mEq/L, Potassium: 3.1 mEq/L (Low), Chloride: 86 mEq/L (Severely low), Bicarbonate: 34 mEq/L (Elevated), Bun: 24 mg/dL (Dehydration baseline), Glucose: 82 mg/dL.",
        comments: "CRITICAL VALUE. Reveals a classic hypokalemic, hypochloremic metabolic alkalosis secondary to severe, persistent loss of gastric hydrochloric acid and potassium."
      },
      ultrasound_pylorus: {
        label: "Abdominal Ultrasound (Pyloric Protocol)",
        cost: 280,
        result: "Significant thickening and elongation of the pyloric musculature. Pyloric muscle wall thickness measures 4.5mm (positive if >3mm) and the overall pyloric channel length measures 18mm (positive if >14mm). No gas passing through the canal during evaluation.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Confirms hypertrophic pyloric stenosis."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 7.8 x10^3/uL, Hb: 16.2 g/dL (mildly elevated due to hemoconcentration), Platelets: 340 x10^3/uL.",
        comments: "No evidence of systemic infectious process."
      }
    },
    aiBackground: {
      personality: "Infant cries weakly when handled, quickly roots for a bottle or pacifier showing extreme hunger, but immediately vomits violently if fed.",
      detailedHpi: "The infant was born full-term via normal spontaneous vaginal delivery without complications. He fed well until 1 week ago, when he developed occasional regurgitation. Over the past 3 days, this has turned into non-bilious, forceful, projectile vomiting occurring within 10-20 minutes after every single feeding. The infant is constantly acting starved and eagerly demands milk immediately after vomiting ('hungry vomiter').",
      medicalHistory: "First-born male child. Otherwise normal birth metrics.",
      socialHistory: "Lives at home with both parents. Formula-fed.",
      familyHistory: "Father required a minor abdominal operation as an infant for 'spitting up issues' but mother doesn't know the formal name.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If the mother is asked about wet diapers, she admits that he has only had 2 wet diapers in the last 24 hours, and the urine inside looked dark and highly concentrated."
    },
    correctDiagnosis: "Hypertrophic Pyloric Stenosis"
  },
  {
    id: "case_id_acute_pyelonephritis",
    name: "Sarah Jenkins",
    age: 26,
    gender: "Female",
    chiefComplaint: "I have this freezing cold shaking chill, a terrible pain in my right back, and it burns like crazy whenever I go to the bathroom.",
    presentationText: "A 26-year-old female presents to urgent care. She is bundled up in a heavy winter coat and blanket despite warm ambient temperatures, actively shivering, looking flushed and acutely ill.",
    vitals: {
      bloodPressure: "106/62 mmHg",
      heartRate: 110,
      respiratoryRate: 20,
      temperatureF: 103.1,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is alert but appears toxic, lethargic, and actively rigoring. Shivering makes it difficult for her to sit still."
      },
      musculoskeletal: {
        label: "Musculoskeletal (Back)",
        findings: "Severe, sharp, exquisite tenderness elicited upon mild percussion over the right costovertebral angle (CVA). Left CVA is non-tender."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, mild tenderness to deep palpation in the right lower quadrant and suprapubic region, but no guarding, rebound, or rigidity."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. S1 and S2 are crisp; no murmurs."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally. Normal vesicular breath sounds throughout."
      }
    },
    labsAndDiagnostics: {
      urinalysis: {
        label: "Urinalysis with Microscopic Scan",
        cost: 55,
        result: "Color: Cloudy, Turbid. Leukocyte Esterase: 3+ (Positive), Nitrites: Positive. WBCs: >100 /hpf, RBCs: 10-15 /hpf. Abundant White Blood Cell Casts visualized on microscopy.",
        comments: "CRITICAL VALUE. The presence of White Blood Cell Casts explicitly localized the bacterial infection to the renal parenchyma (upper urinary tract), differentiating pyelonephritis from simple cystitis."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 15.8 x10^3/uL with 88% Neutrophils (Left shift), Hb: 12.8 g/dL, Platelets: 210 x10^3/uL.",
        comments: "Confirms a robust systemic inflammatory/infectious response."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 138 mEq/L, Potassium: 3.8 mEq/L, Bicarbonate: 22 mEq/L, Creatinine: 0.8 mg/dL.",
        comments: "Confirms normal baseline renal function with no acute kidney injury."
      },
      urine_culture: {
        label: "Urine Culture & Sensitivity",
        cost: 85,
        result: "Pending (Initial 12-hour growth reveals >100,000 CFU/mL of Gram-negative rods).",
        comments: "Identifies specific organism for targeted definitive antibiotic management later."
      }
    },
    aiBackground: {
      personality: "Cooperative but speaks rapidly while shivering. Constantly complains about being freezing cold and asks for another warm blanket.",
      detailedHpi: "Symptoms began 4 days ago with mild urinary urgency, frequency, and painful burning (dysuria). She ignored it, hoping it would pass. Yesterday evening, she suddenly developed a dull, constant, throbbing pain in her right lower back/flank which was quickly followed by spiking fevers, severe shaking chills, nausea, and one episode of emesis.",
      medicalHistory: "History of frequent urinary tract infections (2-3 times per year). No structural urinary tract anomalies known.",
      socialHistory: "Works as a retail store manager. Sexually active with one male partner. Uses condoms inconsistently. Non-smoker.",
      familyHistory: "Non-contributory.",
      medications: "None. Takes over-the-counter Cranberry extract supplements.",
      allergies: "Ciprofloxacin (develops a diffuse, itchy maculopapular rash).",
      nonDisclosedSecrets: "If specifically asked about post-coital habits, she admits she frequently forgets to void/urinate after intercourse, which she knows increases her infection rates."
    },
    correctDiagnosis: "Acute Pyelonephritis"
  },
  {
    id: "case_heme_sickle_cell_crisis",
    name: "Tyrone Washington",
    age: 18,
    gender: "Male",
    chiefComplaint: "My lower back, hips, and both of my thighs are screaming in pain. It feels like my bones are being crushed in a vice.",
    presentationText: "An 18-year-old African American male presents to the emergency department intake desk. He is writhing in pain on the gurney, sweating profusely, crying, and holding his legs tight against his chest.",
    vitals: {
      bloodPressure: "136/84 mmHg",
      heartRate: 112,
      respiratoryRate: 24,
      temperatureF: 100.2,
      o2Sat: "93% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely ill, diaphoretic, and in severe physical distress. Mild scleral icterus (yellowish tint to the eyes) is appreciated."
      },
      musculoskeletal: {
        label: "Musculoskeletal System",
        findings: "Diffuse, exquisite tenderness to deep palpation over the bilateral femurs, hips, and lumbar spine. No focal localized swelling, warmth, or erythema noted over the large joints."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-distended. Mild generalized abdominal tenderness. Spleen is completely non-palpable (autosplenectomy status)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. A loud, blowing grade II/VI systolic ejection murmur is audible throughout the left sternal border (flow murmur secondary to chronic anemia)."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally. Tachypneic, but no crackles, rales, or focal dullness to percussion."
      }
    },
    labsAndDiagnostics: {
      cbc: {
        label: "Complete Blood Count (CBC) with Differential",
        cost: 65,
        result: "Leukocytes: 12.4 x10^3/uL (mild stress leukocytosis), Hb: 7.2 g/dL (Severely low, but baseline for patient), Hematocrit: 22%, Platelets: 380 x10^3/uL.",
        comments: "Severe normocytic anemia consistent with his known chronic hemolytic baseline status."
      },
      reticulocyte_count: {
        label: "Reticulocyte Count",
        cost: 50,
        result: "12% (Markedly elevated; normal reference 0.5%-2.5%).",
        comments: "Indicates a highly active, functioning bone marrow compensating for chronic ongoing peripheral hemolysis."
      },
      peripheral_smear: {
        label: "Peripheral Blood Smear",
        cost: 75,
        result: "Demonstrates numerous classic sickle-shaped erythrocytes (drepanocytes), target cells, polychromasia, and frequent Howell-Jolly bodies.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Sickled cells confirm vaso-occlusive crisis state; Howell-Jolly bodies confirm functional asplenia."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 139 mEq/L, Potassium: 4.5 mEq/L, Creatinine: 0.6 mg/dL, Total Bilirubin: 3.2 mg/dL (Elevated indirect fraction).",
        comments: "Elevated indirect bilirubin reflects ongoing chronic and acute hemolysis of abnormal red blood cells."
      }
    },
    aiBackground: {
      personality: "Highly distressed, hyperventilating from pain, repeatedly begs for intravenous narcotic pain medication, stating oral medications do not work for his crises.",
      detailedHpi: "The pain began roughly 8 hours ago in his lower back and spread rapidly to his long bones. He rates it a 10/10. He tried drinking extra fluids and taking oral Oxycodone at home without any relief. He reports no chest pain, no cough, and no shortness of breath (ruling out acute chest syndrome).",
      medicalHistory: "Known Sickle Cell Disease (HbSS genotype) diagnosed in infancy. History of multiple prior pain crises requiring hospitalization. History of acute chest syndrome at age 14.",
      socialHistory: "High school senior. Does not smoke or use drugs. Plays video games.",
      familyHistory: "Both parents carry the Sickle Cell Trait; younger sister has Sickle Cell Disease.",
      medications: "Hydroxyurea 1,000mg daily, Folic Acid 1mg daily. Oxycodone 5mg as needed for home pain management flares.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about recent stressors or environmental triggers, he admits he participated in a mandatory outdoor school physical education track meet yesterday in cold, windy weather while wearing only shorts and a T-shirt, and became severely chilled."
    },
    correctDiagnosis: "Sickle Cell Vaso-Occlusive Crisis"
  },
  {
    id: "case_endo_primary_hypothyroidism",
    name: "Beatrice Vance",
    age: 52,
    gender: "Female",
    chiefComplaint: "I feel completely exhausted all the time, my skin is dry as a bone, and I keep gaining weight even though I'm barely eating anything.",
    presentationText: "A 52-year-old female presents for a routine check-up. She speaks with a noticeably slow, deliberate cadence, is wearing a heavy cardigan sweater during a warm afternoon, and appears mildly detached or sluggish.",
    vitals: {
      bloodPressure: "134/88 mmHg",
      heartRate: 56,
      respiratoryRate: 12,
      temperatureF: 97.2,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Overweight, sluggish movements, mild periorbital puffiness. Skin appears cool, coarse, pale, and dry to the touch."
      },
      heent: {
        label: "HEENT / Neck",
        findings: "Thyroid gland is diffusely, symmetrically enlarged, firm, non-tender, and moves smoothly upon swallowing. No distinct focal nodules felt. Coarse, thinning hair noted on the scalp; lateral third of her eyebrows is visibly sparse."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Alert, oriented. Speech is slow and hoarse. Deep tendon reflexes (DTRs) demonstrate a noticeably delayed relaxation phase ('hung up' reflex), most prominent in the achilles tendon bilateral."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Bradycardic, regular rhythm. Heart sounds are somewhat distant but distinct. No murmurs or rubs."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Mildly distended, non-tender. Bowel sounds are noticeably hypoactive in all four quadrants."
      }
    },
    labsAndDiagnostics: {
      tsh_reflex: {
        label: "Serum Thyroid Stimulating Hormone (TSH)",
        cost: 75,
        result: "42.5 uIU/mL (Severely elevated; Reference 0.4 - 4.5 uIU/mL).",
        comments: "CRITICAL VALUE. Highly elevated TSH indicates a profound lack of negative feedback from peripheral thyroid hormones, confirming primary hypothyroidism."
      },
      free_t4: {
        label: "Serum Free T4",
        cost: 65,
        result: "0.4 ng/dL (Severely low; Reference 0.8 - 1.8 ng/dL).",
        comments: "Confirms diagnostic state of overt clinical primary hypothyroidism."
      },
      anti_tpo_antibodies: {
        label: "Anti-Thyroid Peroxidase (Anti-TPO) Antibodies",
        cost: 110,
        result: "280 IU/mL (Highly elevated; Reference <35 IU/mL).",
        comments: "PREMIUM DIAGNOSTIC VALUE. Strong presence of anti-TPO antibodies confirms Hashimoto's Thyroiditis as the underlying autoimmune destructive mechanism."
      },
      lipid_panel: {
        label: "Fasting Lipid Panel",
        cost: 60,
        result: "Total Cholesterol: 265 mg/dL, LDL: 182 mg/dL, Triglycerides: 190 mg/dL, HDL: 45 mg/dL.",
        comments: "Secondary hyperlipidemia is a classic consequence of decreased metabolic clearance driven by thyroid hormone deficiency."
      }
    },
    aiBackground: {
      personality: "Calm, polite, but speaks and moves in slow motion. Expresses frustration that her family thinks she is just becoming 'lazy' or depressed.",
      detailedHpi: "Symptoms have developed insidiously over the past 6-9 months. She describes profound generalized fatigue that isn't relieved by 10 hours of sleep, an unexplained 14-pound weight gain despite a poor appetite, severe cold intolerance, and generalized muscle weakness.",
      medicalHistory: "Mild hypertension, Vitiligo (patchy skin depigmentation on her hands).",
      socialHistory: "Works as a library cataloger. Non-smoker. Does not drink alcohol.",
      familyHistory: "Mother had a history of Graves' disease; older sister has Type 1 Diabetes (strong familial clustering of autoimmune endocrinopathies).",
      medications: "Hydrochlorothiazide 12.5mg daily for blood pressure control.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about changes in her bowel or menstrual habits, she reveals she has been suffering from severe, painful constipation requiring laxatives weekly, and her menstrual cycles (which were previously regular) have become highly irregular and unusually heavy (menorrhagia)."
    },
    correctDiagnosis: "Hashimoto's Thyroiditis (Primary Hypothyroidism)"
  },
  {
    id: "case_neuro_myasthenia_gravis",
    name: "Arthur Pendelton Jr.",
    age: 68,
    gender: "Male",
    chiefComplaint: "By the time evening rolls around, my eyelids droop so much I can barely watch TV, and my vision splits into two.",
    presentationText: "A 68-year-old male presents to the neurology outpatient clinic. He looks comfortable initially, but as the interview progresses, his left eyelid begins to visibly sag downward, and he frequently tilts his head back to see clearly.",
    vitals: {
      bloodPressure: "132/80 mmHg",
      heartRate: 74,
      respiratoryRate: 14,
      temperatureF: 98.4,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert and pleasant elderly male. No acute distress. Notable unilateral ptosis of the left eye at baseline."
      },
      heent: {
        label: "HEENT (Neuromuscular fatigue test)",
        findings: "Upon requesting the patient to maintain sustained upward gaze for 60 seconds, there is a prominent, progressive worsening of bilateral ptosis (left > right). Mild binocular horizontal diplopia is elicited during lateral gaze testing. Pupils remain perfectly equal, round, and reactive to light throughout."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Normal sensation to light touch globally. Baseline motor strength is 5/5 in all extremities, but after repetitive testing of deltoid abduction, strength rapidly diminishes to 3/5. Cranial nerves show mild facial weakness (a flat, 'snarling' smile when asked to grin)."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally. Forced vital capacity measured at bedside is 3.8L (normal baseline), ruling out early diaphragmatic weakness/myasthenic crisis."
      }
    },
    labsAndDiagnostics: {
      achr_antibodies: {
        label: "Serum Anti-Acetylcholine Receptor (AChR) Antibodies",
        cost: 180,
        result: "Positive (Elevated binding antibodies titer at 4.2 nmol/L; Normal <0.5 nmol/L).",
        comments: "PREMIUM DIAGNOSTIC VALUE. High specificity confirms autoimmune Myasthenia Gravis."
      },
      ct_mediastinum: {
        label: "CT Chest with IV Contrast (Mediastinal Protocol)",
        cost: 480,
        result: "A 2.5cm smooth, homogenous, well-circumscribed mass located within the anterior mediastinum, consistent with a thymoma. No signs of local invasion.",
        comments: "CRITICAL VALUE. Thymomas are associated with Myasthenia Gravis in 10-15% of cases; surgical excision is mandated to assist long-term remission."
      },
      emg_repetitive: {
        label: "Repetitive Nerve Stimulation (RNS) Study",
        cost: 300,
        result: "Demonstrates a prominent decremental muscle response (>12% decrement) in the compound muscle action potential (CMAP) after repetitive 3-Hz stimulation.",
        comments: "Confirms classic post-synaptic neuromuscular junction transmission defect physiology."
      },
      tsh_level: {
        label: "Serum TSH Level",
        cost: 75,
        result: "1.2 uIU/mL (Normal).",
        comments: "Rules out hyperthyroidism or thyroid eye disease acting as a diagnostic mimic."
      }
    },
    aiBackground: {
      personality: "Calm, intelligent, and speaks clearly. Notes that his symptoms are completely absent when he first wakes up in the morning, describing himself as 'feeling 100% normal' at 7:00 AM.",
      detailedHpi: "Symptoms began approximately 3 months ago with intermittent double vision (diplopia) while driving late at night. Over the past month, he noticed his left eyelid droops severely by 6:00 PM. Recently, he has experienced mild difficulty chewing tough meat toward the end of his dinners, feeling like his jaw muscles are completely worn out.",
      medicalHistory: "Benign Prostatic Hyperplasia (BPH), Mild Gastroesophageal Reflux Disease (GERD).",
      socialHistory: "Retired mechanical engineer. Non-smoker. Drinks 1 glass of scotch occasionally.",
      familyHistory: "Sister has Rheumatoid Arthritis. No family history of neurological disorders.",
      medications: "Tamsulosin 0.4mg daily, Omeprazole 20mg daily.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked if his voice changes, he mentions that his wife complains she can barely understand him by the end of long telephone conversations because his voice becomes noticeably muffled, nasal, and quiet."
    },
    correctDiagnosis: "Myasthenia Gravis"
  },
  {
    id: "case_id_lyme_disease",
    name: "Chloe Vance Jr.",
    age: 28,
    gender: "Female",
    chiefComplaint: "I have this weird, expanding red rash on the back of my thigh that looks like a target, and my whole body feels achy like I have the flu.",
    presentationText: "A 28-year-old female presents to the outpatient clinic. She looks fatigued and uncomfortable, repeatedly adjusting her position due to generalized body aches.",
    vitals: {
      bloodPressure: "118/72 mmHg",
      heartRate: 78,
      respiratoryRate: 14,
      temperatureF: 100.4,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Mildly lethargic, fully oriented, flushed skin, appears moderately fatigued."
      },
      skin: {
        label: "Integumentary System",
        findings: "A large, distinct, erythematous annular patch measuring approximately 12cm in diameter is located on the posterior aspect of the right mid-thigh. The lesion features a bright red outer border with central clearing, forming a classic 'bull's-eye' configuration (Erythema migrans). The lesion is warm to touch but completely non-indurated, non-vesicular, and non-tender."
      },
      lymphatic: {
        label: "Lymphatic System",
        findings: "Mild, mobile, non-tender lymphadenopathy noted in the right inguinal and bilateral cervical chains."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Normal rate, regular rhythm. S1 and S2 intact. No murmurs or friction rubs heard. (No signs of early Lyme carditis / AV block)."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Cranial nerves II-XII are perfectly symmetric. No facial nerve palsy. No signs of meningismus or neck stiffness."
      }
    },
    labsAndDiagnostics: {
      lyme_serology: {
        label: "Lyme Disease Serology (ELISA with Reflex to Western Blot)",
        cost: 140,
        result: "ELISA IgM: Positive. Western Blot: 3 out of 3 bands positive for Borrelia burgdorferi.",
        comments: "Confirms systemic exposure to Borrelia burgdorferi. Note: Early localized Lyme disease is a clinical diagnosis; treatment should not be withheld waiting for serology if Erythema Migrans is clear."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 6.2 x10^3/uL, Hb: 13.5 g/dL, Platelets: 195 x10^3/uL.",
        comments: "Baseline blood lines are within normal limits; rules out obvious acute pyogenic bacterial process."
      },
      esr_level: {
        label: "Erythrocyte Sedimentation Rate (ESR)",
        cost: 35,
        result: "28 mm/hr (Mildly elevated).",
        comments: "Reflects non-specific acute-phase systemic response matching her low-grade inflammatory symptoms."
      }
    },
    aiBackground: {
      personality: "Friendly, cooperative, but complains of a persistent, dull, generalized headache and feeling entirely drained of energy.",
      detailedHpi: "The rash on her thigh started as a tiny red bump about 8 days ago and has steadily expanded outward. Concurrently over the last 3 days, she developed generalized myalgias, arthralgias in both knees, low-grade fevers, and intermittent chills.",
      medicalHistory: "Asthma (well-controlled).",
      socialHistory: "Works as a landscape architect. Enjoys outdoor activities. Lives in Connecticut. Non-smoker.",
      familyHistory: "Non-contributory.",
      medications: "Albuterol HFA inhaler as needed (rarely used).",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If asked explicitly about recent outdoor exposures or insect bites, she states she does not recall seeing any ticks on her body, but mentions she spent an entire weekend 2 weeks ago clearing dense brush and tall weeds in a wooded rural area without using insect repellent."
    },
    correctDiagnosis: "Early Localized Lyme Disease"
  },
  {
    id: "case_id_infectious_mononucleosis",
    name: "Marcus Miller Jr.",
    age: 19,
    gender: "Male",
    chiefComplaint: "My throat feels like it's lined with razor blades, I have giant lumps in my neck, and I've slept 14 hours a day for a week.",
    presentationText: "A 19-year-old male college freshman presents to student health services. He looks exhausted, pale, holding a cold water bottle against his neck, and speaks with a thick, muffled voice.",
    vitals: {
      bloodPressure: "112/68 mmHg",
      heartRate: 88,
      respiratoryRate: 16,
      temperatureF: 101.8,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely fatigued, flushed, cooperative but looks physically drained. Speaks with a mild 'hot potato' voice secondary to tonsillar swelling."
      },
      heent: {
        label: "HEENT (Pharynx/Neck)",
        findings: "Pharynx is severely erythematous. Bilateral palatine tonsils are massively hypertrophied (3+) meeting near the midline, covered in thick, shaggy white-gray exudates. Petechiae are noted on the posterior hard palate. Massive, symmetric, moderately tender lymphadenopathy involving the posterior cervical chain bilateral."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-distended. Palpable, smooth, moderately tender splenic edge felt 3cm below the left costal margin during deep inspiration (Splenomegaly). Liver is non-palpable."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Normal S1, S2; regular rate and rhythm. No murmurs."
      },
      skin: {
        label: "Integumentary System",
        findings: "Clear. No active maculopapular rashes or petechiae noted on the extremities."
      }
    },
    labsAndDiagnostics: {
      monospot: {
        label: "Heterophile Antibody Test (Monospot)",
        cost: 45,
        result: "Positive.",
        comments: "PREMIUM VALUE. Rapidly confirms presence of heterophile antibodies diagnostic for Epstein-Barr Virus (EBV) infectious mononucleosis."
      },
      cbc_diff: {
        label: "CBC with Manual Differential",
        cost: 70,
        result: "Leukocytes: 14.2 x10^3/uL (Leukocytosis). Differential reveals 58% Lymphocytes, with more than 15% atypical lymphocytes visualized on film.",
        comments: "The presence of prominent atypical lymphocytes (reactive CD8+ T cells) is highly characteristic of acute viral mononucleosis syndromes."
      },
      rapid_strep: {
        label: "Rapid Group A Strep Antigen Screen",
        cost: 35,
        result: "Negative.",
        comments: "Crucial rule-out test to prevent erroneous prescription of Amoxicillin, which can trigger a severe maculopapular drug rash in EBV patients."
      },
      lfts: {
        label: "Liver Function Tests (LFTs)",
        cost: 100,
        result: "AST: 112 U/L (Elevated), ALT: 124 U/L (Elevated), Alkaline Phosphatase: 90 U/L.",
        comments: "Mild, transient acute transaminitis is an extremely common systemic manifestation of Epstein-Barr virus infection."
      }
    },
    aiBackground: {
      personality: "Visibly miserable, exhausted, and speaks quietly because swallowing hurts intensely. Constantly asks for water or ice chips.",
      detailedHpi: "Symptoms began gradually about 6 days ago with mild chills and profound, heavy fatigue. This was followed by a mounting fever, severe generalized body aches, and an escalating sore throat that makes it difficult to swallow solids or liquids.",
      medicalHistory: "No significant past medical conditions. Previous appendectomy at age 12.",
      socialHistory: "College freshman living in a fraternity house. Admits to sharing cups and drinks at social gatherings. Non-smoker.",
      familyHistory: "Non-contributory.",
      medications: "Acetaminophen 500mg as needed for fevers.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about his social behaviors or new relationships, he admits he started dating a new partner 3 weeks ago, referencing the classic 'kissing disease' transmission timeframe."
    },
    correctDiagnosis: "Infectious Mononucleosis (EBV)"
  },
  {
    id: "case_tox_carbon_monoxide",
    name: "Eleanor Vance Jr.",
    age: 64,
    gender: "Female",
    chiefComplaint: "My husband and I woke up with the most splitting, throbbing headache of our lives, and I feel dizzy and sick to my stomach.",
    presentationText: "A 64-year-old female is escorted into the emergency evaluation unit by paramedics. She is holding her head, appears mildly confused, and is complaining of severe, generalized nausea.",
    vitals: {
      bloodPressure: "132/74 mmHg",
      heartRate: 104,
      respiratoryRate: 22,
      temperatureF: 98.4,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert but visibly confused, mildly lethargic, pale, leaning over a sick basin. Skin looks normal (classic cherry-red skin is actually a rare, late, post-mortem finding)."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Oriented to person and place, but unsure of the exact day of the week. Mild ataxia noted during gait testing. Pupils equal and reactive. Cranial nerves intact. Motor strength 5/5 globally."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Sinus tachycardia, regular rhythm. Distinct S1 and S2, no murmurs appreciated."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; tachypneic but lungs sound clear without focal wheezing or rales."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, mild diffuse epigastric tenderness matching her reports of severe nausea. No guarding."
      }
    },
    labsAndDiagnostics: {
      co_oximetry: {
        label: "Arterial Blood Gas with Co-Oximetry Panel",
        cost: 160,
        result: "pH: 7.36, pO2: 98 mmHg, pCO2: 36 mmHg. Carboxyhemoglobin (CO-Hb) level: 24% (Severely elevated; Reference <2% for non-smokers).",
        comments: "CRITICAL DIAGNOSTIC VALUE. Confirms systemic carbon monoxide poisoning. Normal standard pulse oximetry ($O_2$ Sat 99%) was falsely reassuring because standard devices mistake carboxyhemoglobin for oxyhemoglobin."
      },
      ecg_12_lead: {
        label: "12-Lead Electrocardiogram (ECG)",
        cost: 150,
        result: "Sinus tachycardia at 105 bpm. No acute ST-segment depressions or elevations.",
        comments: "Essential to rule out silent myocardial ischemia secondary to cellular hypoxia induced by carbon monoxide binding."
      },
      troponin_i: {
        label: "Serum Troponin I",
        cost: 120,
        result: "<0.01 ng/mL.",
        comments: "Confirms no active myocardial necrosis despite high tissue hypoxia state."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 140 mEq/L, Potassium: 3.9 mEq/L, Bicarbonate: 20 mEq/L, Glucose: 112 mg/dL, Lactic Acid: 2.8 mmol/L (Mildly elevated).",
        comments: "Elevated lactate reflects tissue shift toward anaerobic metabolism due to cellular toxicity."
      }
    },
    aiBackground: {
      personality: "Mildly confused, irritable due to a severe throbbing headache, and repeatedly asks why her oxygen level reads 99% if she feels so short of air.",
      detailedHpi: "Woke up approximately 2 hours ago with a severe, global, throbbing headache, generalized muscle weakness, dizziness, and intense nausea. She notes her husband, who is currently being evaluated in the adjacent bay, has identical symptoms, and even their pet dog was acting profoundly lethargic this morning.",
      medicalHistory: "Hypertension, Type 2 Diabetes Mellitus (diet-controlled).",
      socialHistory: "Retired accountant. Non-smoker. Lives in an old suburban house with her husband.",
      familyHistory: "Non-contributory.",
      medications: "Lisinopril 10mg daily.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about recent household changes or heating sources, she mentions that their central furnace broke down yesterday during a major winter storm, and her husband had been running a portable gasoline-powered space generator inside their attached basement garage overnight to keep the house warm."
    },
    correctDiagnosis: "Carbon Monoxide Poisoning"
  },
  {
    id: "case_rheum_acute_gout",
    name: "James Sterling Jr.",
    age: 54,
    gender: "Male",
    chiefComplaint: "I woke up in the middle of the night feeling like my big toe was on fire. Even the bedsheet resting on it is pure agony.",
    presentationText: "A 54-year-old male presents to the minor injury unit. He is hopping on his left foot, keeping his right foot completely elevated off the ground, grimacing with every movement.",
    vitals: {
      bloodPressure: "142/88 mmHg",
      heartRate: 84,
      respiratoryRate: 14,
      temperatureF: 99.2,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is alert, cooperative, but in severe localized discomfort. He protects his right foot aggressively from any accidental physical contact."
      },
      musculoskeletal: {
        label: "Musculoskeletal (Right Foot)",
        findings: "The right first metatarsophalangeal (MTP) joint is exquisitely tender, massively swollen, tense, warm, and surrounded by brilliant dusky-red erythema (Podagra). Severe restriction of both active and passive ranges of motion due to extreme localized pain. No other joints are involved."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Regular rhythm, normal heart sounds. Mildly hypertensive baseline."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-tender, protuberant. No organomegaly felt."
      }
    },
    labsAndDiagnostics: {
      synovial_crystals: {
        label: "Synovial Fluid Aspiration & Polarizing Microscopy",
        cost: 160,
        result: "Fluid is translucent/yellowish. Polarizing microscopy reveals numerous intracellular, needle-shaped crystals demonstrating strong negative birefringence.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Strongly diagnostic for monosodium urate (MSU) crystals, establishing an absolute definitive diagnosis of acute gouty arthritis."
      },
      serum_uric_acid: {
        label: "Serum Uric Acid Level",
        cost: 55,
        result: "6.2 mg/dL (Normal Range: 3.5 - 7.2 mg/dL).",
        comments: "EDUCATIONAL POINT. Serum uric acid can frequently drop into the perfectly normal range during an acute flare due to precipitation into the joint tissue. A normal level does NOT rule out an acute gout flare."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 11.2 x10^3/uL (mild localized inflammatory leukocytosis), Hb: 14.5 g/dL, Platelets: 240 x10^3/uL.",
        comments: "Mild elevation consistent with localized severe sterile crystal-induced inflammation."
      },
      xray_foot: {
        label: "X-Ray Right Foot (AP/Lateral)",
        cost: 140,
        result: "Soft tissue swelling around the first MTP joint. No acute cortical fractures. Small, punched-out periarticular bone erosions with sclerotic overhanging margins are visible, suggestive of chronic underlying tophaceous deposition.",
        comments: "Confirms chronic destructive markers but rules out an acute traumatic bony event."
      }
    },
    aiBackground: {
      personality: "Impatient, direct, and wants fast pain relief. Swears loudly if the clinician accidentally touches his right toe during physical evaluation.",
      detailedHpi: "The pain woke him up abruptly from sleep at 2:00 AM. It evolved within 2 hours from a mild ache into a blistering, throbbing, excruciating pain (10/10) localized entirely to his right big toe joint. He states even the ambient air from a fan blowing on his foot makes it ache.",
      medicalHistory: "Essential hypertension, Hyperlipidemia, and Chronic Kidney Disease Stage II.",
      socialHistory: "Works as a corporate sales director. High-stress occupation. Heavy dietary intake of red meat. Drinks 3-4 craft beers daily after work.",
      familyHistory: "Father had severe gout requiring medications; grandfather had a history of kidney stones.",
      medications: "Hydrochlorothiazide 25mg daily (for hypertension), Atorvastatin 20mg daily.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about what he ate or drank last night, he admits he attended a large retirement dinner party where he consumed a massive 16-ounce prime rib steak, a plate of oysters, and 4 large dark draft beers. (Classic high-purine dietary trigger combined with a thiazide diuretic that reduces renal uric acid clearance)."
    },
    correctDiagnosis: "Acute Gouty Arthritis (Podagra)"
  },
  {
    id: "case_id_community_acquired_pneumonia",
    name: "Samuel Choi Jr.",
    age: 72,
    gender: "Male",
    chiefComplaint: "I have this deep, painful cough bringing up thick, rust-colored slime, and it hurts my side every time I hack.",
    presentationText: "A 72-year-old elderly gentleman presents to the emergency workspace accompanied by his wife. He is shivering, wearing a heavy coat, tachypneic, and coughing productively into a tissue box.",
    vitals: {
      bloodPressure: "118/74 mmHg",
      heartRate: 104,
      respiratoryRate: 26,
      temperatureF: 102.6,
      o2Sat: "90% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Elderly male appearing moderately frail, febrile, and in acute respiratory discomfort. Splints his right chest wall when coughing."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Dullness to percussion localized over the right lower lung lobe. Auscultation reveals bronchial breath sounds, prominent coarse crackles, and inspiratory rales strictly confined to the right lower field. Positive egophony ('E' sounds like 'A') and increased tactile fremitus over the right base."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. S1 and S2 distinct. No murmurs or gallops audible."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-distended, completely non-tender. Bowel sounds are active."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Alert and oriented to person, place, and time (Confusion Assessment Method is negative, giving a CURB-65 criteria score of 2 for Age and Respiratory Rate, indicating need for inpatient admission)."
      }
    },
    labsAndDiagnostics: {
      cxr_pa_lateral: {
        label: "Chest X-Ray (PA and Lateral views)",
        cost: 220,
        result: "A dense, homogenous lobar consolidation with visible air bronchograms localized strictly within the right lower lobe. No pleural effusions or pneumothorax visualized.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Confirms diagnostic criteria for acute lobar pneumonia."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 18.2 x10^3/uL with 89% Neutrophils and 6% bands (Significant neutrophilic leukocytosis). Hb: 13.1 g/dL, Platelets: 280 x10^3/uL.",
        comments: "Strong confirmation of a pyogenic acute bacterial infection."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 135 mEq/L, Potassium: 4.0 mEq/L, Bun: 24 mg/dL (Mildly elevated), Creatinine: 1.1 mg/dL, Glucose: 138 mg/dL.",
        comments: "BUN is slightly elevated, close monitoring of renal parameters is required during hydration."
      },
      sputum_gram_stain: {
        label: "Sputum Gram Stain & Culture",
        cost: 75,
        result: "Gram stain demonstrates abundant polymorphonuclear leukocytes and numerous Gram-positive diplococci.",
        comments: "Highly suggestive of Streptococcus pneumoniae (the most common culprit of community-acquired pneumonia)."
      }
    },
    aiBackground: {
      personality: "Polite, weary, and speaks weakly between frequent bouts of a deep, wet cough. Appears exhausted from poor sleep.",
      detailedHpi: "Symptoms began 4 days ago with a sudden chilling rigor and dry cough that rapidly progressed into high fevers, night sweats, generalized malaise, and a thick, productive cough bringing up thick, rust-stained sputum. He developed a sharp, stabbing pain on the right side of his chest that worsens significantly whenever he takes a deep breath or coughs.",
      medicalHistory: "Chronic Obstructive Pulmonary Disease (COPD) Stage I, Managed Essential Hypertension.",
      socialHistory: "Retired commercial printer. 40 pack-year smoking history; quit smoking 5 years ago. Non-drinker.",
      familyHistory: "Non-contributory.",
      medications: "Tiotropium bromide (Spiriva) inhaler 1 puff daily, Lisinopril 10mg daily.",
      allergies: "Penicillin (history of severe anaphylaxis featuring laryngeal edema). Must use respiratory fluoroquinolones or macrolide combinations!",
      nonDisclosedSecrets: "If his wife is explicitly asked about his vaccines, she reveals he skipped getting his annual influenza shot and his pneumococcal booster vaccine this past fall because he was traveling out of state."
    },
    correctDiagnosis: "Community-Acquired Pneumonia (CAP)"
  },
  {
    id: "case_gastro_acute_pancreatitis",
    name: "Miriam Gallagher Jr.",
    age: 42,
    gender: "Female",
    chiefComplaint: "I have this boring, drilling pain in the top of my stomach that is cutting straight through into my backbone, and I can't stop throwing up.",
    presentationText: "A 42-year-old female is rolled in on a stretcher. She is lying on her side curled into a tight fetal position, clutching an emesis basin, sweating heavily, and groaning in deep distress.",
    vitals: {
      bloodPressure: "104/68 mmHg",
      heartRate: 114,
      respiratoryRate: 22,
      temperatureF: 100.8,
      o2Sat: "96% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is in severe acute distress, diaphoretic, tachycardic, and tachypneic. She resists straightening her legs or lying flat, stating that curling up brings mild relief."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Moderately distended with markedly diminished/hypoactive bowel sounds (mild secondary localized ileus). Exquisite, severe tenderness to light and deep palpation centered over the epigastrium. Prominent voluntary guarding is noted, but no rigid rebound or signs of a generalized surgical abdomen. No ecchymosis seen around the umbilicus (Cullen's sign) or flanks (Grey Turner's sign)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. Normal S1 and S2; peripheral pulses are rapid but symmetric."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear anteriorly; very minimal dullness and decreased breath sounds at the left lung base (small reactive sympathetic left-sided pleural effusion common in pancreatitis)."
      }
    },
    labsAndDiagnostics: {
      serum_lipase: {
        label: "Serum Lipase Level",
        cost: 90,
        result: "1,450 U/L (Markedly elevated; Reference Range: 10 - 140 U/L).",
        comments: "CRITICAL VALUE. Lipase elevation greater than 3 times the upper limit of normal is highly diagnostic for acute pancreatitis, meeting the primary diagnostic criteria."
      },
      serum_amylase: {
        label: "Serum Amylase Level",
        cost: 80,
        result: "480 U/L (Elevated; Reference <120 U/L).",
        comments: "Elevated, but less sensitive and specific than lipase parameters."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 16.2 x10^3/uL (leukocytosis), Hb: 15.4 g/dL (mild hemoconcentration secondary to third-spacing), Platelets: 290 x10^3/uL.",
        comments: "Indicates a high-grade systemic inflammatory response."
      },
      ultrasound_abd: {
        label: "Transabdominal Abdominal Ultrasound",
        cost: 320,
        result: "The pancreas appears diffusely enlarged, edematous, and hypoechoic. The common bile duct measures 4mm (normal diameter). No gallstones or biliary sludge visualized within the gallbladder lumen.",
        comments: "Rules out acute biliary etiology (gallstone pancreatitis), suggesting an alternate metabolic or lifestyle trigger."
      },
      lipid_panel: {
        label: "Fasting Lipid & Triglyceride Panel",
        cost: 70,
        result: "Total Cholesterol: 240 mg/dL, LDL: 130 mg/dL, Triglycerides: 145 mg/dL.",
        comments: "Normal triglycerides rules out hypertriglyceridemia-induced pancreatitis."
      }
    },
    aiBackground: {
      personality: "Agitated by the pain, repeatedly requests IV antiemetics and strong pain medications. Speaks in gasping sentences between dry heaves.",
      detailedHpi: "The pain developed suddenly over the course of 30 minutes last night, starting in the epigastrium. She describes it as a deep, constant, 'boring' or drilling pain rated 9/10 that radiates straight through into her mid-back. It is worsened by lying flat and slightly alleviated by sitting up and bending forward. It is accompanied by constant, unrelenting nausea and 5 episodes of bilious vomiting.",
      medicalHistory: "History of mild depression, chronic low back pain.",
      socialHistory: "Works as a bartender. 15 pack-year smoking history. Admits to high daily alcohol consumption (4-5 cocktails or beers per shift) for the past several years.",
      familyHistory: "Non-contributory.",
      medications: "Duloxetine 60mg daily, Ibuprofen 800mg as needed.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If explicitly and non-judgmentally asked about her recent alcohol use, she confesses she went on a major 3-day heavy binge over the holiday weekend, drinking nearly a full bottle of vodka each day following a severe family conflict. (Confirms alcohol-induced acute pancreatitis)."
    },
    correctDiagnosis: "Acute Pancreatitis (Alcohol-Induced)"
  },
  {
    id: "case_nephro_acute_kidney_injury",
    name: "David Vance Jr.",
    age: 76,
    gender: "Male",
    chiefComplaint: "My dad has become incredibly weak over the last two days, he's totally confused, and he hasn't urinated once since yesterday morning.",
    presentationText: "A 76-year-old elderly male is brought into the urgent evaluation unit by his son. The patient is profoundly somnolent, dry-appearing, and responds to questions with incoherent mumbling.",
    vitals: {
      bloodPressure: "88/52 mmHg",
      heartRate: 112,
      respiratoryRate: 20,
      temperatureF: 98.2,
      o2Sat: "96% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Elderly male demonstrating severe lethargy and signs of profound intravascular volume depletion: parched, cracked oral mucosa, completely dry tongue, absent axillary sweat, and skin turgor with persistent tenting (~4 seconds)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. Heart sounds are distant. Peripheral pulses are extremely weak, thready, and difficult to palpate in the distal extremities."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, completely non-tender, non-distended. Percussion reveals a completely dull, flat suprapubic region without a palpable bladder vault (rules out acute urinary retention/post-renal obstruction)."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Somnolent, arousable to loud voice or sternal rub. Non-focal exam; moves all four limbs weakly but symmetrically. Asterexis is absent."
      }
    },
    labsAndDiagnostics: {
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 146 mEq/L (mild hypernatremia), Potassium: 5.3 mEq/L (borderline high), Bun: 78 mg/dL (Severely elevated), Creatinine: 4.2 mg/dL (Massively elevated from his baseline of 1.0), Glucose: 118 mg/dL.",
        comments: "CRITICAL VALUE. Calculated BUN/Creatinine ratio is nearly 18.5:1. Severe acute kidney injury is confirmed; etiology requires differentiation between pre-renal dehydration vs acute tubular necrosis."
      },
      fractional_sodium: {
        label: "Urine Electrolytes & Fractional Excretion of Sodium (FeNa)",
        cost: 95,
        result: "Urine Sodium: 8 mEq/L. Calculated FeNa: 0.4% (Significantly <1%). Urine Specific Gravity: 1.032. Microscopic sediment is completely clean with no muddy brown casts.",
        comments: "PREMIUM DIAGNOSTIC VALUE. A FeNa <1% combined with highly concentrated urine and low urine sodium definitively establishes a Pre-Renal Azotemia etiology secondary to severe volume depletion, rather than intrinsic kidney damage."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 7.2 x10^3/uL, Hb: 15.8 g/dL (falsely elevated due to profound hemoconcentration), Platelets: 220 x10^3/uL.",
        comments: "No overt signs of systemic leukocytosis to suggest occult sepsis."
      },
      renal_ultrasound: {
        label: "Renal and Bladder Ultrasound",
        cost: 350,
        result: "Bilateral kidneys are normal in size (11cm) with normal cortical thickness and no echogenic scarring (rules out ESRD). Zero evidence of hydronephrosis, ureteral dilation, or post-void urinary retention.",
        comments: "Rules out an obstructive/post-renal cause for his acute anuria."
      }
    },
    aiBackground: {
      personality: "Extremely somnolent, drift in and out of sleep. Incoherent. The son provides all history details accurately.",
      detailedHpi: "Per the son, the patient developed severe, watery diarrhea and abdominal cramps 4 days ago after eating at an outdoor buffet. He was unable to keep fluids down due to concurrent nausea. Over the past 48 hours, he stopped eating completely, became bedbound, grew increasingly confused, and has not produced a single drop of urine for over 28 hours.",
      medicalHistory: "Moderate osteoarthritis of the hips, Essential hypertension.",
      socialHistory: "Retired mail carrier. Lives independently but son checks on him daily. Non-smoker. Drinks 1-2 alcoholic drinks occasionally.",
      familyHistory: "Non-contributory.",
      medications: "Lisinopril 20mg daily (for blood pressure), Over-the-counter Ibuprofen 400mg three times daily for hip pain.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If the son is questioned explicitly about his medications during this diarrheal illness, he reveals the father continued to rigidly take his daily Lisinopril and escalated his Ibuprofen to 4 tablets a day to manage his body aches. (Crucial clinical insult: The combination of profound dehydration, an NSAID constricting the afferent arteriole, and an ACE-inhibitor dilating the efferent arteriole completely crushed his renal perfusion pressure!)."
    },
    correctDiagnosis: "Pre-Renal Acute Kidney Injury (Severe Dehydration)"
  },
  {
    id: "case_peds_acute_epiglottitis",
    name: "Baby Girl Lily Lin",
    age: 4,
    gender: "Female",
    chiefComplaint: "My 4-year-old daughter suddenly developed a boiling fever, she refuses to swallow her saliva, and she's making a terrifying gasping noise when she breathes.",
    presentationText: "A 4-year-old unimmunized female child is rushed into the pediatric emergency center by her panicked mother. The child is sitting rigidly upright, leaning forward with her chin hyperextended, her mouth wide open, and saliva actively pooling and drooling down her chin.",
    vitals: {
      bloodPressure: "92/58 mmHg",
      heartRate: 138,
      respiratoryRate: 36,
      temperatureF: 104.2,
      o2Sat: "91% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Toxic, highly febrile, anxious pediatric patient in severe upper airway distress. Demonstrates the classic 'tripod' and 'sniffing' positions to maximize airway patency. Continuous pooling and drooling of oral secretions observed."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Prominent, loud, harsh inspiratory stridor audible without a stethoscope, centered over the larynx. Auscultation of the lung fields reveals clear distal breath sounds but marked transmission of upper airway noise. Intercostal, subcostal, and suprasternal retractions are severe."
      },
      heent: {
        label: "HEENT / Throat (Warning!)",
        findings: "Oral cavity shows pooling of saliva. The pharynx is NOT directly examined with a tongue depressor due to the extreme, critical risk of triggering immediate laryngospasm and total airway occlusion."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Marked sinus tachycardia. Normal heart sounds; peripheral pulses are rapid but strong."
      }
    },
    labsAndDiagnostics: {
      lateral_neck_xray: {
        label: "Soft Tissue Lateral Neck X-Ray (Portable)",
        cost: 190,
        result: "Significant swelling and enlargement of the epiglottis, demonstrating the classic, highly pathognomonic 'thumbprint sign'. There is notable narrowing of the immediate subglottic air column.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Confirms acute epiglottitis. Note: X-rays should only be performed if portable and the child is completely stable; never leave the child unattended or send them to radiology."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 24.5 x10^3/uL with 85% Neutrophils and 10% bands.",
        comments: "Reflects an intense, severe, life-threatening acute bacterial infection."
      },
      blood_cultures: {
        label: "Blood Cultures (2 sets)",
        cost: 120,
        result: "Pending (Subsequent growth will reveal Haemophilus influenzae type b).",
        comments: "Obtained safely only after the airway has been securely controlled in the operating room."
      }
    },
    aiBackground: {
      personality: "Terrified, entirely quiet, does not cry or speak because doing so compromises her airway. Stares wide-eyed at the provider.",
      detailedHpi: "The child was completely healthy yesterday afternoon. She developed a sudden sore throat, rapidly escalating high fevers, and chills overnight. By this morning, she refused to talk, could not swallow her own saliva due to extreme odynophagia, and began making a loud gasping sound during inhalation.",
      medicalHistory: "Born full term via routine home birth. Healthy development metrics up to present.",
      socialHistory: "Lives at home with her parents. Does not attend formal daycare.",
      familyHistory: "Non-contributory.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If the mother is gently and directly asked about the child's immunization record, she admits that they chose to decline all standard childhood vaccines, including the Hib (Haemophilus influenzae type b) vaccine series, due to personal lifestyle preferences. (Explains the presentation of a classic vaccine-preventable pediatric emergency)."
    },
    correctDiagnosis: "Acute Epiglottitis"
  },
  {
    id: "case_cardiology_aortic_dissection",
    name: "Arthur Pendelton III",
    age: 59,
    gender: "Male",
    chiefComplaint: "I just had this sudden, explosive pain in my chest that feels like someone is literally ripping my back in half with a chainsaw.",
    presentationText: "A 59-year-old male is rushed into the resuscitation bay by EMS. He is screaming in agony, covered in cold sweat, clutching his chest and upper back, appearing in extreme, life-threatening distress.",
    vitals: {
      bloodPressure: "192/114 mmHg",
      heartRate: 108,
      respiratoryRate: 24,
      temperatureF: 98.6,
      o2Sat: "96% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely toxic, diaphoretic, hypertensive, writhing in severe pain. Skin is cool and clammy."
      },
      cardiovascular: {
        label: "Cardiovascular System (Asymmetric Pulses)",
        findings: "Marked blood pressure discrepancy noted between upper extremities: Right Arm reads 192/114 mmHg; Left Arm reads 142/85 mmHg. Radial and brachial pulse in the left arm is noticeably weaker (1+) compared to the right arm (4+). Auscultation reveals a new, loud, blowing early diastolic decrescendo murmur audible along the right sternal border (acute aortic regurgitation)."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally. Breath sounds are equal, no adventitious sounds."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-tender. Distal femoral pulses are palpated; left femoral pulse is slightly diminished compared to the right."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Grossly intact, oriented. Fully responsive, pupils symmetric. No acute focal cranial nerve deficits."
      }
    },
    labsAndDiagnostics: {
      ct_angio_chest: {
        label: "CT Angiography (CTA) of the Chest and Abdomen",
        cost: 650,
        result: "A prominent, clear intimal tear and dissection flap originating in the ascending aorta, extending through the aortic arch and terminating near the common iliac bifurcation. True and false lumens are clearly visualized. The flap partially compromises the origin of the left subclavian artery.",
        comments: "CRITICAL VALUE. Confirms a Stanford Type A (DeBakey Type I) Acute Aortic Dissection. Immediate cardiothoracic surgical consultation and aggressive blood pressure/shear stress reduction (e.g., Esmolol infusion) are required."
      },
      ecg_12_lead: {
        label: "12-Lead Electrocardiogram (ECG)",
        cost: 150,
        result: "Sinus tachycardia at 108 bpm. Significant left ventricular hypertrophy (LVH) with strain pattern. No acute ST-segment elevations.",
        comments: "Rules out an acute STEMI as the primary mimic for his catastrophic chest pain."
      },
      cxr_portable: {
        label: "Chest X-Ray (Portable AP)",
        cost: 220,
        result: "Notable, prominent widening of the superior mediastinum (>8cm) and blurring of the aortic knob outline. No pneumothorax.",
        comments: "Classic radiographic sign suggestive of aortic pathology, but mandates immediate CTA validation."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 139 mEq/L, Potassium: 4.0 mEq/L, Creatinine: 1.4 mg/dL (mild baseline elevation).",
        comments: "Establishes renal markers prior to emergency surgical cross-clamping."
      }
    },
    aiBackground: {
      personality: "Terrified, screaming that the pain is a 12/10, begs the doctors to make it stop, and states he feels a strange ripping sensation deep inside his torso.",
      detailedHpi: "The pain hit him like a lightning bolt exactly 25 minutes ago while he was sitting at his kitchen table. It was instantaneous and maximal at onset, described as an agonizing 'tearing' or 'ripping' sensation centered retrosternally but radiating violently through into his interscapular back and down toward his abdomen. Unrelieved by position changes.",
      medicalHistory: "Severe, poorly controlled Essential Hypertension for 20 years. History of a 4cm asymptomatic abdominal aortic aneurysm monitored past year.",
      socialHistory: "Works as a commercial real estate developer. 40 pack-year smoking history. High daily stress profile.",
      familyHistory: "Father died suddenly at age 54 due to a 'ruptured vessel in his chest'.",
      medications: "Amlodipine 10mg daily, Metoprolol Succinate 50mg daily (confesses he stopped taking both pills 6 months ago because he 'felt fine and ran out of refills').",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about his blood pressure tracking, he admits his home monitor regularly read over 180/100 mmHg for the past month, but he ignored it because he didn't have any headaches."
    },
    correctDiagnosis: "Acute Aortic Dissection (Stanford Type A)"
  },
  {
    id: "case_neuro_subarachnoid_hemorrhage",
    name: "Elena Rostova Jr.",
    age: 48,
    gender: "Female",
    chiefComplaint: "I just got hit with the most explosive, blinding headache of my entire life. It feels like a bomb went off inside my skull.",
    presentationText: "A 48-year-old female is brought in by ambulance. She has a cold compress pressed tightly against her eyes, is actively vomiting into a basin, and screams in agony at any loud noise or change in lighting.",
    vitals: {
      bloodPressure: "174/102 mmHg",
      heartRate: 84,
      respiratoryRate: 18,
      temperatureF: 99.1,
      o2Sat: "98% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely ill, groaning, holding her head tightly. Marked photophobia and phonophobia. Actively dry heaving during the initial evaluation."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Somnolent but responsive. Minimal orientation confusion. Severe nuchal rigidity (pronounced stiffness and resistance on passive neck flexion). Pupils are equal, round, and reactive, but fundoscopic exam reveals loss of venous pulsations. No focal motor or sensory deficits localized to the extremities (Hunt and Hess Scale Grade 2)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Regular rhythm, elevated blood pressure. Normal S1 and S2; no murmurs or carotid bruits."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; normal lung volumes."
      }
    },
    labsAndDiagnostics: {
      ct_head_nc: {
        label: "CT Head Non-Contrast",
        cost: 450,
        result: "High-attenuating, hyperdense fluid tracking extensively throughout the basal cisterns, sylvian fissures, and anterior interhemispheric fissure, demonstrating a classic 'starburst' pattern of acute blood collection.",
        comments: "CRITICAL VALUE. Highly diagnostic for an acute subarachnoid hemorrhage. Emergency neurosurgical consultation required immediately for aneurysm securing."
      },
      lp_fallback: {
        label: "Lumbar Puncture (LP) with CSF Analysis",
        cost: 400,
        result: "Not Performed / Cancelled.",
        comments: "EDUCATIONAL POINT: Lumbar puncture is used to detect xanthochromia if a CT scan is completely negative but clinical suspicion remains high. Since the CT was overtly positive, an LP is entirely unnecessary and dangerous."
      },
      cta_brain: {
        label: "CT Angiography (CTA) of the Brain/Circle of Willis",
        cost: 550,
        result: "Reveals a 6mm saccular (berry) aneurysm arising from the anterior communicating artery (ACom) with evidence of localized irregular remodeling matching the rupture site.",
        comments: "Identifies the specific anatomical vascular culprit guiding subsequent surgical coiling or clipping."
      },
      coag_panel: {
        label: "Coagulation Panel (PT/INR/PTT)",
        cost: 95,
        result: "PT: 11.2s, INR: 1.0, PTT: 26s.",
        comments: "Confirms standard coagulation baselines prior to surgical neurovascular intervention."
      }
    },
    aiBackground: {
      personality: "Screams or whimpers if the room lights are turned on. Begs for a completely dark room and strong pain medications, stating her head is going to burst open.",
      detailedHpi: "The headache struck her with absolute, instantaneous intensity (10/10) exactly 45 minutes ago while she was straining on the toilet due to mild constipation. She describes it as a 'thunderclap' headache that reached maximum catastrophic pain within less than 2 seconds, quickly followed by dizziness, neck pain, and uncontrollable vomiting.",
      medicalHistory: "Polycystic Kidney Disease (PKD) diagnosed at age 30, Essential Hypertension.",
      socialHistory: "Works as a high school principal. 20 pack-year cigarette smoking history. Drinks 1-2 glasses of wine on weekends.",
      familyHistory: "Mother died at age 42 from a sudden 'brain aneurysm rupture'. (Strong association of berry aneurysms with Polycystic Kidney Disease and family history).",
      medications: "Lisinopril 20mg daily.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If directly asked about prior warnings, she admits she has had 2 brief, milder 'warning leak' headaches over the past month that she shrugged off as simple migraines."
    },
    correctDiagnosis: "Aneurysmal Subarachnoid Hemorrhage (SAH)"
  },
  {
    id: "case_endo_primary_hyperparathyroidism",
    name: "Chloe Vance III",
    age: 55,
    gender: "Female",
    chiefComplaint: "My whole body feels constantly achy, my stomach is in knots with severe constipation, and I feel completely depressed and worn out.",
    presentationText: "A 55-year-old female presents for evaluation of chronic, diffuse musculoskeletal pain and worsening cognitive fog. She appears tired, slow-moving, and frequently sighs during the interview.",
    vitals: {
      bloodPressure: "138/86 mmHg",
      heartRate: 68,
      respiratoryRate: 14,
      temperatureF: 98.6,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert but visibly fatigued and flat in affect. Body movements appear stiff."
      },
      musculoskeletal: {
        label: "Musculoskeletal System",
        findings: "Diffuse generalized tenderness to deep palpation across the bilateral arms, thighs, and lower back. No focal joint swelling, effusions, or localized erythema appreciated."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, mild generalized abdominal tenderness. Bowel sounds are noticeably sluggish and hypoactive."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Oriented to person, place, and time. Demonstrates mild generalized proximal muscle weakness (4/5) in her upper and lower extremities during resistance testing. Deep tendon reflexes are 1+ throughout (mildly hypoactive)."
      }
    },
    labsAndDiagnostics: {
      serum_calcium: {
        label: "Serum Total & Ionized Calcium",
        cost: 55,
        result: "Total Calcium: 11.8 mg/dL (Elevated; Reference 8.5 - 10.2 mg/dL). Ionized Calcium: 1.45 mmol/L (Elevated; Reference 1.12 - 1.32 mmol/L).",
        comments: "CRITICAL VALUE. Confirms significant hypercalcemia, matching the classic clinical mnemonic: 'Stones, Bones, Groans, Cantankerous Moans, and Psychiatric Overtones'."
      },
      pth_intact: {
        label: "Intact Parathyroid Hormone (PTH)",
        cost: 120,
        result: "115 pg/mL (Markedly elevated; Reference 15 - 65 pg/mL).",
        comments: "PREMIUM DIAGNOSTIC VALUE. An elevated PTH in the setting of elevated serum calcium is abnormal (PTH should be physiologically suppressed by high calcium), confirming primary hyperparathyroidism."
      },
      serum_phosphorus: {
        label: "Serum Phosphorus Level",
        cost: 45,
        result: "2.1 mg/dL (Low; Reference 2.5 - 4.5 mg/dL).",
        comments: "PTH decreases renal phosphate reabsorption in the proximal convoluted tubule, driving hypophosphatemia."
      },
      ultrasound_thyroid: {
        label: "High-Resolution Neck Ultrasound (Parathyroid Protocol)",
        cost: 310,
        result: "A distinct, well-circumscribed, hypoechoic oval mass measuring 1.4cm located immediately posterior to the lower pole of the right thyroid lobe, highly suggestive of a solitary parathyroid adenoma.",
        comments: "Identifies the specific localized adenoma responsible for autonomous hypersecretion."
      }
    },
    aiBackground: {
      personality: "Fatigued, easily frustrated, and exhibits a flat, mildly depressed affect. Complains that she feels like she has aged 30 years in the past 6 months.",
      detailedHpi: "Symptoms have crept up over the past 8 months. She complains of deep, aching bone pain in her shins and lower back, severe chronic constipation that doesn't respond to dietary fiber changes, frequent unquenchable thirst (polydipsia) with corresponding increased urination, and worsening memory lapses and low mood.",
      medicalHistory: "History of two recurrent kidney stones over the past 3 years (the 'Stones' component). Osteopenia diagnosed via DEXA scan last year.",
      socialHistory: "Works as a middle school guidance counselor. Non-smoker. Does not drink alcohol.",
      familyHistory: "Mother had severe osteoporosis; maternal aunt had hypercalcemia.",
      medications: "None. Takes over-the-counter Calcium and Vitamin D supplements daily because she thought her bone pain was due to deficiency.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about her supplement usage, she admits she has been doubling her over-the-counter calcium dose for the past 3 weeks to fix her bone pain, which has inadvertently driven her calcium levels even higher."
    },
    correctDiagnosis: "Primary Hyperparathyroidism"
  },
  {
    id: "case_gi_acute_diverticulitis",
    name: "Marcus Miller III",
    age: 61,
    gender: "Male",
    chiefComplaint: "I have this constant, terrible cramping pain down in the lower left side of my belly, and I've been running a fever.",
    presentationText: "A 61-year-old male presents to the triage center holding the lower left quadrant of his abdomen. He looks flushed, is sweating lightly, and reports worsening bloating and chills over the past 48 hours.",
    vitals: {
      bloodPressure: "134/82 mmHg",
      heartRate: 92,
      respiratoryRate: 18,
      temperatureF: 101.6,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Patient is alert and cooperative but appears in moderate discomfort localized to his lower abdomen. Grimaces when walking or shifting weight."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Moderately bloated/distended. Marked focal tenderness to light and deep palpation strictly localized within the Left Lower Quadrant (LLQ). Positive localized rebound tenderness and voluntary guarding present over the LLQ (classic 'left-sided appendicitis'). Right side of the abdomen is completely soft and non-tender. Bowel sounds are noticeably hypoactive."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Regular rhythm, normal S1/S2. No murmurs audible."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; normal excursion."
      }
    },
    labsAndDiagnostics: {
      ct_abd_pelvis_contrast: {
        label: "CT Abdomen and Pelvis with IV Contrast",
        cost: 550,
        result: "Prominent severe segment of colonic wall thickening (6mm) within the sigmoid colon, associated with multiple outpouchings (diverticula). Marked surrounding fat stranding, mild localized fluid collection, but zero evidence of free intraperitoneal air or large macro-abscess.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Confirms acute uncomplicated sigmoid diverticulitis. Absence of free air rules out free perforation emergency."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 14.2 x10^3/uL with 80% Neutrophils (Leukocytosis with left shift), Hb: 14.1 g/dL, Platelets: 260 x10^3/uL.",
        comments: "Confirms an active systemic inflammatory/infectious response matching localized visceral inflammation."
      },
      bmp: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 139 mEq/L, Potassium: 4.1 mEq/L, Creatinine: 0.9 mg/dL, Glucose: 104 mg/dL.",
        comments: "Electrolytes and renal clearance normal; confirms stability for systemic antibiotic delivery."
      },
      urinalysis: {
        label: "Urinalysis (UA)",
        cost: 50,
        result: "Color: Yellow. WBCs: 1-2 /hpf, RBCs: 0 /hpf. Nitrites and Leukocyte Esterase are negative.",
        comments: "Rules out an acute nephrolithiasis or a urinary tract infection presenting with lower abdominal quadrant radiating distress."
      }
    },
    aiBackground: {
      personality: "Cooperative, somewhat stoic but winces noticeably when the left side of his belly is touched. Expresses concern that his colon might have ruptured.",
      detailedHpi: "The pain began 3 days ago as a mild, intermittent cramp in his lower abdomen, but over the last 36 hours, it became constant, sharp, and tightly localized to the left lower quadrant (rated 7/10). He reports a sensation of intense bloating, complete loss of appetite, and worsening chills. He describes his bowel habits as chronic constipation, but notes he has passed only small amounts of loose stool since the pain started.",
      medicalHistory: "Chronic constipation, Hyperlipidemia, Benign Prostatic Hyperplasia (BPH). History of screening colonoscopy 3 years ago which noted 'widespread uncomplicated diverticulosis'.",
      socialHistory: "Works as a bank loan officer. Low-fiber, high-processed food diet. Non-smoker. Drinks 1 glass of red wine with dinner.",
      familyHistory: "Father had a partial colon resection in his 70s for 'severe bowel infection/bleeding'.",
      medications: "Atorvastatin 10mg daily, Finasteride 5mg daily. Uses over-the-counter docusate sodium occasionally.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about his bowel movements over the last week, he admits he had not had a substantial bowel movement for 5 days prior to the onset of the pain, describing himself as intensely backed up."
    },
    correctDiagnosis: "Acute Diverticulitis"
  },
  {
    id: "case_pulm_tension_pneumothorax",
    name: "Eleanor Vance III",
    age: 22,
    gender: "Male",
    chiefComplaint: "I suddenly felt this popping tearing feeling in my right chest while lifting a box, and now I literally cannot breathe.",
    presentationText: "A 22-year-old male is rushed into the emergency stabilization unit. He is tall, extremely thin, clutching his right chest wall, profoundly dyspneic, cyanotic around his lips, and demonstrating rapid, shallow gasping respirations.",
    vitals: {
      bloodPressure: "84/50 mmHg",
      heartRate: 132,
      respiratoryRate: 38,
      temperatureF: 98.6,
      o2Sat: "82% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Young male in severe, life-threatening respiratory failure and obstructive shock. He is diaphoretic, agitated, and demonstrating cyanosis around his lips and nail beds."
      },
      pulmonary: {
        label: "Pulmonary / Lungs (Asymmetric Findings)",
        findings: "Complete, absolute absence of breath sounds throughout the entire right lung field. Left lung has loud, clear vesicular breath sounds. Marked hyperresonance to percussion noted across the entire right hemithorax. Right side of the chest appears fixed and hyper-expanded, with zero respiratory excursion."
      },
      cardiovascular: {
        label: "Cardiovascular System (Obstructive Shock Markers)",
        findings: "Marked sinus tachycardia. Heart sounds are muffled and distinctly deviated or displaced toward the left side of the sternum. Prominent, bilateral jugular venous distension (JVD) is visualized up to the angle of the jaw."
      },
      heent: {
        label: "HEENT / Neck",
        findings: "Palpation of the neck reveals a clear, visible deviation of the trachea away from the midline, shifted toward the LEFT side."
      }
    },
    labsAndDiagnostics: {
      needle_decompression: {
        label: "Immediate Emergent Needle Decompression",
        cost: 150,
        result: "An immediate, loud, rushing 'hiss' of pressurized air escapes the chest upon inserting a large-bore angiocath into the second intercostal space at the right midclavicular line. Blood pressure immediately climbs to 118/72 mmHg and oxygen saturation rises to 94%.",
        comments: "CRITICAL VALUE. Tension pneumothorax is a clinical diagnosis! Waiting for an X-ray or lab confirmation before intervening is a catastrophic error that could result in patient death."
      },
      cxr_post_procedure: {
        label: "Chest X-Ray (Portable AP, Post-Needle Decompression)",
        cost: 220,
        result: "Reveals a persistent large right-sided pneumothorax with near-complete collapse of the right lung, but a return of the mediastinum and trachea to the midline position. Angiocath is noted in the second intercostal space.",
        comments: "Confirms successful decompression of tension physiology; sets up immediate transition to a formal tube thoracostomy (chest tube)."
      },
      abg: {
        label: "Arterial Blood Gas (ABG - Pre-procedure baseline)",
        cost: 140,
        result: "pH: 7.24, pCO2: 55 mmHg, pO2: 50 mmHg.",
        comments: "Reflects acute respiratory acidosis with severe hypoxemia prior to decompressive life-saving maneuver."
      }
    },
    aiBackground: {
      personality: "Panicked, gasping for air, unable to form words, grips the provider's hand in terror. Nods frantically when asked if the pain was sudden.",
      detailedHpi: "The pain and shortness of breath hit him like a lightning strike exactly 15 minutes ago while he was lifting a 10-pound box at a local warehouse job. He felt a sudden, agonizing 'pop' inside his right chest followed by an immediate, total inability to pull air into his lungs. Pain is a sharp 9/10, worse with any effort to breathe.",
      medicalHistory: "No prior chronic diagnoses. Tall, thin body habitus (ectomorphic build, 6'5\" tall, weighing 145 lbs, classic risk factor for spontaneous apical bleb rupture).",
      socialHistory: "Works as a stock clerk. Smokes electronic cigarettes daily. Denies illicit drug use.",
      familyHistory: "Paternal uncle had a 'collapsed lung' during his college years.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If the family is later questioned about habits, they reveal he has a heavy, daily habit of 'vaping' nicotine products, which induces chronic airway micro-inflammation and increases risk of subpleural bleb rupture."
    },
    correctDiagnosis: "Tension Pneumothorax (Spontaneous)"
  },
  {
    id: "case_rheum_rheumatoid_arthritis",
    name: "Beatrice Vance Jr.",
    age: 34,
    gender: "Female",
    chiefComplaint: "My hands are so stiff and painful in the morning that I literally can't button my shirt or hold a coffee mug for over an hour.",
    presentationText: "A 34-year-old female presents to the rheumatology clinic for evaluation of progressive, symmetric joint pain in her fingers and wrists. She sits with her hands resting gently on her lap, gently massaging her knuckles.",
    vitals: {
      bloodPressure: "118/74 mmHg",
      heartRate: 72,
      respiratoryRate: 14,
      temperatureF: 99.1,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert, cooperative, pleasant young female. No acute respiratory or cardiac distress, but looks weary."
      },
      musculoskeletal: {
        label: "Musculoskeletal (Hands/Wrists)",
        findings: "Symmetric, soft, boggy swelling, warmth, and moderate tenderness noted across the bilateral metacarpophalangeal (MCP) and proximal interphalangeal (PIP) joints of both hands. The distal interphalangeal (DIP) joints are completely spared. Symmetric swelling and restricted range of motion noted in both wrists. Grip strength is noticeably reduced (3/5) bilaterally secondary to mechanical joint pain."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Normal rate, regular rhythm. Normal S1/S2; no murmurs or rubs."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; normal breath sounds."
      },
      skin: {
        label: "Integumentary System",
        findings: "Clear. Two small, firm, non-tender, subcutaneous nodules are palpated over the extensor aspect of her right forearm near the elbow (rheumatoid nodules)."
      }
    },
    labsAndDiagnostics: {
      anti_ccp: {
        label: "Anti-Cyclic Citrullinated Peptide (Anti-CCP) Antibodies",
        cost: 130,
        result: "Highly Positive (>150 units/mL; Reference <20 units/mL).",
        comments: "PREMIUM DIAGNOSTIC VALUE. High specificity (>95%) for Rheumatoid Arthritis; strongly predictive of an aggressive, erosive disease course."
      },
      rheumatoid_factor: {
        label: "Rheumatoid Factor (RF)",
        cost: 65,
        result: "Positive (94 IU/mL; Reference <14 IU/mL).",
        comments: "Supports the diagnosis, though less specific than the anti-CCP antibody metrics."
      },
      esr_crp: {
        label: "Inflammatory Markers (ESR & CRP)",
        cost: 70,
        result: "ESR: 52 mm/hr (Elevated), CRP: 3.8 mg/dL (Elevated).",
        comments: "Confirms systemic, high-grade chronic inflammation matching her active polyarthritis."
      },
      xray_hands: {
        label: "X-Ray of Bilateral Hands & Wrists (PA view)",
        cost: 180,
        result: "Diffuse periarticular osteopenia and symmetric joint space narrowing localized to the MCP and PIP joints. Very subtle marginal bony erosions visible at the heads of the second and third MCP joints bilaterally.",
        comments: "Confirms early structural erosive inflammatory changes diagnostic of classic Rheumatoid Arthritis."
      }
    },
    aiBackground: {
      personality: "Soft-spoken, expressive, and realistic. Expresses significant anxiety that she won't be able to continue her fine-motor career if her hands worsen.",
      detailedHpi: "Symptoms began insidiously about 6 months ago with a vague ache in her fingers. Over the past 3 months, this has evolved into a severe, symmetric swelling and throbbing pain in her knuckles and wrists. She describes a profound 'gel phenomenon'—her joints feel completely locked up and stiff for 60-90 minutes every morning after waking up, which slowly improves with warm water and movement.",
      medicalHistory: "History of mild seasonal allergies.",
      socialHistory: "Works as a professional jewelry designer and gem cutter. Non-smoker. Does not drink alcohol.",
      familyHistory: "Mother has a history of 'severe arthritis' that crippled her hands; maternal aunt has Systemic Lupus Erythematosus (SLE).",
      medications: "Over-the-counter Naproxen 220mg twice daily (provides only mild, temporary relief).",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about generalized systemic symptoms, she admits she has also been suffering from a low-grade, persistent afternoon fatigue and an unexplained 5-pound weight loss over the past 2 months, feeling generally run-down."
    },
    correctDiagnosis: "Rheumatoid Arthritis (RA)"
  },
  {
    id: "case_cardiology_mitral_stenosis",
    name: "Elena Rostova III",
    age: 41,
    gender: "Female",
    chiefComplaint: "I've been getting progressively short of breath when I walk up stairs, and this morning I coughed up streaks of bright red blood.",
    presentationText: "A 41-year-old female presents to the cardiology clinic. She appears comfortable at rest but becomes visibly tachypneic after walking a short distance from the waiting room. A distinct, dusky-pink flush is visible across her cheeks (malar flush).",
    vitals: {
      bloodPressure: "114/76 mmHg",
      heartRate: 88,
      respiratoryRate: 20,
      temperatureF: 98.4,
      o2Sat: "94% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert, cooperative female. Displays a classic 'mitral facies'—a distinct purplish-pink patch or malar flush across both cheeks. No acute distress at rest."
      },
      cardiovascular: {
        label: "Cardiovascular System (Auscultation Clues)",
        findings: "Rhythm is regular at 88 bpm. Upon careful auscultation at the cardiac apex in the left lateral decubitus position using the bell, a loud, snapping S1 is heard, followed rapidly by a distinct, sharp, high-pitched extra sound shortly after S2 (Opening Snap). This is immediately followed by a low-pitched, rumbling, mid-diastolic murmur with presystolic accentuation. No carotid bruits felt."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Fine, bilateral basilar crackles audible at the lung bases. No wheezing or rhonchi. Cough elicits a small amount of frothy sputum with flecks of bright red blood."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-tender. Liver edge is smooth, non-palpable. No ascites."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Grossly intact, oriented x3. Cranial nerves normal."
      }
    },
    labsAndDiagnostics: {
      echocardiogram_tte: {
        label: "Transthoracic Echocardiogram (TTE)",
        cost: 450,
        result: "Thickening and calcification of the mitral valve leaflets with characteristic 'hockey-stick' anterior leaflet bowing during diastole. Mitral valve area is severely reduced to $1.1 cm^2$ (indicating severe stenosis). Widespread dilation of the left atrium (diameter 5.2cm) with a mean mitral valve pressure gradient of 12 mmHg. Normal left ventricular size and function.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Confirms severe Mitral Stenosis with severe left atrial enlargement."
      },
      ecg_12_lead: {
        label: "12-Lead Electrocardiogram (ECG)",
        cost: 150,
        result: "Normal sinus rhythm at 85 bpm. Broad, notched, M-shaped P waves in lead II (>0.12s) and a deep, wide terminal negative deflection of the P wave in lead V1 (P mitrale), pathognomonic for left atrial enlargement.",
        comments: "Confirms significant left atrial overload; notes absence of active atrial fibrillation at this moment."
      },
      cxr_pa_lateral: {
        label: "Chest X-Ray (PA and Lateral views)",
        cost: 220,
        result: "Prominent straightening of the left cardiac border representing left atrial enlargement, double density sign along the right cardiac border, and elevation of the left mainstem bronchus. Kerley B lines are visible in the lung bases indicating chronic pulmonary venous congestion.",
        comments: "Classic radiographic signature of advanced chronic mitral valve disease."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 6.8 x10^3/uL, Hb: 12.4 g/dL, Platelets: 210 x10^3/uL.",
        comments: "No leukocytosis; helps rule out acute infectious endocarditis as the primary driver of her current symptoms."
      }
    },
    aiBackground: {
      personality: "Cooperative, answers clearly, but grows tired if asked to speak at length. Worried about the blood she coughed up.",
      detailedHpi: "Symptoms have progressed slowly over the past year. She noticed she could no longer walk a full block without stopping to catch her air. Over the past month, she has been forced to sleep propped up on three pillows to avoid a suffocating cough at night (orthopnea). This morning, after a intense coughing spell, she coughed up a teaspoon of bright red blood (hemoptysis secondary to ruptured bronchial veins due to chronic high pulmonary venous pressures).",
      medicalHistory: "Born and raised in a rural village in Eastern Europe; moved to the US at age 24. No other chronic adult diagnoses.",
      socialHistory: "Works as a tailoress. Non-smoker. Never used drugs. Mother of two.",
      familyHistory: "Non-contributory.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If explicitly asked about childhood illnesses or major health events, she recalls that at age 10, she suffered from a severe, painful 'rheumatic fever' with swollen knees, a severe sore throat, and skin rashes that kept her out of school for nearly two months. (Establishes classic post-rheumatic heart disease mitral stenosis etiology)."
    },
    correctDiagnosis: "Rheumatic Mitral Stenosis"
  },
  {
    id: "case_peds_intussusception",
    name: "Baby Boy Liam Davis Jr.",
    age: 0.7,
    gender: "Male",
    chiefComplaint: "My 8-month-old baby suddenly screams in pure agony out of nowhere, pulls his knees up to his chest, and just passed a stool that looks like dark purple jelly.",
    presentationText: "An 8-month-old infant male is brought to the pediatric urgent room by his terrified parents. The infant is currently quiet, pale, and looking profoundly somnolent on his mother's shoulder, but suddenly begins crying inconsolably, twisting, and pulling his legs tight against his abdomen.",
    vitals: {
      bloodPressure: "86/52 mmHg",
      heartRate: 134,
      respiratoryRate: 24,
      temperatureF: 100.2,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Infant demonstrates cyclical patterns: alternates between periods of extreme, inconsolable crying/screaming and periods of profound, listless lethargy. Skin appears pale."
      },
      abdomen: {
        label: "Abdomen",
        findings: "During a quiet phase, the abdomen is soft. Upon deep palpation of the right upper quadrant, a distinct, elongated, firm, slightly tender, sausage-shaped mass is clearly palpated. The Right Lower Quadrant feels strangely empty or hollow upon deep palpation (positive Dance's sign). Bowel sounds are hypoactive."
      },
      rectal: {
        label: "Digital Rectal Exam (DRE)",
        findings: "Gross inspection reveals a soft stool with a striking dark red, mucoid, 'currant jelly' appearance coating the diaper and exam glove. No anal fissures."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, regular rhythm. Normal heart sounds; peripheral pulses equal."
      }
    },
    labsAndDiagnostics: {
      ultrasound_peds_abd: {
        label: "High-Resolution Pediatric Abdominal Ultrasound",
        cost: 290,
        result: "A prominent, multi-layered, concentric ring structure visualized in the right upper quadrant measuring 4cm in transverse diameter, demonstrating a classic 'target sign' or 'doughnut sign'. Longitudinal view reveals a 'pseudokidney sign' representing invagination of an ileal loop into the colon.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Highly sensitive and specific confirmation of an ileocolic intussusception."
      },
      air_enema: {
        label: "Fluoroscopic Pneumatic (Air) Enema",
        cost: 450,
        result: "Initial fluoroscopy shows a filling defect where the invaginated ileum blocks the colon. Upon controlled introduction of pressurized air, the intussusception is successfully reduced, pushing the ileum back out. Normal column of air outlines a free cecum at the conclusion.",
        comments: "CRITICAL VALUE. Serves as both the gold standard therapeutic intervention and a diagnostic validation method for uncomplicated intussusception."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 12.8 x10^3/uL (mild reactive leukocytosis), Hb: 11.8 g/dL, Platelets: 310 x10^3/uL.",
        comments: "Mild leukocytosis common; absence of severe bandemia or extreme leukocytosis implies no focal intestinal necrosis yet."
      }
    },
    aiBackground: {
      personality: "Cyclical presentation. Cries piercingly for 2-3 minutes while drawing up his legs, then collapses into an unresponsive, lethargic state for 15 minutes before the cycle repeats.",
      detailedHpi: "The infant was completely normal until 12 hours ago, when he suddenly began having episodes of severe, crying spells every 15-20 minutes. He refused his bottle and vomited twice (non-bilious). Two hours ago, he passed a dark, mucoid stool that looked exactly like red currant jelly, prompting the emergency visit.",
      medicalHistory: "Born full term, healthy weight. Up-to-date on all vaccinations.",
      socialHistory: "Lives at home with parents. Recently started eating solid foods (pureed fruits and meats) 2 months ago.",
      familyHistory: "Non-contributory.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If explicitly asked about recent health events, the parents note he had a mild upper respiratory viral infection with a runny nose and dry cough about 2 weeks ago that cleared up on its own. (Viral gastroenteritis/URI can cause hyperplasia of Peyer's patches in the terminal ileum, acting as the lead point for intussusception)."
    },
    correctDiagnosis: "Intussusception (Ileocolic)"
  },
  {
    id: "case_id_pelvic_inflammatory_disease",
    name: "Sarah Jenkins Jr.",
    age: 23,
    gender: "Female",
    chiefComplaint: "I have this constant, heavy, aching pain across the very bottom of my belly, and it hurts terribly whenever my partner and I are intimate.",
    presentationText: "A 23-year-old female presents to urgent care walking with a slow, hesitant, shuffling gait, holding her lower abdomen. She looks uncomfortable and reports a persistent low-grade fever.",
    vitals: {
      bloodPressure: "112/68 mmHg",
      heartRate: 94,
      respiratoryRate: 16,
      temperatureF: 101.2,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert and cooperative, but appears in lower abdominal discomfort. Moves slowly and carefully."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-distended. Marked bilateral tenderness to deep palpation across both lower quadrants (left and right lower quadrants). Mild voluntary guarding is present, but no rigid rebound or signs of generalized peritonitis."
      },
      pelvic: {
        label: "Bimanual Pelvic Examination",
        findings: "Inspection reveals a yellow, mucopurulent discharge emanating from the cervical os. Vaginal walls are erythematous. Upon bimanual examination, there is exquisite, severe, severe pain elicited upon lateral movement of the cervix (Classic Cervical Motion Tenderness or 'Chandelier Sign'). Exquisite bilateral adnexal tenderness is present. No palpable adnexal masses felt."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Mildly tachycardic, regular rhythm. Normal heart sounds."
      }
    },
    labsAndDiagnostics: {
      naat_cervical: {
        label: "Cervical Nucleic Acid Amplification Test (NAAT)",
        cost: 110,
        result: "Positive for Chlamydia trachomatis; Negative for Neisseria gonorrhoeae.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Identifies the specific bacterial pathogen responsible for the upper genital tract infection."
      },
      pregnancy_hgc: {
        label: "Serum Qualitative beta-hCG",
        cost: 35,
        result: "Negative.",
        comments: "CRITICAL RULE-OUT TEST. Excludes ectopic pregnancy as the cause of her bilateral lower quadrant pain."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 13.8 x10^3/uL with 78% Neutrophils (Leukocytosis), Hb: 12.6 g/dL, Platelets: 290 x10^3/uL.",
        comments: "Supports the presence of an active bacterial inflammatory process."
      },
      ultrasound_pelvic: {
        label: "Transvaginal Pelvic Ultrasound",
        cost: 340,
        result: "Uterus is normal in size. Bilateral fallopian tubes appear mildly edematous with trace free fluid in the pouch of Douglas. No complex cystic adnexal masses or fluid-filled loops visualized (rules out a tubo-ovarian abscess complication).",
        comments: "Confirms upper tract inflammation while ruling out abscess formation requiring surgical drainage."
      }
    },
    aiBackground: {
      personality: "Reserved, mildly embarrassed during the pelvic exam history, answers questions quietly but honestly.",
      detailedHpi: "The lower abdominal pain began gradually about 5 days ago as a dull, heavy, constant ache across her pelvic region (rated 5/10). It is significantly aggravated by walking, jumping, or sexual intercourse (deep dyspareunia). She noted a change in her vaginal discharge 3 days ago, which became thick, yellow, and foul-smelling, accompanied by a low-grade fever and intermittent chills.",
      medicalHistory: "History of human papillomavirus (HPV) with normal Pap smear last year.",
      socialHistory: "Works as a hairstylist. Reports a new sexual partner over the past 2 months. Uses oral contraceptive pills for birth control; admits to rare, inconsistent condom usage. Non-smoker.",
      familyHistory: "Non-contributory.",
      medications: "Ethinyl estradiol/Norgestimate oral contraceptive pills daily.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If asked pointedly if her partner has had symptoms, she mentions her new partner casually complained of a 'weird burning feeling' when urinating last week but didn't go to a clinic. (Confirms vector transmission context)."
    },
    correctDiagnosis: "Pelvic Inflammatory Disease (PID)"
  },
  {
    id: "case_heme_immune_thrombocytopenia",
    name: "Tyrone Washington Jr.",
    age: 24,
    gender: "Male",
    chiefComplaint: "I have all these tiny purple spots spreading across my ankles, and my gums won't stop bleeding since I brushed my teeth this morning.",
    presentationText: "A 24-year-old male presents to the walk-in clinic looking anxious. He is holding a tissue against his upper gums, which are oozing trace amounts of bright red blood. He looks otherwise physically well.",
    vitals: {
      bloodPressure: "122/76 mmHg",
      heartRate: 74,
      respiratoryRate: 14,
      temperatureF: 98.6,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert, fully oriented, completely hemodynamically stable. No acute distress."
      },
      skin: {
        label: "Integumentary System (Bleeding Clues)",
        findings: "Abundant, pinpoint, non-blanching, dark red-to-purple macules (petechiae) are densely clustered across both ankles, shins, and feet, extending up to his lower calves. Three small, scattered ecchymoses (bruises) roughly 3cm in size are noted on his anterior thighs without any history of localized trauma."
      },
      heent: {
        label: "HEENT (Oral cavity)",
        findings: "Mild, continuous oozing of blood noted along the gingival margins of his incisors. No tonsillar hypertrophy. No petechiae on the hard palate (wet purpura absent)."
      },
      lymphatic: {
        label: "Lymphatic / Abdomen",
        findings: "No palpable cervical, axillary, or inguinal lymphadenopathy. Abdomen is soft, non-tender; spleen and liver are completely non-palpable (rules out splenomegaly/hypersplenism as the cause of consumption)."
      }
    },
    labsAndDiagnostics: {
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 6.8 x10^3/uL (Normal), Hb: 14.1 g/dL (Normal), Platelets: 8 x10^3/uL (CRITICALLY LOW; Reference 150-450 x10^3/uL).",
        comments: "CRITICAL VALUE. Isolated profound thrombocytopenia. White blood cell and red blood cell lines are perfectly preserved, ruling out generalized bone marrow suppression or aplastic crises."
      },
      peripheral_smear: {
        label: "Peripheral Blood Smear",
        cost: 75,
        result: "Confirms a profound paucity of platelets. The few platelets visualized appear structurally normal but notably large/giant (megakaryocytes fractions indicating high bone marrow turnover). Zero schistocytes, blasts, or atypical lymphocytes visualized.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Large platelets confirm peripheral consumption rather than bone marrow production failure; absence of schistocytes rules out TTP/HUS microangiopathic hemolytic anemias."
      },
      coag_panel: {
        label: "Coagulation Panel (PT/INR/PTT)",
        cost: 95,
        result: "PT: 11.4s, INR: 1.0, PTT: 28s.",
        comments: "Normal coagulation pathways rule out Disseminated Intravascular Coagulation (DIC) or clotting factor deficiencies."
      },
      hiv_hcv_screen: {
        label: "HIV and Hepatitis C Serology",
        cost: 110,
        result: "Negative.",
        comments: "Necessary screen to rule out secondary immune thrombocytopenia triggered by chronic viral infections."
      }
    },
    aiBackground: {
      personality: "Anxious about the low platelet number but conversational and highly cooperative. Frequently asks if he is at risk for a brain bleed.",
      detailedHpi: "He noticed the tiny purple spots on his ankles yesterday evening while taking off his socks. They were completely painless and didn't itch. This morning, his gums began bleeding continuously after standard brushing, and he noticed spontaneous bruising on his thighs without bumping into anything.",
      medicalHistory: "No prior chronic illnesses. No prior surgeries.",
      socialHistory: "Works as a graphic designer. Non-smoker. Drinks 1-2 beers socially. Denies recreational drug use.",
      familyHistory: "Non-contributory.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about recent illnesses, he recalls he had a brief, self-limiting viral gastrointestinal bug with diarrhea and abdominal cramps about 3 weeks ago that resolved completely. (Classic post-viral autoimmune cross-reactivity creating anti-platelet GP IIb/IIIa antibodies)."
    },
    correctDiagnosis: "Immune Thrombocytopenia (ITP)"
  },
  {
    id: "case_nephro_minimal_change_disease",
    name: "Baby Girl Lily Lin III",
    age: 3,
    gender: "Female",
    chiefComplaint: "My 3-year-old daughter suddenly looks completely puffy-her eyes are swollen shut and her belly is huge, but she hasn't gained any real fat.",
    presentationText: "A 3-year-old female child is brought to the pediatric clinic by her mother. The child appears highly edematous, with prominent periorbital puffiness and a markedly distended, fluid-filled abdomen. She is cooperative but appears sluggish.",
    vitals: {
      bloodPressure: "96/60 mmHg",
      heartRate: 102,
      respiratoryRate: 22,
      temperatureF: 98.4,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely pale, moderately lethargic toddler presenting with generalized, severe pitting edema (Anasarca). Bilateral periorbital tissue is so swollen that she can barely open her eyes."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Markedly distended. Prominent fluid wave and shifting dullness are present upon percussion, confirming high-grade ascites. The abdominal wall is soft, non-tender, with no palpable hepatosplenomegaly."
      },
      skin: {
        label: "Integumentary System",
        findings: "Diffuse, 3+ pitting edema present over the bilateral lower extremities extending up to the sacrum. Skin is taut and pale, but clear of active rashes, petechiae, or ecchymoses."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Regular rate, normal S1/S2; no murmur or friction rub appreciated."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Auscultation reveals mild dullness and decreased breath sounds at the bilateral lung bases (small reactive transudative pleural effusions)."
      }
    },
    labsAndDiagnostics: {
      urinalysis_prot: {
        label: "Urinalysis with Microscopic Exam",
        cost: 50,
        result: "Color: Straw/foamy. Protein: 4+ (Massive proteinuria). RBCs: 0 /hpf, WBCs: 0-1 /hpf. Oval fat bodies visualized under polarized light ('Maltese cross' signs).",
        comments: "PREMIUM DIAGNOSTIC VALUE. Confirms heavy proteinuria and lipiduria, strongly suggestive of a nephrotic-range process."
      },
      urine_prot_creat_ratio: {
        label: "Random Urine Protein-to-Creatinine Ratio",
        cost: 85,
        result: "Calculated Ratio: 6.8 mg/mg (Normal <0.2 mg/mg; Indicative of nephrotic-range proteinuria which is defined as >2.0 mg/mg in pediatric populations).",
        comments: "Establishes quantitative nephrotic-range proteinuria rapidly and accurately."
      },
      lipid_panel: {
        label: "Fasting Lipid Panel",
        cost: 70,
        result: "Total Cholesterol: 380 mg/dL (Markedly elevated), LDL: 260 mg/dL (Markedly elevated), Triglycerides: 210 mg/dL.",
        comments: "Hyperlipidemia is a core component of the Nephrotic Syndrome, driven by compensatory hepatic lipoprotein synthesis."
      },
      serum_albumin: {
        label: "Serum Albumin & Total Protein",
        cost: 65,
        result: "Serum Albumin: 1.6 g/dL (Severely low; Reference 3.5 - 5.0 g/dL). Total Protein: 4.2 g/dL (Low).",
        comments: "Severe Hypoalbuminemia completes the diagnostic triad for Classic Nephrotic Syndrome (proteinuria, hypoalbuminemia, and edema)."
      },
      renal_biopsy_fallback: {
        label: "Renal Biopsy is NOT indicated in this case",
        cost: 950,
        result: "Deferred.",
        comments: "EDUCATIONAL POINT. Pediatric patients presenting with classic Nephrotic Syndrome between ages 1 and 10 are highly assumed to have Minimal Change Disease. A renal biopsy is NOT performed first-line; instead, an immediate trial of oral Prednisone is initiated. Biopsies are reserved only for steroid-resistant cases."
      }
    },
    aiBackground: {
      personality: "Sluggish, slightly irritable, and whiny. Frequently asks to be held by her mother.",
      detailedHpi: "The mother noticed mild swelling around the child's eyelids 5 days ago, which she initially dismissed as a seasonal allergy. Over the past 48 hours, the puffiness has rapidly escalated to involve her face, abdomen, and both legs. Her urine has become visibly foamy. The child is eating poorly but has had a sudden 6-pound weight gain over the last week due to water retention.",
      medicalHistory: "Developmentally normal. No chronic medical conditions.",
      socialHistory: "Lives with parents and an older sibling. Attends a local preschool twice a week.",
      familyHistory: "Non-contributory.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If the mother is asked about recent minor illnesses, she recalls that the child recovered from a mild, self-limiting cold/head congestion about 10 days ago. (Minimal Change Disease frequently follows viral upper respiratory infections, triggered by T-cell cytokine-mediated podocyte foot process effacement)."
    },
    correctDiagnosis: "Minimal Change Disease"
  },
  {
    id: "case_pulm_idiopathic_pulmonary_fibrosis",
    name: "Arthur Pendelton IV",
    age: 68,
    gender: "Male",
    chiefComplaint: "I've been slowly losing my breath over the past year, and now I can't even stroll to the mailbox without stopping to pant.",
    presentationText: "A 68-year-old male presents to the pulmonology clinic with a dry, hacking cough and progressive exertional dyspnea. He appears thin, has a slightly dusky skin hue, and demonstrates noticeable respiratory effort.",
    vitals: {
      bloodPressure: "128/78 mmHg",
      heartRate: 82,
      respiratoryRate: 22,
      temperatureF: 98.4,
      o2Sat: "91% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert, thin elderly male appearing somewhat fatigued. Becomes visibly dyspneic when speaking in long, contiguous sentences."
      },
      pulmonary: {
        label: "Pulmonary / Lungs (Auscultation Clues)",
        findings: "On auscultation, there are prominent, bilateral, symmetric, very high-pitched, dry, inspiratory 'Velcro-like' crackles (fine rales) audible predominantly at the lung bases. These crackles do not clear or alter with coughing. Expiratory phase is normal."
      },
      skin: {
        label: "Integumentary System (Clubbing)",
        findings: "Marked, bilateral, symmetric clubbing of both the fingernails and toenails (Schamroth's sign is positive; angle between nail plate and proximal nail fold is >180 degrees)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Regular rhythm, normal S1/S2. S2 split is slightly accentuated over the pulmonic region (implies early increased pulmonary vascular resistance/cor pulmonale)."
      }
    },
    labsAndDiagnostics: {
      hrct_chest: {
        label: "High-Resolution Chest CT (HRCT)",
        cost: 580,
        result: "Diffuse, bilateral, peripheral, subpleural reticular opacities with associated traction bronchiectasis. Prominent, subpleural cyst-like air spaces showing a classic, highly characteristic 'honeycombing' pattern, predominantly involving the lower lung zones. Zero ground-glass opacities.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Highly pathognomonic for a Usual Interstitial Pneumonia (UIP) pattern, which is diagnostic of Idiopathic Pulmonary Fibrosis (IPF) in the absence of an alternate environmental or connective tissue cause."
      },
      pfts: {
        label: "Pulmonary Function Tests (PFTs)",
        cost: 250,
        result: "FVC: 54% of predicted (Severe reduction), FEV1: 58% of predicted. FEV1/FVC Ratio: 86% (Elevated/normal, confirming a restrictive ventilatory defect). Total Lung Capacity (TLC): 58% (Reduced). DLCO (Diffusing Capacity): 42% of predicted (Severely reduced).",
        comments: "Classic restrictive pattern with severely impaired gas exchange across the fibrotic alveolar-capillary membrane."
      },
      rheum_serologies: {
        label: "Autoimmune and Rheumatic Serology Panel",
        cost: 220,
        result: "ANA: Negative, Rheumatoid Factor: Negative, Anti-CCP: Negative, Jo-1: Negative, Scl-70: Negative.",
        comments: "Crucial rule-out panel to exclude secondary interstitial lung diseases associated with systemic autoimmune disorders like scleroderma, RA, or polymyositis."
      },
      cxr_pa_lateral: {
        label: "Chest X-Ray (PA and Lateral views)",
        cost: 220,
        result: "Diffuse interstitial reticular infiltrates predominantly involving the bilateral lower lung zones. Normal heart size.",
        comments: "Confirms interstitial disease, but lacks the resolution of HRCT to confirm honeycombing."
      }
    },
    aiBackground: {
      personality: "Slightly stoic, calm, but speaks with an undertone of anxiety about of his progressive loss of independence. Speaks in short sentences.",
      detailedHpi: "Symptoms began gradually about 14 months ago with a dry, non-productive, hacking cough that was initially blamed on dust. Over the subsequent year, he has experienced a slow, unrelenting progression of exertional dyspnea. He can no longer climb a flight of stairs without resting and has lost 10 pounds of body weight due to the high work of breathing.",
      medicalHistory: "Gastroesophageal Reflux Disease (GERD) for 15 years (poorly controlled; chronic microaspiration is a known risk factor and accelerant for IPF).",
      socialHistory: "Retired cabinet-maker. 10 pack-year smoking history; quit 30 years ago. Non-drinker.",
      familyHistory: "Non-contributory.",
      medications: "Over-the-counter Famotidine 20mg daily for acid reflux.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about occupatonal dusts or chemical exposures, he states he worked extensively with fine wood dusts and lacquers for 40 years, often neglecting to use a respirator mask. (Supports occupational and idiopathic chronic parenchymal irritation)."
    },
    correctDiagnosis: "Idiopathic Pulmonary Fibrosis (IPF)"
  },
  {
    id: "case_gastro_ulcerative_colitis",
    name: "Elena Rostova IV",
    age: 26,
    gender: "Female",
    chiefComplaint: "I'm having 10 to 12 episodes of bloody diarrhea every single day, my belly cramps constantly, and I feel completely exhausted and dizzy.",
    presentationText: "A 26-year-old female presents to the lower gastrointestinal unit. She appears pale, thin, has a dry mouth, and is clutching a hot water bottle against her lower abdomen. She reports a 10-pound weight loss over the past 3 weeks.",
    vitals: {
      bloodPressure: "106/64 mmHg",
      heartRate: 102,
      respiratoryRate: 16,
      temperatureF: 100.4,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Paler than normal, thin young female appearing acutely exhausted and mildly dehydrated. Skin has normal turgor."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Mildly bloated. Moderate diffuse tenderness to light and deep palpation, most pronounced over the Left Lower Quadrant (LLQ) and hypogastric regions. No rigid rebound, guarding, or palpable mass. Bowel sounds are hyperactive (frequent borborygmi)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Sinus tachycardia, regular rhythm. Distinct S1 and S2, no murmur."
      },
      skin: {
        label: "Integumentary System",
        findings: "No active skin lesions. Specifically, no evidence of painful red nodules on her shins (erythema nodosum) or deep ulcerations (pyoderma gangrenosum)."
      }
    },
    labsAndDiagnostics: {
      flex_sigmoidoscopy: {
        label: "Flexible Sigmoidoscopy with Biopsy",
        cost: 480,
        result: "Inspection reveals continuous, uniform, circumferential inflammation extending from the anal verge up into the sigmoid colon. The mucosa is erythematous, granular, highly friable, and oozing blood upon contact. Multiple superficial mucosal ulcerations are present. Biopsy reveals prominent mucosal inflammation, crypt distortion, and crypt abscesses strictly confined to the mucosal layer.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Continuous inflammation starting at the rectum and crypt abscesses strictly confined to the mucosal layer are highly diagnostic of Ulcerative Colitis (distinguishing it from the patchy, transmural Crohn's Disease)."
      },
      fecal_calprotectin: {
        label: "Fecal Calprotectin Test",
        cost: 90,
        result: "850 ug/g (Highly elevated; Reference <50 ug/g).",
        comments: "A sensitive and specific marker of active neutrophilic inflammation within the gastrointestinal tract."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 12.8 x10^3/uL (mild inflammatory leukocytosis). Hb: 9.8 g/dL (Microcytic/Hypochromic Anemia consistent with chronic GI blood loss). Platelets: 420 x10^3/uL (Reactive thrombocytosis).",
        comments: "Confirms a chronic anemia secondary to continuous mucosal bleeding, requiring close monitoring."
      },
      stool_studies: {
        label: "Comprehensive Stool Cultures & Clostridioides difficile Toxin Screen",
        cost: 130,
        result: "Negative for Salmonella, Shigella, Campylobacter, Escherichia coli O157:H7, and Clostridioides difficile toxins.",
        comments: "Essential to rule out an infectious colitis etiology before commencing systemic immunosuppression."
      }
    },
    aiBackground: {
      personality: "Anxious, apologetic about needing to run to the restroom during the clinical interview, and physically exhausted. Worries about her career stability.",
      detailedHpi: "Symptoms began gradually about 4 weeks ago with mild abdominal cramping and soft stools. This has rapidly progressed into 10-12 episodes a day of small-volume, painful, urgent bowel movements containing gross blood and mucus. She is waking up 3-4 times a night to defecate (nocturnal diarrhea, confirming an organic inflammatory cause rather than functional IBS).",
      medicalHistory: "History of mild asthma.",
      socialHistory: "Works as a graphic designer. Never-smoker. (Smokers have a lower risk of Ulcerative Colitis, and disease onset can paradoxically be triggered by smoking cessation!).",
      familyHistory: "Maternal first cousin has Crohn's Disease.",
      medications: "Albuterol inhaler as needed.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about recent habit changes, she admits she quit smoking cigarettes completely 2 months ago to pursue a healthier lifestyle. (Classic lifestyle trigger for an acute flare of Ulcerative Colitis)."
    },
    correctDiagnosis: "Ulcerative Colitis (Sigmoid)"
  },
  {
    id: "case_cardiology_infective_endocarditis",
    name: "Marcus Miller IV",
    age: 38,
    gender: "Male",
    chiefComplaint: "I've been shivering with a drenching fever for two weeks, I feel incredibly weak, and I've developed these painful red lumps on my fingertips.",
    presentationText: "A 38-year-old male presents to the emergency room. He is shivering, diaphoretic, looks pale, is holding his left hand gently, and reports progressive exhaustion and weight loss over the past 3 weeks.",
    vitals: {
      bloodPressure: "112/64 mmHg",
      heartRate: 114,
      respiratoryRate: 20,
      temperatureF: 102.8,
      o2Sat: "96% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely ill, febrile, pale, shivering under a blanket. Cooperative but looks exhausted."
      },
      cardiovascular: {
        label: "Cardiovascular System (Murmur Clues)",
        findings: "Tachycardic, regular rhythm. Prompt auscultation reveals a new, prominent, blowing, grade 3/6 holosystolic murmur loudest at the apex radiating to the left axilla (Acute Mitral Regurgitation)."
      },
      skin: {
        label: "Integumentary System (Dermatological Clues)",
        findings: "Three small, highly tender, raised, erythematous nodules are palpated on the pulp of his left index and ring fingers (Osler's nodes). Inspection of his right palm reveals two flat, painless, dark red macules (Janeway lesions). Standard fundoscopic exam reveals a small round hemorrhage with a pale center in the left retina (Roth spot). Hemorrhages are also noted under his fingernails (splinter hemorrhages)."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; normal excursion."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Soft, non-tender. Palpable, smooth, moderately tender splenic edge felt 3cm below the left costal margin (splenomegaly secondary to immune complex deposition or septic emboli)."
      }
    },
    labsAndDiagnostics: {
      blood_cultures_ie: {
        label: "Blood Cultures (3 sets obtained from separate venipuncture sites)",
        cost: 160,
        result: "All 3 sets are positive for Gram-positive cocci in clusters, subsequently identified as Staphylococcus aureus.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Meeting one of the major modified Duke criteria. The continuous bacteremia is characteristic of an intravascular infection."
      },
      echocardiogram_tee: {
        label: "Transesophageal Echocardiogram (TEE)",
        cost: 650,
        result: "Reveals a prominent, highly mobile, oscillating echogenic mass measuring 1.2cm x 0.8cm attached to the atrial surface of the anterior mitral valve leaflet. Severe mitral regurgitation jet visualized. No abscess noted.",
        comments: "TEE is highly sensitive (>95%) for detecting endocarditis vegetations, meeting a major Duke criterion."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 18.5 x10^3/uL with 88% Neutrophils and 8% bands. Hb: 10.2 g/dL (Anemia of chronic disease), Platelets: 280 x10^3/uL.",
        comments: "Marked leukocytosis with left shift consistent with acute systemic infection."
      },
      urinalysis: {
        label: "Urinalysis with Microscopic Exam",
        cost: 50,
        result: "Protein: 2+, RBCs: 15-20 /hpf (Microscopic hematuria). RBC casts visualized.",
        comments: "Indicates focal glomerulonephritis secondary to circulating antigen-antibody complexes depositing in the glomeruli."
      }
    },
    aiBackground: {
      personality: "Visibly miserable, shivering, and answers questions politely between coughing or adjusting his blankets.",
      detailedHpi: "Symptoms began 2 weeks ago with sudden chills, a high fever, drenching night sweats, and a progressive, heavy fatigue. He noticed a new, painful red bump on his left index fingertip 3 days ago. He reports no recent travel, tick bites, or respiratory symptoms.",
      medicalHistory: "History of congenital bicuspid aortic valve (mildly stenotic); otherwise healthy.",
      socialHistory: "Works as a software developer. Non-smoker. Denies intravenous drug use.",
      familyHistory: "Non-contributory.",
      medications: "None. Takes ibuprofen occasionally for fevers.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about recent dental procedures, he admits he underwent a deep root canal and scaling procedure 3 weeks ago without taking prophylactic antibiotics, despite being told in childhood that he needed them for his 'heart murmur'. (Confirms transient bacteremia-induced endocarditis on a damaged valve)."
    },
    correctDiagnosis: "Infective Endocarditis (Staphylococcus aureus)"
  },
  {
    id: "case_peds_pyloric_stenosis",
    name: "Baby Boy Joshua Lin",
    age: 0.1,
    gender: "Male",
    chiefComplaint: "My 4-week-old baby boy is throwing up his breastmilk violently across the room after every single feed, and he is constantly hungry and crying.",
    presentationText: "A 4-week-old infant male is brought to the pediatric evaluation unit by his exhausted parents. The baby is crying intensely, has a sunburst-like dry mouth, and is actively sucking on his hands.",
    vitals: {
      bloodPressure: "78/48 mmHg",
      heartRate: 142,
      respiratoryRate: 28,
      temperatureF: 98.6,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely irritable, moderately dehydrated infant male. Sunken anterior fontanelle, dry mucous membranes, and slightly reduced skin turgor are present. He is hungry and tries to suck on any object placed near his mouth (classic 'hungry vomiter')."
      },
      abdomen: {
        label: "Abdomen (Palpation Clues)",
        findings: "Upon inspection, subtle left-to-right peristaltic waves are visible across the upper abdomen. Upon deep palpation of the epigastrium right of the midline, a distinct, firm, mobile, non-tender, olive-shaped mass measuring roughly 2cm in size is clearly palpated (the pyloric 'olive'). Abdomen is otherwise soft and non-distended."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Marked sinus tachycardia consistent with mild dehydration. Normal heart sounds; peripheral pulses are rapid but symmetric."
      }
    },
    labsAndDiagnostics: {
      ultrasound_pyloric: {
        label: "Pediatric Abdominal Ultrasound (Pyloric Protocol)",
        cost: 290,
        result: "The pyloric muscle is massively hypertrophied, demonstrating a pyloric muscle wall thickness of 4.5mm (Positive/Abnormal >3.0mm) and an elongated pyloric channel length of 18mm (Positive/Abnormal >14mm). No fluid-filled loops visualized.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Highly sensitive and specific confirmation of Hypertrophic Pyloric Stenosis."
      },
      bmp_peds: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 136 mEq/L, Potassium: 3.1 mEq/L (Low), Chloride: 86 mEq/L (Severely low; Reference 96-106 mEq/L), Bicarbonate: 34 mEq/L (Elevated; Reference 20-28 mEq/L), Blood Urea Nitrogen: 18 mg/dL (falsely elevated due to dehydration).",
        comments: "CRITICAL VALUE. Confirms a classic Hypokalemic Hypochloratemic Metabolic Alkalosis secondary to relentless vomiting of hydrochloric acid and subsequent renal potassium-hydrogen exchange."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 7.8 x10^3/uL, Hb: 16.2 g/dL (slightly elevated due to hemoconcentration), Platelets: 320 x10^3/uL.",
        comments: "Rules out an active systemic infectious process as a cause for vomiting."
      }
    },
    aiBackground: {
      personality: "Highly irritable, cries intensely, and calms down immediately when given a small pacifier. Sucks on hands continuously.",
      detailedHpi: "The infant was feeding perfectly until 5 days ago, when he began having mild spitting up after feeds. Over the past 48 hours, this has progressed into severe, projectile, non-bilious vomiting (vomiting breastmilk up to 3 feet across the room) occurring within 10 minutes of every feeding. He immediately demands to be refed after vomiting.",
      medicalHistory: "Born full term via uncomplicated vaginal delivery. First-born son (classic demographic preference). Gave oral erythromycin for an eye issue at 10 days of life (known association with hypertrophic pyloric stenosis).",
      socialHistory: "Lives at home with parents. Breastfed exclusively.",
      familyHistory: "Paternal uncle had a 'stomach surgery' during his first month of life.",
      medications: "Erythromycin eye drop course completed.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If parents are asked specifically about what the vomit looks like, they confirm it is completely free of green or yellow coloration (non-bilious), composed strictly of partially curdled milk. (Excludes post-duodenal/bilious obstruction)."
    },
    correctDiagnosis: "Hypertrophic Pyloric Stenosis"
  },
  {
    id: "case_rheum_systemic_lupus_erythematosus",
    name: "Sarah Jenkins III",
    age: 28,
    gender: "Female",
    chiefComplaint: "My face has this burning red rash shaped like a butterfly, my fingers turn bone white in the cold, and all my joints are stiff and achy.",
    presentationText: "A 28-year-old female presents to the rheumatology clinic. She is wearing a wide-brimmed hat and long sleeves despite warm weather, looks fatigued, and has a prominent, symmetric erythematous rash across her nose and cheeks.",
    vitals: {
      bloodPressure: "136/88 mmHg",
      heartRate: 84,
      respiratoryRate: 16,
      temperatureF: 100.8,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert young female appearing tired. Striking, elevated, bright red-to-purple, non-scarring macular rash distributed symmetrically across her nasal bridge and bilateral malar cheeks, completely sparing her nasolabial folds (classic malar/butterfly rash)."
      },
      musculoskeletal: {
        label: "Musculoskeletal System",
        findings: "Symmetric tenderness and mild boggy swelling of the bilateral PIP, MCP, and wrist joints. No gross deformities or locking noted. Range of motion is preserved but restricted by subjective pain."
      },
      skin: {
        label: "Integumentary System (Secondary)",
        findings: "In addition to the malar rash, two small, shallow, painless ulcerations are visualized on her hard palate. Fingertips are pale and cold to the touch; she describes a history of them turning blue and then red in cold weather (Raynaud's phenomenon)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Regular rate, normal S1/S2; a very faint friction rub is audible along the left sternal border during deep expiration (mild pericarditis)."
      },
      pulmonary: {
        label: "Pulmonary / Lungs",
        findings: "Clear to auscultation bilaterally; she complains of a sharp pain on the left chest during deep inspiration (pleurisy)."
      }
    },
    labsAndDiagnostics: {
      ana_titer: {
        label: "Antinuclear Antibodies (ANA) with Pattern",
        cost: 80,
        result: "Positive with a 1:640 titer and a homogeneous pattern.",
        comments: "Highly sensitive entry marker (>99%) for Systemic Lupus Erythematosus, though not specific on its own."
      },
      ds_dna_smith: {
        label: "Anti-double-stranded DNA (anti-dsDNA) & Anti-Smith (anti-Sm) Panels",
        cost: 160,
        result: "Anti-dsDNA: Highly Positive (120 IU/mL; Reference <30). Anti-Smith: Positive.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Anti-Smith is highly specific (>99%) for SLE. Anti-dsDNA is also highly specific and correlates tightly with active disease nephritis flares."
      },
      complement_levels: {
        label: "Serum Complement Levels (C3 and C4)",
        cost: 95,
        result: "C3: 55 mg/dL (Low; Reference 80-160), C4: 8 mg/dL (Low; Reference 16-47).",
        comments: "Decreased complement levels signify active immune complex-mediated consumption/complement activation."
      },
      renal_ua: {
        label: "Urinalysis with Microscopic sediment",
        cost: 50,
        result: "Protein: 2+, Blood: 1+. RBCs: 5-10 /hpf. No RBC casts visualized.",
        comments: "Proteinuria and hematuria are warning signs of early lupus nephritis; requires close follow-up with a 24-hour urine collection or renal biopsy."
      }
    },
    aiBackground: {
      personality: "Anxious, soft-spoken, and weary. Worried about her appearance and whether she will need to be on medications forever.",
      detailedHpi: "Symptoms began about 4 months ago with progressive morning fatigue and a 'sunburn' on her face after spending just 15 minutes outdoors (photosensitivity). Over the past 6 weeks, this has escalated to involve a symmetric, throbbing pain in her knuckles and knuckles of both hands, a sharp pain when breathing deeply, and her fingers losing color and going numb in air-conditioned rooms.",
      medicalHistory: "Prior history of mild depression and one miscarriage at 10 weeks of gestation (raises suspicion for antiphospholipid antibody syndrome).",
      socialHistory: "Works as a freelance copywriter. Non-smoker. Does not drink alcohol.",
      familyHistory: "Mother has a history of Hashimoto's thyroiditis; sister has Sjogren's syndrome.",
      medications: "None. Takes OTC Ibuprofen occasionally for joint stiffness.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about her miscarriage history, she mentions she was told she had a 'blood clot' in her leg during her early college years that resolved on its own. (Suggestive of a concurrent Antiphospholipid Syndrome)."
    },
    correctDiagnosis: "Systemic Lupus Erythematosus (SLE)"
  },
  {
    id: "case_id_rocky_mountain_spotted_fever",
    name: "James Sterling III",
    age: 29,
    gender: "Male",
    chiefComplaint: "I have this boiling fever and a crushing headache, and now my wrists and ankles are covered in a strange red spotted rash.",
    presentationText: "A 29-year-old male is brought to the emergency assessment bay. He is febrile, shivering, has an ice pack pressed against his forehead, and appears moderately confused and lethargic. A distinct rash of small red-purple spots is present on his ankles and wrists.",
    vitals: {
      bloodPressure: "102/62 mmHg",
      heartRate: 112,
      respiratoryRate: 20,
      temperatureF: 103.6,
      o2Sat: "97% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely ill, febrile, lethargic young male. Responsive to questions but displays mild slowness in processing. Shivering vigorously."
      },
      skin: {
        label: "Integumentary System (Malignant Rash Clues)",
        findings: "A distinct, prominent eruption of multiple, small (2-5mm), blanching, erythematous macules (petechiae) are distributed symmetrically across the bilateral ankles and wrists, extending proximally up his calves and forearms. Some spots are starting to appear on his palms and soles. The trunk is completely spared."
      },
      neurological: {
        label: "Neurological Exam",
        findings: "Somnolent but easily arousable. Oriented to name and year, but unsure of the exact facility. Cranial nerves are intact. Normal motor strength globally; neck is supple (nuchal rigidity is absent, ruling out classic meningococcal meningitis)."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Sinus tachycardia, regular rhythm. Distant S1/S2; peripheral perfusion is preserved but limbs feel warm (early warm shock)."
      }
    },
    labsAndDiagnostics: {
      serology_rmsf: {
        label: "Indirect Immunofluorescence Assay (IFA) for Rickettsia rickettsii",
        cost: 110,
        result: "Pending / Completed later.",
        comments: "CRITICAL VALUE. Indirect immunofluorescence antibody titers are almost always completely negative during the first week of active infection. Rocky Mountain Spotted Fever is a clinical diagnosis! Empiric treatment with Doxycycline must be started immediately; delaying treatment for labs is associated with high mortality."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 8.5 x10^3/uL (Normal), Hb: 13.8 g/dL, Platelets: 85 x10^3/uL (Thrombocytopenia).",
        comments: "Thrombocytopenia is a highly characteristic early finding of rickettsial infection, driven by endothelial cell damage and platelet consumption."
      },
      bmp_liver: {
        label: "BMP & Liver Function Panel",
        cost: 95,
        result: "Sodium: 131 mEq/L (Hyponatremia), Potassium: 3.9 mEq/L, AST: 94 U/L (Elevated), ALT: 88 U/L (Elevated).",
        comments: "Hyponatremia (due to ADH release seconday to intravascular volume depletion) and mild transaminitis are extremely common systemic features of RMSF."
      },
      skin_biopsy_pcr: {
        label: "PCR Analysis of Skin Biopsy from Petechial Lesion",
        cost: 180,
        result: "Positive for Rickettsia rickettsii DNA.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Can provide rapid confirmatory diagnosis during the acute phase if available, but must not delay Doxycycline."
      }
    },
    aiBackground: {
      personality: "Lethargic, groaning due to a severe headache, and sensitive to bright light. Coordinated but answers slowly.",
      detailedHpi: "Symptoms began abruptly 4 days ago with a sudden, drenching chill, extreme fatigue, high-grade fevers, and a crushing, deep headache that did not respond to OTC medications. Yesterday, he noticed small red spots appearing around his wrists and ankles, which have since multiplied and darkened.",
      medicalHistory: "Healthy; no chronic adult medical conditions.",
      socialHistory: "Works as a forest ranger. Lives in North Carolina. Enjoys hiking. Non-smoker.",
      familyHistory: "Non-contributory.",
      medications: "None.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about ticks or recent outdoor work, he mentions he cleared a dense, overgrown forest trail 8 days ago and remembers removing 2 small wood ticks from his waist area that evening. (Rocky Mountain wood tick - Dermacentor andersoni / American dog tick - Dermacentor variabilis vectors)."
    },
    correctDiagnosis: "Rocky Mountain Spotted Fever (RMSF)"
  },
  {
    id: "case_gastro_celiac_disease",
    name: "Eleanor Vance IV",
    age: 31,
    gender: "Female",
    chiefComplaint: "My belly is constantly bloated, I have this foul, floating diarrhea that is hard to flush, and my elbows are covered in a blistery rash that itches incredibly.",
    presentationText: "A 31-year-old female presents to the cooperative health workspace. She appears thin, pale, and is scratching a prominent blistered eruption on her bilateral elbows. She reports worsening food intolerance over the past year.",
    vitals: {
      bloodPressure: "108/64 mmHg",
      heartRate: 72,
      respiratoryRate: 14,
      temperatureF: 98.4,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Alert young female, thin body habitus, pale. No acute cardiorespiratory distress."
      },
      skin: {
        label: "Integumentary System (Dermatitis Herpetiformis)",
        findings: "Multiple, excoriated, grouping vesicular and papular lesions symmetrically clustered on her bilateral extensor elbows, knees, and posterior scalp, sitting on an erythematous base. Itching is severe."
      },
      abdomen: {
        label: "Abdomen",
        findings: "Mildly distended and tympanic to percussion (gaseous retention). Diffuse, mild tenderness throughout; no guarding or rebound."
      }
    },
    labsAndDiagnostics: {
      ttg_iga: {
        label: "Tissue Transglutaminase IgA (tTG-IgA) Antibody Screen",
        cost: 90,
        result: "Highly Positive (>150 U/mL; Reference <15 U/mL). Total Serum IgA: 240 mg/dL (Normal, ruling out false negative due to IgA deficiency).",
        comments: "PREMIUM DIAGNOSTIC VALUE. Highly sensitive and specific (>95%) first-line screening marker for Celiac Disease."
      },
      duodenal_biopsy: {
        label: "Esophagogastroduodenoscopy (EGD) with Duodenal Biopsy",
        cost: 550,
        result: "Inspection of the distal duodenum shows marked mucosal scalloping and a mosaic, cracked-clay pattern. Multiple biopsies from the second part of the duodenum demonstrate severe villous atrophy (total loss of duodenal villi), crypt hyperplasia, and marked intraepithelial lymphocytosis (>40 lymphocytes per 100 enterocytes).",
        comments: "Gold standard, definitive confirmation of the mucosal damage diagnostic of active Celiac Disease (Marsh Stage 3c)."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 6.2 x10^3/uL, Hb: 10.4 g/dL (Microcytic/Hypochromic anemia consistent with chronic iron malabsorption), Platelets: 240 x10^3/uL.",
        comments: "Anemia of chronic malabsorption; duodenal villi are the primary site of iron absorption."
      },
      skin_biopsy_dif: {
        label: "Direct Immunofluorescence (DIF) of Perilesional Skin Biopsy",
        cost: 160,
        result: "Reveals granular IgA deposition clustered in the dermal papillae tips.",
        comments: "Confirms classic Dermatitis Herpetiformis, which is pathognomonic for Celiac Disease."
      }
    },
    aiBackground: {
      personality: "Cooperative, conversational, but frustrated by a long history of being told her flatulence and diarrhea was 'just IBS'.",
      detailedHpi: "Symptoms have progressed over the past 2 years. She experiences a constant, uncomfortable abdominal bloating, excessive flatulence, and 3-4 bowel movements a day of bulky, foul-smelling, pale-colored stools that float in the bowl. She has lost 8 pounds of body weight despite an unchanged appetite. She developed a blistering, extremely itchy rash on her elbows 6 months ago that worsens when she eats pasta.",
      medicalHistory: "History of Hashimoto's thyroiditis (autoimmune conditions frequently cluster).",
      socialHistory: "Works as a software UI designer. Non-smoker. Does not drink alcohol.",
      familyHistory: "Sister has Type 1 Diabetes Mellitus (another autoimmune associate).",
      medications: "Levothyroxine 75mcg daily.",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about her dietary habits, she admits she went on an intensive 'high-gluten bread-making' phase over the last year, which correlates directly with the severe escalation of her diarrhea and blistering rash. (Confirms gluten-induced autoimmune enteropathy)."
    },
    correctDiagnosis: "Celiac Disease"
  },
  {
    id: "case_nephro_nephrolithiasis",
    name: "David Vance III",
    age: 44,
    gender: "Male",
    chiefComplaint: "I have this sudden, blinding, writhing pain in my side that is shooting down into my groin. I can't find any single position that makes it stop.",
    presentationText: "A 44-year-old male is escorted in. He is actively pacing around the room, unable to sit still, changing positions constantly, grimacing, holding his right flank, and reporting severe nausea.",
    vitals: {
      bloodPressure: "148/92 mmHg",
      heartRate: 104,
      respiratoryRate: 20,
      temperatureF: 98.6,
      o2Sat: "99% on room air"
    },
    physicalExams: {
      general: {
        label: "General Appearance",
        findings: "Acutely distressed, hypertensive, tachycardic. Paces the room constantly (classic 'renal colic' presentation—distinct from surgical peritonitis where patients lie completely still)."
      },
      abdomen: {
        label: "Abdomen (Palpation Clues)",
        findings: "The abdomen is completely soft, symmetric, and non-distended. Bowel sounds are slightly hypoactive. However, percussion or light tapping over the right costovertebral angle elicits an immediate, severe, sharp pain causing the patient to jump (Exquisite Right CVA Tenderness). Left side is completely non-tender."
      },
      urinary: {
        label: "Genitourinary System",
        findings: "No inguinal hernias; testicular exam is normal. External genitalia are normal."
      },
      cardiovascular: {
        label: "Cardiovascular System",
        findings: "Tachycardic, elevated blood pressure. Normal S1/S2; no murmur appreciated."
      }
    },
    labsAndDiagnostics: {
      ct_renal_stone_nc: {
        label: "Non-contrast CT of the Abdomen and Pelvis (Stone Protocol)",
        cost: 450,
        result: "A small, radio-opaque, echogenic focus measuring 5.2mm x 3.5mm is visualized lodged within the distal right ureterovesical junction (UVJ), associated with mild upstream right hydroureter and hydronephrosis. Left kidney and ureter are completely clear.",
        comments: "PREMIUM DIAGNOSTIC VALUE. Gold standard, highly accurate method to locate and measure urolithiasis."
      },
      urinalysis: {
        label: "Urinalysis with Microscopic sediment",
        cost: 50,
        result: "Color: Straw/pink. RBCs: 50-100 /hpf (Gross/microscopic hematuria). Protein: Trace, Nitrites: Negative, Leukocyte Esterase: Negative. Abundant, envelope-shaped calcium oxalate crystals visualized.",
        comments: "Hematuria is highly characteristic (>85% of cases) of moving calculi scratching the urothelium. Note: Absence of nitrites/LE rules out a concurrent ascending UTI complication."
      },
      cbc: {
        label: "Complete Blood Count (CBC)",
        cost: 60,
        result: "Leukocytes: 9.8 x10^3/uL, Hb: 14.8 g/dL, Platelets: 280 x10^3/uL.",
        comments: "No leukocytosis; confirms mechanical colic rather than systemic urosepsis."
      },
      bmp_renal: {
        label: "Basic Metabolic Panel (BMP)",
        cost: 80,
        result: "Sodium: 139 mEq/L, Potassium: 4.1 mEq/L, BUN: 14 mg/dL, Creatinine: 1.0 mg/dL (Normal).",
        comments: "Normal creatinine confirms unilateral obstruction with preserved global renal clearance."
      }
    },
    aiBackground: {
      personality: "Extremely distressed by the pain, paces the room relentlessly, demands IV pain medications, states he cannot tolerate the pain any longer.",
      detailedHpi: "The pain began suddenly exactly 1.5 hours ago while he was watching television. It started in his right flank/lower back as a deep, excruciating, colicky pain (10/10) that 'came in waves' and rapidly radiated downwards into his right lower abdominal quadrant and right scrotum/groin. He is extremely nauseous and threw up once in the hallway.",
      medicalHistory: "History of gout, mild obesity.",
      socialHistory: "Works as a long-haul truck driver. High daily consumption of soda and iced tea; low water intake. Non-smoker.",
      familyHistory: "Father and older brother both have a history of recurrent kidney stones.",
      medications: "Allopurinol 100mg daily (for gout control).",
      allergies: "NKDA.",
      nonDisclosedSecrets: "If specifically asked about hydration habits, he admits he rarely drinks plain water on his driving shifts, often drinking 4-5 unsweetened iced teas or energy drinks instead to stay awake. (Massive calcium oxalate precipitation risk!)."
    },
    correctDiagnosis: "Nephrolithiasis (Ureteral Calculus)"
  }
];
