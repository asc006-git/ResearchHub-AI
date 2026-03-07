import React, { useState } from 'react';
import { AlertCircle, Loader2, Target, Microscope } from 'lucide-react';
import api from '../services/api';

interface ResearchGapsProps {
    workspaceId: string;
}

const ResearchGaps: React.FC<ResearchGapsProps> = ({ workspaceId }) => {
    const [gaps, setGaps] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const detectGaps = async () => {
        setIsLoading(true);
        try {
            const response = await api.post(`/research/gaps/${workspaceId}`);
            setGaps(response.data.gaps);
        } catch (error) {
            console.error('Failed to detect research gaps:', error);
            alert('AI failed to identify research gaps. Ensure you have papers in your workspace.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#e5e7eb]">AI Research Gap Detector</h3>
                    <p className="text-[10px] text-[#4b5563] font-bold uppercase tracking-tighter italic">Identify unexplored frontiers and conflicting theories</p>
                </div>
                <button
                    onClick={detectGaps}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-[#38bdf8] text-[#0b1220] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-[#38bdf8]/20"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
                    <span>Detect Gaps</span>
                </button>
            </header>

            <div className="flex-1 min-h-0 bg-[#0f172a]/30 border border-white/5 rounded-3xl overflow-hidden flex flex-col relative group">
                {!gaps && !isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Microscope className="h-16 w-16 text-[#38bdf8]" />
                        <p className="text-xs font-bold text-[#4b5563] uppercase tracking-[0.3em]">Scanning Horizon</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                            <div className="h-12 w-12 border-2 border-[#38bdf8]/20 border-t-[#38bdf8] rounded-full animate-spin"></div>
                            <div className="absolute inset-0 h-12 w-12 bg-[#38bdf8] blur-xl animate-pulse opacity-20"></div>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-[10px] font-black text-[#38bdf8] uppercase tracking-[0.4em] animate-pulse">Detecting Vacuums</p>
                            <p className="text-[9px] text-[#4b5563] font-bold uppercase italic">Sifting through abstract data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar animate-in fade-in scale-95 duration-700">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 p-4 bg-[#38bdf8]/10 border border-[#38bdf8]/20 rounded-2xl">
                                <AlertCircle className="h-5 w-5 text-[#38bdf8]" />
                                <span className="text-[10px] font-black text-[#38bdf8] uppercase tracking-widest text-sans">AI Analysis Complete</span>
                            </div>
                            <div className="prose prose-invert prose-p:text-xs prose-headings:text-sm prose-p:text-[#94a3b8] prose-p:leading-relaxed whitespace-pre-wrap font-sans">
                                {gaps}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchGaps;
