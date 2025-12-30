import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import NoteList from './components/NoteList';
import ExportActions from './components/ExportActions';
import { BookOpen } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState([]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
            PDF Note Extractor
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Extract your wisdom</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Upload your annotated PDF (from Edge) to instantly extract highlights and your personal notes.
          </p>
        </div>

        <FileUpload onDataParsed={setNotes} />
        <NoteList notes={notes} />
      </main>

      <ExportActions notes={notes} />
    </div>
  );
}

export default App;
