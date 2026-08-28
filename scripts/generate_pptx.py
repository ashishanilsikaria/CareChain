import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    
    # Standard 16:9 Widescreen HD (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    blank_slide_layout = prs.slide_layouts[6] # Blank slide

    # Theme Colors (Modern Light Healthcare)
    COLOR_BG = RGBColor(248, 250, 252)        # #F8FAFC
    COLOR_CARD = RGBColor(255, 255, 255)      # #FFFFFF
    COLOR_BORDER = RGBColor(226, 232, 240)    # #E2E8F0
    COLOR_PRIMARY = RGBColor(2, 132, 199)     # #0284C7
    COLOR_PRIMARY_DARK = RGBColor(3, 105, 161)# #0369A1
    COLOR_NAVY = RGBColor(15, 23, 42)         # #0F172A
    COLOR_TEXT_BODY = RGBColor(51, 65, 85)    # #334155
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)# #64748B
    
    COLOR_SKY_BG = RGBColor(240, 249, 255)    # #F0F9FF
    COLOR_EMERALD = RGBColor(5, 150, 105)     # #059669
    COLOR_EMERALD_BG = RGBColor(236, 253, 245)# #ECFDF5
    COLOR_PURPLE = RGBColor(99, 102, 241)     # #6366F1
    COLOR_PURPLE_BG = RGBColor(238, 242, 255) # #EEF2FF
    COLOR_AMBER = RGBColor(217, 119, 6)       # #D97706
    COLOR_AMBER_BG = RGBColor(255, 251, 235)  # #FFFBEB
    COLOR_ROSE = RGBColor(225, 29, 72)        # #E11D48
    COLOR_ROSE_BG = RGBColor(255, 241, 242)   # #FFF1F2

    def apply_base_slide(slide, category_text="CareChain • BCSE497J Project - I"):
        # Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.fill.background()

        # Top Accent Line
        top_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.66), Inches(0.35), Inches(12.0), Inches(0.03))
        top_line.fill.solid()
        top_line.fill.fore_color.rgb = COLOR_PRIMARY
        top_line.line.fill.background()

        # Category Pill
        tf_cat = slide.shapes.add_textbox(Inches(0.66), Inches(0.42), Inches(8.0), Inches(0.28)).text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.name = "Calibri"
        p_cat.font.size = Pt(9.5)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_PRIMARY_DARK

        # Sub-header divider
        div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.66), Inches(0.72), Inches(12.0), Inches(0.01))
        div.fill.solid()
        div.fill.fore_color.rgb = COLOR_BORDER
        div.line.fill.background()

        # Footer divider
        fdiv = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.66), Inches(6.85), Inches(12.0), Inches(0.01))
        fdiv.fill.solid()
        fdiv.fill.fore_color.rgb = COLOR_BORDER
        fdiv.line.fill.background()

        # Footer Left
        tf_fl = slide.shapes.add_textbox(Inches(0.66), Inches(6.92), Inches(7.5), Inches(0.3)).text_frame
        p_fl = tf_fl.paragraphs[0]
        p_fl.text = "Ashish Anil Sikaria (23BCI0218) • Faculty Guide: Prof. SELVI M • SCOPE"
        p_fl.font.name = "Calibri"
        p_fl.font.size = Pt(9)
        p_fl.font.color.rgb = COLOR_TEXT_MUTED

        # Footer Right
        tf_fr = slide.shapes.add_textbox(Inches(8.5), Inches(6.92), Inches(4.16), Inches(0.3)).text_frame
        p_fr = tf_fr.paragraphs[0]
        p_fr.alignment = PP_ALIGN.RIGHT
        p_fr.text = "Fall Semester 2026-27"
        p_fr.font.name = "Calibri"
        p_fr.font.size = Pt(9)
        p_fr.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 1: Title & Academic Profile
    # ==========================================
    s1 = prs.slides.add_slide(blank_slide_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_BG
    bg1.line.fill.background()

    card1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.66), Inches(0.5), Inches(12.0), Inches(6.4))
    card1.fill.solid()
    card1.fill.fore_color.rgb = COLOR_CARD
    card1.line.color.rgb = COLOR_BORDER
    card1.line.width = Pt(1.5)

    pill1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.66), Inches(0.75), Inches(6.0), Inches(0.35))
    pill1.fill.solid()
    pill1.fill.fore_color.rgb = COLOR_SKY_BG
    pill1.line.color.rgb = COLOR_PRIMARY
    pill1.line.width = Pt(1)
    tf_p1 = pill1.text_frame
    p_p1 = tf_p1.paragraphs[0]
    p_p1.alignment = PP_ALIGN.CENTER
    p_p1.text = "FALL SEMESTER 2026-27  •  BCSE497J - PROJECT - I"
    p_p1.font.name = "Calibri"
    p_p1.font.size = Pt(10)
    p_p1.font.bold = True
    p_p1.font.color.rgb = COLOR_PRIMARY_DARK

    tf_t1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.33), Inches(0.85)).text_frame
    p_t1 = tf_t1.paragraphs[0]
    p_t1.alignment = PP_ALIGN.CENTER
    p_t1.text = "CareChain"
    p_t1.font.name = "Calibri"
    p_t1.font.size = Pt(40)
    p_t1.font.bold = True
    p_t1.font.color.rgb = COLOR_NAVY

    tf_sub1 = s1.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(11.33), Inches(0.38)).text_frame
    p_sub1 = tf_sub1.paragraphs[0]
    p_sub1.alignment = PP_ALIGN.CENTER
    p_sub1.text = "Decentralized, Patient-Centric Electronic Health Record (EHR) Protocol"
    p_sub1.font.name = "Calibri"
    p_sub1.font.size = Pt(16)
    p_sub1.font.bold = True
    p_sub1.font.color.rgb = COLOR_PRIMARY_DARK

    tf_desc1 = s1.shapes.add_textbox(Inches(1.5), Inches(2.45), Inches(10.33), Inches(0.45)).text_frame
    p_desc1 = tf_desc1.paragraphs[0]
    p_desc1.alignment = PP_ALIGN.CENTER
    p_desc1.text = "Empowering patient data ownership through Ethereum Smart Contracts, AES-256 Client-Side Encryption, and Decentralized IPFS Storage."
    p_desc1.font.name = "Calibri"
    p_desc1.font.size = Pt(11.5)
    p_desc1.font.color.rgb = COLOR_TEXT_MUTED

    # Student Card (Left)
    scard = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.4), Inches(3.1), Inches(5.0), Inches(2.9))
    scard.fill.solid()
    scard.fill.fore_color.rgb = COLOR_SKY_BG
    scard.line.color.rgb = RGBColor(186, 230, 253)
    scard.line.width = Pt(1.2)
    tf_sc = scard.text_frame
    tf_sc.word_wrap = True
    
    p = tf_sc.paragraphs[0]
    p.text = "SUBMITTED BY"
    p.font.name = "Calibri"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY_DARK

    p = tf_sc.add_paragraph()
    p.text = "Ashish Anil Sikaria"
    p.font.name = "Calibri"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    p = tf_sc.add_paragraph()
    p.text = "Register No: 23BCI0218\nProgramme: B.Tech Computer Science & Engineering\nSchool: SCOPE (School of Computer Science & Engineering)"
    p.font.name = "Calibri"
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_TEXT_BODY

    # Faculty Guide Card (Right)
    gcard = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.93), Inches(3.1), Inches(5.0), Inches(2.9))
    gcard.fill.solid()
    gcard.fill.fore_color.rgb = COLOR_PURPLE_BG
    gcard.line.color.rgb = RGBColor(199, 210, 254)
    gcard.line.width = Pt(1.2)
    tf_gc = gcard.text_frame
    tf_gc.word_wrap = True

    p = tf_gc.paragraphs[0]
    p.text = "UNDER THE GUIDANCE OF"
    p.font.name = "Calibri"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = COLOR_PURPLE

    p = tf_gc.add_paragraph()
    p.text = "Prof. SELVI M"
    p.font.name = "Calibri"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    p = tf_gc.add_paragraph()
    p.text = "Designation: Associate Professor Grade 2\nEmployee ID: 16106\nSchool: SCOPE (School of Computer Science & Engineering)\nStatus: Registered & Approved by Guide"
    p.font.name = "Calibri"
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_TEXT_BODY

    # ==========================================
    # SLIDE 2: Academic & Institutional Profile
    # ==========================================
    s2 = prs.slides.add_slide(blank_slide_layout)
    apply_base_slide(s2, "Academic Framework • BCSE497J Project Profile")

    tf2 = s2.shapes.add_textbox(Inches(0.66), Inches(0.8), Inches(12.0), Inches(0.45)).text_frame
    p2 = tf2.paragraphs[0]
    p2.text = "Academic Registration & Governance"
    p2.font.name = "Calibri"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_NAVY

    metadata_items = [
        ("PROJECT TITLE", "CareChain", COLOR_PRIMARY_DARK, COLOR_SKY_BG),
        ("COURSE CODE & NAME", "BCSE497J - Project - I", COLOR_NAVY, COLOR_CARD),
        ("ACADEMIC SEMESTER", "Fall Semester 2026-27", COLOR_NAVY, COLOR_CARD),
        ("COURSE OPTION / DURATION", "Regular • 6 ( Months )", COLOR_PRIMARY_DARK, COLOR_SKY_BG),
        ("PROJECT OPTION", "General", COLOR_NAVY, COLOR_CARD),
        ("REGISTRATION STATUS", "Approved by Guide", COLOR_EMERALD, COLOR_EMERALD_BG),
        ("STUDENT NAME", "Ashish Anil Sikaria", COLOR_NAVY, COLOR_CARD),
        ("REGISTER NUMBER", "23BCI0218", COLOR_PRIMARY_DARK, COLOR_SKY_BG),
        ("FACULTY GUIDE", "Prof. SELVI M (Emp ID: 16106)", COLOR_PURPLE, COLOR_PURPLE_BG),
    ]

    for idx, (label, val, text_col, bg_col) in enumerate(metadata_items):
        col = idx % 3
        row = idx // 3
        x = Inches(0.66 + col * 4.1)
        y = Inches(1.35 + row * 1.5)

        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.8), Inches(1.3))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1.2)
        
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = label
        p.font.name = "Calibri"
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_MUTED

        p = tf.add_paragraph()
        p.text = val
        p.font.name = "Calibri"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = text_col

    sb = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.66), Inches(5.95), Inches(12.0), Inches(0.55))
    sb.fill.solid()
    sb.fill.fore_color.rgb = COLOR_EMERALD_BG
    sb.line.color.rgb = RGBColor(110, 231, 183)
    sb.line.width = Pt(1)
    tf_sb = sb.text_frame
    p_sb = tf_sb.paragraphs[0]
    p_sb.alignment = PP_ALIGN.CENTER
    p_sb.text = "STATUS: Project registered and approved by faculty guide in SCOPE."
    p_sb.font.name = "Calibri"
    p_sb.font.size = Pt(11)
    p_sb.font.bold = True
    p_sb.font.color.rgb = COLOR_EMERALD

    # ==========================================
    # SLIDE 3: Problem Statement
    # ==========================================
    s3 = prs.slides.add_slide(blank_slide_layout)
    apply_base_slide(s3, "Healthcare Industry Problem Statement")

    tf3 = s3.shapes.add_textbox(Inches(0.66), Inches(0.8), Inches(12.0), Inches(0.45)).text_frame
    p3 = tf3.paragraphs[0]
    p3.text = "The Crisis of Centralized Electronic Health Records"
    p3.font.name = "Calibri"
    p3.font.size = Pt(22)
    p3.font.bold = True
    p3.font.color.rgb = COLOR_NAVY

    problems = [
        ("01", "Centralized Honeypots & Breaches", "Over 133M+ medical records breached in 2023–2025 alone. Centralized hospital databases remain high-value targets for ransomware attacks and unauthorized extraction.", COLOR_ROSE, COLOR_ROSE_BG, RGBColor(254, 205, 211)),
        ("02", "Zero Patient Sovereignty", "Patients have no direct ownership or visibility into who accesses, shares, or commercializes their sensitive diagnostic records among insurance brokers.", COLOR_AMBER, COLOR_AMBER_BG, RGBColor(253, 230, 138)),
        ("03", "Fragmented Data Silos", "Incompatible hospital software systems create life-threatening information blind spots during emergency trauma care, resulting in delayed treatments and duplicate testing.", COLOR_PRIMARY_DARK, COLOR_SKY_BG, RGBColor(186, 230, 253)),
        ("04", "Lack of Tamper-Evident Audits", "Legacy systems lack cryptographic non-repudiation, permitting unauthorized retrospective alterations of diagnostic records and untraceable access logs.", COLOR_PURPLE, COLOR_PURPLE_BG, RGBColor(221, 214, 254)),
    ]

    for idx, (num, title, desc, acc, bg_col, bdr_col) in enumerate(problems):
        col = idx % 2
        row = idx // 2
        x = Inches(0.66 + col * 6.15)
        y = Inches(1.35 + row * 2.55)

        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.85), Inches(2.35))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{num}  {title}"
        p.font.name = "Calibri"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_BODY

    # ==========================================
    # SLIDE 4: The CareChain Solution
    # ==========================================
    s4 = prs.slides.add_slide(blank_slide_layout)
    apply_base_slide(s4, "Zero-Trust Architecture & Technical Solution")

    tf4 = s4.shapes.add_textbox(Inches(0.66), Inches(0.8), Inches(12.0), Inches(0.45)).text_frame
    p4 = tf4.paragraphs[0]
    p4.text = "The CareChain Solution: Hybrid Web2/Web3 Protocol"
    p4.font.name = "Calibri"
    p4.font.size = Pt(22)
    p4.font.bold = True
    p4.font.color.rgb = COLOR_NAVY

    pillars = [
        ("ENCRYPTION LAYER", "Client AES-256-GCM", "All health files and diagnostic reports are encrypted with unique 256-bit symmetric keys, 12-byte IVs, and 16-byte authentication tags before transmission.", COLOR_PRIMARY_DARK, COLOR_SKY_BG, RGBColor(186, 230, 253)),
        ("DECENTRALIZED STORAGE", "IPFS Distributed Pinning", "Encrypted ciphertexts are pinned across decentralized IPFS nodes, generating immutable Content Identifiers (CIDs). Zero Protected Health Information (PHI) is stored on-chain.", COLOR_PURPLE, COLOR_PURPLE_BG, RGBColor(221, 214, 254)),
        ("ACCESS CONTROL", "Smart Contract RBAC", "Solidity smart contracts enforce isolated patient access matrices (doctorPermissions[p][d]) and emit indexed events for verifiable on-chain audit trails.", COLOR_EMERALD, COLOR_EMERALD_BG, RGBColor(167, 243, 208)),
    ]

    for idx, (tag, title, desc, acc, bg_col, bdr_col) in enumerate(pillars):
        x = Inches(0.66 + idx * 4.1)
        y = Inches(1.35)

        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.8), Inches(4.3))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = tag
        p.font.name = "Calibri"
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = acc

        p = tf.add_paragraph()
        p.text = title
        p.font.name = "Calibri"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = "Calibri"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_TEXT_BODY

    sb4 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.66), Inches(5.9), Inches(12.0), Inches(0.6))
    sb4.fill.solid()
    sb4.fill.fore_color.rgb = COLOR_SKY_BG
    sb4.line.color.rgb = RGBColor(186, 230, 253)
    sb4.line.width = Pt(1)
    tf_sb4 = sb4.text_frame
    p_sb4 = tf_sb4.paragraphs[0]
    p_sb4.alignment = PP_ALIGN.CENTER
    p_sb4.text = "REGULATORY COMPLIANCE: HIPAA Security Rule (§164.312) & GDPR Article 17 Crypto-Shredding Compliant."
    p_sb4.font.name = "Calibri"
    p_sb4.font.size = Pt(10.5)
    p_sb4.font.bold = True
    p_sb4.font.color.rgb = COLOR_PRIMARY_DARK

    # ==========================================
    # SLIDE 5: UN Sustainable Development Goals (SDGs)
    # ==========================================
    s5 = prs.slides.add_slide(blank_slide_layout)
    apply_base_slide(s5, "United Nations 2030 Agenda Alignment")

    tf5 = s5.shapes.add_textbox(Inches(0.66), Inches(0.8), Inches(12.0), Inches(0.45)).text_frame
    p5 = tf5.paragraphs[0]
    p5.text = "Alignment with UN Sustainable Development Goals (SDGs)"
    p5.font.name = "Calibri"
    p5.font.size = Pt(22)
    p5.font.bold = True
    p5.font.color.rgb = COLOR_NAVY

    sdgs = [
        ("SDG 3", "TARGET 3.8", "Good Health and Well-Being", "Provides portable, tamper-proof medical records across hospital networks and cross-border consultations, reducing diagnostic errors and duplicate procedures.", COLOR_EMERALD, COLOR_EMERALD_BG, RGBColor(167, 243, 208)),
        ("SDG 9", "TARGET 9.5", "Industry, Innovation & Infrastructure", "Modernizes vulnerable legacy healthcare databases into resilient decentralized infrastructure combining cryptographic ledger security with IPFS.", COLOR_AMBER, COLOR_AMBER_BG, RGBColor(253, 230, 138)),
        ("SDG 10", "TARGET 10.2", "Reduced Inequalities", "Democratizes patient ownership over health records regardless of socioeconomic status, preventing commercial healthcare monopolies and data lock-in.", COLOR_ROSE, COLOR_ROSE_BG, RGBColor(254, 205, 211)),
        ("SDG 16", "TARGET 16.6", "Peace, Justice & Strong Institutions", "Establishes transparent, immutable on-chain audit trails for clinician licensing and diagnostic issuance, preventing healthcare malpractice fraud.", COLOR_PURPLE, COLOR_PURPLE_BG, RGBColor(221, 214, 254)),
    ]

    for idx, (badge, target, title, desc, acc, bg_col, bdr_col) in enumerate(sdgs):
        col = idx % 2
        row = idx // 2
        x = Inches(0.66 + col * 6.15)
        y = Inches(1.35 + row * 2.55)

        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.85), Inches(2.35))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{badge}  •  {target}"
        p.font.name = "Calibri"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = acc

        p = tf.add_paragraph()
        p.text = title
        p.font.name = "Calibri"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_BODY

    # ==========================================
    # SLIDE 6: Technology Readiness Level (TRL)
    # ==========================================
    s6 = prs.slides.add_slide(blank_slide_layout)
    apply_base_slide(s6, "Maturity Scorecard • NASA / Horizon Europe Framework")

    tf6 = s6.shapes.add_textbox(Inches(0.66), Inches(0.8), Inches(12.0), Inches(0.45)).text_frame
    p6 = tf6.paragraphs[0]
    p6.text = "Technology Readiness Level (TRL) Assessment"
    p6.font.name = "Calibri"
    p6.font.size = Pt(22)
    p6.font.bold = True
    p6.font.color.rgb = COLOR_NAVY

    stages = [
        ("TRL 1 - 3", "Concept Formulation", False),
        ("TRL 4 - 5", "Lab Validation", False),
        ("★ TRL 6 VERIFIED ★", "Demonstrated Prototype", True),
        ("TRL 7 - 9", "Clinical Deployment", False),
    ]

    for idx, (label, sub, active) in enumerate(stages):
        x = Inches(0.66 + idx * 3.08)
        y = Inches(1.35)

        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.85), Inches(0.95))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_SKY_BG if active else COLOR_CARD
        card.line.color.rgb = COLOR_PRIMARY if active else COLOR_BORDER
        card.line.width = Pt(2 if active else 1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = label
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_PRIMARY_DARK if active else COLOR_TEXT_MUTED

        p = tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        p.text = sub
        p.font.name = "Calibri"
        p.font.size = Pt(9)
        p.font.color.rgb = COLOR_NAVY if active else COLOR_TEXT_MUTED

    # Left: TRL 6 Verified
    c6_l = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.66), Inches(2.45), Inches(5.85), Inches(4.15))
    c6_l.fill.solid()
    c6_l.fill.fore_color.rgb = COLOR_EMERALD_BG
    c6_l.line.color.rgb = RGBColor(167, 243, 208)
    c6_l.line.width = Pt(1.2)
    tf6_l = c6_l.text_frame
    tf6_l.word_wrap = True
    p = tf6_l.paragraphs[0]
    p.text = "✓ TRL 6 VERIFIED DELIVERABLES"
    p.font.name = "Calibri"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD

    p = tf6_l.add_paragraph()
    p.text = "• Smart Contracts: MedicalRecord.sol deployed with 100% automated test coverage (11/11 Hardhat unit tests passing).\n\n• Cryptographic Gateway: Client-side AES-256-GCM symmetric buffer encryption and IPFS pinning via Pinata live.\n\n• Role-Based Portals: Web3 frontend with dedicated portals for Patients, Licensed Doctors, and Hospital Governance.\n\n• Enterprise Architecture: Monorepo with CI/CD automation, Docker orchestration, and RBAC middleware."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_TEXT_BODY

    # Right: Roadmap to TRL 9
    c6_r = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.81), Inches(2.45), Inches(5.85), Inches(4.15))
    c6_r.fill.solid()
    c6_r.fill.fore_color.rgb = COLOR_SKY_BG
    c6_r.line.color.rgb = RGBColor(186, 230, 253)
    c6_r.line.width = Pt(1.2)
    tf6_r = c6_r.text_frame
    tf6_r.word_wrap = True
    p = tf6_r.paragraphs[0]
    p.text = "➔ ROADMAP TO TRL 9 (COMMERCIAL DEPLOYMENT)"
    p.font.name = "Calibri"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY_DARK

    p = tf6_r.add_paragraph()
    p.text = "• TRL 7 (Operational Sandbox): Multi-hospital sandbox testing with HL7 FHIR structured schemas and ERC-4337 Passkey relayers.\n\n• TRL 8 (System Qualification): Formal smart contract verification by CertiK/OpenZeppelin and HIPAA/GDPR certification.\n\n• TRL 9 (Full Clinical Deployment): Production mainnet rollout across participating hospital consortiums and insurance validation nodes."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.color.rgb = COLOR_TEXT_BODY

    # ==========================================
    # SLIDE 7: Innovations
    # ==========================================
    s7 = prs.slides.add_slide(blank_slide_layout)
    apply_base_slide(s7, "Competitive Differentiators & Hard Tech")

    tf7 = s7.shapes.add_textbox(Inches(0.66), Inches(0.8), Inches(12.0), Inches(0.45)).text_frame
    p7 = tf7.paragraphs[0]
    p7.text = "Next-Generation Protocol Innovations"
    p7.font.name = "Calibri"
    p7.font.size = Pt(22)
    p7.font.bold = True
    p7.font.color.rgb = COLOR_NAVY

    innovations = [
        ("Break-Glass Emergency Protocol", "Solves the unconscious ER patient dilemma: Verified physicians trigger time-delayed cryptographic challenges or multi-guardian signatures backed by on-chain audit penalties.", COLOR_ROSE_BG, RGBColor(254, 205, 211)),
        ("Zero-Knowledge (ZK) Health Claims", "zk-SNARK circuits allow patients to prove clinical trial or insurance eligibility (e.g. HbA1c < 6.5%, age > 18) without disclosing raw medical files or identity.", COLOR_PURPLE_BG, RGBColor(221, 214, 254)),
        ("Gasless Account Abstraction (ERC-4337)", "Replaces seed phrases and gas tokens with WebAuthn Passkeys (TouchID / FaceID), sponsored by hospital Paymaster relayers.", COLOR_SKY_BG, RGBColor(186, 230, 253)),
        ("Soulbound Tokens (SBTs - ERC-5192)", "Non-transferable medical credentials minted by state medical boards. If a license is suspended, on-chain decryption permissions are instantly revoked.", COLOR_EMERALD_BG, RGBColor(167, 243, 208)),
    ]

    for idx, (title, desc, bg_col, bdr_col) in enumerate(innovations):
        col = idx % 2
        row = idx // 2
        x = Inches(0.66 + col * 6.15)
        y = Inches(1.35 + row * 2.55)

        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.85), Inches(2.35))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Calibri"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_BODY

    # ==========================================
    # SLIDE 8: Healthcare Ecosystem Impact
    # ==========================================
    s8 = prs.slides.add_slide(blank_slide_layout)
    apply_base_slide(s8, "Stakeholder Value Proposition")

    tf8 = s8.shapes.add_textbox(Inches(0.66), Inches(0.8), Inches(12.0), Inches(0.45)).text_frame
    p8 = tf8.paragraphs[0]
    p8.text = "Multi-Sided Healthcare Economic Impact"
    p8.font.name = "Calibri"
    p8.font.size = Pt(22)
    p8.font.bold = True
    p8.font.color.rgb = COLOR_NAVY

    stakeholders = [
        ("Patients", "Complete data sovereignty, zero commercial exploitation, and seamless portable access across medical facilities.", COLOR_SKY_BG, RGBColor(186, 230, 253)),
        ("Clinicians", "Instant verified medical histories, zero diagnostic redundancy, and reduced malpractice liability.", COLOR_EMERALD_BG, RGBColor(167, 243, 208)),
        ("Researchers", "Opt-in Compute-to-Data research pools with automated cryptographic patient micro-rewards.", COLOR_PURPLE_BG, RGBColor(221, 214, 254)),
        ("Insurers", "Tamper-proof smart contract claims verification, eliminating fraudulent billing and overhead.", COLOR_AMBER_BG, RGBColor(253, 230, 138)),
    ]

    for idx, (title, desc, bg_col, bdr_col) in enumerate(stakeholders):
        x = Inches(0.66 + idx * 3.08)
        y = Inches(1.35)

        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.85), Inches(5.2))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = title
        p.font.name = "Calibri"
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY

        p = tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        p.text = desc
        p.font.name = "Calibri"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_TEXT_BODY

    # ==========================================
    # SLIDE 9: Project Demonstration & Modules
    # ==========================================
    s9 = prs.slides.add_slide(blank_slide_layout)
    apply_base_slide(s9, "Demonstration & Deliverables")

    tf9 = s9.shapes.add_textbox(Inches(0.66), Inches(0.8), Inches(12.0), Inches(0.45)).text_frame
    p9 = tf9.paragraphs[0]
    p9.text = "Prototype Demonstration & System Modules"
    p9.font.name = "Calibri"
    p9.font.size = Pt(22)
    p9.font.bold = True
    p9.font.color.rgb = COLOR_NAVY

    modules = [
        ("Patient Health Vault", "Client-side AES-256 file encryption, IPFS pinning via Pinata, and toggleable doctor access control matrix.", COLOR_SKY_BG, RGBColor(186, 230, 253)),
        ("Practitioner Portal", "Authorized patient EHR lookup, verified clinical diagnostic report uploads, and digital prescription issuance.", COLOR_EMERALD_BG, RGBColor(167, 243, 208)),
        ("Hospital Governance", "Practitioner license verification, smart contract telemetry, and HIPAA audit trail log exports.", COLOR_PURPLE_BG, RGBColor(221, 214, 254)),
        ("Web3 Wallet Layer", "Direct MetaMask provider integration alongside off-chain fallback simulation modes.", COLOR_AMBER_BG, RGBColor(253, 230, 138)),
    ]

    for idx, (title, desc, bg_col, bdr_col) in enumerate(modules):
        col = idx % 2
        row = idx // 2
        x = Inches(0.66 + col * 6.15)
        y = Inches(1.35 + row * 2.55)

        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.85), Inches(2.35))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_col
        card.line.color.rgb = bdr_col
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Calibri"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY

        p = tf.add_paragraph()
        p.text = desc
        p.font.name = "Calibri"
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_TEXT_BODY

    # ==========================================
    # SLIDE 10: Conclusion & Academic Defense
    # ==========================================
    s10 = prs.slides.add_slide(blank_slide_layout)
    bg10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = COLOR_BG
    bg10.line.fill.background()

    card10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.66), Inches(0.5), Inches(12.0), Inches(6.4))
    card10.fill.solid()
    card10.fill.fore_color.rgb = COLOR_CARD
    card10.line.color.rgb = COLOR_BORDER
    card10.line.width = Pt(1.5)

    tf10_t = s10.shapes.add_textbox(Inches(1.0), Inches(0.8), Inches(11.33), Inches(0.3)).text_frame
    p10_t = tf10_t.paragraphs[0]
    p10_t.alignment = PP_ALIGN.CENTER
    p10_t.text = "CONCLUSION & ACADEMIC DEFENSE"
    p10_t.font.name = "Calibri"
    p10_t.font.size = Pt(10)
    p10_t.font.bold = True
    p10_t.font.color.rgb = COLOR_PRIMARY_DARK

    tf10_m = s10.shapes.add_textbox(Inches(1.0), Inches(1.15), Inches(11.33), Inches(0.7)).text_frame
    p10_m = tf10_m.paragraphs[0]
    p10_m.alignment = PP_ALIGN.CENTER
    p10_m.text = "CareChain: Redefining Sovereign Healthcare"
    p10_m.font.name = "Calibri"
    p10_m.font.size = Pt(30)
    p10_m.font.bold = True
    p10_m.font.color.rgb = COLOR_NAVY

    tf10_d = s10.shapes.add_textbox(Inches(1.5), Inches(1.85), Inches(10.33), Inches(0.65)).text_frame
    p10_d = tf10_d.paragraphs[0]
    p10_d.alignment = PP_ALIGN.CENTER
    p10_d.text = "CareChain delivers a verified, production-grade protocol for patient-governed electronic health records. Validated with 100% automated test coverage, zero-trust cryptographic security, and mapped against UN SDGs and TRL progression."
    p10_d.font.name = "Calibri"
    p10_d.font.size = Pt(11.5)
    p10_d.font.color.rgb = COLOR_TEXT_BODY

    # Summary Container
    scont = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.7), Inches(10.93), Inches(3.8))
    scont.fill.solid()
    scont.fill.fore_color.rgb = COLOR_SKY_BG
    scont.line.color.rgb = RGBColor(186, 230, 253)
    scont.line.width = Pt(1.2)

    summary_cards = [
        ("CANDIDATE", "Ashish Anil Sikaria (23BCI0218)", COLOR_NAVY),
        ("COURSE & SEMESTER", "BCSE497J (Project - I) • Fall 2026-27", COLOR_NAVY),
        ("FACULTY GUIDE", "Prof. SELVI M (Emp ID: 16106)", COLOR_PURPLE),
        ("SCHOOL", "SCOPE (Computer Science & Engineering)", COLOR_NAVY),
        ("READINESS LEVEL", "TRL 6 (Demonstrated Prototype)", COLOR_EMERALD),
        ("UN SDG ALIGNMENT", "SDGs 3.8, 9.5, 10.2, 16.6", COLOR_PRIMARY_DARK),
    ]

    for idx, (label, val, text_col) in enumerate(summary_cards):
        col = idx % 2
        row = idx // 2
        x = Inches(1.5 + col * 5.3)
        y = Inches(3.0 + row * 1.1)

        card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.0), Inches(0.9))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = label
        p.font.name = "Calibri"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_MUTED

        p = tf.add_paragraph()
        p.text = val
        p.font.name = "Calibri"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = text_col

    # Ensure output directory exists
    out_dir = os.path.join(os.path.dirname(__file__), "../docs/presentation")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "CareChain_Presentation.pptx")
    
    prs.save(out_path)
    print(f"[SUCCESS] Native Microsoft PowerPoint Presentation Successfully Saved to: {out_path}")

if __name__ == "__main__":
    create_presentation()
