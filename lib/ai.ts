
import { MultiAgentRiskReport } from '../types';

export const analyzeGenomicData = (data: string) => {
  const hasBias = data.includes('bias_detected: true') || Math.random() > 0.7;
  const driftMatch = data.match(/population_drift: ([\d.]+)/);
  const drift = driftMatch ? parseFloat(driftMatch[1]) : Math.random() * 0.3;
  
  return {
    score: hasBias ? Math.floor(Math.random() * 4) + 7 : Math.floor(Math.random() * 4) + 1,
    findings: hasBias ? ['Genetic sample bias detected in repository', `Population drift index at ${drift.toFixed(2)}`, 'Minority representation below BRCA baseline requirements'] : ['Data integrity verified', 'Sample diversity compliant', 'BRCA1/2 dataset stability confirmed'],
    alerts: hasBias ? ['CRITICAL: Genomic bias exceeds safety threshold'] : []
  };
};

export const checkCompliance = (industry: string) => {
  const score = Math.floor(Math.random() * 10) + 1;
  const regs = industry === 'Genomics' ? ['HIPAA', 'GDPR', 'GINA'] : ['HIPAA', 'GDPR'];
  
  return {
    score,
    findings: score > 7 ? [`Non-compliance with ${regs[0]} Section 164.502 detected`, 'Audit trail for GDPR Article 9 processing missing'] : ['Standard compliance verified per FDA 21 CFR Part 11'],
    alerts: score > 8 ? [`IMMEDIATE ACTION: ${regs[1]} violation path found`] : []
  };
};

export const simulateAIAssessment = async (name: string, description: string): Promise<MultiAgentRiskReport> => {
  await new Promise(r => setTimeout(r, 2000));
  
  const genomic = analyzeGenomicData(description);
  const compliance = checkCompliance('Genomics'); // Default for simulation
  const financialScore = Math.floor(Math.random() * 10) + 1;
  
  const overallScore = Number(((genomic.score + compliance.score + financialScore) / 3).toFixed(1));

  return {
    vendorId: Math.random().toString(36).substr(2, 9),
    vendorName: name,
    timestamp: new Date().toISOString(),
    summary: `Autonomous assessment for ${name} completed. The entity presents a ${overallScore > 7 ? 'Critical' : overallScore > 4 ? 'Moderate' : 'Low'} risk profile. Multi-agent consensus reached with 94% confidence.`,
    overallRiskScore: overallScore,
    confidenceScore: 0.88,
    complianceAgent: {
      agentName: 'Inspector Comply',
      personaName: 'Inspector Comply',
      score: compliance.score,
      confidence: 0.92,
      findings: compliance.findings,
      recommendations: ['Conduct full internal audit of HIPAA Title II data flows', 'Update GDPR Article 9 policy documentation'],
      criticalAlerts: compliance.alerts,
      signature: '— Inspector Comply, Badge #ERCA-774'
    },
    genomicAgent: {
      agentName: 'Dr. Gene',
      personaName: 'Dr. Gene',
      score: genomic.score,
      confidence: 0.84,
      findings: genomic.findings,
      recommendations: ['Increase cohort diversity for rare disease clusters', 'Review algorithmic fairness in BRCA pipelines'],
      criticalAlerts: genomic.alerts,
      signature: '— Dr. Gene, Senior Research Fellow'
    },
    financialAgent: {
      agentName: 'Risk Oracle',
      personaName: 'Risk Oracle',
      score: financialScore,
      confidence: 0.9,
      findings: financialScore > 7 ? ['High burn rate detected vs industry benchmarks', 'Potential patent cliff in Q3 2025'] : ['Stable Series C funding', 'Strong biotech market position'],
      recommendations: ['Monitor R&D spend to revenue ratio', 'Review patent portfolio longevity'],
      criticalAlerts: financialScore > 8 ? ['CRITICAL: Insolvency risk detected'] : [],
      signature: '— Risk Oracle, Quantitative Analyst'
    },
    predictiveAgent: {
      agentName: 'Predictive Risk Agent',
      score: 5,
      confidence: 0.8,
      findings: ['Prediction models indicate standard operational drift'],
      recommendations: ['Schedule routine predictive sweep in 6 months'],
      criticalAlerts: [],
      predictiveMetrics: {
        failureProbability: 0.12,
        timeToAnomaly: '15 months'
      }
    },
    auditAgent: {
      agentName: 'Audit & Explainability',
      explanation: `Automated audit performed on cluster node ${name}. Risks were evaluated across compliance, financial and genomic vectors.`,
      decisionPath: ['Input Validation', 'Handshake Protocol', 'Multi-Agent Parallel Execution', 'Logic Synthesis'],
      regulatoryMapping: ['HIPAA', 'GDPR', 'FDA Part 11']
    }
  };
};
