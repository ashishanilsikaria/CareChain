import os
from pathlib import Path
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

ROOT = Path(__file__).resolve().parents[1]
REVIEW2_DIR = ROOT / "docs" / "reviews" / "Review 2"
TEMPLATE_PATH = str(REVIEW2_DIR / "4 Review 2 PPT Template.pptx")
OUTPUT_PATH = str(REVIEW2_DIR / "CareChain_Review2_Presentation.pptx")
ASSETS_DIR = str(REVIEW2_DIR / "assets")

# Academic & Project Metadata
PROGRAMME = "B.Tech. Computer Science and Engineering (Information Security)"
COURSE = "BCSE497J – Project-I"
PROJECT_TITLE = "CareChain: Decentralized Electronic Health Record Management"
PROJECT_SUBTITLE = "Patient-Centric Zero-Trust Healthcare Architecture using Blockchain & IPFS"
STUDENT_NAME = "Ashish Anil Sikaria"
REG_NO = "23BCI0218"
GUIDE_NAME = "Dr. Selvi M"
GUIDE_DESIG = "Associate Professor Grade 2, SCOPE"
PANEL_INFO = "Review 2 | Panel P071 | Venue: PRP306 | Date: 02-09-2026"
REVIEW_DATE = "02-09-2026"
SCHOOL = "SCOPE"

# Color Palette
COLOR_TITLE = RGBColor(31, 78, 121)     # Deep Navy Blue
COLOR_BODY = RGBColor(30, 41, 59)       # Slate Dark
COLOR_MUTED = RGBColor(100, 116, 139)   # Muted Gray
COLOR_PRIMARY = RGBColor(2, 132, 199)   # Sky Blue
COLOR_EMERALD = RGBColor(16, 185, 129)  # Green Accent

def clear_text(shape):
    if shape.has_text_frame:
        shape.text_frame.clear()

def format_text_box(shape, paragraphs, align=PP_ALIGN.LEFT, vertical_anchor=MSO_ANCHOR.TOP):
    """Populate text frame with custom styled paragraphs."""
    clear_text(shape)
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.08)
    tf.margin_right = Inches(0.08)
    tf.margin_top = Inches(0.05)
    tf.margin_bottom = Inches(0.05)
    tf.vertical_anchor = vertical_anchor

    for idx, item in enumerate(paragraphs):
        # item: (text, size, is_bold, color, space_after, bullet)
        text = item[0]
        size = item[1] if len(item) > 1 else 14
        bold = item[2] if len(item) > 2 else False
        color = item[3] if len(item) > 3 else (COLOR_TITLE if bold else COLOR_BODY)
        space_after = item[4] if len(item) > 4 else 4
        
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.text = text
        p.alignment = align
        p.space_after = Pt(space_after)
        p.font.name = "Calibri"
        p.font.size = Pt(size)
        p.font.bold = bold
        p.font.color.rgb = color

def update_footer(slide, slide_num):
    for shape in slide.shapes:
        if not shape.has_text_frame:
            continue
        txt = shape.text.strip()
        if txt == "22-08-2026" or txt == "21-07-2026":
            format_text_box(shape, [(REVIEW_DATE, 11, False, COLOR_MUTED, 0)], align=PP_ALIGN.LEFT)
        elif txt == "SCOPE":
            format_text_box(shape, [(SCHOOL, 11, False, COLOR_MUTED, 0)], align=PP_ALIGN.CENTER)
        elif txt == str(slide_num) or shape.name.startswith("Slide Number"):
            format_text_box(shape, [(str(slide_num), 11, False, COLOR_MUTED, 0)], align=PP_ALIGN.RIGHT)

def replace_placeholder_with_image(slide, target_shape_name, img_path):
    """Find placeholder shape by name or type, record geometry, remove and insert picture."""
    target_shape = None
    for shape in slide.shapes:
        if shape.name == target_shape_name:
            target_shape = shape
            break
        elif "Picture" in shape.name or "Content" in shape.name:
            if target_shape_name in shape.name:
                target_shape = shape
                break
    
    if target_shape:
        left = target_shape.left
        top = target_shape.top
        width = target_shape.width
        height = target_shape.height
        
        # Remove placeholder
        sp_elem = target_shape._element
        sp_elem.getparent().remove(sp_elem)
        
        # Insert replacement image
        slide.shapes.add_picture(img_path, left, top, width, height)
    else:
        # If not found, add image at standard location
        slide.shapes.add_picture(img_path, Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.7))

