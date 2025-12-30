import React, { useState } from 'react';
import { FileText, File as FileIcon, Download, Loader2 } from 'lucide-react';
import axios from 'axios';

const ExportActions = ({ notes }) => {
    const [downloading, setDownloading] = useState(null);

    if (!notes || notes.length === 0) return null;

    const handleExport = async (format) => {
        setDownloading(format);
        try {
            const response = await axios.post(`http://localhost:8000/api/export/${format}`, notes, {
                responseType: 'blob',
            });

            // Check if backend returned an error (JSON) instead of a file
            if (response.data.type === 'application/json') {
                const text = await response.data.text();
                const error = JSON.parse(text);
                alert(`Export successful, but returned JSON: ${error.detail || 'Unknown error'}`);
                return;
            }

            // Create a blob link to download
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;

            const extension = format === 'pdf' ? 'pdf' : format === 'docx' ? 'docx' : 'txt';
            link.setAttribute('download', `notes_export.${extension}`);

            document.body.appendChild(link);
            link.click();

            // Cleanup with delay
            setTimeout(() => {
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export file. See console for details.");
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 shadow-lg z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 hidden sm:block">Export {notes.length} notes to:</span>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-center">

                    <ExportButton
                        onClick={() => handleExport('txt')}
                        loading={downloading === 'txt'}
                        icon={<FileText className="w-4 h-4" />}
                        label="TXT"
                        color="slate"
                    />
                    <ExportButton
                        onClick={() => handleExport('docx')}
                        loading={downloading === 'docx'}
                        icon={<FileIcon className="w-4 h-4" />}
                        label="Word"
                        color="blue"
                    />
                    <ExportButton
                        onClick={() => handleExport('pdf')}
                        loading={downloading === 'pdf'}
                        icon={<Download className="w-4 h-4" />}
                        label="PDF"
                        color="red"
                    />
                </div>
            </div>
        </div>
    );
};

const ExportButton = ({ onClick, loading, icon, label, color }) => {
    const colors = {
        slate: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200",
        blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
        red: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
    }

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${colors[color]} disabled:opacity-50`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
            {label}
        </button>
    )
}

export default ExportActions;
