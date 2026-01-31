# BioRisk Guard

Enterprise Risk & Compliance Autopilot (ERCA) for healthcare and biotech.

## Core Architecture
- **Multi-Agent Orchestration**: Specialized agents for Compliance, Genomic Risk (GenoSym-AI), and Financial Stability.
- **Enterprise UI**: IBM Carbon-inspired design system.
- **AI Core**: Powered by Google Gemini 3 Pro.

## Setup Instructions

1.  **Environment Setup**:
    - Rename `.env.local.example` (or create a new `.env.local`) and add your `API_KEY`.
    - Note: The application expects `process.env.API_KEY` to interact with the Google GenAI SDK.

2.  **Installation**:
    ```bash
    npm install
    ```

3.  **Development**:
    ```bash
    npm run dev
    ```

## Risk Scoring Protocol
The system uses a 1-10 risk scale:
- **1-3 (Low)**: Nominal risk, proceed with standard monitoring.
- **4-6 (Medium)**: Review required, potential compliance gaps detected.
- **7-10 (Critical)**: Immediate intervention required; potential data bias or financial instability.

---
*Built with React, Tailwind CSS, and Google Gemini API.*
