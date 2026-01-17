from pathlib import Path
from pypdf import PdfReader

PDF_DIR = Path("rag_docs_pdf")
OUT_DIR = Path("rag_docs")   # keep same folder used by index_rag.py

OUT_DIR.mkdir(parents=True, exist_ok=True)

def pdf_to_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    parts = []
    for page in reader.pages:
        txt = page.extract_text() or ""
        parts.append(txt)
    return "\n".join(parts)

def main():
    pdfs = list(PDF_DIR.rglob("*.pdf"))
    if not pdfs:
        print(f"No PDFs found in {PDF_DIR}")
        return

    for pdf in pdfs:
        rel = pdf.relative_to(PDF_DIR)
        out_path = (OUT_DIR / rel).with_suffix(".txt")
        out_path.parent.mkdir(parents=True, exist_ok=True)

        text = pdf_to_text(pdf).strip()
        out_path.write_text(text, encoding="utf-8", errors="ignore")
        print(f"✅ {pdf.name} → {out_path}")

    print("Done. Now run: python index_rag.py")

if __name__ == "__main__":
    main()
