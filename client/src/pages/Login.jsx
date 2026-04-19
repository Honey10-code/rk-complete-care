import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import logo from '../assets/images/LOGO.png';
import loginBg from '../assets/images/login_luxury_bg.png';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', form);

            console.log("LOGIN RESPONSE:", res); // ✅ CHECK
            setError(""); // ✅ VERY IMPORTANT
            localStorage.setItem('token', res.data.token);
            navigate('/admin');
        } catch (err) {
            console.log("LOGIN ERROR FULL:", err); // 👈 ADD THIS
            console.log("LOGIN ERROR RESPONSE:", err.response);
            console.log("TRYING LOGIN...");

            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 font-['Poppins']">
            <Helmet>
                <title>Admin Login | RK Total Physiotherapy Care</title>
                <meta name="description" content="Secure administrator login for managing clinic data and patient appointments." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            {/* Immersive Background */}
            <div className="fixed inset-0 z-0">
                <img src={loginBg} alt="Clinic Background" className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[4px]"></div>
            </div>

            {/* Glassmorphic Login Card */}
            <div className="relative z-10 w-full max-w-md animate-fade-in-up">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
                    {/* Decorative Gradient Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-all duration-700"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-400/30 transition-all duration-700"></div>

                    {/* Logo & Branding */}
                    <div className="text-center mb-">
                        <div className="inline-flex items-center justify-center p-3 bg-white/15 rounded-full mb-4 border-2 border-white/20 shadow-2xl relative">
                            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300/20 via-transparent to-green-300/20 pointer-events-none" />
                            <div className="p-2 rounded-full shadow-lg">
                                <img src={logo} alt="RK Healthcare" className="h-20 w-auto drop-shadow-xl object-contain" />
                            </div>
                        </div>
                        <h1 className="text-white text-4xl font-black tracking-tight mb-2">Welcome back!</h1>
                        <p className="text-blue-400 font-bold text-sm uppercase tracking-[0.25em] mb-4 drop-shadow-sm">RK The Complete Care</p>

                        <p className="text-white/80 text-[13px] leading-relaxed max-w-[300px] mx-auto mb-6 px-4 font-medium">
                            Secure clinic administration for patient care, scheduling, and portal management.
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
                            {[
                                { icon: 'fa-calendar-check', text: 'Appointments' },
                                { icon: 'fa-user-doctor', text: 'Doctors' },
                                { icon: 'fa-shield-halved', text: 'Secure Data' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-white shadow-sm transition-all hover:bg-white/10">
                                    <i className={`fa-solid ${item.icon} text-blue-400`}></i>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-100 text-xs font-bold flex items-center gap-3 backdrop-blur-md">
                            <i className="fa-solid fa-circle-exclamation text-red-400"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-white/50 uppercase tracking-widest ml-5 text-left block">Username</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-300 transition-colors">
                                    <i className="fa-solid fa-user"></i>
                                </span>
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    className="w-full bg-white/10 border border-white/10 pl-16 pr-6 py-4 rounded-2xl text-white placeholder:text-white/40 focus:bg-white/15 focus:border-blue-400/50 outline-none transition-all font-semibold backdrop-blur-sm"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-white/50 uppercase tracking-widest ml-5 text-left block">Password</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-300 transition-colors">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-white/10 border border-white/10 pl-16 pr-16 py-4 rounded-2xl text-white placeholder:text-white/40 focus:bg-white/15 focus:border-blue-400/50 outline-none transition-all font-semibold backdrop-blur-sm"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-blue-900 py-4.5 rounded-2xl font-black text-lg shadow-2xl shadow-black/20 hover:shadow-white/10 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            ) : (
                                "Log in"
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center flex flex-col items-center gap-2">
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                            RK Professional Healthcare Systems
                        </p>
                        <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold">
                            <span className="flex items-center gap-1.5"><i className="fa-solid fa-shield-halved text-blue-400/50"></i> Secure</span>
                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                            <span>v2.0</span>
                        </div>
                    </div>
                </div>

                {/* Footer Copy */}
                <p className="mt-8 text-center text-white/30 text-xs font-medium tracking-wide">
                    &copy; {new Date().getFullYear()} RK Complete Care . All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
