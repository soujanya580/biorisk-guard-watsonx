import { COLORS, MOCK_VENDORS } from '../constants';

export const CONFIG = {
  ai: {
    model: 'gemini-3-pro-preview',
    temperature: 0.1,
    systemInstruction: 'You are an elite Enterprise Risk & Compliance Autopilot (ERCA) system specialized in healthcare and genomics. Provide rigorous, fact-based risk assessments.',
  },
  theme: {
    colors: {
      primary: COLORS.IBM_BLUE,
      secondary: COLORS.HEALTHCARE_GREEN,
      error: COLORS.DANGER,
      warning: COLORS.WARNING,
      bg: '#161616',
      surface: '#262626',
      border: '#393939',
    },
    fonts: {
      sans: 'IBM Plex Sans, sans-serif',
      mono: 'IBM Plex Mono, monospace',
    }
  },
  demo: {
    vendors: MOCK_VENDORS,
    stats: {
      totalVendors: 42,
      criticalRisks: 3,
      avgScore: 4.8,
      complianceRate: '94%',
    }
  }
};
