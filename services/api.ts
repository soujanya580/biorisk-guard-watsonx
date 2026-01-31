
import { Vendor, MultiAgentRiskReport, Alert, Report, ReportType, AuditLog } from '../types';
import { INITIAL_VENDORS, MOCK_REPORTS } from '../lib/mockData';
import { simulateAIAssessment } from '../lib/ai';
import { analyzeVendorRisk } from '../lib/gemini';

// Helper to generate a mock SHA-256 style hash
const generateMockHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
};

class MockApiService {
  private vendors: Vendor[] = [...INITIAL_VENDORS];
  private reports: Record<string, MultiAgentRiskReport> = { ...MOCK_REPORTS };
  private generatedReports: Report[] = [];
  private alerts: Alert[] = [];
  private auditLogs: AuditLog[] = [];
  
  private alertSubscribers: Array<(alerts: Alert[]) => void> = [];
  private reportSubscribers: Array<(reports: Report[]) => void> = [];
  private auditSubscribers: Array<(logs: AuditLog[]) => void> = [];

  constructor() {
    // Genesis Block
    const genesisTime = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
    const genesisData = "GENESIS_BLOCK_BIORISK_GUARD_V2.4";
    const genesisHash = generateMockHash(genesisData);
    
    this.auditLogs = [
      {
        id: 'block-0',
        hash: genesisHash,
        previousHash: "0".repeat(64),
        timestamp: genesisTime,
        vendorId: '0',
        vendorName: 'SYSTEM_KERNEL',
        action: 'GENESIS',
        performer: 'BOOT_LOADER',
        details: 'Audit Ledger Initialized. SHA-256 Integrity Active.',
        status: 'SUCCESS',
        riskScore: 0,
        agentSignatures: ['KERNEL_ROOT'],
        snapshot: {},
        metadata: { version: '2.4.0' }
      }
    ];

    // Seed some initial blocks
    const secondBlockTime = new Date(Date.now() - 1000 * 60 * 120).toISOString();
    const secondBlockPrevHash = this.auditLogs[0].hash;
    const secondBlockData = `Zenith Pharmaceuticals-RISK_ASSESSMENT_AUTO-${secondBlockPrevHash}`;
    
    this.auditLogs.unshift({
      id: 'block-1',
      hash: generateMockHash(secondBlockData),
      previousHash: secondBlockPrevHash,
      timestamp: secondBlockTime,
      vendorId: '1',
      vendorName: 'Zenith Pharmaceuticals',
      action: 'RISK_ASSESSMENT_AUTO',
      performer: 'ERCA_MASTER_CONTROLLER',
      details: 'Full multi-agent audit completed. Critical bias found in genomic trial data.',
      status: 'SUCCESS',
      riskScore: 8.7,
      agentSignatures: ['Inspector Comply', 'Dr. Gene', 'Risk Oracle'],
      snapshot: MOCK_REPORTS['1'],
      metadata: { riskScore: 8.7, agents: 5 }
    });

    // Initial alerts
    this.alerts = [
      {
        id: 'alert-mail-1',
        vendorId: '1',
        vendorName: 'System Compliance',
        type: 'COMPLIANCE',
        severity: 'INFO',
        message: 'Compliance summary dispatched to soujanyas580@gmail.com for final node validation.',
        timestamp: new Date().toISOString(),
        isRead: false
      },
      {
        id: 'demo-alert-1',
        vendorId: '1',
        vendorName: 'Zenith Pharmaceuticals',
        type: 'HIGH_RISK',
        severity: 'CRITICAL',
        message: 'ERCA Autopilot flagged critical genomic bias patterns (Index: 8.7).',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        isRead: false
      }
    ];
  }

  subscribeToAlerts(callback: (alerts: Alert[]) => void) {
    this.alertSubscribers.push(callback);
    callback(this.alerts);
    return () => { this.alertSubscribers = this.alertSubscribers.filter(s => s !== callback); };
  }

  subscribeToReports(callback: (reports: Report[]) => void) {
    this.reportSubscribers.push(callback);
    callback(this.generatedReports);
    return () => { this.reportSubscribers = this.reportSubscribers.filter(s => s !== callback); };
  }

  subscribeToAudit(callback: (logs: AuditLog[]) => void) {
    this.auditSubscribers.push(callback);
    callback(this.auditLogs);
    return () => { this.auditSubscribers = this.auditSubscribers.filter(s => s !== callback); };
  }

  private notifyAlerts() { this.alertSubscribers.forEach(s => s([...this.alerts])); }
  private notifyReports() { this.reportSubscribers.forEach(s => s([...this.generatedReports])); }
  private notifyAudit() { this.auditSubscribers.forEach(s => s([...this.auditLogs])); }

