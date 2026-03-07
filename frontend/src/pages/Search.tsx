import React, { useState } from 'react';
import {
    Search as SearchIcon,
    Database,
    Zap,
    TrendingUp,
    Layers,
    ChevronRight,
    Globe,
    Loader2
} from 'lucide-react';
import api from '../services/api';
import PaperCard from '../components/PaperCard';
import type { Paper } from '../types/paper';

const trendingTopics = [
    "Generative AI",
    "Quantum Computing",
    "Sustainable Food Systems",
    "Neural Networks",
    "AI Ethics"
];

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [papers, setPapers] = useState<Paper[]>([]);
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(JSON.parse(localStorage.getItem('recent_searches') || '[]'));

    React.useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const response = await api.get('/workspaces/');
            setWorkspaces(response.data);
            if (response.data.length > 0) {
                setSelectedWorkspace(response.data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch workspaces:', error);
        }
    };

    const handleAutoSearch = async (searchQuery: string) => {
        setIsLoading(true);
        setHasSearched(true);

        // Save to recent searches
        const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem('recent_searches', JSON.stringify(updatedRecent));

        try {
            const response = await api.get(`/papers/search?query=${searchQuery}`);

            const normalizedPapers = (response.data.papers || []).map((p: any) => ({
                paperId: p.paperId,
                title: p.title,
                authors: p.authors || 'Unknown Authors',
                year: p.year,
                abstract: p.abstract,
                url: p.url,
                publish_date: p.publicationDate || null
            }));
            setPapers(normalizedPapers);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        handleAutoSearch(query);
    };

    const handleTopicClick = (topic: string) => {
        setQuery(topic);
        handleAutoSearch(topic);
    };

    const handleImport = async (paper: Paper) => {
        if (!selectedWorkspace && workspaces.length > 0) {
            alert('Please select a workspace first.');
            return;
        }

        try {
            await api.post('/papers/import', {
                title: paper.title,
                authors: Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors,
                abstract: paper.abstract,
                published_date: paper.publish_date || null,
                year: paper.year || null,
                source_url: paper.url || null,
                workspace_id: selectedWorkspace
            });
            alert(`Paper imported to workspace successfully!`);
        } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import paper.');
        }
    };

    return (
        <div className="flex gap-8">
            {/* Main Search Area */}
            <div className="flex-1 space-y-10 animate-in fade-in duration-700">
                {/* Header */}
                <header className="space-y-4">
                    <div className="flex items-center space-x-3 text-[var(--accent-color)]">
                        <Globe className="h-4 w-4 animate-spin-slow" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Global Academic Network</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-extrabold text-[#e5e7eb] tracking-tight">Paper <span className="text-[#4b5563]">Discovery</span></h1>
                        <p className="text-xl text-[#94a3b8] font-medium mt-2 max-w-2xl">
                            Search across millions of academic papers using our proprietary AI indexing engine.
                        </p>
                    </div>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="dark-card p-6 flex items-center space-x-4 border-b-2 border-b-[var(--accent-color)]">
                        <div className="p-3 bg-[#111827] rounded-xl text-[var(--accent-color)]">
                            <Database className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Papers Indexed</p>
                            <p className="text-2xl font-black text-white">1.2M+</p>
                        </div>
                    </div>
                    <div className="dark-card p-6 flex items-center space-x-4 border-b-2 border-b-[#38bdf8]">
                        <div className="p-3 bg-[#111827] rounded-xl text-[#38bdf8]">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">API Latency</p>
                            <p className="text-2xl font-black text-white">142ms</p>
                        </div>
                    </div>
                    <div className="dark-card p-6 flex items-center space-x-4 border-b-2 border-b-[#111827]">
                        <div className="p-3 bg-[#111827] rounded-xl text-[#4b5563]">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Daily Requests</p>
                            <p className="text-2xl font-black text-white">45.2k</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar & Recent Searches */}
                <div className="space-y-4">
                    <form onSubmit={handleSearch} className="relative group">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-[#4b5563] group-focus-within:text-[var(--accent-color)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or keywords (e.g. 'Quantum Computing')..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-16 pr-40 py-6 bg-[#0f172a] border border-white/5 rounded-2xl text-xl text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-10 py-3.5 bg-gradient-to-r from-[var(--accent-color)] to-[#38bdf8] text-[#0b1220] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span>Search</span><ChevronRight className="h-4 w-4" /></>}
                        </button>
                    </form>

                    {recentSearches.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 px-2">
                            <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Recent:</span>
                            {recentSearches.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleTopicClick(s)}
                                    className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-[#94a3b8] hover:border-[var(--accent-color)]/30 hover:text-white transition-all uppercase tracking-widest"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <section className="space-y-6">
                    {hasSearched && (
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center space-x-2 text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.3em]">
                                <Layers className="h-4 w-4" />
                                <span>Showing {papers.length} scholarly results</span>
                            </div>

                            {workspaces.length > 0 && (
                                <div className="flex items-center space-x-4">
                                    <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Target Workspace:</span>
                                    <select
                                        value={selectedWorkspace}
                                        onChange={(e) => setSelectedWorkspace(e.target.value)}
                                        className="bg-[#111827] border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30 transition-all cursor-pointer"
                                    >
                                        {workspaces.map(ws => (
                                            <option key={ws.id} value={ws.id}>{ws.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}


                    <div className="space-y-4 pb-12">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-48 dark-card animate-pulse"></div>
                            ))
                        ) : papers.length > 0 ? (
                            papers.map((paper) => (
                                <PaperCard
                                    key={paper.id || paper.title}
                                    paper={paper}
                                    onImport={handleImport}
                                />
                            ))
                        ) : hasSearched && (
                            <div className="dark-card p-20 text-center space-y-4">
                                <div className="p-4 bg-[#111827] rounded-full inline-block border border-white/5 text-[#4b5563]">
                                    <SearchIcon className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#e5e7eb]">No papers found</h3>
                                <p className="text-[#94a3b8] max-w-xs mx-auto">Try adjusting your search terms or browsing trending topics.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Right Sidebar: Trending Topics */}
            <aside className="hidden lg:block w-[300px] space-y-8 animate-in slide-in-from-right duration-700 pt-12">
                <section className="dark-card p-6 space-y-6 bg-gradient-to-br from-[#0f172a] to-[#0b1220] border-l-2 border-l-[var(--accent-color)]">
                    <div className="flex items-center space-x-2 text-[var(--accent-color)]">
                        <TrendingUp className="h-4 w-4" />
                        <h3 className="text-[12px] font-black uppercase tracking-[0.2em]">Trending Research</h3>
                    </div>

                    <div className="space-y-3">
                        {trendingTopics.map(topic => (
                            <button
                                key={topic}
                                onClick={() => handleTopicClick(topic)}
                                className="w-full text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-[#94a3b8] hover:border-[var(--accent-color)]/30 hover:text-white hover:bg-[var(--accent-color)]/5 transition-all uppercase tracking-widest flex items-center justify-between group"
                            >
                                <span>{topic}</span>
                                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </section>
            </aside>
        </div>
    );
};

export default Search;
