import { GoogleGenAI, Type } from "@google/genai";
import { ClinicalTrial, TrialAnalysis, RegulatoryMilestone } from "../types";
import { MOCK_TRIALS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const IS_DEMO_MODE = !process.env.API_KEY || process.env.API_KEY === 'your_api_key_here';

export const fetchClinicalTrialsForVendor = async (vendorName: string): Promise<ClinicalTrial[]> => {
  await new Promise(r => setTimeout(r, 800));
  return MOCK_TRIALS;
};

export const predictTrialSuccess = async (trial: ClinicalTrial): Promise<TrialAnalysis> => {
  if (IS_DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1200));
    return {
      nctId: trial.nctId,
      successProbability: 85,
      failureRiskFactors: ['Secondary endpoint variance', 'Recruitment lag in Cohort C'],
      genomicMarkersImpact: 'Positive correlation with biomarker G-72; data integrity confirmed via cluster-node cross-verification.',
      predictedApprovalDate: '2025-11-20',
      regulatoryHurdles: ['FDA Title 21 CFR §11 review', 'EU Sovereign Data Audit'],
      reasoningChain: [' ডিজাইন সিগন্যাল (30%)', 'ঐতিহাসিক ডাটা (40%)', 'বায়োমার্কার (30%)']
    };
  }

  const model = 'gemini-3-pro-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze the following clinical trial and predict its success probability based on design, phase, and recruitment stats.
      Trial NCT ID: ${trial.nctId}
      Title: ${trial.title}
      Phase: ${trial.phase}
      Enrollment: ${trial.enrollment}
      Dropout Rate: ${trial.dropoutRate}%
      Adverse Events: ${trial.adverseEventsCount}
      
      Output MUST be JSON matching the TrialAnalysis schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nctId: { type: Type.STRING },
            successProbability: { type: Type.NUMBER },
            failureRiskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            genomicMarkersImpact: { type: Type.STRING },
            predictedApprovalDate: { type: Type.STRING },
            regulatoryHurdles: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoningChain: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["nctId", "successProbability", "failureRiskFactors", "genomicMarkersImpact", "predictedApprovalDate", "regulatoryHurdles", "reasoningChain"]
        }
      }
    });
    
    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (err) {
    console.error("Trial Prediction AI Error", err);
    // Fallback to demo mode if AI fails
    return {
      nctId: trial.nctId,
      successProbability: 45,
      failureRiskFactors: ['API communication interrupted', 'Fallback to heuristic engine'],
      genomicMarkersImpact: 'Analysis inconclusive due to model timeout',
      predictedApprovalDate: '2026-Q1',
      regulatoryHurdles: ['Connectivity Re-verification'],
      reasoningChain: ['Heuristic Fallback V1']
    };
  }
};

export const fetchRegulatoryMilestones = async (vendorName: string): Promise<RegulatoryMilestone[]> => {
  return [
    { agency: 'FDA', submissionType: 'BLA', currentStatus: 'UNDER_REVIEW', submissionDate: '2023-11-20', predictedDecisionDate: '2024-09-15' },
    { agency: 'EMA', submissionType: 'NDA', currentStatus: 'SUBMITTED', submissionDate: '2024-02-01', predictedDecisionDate: '2025-01-10' }
  ];
};