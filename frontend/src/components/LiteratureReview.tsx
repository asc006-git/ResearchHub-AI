import React, { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Download } from 'lucide-react';
import api from '../services/api';

interface LiteratureReviewProps {
    workspaceId: string;
}

const LiteratureReview: React.FC<LiteratureReviewProps> = ({ workspaceId }) => {
    const [review, setReview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateReview = async () => {
        setIsLoading(true);
        try {
            const response = await api.post(`/research/literature-review/${workspaceId}`);
            setReview(response.data.review);
        } catch (error) {
            console.error('Failed to generate literature review:', error);
            alert('AI failed to generate literature review. Ensure you have papers in your workspace.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#e5e7eb]">Literature Review Generator</h3>
                    <p className="text-[10px] text-[#4b5563] font-bold uppercase tracking-tighter italic">Synthesize collective intelligence into a structured review</p>
                </div>
                <button
                    onClick={generateReview}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--accent-color)] text-[#0b1220] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-[var(--accent-color)]/20"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    <span>Generate Review</span>
                </button>
            </header>

            <div className="flex-1 min-h-0 bg-[#0f172a]/30 border border-white/5 rounded-3xl overflow-hidden flex flex-col relative group">
                {!review && !isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700">
                        <BookOpen className="h-16 w-16 text-[var(--accent-color)]" />
                        <p className="text-xs font-bold text-[#4b5563] uppercase tracking-[0.3em]">Awaiting Synthesis</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                            <RefreshCw className="h-12 w-12 text-[var(--accent-color)] animate-spin" />
                            <div className="absolute inset-0 h-12 w-12 text-[var(--accent-color)] blur-xl animate-pulse opacity-50"></div>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-[10px] font-black text-[var(--accent-color)] uppercase tracking-[0.4em] animate-pulse">Analyzing Corpus</p>
                            <p className="text-[9px] text-[#4b5563] font-bold uppercase italic">Structuring academic insights...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="prose prose-invert prose-p:text-xs prose-headings:text-sm prose-p:text-[#94a3b8] prose-p:leading-relaxed whitespace-pre-wrap font-sans">
                            {review}
                        </div>
                    </div>
                )}

                {review && (
                    <div className="absolute bottom-6 right-6">
                        <button
                            onClick={() => {
                                const blob = new Blob([review], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `literature_review_${workspaceId}.txt`;
                                a.click();
                            }}
                            className="p-3 bg-[#0b1220]/80 backdrop-blur-md border border-white/10 rounded-full text-[#94a3b8] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/20 transition-all shadow-xl"
                            title="Download (.txt)"
                        >
                            <Download className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Internal replacement for missing icon during development if needed
const RefreshCw = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
    </svg>
);

export default LiteratureReview;
