import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

export interface DemoStepConfig {
  path: string;
  name: string;
  narrative: string;
}

export const FULL_DEMO_PATH: DemoStepConfig[] = [
  { path: '/', name: "Dashboard", narrative: "This is our command center. We monitor 42 healthcare vendors. Five are high-risk. Everything updates in real-time." },
  { path: '/quantum', name: "Quantum Lab", narrative: "Here we check if vendors are ready for quantum computers. Quantum computers could break today's encryption in 7 years. We help prepare now." },
  { path: '/wearables', name: "Wearable Hub", narrative: "This monitors lab staff with wearables. High stress means more mistakes. We alert managers before problems happen." },
  { path: '/pitch', name: "Pitch AI", narrative: "Need to explain risks to your board? This creates presentations automatically. Different versions for boards, regulators, or insurers." },
  { path: '/crisis-sim', name: "Crisis Sim", narrative: "Practice handling emergencies here. A data leak happens. Watch AI coordinate the response. Learn to make quick decisions." },
  { path: '/trials', name: "Clinical Trials", narrative: "Pharma companies live or die by clinical trials. We monitor trial progress. Predict success or failure early." },
  { path: '/risk-map', name: "Global Risk Map", narrative: "See risks on a world map. Red areas are high-risk. Southeast Asia shows growing risks. Europe is mostly stable." },
  { path: '/mitigation', name: "Mitigation Plans", narrative: "Found a risk? Here's the fix. AI creates step-by-step plans. Shows costs, timelines, and expected results." },
  { path: '/vendors', name: "Vendors", narrative: "All your healthcare partners in one list. Green is safe. Red needs attention. Click any to see details." },
  { path: '/assessments', name: "Assessments", narrative: "Checking a new vendor? Five AI specialists work together. Takes 15 seconds instead of weeks. Everyone agrees on the risk score." },
  { path: '/chat', name: "Regulatory Chat", narrative: "Ask questions about healthcare laws. HIPAA, GDPR, FDA rules. Get clear answers immediately." },
  { path: '/anonymizer', name: "Anonymizer", narrative: "Patient privacy is critical. This removes names and IDs from genetic data. Keeps the science, removes the risk." },
  { path: '/biolab', name: "Bio Lab", narrative: "Deep analysis of genetic data. Finds rare disease patterns. Checks if biomarkers are reliable." },
  { path: '/simulation', name: "Sim Lab", narrative: "Test 'what-if' scenarios. What if a drug fails? What if a supplier closes? See the impact before it happens." },
  { path: '/spatial', name: "Spatial Lab", narrative: "3D views of complex data. See DNA mutations. Visualize supply chains. Understand patterns better." },
  { path: '/reports', name: "Reports", narrative: "One-click reports for audits. Compliance documentation. Executive summaries. Everything formatted perfectly." },
  { path: '/audit', name: "Audit Logs", narrative: "Every decision is recorded forever. Cannot be changed. Complete transparency for regulators." },
  { path: '/', name: "Final", narrative: "This is BioRisk Guard. We make healthcare supply chains safer using AI. Built with IBM's best practices." },
];

interface HackathonContextType {
  isHackathonMode: boolean;
  toggleHackathonMode: () => void;
  isAutoDemoActive: boolean;
  demoStepIndex: number;
  setDemoStepIndex: (index: number) => void;
  runAutoDemo: () => void;
  stopAutoDemo: () => void;
  demoNarrative: string;
}

const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

export const HackathonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHackathonMode, setIsHackathonMode] = useState(false);
  const [isAutoDemoActive, setIsAutoDemoActive] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(-1);
  const [demoNarrative, setDemoNarrative] = useState('');

  const toggleHackathonMode = () => {
    setIsHackathonMode((prev) => !prev);
  };

  const runAutoDemo = () => {
    stopAutoDemo();
    setIsAutoDemoActive(true);
    setDemoStepIndex(0);
  };

  const stopAutoDemo = () => {
    setIsAutoDemoActive(false);
    setDemoStepIndex(-1);
    setDemoNarrative('');
    window.speechSynthesis.cancel();
  };

  return (
    <HackathonContext.Provider value={{ 
      isHackathonMode, 
      toggleHackathonMode, 
      isAutoDemoActive, 
      demoStepIndex,
      setDemoStepIndex,
      demoNarrative,
      runAutoDemo, 
      stopAutoDemo 
    }}>
      <div className={isHackathonMode ? 'hackathon-active' : ''}>
        {children}
      </div>
    </HackathonContext.Provider>
  );
};

export const useHackathon = () => {
  const context = useContext(HackathonContext);
  if (context === undefined) {
    throw new Error('useHackathon must be used within a HackathonProvider');
  }
  return context;
};
