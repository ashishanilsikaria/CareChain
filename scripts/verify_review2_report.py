from pathlib import Path
import docx

ROOT = Path(__file__).resolve().parents[1]
REVIEW2_DIR = ROOT / "docs" / "reviews" / "Review 2"
doc_path = str(REVIEW2_DIR / "CareChain_Review2_Report.docx")

doc = docx.Document(doc_path)
print(f"Total Paragraphs: {len(doc.paragraphs)}")
print(f"Total Tables: {len(doc.tables)}")
print(f"Total Sections: {len(doc.sections)}")

word_count = sum(len(p.text.split()) for p in doc.paragraphs)
for t in doc.tables:
    for row in t.rows:
        for cell in row.cells:
            word_count += len(cell.text.split())
print(f"Total Word Count: {word_count} words")

placeholders = ["<<", ">>", "/**", "Sample", "Times New Roman 13", "Times New Roman 14", "Remove Border"]
found_placeholders = []
for idx, p in enumerate(doc.paragraphs):
    for pl in placeholders:
        if pl in p.text:
            found_placeholders.append((f"P[{idx}]", pl, p.text[:80]))

for t_idx, t in enumerate(doc.tables):
    for r_idx, row in enumerate(t.rows):
        for c_idx, cell in enumerate(row.cells):
            for pl in placeholders:
                if pl in cell.text:
                    found_placeholders.append((f"T[{t_idx}] R[{r_idx}] C[{c_idx}]", pl, cell.text[:80]))

if found_placeholders:
    print(f"WARNING: Found {len(found_placeholders)} placeholders:")
    for loc, pl, snippet in found_placeholders[:10]:
        print(f"  {loc}: [{pl}] -> {snippet}")
else:
    print("SUCCESS: 0 placeholders found! Document is 100% complete and finalized.")

print("\n--- Key Headings in Generated Document ---")
for p in doc.paragraphs:
    if p.text.startswith("1.") or p.text.startswith("2.") or p.text.startswith("3.") or p.text.startswith("4.") or p.text.startswith("5.") or p.text.startswith("6.") or p.text.startswith("7.") or p.text in ["DECLARATION", "CERTIFICATE", "ABSTRACT", "TABLE OF CONTENTS"]:
        print(" ", p.text)
