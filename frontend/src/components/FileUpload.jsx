import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';

const FileUpload = ({ onDataParsed }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (uploadedFile) => {
        if (uploadedFile.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }
        setFile(uploadedFile);
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await axios.post('http://localhost:8000/api/parse', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onDataParsed(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to parse PDF. Please try again.');
            setFile(null);
        } finally {
            setLoading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        onDataParsed([]);
        setError(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-8">
            {!file ? (
                <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={clsx(
                        "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200",
                        isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:bg-slate-50"
                    )}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className={clsx("w-12 h-12 mb-3", isDragging ? "text-indigo-500" : "text-slate-400")} />
                        <p className="mb-2 text-sm text-slate-500 font-medium">
                            <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-400">PDF files (Microsoft Edge Annotations)</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleInputChange} />
                </label>
            ) : (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <FileIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center text-indigo-600">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            <span className="text-sm font-medium">Parsing...</span>
                        </div>
                    ) : (
                        <button onClick={clearFile} className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
            {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
        </div>
    );
};

export default FileUpload;
