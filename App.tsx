
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewAssessment from './pages/NewAssessment';
import VendorList from './pages/VendorList';
import AddVendor from './pages/AddVendor';
import VendorDetail from './pages/VendorDetail';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import GenomicDashboard from './pages/GenomicDashboard';
import SimulationLab from './pages/SimulationLab';
import SpatialLab from './pages/SpatialLab';
import ComplianceChat from './pages/ComplianceChat';
import AnonymizerLab from './pages/AnonymizerLab';
import GlobalRiskMap from './pages/GlobalRiskMap';
import MitigationPlanner from './pages/MitigationPlanner';
import ClinicalTrialHub from './pages/ClinicalTrialHub';
import CrisisSimulation from './pages/CrisisSimulation';
import PitchGenerator from './pages/PitchGenerator';
import WearableMonitor from './pages/WearableMonitor';
import QuantumLab from './pages/QuantumLab';
import Toast from './components/Toast';
import { HackathonProvider } from './context/HackathonContext';
import { api } from './services/api';
import { Alert } from './types';

const App: React.FC = () => {
  const [toast, setToast] = useState<{ alert: Alert } | null>(null);

  useEffect(() => {
    let seenIds = new Set<string>();
    
    api.getAlerts().then(initialAlerts => {
      initialAlerts.forEach(a => seenIds.add(a.id));
    });

    const unsubscribe = api.subscribeToAlerts((alerts) => {
      const newest = alerts[0];
      if (newest && !seenIds.has(newest.id) && !newest.isRead) {
        setToast({ alert: newest });
        seenIds.add(newest.id);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <HackathonProvider>
      <Router>
        <div className="flex min-h-screen bg-[#161616] text-[#F4F4F4] font-sans selection:bg-[#0062FF] selection:text-white">
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/quantum" element={<QuantumLab />} />
                <Route path="/wearables" element={<WearableMonitor />} />
                <Route path="/pitch" element={<PitchGenerator />} />
                <Route path="/crisis-sim" element={<CrisisSimulation />} />
                <Route path="/trials" element={<ClinicalTrialHub />} />
                <Route path="/risk-map" element={<GlobalRiskMap />} />
                <Route path="/mitigation" element={<MitigationPlanner />} />
                <Route path="/vendors" element={<VendorList />} />
                <Route path="/vendors/add" element={<AddVendor />} />
                <Route path="/vendors/:id" element={<VendorDetail />} />
                <Route path="/assessments" element={<NewAssessment />} />
                <Route path="/chat" element={<ComplianceChat />} />
                <Route path="/anonymizer" element={<AnonymizerLab />} />
                <Route path="/biolab" element={<GenomicDashboard />} />
                <Route path="/simulation" element={<SimulationLab />} />
                <Route path="/spatial" element={<SpatialLab />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/audit" element={<AuditLogs />} />
                <Route path="/settings" element={<div className="p-20 text-center uppercase tracking-[0.3em] text-[#393939] font-mono">Core Settings Encrypted</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            {toast && (
              <Toast 
                message={toast.alert.message} 
                vendorName={toast.alert.vendorName}
                onClose={() => setToast(null)}
                onClick={() => {
                  window.location.hash = '#/alerts';
                  setToast(null);
                }}
              />
            )}
            <footer className="h-10 border-t border-[#393939] px-8 flex items-center justify-between bg-[#161616]">
              <span className="text-[10px] text-[#525252] font-mono">ERCA SYSTEM LOGS: CLUSTER-US-EAST-ALPHA READY</span>
              <div className="flex gap-4">
                <span className="text-[10px] text-[#525252] uppercase tracking-wider">v2.4.0-PRO</span>
                <span className="text-[10px] text-[#525252] uppercase tracking-wider">© 2024 BioRisk Guard</span>
              </div>
            </footer>
          </div>
        </div>
      </Router>
    </HackathonProvider>
  );
};

export default App;
