import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/auth';
import { BookOpen, Mail, Lock, ArrowRight, HelpCircle, X, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../services/api';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Forgot Password State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetStep, setResetStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await loginService(email, password);
            login(response.access_token, response.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError('');
        try {
            const res = await api.post('/auth/forgot-password', { email: forgotEmail });
            setSecurityQuestion(res.data.security_question);
            setResetStep(2);
        } catch (err: any) {
            setResetError(err.response?.data?.detail || 'User not found or no security question set');
        } finally {
            setResetLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setResetError('Passwords do not match');
            return;
        }
        setResetLoading(true);
        setResetError('');
        try {
            await api.post('/auth/reset-password', {
                email: forgotEmail,
                security_answer: securityAnswer,
                new_password: newPassword
            });
            setShowForgotModal(false);
            setResetStep(1);
            setForgotEmail('');
            setSecurityAnswer('');
            setNewPassword('');
            setConfirmPassword('');
            alert('Password reset successfully. Please login with your new password.');
        } catch (err: any) {
            setResetError(err.response?.data?.detail || 'Incorrect answer or reset failed');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0b1220] overflow-hidden">
            {/* Left Side: Form */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-[#0b1220] z-10">
                <div className="max-w-md w-full mx-auto space-y-10">
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="bg-[#22c1f1] p-2 rounded-xl">
                            <BookOpen className="h-6 w-6 text-[#0b1220]" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white uppercase">ResearchHub <span className="text-[#22c1f1]">AI</span></span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-extrabold text-[#e5e7eb] tracking-tight leading-none">Welcome back</h1>
                        <p className="text-[#94a3b8] text-lg font-medium">Sign in to continue your academic journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold flex items-center space-x-2 animate-shake">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#22c1f1] text-[#4b5563] transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="researcher@university.edu"
                                        className="block w-full pl-12 pr-4 py-4 bg-[#111827] border border-white/5 rounded-2xl text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#22c1f1]/50 focus:border-[#22c1f1] focus:bg-[#0f172a] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-widest hover:text-[#22c1f1] transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-[#22c1f1] text-[#4b5563] transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full pl-12 pr-4 py-4 bg-[#111827] border border-white/5 rounded-2xl text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#22c1f1]/50 focus:border-[#22c1f1] focus:bg-[#0f172a] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#22c1f1] to-[#38bdf8] text-[#0b1220] font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <span className="text-lg font-bold">Sign In</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>

                    <p className="text-center text-[#94a3b8] font-medium text-sm">
                        New to ResearchHub?{' '}
                        <Link to="/register" className="text-[#38bdf8] font-bold hover:text-[#22c1f1] transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Quote Area */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#0b1220]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#22c1f1] rounded-full blur-[180px] opacity-10 animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[#38bdf8] rounded-full blur-[150px] opacity-10"></div>

                <div className="relative z-10 w-full flex flex-col justify-center items-center px-24 text-center">
                    <div className="bg-[#22c1f1]/10 px-4 py-1.5 rounded-full border border-[#22c1f1]/20 mb-12">
                        <span className="text-[10px] font-bold text-[#22c1f1] uppercase tracking-[0.3em]"># Powered by GROQ </span>
                    </div>

                    <div className="space-y-12">
                        <h2 className="text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                            "Research is formalized curiosity. It is poking and prying with a purpose."
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#e5e7eb]/50 to-transparent mb-6"></div>
                            <p className="text-2xl font-medium text-[#94a3b8] italic">Zora Neale Hurston</p>
                        </div>
                    </div>

                    <div className="absolute bottom-12 flex justify-between items-center w-full px-24 text-[10px] font-bold text-[#4b5563] uppercase tracking-[0.4em]">
                        <span>© 2026 ResearchHub AI</span>
                        <span>Academic Excellence</span>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1220]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
                        <button
                            onClick={() => {
                                setShowForgotModal(false);
                                setResetStep(1);
                                setResetError('');
                            }}
                            className="absolute top-6 right-6 text-[#4b5563] hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 text-[#22c1f1]">
                                < ShieldCheck className="h-6 w-6" />
                                <h3 className="text-xl font-bold text-white">Security Recovery</h3>
                            </div>

                            {resetError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[11px] font-bold">
                                    {resetError}
                                </div>
                            )}

                            {resetStep === 1 && (
                                <form onSubmit={handleForgotStep1} className="space-y-4">
                                    <p className="text-[#94a3b8] text-sm">Enter your email to verify your identity.</p>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                                            <input
                                                type="email"
                                                required
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-[#0b1220] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#22c1f1]/50"
                                                placeholder="researcher@university.edu"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="w-full py-3 bg-[#22c1f1] text-[#0b1220] font-bold rounded-xl hover:bg-[#38bdf8] transition-all disabled:opacity-50"
                                    >
                                        {resetLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Continue'}
                                    </button>
                                </form>
                            )}

                            {resetStep === 2 && (
                                <form onSubmit={(e) => { e.preventDefault(); setResetStep(3); }} className="space-y-4">
                                    <div className="p-4 bg-[#22c1f1]/5 border border-[#22c1f1]/10 rounded-2xl space-y-2">
                                        <span className="text-[10px] font-bold text-[#22c1f1] uppercase tracking-widest">Security Question</span>
                                        <p className="text-sm text-white font-medium">{securityQuestion}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest ml-1">Your Answer</label>
                                        <div className="relative">
                                            <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                                            <input
                                                type="text"
                                                required
                                                value={securityAnswer}
                                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-[#0b1220] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#22c1f1]/50"
                                                placeholder="Type your answer..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-[#22c1f1] text-[#0b1220] font-bold rounded-xl hover:bg-[#38bdf8] transition-all"
                                    >
                                        Continue
                                    </button>
                                </form>
                            )}

                            {resetStep === 3 && (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest ml-1">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                                                <input
                                                    type="password"
                                                    required
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 bg-[#0b1220] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#22c1f1]/50"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-[#4b5563] uppercase tracking-widest ml-1">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                                                <input
                                                    type="password"
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 bg-[#0b1220] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#22c1f1]/50"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="w-full py-3 bg-gradient-to-r from-[#22c1f1] to-[#38bdf8] text-[#0b1220] font-bold rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {resetLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Reset Password'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
