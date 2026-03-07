import React, { useState, useEffect } from 'react';
import { Clock, Database, Search, ChevronRight, FileText, MessageSquare, Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface ActivityLog {
    id: number;
    action: string;
    details: string;
    timestamp: string;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
};

const getActionIcon = (action: string) => {
    switch (action) {
        case 'PAPER_IMPORTED': return <FileText className="h-5 w-5 text-blue-400" />;
        case 'WORKSPACE_CREATED': return <Plus className="h-5 w-5 text-green-400" />;
        case 'CHAT_MESSAGE': return <MessageSquare className="h-5 w-5 text-purple-400" />;
        case 'SEARCH_QUERY': return <Search className="h-5 w-5 text-yellow-400" />;
        default: return <Activity className="h-5 w-5 text-gray-400" />;
    }
};

const getActionLabel = (action: string) => {
    return action.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

const History: React.FC = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await api.get('/users/activity');
                setActivities(response.data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivity();
    }, []);


    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
            <header className="space-y-4">
                <div className="flex items-center space-x-3 text-[#38bdf8]">
                    <Clock className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Chronological Log</span>
                </div>
                <h1 className="text-6xl font-extrabold text-[#e5e7eb] tracking-tight">Research <span className="text-[#4b5563]">History</span></h1>
                <p className="text-xl text-[#94a3b8] font-medium mt-2 leading-relaxed">
                    Access your past syntheses, search queries, and document imports in reverse chronological order.
                </p>
            </header>

            {isLoading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c1f1]"></div>
                </div>
            ) : activities.length === 0 ? (
                <div className="dark-card p-20 text-center space-y-8 bg-gradient-to-br from-[#0f172a] to-[#0b1220] border-dashed border-2 border-white/5">
                    <div className="relative inline-block">
                        <div className="p-6 bg-[#111827] rounded-full border border-white/5 text-[#4b5563]">
                            <Database className="h-12 w-12" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-2 bg-[#22c1f1] rounded-lg text-[#0b1220]">
                            <Search className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-[#e5e7eb]">History Archive Empty</h3>
                        <p className="text-[#94a3b8] max-w-xs mx-auto">Your research activities will appear here once you begin exploring the academic network.</p>
                    </div>

                    <button
                        onClick={() => navigate('/search')}
                        className="px-10 py-4 bg-[#111827] border border-white/10 rounded-2xl font-bold flex items-center space-x-2 mx-auto hover:bg-[#22c1f1] hover:text-[#0b1220] transition-all active:scale-95"
                    >
                        <span>Begin Discovery</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {activities.map((activity) => (
                        <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#111827] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
                                {getActionIcon(activity.action)}
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] dark-card p-6 md:group-odd:text-right group-hover:border-[#22c1f1]/30 transition-colors">
                                <div className="flex items-center justify-between md:group-odd:flex-row-reverse mb-2">
                                    <span className="text-[10px] font-bold text-[#22c1f1] uppercase tracking-widest">{getActionLabel(activity.action)}</span>
                                    <span className="text-xs text-[#94a3b8]">{timeAgo(activity.timestamp)}</span>
                                </div>
                                <h3 className="text-sm font-medium text-[#e5e7eb] leading-relaxed">
                                    {activity.details}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;