  async getVendors(): Promise<Vendor[]> {
    return this.vendors;
  }

  async getVendorById(id: string): Promise<Vendor | undefined> {
    return this.vendors.find(v => v.id === id);
  }

  async getAlerts(): Promise<Alert[]> {
    return this.alerts;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogs;
  }

  async markAlertAsRead(id: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.isRead = true;
      this.notifyAlerts();
    }
  }

  async markAllAlertsAsRead(): Promise<void> {
    this.alerts.forEach(a => a.isRead = true);
    this.notifyAlerts();
  }

  async createReport(vendorId: string, type: ReportType): Promise<Report> {
    await new Promise(r => setTimeout(r, 1000));
    const vendor = this.vendors.find(v => v.id === vendorId);
    const newReport: Report = {
      id: `rep-${Math.random().toString(36).substr(2, 5)}`,
      vendorId,
      vendorName: vendor?.name || 'Unknown',
      type,
      date: new Date().toISOString().split('T')[0],
      riskScore: vendor?.overallScore || 0,
      status: 'COMPLETED',
      downloadUrl: '#'
    };
    this.generatedReports.unshift(newReport);
    this.notifyReports();
    return newReport;
  }

  async deleteReport(id: string): Promise<void> {
    this.generatedReports = this.generatedReports.filter(r => r.id !== id);
    this.notifyReports();
  }

  async createVendor(vendorData: Partial<Vendor>): Promise<Vendor> {
    const newVendor: Vendor = {
      id: (this.vendors.length + 1).toString(),
      name: vendorData.name || 'New Vendor',
      industry: vendorData.industry || 'Biotech',
      overallScore: 0,
      lastAnalysis: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      ...vendorData,
    };
    this.vendors.push(newVendor);
    return newVendor;
  }

  async runAssessment(id: string, name: string, description: string): Promise<MultiAgentRiskReport> {
    let report: MultiAgentRiskReport;
    const hasApiKey = !!process.env.API_KEY && process.env.API_KEY !== 'your_api_key_here';

    try {
      if (hasApiKey) {
        report = await analyzeVendorRisk(name, description);
      } else {
        report = await simulateAIAssessment(name, description);
      }
    } catch (err) {
      report = await simulateAIAssessment(name, description);
    }

    report.vendorId = id;
    this.reports[id] = report;
    
    // Update vendor
    const vIndex = this.vendors.findIndex(v => v.id === id);
    if (vIndex > -1) {
      this.vendors[vIndex].overallScore = report.overallRiskScore;
      this.vendors[vIndex].status = report.overallRiskScore > 7 ? 'REJECTED' : 'ACTIVE';
      this.vendors[vIndex].lastAnalysis = new Date().toISOString().split('T')[0];
    }

    // Blockchain: Add Immutable Audit Block
    const previousHash = this.auditLogs[0].hash;
    const blockData = `${name}-${report.overallRiskScore}-${previousHash}-${Date.now()}`;
    const currentHash = generateMockHash(blockData);

    this.auditLogs.unshift({
      id: `block-${this.auditLogs.length}`,
      hash: currentHash,
      previousHash: previousHash,
      timestamp: new Date().toISOString(),
      vendorId: id,
      vendorName: name,
      action: 'RISK_ASSESSMENT_AUTO',
      performer: 'ERCA_MASTER_CONTROLLER',
      details: `Full multi-agent analysis for ${name}. Overall Risk: ${report.overallRiskScore}. Confidence: ${report.confidenceScore}.`,
      status: 'SUCCESS',
      riskScore: report.overallRiskScore,
      agentSignatures: [
        report.complianceAgent.personaName || 'Inspector Comply',
        report.genomicAgent.personaName || 'Dr. Gene',
        report.financialAgent.personaName || 'Risk Oracle'
      ],
      snapshot: report,
      metadata: { report }
    });
    this.notifyAudit();

    // Alert if high risk
    if (report.overallRiskScore > 7) {
      this.alerts.unshift({
        id: `alert-${Math.random().toString(36).substr(2, 5)}`,
        vendorId: id,
        vendorName: name,
        type: 'HIGH_RISK',
        severity: 'CRITICAL',
        message: `High risk detected for ${name} during multi-agent sweep. Risk Index: ${report.overallRiskScore}. Analysis results shared with soujanyas580@gmail.com.`,
        timestamp: new Date().toISOString(),
        isRead: false
      });
      this.notifyAlerts();
    }

    return report;
  }

  async getReportByVendorId(id: string): Promise<MultiAgentRiskReport | undefined> {
    return this.reports[id];
  }
}

export const api = new MockApiService();
