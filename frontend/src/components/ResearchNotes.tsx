import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

interface ResearchNotesProps {
    workspaceId: string;
}

const ResearchNotes: React.FC<ResearchNotesProps> = ({ workspaceId }) => {
    const [notes, setNotes] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchNotes();
    }, [workspaceId]);

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/research/notes/${workspaceId}`);
            setNotes(response.data);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newNote.title || !newNote.content) return;
        try {
            await api.post(`/research/notes/${workspaceId}`, newNote);
            setNewNote({ title: '', content: '' });
            setIsAdding(false);
            fetchNotes();
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/research/notes/${id}`);
            fetchNotes();
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#10b981]">
                    <Edit3 className="h-4 w-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Research Notes</h3>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-[#94a3b8] hover:text-[#10b981] transition-all"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {isAdding && (
                <div className="dark-card p-4 space-y-4 animate-in fade-in zoom-in duration-300">
                    <input
                        type="text"
                        placeholder="Note Title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="w-full bg-[#111827] border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <textarea
                        placeholder="Start typing..."
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        className="w-full bg-[#111827] border border-white/5 rounded-lg px-3 py-2 text-xs text-white min-h-[100px]"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-[10px] font-bold text-[#4b5563] uppercase">Cancel</button>
                        <button onClick={handleCreate} className="px-3 py-1 bg-[#10b981] rounded-lg text-[10px] font-black text-[#0b1220] uppercase tracking-widest">Save Note</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 text-[#10b981] animate-spin" /></div>
                ) : notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note.id} className="dark-card p-4 group relative">
                            <button
                                onClick={() => handleDelete(note.id)}
                                className="absolute top-4 right-4 text-[#4b5563] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                            <h4 className="text-xs font-bold text-[#e5e7eb] mb-2">{note.title}</h4>
                            <p className="text-[11px] text-[#94a3b8] leading-relaxed">{note.content}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-[#4b5563] uppercase">{new Date(note.created_at).toLocaleDateString()}</span>
                                {note.is_ai_generated && <span className="text-[9px] font-bold text-[#22c1f1] uppercase tracking-widest flex items-center"><Sparkles className="h-2 w-2 mr-1" /> AI Assisted</span>}
                            </div>
                        </div>
                    ))
                ) : !isAdding && (
                    <div className="dark-card p-10 text-center opacity-50 border-dashed">
                        <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">No research notes yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchNotes;
