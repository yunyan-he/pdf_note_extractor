import React from 'react';
import { Quote, StickyNote } from 'lucide-react';

const NoteList = ({ notes }) => {
    if (!notes || notes.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 pb-20">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Extracted Notes ({notes.length})</h2>
            </div>

            {notes.map((item, index) => (
                <NoteItem key={index} item={item} />
            ))}
        </div>
    );
};

const NoteItem = ({ item }) => {
    const [expanded, setExpanded] = React.useState(false);
    const isLong = item.note && item.note.length > 150;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    Page {item.page}
                </span>
            </div>

            {item.original_text && (
                <div className="flex gap-3 mb-4">
                    <Quote className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-800 leading-relaxed border-l-2 border-indigo-100 pl-4 py-1 italic whitespace-pre-wrap">
                        {item.original_text}
                    </p>
                </div>
            )}

            {item.note && (
                <div className="flex gap-3 bg-yellow-50/50 p-4 rounded-lg border border-yellow-100/50">
                    <StickyNote className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 w-full">
                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">My Note</p>
                        <div className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
                            {item.note}
                        </div>
                        {isLong && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-xs font-medium text-amber-600 hover:text-amber-700 mt-1 focus:outline-none cursor-pointer"
                            >
                                {expanded ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteList;
