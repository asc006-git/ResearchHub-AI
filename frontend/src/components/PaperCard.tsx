import React from 'react';
import { BookOpen, PlusCircle, Calendar, User, FileText, Clock } from 'lucide-react';
import type { Paper } from '../types/paper';
interface PaperCardProps {
    paper: Paper;
    onImport?: (paper: Paper) => void;
    isImported?: boolean;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, onImport, isImported }) => {
    const formattedAuthors = Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors;

    const estimateReadingTime = (text: string) => {
        const words = text.split(/\s+/).length;
        return Math.ceil(words / 200);
    };

    const readTime = estimateReadingTime(paper.abstract);

    return (
        <div className="dark-card p-6 group relative transition-all duration-300 mb-4 overflow-hidden border-[var(--accent-color)]/5 hover:border-[var(--accent-color)]/30">
            <div className="flex justify-between items-start gap-6 relative z-10">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="px-2 py-0.5 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 rounded text-[9px] font-bold text-[var(--accent-color)] trekking-widest uppercase">
                            {paper.year || (paper.publish_date && paper.publish_date.split('-')[0]) || '2024'}
                        </div>
                        {paper.venue && (
                            <span className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[0.2em] truncate max-w-[200px]">
                                {paper.venue}
                            </span>
                        )}
                        {typeof paper.citations === 'number' && (
                            <span className="text-[9px] font-bold text-[var(--accent-color)] uppercase tracking-widest">
                                {paper.citations} Citations
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-extrabold text-[#e5e7eb] leading-tight group-hover:text-white transition-colors">
                        {paper.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center text-[#94a3b8]">
                            <User className="h-3 w-3 mr-2 text-[var(--accent-color)]" />
                            <span className="text-xs font-semibold italic">{formattedAuthors}</span>
                        </div>
                    </div>

                    <p className="text-[#64748b] text-sm leading-relaxed line-clamp-3 italic font-medium">
                        "{paper.abstract}"
                    </p>

                    <div className="flex items-center space-x-2 text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mt-2">
                        <Clock className="h-3 w-3" />
                        <span>⏱ {readTime} min read</span>
                    </div>
                </div>

                {paper.url && (
                    <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-3 bg-[#0b1220] border border-white/5 rounded-xl text-[#4b5563] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/30 transition-all duration-300"
                        title="View Source"
                    >
                        <BookOpen className="h-5 w-5" />
                    </a>
                )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5 relative z-10">
                <div className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[0.3em] flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-2" />
                    <span>Crossref Verified</span>
                </div>

                {onImport && !isImported && (
                    <button
                        onClick={() => onImport(paper)}
                        className="flex items-center space-x-2 bg-[#0b1220] border border-[var(--accent-color)]/20 hover:bg-[var(--accent-color)] hover:text-[#0b1220] px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Add to Project</span>
                    </button>
                )}
                {isImported && (
                    <span className="flex items-center space-x-2 bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                        <PlusCircle className="h-4 w-4" />
                        <span>Collected</span>
                    </span>
                )}
            </div>

            {/* Subtle glow background */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent-color)]/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
    );
};


export default PaperCard;
