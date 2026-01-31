
import { GoogleGenAI, Type } from "@google/genai";
import { WearableTelemetry, HumanRiskAnalysis } from "../types";
import { MOCK_WEARABLES } from "../constants";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const IS_DEMO_MODE = !process.env.API_KEY || process.env.API_KEY === 'your_api_key_here';

export const fetchWearableData = async (vendorId: string): Promise<WearableTelemetry[]> => {
  await new Promise(r => setTimeout(r, 600));
  return MOCK_WEARABLES;
};

export const analyzeHumanRisk = async (telemetry: WearableTelemetry[]): Promise<HumanRiskAnalysis> => {
  if (IS_DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1200));
    return {
      overallRiskScore: 7.4,
      criticalInsights: ['DEMO: Personnel fatigue in BSL-3 labs exceeds safe thresholds.', 'DEMO: Correlated stress found in late-shift logistics.'],
      roleBreakdown: { 'LAB_TECH': { avgStress: 7.8, errorProbability: 0.12 } },
      anomalies: [
        { workerId: 'TECH-772', issue: 'Sustained high stress during critical assay', severity: 'HIGH' }
      ]
    };
  }

  const model = 'gemini-3-pro-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze human risk for telemetry: ${JSON.stringify(telemetry)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallRiskScore: { type: Type.NUMBER },
            criticalInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            // Fix: roleBreakdown needs properties as Type.OBJECT cannot be empty
            roleBreakdown: { 
              type: Type.OBJECT, 
              properties: {
                'LAB_TECH': { type: Type.OBJECT, properties: { avgStress: { type: Type.NUMBER }, errorProbability: { type: Type.NUMBER } } },
                'LOGISTICS': { type: Type.OBJECT, properties: { avgStress: { type: Type.NUMBER }, errorProbability: { type: Type.NUMBER } } },
                'QC_OFFICER': { type: Type.OBJECT, properties: { avgStress: { type: Type.NUMBER }, errorProbability: { type: Type.NUMBER } } }
              }
            },
            anomalies: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { workerId: { type: Type.STRING }, issue: { type: Type.STRING }, severity: { type: Type.STRING } } } }
          },
          required: ["overallRiskScore", "criticalInsights", "roleBreakdown", "anomalies"]
        }
      }
    });
    // Fix: Accessed text property directly
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return analyzeHumanRisk(telemetry);
  }
};
