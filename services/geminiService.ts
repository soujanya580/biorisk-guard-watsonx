
import { GoogleGenAI, Type } from "@google/genai";
import { MultiAgentRiskReport, MitigationPlan, ClinicalTrial, TrialAnalysis, PitchDeck, AudienceType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const IS_DEMO_MODE = !process.env.API_KEY || process.env.API_KEY === 'your_api_key_here';

// Helper for TTS audio decoding
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

// Internal singletons to track active audio
let currentAudioSource: AudioBufferSourceNode | null = null;
let currentAudioCtx: AudioContext | null = null;

/**
 * Generates speech and returns a promise that resolves when the speech FINISHES.
 * This ensures perfect sync with UI transitions.
 */
export const generateSpeech = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    // CRITICAL: Stop everything current
    window.speechSynthesis.cancel();
    if (currentAudioSource) {
      try {
        currentAudioSource.onended = null;
        currentAudioSource.stop();
        currentAudioSource.disconnect();
        currentAudioSource = null;
      } catch (e) {}
    }

    if (IS_DEMO_MODE) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      // Prefer high-quality professional voice
      const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || 
                             voices.find(v => v.lang.startsWith('en-US')) || 
                             voices[0];
      
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.pitch = 1.0;
      utterance.rate = 0.85; // SLOWER and clearer as requested
      
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
      return;
    }

    // Attempt Gemini Pro TTS
    (async () => {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: `Say clearly, slowly, and professionally: ${text}` }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          if (!currentAudioCtx) {
            currentAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }
          const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), currentAudioCtx, 24000, 1);
          const source = currentAudioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(currentAudioCtx.destination);
          currentAudioSource = source;
          
          source.onended = () => resolve();
          source.start();
        } else {
          resolve();
        }
      } catch (error) {
        console.error("Gemini TTS Error, fallback to Web Speech:", error);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.onend = () => resolve();
        window.speechSynthesis.speak(utterance);
      }
    })();
  });
};

export const performMultiAgentAnalysis = async (vendorName: string, vendorDescription: string): Promise<MultiAgentRiskReport> => {
  if (IS_DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      vendorId: 'demo-' + Math.random().toString(36).substr(2, 5),
      vendorName,
      timestamp: new Date().toISOString(),
      summary: `DEMO MODE: Autonomous assessment for ${vendorName} completed. Consensus reached with 98.2% confidence.`,
      overallRiskScore: 6.4,
      confidenceScore: 0.98,
      complianceAgent: {
        agentName: 'Inspector Comply',
        personaName: 'Inspector Comply',
        score: 7,
        confidence: 0.95,
        findings: ['HIPAA §164.308 violation found'],
        recommendations: ['Update internal audit trails'],
        criticalAlerts: ['Sovereignty leak detected'],
        signature: 'ERCA-COMP-77'
      },
      genomicAgent: {
        agentName: 'Dr. Gene',
        personaName: 'Dr. Gene',
        score: 5,
        confidence: 0.92,
        findings: ['Moderate population drift detected'],
        recommendations: ['Recalibrate weighting'],
        criticalAlerts: [],
        signature: 'ERCA-GENO-01'
      },
      financialAgent: {
        agentName: 'Risk Oracle',
        personaName: 'Risk Oracle',
        score: 4,
        confidence: 0.94,
        findings: ['Stable burn rate'],
        recommendations: ['Monitor R&D spend'],
        criticalAlerts: [],
        signature: 'ERCA-FIN-99'
      },
      predictiveAgent: {
        agentName: 'Predictive Risk Agent',
        personaName: 'Predictive Risk Agent',
        score: 3,
        confidence: 0.88,
        findings: ['No anomalies predicted'],
        recommendations: ['Maintain deep sweeps'],
        criticalAlerts: [],
        signature: 'ERCA-PRED-04'
      },
      auditAgent: {
        agentName: 'Audit & Explainability',
        explanation: 'The entity presents a manageable risk profile.',
        decisionPath: ['Logic Ingestion', 'Compliance Verification'],
        regulatoryMapping: ['HIPAA', 'GDPR']
      }
    };
  }

  const model = 'gemini-3-pro-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Perform multi-agent risk assessment for: ${vendorName}. Context: ${vendorDescription}`,
      config: {
        temperature: 0.2,
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
            complianceAgent: { type: Type.OBJECT, properties: { agentName: { type: Type.STRING }, personaName: { type: Type.STRING }, score: { type: Type.NUMBER }, confidence: { type: Type.NUMBER }, findings: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } }, signature: { type: Type.STRING } }, required: ["agentName", "personaName", "score", "confidence", "findings", "recommendations", "criticalAlerts", "signature"] },
            genomicAgent: { type: Type.OBJECT, properties: { agentName: { type: Type.STRING }, personaName: { type: Type.STRING }, score: { type: Type.NUMBER }, confidence: { type: Type.NUMBER }, findings: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } }, signature: { type: Type.STRING } }, required: ["agentName", "personaName", "score", "confidence", "findings", "recommendations", "criticalAlerts", "signature"] },
            financialAgent: { type: Type.OBJECT, properties: { agentName: { type: Type.STRING }, personaName: { type: Type.STRING }, score: { type: Type.NUMBER }, confidence: { type: Type.NUMBER }, findings: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } }, signature: { type: Type.STRING } }, required: ["agentName", "personaName", "score", "confidence", "findings", "recommendations", "criticalAlerts", "signature"] },
            predictiveAgent: { type: Type.OBJECT, properties: { agentName: { type: Type.STRING }, personaName: { type: Type.STRING }, score: { type: Type.NUMBER }, confidence: { type: Type.NUMBER }, findings: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } }, signature: { type: Type.STRING } }, required: ["agentName", "personaName", "score", "confidence", "findings", "recommendations", "criticalAlerts", "signature"] },
            auditAgent: { type: Type.OBJECT, properties: { agentName: { type: Type.STRING }, explanation: { type: Type.STRING }, decisionPath: { type: Type.ARRAY, items: { type: Type.STRING } }, regulatoryMapping: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["agentName", "explanation", "decisionPath", "regulatoryMapping"] }
          },
          required: ["vendorId", "vendorName", "timestamp", "summary", "overallRiskScore", "confidenceScore", "complianceAgent", "genomicAgent", "financialAgent", "predictiveAgent", "auditAgent"]
        }
      }
    });
    return JSON.parse(response.text || '{}') as MultiAgentRiskReport;
  } catch (err) {
    return performMultiAgentAnalysis(vendorName, vendorDescription);
  }
};

