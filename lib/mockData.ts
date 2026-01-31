
import { Vendor, MultiAgentRiskReport } from '../types';

export const GENOMIC_SAMPLES = {
  ZENITH: "ZENITH_PHARMA_SEQ_001: ATGC...GCTA bias_detected: true population_drift: 0.28 integrity_checksum: fail",
  NUGENE: "NUGENE_BIOTECH_SEQ_99: TAGC...CCGA bias_detected: true population_drift: 0.08 integrity_checksum: pass",
  PRECISION: "PRECISION_MED_UNIT_4: GGCT...AAAT bias_detected: false population_drift: 0.01 integrity_checksum: pass",
  EVERGREEN: "EVERGREEN_HEALTH_V42: CCAT...GGTA bias_detected: false population_drift: 0.04 integrity_checksum: pass",
  GLOBAL_LAB: "GLOBAL_LAB_ALPHA_SEQ: GATA...TTAC bias_detected: true population_drift: 0.11 integrity_checksum: pass",
};

export const INITIAL_VENDORS: Vendor[] = [
  { 
    id: 'pfizer-oncology', 
    name: 'Pfizer - Oncology Division', 
    industry: 'Pharmaceuticals', 
    overallScore: 3.8, 
    lastAnalysis: '2024-05-28', 
    status: 'ACTIVE',
    location: { lat: 40.7484, lng: -73.9857, city: 'New York', country: 'USA' }
  },
  { 
    id: 'pfizer-boston-lab', 
    name: 'Pfizer Boston Genomics Lab', 
    industry: 'Genomics', 
    overallScore: 4.2, 
    lastAnalysis: '2024-05-28', 
    status: 'ACTIVE',
    location: { lat: 42.3601, lng: -71.0589, city: 'Boston', country: 'USA' }
  },
  { 
    id: 'pfizer-quantum', 
    name: 'Pfizer Quantum Security Division', 
    industry: 'Quantum Security', 
    overallScore: 6.5, 
    lastAnalysis: '2024-05-28', 
    status: 'ACTIVE',
    location: { lat: 40.7484, lng: -73.9857, city: 'New York', country: 'USA' }
  },
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
    id: 'pfizer-id', 
    name: 'Pfizer', 
    industry: 'Pharmaceuticals', 
    overallScore: 4.5, 
    lastAnalysis: '2024-05-25', 
    status: 'ACTIVE',
    location: { lat: 40.7484, lng: -73.9857, city: 'New York', country: 'USA' }
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
    id: '4', 
    name: 'Evergreen Healthcare Systems', 
    industry: 'Health Systems', 
    overallScore: 4.2, 
    lastAnalysis: '2024-05-12', 
    status: 'ACTIVE',
    location: { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' }
  },
  { 
    id: '5', 
    name: 'Global Diagnostics Lab', 
    industry: 'Lab Services', 
    overallScore: 3.8, 
    lastAnalysis: '2024-05-10', 
    status: 'ACTIVE',
    location: { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' }
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
    id: '8', 
    name: 'Amazonas Therapeutics', 
    industry: 'Pharmaceuticals', 
    overallScore: 4.1, 
    lastAnalysis: '2024-05-19', 
    status: 'ACTIVE',
    location: { lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil' }
  },
  { 
    id: '9', 
    name: 'Southern Cross Diagnostics', 
    industry: 'Diagnostics', 
    overallScore: 3.1, 
    lastAnalysis: '2024-05-14', 
    status: 'ACTIVE',
    location: { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' }
  },
  { 
    id: '10', 
    name: 'Northern Helix Labs', 
    industry: 'Genomics', 
    overallScore: 8.9, 
    lastAnalysis: '2024-05-23', 
    status: 'REJECTED',
    location: { lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada' }
  },
  { 
    id: '11', 
    name: 'Alpine Phage Research', 
    industry: 'Biotech', 
    overallScore: 1.2, 
    lastAnalysis: '2024-05-25', 
    status: 'ACTIVE',
    location: { lat: 47.5596, lng: 7.5886, city: 'Basel', country: 'Switzerland' }
  },
  { 
    id: '12', 
    name: 'Red Sea MedTech', 
    industry: 'Medical Devices', 
    overallScore: 5.8, 
    lastAnalysis: '2024-05-24', 
    status: 'PENDING',
    location: { lat: 32.0853, lng: 34.7818, city: 'Tel Aviv', country: 'Israel' }
  }
];

export const MOCK_REPORTS: Record<string, MultiAgentRiskReport> = {
  '1': {
    vendorId: '1',
    vendorName: 'Zenith Pharmaceuticals',
    timestamp: '2024-05-20T10:00:00Z',
    summary: 'Zenith Pharmaceuticals presents a critical risk profile primarily driven by high genomic bias in their drug-discovery datasets and recent HIPAA audit failures.',
    overallRiskScore: 8.7,
    confidenceScore: 0.94,
    complianceAgent: {
      agentName: 'Compliance Agent',
      score: 9,
      confidence: 0.95,
      findings: ['Systemic failure to document FDA Part 11 electronic signatures', 'Incomplete HIPAA BAA documentation for cloud sub-processors'],
      recommendations: ['Immediate suspension of PII data flows', 'Complete re-audit of cloud infrastructure'],
      criticalAlerts: ['Potential GDPR non-compliance in EU data sovereignty']
    },
    genomicAgent: {
      agentName: 'Genomic Risk Agent',
      score: 9,
      confidence: 0.88,
      findings: ['Severe population drift detected in trial group 4', 'Genomic datasets show 40% bias towards specific ethnic clusters'],
      recommendations: ['Inject synthetic diverse datasets', 'Recalibrate weighting algorithms'],
      criticalAlerts: ['Algorithm output likely to produce biased healthcare outcomes']
    },
    financialAgent: {
      agentName: 'Financial Risk Agent',
      score: 4,
      confidence: 0.92,
      findings: ['Stable Series D funding', 'Strong market presence'],
      recommendations: ['Monitor R&D spend to revenue ratio'],
      criticalAlerts: []
    },
    predictiveAgent: {
      agentName: 'Predictive Risk Agent',
      score: 7,
      confidence: 0.85,
      findings: ['Historical audit patterns suggest pending regulatory scrutiny'],
      recommendations: ['Pre-emptive compliance deep dive'],
      criticalAlerts: [],
      predictiveMetrics: {
        failureProbability: 0.45,
        timeToAnomaly: '9 months'
      }
    },
    auditAgent: {
      agentName: 'Audit & Explainability',
      explanation: 'Risk flags triggered by significant population drift in trial data and documented HIPAA documentation gaps.',
      decisionPath: ['Data Ingestion', 'Compliance Validation', 'Genomic Anomaly Detection', 'Financial Stability Sweep'],
      regulatoryMapping: ['FDA Title 21 CFR Part 11', 'HIPAA Privacy Rule', 'GDPR Article 9']
    }
  }
};
