
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { MultiAgentRiskReport } from "../types";
import { CONFIG } from "./config";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
export const configureGemini = (): GoogleGenAI => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const parseAIResponse = (response: GenerateContentResponse): any => {
  // Accessing text property directly as per @google/genai guidelines
  const text = response.text;
  if (!text) {
    throw new Error("Empty response from ERCA engine.");
  }
  try {
    // Clean potential markdown code blocks
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parse Error:", text);
    throw new Error("Failed to parse risk report from AI engine.");
  }
};

export const analyzeVendorRisk = async (vendorName: string, vendorDescription: string): Promise<MultiAgentRiskReport> => {
  const ai = configureGemini();
  const model = CONFIG.ai.model || 'gemini-3-pro-preview';

  // Using ai.models.generateContent directly with model name as per guidelines
  const response = await ai.models.generateContent({
    model,
    contents: `You are the BioRisk Guard ERCA (Enterprise Risk & Compliance Autopilot) Master Controller.
    Perform an exhaustive multi-agent risk assessment for:
    
    VENDOR NAME: ${vendorName}
    BUSINESS CONTEXT: ${vendorDescription}
    
    AGENT PERSONAS & REQUIREMENTS:
    1. Dr. Gene (Genomic Risk Agent): I'm a genomic researcher with 20 years experience. Analyze for BRCA mutations, rare disease bias, population drift, and misclassification. My style is clinical and precise.
    2. Inspector Comply (Compliance Agent): Strict regulatory officer who loves details. Check HIPAA (especially Privacy Rule), GDPR Article 9, and FDA 21 CFR Part 11 compliance. Always reference specific sections.
    3. Risk Oracle (Financial Agent): Data-driven financial analyst. Predict market stability, biotech funding cycles, patent cliffs, and fiscal health using industry benchmarks.
    4. Predictive Risk Agent: Calculate failure probabilities for compliance and trial risks.
    5. Audit & Explainability Agent: Generate a decision path, regulatory mappings, and human-readable explanations.
    
    Output must be a valid JSON object matching the defined schema exactly.`,
    config: {
      temperature: 0.2,
      systemInstruction: "You are an elite BioRisk Auditor. Every score MUST include a confidence metric (0-1). Provide deep, explainable reasoning for every risk flag. Every agent must provide their personaName and a unique 'signature' string at the end of their report section.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vendorId: { type: Type.STRING },
          vendorName: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          summary: { type: Type.STRING },
          overallRiskScore: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          complianceAgent: {
            type: Type.OBJECT,
            properties: {
              agentName: { type: Type.STRING },
              personaName: { type: Type.STRING },
              score: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              findings: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
              signature: { type: Type.STRING },
            },
            required: ["agentName", "personaName", "score", "confidence", "findings", "recommendations", "criticalAlerts", "signature"]
          },
          genomicAgent: {
            type: Type.OBJECT,
            properties: {
              agentName: { type: Type.STRING },
              personaName: { type: Type.STRING },
              score: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              findings: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
              signature: { type: Type.STRING },
            },
            required: ["agentName", "personaName", "score", "confidence", "findings", "recommendations", "criticalAlerts", "signature"]
          },
          financialAgent: {
            type: Type.OBJECT,
            properties: {
              agentName: { type: Type.STRING },
              personaName: { type: Type.STRING },
              score: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              findings: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
              signature: { type: Type.STRING },
            },
            required: ["agentName", "personaName", "score", "confidence", "findings", "recommendations", "criticalAlerts", "signature"]
          },
          predictiveAgent: {
            type: Type.OBJECT,
            properties: {
              agentName: { type: Type.STRING },
              score: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              predictiveMetrics: {
                type: Type.OBJECT,
                properties: {
                  failureProbability: { type: Type.NUMBER },
                  timeToAnomaly: { type: Type.STRING }
                }
              },
              findings: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["agentName", "score", "confidence", "findings", "recommendations", "criticalAlerts"]
          },
          auditAgent: {
            type: Type.OBJECT,
            properties: {
              agentName: { type: Type.STRING },
              explanation: { type: Type.STRING },
              decisionPath: { type: Type.ARRAY, items: { type: Type.STRING } },
              regulatoryMapping: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["agentName", "explanation", "decisionPath", "regulatoryMapping"]
          }
        },
        required: ["vendorId", "vendorName", "timestamp", "summary", "overallRiskScore", "confidenceScore", "complianceAgent", "genomicAgent", "financialAgent", "predictiveAgent", "auditAgent"]
      }
    }
  });

  return parseAIResponse(response) as MultiAgentRiskReport;
};

export const performMultiAgentAnalysis = analyzeVendorRisk;
