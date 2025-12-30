from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz  # PyMuPDF
import uvicorn
import io
from typing import List, Optional
from exporter import generate_docx_bytes, generate_pdf_bytes, generate_txt_content
from fastapi.responses import Response, StreamingResponse

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoteItem(BaseModel):
    page: int
    original_text: str
    note: Optional[str] = ""

@app.post("/api/parse", response_model=List[NoteItem])
async def parse_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    contents = await file.read()
    doc = fitz.open(stream=contents, filetype="pdf")
    
    notes = []

    for page_num, page in enumerate(doc):
        # Iterate over all annotations
        annot = page.first_annot
        while annot:
            # Type 8 is Highlight
            if annot.type[0] == 8:
                # Extract text under the highlight
                # We use the annotation's vertices (quad points) for more precise text extraction if available,
                # otherwise use the rect. Highlighs often have quads.
                # However, for simplicity and speed, rect is usually a good approximation.
                # Let's try to get quad points first if possible for multi-line highlights.
                
                # PyMuPDF 1.19+ handles this well with 'vertices' usually, but fitz's get_text with clip is robust.
                text = page.get_text("text", clip=annot.rect).strip()
                
                # Extract user note (content)
                content = annot.info.get("content", "")
                
                # Logic: 
                # If both text and content are empty, skip.
                # If highlight has no note, keep it (as per requirements).
                
                if text or content:
                   notes.append({
                       "page": page_num + 1,
                       "original_text": text,
                       "note": content
                   })
            
            annot = annot.next

    doc.close()
    return notes

class ExportRequest(BaseModel):
    format: str
    notes: List[NoteItem]

@app.post("/api/export/{format}")
async def export_notes(format: str, notes: List[NoteItem]):
    if format == "txt":
        content = generate_txt_content(notes)
        return Response(content=content, media_type="text/plain", headers={"Content-Disposition": "attachment; filename=\"notes.txt\""})
    
    elif format == "docx":
        file_stream = generate_docx_bytes(notes)
        return StreamingResponse(
            file_stream, 
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": "attachment; filename=\"notes.docx\""}
        )
    
    elif format == "pdf":
        file_stream = generate_pdf_bytes(notes)
        return StreamingResponse(
            file_stream,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=\"notes.pdf\""}
        )

    else:
        raise HTTPException(status_code=400, detail="Unsupported format")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
