import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Plus,
    Database,
    Activity,
    Search,
    Layers,
    Sparkles,
    RefreshCw,
    ChevronLeft,
    BookOpen,
    Calendar,
    Edit3,
    MessageSquare,
    Loader2,
    Trash2,
    AlertTriangle,
    X,
    TrendingUp,
    FileText,
    History,
    Download
} from 'lucide-react';
import api from '../services/api';
import ChatBox from '../components/ChatBox';
import LiteratureReview from '../components/LiteratureReview';
import ResearchGaps from '../components/ResearchGaps';
import ResearchNotes from '../components/ResearchNotes';
import PaperPreview from '../components/PaperPreview';
import { type Paper } from '../types/paper';
import { Bookmark, CheckCircle2, Circle } from 'lucide-react';

const Workspace: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [papers, setPapers] = useState<Paper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'chat' | 'literature' | 'gaps' | 'notes'>('chat');
    const [summarizingId, setSummarizingId] = useState<number | null>(null);
    const [paperSummaries, setPaperSummaries] = useState<Record<number, string>>({});
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const [bookmarks, setBookmarks] = useState<number[]>([]);
    const [readPapers, setReadPapers] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchWorkspaceData();
            // Load local state
            const savedBookmarks = JSON.parse(localStorage.getItem(`ws_${id}_bookmarks`) || '[]');
            const savedRead = JSON.parse(localStorage.getItem(`ws_${id}_read`) || '[]');
            setBookmarks(savedBookmarks);
            setReadPapers(savedRead);
        }
    }, [id]);

    const fetchWorkspaceData = async () => {
        try {
            const response = await api.get(`/workspaces/${id}`);
            setPapers(response.data.papers || []);
        } catch (error) {
            console.error('Failed to fetch workspace data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSummarize = async (e: React.MouseEvent, paperId: number) => {
        e.stopPropagation();
        setSummarizingId(paperId);
        try {
            const response = await api.post(`/research/summarize/${paperId}`);
            setPaperSummaries(prev => ({ ...prev, [paperId]: response.data.summary }));
        } catch (error) {
            console.error('Summarization failed:', error);
            alert('AI failed to summarize this paper.');
        } finally {
            setSummarizingId(null);
        }
    };

    const toggleBookmark = (e: React.MouseEvent, paperId: number) => {
        e.stopPropagation();
        const newBookmarks = bookmarks.includes(paperId)
            ? bookmarks.filter(bid => bid !== paperId)
            : [...bookmarks, paperId];
        setBookmarks(newBookmarks);
        localStorage.setItem(`ws_${id}_bookmarks`, JSON.stringify(newBookmarks));
    };

    const toggleRead = (e: React.MouseEvent, paperId: number) => {
        e.stopPropagation();
        const newRead = readPapers.includes(paperId)
            ? readPapers.filter(rid => rid !== paperId)
            : [...readPapers, paperId];
        setReadPapers(newRead);
        localStorage.setItem(`ws_${id}_read`, JSON.stringify(newRead));
    };

    const handleRemovePaper = async (paperId: number) => {
        if (!id) return;
        try {
            await api.delete(`/papers/${paperId}`);
            setPapers(prev => prev.filter(p => Number(p.id) !== paperId));
            if (selectedPaper && Number(selectedPaper.id) === paperId) {
                setSelectedPaper(null);
            }
        } catch (error) {
            console.error('Failed to remove paper:', error);
            alert('Removal failed.');
        }
    };


    const filteredPapers = papers.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(p.authors) ? p.authors.join(' ') : p.authors).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteWorkspace = async () => {
        if (!id) return;
        setIsDeleting(true);
        try {
            await api.delete(`/workspaces/${id}`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to delete workspace:', error);
            alert('Deletion failed. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleExportSummary = () => {
        const data = {
            workspace_id: id,
            generated_at: new Date().toISOString(),
            papers: papers.map(p => ({
                title: p.title,
                authors: p.authors,
                year: p.year,
                summary: paperSummaries[p.id] || 'No summary generated',
                read: readPapers.includes(Number(p.id))
            }))
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `research_summary_${id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            fetchWorkspaceData();
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <div className="text-center space-y-4">
                    <RefreshCw className="h-12 w-12 text-[var(--accent-color)] animate-spin mx-auto" />
                    <p className="text-[#94a3b8] font-bold uppercase tracking-[0.3em]">Initializing Workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* Left Column: Documents Sidebar */}
            <aside className="w-[300px] flex-shrink-0 flex flex-col bg-[#0b1220] border-r border-white/5 overflow-hidden animate-in slide-in-from-left duration-700 z-10">
                <div className="p-6 border-b border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-[var(--accent-color)]/10 rounded-lg">
                                <Database className="h-4 w-4 text-[var(--accent-color)]" />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-[#e5e7eb]">Documents</h2>
                        </div>
                        <button
                            onClick={() => navigate('/search')}
                            className="p-2 bg-white/5 border border-white/5 rounded-lg text-[#94a3b8] hover:text-[var(--accent-color)] transition-all"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563] group-focus-within:text-[var(--accent-color)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter papers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#111827] border border-white/5 rounded-xl text-xs font-medium text-white placeholder-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30 transition-all font-sans"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {filteredPapers.length === 0 ? (
                        <div className="text-center py-12 space-y-4 opacity-50">
                            <Layers className="h-10 w-10 text-[#4b5563] mx-auto" />
                            <p className="text-xs font-bold text-[#4b5563] uppercase tracking-widest">No matching papers</p>
                            <button onClick={() => navigate('/search')} className="text-[10px] font-black text-[var(--accent-color)] uppercase hover:underline">Import papers</button>
                        </div>
                    ) : (
                        filteredPapers.map(paper => {
                            const pId = Number(paper.id);
                            return (
                                <div
                                    key={pId}
                                    onClick={() => setSelectedPaper(paper)}
                                    className={`dark-card p-4 hover:border-[var(--accent-color)]/30 transition-all cursor-pointer group relative ${selectedPaper && Number(selectedPaper.id) === pId ? 'border-[var(--accent-color)]/40 bg-[#111827]' : ''}`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className={`h-8 w-8 rounded flex items-center justify-center flex-shrink-0 transition-all ${readPapers.includes(pId) ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#111827] text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-[#0b1220]'}`}>
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <h4 className="text-xs font-bold text-[#e5e7eb] truncate group-hover:text-white transition-colors">{paper.title}</h4>
                                                <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-tighter truncate italic font-sans">
                                                    {Array.isArray(paper.authors) ? paper.authors[0] : paper.authors} {paper.year ? `(${paper.year})` : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => toggleBookmark(e, pId)}
                                                    className={`p-1.5 rounded-lg transition-colors ${bookmarks.includes(pId) ? 'text-[#eab308]' : 'text-[#4b5563] hover:text-white'}`}
                                                >
                                                    <Bookmark className="h-3.5 w-3.5 fill-current" />
                                                </button>
                                                <button
                                                    onClick={(e) => toggleRead(e, pId)}
                                                    className={`p-1.5 rounded-lg transition-colors ${readPapers.includes(pId) ? 'text-[#10b981]' : 'text-[#4b5563] hover:text-white'}`}
                                                >
                                                    {readPapers.includes(pId) ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                                                </button>
                                                <button
                                                    onClick={(e) => handleSummarize(e, pId)}
                                                    disabled={summarizingId === pId}
                                                    className="p-1.5 rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[#0b1220] transition-all"
                                                >
                                                    {summarizingId === pId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {paperSummaries[pId] && (
                                            <div className="p-3 bg-white/5 rounded-lg border border-[var(--accent-color)]/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center space-x-2 text-[9px] font-black text-[var(--accent-color)] uppercase tracking-[0.2em] mb-2">
                                                    <Sparkles className="h-3 w-3" />
                                                    <span>AI Summary</span>
                                                </div>
                                                <p className="text-[10px] text-[#94a3b8] leading-relaxed italic font-sans break-words">{paperSummaries[pId]}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </aside>

            {/* Middle Column: Dynamic Viewport */}
            <main className="flex-1 flex flex-col bg-[#0b1220] relative z-10 animate-in fade-in duration-1000">
                <nav className="flex items-center space-x-8 px-8 py-4 border-b border-white/5 bg-[#0b1220]/50 backdrop-blur-md">
                    {[
                        { id: 'chat', label: 'Research Chat', icon: MessageSquare },
                        { id: 'literature', label: 'Literature Review', icon: BookOpen },
                        { id: 'gaps', label: 'Research Gaps', icon: TrendingUp },
                        { id: 'notes', label: 'Shared Notes', icon: Edit3 }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center space-x-2 py-2 border-b-2 transition-all ${activeTab === tab.id
                                ? 'border-[var(--accent-color)] text-[var(--accent-color)]'
                                : 'border-transparent text-[#4b5563] hover:text-[#94a3b8]'
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="flex-1 overflow-hidden p-8">
                    {activeTab === 'chat' && <ChatBox workspaceId={id || ''} />}
                    {activeTab === 'literature' && <div className="max-w-4xl mx-auto h-full overflow-hidden"><LiteratureReview workspaceId={id || ''} /></div>}
                    {activeTab === 'gaps' && <div className="max-w-4xl mx-auto h-full overflow-hidden"><ResearchGaps workspaceId={id || ''} /></div>}
                    {activeTab === 'notes' && <div className="max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar pr-4"><ResearchNotes workspaceId={id || ''} /></div>}
                </div>
            </main>

            {/* Right Column: Insights or Paper Preview */}
            <aside className={`w-[320px] flex-shrink-0 hidden xl:flex flex-col bg-[#0b1220] border-l border-white/5 overflow-hidden transition-all duration-500`}>
                {selectedPaper ? (
                    <PaperPreview
                        paper={selectedPaper}
                        onClose={() => setSelectedPaper(null)}
                        onRemove={handleRemovePaper}
                    />
                ) : (
                    <div className="p-8 space-y-10 animate-in fade-in duration-500">
                        <header className="space-y-2">
                            <div className="flex items-center space-x-3 text-[#38bdf8]">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Matrix</span>
                            </div>
                            <h2 className="text-2xl font-black text-[#e5e7eb] tracking-tighter">Workspace <br /> Insights</h2>
                        </header>

                        <div className="space-y-6">
                            <div className="dark-card p-6 space-y-4 group">
                                <div className="flex justify-between items-center text-sans">
                                    <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Active Papers</span>
                                    <span className="text-xs font-black text-[var(--accent-color)]">{papers.length}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#111827] rounded-full overflow-hidden border border-white/5 text-sans">
                                    <div className="h-full bg-gradient-to-r from-[var(--accent-color)] to-[#38bdf8] rounded-full transition-all duration-500" style={{ width: `${Math.min((papers.length / 20) * 100, 100)}%` }}></div>
                                </div>
                            </div>

                            <div className="dark-card p-6 space-y-4 group">
                                <div className="flex justify-between items-center text-sans">
                                    <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Reading Progress</span>
                                    <span className="text-xs font-black text-[#10b981]">{papers.length > 0 ? Math.round((readPapers.length / papers.length) * 100) : 0}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#111827] rounded-full overflow-hidden border border-white/5 text-sans">
                                    <div className="h-full bg-[#10b981] rounded-full transition-all duration-500" style={{ width: `${papers.length > 0 ? (readPapers.length / papers.length) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <section className="space-y-6">
                            <div className="flex items-center space-x-2 text-[#94a3b8]">
                                <Activity className="h-4 w-4" />
                                <h3 className="text-[10px] font-bold uppercase tracking-widest">Workspace Health</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[11px] font-bold text-sans">
                                    <span className="text-[#4b5563] uppercase">Sync Status</span>
                                    {isSyncing ? (
                                        <span className="text-[var(--accent-color)] flex items-center"><RefreshCw className="h-3 w-3 animate-spin mr-2" /> Syncing</span>
                                    ) : (
                                        <span className="text-[#10b981]">Synced</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold text-sans">
                                    <span className="text-[#4b5563] uppercase">Paper Volume</span>
                                    <span className="text-[#e5e7eb]">{papers.length} Doc(s)</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold text-sans">
                                    <span className="text-[#4b5563] uppercase">Last Update</span>
                                    <span className="text-[#e5e7eb] italic">Just now</span>
                                </div>
                            </div>
                        </section>

                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="w-full flex items-center justify-center space-x-2 py-4 bg-[#1e293b] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[#0b1220] transition-all disabled:opacity-50 shadow-lg shadow-[var(--accent-color)]/5"
                        >
                            {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            <span>Sync Knowledge</span>
                        </button>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <div className="flex items-center space-x-2 text-red-500/80">
                                <AlertTriangle className="h-4 w-4" />
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-500/80">Danger Zone</h3>
                            </div>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5 group"
                            >
                                <Trash2 className="h-3.5 w-3.5 group-hover:animate-bounce" />
                                <span>Delete Workspace</span>
                            </button>
                        </div>

                        <button
                            onClick={handleExportSummary}
                            className="w-full flex items-center justify-center space-x-2 py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/20 transition-all"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export Matrix Summary</span>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#4b5563] hover:text-[#e5e7eb] transition-all"
                        >
                            <ChevronLeft className="h-3 w-3" />
                            <span>Return to Main Grid</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1220]/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="space-y-4 text-center">
                            <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                                <AlertTriangle className="h-10 w-10 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tight">Delete Workspace?</h3>
                                <p className="text-[#94a3b8] text-sm text-sans">
                                    This action is <span className="text-red-400 font-bold uppercase tracking-widest text-[10px]">irreversible</span>. Everything will be permanently purged from the matrix:
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                                <BookOpen className="h-4 w-4 text-[var(--accent-color)] mb-1" />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Papers</p>
                                <p className="text-[9px] text-[#4b5563] uppercase">Imported documents</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                                <MessageSquare className="h-4 w-4 text-[#38bdf8] mb-1" />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">AI Matrix</p>
                                <p className="text-[9px] text-[#4b5563] uppercase">Conversations & memory</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                                <FileText className="h-4 w-4 text-[#10b981] mb-1" />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Notes</p>
                                <p className="text-[9px] text-[#4b5563] uppercase">Research findings</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                                <History className="h-4 w-4 text-amber-500 mb-1" />
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Timeline</p>
                                <p className="text-[9px] text-[#4b5563] uppercase">History events</p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleDeleteWorkspace}
                                disabled={isDeleting}
                                className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
                            >
                                {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>
                                    <Trash2 className="h-5 w-5" />
                                    <span>Purge Workspace</span>
                                </>}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-4 text-[#4b5563] font-black uppercase tracking-[0.2em] hover:text-white transition-all text-xs"
                            >
                                Cancel Operation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workspace;
