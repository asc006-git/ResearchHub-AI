import React from 'react';
import { type Paper } from '../types/paper';

interface ResearchThemesProps {
    papers: Paper[];
}

const ResearchThemes: React.FC<ResearchThemesProps> = ({ papers }) => {
    // Simple keyword extraction from titles
    const extractThemes = () => {
        const keywords = ['AI', 'Intelligence', 'Machine Learning', 'Data', 'Network', 'System', 'Algorithm', 'Human', 'Health', 'Sustainability', 'Global', 'Future', 'Quantum', 'Cloud', 'Ethics'];
        const distribution: Record<string, number> = {};

        papers.forEach(paper => {
            const title = paper.title.toLowerCase();
            keywords.forEach(key => {
                if (title.includes(key.toLowerCase())) {
                    distribution[key] = (distribution[key] || 0) + 1;
                }
            });
        });

        return Object.entries(distribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
    };

    const themes = extractThemes();
    const maxVal = Math.max(...themes.map(t => t[1]), 1);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="space-y-4 text-center">
                <h3 className="text-[10px] font-black text-[#22c1f1] uppercase tracking-[0.4em]">Topic Matrix</h3>
                <h2 className="text-3xl font-black text-white tracking-tighter">Research Themes</h2>
                <p className="text-[#94a3b8] text-sm max-w-lg mx-auto font-medium italic">
                    Automated theme distribution based on semantic patterns across your imported literature.
                </p>
            </header>

            <div className="grid gap-6">
                {themes.length === 0 ? (
                    <div className="py-20 text-center space-y-4 opacity-30">
                        <div className="h-12 w-12 border-2 border-dashed border-[#4b5563] rounded-full mx-auto flex items-center justify-center">
                            <span className="text-xs font-bold text-[#4b5563]">?</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#4b5563]">Insufficient data for theme extraction</p>
                    </div>
                ) : (
                    themes.map(([name, count]) => (
                        <div key={name} className="space-y-3 group">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black text-[#e5e7eb] uppercase tracking-widest group-hover:text-[#22c1f1] transition-colors">{name}</span>
                                <span className="text-[10px] font-bold text-[#4b5563]">{count} Papers</span>
                            </div>
                            <div className="h-2 w-full bg-[#111827] rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-[#22c1f1] to-[#38bdf8] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,193,241,0.3)]"
                                    style={{ width: `${(count / maxVal) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {themes.length > 0 && (
                <div className="pt-8 border-t border-white/5">
                    <p className="text-[9px] text-[#4b5563] font-black uppercase tracking-[0.2em] text-center">
                        Synthesized from {papers.length} source documents
                    </p>
                </div>
            )}
        </div>
    );
};

export default ResearchThemes;
