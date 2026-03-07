import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerService } from '../services/auth';
import { BookOpen, Mail, Lock, UserPlus } from 'lucide-react';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await registerService(email, password, securityQuestion, securityAnswer);
            login(response.access_token, response.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const securityQuestions = [
        "What was the name of your first pet?",
        "What is your mother's maiden name?",
        "What was the name of your elementary school?",
        "In what city were you born?",
        "What is your favorite book?",
        "What was your childhood nickname?"
    ];

    return (
        <div className="min-h-screen flex bg-[#0b1220] overflow-hidden">
            {/* Left Side: Quote Area */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#0b1220]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#22c1f1] rounded-full blur-[180px] opacity-10 animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-[#38bdf8] rounded-full blur-[150px] opacity-10"></div>

                <div className="relative z-10 w-full flex flex-col justify-center items-center px-24 text-center">
                    <div className="bg-[#22c1f1]/10 px-4 py-1.5 rounded-full border border-[#22c1f1]/20 mb-12">
                        <span className="text-[10px] font-bold text-[#22c1f1] uppercase tracking-[0.3em]"># Join the community</span>
                    </div>

                    <div className="space-y-12">
                        <h2 className="text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                            "The important thing is not to stop questioning. Curiosity has its own reason for existence."
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#e5e7eb]/50 to-transparent mb-6"></div>
                            <p className="text-2xl font-medium text-[#94a3b8] italic">Albert Einstein</p>
                        </div>
                    </div>

                    <div className="absolute bottom-12 flex justify-between items-center w-full px-24 text-[10px] font-bold text-[#4b5563] uppercase tracking-[0.4em]">
                        <span>© 2026 ResearchHub AI</span>
                        <span>Academic Excellence</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-[#0b1220] z-10 border-l border-white/5">
                <div className="max-w-md w-full mx-auto space-y-8 py-12 scrollbar-hide overflow-y-auto">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-[#22c1f1] p-2 rounded-xl">
                            <BookOpen className="h-6 w-6 text-[#0b1220]" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white uppercase">ResearchHub <span className="text-[#22c1f1]">AI</span></span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-extrabold text-[#e5e7eb] tracking-tight leading-none">Create account</h1>
                        <p className="text-[#94a3b8] text-lg font-medium">Join thousands of researchers worldwide.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold flex items-center space-x-2 animate-shake">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
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
                                        className="block w-full pl-12 pr-4 py-3 bg-[#111827] border border-white/5 rounded-2xl text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#22c1f1]/50 focus:border-[#22c1f1] focus:bg-[#0f172a] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] ml-1">Password</label>
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
                                        className="block w-full pl-12 pr-4 py-3 bg-[#111827] border border-white/5 rounded-2xl text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#22c1f1]/50 focus:border-[#22c1f1] focus:bg-[#0f172a] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <p className="text-[10px] font-black text-[#22c1f1] uppercase tracking-[0.3em] mb-2">Account Recovery</p>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] ml-1">Security Question</label>
                                    <select
                                        required
                                        value={securityQuestion}
                                        onChange={(e) => setSecurityQuestion(e.target.value)}
                                        className="block w-full px-4 py-3 bg-[#111827] border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#22c1f1]/50 focus:border-[#22c1f1] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select a recovery question</option>
                                        {securityQuestions.map(q => (
                                            <option key={q} value={q}>{q}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.2em] ml-1">Security Answer</label>
                                    <input
                                        type="text"
                                        required
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                        placeholder="Your secret answer..."
                                        className="block w-full px-4 py-3 bg-[#111827] border border-white/5 rounded-2xl text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#22c1f1]/50 focus:border-[#22c1f1] focus:bg-[#0f172a] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-[#22c1f1] to-[#38bdf8] text-[#0b1220] font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <span className="text-lg font-bold">Create Account</span>
                            <UserPlus className="h-5 w-5" />
                        </button>
                    </form>

                    <p className="text-center text-[#94a3b8] font-medium text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#38bdf8] font-bold hover:text-[#22c1f1] transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
