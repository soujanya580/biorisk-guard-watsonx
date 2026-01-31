
import { GoogleGenAI, Type } from "@google/genai";
import { AnonymizationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performGenomicAnonymization = async (rawContent: string): Promise<AnonymizationResult> => {
  const model = 'gemini-3-pro-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: `Identify and redact all Personally Identifiable Information (PII) from the following genomic data content.
    The content might be in FASTA or VCF format, or clinical notes.
    Redact: Names, Patient IDs, DOBs, Clinic Names, Physician Names, and any unique identifiers in the metadata headers.
    Replace PII with "[REDACTED]". 
    
    CONTENT:
    ${rawContent}
    
    Output MUST be a JSON object matching this schema.`,
    config: {
      temperature: 0.1,
      systemInstruction: "You are a specialized HIPAA and GDPR compliance engine for genomic data anonymization. Be aggressive in finding hidden identifiers in metadata headers.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING },
          anonymizedText: { type: Type.STRING },
          privacyScore: { type: Type.NUMBER, description: "1-100 score where 100 is perfectly anonymized." },
          piiFound: { type: Type.ARRAY, items: { type: Type.STRING } },
          vulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Remaining risks in the anonymized data." },
          complianceLevel: { type: Type.STRING, enum: ["GDPR_9", "HIPAA_DEID", "FAILED"] },
          certificateId: { type: Type.STRING }
        },
        required: ["originalText", "anonymizedText", "privacyScore", "piiFound", "vulnerabilities", "complianceLevel", "certificateId"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
