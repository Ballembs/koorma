"""
Convert AP SCERT Telugu textbook PDFs to page images.
Outputs high-quality WebP images to public/book-pages/class-N/page-NNN.webp
"""
import fitz  # PyMuPDF
import os

DPI = 200  # Good quality for tablet display without being huge
CLASSES = [1, 2, 3, 4, 5]  # All classes

for cls in CLASSES:
    pdf_path = f"public/Books/{cls}_Telugu_Textbook.pdf"
    out_dir = f"public/book-pages/class-{cls}"
    os.makedirs(out_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    total = len(doc)
    print(f"\n📖 Class {cls}: Converting {total} pages at {DPI} DPI...")

    for i, page in enumerate(doc):
        # Render at higher resolution
        zoom = DPI / 72  # 72 is default PDF DPI
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        
        out_path = f"{out_dir}/page-{i+1:03d}.png"
        pix.save(out_path)
        
        if (i + 1) % 10 == 0 or i == 0:
            print(f"  Page {i+1}/{total} ({pix.width}x{pix.height})")

    doc.close()
    print(f"  ✅ Done: {total} pages → {out_dir}/")

print("\n✨ All pages converted!")
