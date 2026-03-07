import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, Zap } from 'lucide-react';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatBoxProps {
    workspaceId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ workspaceId }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadingMessages = [
        "Analyzing research papers...",
        "Synthesizing academic findings...",
        "Detecting contradictions...",
        "Generating insights...",
        "Evaluating methodology robustness...",
        "Cross-referencing datasets..."
    ];

    useEffect(() => {
        let interval: any;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading, loadingMessages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post(`/chat/${workspaceId}`, {
                content: currentInput,
            });

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.data.response,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Academic synthesis failed. Please verify your connection.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0b1220] relative">
            {/* Chat Meta Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0f172a]/50 backdrop-blur-xl sticky top-0 z-20">
                <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-[#22c1f1]/10 rounded-xl text-[#22c1f1] border border-[#22c1f1]/20">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-[#e5e7eb] uppercase tracking-[0.2em]">AI Synthesis Engine</h3>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-[9px] text-[#4b5563] font-black uppercase tracking-widest">Active • Llama 3.3 PRO</p>
                        </div>
                    </div>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Zap className="h-4 w-4 text-[#4b5563]" />
                </div>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-10 animate-in fade-in zoom-in duration-700">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#22c1f1] rounded-full blur-3xl opacity-10"></div>
                            <div className="relative p-6 bg-[#111827] rounded-3xl border border-white/5">
                                <Bot className="h-12 w-12 text-[#22c1f1]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-bold text-white tracking-tight">How can I assist your research?</p>
                            <p className="text-xs text-[#94a3b8] leading-relaxed max-w-[280px] mx-auto font-medium">
                                Pose complex queries or request cross-document synthesis. Our AI is primed for academic rigor.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                            {[
                                { text: "Summarize all findings", prompt: "Summarize the key findings from all imported papers in this workspace." },
                                { text: "Identify research gaps", prompt: "Based on the imported papers, identify the current research gaps and future directions." },
                                { text: "Compare methodologies", prompt: "Compare and contrast the methodologies used across the different papers in this workspace." },
                                { text: "List open problems", prompt: "List the open problems and unresolved questions mentioned in these papers." }
                            ].map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(s.prompt)}
                                    className="p-4 bg-[#111827] border border-white/5 rounded-2xl text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest hover:border-[#22c1f1]/30 hover:text-white hover:bg-[#1e293b] transition-all text-left flex items-center space-x-3 group"
                                >
                                    <div className="h-6 w-6 rounded-lg bg-[#22c1f1]/5 flex items-center justify-center group-hover:bg-[#22c1f1]/10 transition-colors">
                                        <Sparkles className="h-3 w-3 text-[#22c1f1]" />
                                    </div>
                                    <span>{s.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const msgKey = `${index}-${msg.role}`;
                    return (
                        <div
                            key={msgKey}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 fade-in duration-500`}
                        >
                            <div className={`flex items-center space-x-3 mb-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`p-1.5 rounded-lg border ${msg.role === 'user' ? 'bg-[#22c1f1]/10 border-[#22c1f1]/20 text-[#22c1f1]' : 'bg-white/5 border-white/10 text-[#94a3b8]'}`}>
                                    {msg.role === 'user' ? <UserIcon className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                </div>
                                <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-[0.2em]">{msg.role === 'user' ? 'Researcher' : 'AI Engine'}</span>
                            </div>
                            <div
                                className={`px-5 py-4 rounded-2xl text-sm leading-relaxed transition-all max-w-[85%] ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-[#22c1f1] to-[#38bdf8] text-[#0b1220] font-bold'
                                    : 'bg-[#111827] text-[#e5e7eb] border border-white/5 font-medium shadow-sm'
                                    }`}
                            >
                                {msg.role === 'assistant' ? (
                                    <div className="markdown-content">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ children }) => <h1 className="text-lg font-black text-[#22c1f1] uppercase tracking-widest mt-4 mb-2">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-sm font-black text-[#22c1f1] uppercase tracking-widest mt-4 mb-2 border-b border-[#22c1f1]/10 pb-1">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider mt-3 mb-1">{children}</h3>,
                                                ul: ({ children }) => <ul className="list-disc ml-4 space-y-1 my-2">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal ml-4 space-y-1 my-2">{children}</ol>,
                                                li: ({ children }) => <li className="marker:text-[#22c1f1]">{children}</li>,
                                                strong: ({ children }) => <strong className="font-black text-[#22c1f1]">{children}</strong>,
                                                blockquote: ({ children }) => <blockquote className="border-l-4 border-[#22c1f1]/30 pl-4 italic my-2 text-[#94a3b8]">{children}</blockquote>,
                                                code: ({ children }) => <code className="bg-[#0b1220] px-1.5 py-0.5 rounded text-[#38bdf8] font-mono text-[12px]">{children}</code>
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {isLoading && (
                    <div className="flex flex-col items-start animate-in fade-in duration-300">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#94a3b8]">
                                <Bot className="h-3 w-3" />
                            </div>
                            <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-[0.2em]">AI Engine</span>
                        </div>
                        <div className="bg-[#111827] border border-white/5 px-6 py-4 rounded-2xl flex items-center space-x-4">
                            <div className="flex space-x-1">
                                <div className="h-1.5 w-1.5 bg-[#22c1f1] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-1.5 w-1.5 bg-[#22c1f1] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-1.5 w-1.5 bg-[#22c1f1] rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-[10px] text-[#22c1f1] font-black uppercase tracking-[0.2em] min-w-[200px]">
                                {loadingMessages[loadingMessageIndex]}
                            </span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-8 bg-gradient-to-t from-[#0b1220] via-[#0b1220] to-transparent sticky bottom-0">
                <div className="flex items-center space-x-3 mb-4 overflow-x-auto pb-2 custom-scrollbar-h scroll-smooth">
                    {[
                        { text: "Summarize Findings", prompt: "Summarize all key findings from the papers in this workspace." },
                        { text: "Identify Gaps", prompt: "What are the current research gaps identified in these documents?" },
                        { text: "Compare Methods", prompt: "Compare the methodologies across these papers." },
                        { text: "Open Problems", prompt: "List the open problems mentioned in the research." }
                    ].map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setInput(s.prompt)}
                            className="whitespace-nowrap flex-shrink-0 px-4 py-2.5 bg-[#111827] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[#22c1f1] hover:border-[#22c1f1]/30 hover:bg-[#1e293b] transition-all flex items-center space-x-2 shadow-xl shadow-black/20 group"
                        >
                            <Sparkles className="h-3 w-3 text-[#22c1f1] opacity-50 group-hover:opacity-100 transition-opacity" />
                            <span>{s.text}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSend} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#22c1f1]/20 to-[#38bdf8]/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                    <div className="relative">
                        <textarea
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e as any);
                                }
                            }}
                            disabled={isLoading}
                            placeholder="Ask a scholarly question..."
                            className="w-full pl-6 pr-16 py-5 bg-[#0f172a] border border-white/5 rounded-2xl text-sm text-white placeholder-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#22c1f1]/30 transition-all resize-none min-h-[60px] max-h-40 custom-scrollbar"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-[#22c1f1] to-[#38bdf8] text-[#0b1220] rounded-xl disabled:opacity-30 transition-all active:scale-95"
                            title="Generate Synthesis"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </button>
                    </div>
                </form>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-[9px] text-[#4b5563] font-black uppercase tracking-[0.3em]">
                        Context: {workspaceId ? 'Workspace Active' : 'Global Search'}
                    </p>
                    <div className="flex items-center space-x-2">
                        <div className="h-1 w-1 rounded-full bg-emerald-500"></div>
                        <span className="text-[9px] text-[#4b5563] font-black uppercase tracking-[0.3em]">Encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
