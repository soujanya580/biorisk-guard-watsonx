
export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export type AlertType = 'HIGH_RISK' | 'COMPLIANCE' | 'FINANCIAL' | 'GENOMIC' | 'TRIAL_FAILURE' | 'CRISIS' | 'HUMAN_FACTOR' | 'QUANTUM_VULNERABILITY';
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface Alert {
  id: string;
  vendorId: string;
  vendorName: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export type ReportType = 'COMPLIANCE' | 'FULL_RISK' | 'GENOMIC_AUDIT' | 'FISCAL_STABILITY' | 'CLINICAL_TRIAL_FORECAST' | 'AFTER_ACTION_REPORT' | 'PITCH_DECK' | 'HUMAN_PERFORMANCE_AUDIT' | 'QUANTUM_READINESS_CERT';

export interface Report {
  id: string;
  vendorId: string;
  vendorName: string;
  type: ReportType;
  date: string;
  riskScore: number;
  status: 'COMPLETED' | 'ARCHIVED';
  downloadUrl: string;
}

export interface Vendor {
  id: string;
  name: string;
  industry: string;
  overallScore: number;
  lastAnalysis: string;
  status: 'ACTIVE' | 'PENDING' | 'REJECTED';
  location?: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  importance?: number; 
  dependencies?: string[];
}

export interface QuantumAnalysis {
  overallScore: number; // 0-100
  pqcStatus: 'NOT_STARTED' | 'TRANSITIONING' | 'COMPLIANT';
  vulnerabilityTimeline: number; // years until crackable
  migrationCost: number; // USD
  advantagePotential: 'LOW' | 'MEDIUM' | 'HIGH';
  technicalAudit: {
    asymmetricRisk: string;
    symmetricRisk: string;
    quantumSafeAlgorithms: string[];
    optimizationTargets: string[];
  };
  recommendations: string[];
}

export interface WearableTelemetry {
  workerId: string;
  role: 'LAB_TECH' | 'LOGISTICS' | 'QC_OFFICER';
  stressScore: number; // 1-10
  sleepEfficiency: number; // %
  fatigueIndex: number; // 1-10
  currentLocation: {
    lat: number;
    lng: number;
    zone: 'BIO_SAFE_L3' | 'CONTROLLED_SUBSTANCE_VAULT' | 'LOADING_DOCK' | 'GENERAL_LAB';
  };
  timestamp: string;
}

export interface HumanRiskAnalysis {
  overallRiskScore: number;
  criticalInsights: string[];
  roleBreakdown: Record<string, { avgStress: number, errorProbability: number }>;
  anomalies: Array<{ workerId: string, issue: string, severity: 'HIGH' | 'MEDIUM' }>;
}

export interface ClinicalTrial {
  nctId: string;
  title: string;
  phase: 'PHASE1' | 'PHASE2' | 'PHASE3' | 'PHASE4';
  status: 'RECRUITING' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
  enrollment: number;
  dropoutRate: number;
  adverseEventsCount: number;
  primaryIndication: string;
  startDate: string;
  completionDate?: string;
}

export interface TrialAnalysis {
  nctId: string;
  successProbability: number;
  failureRiskFactors: string[];
  genomicMarkersImpact: string;
  predictedApprovalDate: string;
  regulatoryHurdles: string[];
  reasoningChain: string[];
}

export interface RegulatoryMilestone {
  agency: 'FDA' | 'EMA' | 'PMDA';
  submissionType: 'NDA' | 'BLA' | 'IND';
  currentStatus: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submissionDate: string;
  predictedDecisionDate: string;
}

export interface AgentFindings {
  agentName: string;
  personaName?: string;
  score: number;
  confidence: number;
  findings: string[];
  recommendations: string[];
  criticalAlerts: string[];
  signature?: string;
  predictiveMetrics?: {
    failureProbability: number;
    timeToAnomaly?: string;
  };
}

export interface MultiAgentRiskReport {
  vendorId: string;
  vendorName: string;
  timestamp: string;
  summary: string;
  overallRiskScore: number;
  confidenceScore: number;
  complianceAgent: AgentFindings;
  genomicAgent: AgentFindings;
  financialAgent: AgentFindings;
  predictiveAgent: AgentFindings;
  auditAgent: {
    agentName: string;
    explanation: string;
    decisionPath: string[];
    regulatoryMapping: string[];
  };
}

export interface AuditLog {
  id: string;
  hash: string;
  previousHash: string;
  timestamp: string;
  vendorId: string;
  vendorName: string;
  action: string;
  performer: string;
  details: string;
  status: 'SUCCESS' | 'FAILURE' | 'REJECTED';
  riskScore: number;
  agentSignatures: string[];
  snapshot: any;
  metadata: any;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agent: 'SYSTEM' | 'COMPLIANCE' | 'GENOMIC' | 'FINANCIAL' | 'PREDICTIVE' | 'AUDIT' | 'TRIAL_MONITOR' | 'CRISIS_OPS' | 'HUMAN_RISK' | 'QUANTUM';
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  baseStats: {
    containment: number;
    trust: number;
    stability: number;
  };
}

export interface CrisisDecision {
  id: string;
  text: string;
  impacts: {
    containment: number;
    trust: number;
    stability: number;
  };
  agentResponses: Record<string, string>;
}

export interface AfterActionReport {
  score: number;
  rank: string;
  summary: string;
  achievements: string[];
  feedback: string[];
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  scenario: string;
  date: string;
}

export interface SimulationResult {
  meanRisk: number;
  valueAtRisk: number;
  failureProbability: number;
  distributionData: { score: number; frequency: number }[];
}

export interface MitigationPlan {
  vendorId: string;
  vendorName: string;
  strategies: MitigationStrategy[];
  financialMetrics: {
    mitigationCostTotal: number;
    potentialExposureCost: number;
    insuranceSavings: number;
    roiPercentage: number;
  };
}

export interface MitigationStrategy {
  id: string;
  title: string;
  description: string;
  impactScore: number;
  costEstimate: number;
  timeline: string;
  priority: string;
  resources: {
    manpower: string;
    tech: string[];
  };
}

export interface AnonymizationResult {
  originalText: string;
  anonymizedText: string;
  privacyScore: number;
  piiFound: string[];
  vulnerabilities: string[];
  complianceLevel: 'GDPR_9' | 'HIPAA_DEID' | 'FAILED';
  certificateId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
  reasoningChain?: string[];
}

export type AudienceType = 'BOARD' | 'INSURANCE' | 'REGULATOR' | 'ACQUIRER';

export interface Slide {
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  metrics?: Record<string, string>;
  tone: string;
}

export interface PitchDeck {
  vendorId: string;
  vendorName: string;
  audience: AudienceType;
  slides: Slide[];
}
