import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_natural_presentation():
    prs = Presentation()
    
    # Standard 16:9 Widescreen (13.333" x 7.5")
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Refined Natural Color Palette (Human Editorial Design)
    C_WHITE     = RGBColor(255, 255, 255)
    C_BG        = RGBColor(252, 252, 253) # Ultra-clean soft paper white
    C_SURFACE   = RGBColor(248, 250, 252) # Soft subtle tint for section cards
    C_BORDER    = RGBColor(226, 232, 240) # Slate-200 subtle divider
    C_PRIMARY   = RGBColor(2, 132, 199)   # Ocean Sky Blue (#0284C7)
    C_PRIMARY_D = RGBColor(3, 105, 161)   # Deep Blue (#0369A1)
    C_TITLE     = RGBColor(15, 23, 42)    # Slate-900 (Editorial headings)
    C_BODY      = RGBColor(51, 65, 85)    # Slate-700 (High-legibility body)
    C_MUTED     = RGBColor(100, 116, 139) # Slate-500 (Clean secondary)
    C_ACCENT_BG = RGBColor(240, 249, 255) # Sky-50

    # Authentic UN SDG Colors
    C_SDG3      = RGBColor(76, 159, 56)   # SDG 3 Green (#4C9F38)
    C_SDG9      = RGBColor(253, 105, 37)  # SDG 9 Orange (#FD6925)
    C_SDG10     = RGBColor(221, 19, 103)  # SDG 10 Pink (#DD1367)
    C_SDG16     = RGBColor(0, 104, 157)   # SDG 16 Blue (#00689D)
    C_EMERALD   = RGBColor(5, 150, 105)   # Emerald (#059669)
    C_ROSE      = RGBColor(225, 29, 72)   # Rose (#E11D48)

    FONT_FAMILY = "Calibri"
    FONT_HEADING = "Calibri"
    FONT_BODY = "Calibri"

    def apply_natural_header(slide, tracker, title, subtitle=None):
        # Clean Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

        # Category Tracker (Clean small caps)
        tf_tr = slide.shapes.add_textbox(Inches(0.9), Inches(0.45), Inches(11.5), Inches(0.25)).text_frame
        tf_tr.word_wrap = True
        p_tr = tf_tr.paragraphs[0]
        p_tr.text = tracker.upper()
        p_tr.font.name = FONT_FAMILY
        p_tr.font.size = Pt(9.5)
        p_tr.font.bold = True
        p_tr.font.color.rgb = C_PRIMARY

        # Main Title & Subtitle
        tf_ti = slide.shapes.add_textbox(Inches(0.9), Inches(0.72), Inches(11.5), Inches(0.7)).text_frame
        tf_ti.word_wrap = True
        p_ti = tf_ti.paragraphs[0]
        p_ti.text = title
        p_ti.font.name = FONT_FAMILY
        p_ti.font.size = Pt(22)
        p_ti.font.bold = True
        p_ti.font.color.rgb = C_TITLE

        if subtitle:
            p_sub = tf_ti.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.name = FONT_FAMILY
            p_sub.font.size = Pt(11.5)
            p_sub.font.color.rgb = C_MUTED

        # Crisp Horizontal Divider Line
        div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(1.5), Inches(11.533), Inches(0.01))
        div.fill.solid()
        div.fill.fore_color.rgb = C_BORDER
        div.line.fill.background()

        # Footer Line & Text
        fdiv = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(6.8), Inches(11.533), Inches(0.01))
        fdiv.fill.solid()
        fdiv.fill.fore_color.rgb = C_BORDER
        fdiv.line.fill.background()

        tf_fl = slide.shapes.add_textbox(Inches(0.9), Inches(6.86), Inches(7.0), Inches(0.3)).text_frame
        p_fl = tf_fl.paragraphs[0]
        p_fl.text = "CareChain • Ashish Anil Sikaria (23BCI0218) • Guide: Prof. SELVI M • SCOPE"
        p_fl.font.name = FONT_FAMILY
        p_fl.font.size = Pt(9)
        p_fl.font.color.rgb = C_MUTED

        tf_fr = slide.shapes.add_textbox(Inches(8.5), Inches(6.86), Inches(3.933), Inches(0.3)).text_frame
        p_fr = tf_fr.paragraphs[0]
        p_fr.alignment = PP_ALIGN.RIGHT
        p_fr.text = "BCSE497J Project - I • Fall Semester 2026-27"
        p_fr.font.name = FONT_FAMILY
        p_fr.font.size = Pt(9)
        p_fr.font.color.rgb = C_MUTED

    # =========================================================================
    # SLIDE 1: Title Slide (Human, Editorial & Natural)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_WHITE
    bg1.line.fill.background()

    # Left Modern Color Accent Stripe
    stripe = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.25), Inches(7.5))
    stripe.fill.solid()
    stripe.fill.fore_color.rgb = C_PRIMARY
    stripe.line.fill.background()

    # Academic Session Tag
    tf_top = s1.shapes.add_textbox(Inches(1.1), Inches(0.9), Inches(10.5), Inches(0.3)).text_frame
    p = tf_top.paragraphs[0]
    p.text = "FALL SEMESTER 2026-27  •  BCSE497J - PROJECT - I  •  SCOPE"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY_D

    # Hero Title Block
    tf_h = s1.shapes.add_textbox(Inches(1.1), Inches(1.4), Inches(10.5), Inches(2.2)).text_frame
    tf_h.word_wrap = True

    p = tf_h.paragraphs[0]
    p.text = "CareChain"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = C_TITLE

    p = tf_h.add_paragraph()
    p.text = "Decentralized, Patient-Centric Electronic Health Record Protocol"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    p = tf_h.add_paragraph()
    p.text = "Empowering patient data sovereignty through Ethereum Smart Contracts, AES-256 Client-Side Encryption, and Decentralized IPFS Storage."
    p.font.name = FONT_FAMILY
    p.font.size = Pt(12)
    p.font.color.rgb = C_MUTED

    # Elegant Divider
    div1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.1), Inches(3.85), Inches(11.0), Inches(0.01))
    div1.fill.solid()
    div1.fill.fore_color.rgb = C_BORDER
    div1.line.fill.background()

    # Student Block (Left Column)
    tf_s1 = s1.shapes.add_textbox(Inches(1.1), Inches(4.2), Inches(5.2), Inches(2.4)).text_frame
    tf_s1.word_wrap = True

    p = tf_s1.paragraphs[0]
    p.text = "CANDIDATE DETAILS"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY_D

    p = tf_s1.add_paragraph()
    p.text = "Ashish Anil Sikaria"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_TITLE

    p = tf_s1.add_paragraph()
    p.text = "Register Number: 23BCI0218\nProgramme: B.Tech Computer Science & Engineering\nSchool: SCOPE"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(11.5)
    p.font.color.rgb = C_BODY

    # Guide Block (Right Column)
    tf_g1 = s1.shapes.add_textbox(Inches(6.8), Inches(4.2), Inches(5.3), Inches(2.4)).text_frame
    tf_g1.word_wrap = True

    p = tf_g1.paragraphs[0]
    p.text = "FACULTY GUIDE"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY_D

    p = tf_g1.add_paragraph()
    p.text = "Prof. SELVI M"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_TITLE

    p = tf_g1.add_paragraph()
    p.text = "Designation: Associate Professor Grade 2\nEmployee ID: 16106\nSchool: SCOPE • Status: Registered & Approved"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(11.5)
    p.font.color.rgb = C_BODY

    # =========================================================================
    # SLIDE 2: Project Profile & Academic Metadata (Natural Table-Free Flow)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_natural_header(s2, "Academic Registration", "Institutional Framework & Project Governance", "Approved project parameters under the School of Computer Science & Engineering (SCOPE).")

    # Left Column: Project Scope Narrative
    tf_s2_left = s2.shapes.add_textbox(Inches(0.9), Inches(1.8), Inches(4.8), Inches(4.6)).text_frame
    tf_s2_left.word_wrap = True

    p = tf_s2_left.paragraphs[0]
    p.text = "Project Scope & Focus"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_TITLE

    p = tf_s2_left.add_paragraph()
    p.text = "\nCareChain addresses fundamental privacy, interoperability, and sovereignty challenges in contemporary Electronic Health Records (EHR)."
    p.font.name = FONT_FAMILY
    p.font.size = Pt(11.5)
    p.font.color.rgb = C_BODY

    p = tf_s2_left.add_paragraph()
    p.text = "\nBy synthesizing client-side AES-256 encryption with decentralized IPFS storage and Ethereum smart contract access lists, the project achieves a zero-trust architecture compliant with HIPAA and GDPR standards."
    p.font.name = FONT_FAMILY
    p.font.size = Pt(11.5)
    p.font.color.rgb = C_BODY

    p = tf_s2_left.add_paragraph()
    p.text = "\nApproval Status: Fully registered and approved under faculty guidance in SCOPE."
    p.font.name = FONT_FAMILY
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    # Subtle Vertical Divider
    vdiv2 = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.0), Inches(1.8), Inches(0.01), Inches(4.6))
    vdiv2.fill.solid()
    vdiv2.fill.fore_color.rgb = C_BORDER
    vdiv2.line.fill.background()

    # Right Column: Academic Metadata Key-Values
    meta_rows = [
        ("Course Code & Title", "BCSE497J - Project - I"),
        ("Academic Semester", "Fall Semester 2026-27"),
        ("Course Option & Duration", "Regular • 6 Months (General Option)"),
        ("Candidate Name & Reg No", "Ashish Anil Sikaria (23BCI0218)"),
        ("Faculty Guide Details", "Prof. SELVI M (Emp ID: 16106, Assoc. Prof. Gr. 2)"),
        ("Academic School", "SCOPE (School of Computer Science & Engineering)"),
        ("Project Status", "Registered & Approved by Guide"),
    ]

    for idx, (label, val) in enumerate(meta_rows):
        y = Inches(1.8 + idx * 0.65)
        tf_row = s2.shapes.add_textbox(Inches(6.4), y, Inches(6.0), Inches(0.55)).text_frame
        tf_row.word_wrap = True

        p = tf_row.paragraphs[0]
        p.text = label.upper()
        p.font.name = FONT_FAMILY
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = C_MUTED

        p = tf_row.add_paragraph()
        p.text = val
        p.font.name = FONT_FAMILY
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_TITLE

    # =========================================================================
    # SLIDE 3: Problem Statement (Editorial Layout with Hero Metric)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_natural_header(s3, "Market & Industry Crisis", "The Crisis in Centralized Healthcare Data", "Why traditional hospital electronic record systems fail patients and clinicians alike.")

    # Left Stat Column
    tf_s3_l = s3.shapes.add_textbox(Inches(0.9), Inches(1.9), Inches(4.2), Inches(4.5)).text_frame
    tf_s3_l.word_wrap = True

    p = tf_s3_l.paragraphs[0]
    p.text = "133M+"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(54)
    p.font.bold = True
    p.font.color.rgb = C_ROSE

    p = tf_s3_l.add_paragraph()
    p.text = "Healthcare Records Breached (2023–2025)"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_TITLE

    p = tf_s3_l.add_paragraph()
    p.text = "\nCentralized databases in hospitals and clinics remain the single highest-value targets for ransomware attacks, exposing private patient histories to extortion and black-market monetization."
    p.font.name = FONT_BODY
    p.font.size = Pt(11.5)
    p.font.color.rgb = C_MUTED

    # Right 3 Friction Points (Clean narrative blocks)
    frictions = [
        ("Zero Patient Sovereignty", "Patients have no direct ownership or real-time visibility into who decrypts, shares, or commercializes their sensitive diagnostic records among third-party brokers."),
        ("Fragmented Interoperability Silos", "Incompatible software architectures across regional clinics cause life-threatening information blind spots in emergency trauma care, forcing redundant tests."),
        ("Lack of Tamper-Evident Auditing", "Relational databases lack cryptographic non-repudiation, permitting unauthorized retrospective alterations of diagnostic records and untraceable access logs."),
    ]

    for idx, (title, desc) in enumerate(frictions):
        y = Inches(1.9 + idx * 1.55)
        
        # Clean Accent Indicator Bar
        ind = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.6), y, Inches(0.04), Inches(1.25))
        ind.fill.solid()
        ind.fill.fore_color.rgb = C_PRIMARY if idx != 0 else C_ROSE
        ind.line.fill.background()

        tf = s3.shapes.add_textbox(Inches(5.8), y - Inches(0.05), Inches(6.6), Inches(1.3)).text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_FAMILY
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_TITLE

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11)
        p.font.color.rgb = C_BODY

    # =========================================================================
    # SLIDE 4: The CareChain Solution (3 Clean Open Columns)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_natural_header(s4, "Technical Architecture", "The CareChain Zero-Trust Healthcare Solution", "A 3-layer hybrid protocol separating client cryptography, decentralized storage, and on-chain access.")

    layers = [
        ("Layer 01 : Client Privacy", "AES-256-GCM Encryption", "All medical files and diagnostic scans are encrypted locally in the patient's browser with unique 256-bit symmetric keys, 12-byte IVs, and 16-byte authentication tags before leaving the device."),
        ("Layer 02 : Distributed Pinning", "IPFS Storage Protocol", "Encrypted ciphertexts are pinned across decentralized IPFS nodes, generating immutable Content Identifiers (CIDs). Zero Protected Health Information (PHI) is ever exposed on-chain."),
        ("Layer 03 : Access Governance", "Smart Contract RBAC", "Solidity smart contracts enforce isolated patient access matrices (doctorPermissions[p][d]) and emit indexed blockchain events for a verifiable regulatory audit trail."),
    ]

    for idx, (layer, title, desc) in enumerate(layers):
        x = Inches(0.9 + idx * 4.0)

        # Subtle top accent line
        acc = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(1.85), Inches(3.5), Inches(0.03))
        acc.fill.solid()
        acc.fill.fore_color.rgb = C_PRIMARY
        acc.line.fill.background()

        tf = s4.shapes.add_textbox(x, Inches(1.95), Inches(3.5), Inches(4.3)).text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = layer.upper()
        p.font.name = FONT_FAMILY
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY_D

        p = tf.add_paragraph()
        p.text = title
        p.font.name = FONT_FAMILY
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = C_TITLE

        p = tf.add_paragraph()
        p.text = f"\n{desc}"
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_BODY

    # Regulatory Banner
    tf_reg = s4.shapes.add_textbox(Inches(0.9), Inches(6.15), Inches(11.533), Inches(0.4)).text_frame
    p_reg = tf_reg.paragraphs[0]
    p_reg.alignment = PP_ALIGN.CENTER
    p_reg.text = "REGULATORY COMPLIANCE: HIPAA Security Rule (§164.312) & GDPR Article 17 Crypto-Shredding Compliant."
    p_reg.font.name = FONT_FAMILY
    p_reg.font.size = Pt(10)
    p_reg.font.bold = True
    p_reg.font.color.rgb = C_PRIMARY_D

    # =========================================================================
    # SLIDE 5: UN Sustainable Development Goals (Authentic UN Colors)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    apply_natural_header(s5, "Global Sustainability Impact", "Alignment with UN Sustainable Development Goals", "Direct contributions to four primary United Nations 2030 Agenda targets.")

    sdgs = [
        ("SDG 3", "Target 3.8", "Good Health and Well-Being", "Provides portable, tamper-proof medical records across hospital networks and cross-border consultations, reducing diagnostic errors and duplicate testing.", C_SDG3),
        ("SDG 9", "Target 9.5", "Industry, Innovation & Infrastructure", "Modernizes vulnerable legacy healthcare databases into resilient decentralized infrastructure combining cryptographic ledger security with IPFS.", C_SDG9),
        ("SDG 10", "Target 10.2", "Reduced Inequalities", "Democratizes patient ownership over health records regardless of socioeconomic status, preventing commercial healthcare monopolies and data lock-in.", C_SDG10),
        ("SDG 16", "Target 16.6", "Peace, Justice & Strong Institutions", "Establishes transparent, immutable on-chain audit trails for clinician licensing and diagnostic issuance, preventing healthcare malpractice fraud.", C_SDG16),
    ]

    for idx, (badge, target, title, desc, col_sdg) in enumerate(sdgs):
        col = idx % 2
        row = idx // 2
        x = Inches(0.9 + col * 5.9)
        y = Inches(1.85 + row * 2.35)

        # Left Color Accent Pill
        pill = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(1.1), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = col_sdg
        pill.line.fill.background()
        tf_p = pill.text_frame
        p_p = tf_p.paragraphs[0]
        p_p.alignment = PP_ALIGN.CENTER
        p_p.text = badge
        p_p.font.name = FONT_FAMILY
        p_p.font.size = Pt(10)
        p_p.font.bold = True
        p_p.font.color.rgb = C_WHITE

        tf = s5.shapes.add_textbox(x + Inches(1.25), y - Inches(0.05), Inches(4.3), Inches(2.1)).text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"{target.upper()}  •  {title}"
        p.font.name = FONT_FAMILY
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = C_TITLE

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11)
        p.font.color.rgb = C_BODY

    # =========================================================================
    # SLIDE 6: Technology Readiness Level (Natural Timeline & Evidence)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_natural_header(s6, "Technical Maturity", "Technology Readiness Level (TRL 6 Prototype)", "System maturity assessment benchmarked against NASA and EU Horizon frameworks.")

    # Timeline Stages (Clean Horizontal Strip)
    stages = [
        ("TRL 1 - 3", "Concept Formulation", False),
        ("TRL 4 - 5", "Lab Component Testing", False),
        ("★ TRL 6 VERIFIED ★", "Demonstrated Working Prototype", True),
        ("TRL 7 - 9", "Clinical Trials & Mainnet", False),
    ]

    for idx, (st_name, st_sub, is_active) in enumerate(stages):
        x = Inches(0.9 + idx * 2.95)
        
        # Indicator bar
        bar_col = C_PRIMARY if is_active else C_BORDER
        ib = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(1.8), Inches(2.7), Inches(0.04))
        ib.fill.solid()
        ib.fill.fore_color.rgb = bar_col
        ib.line.fill.background()

        tf_st = s6.shapes.add_textbox(x, Inches(1.88), Inches(2.7), Inches(0.75)).text_frame
        tf_st.word_wrap = True

        p = tf_st.paragraphs[0]
        p.text = st_name
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY_D if is_active else C_MUTED

        p = tf_st.add_paragraph()
        p.text = st_sub
        p.font.name = FONT_FAMILY
        p.font.size = Pt(9)
        p.font.color.rgb = C_TITLE if is_active else C_MUTED

    # Left Column: TRL 6 Deliverables
    tf_trl_l = s6.shapes.add_textbox(Inches(0.9), Inches(2.85), Inches(5.5), Inches(3.8)).text_frame
    tf_trl_l.word_wrap = True

    p = tf_trl_l.paragraphs[0]
    p.text = "✓ TRL 6 Verified Deliverables (Today)"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    p = tf_trl_l.add_paragraph()
    p.text = "\n• Smart Contracts: MedicalRecord.sol deployed with 100% automated test coverage (11/11 Hardhat unit tests passing).\n\n• Cryptographic Gateway: Client-side AES-256-GCM symmetric buffer encryption and IPFS pinning via Pinata live.\n\n• Role Portals: Production Web3 UI for Patients, Doctors, and Hospital Governance with MetaMask wallet integration.\n\n• Enterprise Architecture: Monorepo with CI/CD automation, Docker orchestration, and RBAC middleware."
    p.font.name = FONT_FAMILY
    p.font.size = Pt(11)
    p.font.color.rgb = C_BODY

    # Right Column: Roadmap to TRL 9
    tf_trl_r = s6.shapes.add_textbox(Inches(6.8), Inches(2.85), Inches(5.6), Inches(3.8)).text_frame
    tf_trl_r.word_wrap = True

    p = tf_trl_r.paragraphs[0]
    p.text = "➔ Roadmap to TRL 9 (Commercial Deployment)"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY_D

    p = tf_trl_r.add_paragraph()
    p.text = "\n• TRL 7 (Operational Sandbox): Multi-hospital sandbox testing with HL7 FHIR structured data schemas and ERC-4337 Passkeys.\n\n• TRL 8 (System Qualification): Formal smart contract security audit (CertiK/OpenZeppelin) and HIPAA/GDPR commercial certification.\n\n• TRL 9 (Full Clinical Deployment): Live production mainnet deployment across partner hospital networks and insurance nodes."
    p.font.name = FONT_FAMILY
    p.font.size = Pt(11)
    p.font.color.rgb = C_BODY

    # =========================================================================
    # SLIDE 7: High-Impact Innovations (Natural Editorial Grid)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    apply_natural_header(s7, "Competitive Differentiators", "Novel Innovations Beyond Generic Student Demos", "Key cryptographic and architectural features solving real-world clinical challenges.")

    innovations = [
        ("Break-Glass Emergency Protocol", "Solves the unconscious ER patient dilemma: Verified trauma physicians trigger time-delayed cryptographic challenges or multi-guardian signatures backed by on-chain audit penalties."),
        ("Zero-Knowledge (ZK) Health Claims", "zk-SNARK circuits allow patients to prove clinical trial or insurance eligibility (e.g. HbA1c < 6.5%, age > 18) without disclosing raw medical files or identity."),
        ("Gasless Account Abstraction (ERC-4337)", "Replaces complex seed phrases and gas tokens with WebAuthn Passkeys (TouchID / FaceID), sponsored by hospital Paymaster relayers."),
        ("Soulbound Tokens (SBTs - ERC-5192)", "Non-transferable medical credentials minted by state medical boards. If a license is suspended, on-chain decryption permissions are instantly revoked."),
    ]

    for idx, (title, desc) in enumerate(innovations):
        col = idx % 2
        row = idx // 2
        x = Inches(0.9 + col * 5.9)
        y = Inches(1.85 + row * 2.35)

        # Clean Accent Indicator
        ind = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, Inches(0.04), Inches(1.8))
        ind.fill.solid()
        ind.fill.fore_color.rgb = C_PRIMARY
        ind.line.fill.background()

        tf = s7.shapes.add_textbox(x + Inches(0.18), y - Inches(0.05), Inches(5.4), Inches(1.9)).text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_FAMILY
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_TITLE

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11)
        p.font.color.rgb = C_BODY

    # =========================================================================
    # SLIDE 8: Healthcare Ecosystem Impact (Clean 4-Column Layout)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    apply_natural_header(s8, "Value Creation", "Multi-Sided Healthcare Economic Impact", "Creating tangible value for patients, clinicians, medical researchers, and insurance providers.")

    stakeholders = [
        ("Patients", "Complete data sovereignty, zero corporate exploitation, and seamless portable access across medical facilities."),
        ("Clinicians", "Instant verified medical histories, zero diagnostic redundancy, and reduced malpractice liability."),
        ("Researchers", "Opt-in Compute-to-Data research pools with automated cryptographic patient micro-rewards."),
        ("Insurers", "Tamper-proof smart contract claims verification, eliminating fraudulent billing and administrative overhead."),
    ]

    for idx, (title, desc) in enumerate(stakeholders):
        x = Inches(0.9 + idx * 2.95)

        # Top line
        top_l = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(1.85), Inches(2.6), Inches(0.03))
        top_l.fill.solid()
        top_l.fill.fore_color.rgb = C_PRIMARY
        top_l.line.fill.background()

        tf = s8.shapes.add_textbox(x, Inches(1.95), Inches(2.6), Inches(4.5)).text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_FAMILY
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = C_TITLE

        p = tf.add_paragraph()
        p.text = f"\n{desc}"
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_BODY

    # =========================================================================
    # SLIDE 9: System Modules & Walkthrough
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    apply_natural_header(s9, "System Demonstration", "Functional Prototype Modules & Architecture", "Full-stack role-based architecture operating live on localhost with MetaMask.")

    modules = [
        ("Patient Health Vault", "Client-side AES-256 file encryption, IPFS pinning via Pinata, and toggleable doctor access control matrix."),
        ("Practitioner Portal", "Authorized patient EHR lookup, verified clinical diagnostic report uploads, and digital prescription issuance."),
        ("Hospital Governance", "Practitioner license verification, smart contract telemetry, and HIPAA audit trail log exports."),
        ("Web3 Wallet Layer", "Direct MetaMask provider integration alongside off-chain fallback simulation modes for zero-friction evaluation."),
    ]

    for idx, (title, desc) in enumerate(modules):
        col = idx % 2
        row = idx // 2
        x = Inches(0.9 + col * 5.9)
        y = Inches(1.85 + row * 2.35)

        ind = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, Inches(0.04), Inches(1.8))
        ind.fill.solid()
        ind.fill.fore_color.rgb = C_PRIMARY
        ind.line.fill.background()

        tf = s9.shapes.add_textbox(x + Inches(0.18), y - Inches(0.05), Inches(5.4), Inches(1.9)).text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_FAMILY
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_TITLE

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_FAMILY
        p.font.size = Pt(11)
        p.font.color.rgb = C_BODY

    # =========================================================================
    # SLIDE 10: Conclusion & Academic Defense (Natural Closure)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    bg10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = C_WHITE
    bg10.line.fill.background()

    # Left Stripe
    stripe10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.25), Inches(7.5))
    stripe10.fill.solid()
    stripe10.fill.fore_color.rgb = C_PRIMARY
    stripe10.line.fill.background()

    # Conclusion Tag
    tf10_tag = s10.shapes.add_textbox(Inches(1.1), Inches(0.9), Inches(10.5), Inches(0.3)).text_frame
    p = tf10_tag.paragraphs[0]
    p.text = "CONCLUSION & PROJECT DEFENSE"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY_D

    # Headline
    tf10_h = s10.shapes.add_textbox(Inches(1.1), Inches(1.3), Inches(10.5), Inches(2.0)).text_frame
    tf10_h.word_wrap = True

    p = tf10_h.paragraphs[0]
    p.text = "CareChain: Redefining Sovereign Healthcare"
    p.font.name = FONT_FAMILY
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = C_TITLE

    p = tf10_h.add_paragraph()
    p.text = "CareChain delivers a verified, production-grade protocol for patient-governed electronic health records. Validated with 100% automated test coverage, zero-trust cryptographic security, and mapped against UN SDGs and TRL progression."
    p.font.name = FONT_FAMILY
    p.font.size = Pt(12.5)
    p.font.color.rgb = C_MUTED

    div10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.1), Inches(3.6), Inches(11.0), Inches(0.01))
    div10.fill.solid()
    div10.fill.fore_color.rgb = C_BORDER
    div10.line.fill.background()

    # Summary Grid
    summary_items = [
        ("Candidate Name", "Ashish Anil Sikaria (23BCI0218)"),
        ("Course & Semester", "BCSE497J (Project - I) • Fall Semester 2026-27"),
        ("Faculty Guide", "Prof. SELVI M (Emp ID: 16106, Associate Professor Grade 2)"),
        ("Academic Department", "SCOPE (School of Computer Science and Engineering)"),
        ("Maturity Level", "TRL 6 (Demonstrated Prototype in Relevant Environment)"),
        ("Global Impact", "UN SDGs 3.8, 9.5, 10.2, 16.6"),
    ]

    for idx, (lbl, val) in enumerate(summary_items):
        col = idx % 2
        row = idx // 2
        x = Inches(1.1 + col * 5.7)
        y = Inches(3.85 + row * 0.95)

        tf_s = s10.shapes.add_textbox(x, y, Inches(5.3), Inches(0.85)).text_frame
        tf_s.word_wrap = True

        p = tf_s.paragraphs[0]
        p.text = lbl.upper()
        p.font.name = FONT_FAMILY
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = C_MUTED

        p = tf_s.add_paragraph()
        p.text = val
        p.font.name = FONT_FAMILY
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = C_TITLE if idx != 4 else C_EMERALD

    # Save presentation
    out_dir = os.path.join(os.path.dirname(__file__), "../docs/presentation")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "CareChain_Presentation.pptx")
    prs.save(out_path)
    print(f"[SUCCESS] Natural, Human-Crafted Presentation Saved to: {out_path}")

if __name__ == "__main__":
    build_natural_presentation()
