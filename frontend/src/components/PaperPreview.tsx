import React from 'react';
import { type Paper } from '../types/paper';
import { ExternalLink, Users, FileText, Trash2, X, BarChart2 } from 'lucide-react';

interface PaperPreviewProps {
    paper: Paper;
    onClose: () => void;
    onRemove: (id: number) => void;
}

const PaperPreview: React.FC<PaperPreviewProps> = ({ paper, onClose, onRemove }) => {
    return (
        <div className="h-full flex flex-col bg-[#0b1220] animate-in slide-in-from-right duration-500">
            <header className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0b1220]/80 backdrop-blur-md z-10">
                <div className="flex items-center space-x-3 text-[#22c1f1]">
                    <BarChart2 className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Paper Insight</span>
                </div>
                <button onClick={onClose} className="p-2 text-[#4b5563] hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar pb-24">
                <div className="space-y-4">
                    <div className="inline-flex px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest border border-white/5">
                        {paper.year || 'N/A'}
                    </div>
                    <h2 className="text-xl font-bold text-white leading-tight tracking-tight">{paper.title}</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-[#4b5563]">
                            <Users className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Authors</span>
                        </div>
                        <p className="text-sm text-[#94a3b8] font-medium leading-relaxed">
                            {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-[#4b5563]">
                            <FileText className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Abstract</span>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                            <p className="text-xs text-[#94a3b8] leading-relaxed italic font-sans overflow-hidden">
                                {paper.abstract || 'No abstract available for this document.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <a
                        href={paper.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-[#22c1f1]/10 text-[#22c1f1] border border-[#22c1f1]/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#22c1f1] hover:text-[#0b1220] transition-all"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Source Link</span>
                    </a>
                </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0b1220] sticky bottom-0">
                <button
                    onClick={() => onRemove(paper.id)}
                    className="w-full flex items-center justify-center space-x-2 py-4 border border-red-500/20 text-red-500/80 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group"
                >
                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Remove from Workspace</span>
                </button>
            </div>
        </div>
    );
};

export default PaperPreview;
