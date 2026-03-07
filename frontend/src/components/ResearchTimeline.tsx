import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

interface ResearchTimelineProps {
    workspaceId: string;
}

const ResearchTimeline: React.FC<ResearchTimelineProps> = ({ workspaceId }) => {
    const [timeline, setTimeline] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const generateTimeline = async () => {
        setIsLoading(true);
        try {
            const response = await api.post(`/research/timeline/${workspaceId}`);
            setTimeline(response.data.timeline);
        } catch (error) {
            console.error('Failed to generate timeline:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#22c1f1]">
                    <Calendar className="h-4 w-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Research Evolution</h3>
                </div>
                <button
                    onClick={generateTimeline}
                    disabled={isLoading}
                    className="px-3 py-1 bg-[#22c1f1]/10 border border-[#22c1f1]/20 rounded-lg text-[10px] font-bold text-[#22c1f1] hover:bg-[#22c1f1]/20 transition-all flex items-center space-x-2"
                >
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    <span>{timeline ? 'Regenerate' : 'Generate Timeline'}</span>
                </button>
            </div>

            {timeline ? (
                <div className="dark-card p-6 bg-gradient-to-br from-[#111827] to-[#0b1220] border-l-2 border-l-[#22c1f1]">
                    <pre className="text-xs text-[#94a3b8] leading-relaxed font-sans whitespace-pre-wrap">
                        {timeline}
                    </pre>
                </div>
            ) : !isLoading && (
                <div className="dark-card p-10 text-center border-dashed opacity-50">
                    <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">No timeline generated yet</p>
                </div>
            )}
        </div>
    );
};

export default ResearchTimeline;
