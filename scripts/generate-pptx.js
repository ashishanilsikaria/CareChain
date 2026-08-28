import pptxgen from "pptxgenjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateDeck() {
  const pptx = new pptxgen();

  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Ashish Anil Sikaria";
  pptx.company = "SCOPE - Computer Science & Engineering";
  pptx.title = "CareChain - BCSE497J Project I Presentation";
  pptx.subject = "Decentralized Electronic Health Record Protocol";

  // Color Palette
  const THEME = {
    bgDark: "090E17",
    cardDark: "111927",
    cardBorder: "1E293B",
    primarySky: "0284C7",
    accentCyan: "38BDF8",
    emeraldGreen: "10B981",
    purpleAccent: "A855F7",
    amberOrange: "F59E0B",
    roseRed: "F43F5E",
    textWhite: "FFFFFF",
    textMuted: "94A3B8",
    textDim: "64748B",
  };

  // Helper to add base dark background and header/footer
  function applyBaseSlide(slide, categoryText = "CareChain • BCSE497J Project - I") {
    slide.background = { color: THEME.bgDark };

    // Header top line & category pill
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.6,
      y: 0.4,
      w: 12.13,
      h: 0.02,
      fill: { color: THEME.cardBorder },
    });

    slide.addText(categoryText.toUpperCase(), {
      x: 0.6,
      y: 0.48,
      w: 8.0,
      h: 0.3,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: THEME.accentCyan,
      charSpacing: 2,
    });

    // Footer
    slide.addText("Ashish Anil Sikaria (23BCI0218) • Guide: Prof. SELVI M • SCOPE", {
      x: 0.6,
      y: 7.05,
      w: 8.0,
      h: 0.3,
      fontSize: 9,
      fontFace: "Arial",
      color: THEME.textDim,
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide & Academic Profile
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: THEME.bgDark };

    // Glowing subtle banner
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 0.7,
      w: 11.73,
      h: 6.1,
      rectRadius: 0.2,
      fill: { color: THEME.cardDark },
      line: { color: THEME.cardBorder, width: 1.5 },
    });

    // Top Pill
    slide.addText("🎓 FALL SEMESTER 2026-27  •  BCSE497J - PROJECT - I  •  APPROVED BY GUIDE", {
      x: 1.2,
      y: 1.05,
      w: 10.9,
      h: 0.35,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: THEME.accentCyan,
      align: "center",
      charSpacing: 1.5,
    });

    // Title
    slide.addText("CareChain", {
      x: 1.2,
      y: 1.5,
      w: 10.9,
      h: 1.0,
      fontSize: 46,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
      align: "center",
    });

    // Subtitle
    slide.addText("Decentralized, Patient-Centric Electronic Health Record (EHR) Protocol", {
      x: 1.2,
      y: 2.45,
      w: 10.9,
      h: 0.45,
      fontSize: 18,
      fontFace: "Arial",
      bold: true,
      color: THEME.primarySky,
      align: "center",
    });

    slide.addText(
      "Empowering patient data sovereignty through Ethereum Smart Contracts, AES-256 Client-Side Encryption, and Decentralized IPFS Storage.",
      {
        x: 1.8,
        y: 2.95,
        w: 9.7,
        h: 0.6,
        fontSize: 12,
        fontFace: "Arial",
        color: THEME.textMuted,
        align: "center",
      }
    );

    // Student Box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.6,
      y: 3.85,
      w: 4.8,
      h: 2.35,
      rectRadius: 0.15,
      fill: { color: "0B132B" },
      line: { color: THEME.primarySky, width: 1.5 },
    });

    slide.addText("CANDIDATE DETAILS", {
      x: 1.8,
      y: 4.05,
      w: 4.4,
      h: 0.25,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: THEME.accentCyan,
      charSpacing: 1,
    });

    slide.addText("Ashish Anil Sikaria", {
      x: 1.8,
      y: 4.35,
      w: 4.4,
      h: 0.4,
      fontSize: 18,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    slide.addText(
      "Register No: 23BCI0218\nProgramme: B.Tech Computer Science & Engineering\nSchool: SCOPE",
      {
        x: 1.8,
        y: 4.8,
        w: 4.4,
        h: 1.1,
        fontSize: 11,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 18,
      }
    );

    // Faculty Guide Box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.9,
      y: 3.85,
      w: 4.8,
      h: 2.35,
      rectRadius: 0.15,
      fill: { color: "0B132B" },
      line: { color: THEME.purpleAccent, width: 1.5 },
    });

    slide.addText("FACULTY GUIDE", {
      x: 7.1,
      y: 4.05,
      w: 4.4,
      h: 0.25,
      fontSize: 10,
      fontFace: "Arial",
      bold: true,
      color: THEME.purpleAccent,
      charSpacing: 1,
    });

    slide.addText("Prof. SELVI M", {
      x: 7.1,
      y: 4.35,
      w: 4.4,
      h: 0.4,
      fontSize: 18,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    slide.addText(
      "Designation: Associate Professor Grade 2\nEmployee ID: 16106\nSchool: SCOPE (School of Computer Science & Engineering)",
      {
        x: 7.1,
        y: 4.8,
        w: 4.4,
        h: 1.1,
        fontSize: 11,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 18,
      }
    );
  }

  // ==========================================
  // SLIDE 2: Academic & Institutional Profile
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Academic Framework • BCSE497J Project Profile");

    slide.addText("Institutional Governance & Registration", {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.6,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    const metadataItems = [
      { label: "PROJECT TITLE", val: "CareChain", color: THEME.primarySky },
      { label: "COURSE CODE & NAME", val: "BCSE497J - Project - I", color: THEME.textWhite },
      { label: "ACADEMIC SEMESTER", val: "Fall Semester 2026-27", color: THEME.textWhite },
      { label: "DURATION & OPTION", val: "Regular • 6 ( Months )", color: THEME.accentCyan },
      { label: "PROJECT OPTION", val: "General", color: THEME.textWhite },
      { label: "REGISTRATION STATUS", val: "Registered & Approved by Guide", color: THEME.emeraldGreen },
      { label: "STUDENT NAME", val: "Ashish Anil Sikaria", color: THEME.textWhite },
      { label: "REGISTER NUMBER", val: "23BCI0218", color: THEME.primarySky },
      { label: "GUIDE NAME", val: "Prof. SELVI M (Emp ID: 16106)", color: THEME.purpleAccent },
    ];

    metadataItems.forEach((item, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = 0.6 + col * 4.1;
      const y = 1.65 + row * 1.55;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 3.9,
        h: 1.35,
        rectRadius: 0.12,
        fill: { color: THEME.cardDark },
        line: { color: THEME.cardBorder, width: 1 },
      });

      slide.addText(item.label, {
        x: x + 0.2,
        y: y + 0.18,
        w: 3.5,
        h: 0.25,
        fontSize: 9,
        fontFace: "Arial",
        bold: true,
        color: THEME.textDim,
        charSpacing: 1,
      });

      slide.addText(item.val, {
        x: x + 0.2,
        y: y + 0.48,
        w: 3.5,
        h: 0.6,
        fontSize: 14,
        fontFace: "Arial",
        bold: true,
        color: item.color,
      });
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: 6.35,
      w: 12.13,
      h: 0.55,
      rectRadius: 0.1,
      fill: { color: "064E3B" },
      line: { color: THEME.emeraldGreen, width: 1 },
    });

    slide.addText("STATUS VERIFICATION: Approved and registered under faculty supervision in SCOPE.", {
      x: 0.8,
      y: 6.45,
      w: 11.7,
      h: 0.35,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: "A7F3D0",
      align: "center",
    });
  }

  // ==========================================
  // SLIDE 3: Problem Statement
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Healthcare Industry Problem Statement");

    slide.addText("The Crisis in Centralized Electronic Health Records", {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.6,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    const problems = [
      {
        num: "01",
        title: "Centralized Honeypots & Breaches",
        desc: "Over 133M+ medical records exposed in recent years. Centralized hospital servers remain primary targets for ransomware and data theft.",
        accent: THEME.roseRed,
      },
      {
        num: "02",
        title: "Zero Patient Sovereignty",
        desc: "Patients lack transparency on who decrypts, sells, or monetizes their diagnostic records among commercial health brokers.",
        accent: THEME.amberOrange,
      },
      {
        num: "03",
        title: "Fragmented Data Silos",
        desc: "Incompatible EMR software causes delayed treatments, duplicate blood tests, and dangerous blind spots during emergency trauma care.",
        accent: THEME.primarySky,
      },
      {
        num: "04",
        title: "Lack of Tamper-Evident Audits",
        desc: "Traditional databases lack cryptographic immutability, enabling retroactive record falsification and untraceable access logs.",
        accent: THEME.purpleAccent,
      },
    ];

    problems.forEach((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 6.15;
      const y = 1.65 + row * 2.45;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.95,
        h: 2.25,
        rectRadius: 0.15,
        fill: { color: THEME.cardDark },
        line: { color: THEME.cardBorder, width: 1.2 },
      });

      slide.addText(p.num, {
        x: x + 0.3,
        y: y + 0.25,
        w: 1.0,
        h: 0.4,
        fontSize: 20,
        fontFace: "Arial",
        bold: true,
        color: p.accent,
      });

      slide.addText(p.title, {
        x: x + 1.2,
        y: y + 0.25,
        w: 4.4,
        h: 0.4,
        fontSize: 15,
        fontFace: "Arial",
        bold: true,
        color: THEME.textWhite,
      });

      slide.addText(p.desc, {
        x: x + 0.3,
        y: y + 0.75,
        w: 5.35,
        h: 1.3,
        fontSize: 11.5,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 18,
      });
    });
  }

  // ==========================================
  // SLIDE 4: The CareChain Solution
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Zero-Trust Architecture & Technical Solution");

    slide.addText("The CareChain Solution: Hybrid Web2/Web3 Zero-Trust Protocol", {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.6,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    const pillars = [
      {
        icon: "🔐",
        title: "Client-Side AES-256-GCM",
        desc: "All health files and diagnostic reports are encrypted with unique 256-bit symmetric keys, 12-byte IVs, and 16-byte auth tags before leaving the browser.",
        tag: "Confidentiality",
        color: THEME.primarySky,
      },
      {
        icon: "🌐",
        title: "Decentralized IPFS Storage",
        desc: "Encrypted ciphertexts are pinned across decentralized IPFS nodes, generating immutable Content Identifiers (CIDs). Zero PHI stored on-chain.",
        tag: "Immutability",
        color: THEME.accentCyan,
      },
      {
        icon: "📜",
        title: "Smart Contract RBAC",
        desc: "Solidity smart contracts enforce isolated patient access matrices (doctorPermissions[p][d]) and emit indexed events for audit trails.",
        tag: "Sovereignty",
        color: THEME.emeraldGreen,
      },
    ];

    pillars.forEach((p, idx) => {
      const x = 0.6 + idx * 4.1;
      const y = 1.65;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 3.9,
        h: 4.3,
        rectRadius: 0.15,
        fill: { color: THEME.cardDark },
        line: { color: THEME.cardBorder, width: 1.2 },
      });

      slide.addText(p.icon, {
        x: x + 0.3,
        y: y + 0.3,
        w: 1.0,
        h: 0.5,
        fontSize: 28,
      });

      slide.addText(p.tag.toUpperCase(), {
        x: x + 1.5,
        y: y + 0.35,
        w: 2.1,
        h: 0.3,
        fontSize: 10,
        fontFace: "Arial",
        bold: true,
        color: p.color,
        align: "right",
        charSpacing: 1,
      });

      slide.addText(p.title, {
        x: x + 0.3,
        y: y + 0.95,
        w: 3.3,
        h: 0.6,
        fontSize: 16,
        fontFace: "Arial",
        bold: true,
        color: THEME.textWhite,
      });

      slide.addText(p.desc, {
        x: x + 0.3,
        y: y + 1.65,
        w: 3.3,
        h: 2.3,
        fontSize: 12,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 19,
      });
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: 6.15,
      w: 12.13,
      h: 0.75,
      rectRadius: 0.1,
      fill: { color: "082F49" },
      line: { color: THEME.primarySky, width: 1 },
    });

    slide.addText(
      "REGULATORY ALIGNMENT: Full compliance with HIPAA Security Rule (§164.312) & GDPR Article 17 Crypto-Shredding.",
      {
        x: 0.8,
        y: 6.35,
        w: 11.7,
        h: 0.35,
        fontSize: 11.5,
        fontFace: "Arial",
        bold: true,
        color: "BAE6FD",
        align: "center",
      }
    );
  }

  // ==========================================
  // SLIDE 5: UN Sustainable Development Goals (SDGs)
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "United Nations 2030 Agenda Alignment");

    slide.addText("Alignment with UN Sustainable Development Goals (SDGs)", {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.6,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    const sdgs = [
      {
        badge: "SDG 3",
        target: "TARGET 3.8",
        title: "Good Health and Well-Being",
        desc: "Provides portable, tamper-proof medical records across providers and emergency care, eliminating diagnostic latency and duplicate procedures.",
        bg: "064E3B",
        border: THEME.emeraldGreen,
        textCol: "A7F3D0",
      },
      {
        badge: "SDG 9",
        target: "TARGET 9.5",
        title: "Industry, Innovation & Infrastructure",
        desc: "Modernizes vulnerable legacy health databases with resilient decentralized infrastructure combining cryptographic ledger security with IPFS.",
        bg: "7C2D12",
        border: THEME.amberOrange,
        textCol: "FDE68A",
      },
      {
        badge: "SDG 10",
        target: "TARGET 10.2",
        title: "Reduced Inequalities",
        desc: "Democratizes sovereign patient health data ownership regardless of socioeconomic status, preventing corporate data lock-in.",
        bg: "831843",
        border: THEME.roseRed,
        textCol: "FBCFE8",
      },
      {
        badge: "SDG 16",
        target: "TARGET 16.6",
        title: "Peace, Justice & Strong Institutions",
        desc: "Establishes immutable on-chain audit trails for doctor licensing and diagnostic issuance, mitigating healthcare malpractice fraud.",
        bg: "1E1B4B",
        border: THEME.purpleAccent,
        textCol: "DDD6FE",
      },
    ];

    sdgs.forEach((s, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 6.15;
      const y = 1.65 + row * 2.45;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.95,
        h: 2.25,
        rectRadius: 0.15,
        fill: { color: s.bg },
        line: { color: s.border, width: 1.5 },
      });

      slide.addText(`${s.badge} • ${s.target}`, {
        x: x + 0.3,
        y: y + 0.2,
        w: 5.35,
        h: 0.25,
        fontSize: 10,
        fontFace: "Arial",
        bold: true,
        color: s.textCol,
        charSpacing: 1,
      });

      slide.addText(s.title, {
        x: x + 0.3,
        y: y + 0.48,
        w: 5.35,
        h: 0.38,
        fontSize: 16,
        fontFace: "Arial",
        bold: true,
        color: THEME.textWhite,
      });

      slide.addText(s.desc, {
        x: x + 0.3,
        y: y + 0.92,
        w: 5.35,
        h: 1.15,
        fontSize: 11.5,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 18,
      });
    });
  }

  // ==========================================
  // SLIDE 6: Technology Readiness Level (TRL)
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Maturity Scorecard • NASA / Horizon Europe Framework");

    slide.addText("Technology Readiness Level (TRL) Assessment", {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.6,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    // Progression Bar
    const stages = [
      { label: "TRL 1 - 3", sub: "Basic Principles & Concept Formulation", active: false },
      { label: "TRL 4 - 5", sub: "Lab Validation & Component Testing", active: false },
      { label: "★ TRL 6 ★", sub: "Working Prototype Demonstrated in Relevant Environment", active: true },
      { label: "TRL 7 - 9", sub: "Clinical Trials & Commercial Mainnet Deployment", active: false },
    ];

    stages.forEach((st, idx) => {
      const x = 0.6 + idx * 3.08;
      const y = 1.65;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 2.95,
        h: 1.1,
        rectRadius: 0.12,
        fill: { color: st.active ? "4C1D95" : THEME.cardDark },
        line: { color: st.active ? THEME.purpleAccent : THEME.cardBorder, width: st.active ? 2 : 1 },
      });

      slide.addText(st.label, {
        x: x + 0.15,
        y: y + 0.15,
        w: 2.65,
        h: 0.3,
        fontSize: 13,
        fontFace: "Arial",
        bold: true,
        color: st.active ? THEME.textWhite : THEME.textDim,
        align: "center",
      });

      slide.addText(st.sub, {
        x: x + 0.15,
        y: y + 0.45,
        w: 2.65,
        h: 0.55,
        fontSize: 9,
        fontFace: "Arial",
        color: st.active ? "DDD6FE" : THEME.textDim,
        align: "center",
      });
    });

    // Deliverables Split
    // Left: TRL 6 Verified
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: 2.95,
      w: 5.95,
      h: 3.9,
      rectRadius: 0.15,
      fill: { color: THEME.cardDark },
      line: { color: THEME.emeraldGreen, width: 1.5 },
    });

    slide.addText("✓ TRL 6 VERIFIED DELIVERABLES", {
      x: 0.9,
      y: 3.15,
      w: 5.35,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      bold: true,
      color: THEME.emeraldGreen,
      charSpacing: 1,
    });

    slide.addText(
      "• Smart Contracts: MedicalRecord.sol deployed with 100% automated test coverage (11/11 Hardhat unit tests green).\n\n• Cryptographic Pipeline: Client-side AES-256-GCM symmetric buffer encryption and IPFS pinning via Pinata live.\n\n• Role-Based Portals: Web3 frontend with dedicated portals for Patients, Licensed Doctors, and Hospital Governance.\n\n• Enterprise Architecture: Monorepo with CI/CD automation, Docker orchestration, and RBAC middleware.",
      {
        x: 0.9,
        y: 3.55,
        w: 5.35,
        h: 3.1,
        fontSize: 11,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 18,
      }
    );

    // Right: Roadmap to TRL 9
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.78,
      y: 2.95,
      w: 5.95,
      h: 3.9,
      rectRadius: 0.15,
      fill: { color: THEME.cardDark },
      line: { color: THEME.primarySky, width: 1.5 },
    });

    slide.addText("➔ ROADMAP TO TRL 9 (COMMERCIAL DEPLOYMENT)", {
      x: 7.08,
      y: 3.15,
      w: 5.35,
      h: 0.3,
      fontSize: 12,
      fontFace: "Arial",
      bold: true,
      color: THEME.accentCyan,
      charSpacing: 1,
    });

    slide.addText(
      "• TRL 7 (Operational Sandbox): Multi-hospital sandbox testing with HL7 FHIR structured schemas and ERC-4337 Passkey relayers.\n\n• TRL 8 (System Qualification): Formal smart contract verification by CertiK/OpenZeppelin and HIPAA/GDPR certification.\n\n• TRL 9 (Full Clinical Deployment): Production mainnet rollout across participating hospital consortiums and insurance validation nodes.",
      {
        x: 7.08,
        y: 3.55,
        w: 5.35,
        h: 3.1,
        fontSize: 11,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 18,
      }
    );
  }

  // ==========================================
  // SLIDE 7: Cutting-Edge Innovations
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Competitive Differentiators & Hard Tech");

    slide.addText("Next-Generation Protocol Innovations", {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.6,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    const innovations = [
      {
        icon: "🚨",
        title: "'Break-Glass' Emergency Override",
        desc: "Solves the unconscious ER patient dilemma: Verified physicians trigger time-delayed cryptographic challenges or multi-guardian signatures with on-chain audit penalties.",
      },
      {
        icon: "🛡️",
        title: "Zero-Knowledge (ZK) Health Claims",
        desc: "zk-SNARK circuits allow patients to prove clinical trial or insurance eligibility (e.g., HbA1c < 6.5%, age > 18) without disclosing raw medical files or identity.",
      },
      {
        icon: "🔑",
        title: "Gasless Account Abstraction (ERC-4337)",
        desc: "Replaces seed phrases and gas tokens with WebAuthn Passkeys (TouchID / FaceID), sponsored by hospital Paymaster relayers.",
      },
      {
        icon: "🎖️",
        title: "Soulbound Tokens (SBTs - ERC-5192)",
        desc: "Non-transferable medical credentials minted by state medical boards. If a license is suspended, on-chain decryption permissions are instantly revoked.",
      },
    ];

    innovations.forEach((inv, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 6.15;
      const y = 1.65 + row * 2.45;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.95,
        h: 2.25,
        rectRadius: 0.15,
        fill: { color: THEME.cardDark },
        line: { color: THEME.cardBorder, width: 1.2 },
      });

      slide.addText(inv.icon, {
        x: x + 0.3,
        y: y + 0.25,
        w: 0.8,
        h: 0.4,
        fontSize: 22,
      });

      slide.addText(inv.title, {
        x: x + 1.0,
        y: y + 0.25,
        w: 4.6,
        h: 0.4,
        fontSize: 15,
        fontFace: "Arial",
        bold: true,
        color: THEME.textWhite,
      });

      slide.addText(inv.desc, {
        x: x + 0.3,
        y: y + 0.75,
        w: 5.35,
        h: 1.3,
        fontSize: 11.5,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 18,
      });
    });
  }

  // ==========================================
  // SLIDE 8: Healthcare Ecosystem Impact
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Stakeholder Value Proposition");

    slide.addText("Multi-Sided Healthcare Economic Impact", {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.6,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    const stakeholders = [
      {
        icon: "🧑‍💼",
        title: "Patients",
        desc: "Complete data sovereignty, zero corporate exploitation, seamless portability across facilities.",
        border: THEME.primarySky,
      },
      {
        icon: "👨‍⚕️",
        title: "Clinicians",
        desc: "Instant verified medical histories, zero diagnostic redundancy, reduced malpractice liability.",
        border: THEME.emeraldGreen,
      },
      {
        icon: "🔬",
        title: "Researchers",
        desc: "Opt-in Compute-to-Data research pools with automated cryptographic patient micro-rewards.",
        border: THEME.purpleAccent,
      },
      {
        icon: "🏛️",
        title: "Insurers",
        desc: "Tamper-proof smart contract claims verification, eliminating fraudulent billing and overhead.",
        border: THEME.amberOrange,
      },
    ];

    stakeholders.forEach((st, idx) => {
      const x = 0.6 + idx * 3.08;
      const y = 1.65;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 2.95,
        h: 4.8,
        rectRadius: 0.15,
        fill: { color: THEME.cardDark },
        line: { color: st.border, width: 1.5 },
      });

      slide.addText(st.icon, {
        x: x + 0.2,
        y: y + 0.4,
        w: 2.55,
        h: 0.6,
        fontSize: 32,
        align: "center",
      });

      slide.addText(st.title, {
        x: x + 0.2,
        y: y + 1.2,
        w: 2.55,
        h: 0.4,
        fontSize: 17,
        fontFace: "Arial",
        bold: true,
        color: THEME.textWhite,
        align: "center",
      });

      slide.addText(st.desc, {
        x: x + 0.2,
        y: y + 1.8,
        w: 2.55,
        h: 2.6,
        fontSize: 12,
        fontFace: "Arial",
        color: THEME.textMuted,
        align: "center",
        lineSpacing: 19,
      });
    });
  }

  // ==========================================
  // SLIDE 9: Project Demonstration & Links
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Demonstration & Deliverables");

    slide.addText("Prototype Demonstration & Live Modules", {
      x: 0.6,
      y: 0.85,
      w: 12.0,
      h: 0.6,
      fontSize: 26,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
    });

    const modules = [
      {
        title: "Patient Health Vault",
        desc: "AES-256 client file encryption, IPFS pinning, and doctor access control toggle.",
      },
      {
        title: "Practitioner Portal",
        desc: "Authorized patient EHR lookup, verified clinical diagnostic reports, and digital prescriptions.",
      },
      {
        title: "Hospital Governance",
        desc: "Practitioner license verification, smart contract telemetry, and HIPAA audit trail exports.",
      },
      {
        title: "Web3 Wallet Layer",
        desc: "Direct MetaMask provider integration alongside off-chain fallback simulation modes.",
      },
    ];

    modules.forEach((m, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 6.15;
      const y = 1.65 + row * 2.45;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.95,
        h: 2.25,
        rectRadius: 0.15,
        fill: { color: THEME.cardDark },
        line: { color: THEME.cardBorder, width: 1.2 },
      });

      slide.addText(m.title, {
        x: x + 0.3,
        y: y + 0.25,
        w: 5.35,
        h: 0.4,
        fontSize: 16,
        fontFace: "Arial",
        bold: true,
        color: THEME.accentCyan,
      });

      slide.addText(m.desc, {
        x: x + 0.3,
        y: y + 0.75,
        w: 5.35,
        h: 1.3,
        fontSize: 12,
        fontFace: "Arial",
        color: THEME.textMuted,
        lineSpacing: 19,
      });
    });
  }

  // ==========================================
  // SLIDE 10: Conclusion & Project Governance
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: THEME.bgDark };

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 0.7,
      w: 11.73,
      h: 6.1,
      rectRadius: 0.2,
      fill: { color: THEME.cardDark },
      line: { color: THEME.primarySky, width: 1.5 },
    });

    slide.addText("CONCLUSION & ACADEMIC DEFENSE", {
      x: 1.2,
      y: 1.0,
      w: 10.9,
      h: 0.35,
      fontSize: 11,
      fontFace: "Arial",
      bold: true,
      color: THEME.accentCyan,
      align: "center",
      charSpacing: 1.5,
    });

    slide.addText("CareChain: Redefining Sovereign Healthcare", {
      x: 1.2,
      y: 1.45,
      w: 10.9,
      h: 0.8,
      fontSize: 36,
      fontFace: "Arial",
      bold: true,
      color: THEME.textWhite,
      align: "center",
    });

    slide.addText(
      "CareChain provides a verified, production-grade protocol for patient-governed electronic health records. Validated with automated test suites, zero-trust cryptographic security, and clear UN SDG & TRL progression roadmaps.",
      {
        x: 1.8,
        y: 2.35,
        w: 9.7,
        h: 0.8,
        fontSize: 13,
        fontFace: "Arial",
        color: THEME.textMuted,
        align: "center",
        lineSpacing: 20,
      }
    );

    // Summary Box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 2.0,
      y: 3.35,
      w: 9.33,
      h: 2.9,
      rectRadius: 0.15,
      fill: { color: "0B132B" },
      line: { color: THEME.cardBorder, width: 1.2 },
    });

    const summaryTable = [
      [
        { text: "Candidate:", options: { bold: true, color: THEME.textMuted, fontSize: 11 } },
        { text: "Ashish Anil Sikaria (23BCI0218)", options: { bold: true, color: THEME.textWhite, fontSize: 11 } },
        { text: "Course:", options: { bold: true, color: THEME.textMuted, fontSize: 11 } },
        { text: "BCSE497J - Project - I (Fall 2026-27)", options: { bold: true, color: THEME.textWhite, fontSize: 11 } },
      ],
      [
        { text: "Faculty Guide:", options: { bold: true, color: THEME.textMuted, fontSize: 11 } },
        { text: "Prof. SELVI M (Emp ID: 16106)", options: { bold: true, color: THEME.purpleAccent, fontSize: 11 } },
        { text: "School:", options: { bold: true, color: THEME.textMuted, fontSize: 11 } },
        { text: "SCOPE (School of Computer Science & Eng.)", options: { bold: true, color: THEME.textWhite, fontSize: 11 } },
      ],
      [
        { text: "TRL Level:", options: { bold: true, color: THEME.textMuted, fontSize: 11 } },
        { text: "TRL 6 (Demonstrated Prototype)", options: { bold: true, color: THEME.emeraldGreen, fontSize: 11 } },
        { text: "SDG Targets:", options: { bold: true, color: THEME.textMuted, fontSize: 11 } },
        { text: "UN SDGs 3.8, 9.5, 10.2, 16.6", options: { bold: true, color: THEME.accentCyan, fontSize: 11 } },
      ],
    ];

    slide.addTable(summaryTable, {
      x: 2.3,
      y: 3.65,
      w: 8.73,
      h: 2.3,
      colW: [1.8, 2.8, 1.6, 2.53],
      rowH: [0.7, 0.7, 0.7],
      valign: "middle",
    });
  }

  // Ensure output directory exists
  const outDir = path.join(__dirname, "../docs/presentation");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outputPath = path.join(outDir, "CareChain_Presentation.pptx");
  await pptx.writeFile({ fileName: outputPath });
  console.log(`✅ PowerPoint presentation successfully generated at: ${outputPath}`);
}

generateDeck().catch(console.error);
