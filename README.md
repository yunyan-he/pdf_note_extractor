# PDF Note Extractor

A local web application to extract highlights and notes from PDFs (specifically Microsoft Edge annotations).

## Features
- **Upload**: Drag and drop PDF files.
- **Preview**: View extracted highlights and notes in a clean interface.
- **Export**: Download notes as TXT, Word (DOCX), or PDF.

## Prerequisites
- Python 3.8+
- Node.js & npm

## Quick Start (Recommended)
This project includes a startup script that sets up the environment, launches both backend and frontend, and opens your browser automatically.

1.  **Make the script executable** (first time only):
    ```bash
    chmod +x start.sh
    ```

2.  **Run the app**:
    ```bash
    ./start.sh
    ```

## Installation & Setup (Manual)

### 1. Backend Setup (FastAPI)
Navigate to the `backend` folder:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the API server:
```bash
python main.py
```
The backend will run at `http://localhost:8000`.

### 2. Frontend Setup (React)
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will open at `http://localhost:5173` (or similar).

## Usage
1. Open the web app in your browser.
2. Drag and drop a PDF file that has "Highlight" type annotations.
   - **Note**: This tool specifically looks for standard PDF Highlight annotations (Type 8).
3. Review the extracted content.
4. Click 'TXT', 'Word', or 'PDF' at the bottom to export.

## Tech Stack
- **Backend**: Python, FastAPI, PyMuPDF (fitz), python-docx, ReportLab
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Axios
