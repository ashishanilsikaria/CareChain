import pptxgen from "pptxgenjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateDeck() {
  const pptx = new pptxgen();

  // Explicitly define 16:9 HD Widescreen dimensions (13.333 x 7.5 inches)
  pptx.defineLayout({ name: "LAYOUT_16x9_HD", width: 13.333, height: 7.5 });
  pptx.layout = "LAYOUT_16x9_HD";

  pptx.author = "Ashish Anil Sikaria";
  pptx.company = "SCOPE - School of Computer Science & Engineering";
  pptx.title = "CareChain - BCSE497J Project I Presentation";
  pptx.subject = "Decentralized Electronic Health Record Protocol";

  // Modern Light Aesthetic Color Palette (WCAG Compliant & Clean)
  const THEME = {
    bgPage: "F8FAFC",        // Light slate tint background
    cardBg: "FFFFFF",        // Pure white card surfaces
    cardBorder: "E2E8F0",    // Subtle clean border
    primaryBlue: "0284C7",   // Sky 600
    primaryDark: "0369A1",   // Sky 700
    brandNavy: "0F172A",     // Deep Slate 900 for headings
    textBody: "334155",      // Slate 700 for body
    textMuted: "64748B",     // Slate 500 for captions
    emeraldGreen: "059669",  // Emerald 600
    emeraldBg: "ECFDF5",     // Emerald 50
    purpleAccent: "6366F1",  // Indigo 500
    purpleBg: "EEF2FF",      // Indigo 50
    amberOrange: "D97706",   // Amber 600
    amberBg: "FFFBEB",       // Amber 50
    roseRed: "E11D48",       // Rose 600
    roseBg: "FFF1F2",        // Rose 50
    skyBg: "F0F9FF",         // Sky 50
    white: "FFFFFF",
  };

  // Helper for applying consistent light-theme header and footer within 13.333 x 7.5 bounds
  function applyBaseSlide(slide, categoryText = "CareChain • BCSE497J Project - I") {
    slide.background = { color: THEME.bgPage };

    // Header top accent line
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.66,
      y: 0.35,
      w: 12.0,
      h: 0.03,
      fill: { color: THEME.primaryBlue },
    });

    // Category Pill / Tag
    slide.addText(categoryText.toUpperCase(), {
      x: 0.66,
      y: 0.42,
      w: 8.0,
      h: 0.28,
      fontSize: 9.5,
      fontFace: "Calibri",
      bold: true,
      color: THEME.primaryDark,
      charSpacing: 1.5,
    });

    // Sub-header divider line
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.66,
      y: 0.72,
      w: 12.0,
      h: 0.01,
      fill: { color: THEME.cardBorder },
    });

    // Footer bottom bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.66,
      y: 6.85,
      w: 12.0,
      h: 0.01,
      fill: { color: THEME.cardBorder },
    });

    slide.addText("Ashish Anil Sikaria (23BCI0218) • Faculty Guide: Prof. SELVI M • SCOPE", {
      x: 0.66,
      y: 6.92,
      w: 7.5,
      h: 0.3,
      fontSize: 9,
      fontFace: "Calibri",
      color: THEME.textMuted,
    });

    slide.addText("Fall Semester 2026-27", {
      x: 8.5,
      y: 6.92,
      w: 4.16,
      h: 0.3,
      fontSize: 9,
      fontFace: "Calibri",
      align: "right",
      color: THEME.textMuted,
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide & Academic Profile
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: THEME.bgPage };

    // Outer Main Card perfectly centered on 13.333 x 7.5
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.66,
      y: 0.5,
      w: 12.0,
      h: 6.4,
      rectRadius: 0.12,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1.5 },
    });

    // Top Pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 3.66,
      y: 0.75,
      w: 6.0,
      h: 0.35,
      rectRadius: 0.08,
      fill: { color: THEME.skyBg },
      line: { color: THEME.primaryBlue, width: 1 },
    });

    slide.addText("FALL SEMESTER 2026-27  •  BCSE497J - PROJECT - I", {
      x: 3.66,
      y: 0.78,
      w: 6.0,
      h: 0.28,
      fontSize: 10,
      fontFace: "Calibri",
      bold: true,
      color: THEME.primaryDark,
      align: "center",
      charSpacing: 1.2,
    });

    // Main Title
    slide.addText("CareChain", {
      x: 1.0,
      y: 1.2,
      w: 11.33,
      h: 0.85,
      fontSize: 40,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
      align: "center",
    });

    // Subtitle
    slide.addText("Decentralized, Patient-Centric Electronic Health Record (EHR) Protocol", {
      x: 1.0,
      y: 2.05,
      w: 11.33,
      h: 0.38,
      fontSize: 16,
      fontFace: "Calibri",
      bold: true,
      color: THEME.primaryDark,
      align: "center",
    });

    slide.addText(
      "Empowering patient data ownership through Ethereum Smart Contracts, AES-256 Client-Side Encryption, and Decentralized IPFS Storage.",
      {
        x: 1.5,
        y: 2.45,
        w: 10.33,
        h: 0.45,
        fontSize: 11.5,
        fontFace: "Calibri",
        color: THEME.textMuted,
        align: "center",
      }
    );

    // Student Card (Left)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.4,
      y: 3.1,
      w: 5.0,
      h: 2.9,
      rectRadius: 0.1,
      fill: { color: THEME.skyBg },
      line: { color: "BAE6FD", width: 1.2 },
    });

    slide.addText("SUBMITTED BY", {
      x: 1.65,
      y: 3.3,
      w: 4.5,
      h: 0.22,
      fontSize: 9,
      fontFace: "Calibri",
      bold: true,
      color: THEME.primaryDark,
      charSpacing: 1,
    });

    slide.addText("Ashish Anil Sikaria", {
      x: 1.65,
      y: 3.55,
      w: 4.5,
      h: 0.38,
      fontSize: 18,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    slide.addText(
      "Register No: 23BCI0218\nProgramme: B.Tech Computer Science & Engineering\nSchool: SCOPE (School of Computer Science & Engineering)",
      {
        x: 1.65,
        y: 4.0,
        w: 4.5,
        h: 1.7,
        fontSize: 11,
        fontFace: "Calibri",
        color: THEME.textBody,
      }
    );

    // Faculty Guide Card (Right)
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.93,
      y: 3.1,
      w: 5.0,
      h: 2.9,
      rectRadius: 0.1,
      fill: { color: THEME.purpleBg },
      line: { color: "C7D2FE", width: 1.2 },
    });

    slide.addText("UNDER THE GUIDANCE OF", {
      x: 7.18,
      y: 3.3,
      w: 4.5,
      h: 0.22,
      fontSize: 9,
      fontFace: "Calibri",
      bold: true,
      color: THEME.purpleAccent,
      charSpacing: 1,
    });

    slide.addText("Prof. SELVI M", {
      x: 7.18,
      y: 3.55,
      w: 4.5,
      h: 0.38,
      fontSize: 18,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    slide.addText(
      "Designation: Associate Professor Grade 2\nEmployee ID: 16106\nSchool: SCOPE (School of Computer Science & Engineering)\nStatus: Registered & Approved by Guide",
      {
        x: 7.18,
        y: 4.0,
        w: 4.5,
        h: 1.7,
        fontSize: 11,
        fontFace: "Calibri",
        color: THEME.textBody,
      }
    );
  }

  // ==========================================
  // SLIDE 2: Academic & Institutional Profile
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Academic Framework • BCSE497J Project Profile");

    slide.addText("Academic Registration & Governance", {
      x: 0.66,
      y: 0.8,
      w: 12.0,
      h: 0.45,
      fontSize: 22,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    const metadataItems = [
      { label: "PROJECT TITLE", val: "CareChain", color: THEME.primaryDark, bg: THEME.skyBg },
      { label: "COURSE CODE & NAME", val: "BCSE497J - Project - I", color: THEME.brandNavy, bg: THEME.cardBg },
      { label: "ACADEMIC SEMESTER", val: "Fall Semester 2026-27", color: THEME.brandNavy, bg: THEME.cardBg },
      { label: "COURSE OPTION / DURATION", val: "Regular • 6 ( Months )", color: THEME.primaryDark, bg: THEME.skyBg },
      { label: "PROJECT OPTION", val: "General", color: THEME.brandNavy, bg: THEME.cardBg },
      { label: "REGISTRATION STATUS", val: "Approved by Guide", color: THEME.emeraldGreen, bg: THEME.emeraldBg },
      { label: "STUDENT NAME", val: "Ashish Anil Sikaria", color: THEME.brandNavy, bg: THEME.cardBg },
      { label: "REGISTER NUMBER", val: "23BCI0218", color: THEME.primaryDark, bg: THEME.skyBg },
      { label: "FACULTY GUIDE", val: "Prof. SELVI M (Emp ID: 16106)", color: THEME.purpleAccent, bg: THEME.purpleBg },
    ];

    metadataItems.forEach((item, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = 0.66 + col * 4.1;
      const y = 1.35 + row * 1.5;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 3.8,
        h: 1.3,
        rectRadius: 0.08,
        fill: { color: item.bg },
        line: { color: THEME.cardBorder, width: 1.2 },
      });

      slide.addText(item.label, {
        x: x + 0.2,
        y: y + 0.15,
        w: 3.4,
        h: 0.22,
        fontSize: 9,
        fontFace: "Calibri",
        bold: true,
        color: THEME.textMuted,
        charSpacing: 1,
      });

      slide.addText(item.val, {
        x: x + 0.2,
        y: y + 0.42,
        w: 3.4,
        h: 0.65,
        fontSize: 13,
        fontFace: "Calibri",
        bold: true,
        color: item.color,
      });
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.66,
      y: 5.95,
      w: 12.0,
      h: 0.55,
      rectRadius: 0.08,
      fill: { color: THEME.emeraldBg },
      line: { color: "6EE7B7", width: 1 },
    });

    slide.addText("STATUS: Project registered and approved by faculty guide in SCOPE.", {
      x: 0.8,
      y: 6.05,
      w: 11.7,
      h: 0.35,
      fontSize: 11,
      fontFace: "Calibri",
      bold: true,
      color: THEME.emeraldGreen,
      align: "center",
    });
  }

  // ==========================================
  // SLIDE 3: Problem Statement
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Healthcare Industry Problem Statement");

    slide.addText("The Crisis of Centralized Electronic Health Records", {
      x: 0.66,
      y: 0.8,
      w: 12.0,
      h: 0.45,
      fontSize: 22,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    const problems = [
      {
        num: "01",
        title: "Centralized Honeypots & Breaches",
        desc: "Over 133M+ medical records breached in 2023–2025 alone. Centralized hospital databases remain high-value targets for ransomware attacks and unauthorized extraction.",
        accent: THEME.roseRed,
        bg: THEME.roseBg,
        border: "FECDD3",
      },
      {
        num: "02",
        title: "Zero Patient Sovereignty",
        desc: "Patients have no direct ownership or visibility into who accesses, shares, or commercializes their sensitive diagnostic records among insurance brokers.",
        accent: THEME.amberOrange,
        bg: THEME.amberBg,
        border: "FDE68A",
      },
      {
        num: "03",
        title: "Fragmented Data Silos",
        desc: "Incompatible hospital software systems create life-threatening information blind spots during emergency trauma care, resulting in delayed treatments and duplicate testing.",
        accent: THEME.primaryDark,
        bg: THEME.skyBg,
        border: "BAE6FD",
      },
      {
        num: "04",
        title: "Lack of Tamper-Evident Audits",
        desc: "Legacy systems lack cryptographic non-repudiation, permitting unauthorized retrospective alterations of diagnostic records and untraceable access logs.",
        accent: THEME.purpleAccent,
        bg: THEME.purpleBg,
        border: "DDD6FE",
      },
    ];

    problems.forEach((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.66 + col * 6.15;
      const y = 1.35 + row * 2.55;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.85,
        h: 2.35,
        rectRadius: 0.1,
        fill: { color: p.bg },
        line: { color: p.border, width: 1.2 },
      });

      slide.addText(p.num, {
        x: x + 0.25,
        y: y + 0.2,
        w: 0.7,
        h: 0.35,
        fontSize: 18,
        fontFace: "Calibri",
        bold: true,
        color: p.accent,
      });

      slide.addText(p.title, {
        x: x + 0.95,
        y: y + 0.2,
        w: 4.6,
        h: 0.35,
        fontSize: 15,
        fontFace: "Calibri",
        bold: true,
        color: THEME.brandNavy,
      });

      slide.addText(p.desc, {
        x: x + 0.25,
        y: y + 0.65,
        w: 5.35,
        h: 1.5,
        fontSize: 11,
        fontFace: "Calibri",
        color: THEME.textBody,
      });
    });
  }

  // ==========================================
  // SLIDE 4: The CareChain Solution
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Zero-Trust Architecture & Technical Solution");

    slide.addText("The CareChain Solution: Hybrid Web2/Web3 Protocol", {
      x: 0.66,
      y: 0.8,
      w: 12.0,
      h: 0.45,
      fontSize: 22,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    const pillars = [
      {
        tag: "ENCRYPTION LAYER",
        title: "Client AES-256-GCM",
        desc: "All health files and diagnostic reports are encrypted with unique 256-bit symmetric keys, 12-byte IVs, and 16-byte authentication tags before transmission.",
        color: THEME.primaryDark,
        bg: THEME.skyBg,
        border: "BAE6FD",
      },
      {
        tag: "DECENTRALIZED STORAGE",
        title: "IPFS Distributed Pinning",
        desc: "Encrypted ciphertexts are pinned across decentralized IPFS nodes, generating immutable Content Identifiers (CIDs). Zero Protected Health Information (PHI) is stored on-chain.",
        color: THEME.purpleAccent,
        bg: THEME.purpleBg,
        border: "DDD6FE",
      },
      {
        tag: "ACCESS CONTROL",
        title: "Smart Contract RBAC",
        desc: "Solidity smart contracts enforce isolated patient access matrices (doctorPermissions[p][d]) and emit indexed events for verifiable on-chain audit trails.",
        color: THEME.emeraldGreen,
        bg: THEME.emeraldBg,
        border: "A7F3D0",
      },
    ];

    pillars.forEach((p, idx) => {
      const x = 0.66 + idx * 4.1;
      const y = 1.35;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 3.8,
        h: 4.3,
        rectRadius: 0.1,
        fill: { color: p.bg },
        line: { color: p.border, width: 1.2 },
      });

      slide.addText(p.tag, {
        x: x + 0.25,
        y: y + 0.25,
        w: 3.3,
        h: 0.22,
        fontSize: 9,
        fontFace: "Calibri",
        bold: true,
        color: p.color,
        charSpacing: 1,
      });

      slide.addText(p.title, {
        x: x + 0.25,
        y: y + 0.55,
        w: 3.3,
        h: 0.55,
        fontSize: 16,
        fontFace: "Calibri",
        bold: true,
        color: THEME.brandNavy,
      });

      slide.addText(p.desc, {
        x: x + 0.25,
        y: y + 1.2,
        w: 3.3,
        h: 2.8,
        fontSize: 11.5,
        fontFace: "Calibri",
        color: THEME.textBody,
      });
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.66,
      y: 5.9,
      w: 12.0,
      h: 0.6,
      rectRadius: 0.08,
      fill: { color: THEME.skyBg },
      line: { color: "BAE6FD", width: 1 },
    });

    slide.addText(
      "REGULATORY COMPLIANCE: HIPAA Security Rule (§164.312) & GDPR Article 17 Crypto-Shredding Compliant.",
      {
        x: 0.8,
        y: 6.02,
        w: 11.7,
        h: 0.35,
        fontSize: 10.5,
        fontFace: "Calibri",
        bold: true,
        color: THEME.primaryDark,
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
      x: 0.66,
      y: 0.8,
      w: 12.0,
      h: 0.45,
      fontSize: 22,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    const sdgs = [
      {
        badge: "SDG 3",
        target: "TARGET 3.8",
        title: "Good Health and Well-Being",
        desc: "Provides portable, tamper-proof medical records across hospital networks and cross-border consultations, reducing diagnostic errors and duplicate procedures.",
        bg: THEME.emeraldBg,
        border: "A7F3D0",
        color: THEME.emeraldGreen,
      },
      {
        badge: "SDG 9",
        target: "TARGET 9.5",
        title: "Industry, Innovation & Infrastructure",
        desc: "Modernizes vulnerable legacy healthcare databases into resilient decentralized infrastructure combining cryptographic ledger security with IPFS.",
        bg: THEME.amberBg,
        border: "FDE68A",
        color: THEME.amberOrange,
      },
      {
        badge: "SDG 10",
        target: "TARGET 10.2",
        title: "Reduced Inequalities",
        desc: "Democratizes patient ownership over health records regardless of socioeconomic status, preventing commercial healthcare monopolies and data lock-in.",
        bg: THEME.roseBg,
        border: "FECDD3",
        color: THEME.roseRed,
      },
      {
        badge: "SDG 16",
        target: "TARGET 16.6",
        title: "Peace, Justice & Strong Institutions",
        desc: "Establishes transparent, immutable on-chain audit trails for clinician licensing and diagnostic issuance, preventing healthcare malpractice fraud.",
        bg: THEME.purpleBg,
        border: "DDD6FE",
        color: THEME.purpleAccent,
      },
    ];

    sdgs.forEach((s, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.66 + col * 6.15;
      const y = 1.35 + row * 2.55;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.85,
        h: 2.35,
        rectRadius: 0.1,
        fill: { color: s.bg },
        line: { color: s.border, width: 1.2 },
      });

      slide.addText(`${s.badge}  •  ${s.target}`, {
        x: x + 0.25,
        y: y + 0.18,
        w: 5.35,
        h: 0.22,
        fontSize: 9.5,
        fontFace: "Calibri",
        bold: true,
        color: s.color,
        charSpacing: 1,
      });

      slide.addText(s.title, {
        x: x + 0.25,
        y: y + 0.45,
        w: 5.35,
        h: 0.35,
        fontSize: 15,
        fontFace: "Calibri",
        bold: true,
        color: THEME.brandNavy,
      });

      slide.addText(s.desc, {
        x: x + 0.25,
        y: y + 0.85,
        w: 5.35,
        h: 1.35,
        fontSize: 11,
        fontFace: "Calibri",
        color: THEME.textBody,
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
      x: 0.66,
      y: 0.8,
      w: 12.0,
      h: 0.45,
      fontSize: 22,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    // Progression Bar
    const stages = [
      { label: "TRL 1 - 3", sub: "Concept Formulation", active: false },
      { label: "TRL 4 - 5", sub: "Lab Validation", active: false },
      { label: "★ TRL 6 VERIFIED ★", sub: "Demonstrated Prototype", active: true },
      { label: "TRL 7 - 9", sub: "Clinical Deployment", active: false },
    ];

    stages.forEach((st, idx) => {
      const x = 0.66 + idx * 3.08;
      const y = 1.35;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 2.85,
        h: 0.95,
        rectRadius: 0.08,
        fill: { color: st.active ? THEME.skyBg : THEME.cardBg },
        line: { color: st.active ? THEME.primaryBlue : THEME.cardBorder, width: st.active ? 2 : 1 },
      });

      slide.addText(st.label, {
        x: x + 0.1,
        y: y + 0.12,
        w: 2.65,
        h: 0.28,
        fontSize: 11,
        fontFace: "Calibri",
        bold: true,
        color: st.active ? THEME.primaryDark : THEME.textMuted,
        align: "center",
      });

      slide.addText(st.sub, {
        x: x + 0.1,
        y: y + 0.42,
        w: 2.65,
        h: 0.42,
        fontSize: 9,
        fontFace: "Calibri",
        color: st.active ? THEME.brandNavy : THEME.textMuted,
        align: "center",
      });
    });

    // Left Box: TRL 6 Verified
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.66,
      y: 2.45,
      w: 5.85,
      h: 4.15,
      rectRadius: 0.1,
      fill: { color: THEME.emeraldBg },
      line: { color: "A7F3D0", width: 1.2 },
    });

    slide.addText("✓ TRL 6 VERIFIED DELIVERABLES", {
      x: 0.9,
      y: 2.65,
      w: 5.35,
      h: 0.28,
      fontSize: 11,
      fontFace: "Calibri",
      bold: true,
      color: THEME.emeraldGreen,
      charSpacing: 1,
    });

    slide.addText(
      "• Smart Contracts: MedicalRecord.sol deployed with 100% automated test coverage (11/11 Hardhat unit tests passing).\n\n• Cryptographic Gateway: Client-side AES-256-GCM symmetric buffer encryption and IPFS pinning via Pinata live.\n\n• Role-Based Portals: Web3 frontend with dedicated portals for Patients, Licensed Doctors, and Hospital Governance.\n\n• Enterprise Architecture: Monorepo with CI/CD automation, Docker orchestration, and RBAC middleware.",
      {
        x: 0.9,
        y: 3.0,
        w: 5.35,
        h: 3.4,
        fontSize: 10.5,
        fontFace: "Calibri",
        color: THEME.textBody,
      }
    );

    // Right Box: Roadmap to TRL 9
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.81,
      y: 2.45,
      w: 5.85,
      h: 4.15,
      rectRadius: 0.1,
      fill: { color: THEME.skyBg },
      line: { color: "BAE6FD", width: 1.2 },
    });

    slide.addText("➔ ROADMAP TO TRL 9 (COMMERCIAL DEPLOYMENT)", {
      x: 7.05,
      y: 2.65,
      w: 5.35,
      h: 0.28,
      fontSize: 11,
      fontFace: "Calibri",
      bold: true,
      color: THEME.primaryDark,
      charSpacing: 1,
    });

    slide.addText(
      "• TRL 7 (Operational Sandbox): Multi-hospital sandbox testing with HL7 FHIR structured schemas and ERC-4337 Passkey relayers.\n\n• TRL 8 (System Qualification): Formal smart contract verification by CertiK/OpenZeppelin and HIPAA/GDPR certification.\n\n• TRL 9 (Full Clinical Deployment): Production mainnet rollout across participating hospital consortiums and insurance validation nodes.",
      {
        x: 7.05,
        y: 3.0,
        w: 5.35,
        h: 3.4,
        fontSize: 10.5,
        fontFace: "Calibri",
        color: THEME.textBody,
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
      x: 0.66,
      y: 0.8,
      w: 12.0,
      h: 0.45,
      fontSize: 22,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    const innovations = [
      {
        title: "Break-Glass Emergency Protocol",
        desc: "Solves the unconscious ER patient dilemma: Verified physicians trigger time-delayed cryptographic challenges or multi-guardian signatures backed by on-chain audit penalties.",
        bg: THEME.roseBg,
        border: "FECDD3",
      },
      {
        title: "Zero-Knowledge (ZK) Health Claims",
        desc: "zk-SNARK circuits allow patients to prove clinical trial or insurance eligibility (e.g. HbA1c < 6.5%, age > 18) without disclosing raw medical files or identity.",
        bg: THEME.purpleBg,
        border: "DDD6FE",
      },
      {
        title: "Gasless Account Abstraction (ERC-4337)",
        desc: "Replaces seed phrases and gas tokens with WebAuthn Passkeys (TouchID / FaceID), sponsored by hospital Paymaster relayers.",
        bg: THEME.skyBg,
        border: "BAE6FD",
      },
      {
        title: "Soulbound Tokens (SBTs - ERC-5192)",
        desc: "Non-transferable medical credentials minted by state medical boards. If a license is suspended, on-chain decryption permissions are instantly revoked.",
        bg: THEME.emeraldBg,
        border: "A7F3D0",
      },
    ];

    innovations.forEach((inv, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.66 + col * 6.15;
      const y = 1.35 + row * 2.55;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.85,
        h: 2.35,
        rectRadius: 0.1,
        fill: { color: inv.bg },
        line: { color: inv.border, width: 1.2 },
      });

      slide.addText(inv.title, {
        x: x + 0.25,
        y: y + 0.2,
        w: 5.35,
        h: 0.35,
        fontSize: 15,
        fontFace: "Calibri",
        bold: true,
        color: THEME.brandNavy,
      });

      slide.addText(inv.desc, {
        x: x + 0.25,
        y: y + 0.65,
        w: 5.35,
        h: 1.5,
        fontSize: 11,
        fontFace: "Calibri",
        color: THEME.textBody,
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
      x: 0.66,
      y: 0.8,
      w: 12.0,
      h: 0.45,
      fontSize: 22,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    const stakeholders = [
      {
        title: "Patients",
        desc: "Complete data sovereignty, zero commercial exploitation, and seamless portable access across medical facilities.",
        bg: THEME.skyBg,
        border: "BAE6FD",
      },
      {
        title: "Clinicians",
        desc: "Instant verified medical histories, zero diagnostic redundancy, and reduced malpractice liability.",
        bg: THEME.emeraldBg,
        border: "A7F3D0",
      },
      {
        title: "Researchers",
        desc: "Opt-in Compute-to-Data research pools with automated cryptographic patient micro-rewards.",
        bg: THEME.purpleBg,
        border: "DDD6FE",
      },
      {
        title: "Insurers",
        desc: "Tamper-proof smart contract claims verification, eliminating fraudulent billing and overhead.",
        bg: THEME.amberBg,
        border: "FDE68A",
      },
    ];

    stakeholders.forEach((st, idx) => {
      const x = 0.66 + idx * 3.08;
      const y = 1.35;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 2.85,
        h: 5.2,
        rectRadius: 0.1,
        fill: { color: st.bg },
        line: { color: st.border, width: 1.2 },
      });

      slide.addText(st.title, {
        x: x + 0.15,
        y: y + 0.35,
        w: 2.55,
        h: 0.4,
        fontSize: 17,
        fontFace: "Calibri",
        bold: true,
        color: THEME.brandNavy,
        align: "center",
      });

      slide.addText(st.desc, {
        x: x + 0.15,
        y: y + 0.95,
        w: 2.55,
        h: 3.8,
        fontSize: 11.5,
        fontFace: "Calibri",
        color: THEME.textBody,
        align: "center",
      });
    });
  }

  // ==========================================
  // SLIDE 9: Project Demonstration & Modules
  // ==========================================
  {
    const slide = pptx.addSlide();
    applyBaseSlide(slide, "Demonstration & Deliverables");

    slide.addText("Prototype Demonstration & System Modules", {
      x: 0.66,
      y: 0.8,
      w: 12.0,
      h: 0.45,
      fontSize: 22,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
    });

    const modules = [
      {
        title: "Patient Health Vault",
        desc: "Client-side AES-256 file encryption, IPFS pinning via Pinata, and toggleable doctor access control matrix.",
        bg: THEME.skyBg,
        border: "BAE6FD",
      },
      {
        title: "Practitioner Portal",
        desc: "Authorized patient EHR lookup, verified clinical diagnostic report uploads, and digital prescription issuance.",
        bg: THEME.emeraldBg,
        border: "A7F3D0",
      },
      {
        title: "Hospital Governance",
        desc: "Practitioner license verification, smart contract telemetry, and HIPAA audit trail log exports.",
        bg: THEME.purpleBg,
        border: "DDD6FE",
      },
      {
        title: "Web3 Wallet Layer",
        desc: "Direct MetaMask provider integration alongside off-chain fallback simulation modes.",
        bg: THEME.amberBg,
        border: "FDE68A",
      },
    ];

    modules.forEach((m, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.66 + col * 6.15;
      const y = 1.35 + row * 2.55;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.85,
        h: 2.35,
        rectRadius: 0.1,
        fill: { color: m.bg },
        line: { color: m.border, width: 1.2 },
      });

      slide.addText(m.title, {
        x: x + 0.25,
        y: y + 0.2,
        w: 5.35,
        h: 0.35,
        fontSize: 15,
        fontFace: "Calibri",
        bold: true,
        color: THEME.brandNavy,
      });

      slide.addText(m.desc, {
        x: x + 0.25,
        y: y + 0.65,
        w: 5.35,
        h: 1.5,
        fontSize: 11.5,
        fontFace: "Calibri",
        color: THEME.textBody,
      });
    });
  }

  // ==========================================
  // SLIDE 10: Conclusion & Academic Defense
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: THEME.bgPage };

    // Outer Main Card
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.66,
      y: 0.5,
      w: 12.0,
      h: 6.4,
      rectRadius: 0.12,
      fill: { color: THEME.cardBg },
      line: { color: THEME.cardBorder, width: 1.5 },
    });

    slide.addText("CONCLUSION & ACADEMIC DEFENSE", {
      x: 1.0,
      y: 0.8,
      w: 11.33,
      h: 0.3,
      fontSize: 10,
      fontFace: "Calibri",
      bold: true,
      color: THEME.primaryDark,
      align: "center",
      charSpacing: 1.5,
    });

    slide.addText("CareChain: Redefining Sovereign Healthcare", {
      x: 1.0,
      y: 1.15,
      w: 11.33,
      h: 0.7,
      fontSize: 30,
      fontFace: "Calibri",
      bold: true,
      color: THEME.brandNavy,
      align: "center",
    });

    slide.addText(
      "CareChain delivers a verified, production-grade protocol for patient-governed electronic health records. Validated with 100% automated test coverage, zero-trust cryptographic security, and mapped against UN SDGs and TRL progression.",
      {
        x: 1.5,
        y: 1.85,
        w: 10.33,
        h: 0.65,
        fontSize: 11.5,
        fontFace: "Calibri",
        color: THEME.textBody,
        align: "center",
      }
    );

    // Summary Box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.2,
      y: 2.7,
      w: 10.93,
      h: 3.8,
      rectRadius: 0.1,
      fill: { color: THEME.skyBg },
      line: { color: "BAE6FD", width: 1.2 },
    });

    const summaryCards = [
      { label: "CANDIDATE", val: "Ashish Anil Sikaria (23BCI0218)", color: THEME.brandNavy },
      { label: "COURSE & SEMESTER", val: "BCSE497J (Project - I) • Fall 2026-27", color: THEME.brandNavy },
      { label: "FACULTY GUIDE", val: "Prof. SELVI M (Emp ID: 16106)", color: THEME.purpleAccent },
      { label: "SCHOOL", val: "SCOPE (Computer Science & Engineering)", color: THEME.brandNavy },
      { label: "READINESS LEVEL", val: "TRL 6 (Demonstrated Prototype)", color: THEME.emeraldGreen },
      { label: "UN SDG ALIGNMENT", val: "SDGs 3.8, 9.5, 10.2, 16.6", color: THEME.primaryDark },
    ];

    summaryCards.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 1.5 + col * 5.3;
      const y = 3.0 + row * 1.1;

      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y,
        w: 5.0,
        h: 0.9,
        rectRadius: 0.08,
        fill: { color: THEME.white },
        line: { color: THEME.cardBorder, width: 1 },
      });

      slide.addText(c.label, {
        x: x + 0.2,
        y: y + 0.12,
        w: 4.6,
        h: 0.2,
        fontSize: 8.5,
        fontFace: "Calibri",
        bold: true,
        color: THEME.textMuted,
        charSpacing: 1,
      });

      slide.addText(c.val, {
        x: x + 0.2,
        y: y + 0.38,
        w: 4.6,
        h: 0.42,
        fontSize: 12,
        fontFace: "Calibri",
        bold: true,
        color: c.color,
      });
    });
  }

  // Output folder
  const outDir = path.join(__dirname, "../docs/presentation");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outputPath = path.join(outDir, "CareChain_Presentation.pptx");
  await pptx.writeFile({ fileName: outputPath });
  console.log(`✅ Perfectly Formatted Widescreen PowerPoint Generated at: ${outputPath}`);
}

generateDeck().catch(console.error);
