
import { GoogleGenAI, Type } from "@google/genai";
import { QuantumAnalysis, Vendor } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const IS_DEMO_MODE = !process.env.API_KEY || process.env.API_KEY === 'your_api_key_here';

export const performQuantumAudit = async (vendor: Vendor): Promise<QuantumAnalysis> => {
  if (IS_DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      overallScore: 42,
      pqcStatus: 'TRANSITIONING',
      vulnerabilityTimeline: 7.2,
      migrationCost: 850000,
      advantagePotential: 'HIGH',
      technicalAudit: {
        asymmetricRisk: 'DEMO: Standard RSA-2048 is highly vulnerable to Shor’s algorithm on a 4000-qubit system.',
        symmetricRisk: 'DEMO: Grover’s algorithm effectively halves the bit-security of AES-128.',
        quantumSafeAlgorithms: ['Crystal-Kyber', 'Dilithium', 'Falcon'],
        optimizationTargets: ['Patient database encryption', 'Sequence transfer protocols']
      },
      recommendations: ['Upgrade to NIST-PQC algorithms', 'Implement quantum key distribution', 'Audit cloud vendor readiness']
    };
  }

  const model = 'gemini-3-pro-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Quantum Audit for ${vendor.name}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            pqcStatus: { type: Type.STRING },
            vulnerabilityTimeline: { type: Type.NUMBER },
            migrationCost: { type: Type.NUMBER },
            advantagePotential: { type: Type.STRING },
            technicalAudit: { type: Type.OBJECT, properties: { asymmetricRisk: { type: Type.STRING }, symmetricRisk: { type: Type.STRING }, quantumSafeAlgorithms: { type: Type.ARRAY, items: { type: Type.STRING } }, optimizationTargets: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["overallScore", "pqcStatus", "vulnerabilityTimeline", "migrationCost", "advantagePotential", "technicalAudit", "recommendations"]
        }
      }
    });
    // Fix: Accessed text property directly
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return performQuantumAudit(vendor);
  }
};
