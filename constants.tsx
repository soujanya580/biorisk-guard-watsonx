
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Bell, 
  FileText,
  ShieldCheck,
  Dna,
  TrendingDown,
  AlertTriangle,
  History,
  Activity,
  Cpu,
  ShieldAlert,
  SearchCode,
  LineChart,
  FlaskConical,
  Zap,
  Layers,
  View,
  MessageSquareQuote,
  EyeOff,
  Globe,
  Wrench,
  Stethoscope,
  Flame,
  Presentation,
  Watch,
  Atom,
  BrainCircuit,
  Scale,
  DollarSign
} from 'lucide-react';
import { Vendor, ClinicalTrial, SimulationScenario, WearableTelemetry } from './types';

export const COLORS = {
  IBM_BLUE: '#0062FF',
  HEALTHCARE_GREEN: '#00C853',
  DANGER: '#FF2D55',
  WARNING: '#FFD600',
  IBM_DARK: '#161616',
  IBM_GRAY: '#262626',
  IBM_BORDER: '#393939',
};

export const NAVIGATION = [
  { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
  { name: 'Quantum Lab', icon: <Atom className="w-5 h-5 text-cyan-400" />, path: '/quantum' },
  { name: 'Wearable Hub', icon: <Watch className="w-5 h-5" />, path: '/wearables' },
  { name: 'Pitch AI', icon: <Presentation className="w-5 h-5" />, path: '/pitch' },
  { name: 'Crisis Sim', icon: <Flame className="w-5 h-5 text-[#FF2D55]" />, path: '/crisis-sim' },
  { name: 'Clinical Trials', icon: <Stethoscope className="w-5 h-5" />, path: '/trials' },
  { name: 'Global Risk Map', icon: <Globe className="w-5 h-5" />, path: '/risk-map' },
  { name: 'Mitigation Plans', icon: <Wrench className="w-5 h-5" />, path: '/mitigation' },
  { name: 'Vendors', icon: <Users className="w-5 h-5" />, path: '/vendors' },
  { name: 'Assessments', icon: <ClipboardCheck className="w-5 h-5" />, path: '/assessments' },
  { name: 'Regulatory Chat', icon: <MessageSquareQuote className="w-5 h-5" />, path: '/chat' },
  { name: 'Anonymizer', icon: <EyeOff className="w-5 h-5" />, path: '/anonymizer' },
  { name: 'Bio-Lab', icon: <FlaskConical className="w-5 h-5" />, path: '/biolab' },
  { name: 'Sim-Lab', icon: <Layers className="w-5 h-5" />, path: '/simulation' },
  { name: 'Spatial-Lab', icon: <View className="w-5 h-5" />, path: '/spatial' },
  { name: 'Alerts', icon: <Bell className="w-5 h-5" />, path: '/alerts' },
  { name: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/reports' },
  { name: 'Audit Logs', icon: <History className="w-5 h-5" />, path: '/audit' },
];

export const MOCK_WEARABLES: WearableTelemetry[] = [
  {
    workerId: 'STAFF-102',
    role: 'LAB_TECH',
    stressScore: 8.4,
    sleepEfficiency: 54,
    fatigueIndex: 9.1,
    currentLocation: { lat: 42.3601, lng: -71.0589, zone: 'BIO_SAFE_L3' },
    timestamp: new Date().toISOString()
  },
  {
    workerId: 'STAFF-098',
    role: 'QC_OFFICER',
    stressScore: 7.2,
    sleepEfficiency: 68,
    fatigueIndex: 7.4,
    currentLocation: { lat: 42.3602, lng: -71.0590, zone: 'GENERAL_LAB' },
    timestamp: new Date().toISOString()
  },
  {
    workerId: 'TECH-772',
    role: 'LAB_TECH',
    stressScore: 7.8,
    sleepEfficiency: 62,
    fatigueIndex: 8.2,
    currentLocation: { lat: 37.7749, lng: -122.4194, zone: 'BIO_SAFE_L3' },
    timestamp: new Date().toISOString()
  },
  {
    workerId: 'STAFF-044',
    role: 'LOGISTICS',
    stressScore: 3.5,
    sleepEfficiency: 82,
    fatigueIndex: 4.1,
    currentLocation: { lat: 42.3601, lng: -71.0588, zone: 'LOADING_DOCK' },
    timestamp: new Date().toISOString()
  },
  {
    workerId: 'LOG-441',
    role: 'LOGISTICS',
    stressScore: 4.1,
    sleepEfficiency: 88,
    fatigueIndex: 2.5,
    currentLocation: { lat: 37.7745, lng: -122.4190, zone: 'CONTROLLED_SUBSTANCE_VAULT' },
    timestamp: new Date().toISOString()
  },
  {
    workerId: 'QC-902',
    role: 'QC_OFFICER',
    stressScore: 3.2,
    sleepEfficiency: 92,
    fatigueIndex: 1.8,
    currentLocation: { lat: 37.7752, lng: -122.4199, zone: 'GENERAL_LAB' },
    timestamp: new Date().toISOString()
  }
];

export const CRISIS_SCENARIOS: SimulationScenario[] = [
  {
    id: 'scen-1',
    title: 'Genomic Data Leak',
    description: 'A major DNA sequencing lab has leaked 50,000 raw patient records including PII and sensitive markers for rare diseases.',
    icon: 'ShieldAlert',
    difficulty: 'HARD',
    baseStats: { containment: 10, trust: 30, stability: 50 }
  },
  {
    id: 'scen-2',
    title: 'FDA Clinical Halt',
    description: 'An ongoing Phase III oncology trial has been halted due to 3 unexplained fatalities in cohort B.',
    icon: 'Stethoscope',
    difficulty: 'MEDIUM',
    baseStats: { containment: 40, trust: 60, stability: 20 }
  },
  {
    id: 'scen-3',
    title: 'API Supply Disruption',
    description: 'A critical manufacturing plant in Singapore responsible for 40% of global insulin API is offline after a cyber attack.',
    icon: 'Activity',
    difficulty: 'EASY',
    baseStats: { containment: 70, trust: 80, stability: 15 }
  }
];

export const MOCK_LEADERBOARD = [
  { name: 'ChiefRisk_Alpha', score: 9420, scenario: 'Genomic Data Leak', date: '2024-05-12' },
  { name: 'BioSentinel_99', score: 8850, scenario: 'FDA Clinical Halt', date: '2024-05-15' },
  { name: 'ComplianceKing', score: 8200, scenario: 'API Supply Disruption', date: '2024-05-18' },
  { name: 'HelixGuard_Pro', score: 7900, scenario: 'Genomic Data Leak', date: '2024-05-19' },
  { name: 'DataMedic', score: 7100, scenario: 'FDA Clinical Halt', date: '2024-05-20' },
];

export const MOCK_TRIALS: ClinicalTrial[] = [
  {
    nctId: 'NCT04523912',
    title: 'Efficacy and Safety of G-729 in Patients with BRCA-Positive Triple Negative Breast Cancer',
    phase: 'PHASE3',
    status: 'ACTIVE',
    enrollment: 450,
    dropoutRate: 12.4,
    adverseEventsCount: 22,
    primaryIndication: 'Oncology',
    startDate: '2023-01-15'
  },
  {
    nctId: 'NCT05128841',
    title: 'Gene Therapy for Rare Pediatric Neurological Disorders (GT-88X)',
    phase: 'PHASE2',
    status: 'RECRUITING',
    enrollment: 45,
    dropoutRate: 2.1,
    adverseEventsCount: 3,
    primaryIndication: 'Rare Disease',
    startDate: '2024-03-10'
  }
];

export const MOCK_VENDORS: Vendor[] = [
  { 
    id: '1', 
    name: 'Zenith Pharmaceuticals', 
    industry: 'Pharmaceuticals', 
    overallScore: 8.7, 
    lastAnalysis: '2024-05-20', 
    status: 'REJECTED',
    location: { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' }
  },
  { 
    id: '2', 
    name: 'NuGene Biotech', 
    industry: 'Biotech', 
    overallScore: 5.4, 
    lastAnalysis: '2024-05-18', 
    status: 'PENDING',
    location: { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany' }
  },
  { 
    id: '3', 
    name: 'PrecisionMed Instruments', 
    industry: 'Diagnostics', 
    overallScore: 1.9, 
    lastAnalysis: '2024-05-15', 
    status: 'ACTIVE',
    location: { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' }
  },
  { 
    id: '6', 
    name: 'Orient Bioworks', 
    industry: 'Genomics', 
    overallScore: 7.2, 
    lastAnalysis: '2024-05-22', 
    status: 'PENDING',
    location: { lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'China' }
  },
  { 
    id: '7', 
    name: 'Bharat BioInformatics', 
    industry: 'Bioinformatics', 
    overallScore: 2.4, 
    lastAnalysis: '2024-05-21', 
    status: 'ACTIVE',
    location: { lat: 12.9716, lng: 77.5946, city: 'Bangalore', country: 'India' }
  },
  { 
    id: '10', 
    name: 'Northern Helix Labs', 
    industry: 'Genomics', 
    overallScore: 8.9, 
    lastAnalysis: '2024-05-23', 
    status: 'REJECTED',
    location: { lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada' }
  }
];

export const DASHBOARD_STATS = [
  { label: 'Total Vendors', value: '42', trend: '+12%', icon: <Users className="w-5 h-5" />, color: '#0062FF' },
  { label: 'High Risk Count', value: '05', trend: 'CRITICAL', icon: <AlertTriangle className="w-5 h-5" />, color: '#FF2D55' },
  { label: 'Avg Risk Score', value: '4.8', trend: '-2.1%', icon: <TrendingDown className="w-5 h-5" />, color: '#00C853' },
  { label: 'Audit Trail', value: '1.2k', trend: 'SECURE', icon: <History className="w-5 h-5" />, color: '#FFD600' },
];

export const RISK_DISTRIBUTION = [
  { name: 'Low Risk', value: 25, color: '#00C853' },
  { name: 'Medium Risk', value: 12, color: '#FFD600' },
  { name: 'High Risk', value: 5, color: '#FF2D55' },
];

export const AGENT_CONFIG = {
  COMPLIANCE: {
    id: 'inspector_comply',
    name: "Inspector Comply",
    role: "Regulatory Compliance Officer",
    description: "Strict regulatory node with deep knowledge of FDA Part 11 and GDPR Article 9. Prioritizes data sovereignty and audit documentation.",
    icon: <Scale className="w-5 h-5" />,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    signature: "Badge #ERCA-09-ALPHA"
  },
  GENOMIC: {
    id: 'dr_gene',
    name: "Dr. Gene",
    role: "Senior Genomic Researcher",
    description: "Bioinformatics specialist focused on population drift, genomic bias detection, and data integrity in large-scale sequencers.",
    icon: <SearchCode className="w-5 h-5" />,
    color: "text-green-500",
    bg: "bg-green-500/10",
    signature: "Ph.D Genomic Sciences"
  },
  FINANCIAL: {
    id: 'risk_oracle',
    name: "Risk Oracle",
    role: "Fiscal Stability Analyst",
    description: "Quant analyst monitoring biotech funding cycles, patent cliffs, and market benchmarks to predict vendor longevity.",
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    signature: "Certified Risk Quant V3"
  },
  PREDICTIVE: {
    id: 'predictive_agent',
    name: "Predictive Risk Agent",
    role: "Anomaly Forecaster",
    description: "Deep learning node calculating failure probabilities and predicting regulatory roadblocks 12 months in advance.",
    icon: <Activity className="w-5 h-5" />,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    signature: "LSTM_ENGINE_V4"
  },
  AUDIT: {
    id: 'audit_agent',
    name: "Audit & Explainability",
    role: "Systems Integrity Guardian",
    description: "The final consensus node. Ensures all agent decisions are documented into the blockchain with human-readable reasoning.",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    signature: "Ledger Root Certificate"
  }
};