export const performRegulatoryChat = async (
  message: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  context?: { vendorName: string, industry: string, details?: string }
): Promise<{ content: string, citations: string[], reasoningChain: string[] }> => {
  if (IS_DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      content: "According to HIPAA Security Rule §164.308(a)(1)(ii)(B), risk management requires implementing security measures to reduce vulnerabilities to a reasonable level.",
      citations: ["HIPAA §164.308", "GDPR Article 32"],
      reasoningChain: ["Query parsed", "Law database lookup", "Synthesis"]
    };
  }

  const model = 'gemini-3-pro-preview';
  const chatContents = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));
  chatContents.push({ role: 'user', parts: [{ text: `User Question: ${message}` }] });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: chatContents,
      config: {
        systemInstruction: `You are the BioRisk Guard Regulatory AI. Cite exact regulations.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            citations: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoningChain: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["content", "citations", "reasoningChain"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return performRegulatoryChat(message, history, context);
  }
};

export const generateMitigationPlan = async (report: MultiAgentRiskReport): Promise<MitigationPlan> => {
  if (IS_DEMO_MODE) {
    return {
      vendorId: report.vendorId,
      vendorName: report.vendorName,
      strategies: [
        { id: '1', title: 'Data Encryption Upgrade', description: 'Transition to AES-256 for all PII streams.', impactScore: 2.1, costEstimate: 12000, timeline: '2 weeks', priority: 'URGENT', resources: { manpower: '1 Engineer', tech: ['AWS KMS'] } },
        { id: '2', title: 'Compliance Audit', description: 'Independent review of BAA agreements.', impactScore: 1.5, costEstimate: 5000, timeline: '1 month', priority: 'MEDIUM', resources: { manpower: 'Legal Team', tech: ['Vault'] } }
      ],
      financialMetrics: {
        mitigationCostTotal: 17000,
        potentialExposureCost: 1500000,
        insuranceSavings: 2500,
        roiPercentage: 8823
      }
    };
  }

  const model = 'gemini-3-pro-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate mitigation plan for ${report.vendorName}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendorId: { type: Type.STRING },
            vendorName: { type: Type.STRING },
            strategies: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, impactScore: { type: Type.NUMBER }, costEstimate: { type: Type.NUMBER }, timeline: { type: Type.STRING }, priority: { type: Type.STRING }, resources: { type: Type.OBJECT, properties: { manpower: { type: Type.STRING }, tech: { type: Type.ARRAY, items: { type: Type.STRING } } } } } } },
            financialMetrics: { type: Type.OBJECT, properties: { mitigationCostTotal: { type: Type.NUMBER }, potentialExposureCost: { type: Type.NUMBER }, insuranceSavings: { type: Type.NUMBER }, roiPercentage: { type: Type.NUMBER } } }
          },
          required: ["vendorId", "vendorName", "strategies", "financialMetrics"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return generateMitigationPlan(report);
  }
};

export const generatePitchDeck = async (report: MultiAgentRiskReport, audience: AudienceType): Promise<PitchDeck> => {
  if (IS_DEMO_MODE) {
    return {
      vendorId: report.vendorId,
      vendorName: report.vendorName,
      audience,
      slides: [
        { title: 'Executive Summary', bulletPoints: ['Risk Score: 6.4/10', 'Primary Vulnerability: Compliance'], tone: 'Professional' },
        { title: 'Financial Outlook', bulletPoints: ['ROI of mitigation: High', 'Insurance offset: $2.5k'], tone: 'Professional' }
      ]
    };
  }

  const model = 'gemini-3-pro-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate ${audience} pitch for ${report.vendorName}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vendorId: { type: Type.STRING },
            vendorName: { type: Type.STRING },
            audience: { type: Type.STRING },
            slides: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, subtitle: { type: Type.STRING }, bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } }, metrics: { type: Type.OBJECT }, tone: { type: Type.STRING } }, required: ["title", "bulletPoints", "tone"] } }
          },
          required: ["vendorId", "vendorName", "audience", "slides"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (err) {
    return generatePitchDeck(report, audience);
  }
};
