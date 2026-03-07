import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Activity,
    BookOpen,
    FileText,
    MessageSquare,
    Folder
} from 'lucide-react';
import api from '../services/api';
import WorkspaceCard from '../components/WorkspaceCard';

interface Stats {
    active_workspaces: number;
    total_papers: number;
    total_conversations: number;
}

const Dashboard: React.FC = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [stats, setStats] = useState<Stats>({ active_workspaces: 0, total_papers: 0, total_conversations: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadDashboardData = async () => {
            await Promise.all([fetchWorkspaces(), fetchActivity(), fetchStats()]);
            setIsLoading(false);
        };
        loadDashboardData();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const response = await api.get('/workspaces/');
            setWorkspaces(response.data);
        } catch (error) {
            console.error('Failed to fetch workspaces:', error);
        }
    };

    const fetchActivity = async () => {
        try {
            const response = await api.get('/users/activity');
            setActivities(response.data);
        } catch (error) {
            console.error('Failed to fetch activity:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/users/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;
        try {
            await api.post('/workspaces/', { name: newWorkspaceName });
            setNewWorkspaceName('');
            await Promise.all([fetchWorkspaces(), fetchActivity(), fetchStats()]);
        } catch (error) {
            console.error('Failed to create workspace:', error);
        }
    };

    const handleOpenWorkspace = (id: string) => {
        navigate(`/workspace/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="space-y-4">
                <div className="flex items-center space-x-3 text-[#22c1f1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22c1f1]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Academic Engine Active</span>
                </div>
                <div>
                    <h1 className="text-5xl font-extrabold text-[#e5e7eb] tracking-tight">ResearchHub <span className="text-[#4b5563]">AI</span></h1>
                    <p className="text-lg text-[#94a3b8] font-medium mt-3 max-w-3xl leading-relaxed">
                        Advanced scholarly synthesis engine. Organize your research artifacts, generate proprietary insights, and discover emerging patterns.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Content Area (8 columns) */}
                <div className="col-span-8 space-y-8">
                    {/* Metrics Section */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="dark-card flex-1 flex flex-col justify-center p-6 border-t-2 border-[#22c1f1] rounded-2xl">
                            <Folder className="h-5 w-5 text-[#22c1f1] mb-4" />
                            <div>
                                <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Active Workspaces</p>
                                <p className="text-4xl font-black text-white">{stats.active_workspaces}</p>
                            </div>
                        </div>
                        <div className="dark-card flex-1 flex flex-col justify-center p-6 border-t-2 border-[#38bdf8] rounded-2xl">
                            <FileText className="h-5 w-5 text-[#38bdf8] mb-4" />
                            <div>
                                <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">Total Papers</p>
                                <p className="text-4xl font-black text-white">{stats.total_papers}</p>
                            </div>
                        </div>
                        <div className="dark-card flex-1 flex flex-col justify-center p-6 border-t-2 border-purple-400 rounded-2xl">
                            <MessageSquare className="h-5 w-5 text-purple-400 mb-4" />
                            <div>
                                <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-1">AI Conversations</p>
                                <p className="text-4xl font-black text-white">{stats.total_conversations}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access / Create Project */}
                    <form onSubmit={handleCreateWorkspace} className="flex gap-4">
                        <div className="relative flex-1 group">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4b5563] group-focus-within:text-[#22c1f1] transition-colors" />
                            <input
                                type="text"
                                placeholder="Initialize new research project..."
                                value={newWorkspaceName}
                                onChange={(e) => setNewWorkspaceName(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#111827] border border-white/5 rounded-2xl text-white placeholder-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#22c1f1]/30 transition-all font-medium"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!newWorkspaceName.trim() || isLoading}
                            className="px-8 py-4 bg-[#111827] border border-white/10 rounded-2xl font-bold flex items-center space-x-2 hover:bg-[#22c1f1] hover:text-[#0b1220] transition-all disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-widest">Create</span>
                        </button>
                    </form>

                    {/* Workspaces Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white tracking-tight uppercase tracking-widest text-sm">Workspaces</h2>
                            <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">{workspaces.length} Total</span>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-2 gap-6">
                                {[1, 2].map(i => <div key={i} className="h-48 dark-card animate-pulse rounded-2xl"></div>)}
                            </div>
                        ) : workspaces.length === 0 ? (
                            <div className="dark-card p-12 text-center rounded-2xl border-dashed border-2 border-white/5">
                                <p className="text-[#94a3b8]">You have no active workspaces. Create one above to get started.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-6">
                                {workspaces.map((workspace: any) => (
                                    <WorkspaceCard
                                        key={workspace.id}
                                        workspace={workspace}
                                        onOpen={handleOpenWorkspace}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Selection Sidebar (4 columns) */}
                <aside className="col-span-4 space-y-8">
                    {/* Activity Feed */}
                    <section className="dark-card p-6 rounded-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-[#94a3b8]">
                                <Activity className="h-4 w-4" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest">Recent Activity</h3>
                            </div>
                        </div>

                        <div className="space-y-6 relative ml-1">
                            <div className="absolute left-[3px] top-2 bottom-2 w-px bg-white/5"></div>

                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-10 animate-pulse bg-white/5 rounded-lg ml-6"></div>)}
                                </div>
                            ) : activities.length > 0 ? (
                                activities.slice(0, 5).map((activity: any) => (
                                    <div key={activity.id} className="relative pl-6 group">
                                        <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[#22c1f1]"></div>
                                        <p className="text-[11px] font-bold text-[#e5e7eb] group-hover:text-white transition-colors">
                                            {activity.details || (activity.action ? activity.action.split('_').join(' ') : 'Unknown Action')}
                                        </p>
                                        <span className="text-[9px] font-bold text-[#4b5563] uppercase tracking-widest mt-1 block">
                                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {" · "}
                                            {new Date(activity.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] text-[#4b5563] font-bold uppercase tracking-widest pl-6">No recent logs</p>
                            )}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;
