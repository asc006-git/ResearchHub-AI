import React from 'react';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';

interface Workspace {
    id: string;
    name: string;
    description?: string;
    created_at?: string;
    paper_count?: number;
}

interface WorkspaceCardProps {
    workspace: Workspace;
    onOpen: (id: string) => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace, onOpen }) => {
    const formattedDate = workspace.created_at
        ? new Date(workspace.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        : 'Unknown Date';

    return (
        <div className="dark-card group relative transition-all duration-300 hover:border-[#22c1f1]/30">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#0b1220] border border-white/5 rounded-xl group-hover:bg-[#22c1f1] group-hover:text-[#0b1220] transition-all duration-300">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#e5e7eb] group-hover:text-white transition-colors">{workspace.name}</h3>
                        <div className="flex items-center text-[9px] font-bold text-[#4b5563] uppercase tracking-[0.1em] mt-1">
                            <Calendar className="h-3 w-3 mr-1.5" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div className="px-2 py-0.5 bg-[#22c1f1]/5 border border-[#22c1f1]/10 rounded-md">
                    <span className="text-[9px] font-bold text-[#22c1f1] uppercase tracking-widest">Workspace</span>
                </div>
            </div>

            {workspace.description && (
                <p className="text-xs text-[#94a3b8] mb-4 line-clamp-2 leading-relaxed">
                    {workspace.description}
                </p>
            )}

            <div className="flex items-center space-x-2 text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-6">
                <BookOpen className="h-3 w-3 text-[#22c1f1]" />
                <span>Active Artifacts</span>
            </div>

            <button
                onClick={() => onOpen(workspace.id)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#0b1220] border border-white/5 rounded-xl text-xs font-bold text-white hover:bg-[#22c1f1] hover:text-[#0b1220] transition-all duration-300"
            >
                <span className="uppercase tracking-widest">Launch Workspace</span>
                <ChevronRight className="h-3.5 w-3.5" />
            </button>
        </div>
    );
};


export default WorkspaceCard;
