import React, { useState, useEffect } from 'react';
import { User, Settings as SettingsIcon, Cpu, Shield, Save, Palette, Type, SunMoon, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Settings: React.FC = () => {
    const navigate = useNavigate();

    // Profile State
    const [fullName, setFullName] = useState('');
    const [institution, setInstitution] = useState('');
    const [researchField, setResearchField] = useState('');

    // AI Settings State
    const [llmModel, setLlmModel] = useState('llama-3.3-70b-versatile');
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(1024);

    // Privacy State
    const [enableHistory, setEnableHistory] = useState(true);
    const [enableAnalytics, setEnableAnalytics] = useState(true);

    // Appearance State
    const [accentColor, setAccentColor] = useState(localStorage.getItem('theme_accent') || '#22c1f1');
    const [fontSize, setFontSize] = useState(localStorage.getItem('theme_font_size') || '14');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/me');
                const user = response.data;

                setFullName(user.full_name || '');
                setInstitution(user.institution || '');
                setResearchField(user.research_field || '');
                setLlmModel(user.llm_model || 'llama-3.3-70b-versatile');
                setTemperature(user.temperature ?? 0.7);
                setMaxTokens(user.max_tokens ?? 1024);
                setEnableHistory(user.enable_history ?? true);
                setEnableAnalytics(user.enable_analytics ?? true);
            } catch (error) {
                console.error("Failed to load user settings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--accent-color', accentColor);
        document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
        localStorage.setItem('theme_accent', accentColor);
        localStorage.setItem('theme_font_size', fontSize);
    }, [accentColor, fontSize]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await api.put('/users/profile', {
                full_name: fullName,
                institution: institution,
                research_field: researchField
            });
            alert('Profile saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            await api.put('/users/settings', {
                llm_model: llmModel,
                temperature: temperature,
                max_tokens: maxTokens,
                enable_history: enableHistory,
                enable_analytics: enableAnalytics
            });
            alert('Settings saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Delete Account?\n\nThis action will permanently delete your account and all associated research data.')) {
            try {
                await api.delete('/users/me');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('theme_accent');
                localStorage.removeItem('theme_font_size');
                navigate('/login');
            } catch (error) {
                console.error("Failed to delete account", error);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            <header className="space-y-4">
                <div className="flex items-center space-x-3 text-[#38bdf8]">
                    <SettingsIcon className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Engine Configuration</span>
                </div>
                <h1 className="text-6xl font-extrabold text-[#e5e7eb] tracking-tight">System <span className="text-[#4b5563]">Settings</span></h1>
                <p className="text-xl text-[#94a3b8] font-medium mt-2 leading-relaxed">
                    Manage your academic profile, AI engine parameters, and security protocols.
                </p>
            </header>

            <div className="space-y-8">
                {/* Profile Section */}
                <section className="dark-card p-10 space-y-8 border-l-4 border-l-[var(--accent-color)] rounded-2xl relative overflow-hidden">
                    <div className="flex items-center space-x-4 relative z-10">
                        <div className="p-4 bg-[#111827] rounded-2xl border border-white/5 text-[var(--accent-color)]">
                            <User className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Academic Identity</h3>
                            <p className="text-sm text-[#4b5563] font-bold uppercase tracking-widest mt-1">Profile & Credentials</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 bg-[#111827] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30 transition-all font-medium"
                                placeholder="Dr. Jane Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Institution</label>
                            <input
                                type="text"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                className="w-full px-4 py-3 bg-[#111827] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30 transition-all font-medium"
                                placeholder="University of Advanced Studies"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Research Field</label>
                            <input
                                type="text"
                                value={researchField}
                                onChange={(e) => setResearchField(e.target.value)}
                                className="w-full px-4 py-3 bg-[#111827] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30 transition-all font-medium"
                                placeholder="e.g. Quantum Machine Learning"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 relative z-10">
                        <button onClick={handleSaveProfile} disabled={isSaving} className="px-6 py-3 bg-[#111827] border border-white/10 hover:bg-[var(--accent-color)] hover:text-[#0b1220] transition-colors rounded-xl text-xs font-bold uppercase tracking-widest flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>Save Profile</span>
                        </button>
                    </div>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)] rounded-full blur-[120px] opacity-5"></div>
                </section>

                {/* AI Engine Section */}
                <section className="dark-card p-10 space-y-8 border-l-4 border-l-[#38bdf8] rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-[#111827] rounded-2xl border border-white/5 text-[#38bdf8]">
                                <Cpu className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">AI Synthesis Engine</h3>
                                <p className="text-sm text-[#4b5563] font-bold uppercase tracking-widest mt-1">Global LLM Configuration</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-[#38bdf8]/10 border border-[#38bdf8]/20 rounded-xl">
                            <span className="text-xs font-black text-[#38bdf8] uppercase tracking-widest">{llmModel}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">LLM Model</label>
                            <select
                                value={llmModel}
                                onChange={(e) => setLlmModel(e.target.value)}
                                className="w-full px-4 py-3 bg-[#111827] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#38bdf8]/30 transition-all font-medium cursor-pointer"
                            >
                                <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
                                <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant</option>
                                <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center justify-between text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">
                                <span>Temperature</span>
                                <span>{temperature.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="2" step="0.1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full h-2 bg-[#111827] rounded-lg appearance-none cursor-pointer mt-4"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest">Max Tokens</label>
                            <input
                                type="number"
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                className="w-full px-4 py-3 bg-[#111827] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#38bdf8]/30 transition-all font-medium"
                                placeholder="1024"
                            />
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="dark-card p-10 space-y-8 border-l-4 border-l-amber-500 rounded-2xl">
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-[#111827] rounded-2xl border border-white/5 text-amber-500">
                            <Palette className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Appearance & Interface</h3>
                            <p className="text-sm text-[#4b5563] font-bold uppercase tracking-widest mt-1">Theme Engineering</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest flex items-center space-x-2">
                                    <SunMoon className="h-3 w-3" />
                                    <span>Primary Accent</span>
                                </label>
                                <span className="text-[10px] font-mono text-[#4b5563] uppercase">{accentColor}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {['#22c1f1', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setAccentColor(color)}
                                        style={{ backgroundColor: color }}
                                        className={`h-8 w-8 rounded-full border-2 transition-all ${accentColor === color ? 'border-white scale-125' : 'border-transparent hover:scale-110'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest flex items-center space-x-2">
                                    <Type className="h-3 w-3" />
                                    <span>Global Text Scale</span>
                                </label>
                                <span className="text-[10px] font-mono text-[#4b5563]">{fontSize}px</span>
                            </div>
                            <input
                                type="range"
                                min="12" max="18" step="1"
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value)}
                                className="w-full h-2 bg-[#111827] rounded-lg appearance-none cursor-pointer mt-2"
                            />
                        </div>
                    </div>
                </section>

                {/* Privacy Section */}
                <section className="dark-card p-10 space-y-8 border-l-4 border-l-[#10b981] rounded-2xl">
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-[#111827] rounded-2xl border border-white/5 text-[#10b981]">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Privacy & Data</h3>
                            <p className="text-sm text-[#4b5563] font-bold uppercase tracking-widest mt-1">Telemetry and History</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div
                            onClick={() => setEnableHistory(!enableHistory)}
                            className="flex items-center justify-between p-6 bg-[#111827] rounded-2xl border border-white/5 hover:border-[#10b981]/30 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                <Zap className="h-5 w-5 text-[#10b981]" />
                                <span className="text-sm font-bold text-[#e5e7eb] group-hover:text-white transition-colors">Retain Conversation History</span>
                            </div>
                            <div className={`h-6 w-12 rounded-full relative transition-colors ${enableHistory ? 'bg-[#10b981]' : 'bg-[#4b5563]'}`}>
                                <div className={`absolute top-1 h-4 w-4 bg-[#0b1220] rounded-full transition-all ${enableHistory ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>

                        <div
                            onClick={() => setEnableAnalytics(!enableAnalytics)}
                            className="flex items-center justify-between p-6 bg-[#111827] rounded-2xl border border-white/5 hover:border-[#10b981]/30 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                <Shield className="h-5 w-5 text-[#10b981]" />
                                <span className="text-sm font-bold text-[#e5e7eb] group-hover:text-white transition-colors">Share Usage Analytics</span>
                            </div>
                            <div className={`h-6 w-12 rounded-full relative transition-colors ${enableAnalytics ? 'bg-[#10b981]' : 'bg-[#4b5563]'}`}>
                                <div className={`absolute top-1 h-4 w-4 bg-[#0b1220] rounded-full transition-all ${enableAnalytics ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleSaveSettings} disabled={isSaving} className="px-6 py-3 bg-[#111827] border border-white/10 hover:bg-[#10b981] hover:text-[#0b1220] transition-colors rounded-xl text-xs font-bold uppercase tracking-widest flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>Save Settings</span>
                        </button>
                    </div>
                </section>

                {/* Account Section */}
                <section className="dark-card p-10 space-y-8 border-l-4 border-l-red-500 rounded-2xl">
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-[#111827] rounded-2xl border border-white/5 text-red-500">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Account Recovery & Danger Zone</h3>
                            <p className="text-sm text-[#4b5563] font-bold uppercase tracking-widest mt-1">Authentication & Deletion</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button onClick={handleDeleteAccount} className="w-full px-6 py-4 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 transition-colors rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
