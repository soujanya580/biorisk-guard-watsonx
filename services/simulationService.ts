
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationScenario, CrisisDecision, AfterActionReport } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const IS_DEMO_MODE = !process.env.API_KEY || process.env.API_KEY === 'your_api_key_here';

export const getNextCrisisStep = async (scenario: SimulationScenario, history: any[]): Promise<{ agentLog: any[], decisions: CrisisDecision[] }> => {
  if (IS_DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      agentLog: [
        { agent: 'Dr. Gene', message: 'DEMO: Genomic datasets are showing abnormal variance. We need isolation.', type: 'WARNING' },
        { agent: 'Inspector Comply', message: 'DEMO: Regulators are requesting an immediate audit trail.', type: 'INFO' }
      ],
      decisions: [
        { id: '1', text: 'Initiate Full Node Isolation', impacts: { containment: 20, trust: -10, stability: -5 }, agentResponses: {} },
        { id: '2', text: 'Issue Public Statement (Transparent)', impacts: { containment: 0, trust: 25, stability: -10 }, agentResponses: {} },
        { id: '3', text: 'Deploy Forensic Patch', impacts: { containment: 10, trust: 5, stability: 15 }, agentResponses: {} }
      ]
    };
  }

  const model = 'gemini-3-pro-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Crisis orchestrator for ${scenario.title}. History: ${JSON.stringify(history)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            agentLog: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { agent: { type: Type.STRING }, message: { type: Type.STRING }, type: { type: Type.STRING } } } },
            decisions: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  id: { type: Type.STRING }, 
                  text: { type: Type.STRING }, 
                  impacts: { type: Type.OBJECT, properties: { containment: { type: Type.NUMBER }, trust: { type: Type.NUMBER }, stability: { type: Type.NUMBER } } }, 
                  // Fix: agentResponses needs properties as Type.OBJECT cannot be empty
                  agentResponses: { 
                    type: Type.OBJECT,
                    properties: {
                      'Dr. Gene': { type: Type.STRING },
                      'Inspector Comply': { type: Type.STRING },
                      'Risk Oracle': { type: Type.STRING }
                    }
                  } 
                } 
              } 
            }
          },
          required: ["agentLog", "decisions"]
        }
      }
    });
    // Fix: Accessed text property directly
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return getNextCrisisStep(scenario, history);
  }
};

export const generateAAR = async (scenario: SimulationScenario, finalStats: any): Promise<AfterActionReport> => {
  if (IS_DEMO_MODE) {
    return {
      score: 88,
      rank: 'Senior Risk Architect',
      summary: 'DEMO: Exceptional handling of the genomic crisis. Trust remained high.',
      achievements: ['Swift Containment', 'Regulatory Synergy'],
      feedback: ['Excellent use of the forensic patch.']
    };
  }

  const model = 'gemini-3-pro-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate AAR for ${scenario.title}. Stats: ${JSON.stringify(finalStats)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            rank: { type: Type.STRING },
            summary: { type: Type.STRING },
            achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    // Fix: Accessed text property directly
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return generateAAR(scenario, finalStats);
  }
};
