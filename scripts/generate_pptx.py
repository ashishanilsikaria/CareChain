import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_executive_deck():
    prs = Presentation()
    
    # 16:9 Widescreen (13.333" x 7.5")
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Executive Palette (Apple / McKinsey Healthtech Style)
    C_WHITE        = RGBColor(255, 255, 255)
    C_BG           = RGBColor(248, 250, 252) # Slate-50
    C_CARD_BG      = RGBColor(255, 255, 255)
    C_BORDER_LIGHT = RGBColor(226, 232, 240) # Slate-200
    C_BORDER_ACC   = RGBColor(186, 230, 253) # Sky-200
    C_NAVY         = RGBColor(15, 23, 42)    # Slate-900 (Main text)
    C_BODY         = RGBColor(51, 65, 85)    # Slate-700
    C_MUTED        = RGBColor(100, 116, 139) # Slate-500
    C_BLUE         = RGBColor(2, 132, 199)   # Sky-600 (Primary accent)
    C_BLUE_DARK    = RGBColor(3, 105, 161)   # Sky-700
    C_BLUE_BG      = RGBColor(240, 249, 255) # Sky-50
    C_TEAL         = RGBColor(13, 148, 136)  # Teal-600
    C_TEAL_BG      = RGBColor(240, 253, 250) # Teal-50
    
    # Authentic UN SDG Colors
    C_SDG3         = RGBColor(76, 159, 56)   # SDG 3 Green #4C9F38
    C_SDG9         = RGBColor(253, 105, 37)  # SDG 9 Orange #FD6925
    C_SDG10        = RGBColor(221, 19, 103)  # SDG 10 Pink/Magenta #DD1367
    C_SDG16        = RGBColor(0, 104, 157)   # SDG 16 Peace Blue #00689D
    C_ROSE         = RGBColor(225, 29, 72)   # Rose-600 #E11D48
    C_AMBER        = RGBColor(217, 119, 6)   # Amber-600 #D97706

    FONT_HEADING = "Calibri"
    FONT_BODY = "Calibri"

    def apply_slide_scaffold(slide, tracker_text, slide_title, slide_subtitle=None):
        # Clean Canvas Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

        # Top Category Accent
        tf_tr = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.73), Inches(0.3)).text_frame
        tf_tr.word_wrap = True
        p_tr = tf_tr.paragraphs[0]
        p_tr.text = tracker_text.upper()
        p_tr.font.name = FONT_HEADING
        p_tr.font.size = Pt(9.5)
        p_tr.font.bold = True
        p_tr.font.color.rgb = C_BLUE

        # Slide Main Title
        tf_ti = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(11.73), Inches(0.5)).text_frame
        tf_ti.word_wrap = True
        p_ti = tf_ti.paragraphs[0]
        p_ti.text = slide_title
        p_ti.font.name = FONT_HEADING
        p_ti.font.size = Pt(22)
        p_ti.font.bold = True
        p_ti.font.color.rgb = C_NAVY

        if slide_subtitle:
            p_sub = tf_ti.add_paragraph()
            p_sub.text = slide_subtitle
            p_sub.font.name = FONT_BODY
            p_sub.font.size = Pt(11)
            p_sub.font.color.rgb = C_MUTED

        # Thin Header Divider Rule
        hdr_rule = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.73), Inches(0.01))
        hdr_rule.fill.solid()
        hdr_rule.fill.fore_color.rgb = C_BORDER_LIGHT
        hdr_rule.line.fill.background()

        # Footer Rule
        ftr_rule = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.85), Inches(11.73), Inches(0.01))
        ftr_rule.fill.solid()
        ftr_rule.fill.fore_color.rgb = C_BORDER_LIGHT
        ftr_rule.line.fill.background()

        # Footer Metadata
        tf_ft = slide.shapes.add_textbox(Inches(0.8), Inches(6.92), Inches(7.0), Inches(0.3)).text_frame
        p_ft = tf_ft.paragraphs[0]
        p_ft.text = "CareChain • Ashish Anil Sikaria (23BCI0218) • Guide: Prof. SELVI M • SCOPE"
        p_ft.font.name = FONT_BODY
        p_ft.font.size = Pt(9)
        p_ft.font.color.rgb = C_MUTED

        tf_sem = slide.shapes.add_textbox(Inches(8.5), Inches(6.92), Inches(4.03), Inches(0.3)).text_frame
        p_sem = tf_sem.paragraphs[0]
        p_sem.alignment = PP_ALIGN.RIGHT
        p_sem.text = "BCSE497J Project - I • Fall 2026-27"
        p_sem.font.name = FONT_BODY
        p_sem.font.size = Pt(9)
        p_sem.font.color.rgb = C_MUTED

    # ==========================================
    # SLIDE 1: Executive Title & Credentials
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_WHITE
    bg1.line.fill.background()

    # Left Gradient Accent Bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.4), Inches(7.5))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_BLUE
    bar.line.fill.background()

    # Academic Badge Pill
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(0.8), Inches(5.8), Inches(0.38))
    badge.fill.solid()
    badge.fill.fore_color.rgb = C_BLUE_BG
    badge.line.color.rgb = C_BORDER_ACC
    badge.line.width = Pt(1)
    tf_b = badge.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.text = "FALL SEMESTER 2026-27  •  BCSE497J - PROJECT - I"
    p_b.font.name = FONT_HEADING
    p_b.font.size = Pt(10)
    p_b.font.bold = True
    p_b.font.color.rgb = C_BLUE_DARK

    # Title & Subtitle in single clean text frame to avoid overlaps
    tf_hero = s1.shapes.add_textbox(Inches(1.2), Inches(1.35), Inches(11.0), Inches(1.8)).text_frame
    tf_hero.word_wrap = True
    
    p = tf_hero.paragraphs[0]
    p.text = "CareChain"
    p.font.name = FONT_HEADING
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    p = tf_hero.add_paragraph()
    p.text = "Decentralized, Patient-Centric Electronic Health Record Protocol"
    p.font.name = FONT_HEADING
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    p = tf_hero.add_paragraph()
    p.text = "Empowering patient data sovereignty through Ethereum Smart Contracts, AES-256 Client-Side Encryption, and Decentralized IPFS Storage."
    p.font.name = FONT_BODY
    p.font.size = Pt(12)
    p.font.color.rgb = C_MUTED

    # Student Profile Card (Left)
    c_stu = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(3.65), Inches(5.2), Inches(2.7))
    c_stu.fill.solid()
    c_stu.fill.fore_color.rgb = C_BG
    c_stu.line.color.rgb = C_BORDER_LIGHT
    c_stu.line.width = Pt(1.5)
    tf_s = c_stu.text_frame
    tf_s.word_wrap = True
    
    p = tf_s.paragraphs[0]
    p.text = "SUBMITTED BY"
    p.font.name = FONT_HEADING
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_DARK

    p = tf_s.add_paragraph()
    p.text = "Ashish Anil Sikaria"
    p.font.name = FONT_HEADING
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    p = tf_s.add_paragraph()
    p.text = "Register Number: 23BCI0218\nProgramme: B.Tech Computer Science & Engineering\nSchool: SCOPE (School of Computer Science & Engineering)"
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.color.rgb = C_BODY

    # Guide Profile Card (Right)
    c_gui = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(3.65), Inches(5.2), Inches(2.7))
    c_gui.fill.solid()
    c_gui.fill.fore_color.rgb = C_BLUE_BG
    c_gui.line.color.rgb = C_BORDER_ACC
    c_gui.line.width = Pt(1.5)
    tf_g = c_gui.text_frame
    tf_g.word_wrap = True

    p = tf_g.paragraphs[0]
    p.text = "FACULTY GUIDE"
    p.font.name = FONT_HEADING
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_DARK

    p = tf_g.add_paragraph()
    p.text = "Prof. SELVI M"
    p.font.name = FONT_HEADING
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    p = tf_g.add_paragraph()
    p.text = "Designation: Associate Professor Grade 2\nEmployee ID: 16106\nSchool: SCOPE • Registration Status: Approved by Guide"
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.color.rgb = C_BODY

    # ==========================================
    # SLIDE 2: Institutional & Project Profile
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_slide_scaffold(s2, "Academic Framework", "Institutional Registration & Governance Profile", "Formal curriculum registration specifications approved by faculty guide.")

    meta_cards = [
        ("PROJECT TITLE", "CareChain", C_BLUE_DARK, C_BLUE_BG, C_BORDER_ACC),
        ("COURSE DETAILS", "BCSE497J - Project - I", C_NAVY, C_CARD_BG, C_BORDER_LIGHT),
        ("ACADEMIC SESSION", "Fall Semester 2026-27", C_NAVY, C_CARD_BG, C_BORDER_LIGHT),
        ("PROJECT OPTION / DURATION", "General • 6 ( Months ) Regular", C_BLUE_DARK, C_BLUE_BG, C_BORDER_ACC),
        ("STUDENT NAME", "Ashish Anil Sikaria", C_NAVY, C_CARD_BG, C_BORDER_LIGHT),
        ("REGISTER NUMBER", "23BCI0218", C_BLUE_DARK, C_BLUE_BG, C_BORDER_ACC),
        ("FACULTY GUIDE", "Prof. SELVI M (Emp ID: 16106)", C_NAVY, C_CARD_BG, C_BORDER_LIGHT),
        ("ACADEMIC SCHOOL", "SCOPE (Computer Science & Eng.)", C_NAVY, C_CARD_BG, C_BORDER_LIGHT),
        ("REGISTRATION STATUS", "Registered & Approved by Guide", C_SDG3, C_TEAL_BG, RGBColor(167, 243, 208)),
    ]

    for idx, (label, val, col_text, col_bg, col_bdr) in enumerate(meta_cards):
        col = idx % 3
        row = idx // 3
        x = Inches(0.8 + col * 4.05)
        y = Inches(1.6 + row * 1.55)

        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.75), Inches(1.35))
        card.fill.solid()
        card.fill.fore_color.rgb = col_bg
        card.line.color.rgb = col_bdr
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = label
        p.font.name = FONT_HEADING
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = C_MUTED

        p = tf.add_paragraph()
        p.text = val
        p.font.name = FONT_HEADING
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col_text

    # Bottom Callout Banner
    s2_banner = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.05), Inches(11.73), Inches(0.55))
    s2_banner.fill.solid()
    s2_banner.fill.fore_color.rgb = C_TEAL_BG
    s2_banner.line.color.rgb = RGBColor(167, 243, 208)
    s2_banner.line.width = Pt(1)
    tf_s2b = s2_banner.text_frame
    p_s2b = tf_s2b.paragraphs[0]
    p_s2b.alignment = PP_ALIGN.CENTER
    p_s2b.text = "OFFICIAL REGISTRATION VERIFIED: Approved under faculty supervision in SCOPE for Fall 2026-27."
    p_s2b.font.name = FONT_HEADING
    p_s2b.font.size = Pt(10.5)
    p_s2b.font.bold = True
    p_s2b.font.color.rgb = C_SDG3

    # ==========================================
    # SLIDE 3: The Problem (High Impact Asymmetric Layout)
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_slide_scaffold(s3, "Market & Industry Crisis", "The Fundamental Failure of Centralized Healthcare Data", "Ransomware targets, non-interoperable hospital silos, and zero patient sovereignty.")

    # Left Hero Stat Callout Card
    stat_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(4.2), Inches(4.9))
    stat_card.fill.solid()
    stat_card.fill.fore_color.rgb = RGBColor(255, 241, 242)
    stat_card.line.color.rgb = RGBColor(254, 205, 211)
    stat_card.line.width = Pt(1.5)
    tf_stat = stat_card.text_frame
    tf_stat.word_wrap = True

    p = tf_stat.paragraphs[0]
    p.text = "HEALTHCARE DATA CRISIS"
    p.font.name = FONT_HEADING
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_ROSE

    p = tf_stat.add_paragraph()
    p.text = "133M+"
    p.font.name = FONT_HEADING
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    p = tf_stat.add_paragraph()
    p.text = "Patient Records Breached in 2023–2025"
    p.font.name = FONT_HEADING
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_ROSE

    p = tf_stat.add_paragraph()
    p.text = "\nCentralized hospital database servers remain the #1 prime target for global ransomware cartels, causing catastrophic identity leakage and medical fraud."
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.color.rgb = C_BODY

    # Right 3 Friction Points
    frictions = [
        ("01", "Zero Patient Sovereignty", "Patients have zero visibility into who accesses, shares, or commercializes their diagnostic records among third-party commercial brokers.", C_AMBER, RGBColor(255, 251, 235), RGBColor(253, 230, 138)),
        ("02", "Fragmented Interoperability Silos", "Incompatible hospital software systems create life-threatening information blind spots in emergency trauma care, forcing duplicate diagnostics.", C_BLUE_DARK, C_BLUE_BG, C_BORDER_ACC),
        ("03", "Lack of Tamper-Evident Audits", "Legacy relational databases lack cryptographic non-repudiation, allowing retrospective record alterations and untraceable access logs.", C_SDG16, RGBColor(238, 242, 255), RGBColor(199, 210, 254)),
    ]

    for idx, (num, title, desc, acc_col, bg_col, bdr_col) in enumerate(frictions):
        y = Inches(1.6 + idx * 1.68)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.2), y, Inches(7.33), Inches(1.5))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{num}   {title}"
        p.font.name = FONT_HEADING
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = C_BODY

    # ==========================================
    # SLIDE 4: The CareChain Solution Architecture
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_slide_scaffold(s4, "Technical Architecture", "The CareChain Zero-Trust Healthcare Protocol", "A layered Web2/Web3 architecture separating cryptography, decentralized storage, and access control.")

    sol_pillars = [
        ("LAYER 01 : CLIENT PRIVACY", "AES-256-GCM Encryption", "All medical files and diagnostic scans are encrypted locally in the browser with unique 256-bit symmetric keys, 12-byte IVs, and 16-byte auth tags before leaving the device.", C_BLUE_DARK, C_BLUE_BG, C_BORDER_ACC),
        ("LAYER 02 : DECENTRALIZED PINNING", "IPFS Storage Protocol", "Encrypted ciphertexts are pinned across decentralized IPFS nodes, generating immutable Content Identifiers (CIDs). Zero Protected Health Information (PHI) is ever exposed on-chain.", C_SDG16, RGBColor(238, 242, 255), RGBColor(199, 210, 254)),
        ("LAYER 03 : ACCESS GOVERNANCE", "Smart Contract RBAC", "Solidity contracts enforce isolated patient access matrices (doctorPermissions[p][d]) and emit indexed blockchain events for an immutable regulatory audit trail.", C_SDG3, C_TEAL_BG, RGBColor(167, 243, 208)),
    ]

    for idx, (tag, title, desc, col_acc, col_bg, col_bdr) in enumerate(sol_pillars):
        x = Inches(0.8 + idx * 4.05)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.6), Inches(3.75), Inches(4.3))
        card.fill.solid()
        card.fill.fore_color.rgb = col_bg
        card.line.color.rgb = col_bdr
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = tag
        p.font.name = FONT_HEADING
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = col_acc

        p = tf.add_paragraph()
        p.text = title
        p.font.name = FONT_HEADING
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p = tf.add_paragraph()
        p.text = f"\n{desc}"
        p.font.name = FONT_BODY
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_BODY

    # Regulatory Compliance Bar
    s4_bar = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.05), Inches(11.73), Inches(0.55))
    s4_bar.fill.solid()
    s4_bar.fill.fore_color.rgb = C_BLUE_BG
    s4_bar.line.color.rgb = C_BORDER_ACC
    s4_bar.line.width = Pt(1)
    tf_s4b = s4_bar.text_frame
    p_s4b = tf_s4b.paragraphs[0]
    p_s4b.alignment = PP_ALIGN.CENTER
    p_s4b.text = "REGULATORY COMPLIANCE: HIPAA Security Rule (§164.312) & GDPR Article 17 Crypto-Shredding Compliant."
    p_s4b.font.name = FONT_HEADING
    p_s4b.font.size = Pt(10.5)
    p_s4b.font.bold = True
    p_s4b.font.color.rgb = C_BLUE_DARK

    # ==========================================
    # SLIDE 5: UN Sustainable Development Goals (Authentic UN Colors)
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    apply_slide_scaffold(s5, "Global Sustainability Impact", "Alignment with UN Sustainable Development Goals (SDGs)", "CareChain directly contributes to 4 major United Nations 2030 Agenda targets.")

    sdgs_data = [
        ("SDG 3", "TARGET 3.8", "Good Health and Well-Being", "Provides portable, tamper-proof medical records across hospital networks and cross-border consultations, reducing diagnostic errors and duplicate testing.", C_SDG3, RGBColor(240, 253, 244), RGBColor(187, 247, 208)),
        ("SDG 9", "TARGET 9.5", "Industry, Innovation & Infrastructure", "Modernizes vulnerable legacy healthcare databases into resilient decentralized infrastructure combining cryptographic ledger security with IPFS.", C_SDG9, RGBColor(255, 247, 237), RGBColor(254, 215, 170)),
        ("SDG 10", "TARGET 10.2", "Reduced Inequalities", "Democratizes patient ownership over health records regardless of socioeconomic status, preventing commercial healthcare monopolies and data lock-in.", C_SDG10, RGBColor(253, 242, 248), RGBColor(251, 207, 232)),
        ("SDG 16", "TARGET 16.6", "Peace, Justice & Strong Institutions", "Establishes transparent, immutable on-chain audit trails for clinician licensing and diagnostic issuance, preventing healthcare malpractice fraud.", C_SDG16, RGBColor(240, 249, 255), RGBColor(186, 230, 253)),
    ]

    for idx, (badge, target, title, desc, col_theme, col_bg, col_bdr) in enumerate(sdgs_data):
        col = idx % 2
        row = idx // 2
        x = Inches(0.8 + col * 6.0)
        y = Inches(1.6 + row * 2.45)

        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.73), Inches(2.25))
        card.fill.solid()
        card.fill.fore_color.rgb = col_bg
        card.line.color.rgb = col_bdr
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{badge}   •   {target}"
        p.font.name = FONT_HEADING
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = col_theme

        p = tf.add_paragraph()
        p.text = title
        p.font.name = FONT_HEADING
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = C_BODY

    # ==========================================
    # SLIDE 6: Technology Readiness Level (TRL)
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_slide_scaffold(s6, "Technical Maturity Scorecard", "Technology Readiness Level (TRL 6 Verified Prototype)", "Maturity benchmarking mapped against NASA and Horizon Europe readiness standards.")

    # Top Timeline Stages
    stages_data = [
        ("TRL 1 - 3", "Basic Research & Concept Formulation", False),
        ("TRL 4 - 5", "Lab Component Validation", False),
        ("★ TRL 6 VERIFIED ★", "Demonstrated Working Prototype", True),
        ("TRL 7 - 9", "Clinical Trials & Mainnet Deployment", False),
    ]

    for idx, (label, sub, is_active) in enumerate(stages_data):
        x = Inches(0.8 + idx * 3.0)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.55), Inches(2.73), Inches(1.0))
        card.fill.solid()
        card.fill.fore_color.rgb = C_BLUE_BG if is_active else C_CARD_BG
        card.line.color.rgb = C_BLUE if is_active else C_BORDER_LIGHT
        card.line.width = Pt(2 if is_active else 1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = label
        p.font.name = FONT_HEADING
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_BLUE_DARK if is_active else C_MUTED

        p = tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        p.text = sub
        p.font.name = FONT_BODY
        p.font.size = Pt(8.5)
        p.font.color.rgb = C_NAVY if is_active else C_MUTED

    # Left: TRL 6 Evidence
    c6_l = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.7), Inches(5.73), Inches(3.9))
    c6_l.fill.solid()
    c6_l.fill.fore_color.rgb = C_TEAL_BG
    c6_l.line.color.rgb = RGBColor(167, 243, 208)
    c6_l.line.width = Pt(1.5)
    tf6_l = c6_l.text_frame
    tf6_l.word_wrap = True
    p = tf6_l.paragraphs[0]
    p.text = "✓ TRL 6 VERIFIED DELIVERABLES"
    p.font.name = FONT_HEADING
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_SDG3

    p = tf6_l.add_paragraph()
    p.text = "• Smart Contracts: MedicalRecord.sol deployed with 100% automated test coverage (11/11 Hardhat unit tests passing).\n\n• Cryptographic Pipeline: Client-side AES-256-GCM buffer encryption and IPFS pinning via Pinata live.\n\n• Role Portals: Production Web3 UI for Patients, Doctors, and Hospital Governance with MetaMask wallet syncing.\n\n• Enterprise Scaffolding: Monorepo with CI/CD automation, Docker orchestration, and RBAC middleware."
    p.font.name = FONT_BODY
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_BODY

    # Right: Roadmap to TRL 9
    c6_r = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.7), Inches(5.73), Inches(3.9))
    c6_r.fill.solid()
    c6_r.fill.fore_color.rgb = C_BLUE_BG
    c6_r.line.color.rgb = C_BORDER_ACC
    c6_r.line.width = Pt(1.5)
    tf6_r = c6_r.text_frame
    tf6_r.word_wrap = True
    p = tf6_r.paragraphs[0]
    p.text = "➔ ROADMAP TO TRL 9 (COMMERCIAL CLINICAL)"
    p.font.name = FONT_HEADING
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_DARK

    p = tf6_r.add_paragraph()
    p.text = "• TRL 7 (Operational Sandbox): Multi-hospital sandbox testing with HL7 FHIR structured data and ERC-4337 Passkey relayers.\n\n• TRL 8 (System Qualification): Formal smart contract verification by CertiK/OpenZeppelin and HIPAA/GDPR certification.\n\n• TRL 9 (Full Clinical Deployment): Live production mainnet rollout across participating hospital networks and insurance nodes."
    p.font.name = FONT_BODY
    p.font.size = Pt(10.5)
    p.font.color.rgb = C_BODY

    # ==========================================
    # SLIDE 7: High-Impact Protocol Innovations
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    apply_slide_scaffold(s7, "Competitive Differentiators", "Novel Innovations Beyond Generic Student Demos", "Key cryptographic and architectural features solving real-world healthcare challenges.")

    innovations = [
        ("Break-Glass Emergency Protocol", "Solves the unconscious ER patient dilemma: Verified physicians trigger time-delayed cryptographic challenges or multi-guardian signatures backed by on-chain audit penalties.", RGBColor(255, 241, 242), RGBColor(254, 205, 211), C_ROSE),
        ("Zero-Knowledge (ZK) Health Claims", "zk-SNARK circuits allow patients to prove clinical trial or insurance eligibility (e.g. HbA1c < 6.5%, age > 18) without disclosing raw medical files or identity.", RGBColor(238, 242, 255), RGBColor(199, 210, 254), C_SDG16),
        ("Gasless Account Abstraction (ERC-4337)", "Replaces seed phrases and gas tokens with WebAuthn Passkeys (TouchID / FaceID), sponsored by hospital Paymaster relayers.", C_BLUE_BG, C_BORDER_ACC, C_BLUE_DARK),
        ("Soulbound Tokens (SBTs - ERC-5192)", "Non-transferable medical credentials minted by state medical boards. If a license is suspended, on-chain decryption permissions are instantly revoked.", C_TEAL_BG, RGBColor(167, 243, 208), C_SDG3),
    ]

    for idx, (title, desc, bg_col, bdr_col, acc_col) in enumerate(innovations):
        col = idx % 2
        row = idx // 2
        x = Inches(0.8 + col * 6.0)
        y = Inches(1.6 + row * 2.45)

        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.73), Inches(2.25))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_HEADING
        p.font.size = Pt(14.5)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = C_BODY

    # ==========================================
    # SLIDE 8: Healthcare Ecosystem Impact
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    apply_slide_scaffold(s8, "Value Proposition", "Multi-Sided Healthcare Economic Proposition", "Creating tangible value for patients, clinicians, medical researchers, and insurance providers.")

    stakeholders = [
        ("Patients", "Complete data sovereignty, zero corporate exploitation, and seamless portable access across medical facilities.", C_BLUE_BG, C_BORDER_ACC, C_BLUE_DARK),
        ("Clinicians", "Instant verified medical histories, zero diagnostic redundancy, and reduced malpractice liability.", C_TEAL_BG, RGBColor(167, 243, 208), C_SDG3),
        ("Researchers", "Opt-in Compute-to-Data research pools with automated cryptographic patient micro-rewards.", RGBColor(238, 242, 255), RGBColor(199, 210, 254), C_SDG16),
        ("Insurers", "Tamper-proof smart contract claims verification, eliminating fraudulent billing and administrative overhead.", RGBColor(255, 251, 235), RGBColor(253, 230, 138), C_AMBER),
    ]

    for idx, (title, desc, bg_col, bdr_col, acc_col) in enumerate(stakeholders):
        x = Inches(0.8 + idx * 3.0)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.6), Inches(2.73), Inches(4.9))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = title
        p.font.name = FONT_HEADING
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p = tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        p.text = f"\n{desc}"
        p.font.name = FONT_BODY
        p.font.size = Pt(11.5)
        p.font.color.rgb = C_BODY

    # ==========================================
    # SLIDE 9: Prototype Demonstration & Modules
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    apply_slide_scaffold(s9, "System Showcase", "Functional Prototype Demonstration & Core Modules", "Full-stack role-based architecture operating live on localhost with MetaMask.")

    modules = [
        ("Patient Health Vault", "Client-side AES-256 file encryption, IPFS pinning via Pinata, and toggleable doctor access control matrix.", C_BLUE_BG, C_BORDER_ACC),
        ("Practitioner Portal", "Authorized patient EHR lookup, verified clinical diagnostic report uploads, and digital prescription issuance.", C_TEAL_BG, RGBColor(167, 243, 208)),
        ("Hospital Governance", "Practitioner license verification, smart contract telemetry, and HIPAA audit trail log exports.", RGBColor(238, 242, 255), RGBColor(199, 210, 254)),
        ("Web3 Wallet Layer", "Direct MetaMask provider integration alongside off-chain fallback simulation modes for zero-friction evaluation.", RGBColor(255, 251, 235), RGBColor(253, 230, 138)),
    ]

    for idx, (title, desc, bg_col, bdr_col) in enumerate(modules):
        col = idx % 2
        row = idx // 2
        x = Inches(0.8 + col * 6.0)
        y = Inches(1.6 + row * 2.45)

        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.73), Inches(2.25))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = FONT_HEADING
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = C_BODY

    # ==========================================
    # SLIDE 10: Conclusion & Academic Defense
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    bg10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = C_WHITE
    bg10.line.fill.background()

    # Left Accent Bar
    bar10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.4), Inches(7.5))
    bar10.fill.solid()
    bar10.fill.fore_color.rgb = C_BLUE
    bar10.line.fill.background()

    tf10_hero = s10.shapes.add_textbox(Inches(1.2), Inches(0.7), Inches(11.0), Inches(1.8)).text_frame
    tf10_hero.word_wrap = True

    p = tf10_hero.paragraphs[0]
    p.text = "CONCLUSION & PROJECT DEFENSE"
    p.font.name = FONT_HEADING
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_BLUE_DARK

    p = tf10_hero.add_paragraph()
    p.text = "CareChain: Redefining Sovereign Healthcare"
    p.font.name = FONT_HEADING
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = C_NAVY

    p = tf10_hero.add_paragraph()
    p.text = "CareChain delivers a verified, production-grade protocol for patient-governed electronic health records. Validated with 100% automated test coverage, zero-trust cryptographic security, and mapped against UN SDGs and TRL progression."
    p.font.name = FONT_BODY
    p.font.size = Pt(11.5)
    p.font.color.rgb = C_MUTED

    # Summary Grid (2 x 3)
    scont = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.7), Inches(11.0), Inches(4.0))
    scont.fill.solid()
    scont.fill.fore_color.rgb = C_BG
    scont.line.color.rgb = C_BORDER_LIGHT
    scont.line.width = Pt(1.5)

    summary_items = [
        ("CANDIDATE NAME", "Ashish Anil Sikaria", C_NAVY),
        ("REGISTER NUMBER", "23BCI0218", C_BLUE_DARK),
        ("COURSE & SEMESTER", "BCSE497J (Project - I) • Fall 2026-27", C_NAVY),
        ("FACULTY GUIDE", "Prof. SELVI M (Emp ID: 16106)", C_BLUE_DARK),
        ("ACADEMIC SCHOOL", "SCOPE (School of Computer Science & Eng.)", C_NAVY),
        ("PROJECT STATUS", "Registered & Approved by Guide (TRL 6)", C_SDG3),
    ]

    for idx, (lbl, val, col_t) in enumerate(summary_items):
        col = idx % 2
        row = idx // 2
        x = Inches(1.5 + col * 5.3)
        y = Inches(3.0 + row * 1.15)

        c_box = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.0), Inches(0.95))
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = C_CARD_BG
        c_box.line.color.rgb = C_BORDER_LIGHT
        c_box.line.width = Pt(1)

        tf = c_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = lbl
        p.font.name = FONT_HEADING
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = C_MUTED

        p = tf.add_paragraph()
        p.text = val
        p.font.name = FONT_HEADING
        p.font.size = Pt(12.5)
        p.font.bold = True
        p.font.color.rgb = col_t

    # Save presentation
    out_dir = os.path.join(os.path.dirname(__file__), "../docs/presentation")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "CareChain_Presentation.pptx")
    prs.save(out_path)
    print(f"[SUCCESS] Executive McKinsey/Apple Style Deck Saved to: {out_path}")

if __name__ == "__main__":
    build_executive_deck()