def build_presentation():
    prs = Presentation(TEMPLATE_PATH)
    print(f"Loaded template with {len(prs.slides)} slides.")

    # =========================================================================
    # SLIDE 1: Title Slide
    # =========================================================================
    s1 = prs.slides[0]
    # Shape 1: Title Placeholder
    for s in s1.shapes:
        if "Title" in s.name or s.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.PLACEHOLDER:
            format_text_box(s, [
                (f"{PROGRAMME}", 14, False, COLOR_MUTED, 2),
                (f"Course: {COURSE}", 15, True, COLOR_PRIMARY, 6),
                (PROJECT_TITLE, 24, True, COLOR_TITLE, 4),
                (PROJECT_SUBTITLE, 14, False, COLOR_BODY, 0),
            ], align=PP_ALIGN.CENTER, vertical_anchor=MSO_ANCHOR.MIDDLE)
            break

    # Shape 2: Student & Guide Box
    for s in s1.shapes:
        if s.name == "object 3" or (s.has_text_frame and "Team members" in s.text):
            format_text_box(s, [
                ("Candidate Details", 14, True, COLOR_PRIMARY, 2),
                (f"{STUDENT_NAME}  ({REG_NO})", 15, True, COLOR_TITLE, 8),
                ("Faculty Guide", 14, True, COLOR_PRIMARY, 2),
                (f"{GUIDE_NAME}", 15, True, COLOR_TITLE, 1),
                (f"{GUIDE_DESIG}", 13, False, COLOR_MUTED, 8),
                (PANEL_INFO, 12, True, COLOR_EMERALD, 0)
            ], align=PP_ALIGN.CENTER, vertical_anchor=MSO_ANCHOR.MIDDLE)
            break

    # =========================================================================
    # SLIDE 2: Approval Mail From Guide
    # =========================================================================
    s2 = prs.slides[1]
    # Header title
    for s in s2.shapes:
        if "Title" in s.name:
            format_text_box(s, [("Approval Mail From Faculty Guide", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
        elif "Content" in s.name:
            format_text_box(s, [
                ("Formal approval obtained from Guide Dr. Selvi M for Review-2 components (Verified on 31-08-2026):", 12, False, COLOR_BODY, 0)
            ])
    
    # Replace sample email screenshot with generated high-res guide approval
    replace_placeholder_with_image(s2, "Picture 9", os.path.join(ASSETS_DIR, "guide_approval_email.png"))
    update_footer(s2, 2)

    # =========================================================================
    # SLIDE 3: Aim & Scope
    # =========================================================================
    s3 = prs.slides[2]
    for s in s3.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Aim & Scope of the Project", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
        elif "Content" in s.name:
            format_text_box(s, [
                ("Primary Aim:", 16, True, COLOR_PRIMARY, 4),
                ("To design, develop, and validate a secure, patient-centric Electronic Health Record (EHR) management platform that eliminates centralized single points of failure by decoupling encrypted medical data storage from on-chain access governance.", 14, False, COLOR_BODY, 12),
                ("Key Architectural Scope & Deliverables:", 16, True, COLOR_PRIMARY, 4),
                ("• Client-Side Cryptography: AES-256-GCM symmetric buffer encryption preventing plaintext exposure to network intermediaries.", 13, False, COLOR_BODY, 4),
                ("• Decentralized Off-Chain Storage: IPFS Pinata cluster storing encrypted clinical payloads with immutable Content Identifiers (CIDs).", 13, False, COLOR_BODY, 4),
                ("• On-Chain Smart Contract Governance: Solidity smart contract (MedicalRecord.sol) enforcing patient-controlled access matrices (doctorPermissions) and practitioner licensing.", 13, False, COLOR_BODY, 4),
                ("• Multi-Role Web3 Portals: Dedicated responsive interfaces for Patients, Doctors, and Hospital Admins with MetaMask wallet signing.", 13, False, COLOR_BODY, 0)
            ])
    update_footer(s3, 3)

    # =========================================================================
    # SLIDE 4: Abstract
    # =========================================================================
    s4 = prs.slides[3]
    for s in s4.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Abstract", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
        elif "Content" in s.name:
            format_text_box(s, [
                ("Background & Challenge:", 15, True, COLOR_PRIMARY, 2),
                ("Centralized hospital EHR databases represent lucrative single points of failure vulnerable to ransomware, unauthorized commercial data exploitation, and catastrophic breaches (over 133M records exposed globally). Patients lack direct sovereignty and real-time auditing over who accesses or shares their sensitive diagnostic history.", 13, False, COLOR_BODY, 8),
                ("CareChain Proposed Protocol:", 15, True, COLOR_PRIMARY, 2),
                ("CareChain introduces a zero-trust, hybrid architecture combining client-side AES-256-GCM encryption, decentralized IPFS pinning, and Ethereum/Polygon smart contracts. The platform ensures zero Protected Health Information (PHI) is ever exposed on-chain while providing non-repudiable access logs.", 13, False, COLOR_BODY, 8),
                ("Review-2 Implementation Status (~75% Completed):", 15, True, COLOR_PRIMARY, 2),
                ("• MedicalRecord.sol deployed with 100% automated test coverage (11/11 Hardhat unit tests passing).\n• Client-side encryption engine and IPFS Pinata gateway operational with sub-second latency.\n• Role-based portals (Patient, Doctor, Admin) integrated with MetaMask Web3 wallet authentication.", 13, False, COLOR_BODY, 0)
            ])
    update_footer(s4, 4)

    # =========================================================================
    # SLIDE 5: Literature Review
    # =========================================================================
    s5 = prs.slides[4]
    for s in s5.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Literature Review & Benchmark Analysis", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
    
    # Remove any existing picture placeholders on slide 5 and add full-size literature table
    for s in list(s5.shapes):
        if "Picture" in s.name or "Content" in s.name:
            if s.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.PICTURE or s.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.PLACEHOLDER:
                sp_elem = s._element
                sp_elem.getparent().remove(sp_elem)
    
    s5.shapes.add_picture(os.path.join(ASSETS_DIR, "literature_comparison_table.png"), Inches(0.9), Inches(1.85), Inches(11.5), Inches(4.5))
    update_footer(s5, 5)

    # =========================================================================
    # SLIDE 6: Research Gap
    # =========================================================================
    s6 = prs.slides[5]
    for s in s6.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Identified Research Gaps & CareChain Solutions", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
        elif "Content" in s.name:
            format_text_box(s, [
                ("1. Centralized Data Custody vs. CareChain Decentralized IPFS Storage", 14, True, COLOR_PRIMARY, 2),
                ("Existing systems rely on centralized cloud repositories vulnerable to single-point breaches. CareChain decouples storage to IPFS with 46-byte cryptographic CID references.", 12.5, False, COLOR_BODY, 6),
                ("2. Static Permissions vs. Patient Sovereignty & Instant Revocation", 14, True, COLOR_PRIMARY, 2),
                ("Traditional EHRs prevent patients from dynamically granting/revoking doctor access. CareChain smart contracts execute instant on-chain permission updates.", 12.5, False, COLOR_BODY, 6),
                ("3. Prohibitive Blockchain Gas Costs vs. Hybrid Lightweight Anchoring", 14, True, COLOR_PRIMARY, 2),
                ("Storing large medical files directly on-chain is economically unfeasible. CareChain stores encrypted payloads off-chain, ensuring O(1) constant gas consumption.", 12.5, False, COLOR_BODY, 6),
                ("4. Unverified Practitioners vs. Smart Contract Doctor Licensing Registry", 14, True, COLOR_PRIMARY, 2),
                ("Academic demos frequently overlook clinician verification. CareChain integrates hospital admin governance to verify medical licenses before record access.", 12.5, False, COLOR_BODY, 0)
            ])
    update_footer(s6, 6)

    # =========================================================================
    # SLIDE 7: Objectives, SDGs & Outcomes
    # =========================================================================
    s7 = prs.slides[6]
    for s in s7.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Project Objectives, UN SDGs & Expected Outcomes", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
        elif "Content" in s.name:
            format_text_box(s, [
                ("SMART Project Objectives:", 15, True, COLOR_PRIMARY, 3),
                ("1. Develop Solidity Smart Contracts: Deploy MedicalRecord.sol for granular access control, verified practitioner registry, and tamper-proof event logging.", 13, False, COLOR_BODY, 3),
                ("2. Implement Client-Side Cryptography: Build AES-256-GCM symmetric encryption pipeline ensuring zero plaintext PHI leaves user devices.", 13, False, COLOR_BODY, 3),
                ("3. Integrate Decentralized Storage: Connect Pinata IPFS gateways for immutable, distributed file pinning with sub-2.5s retrieval latency.", 13, False, COLOR_BODY, 3),
                ("4. Deploy Role-Based Web3 Portals: Implement full-stack React 18 interfaces for Patients, Doctors, and Admins with MetaMask wallet authentication.", 13, False, COLOR_BODY, 6)
            ])
        elif s.name == "TextBox 6" or (s.has_text_frame and "Sustainable Development" in s.text):
            format_text_box(s, [
                ("Identified UN Sustainable Development Goals:", 12, True, COLOR_PRIMARY, 1),
                ("• SDG 3 (Target 3.8): Good Health & Well-being (Interoperable, tamper-proof portable medical records)\n• SDG 9 (Target 9.5): Industry, Innovation & Infrastructure (Decentralized resilient health data architecture)", 11, False, COLOR_BODY, 3),
                ("Technology Readiness Level & Targeted Outcomes:", 12, True, COLOR_PRIMARY, 1),
                ("• Maturity: TRL 6 (Working prototype demonstrated in relevant laboratory/operational environment)\n• Outcome: Scopus-indexed Conference/Journal Paper Draft, Open-Source DApp Repository, and Verified Smart Contracts", 11, False, COLOR_BODY, 0)
            ])
    update_footer(s7, 7)

    # =========================================================================
    # SLIDE 8: System Architecture
    # =========================================================================
    s8 = prs.slides[7]
    for s in s8.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("System Architecture & 4-Tier Hybrid Design", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
    
    # Replace Content placeholder with generated high-res architecture diagram
    replace_placeholder_with_image(s8, "Content Placeholder 2", os.path.join(ASSETS_DIR, "architecture_diagram.png"))
    update_footer(s8, 8)

    # =========================================================================
    # SLIDE 9: Functional & Non-Functional Requirements
    # =========================================================================
    s9 = prs.slides[8]
    for s in s9.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Functional & Non-Functional Requirements", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
        elif "Content" in s.name:
            format_text_box(s, [
                ("Functional Requirements (FRs):", 15, True, COLOR_PRIMARY, 2),
                ("• FR1: Patient Health Vault – Secure registration, encrypted medical record upload, and record categorization.\n• FR2: Dynamic Doctor Access Delegation – Granular access granting and immediate smart contract permission revocation.\n• FR3: Practitioner Clinical Portal – Authorized patient EHR lookup, decrypted document viewer, and clinical notes issuance.\n• FR4: Hospital Governance & Licensing – Verification of doctor credentials and monitoring of network telemetry.", 12.5, False, COLOR_BODY, 8),
                ("Non-Functional Requirements (NFRs):", 15, True, COLOR_PRIMARY, 2),
                ("• NFR1 (Security & Privacy): AES-256-GCM symmetric buffer encryption, 12-byte IVs, and JWT role-based middleware.\n• NFR2 (Performance & Scalability): Sub-2.5s encryption/IPFS pinning latency; O(1) constant on-chain gas scaling.\n• NFR3 (Reliability & Availability): 99.9% uptime via decentralized IPFS pinning and distributed RPC fallbacks.\n• NFR4 (Regulatory Compliance): Compliant with HIPAA Security Rule (§164.312) and GDPR Article 17 Crypto-Shredding.", 12.5, False, COLOR_BODY, 0)
            ])
    update_footer(s9, 9)

    # =========================================================================
    # SLIDE 10: Modules & Implementation Progress
    # =========================================================================
    s10 = prs.slides[9]
    for s in s10.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Modules & Implementation Progress (75% Complete)", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
        elif "Content" in s.name:
            format_text_box(s, [
                ("Module 1: Smart Contract Access Control & Registry (100% Completed)", 14, True, COLOR_PRIMARY, 2),
                ("• MedicalRecord.sol deployed on Hardhat local & Polygon Amoy testnet. Implements access matrix, doctor verification, and audit logs.\n• 11/11 automated unit tests passing covering access rejections and permission grants.", 12, False, COLOR_BODY, 6),
                ("Module 2: Cryptographic Gateway & IPFS Pinning Engine (100% Completed)", 14, True, COLOR_PRIMARY, 2),
                ("• Symmetric AES-256-GCM encryption engine (encrypt.js) and Pinata IPFS pinning gateway (pinata.js).\n• Generates tamper-proof CIDs and cryptographic authentication tags with sub-second latency.", 12, False, COLOR_BODY, 6),
                ("Module 3: Role-Based User Portals & UI/UX (85% Completed)", 14, True, COLOR_PRIMARY, 2),
                ("• React 18, React Router v6, Tailwind CSS dashboards for Patient (Vault, Sharing), Doctor (Lookup), and Admin.\n• Integrated interactive appointment scheduler, medicine tracking, and medical history views.", 12, False, COLOR_BODY, 6),
                ("Module 4: Web3 Wallet Integration & Telemetry (75% Completed)", 14, True, COLOR_PRIMARY, 2),
                ("• MetaMask provider integration via Ethers.js v6 with simulated fallback modes for evaluation.", 12, False, COLOR_BODY, 0)
            ])
    update_footer(s10, 10)

    # =========================================================================
    # SLIDE 11: Experiments and Results
    # =========================================================================
    s11 = prs.slides[10]
    for s in s11.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Experiments, Benchmarking & Demonstration", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
    
    # Replace Content placeholder on slide 11 with generated gas benchmark and latency chart
    replace_placeholder_with_image(s11, "Content Placeholder 2", os.path.join(ASSETS_DIR, "gas_benchmark_chart.png"))
    update_footer(s11, 11)

    # =========================================================================
    # SLIDE 12: Conclusion & Future Roadmap
    # =========================================================================
    s12 = prs.slides[11]
    for s in s12.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("Conclusion & Future Roadmap (Final Review)", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
        elif "Content" in s.name:
            format_text_box(s, [
                ("Review-2 Milestone Summary (~75% Completed):", 15, True, COLOR_PRIMARY, 2),
                ("• Successfully engineered and demonstrated a working hybrid decentralized EHR management platform.\n• Validated client-side AES-256-GCM encryption with off-chain IPFS pinning and on-chain Solidity access governance.\n• Proved zero on-chain Protected Health Information exposure and verified 100% automated test coverage (11/11 Hardhat tests).\n• Achieved sub-second cryptographic encryption and cost-effective smart contract execution.", 12.5, False, COLOR_BODY, 8),
                ("Roadmap for Final Review (October 2026):", 15, True, COLOR_PRIMARY, 2),
                ("1. ERC-4337 Account Abstraction: Gasless patient onboarding using WebAuthn passkeys (TouchID / FaceID) sponsored by paymasters.\n2. Break-Glass Emergency Protocol: Time-delayed multi-signature cryptographic overrides for unconscious ER trauma cases.\n3. Zero-Knowledge Claims: zk-SNARK circuits for privacy-preserving eligibility proofs (e.g., proving age/lab values without disclosing records).\n4. Manuscript Publication: Final manuscript submission to a Scopus-indexed journal/conference venue.", 12.5, False, COLOR_BODY, 0)
            ])
    update_footer(s12, 12)

    # =========================================================================
    # SLIDE 13: References
    # =========================================================================
    s13 = prs.slides[12]
    for s in s13.shapes:
        if "Title" in s.name or s.name == "object 2":
            format_text_box(s, [("References", 24, True, COLOR_TITLE, 0)], vertical_anchor=MSO_ANCHOR.MIDDLE)
            break

    for s in s13.shapes:
        if s.name == "Rectangle 3" or (s.has_text_frame and "[1]" in s.text):
            format_text_box(s, [
                ('[1] A. Azaria, A. Ekblaw, T. Vieira, and A. Lippman, "MedRec: Using blockchain for medical data access and permission management," in Proc. IEEE 2nd Int. Conf. Open & Big Data (OBD), 2016, pp. 25–30.', 11, False, COLOR_BODY, 4),
                ('[2] Q. Xia, E. B. Sifah, K. O. Asamoah, J. Gao, X. Du, and M. Guizani, "MeDShare: Trust-less medical data sharing among cloud service providers via blockchain," IEEE Access, vol. 5, pp. 14757–14767, 2017.', 11, False, COLOR_BODY, 4),
                ('[3] A. Dubovitskaya, Z. Xu, S. Ryu, M. Schumacher, and F. Wang, "Secure and trustable electronic medical records sharing using blockchain," AMIA Annu. Symp. Proc., vol. 2017, pp. 650–659, 2017.', 11, False, COLOR_BODY, 4),
                ('[4] U. Shahnaz, F. Javaid, and H. J. Al-Aboody, "Using blockchain for electronic health records," IEEE Access, vol. 7, pp. 147782–147795, 2019.', 11, False, COLOR_BODY, 4),
                ('[5] X. Yue et al., "Healthcare Data Gateways: Found Healthcare Intelligence on Blockchain with Novel Privacy Risk Control," Journal of Medical Systems, vol. 40, no. 10, art. 218, 2016.', 11, False, COLOR_BODY, 4),
                ('[6] J. Benet, "IPFS - Content Addressed, Versioned, P2P File System," arXiv preprint arXiv:1407.3561, 2014.', 11, False, COLOR_BODY, 4),
                ('[7] V. Buterin, "Ethereum white paper: A next-generation smart contract and decentralized application platform," 2014.', 11, False, COLOR_BODY, 0)
            ])
            break
    update_footer(s13, 13)

    prs.save(OUTPUT_PATH)
    print(f"Successfully generated Review 2 Presentation: {OUTPUT_PATH}")

if __name__ == "__main__":
    build_presentation()
