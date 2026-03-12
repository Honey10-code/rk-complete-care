import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import logo from '../assets/images/LOGO.png';

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
            const res = await axios.post('/api/auth/login', form);
            localStorage.setItem('token', res.data.token);
            navigate('/admin');
        } catch (err) {
            if (!err.response) {
                setError('Network error: Unable to connect to the server.');
            } else {
                setError(err.response.data?.msg || 'Invalid credentials. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#f4f7f8' }}>

            {/* ── Left Panel – Brand / Hero ────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-14"
                style={{ background: 'linear-gradient(145deg, #0f172a 0%, #0f766e 50%, #1a2d3d 100%)' }}>

                {/* Ambient orbs */}
                <motion.div
                    animate={{ scale: [1, 1.25, 1], x: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
                    style={{ background: 'rgba(13, 148, 136,0.18)', filter: 'blur(90px)' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], y: [0, 30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: 'rgba(217, 119, 6,0.12)', filter: 'blur(80px)' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, delay: 4 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
                    style={{ background: 'rgba(13, 148, 136,0.10)', filter: 'blur(60px)' }}
                />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.035]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-2.5 rounded-2xl shrink-0" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <img src={logo} alt="RK The Complete Care" className="h-12 w-auto object-contain"
                            onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div>
                        <p className="text-white font-black text-[22px] leading-tight">RK The Complete Care</p>
                        <p className="font-semibold text-[22px]" style={{ color: '#2dd4bf' }}>Physiotherapy Centre</p>
                    </div>
                </div>

                {/* Hero Text */}
                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-5xl font-black text-white leading-tight mb-6"
                    >
                        Admin <span style={{ color: '#2dd4bf' }}>Dashboard</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg leading-relaxed mb-10"
                        style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                        Manage appointments, doctors, testimonials, clinic posters and patient stories — all from one secure panel.
                    </motion.p>

                    {/* Feature pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-wrap gap-3"
                    >
                        {[
                            { icon: 'fa-calendar-check', label: 'Appointments' },
                            { icon: 'fa-user-doctor', label: 'Doctors' },
                            { icon: 'fa-images', label: 'Clinic Posters' },
                            { icon: 'fa-heart-pulse', label: 'Patient Stories' },
                            { icon: 'fa-star', label: 'Testimonials' },
                        ].map(f => (
                            <span key={f.label}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(8px)' }}>
                                <i className={`fa-solid ${f.icon} text-xs`} style={{ color: '#2dd4bf' }}></i>
                                {f.label}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="relative z-10 flex items-center justify-between pt-6"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
                        © {new Date().getFullYear()} RK The Complete Care. Secure portal.
                    </p>
                    <span className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#2dd4bf' }}>
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        System Online
                    </span>
                </div>
            </div>

            {/* ── Right Panel – Login Form ──────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">

                {/* Subtle bg orb */}
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
                    style={{ background: 'rgba(13, 148, 136,0.06)', filter: 'blur(70px)' }} />
                <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full pointer-events-none"
                    style={{ background: 'rgba(217, 119, 6,0.05)', filter: 'blur(60px)' }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="p-2 rounded-xl shrink-0" style={{ background: 'rgba(13, 148, 136,0.10)', border: '1px solid rgba(13, 148, 136,0.18)' }}>
                            <img src={logo} alt="RK" className="h-9 w-auto object-contain" onError={e => e.target.style.display = 'none'} />
                        </div>
                        <div>
                            <p className="font-black text-slate-800 leading-tight text-[15px]">RK The Complete Care</p>
                            <p className="font-semibold text-[15px]" style={{ color: '#0d9488' }}>Physiotherapy Centre</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
                            style={{ background: 'rgba(13, 148, 136,0.08)', border: '1px solid rgba(13, 148, 136,0.18)', color: '#0d9488' }}>
                            <i className="fa-solid fa-lock"></i>
                            Secure Access
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 mb-2">Welcome back</h2>
                        <p className="text-slate-500 text-base">Sign in to your admin dashboard</p>
                    </div>

                    {/* Error alert */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                className="flex items-center gap-3 p-4 rounded-2xl mb-6 text-sm font-medium"
                                style={{ background: 'rgba(138,64,64,0.08)', border: '1px solid rgba(138,64,64,0.18)', color: '#8a4040' }}
                            >
                                <i className="fa-solid fa-circle-exclamation text-base flex-shrink-0"></i>
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <i className="fa-solid fa-user text-sm"></i>
                                </span>
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    placeholder="Enter username"
                                    required
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl border bg-white text-slate-800 placeholder-slate-400 text-sm font-medium outline-none transition-all"
                                    style={{ borderColor: 'rgba(13, 148, 136,0.25)' }}
                                    onFocus={e => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13, 148, 136,0.12)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(13, 148, 136,0.25)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <i className="fa-solid fa-lock text-sm"></i>
                                </span>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="Enter password"
                                    required
                                    className="w-full pl-11 pr-12 py-4 rounded-2xl border bg-white text-slate-800 placeholder-slate-400 text-sm font-medium outline-none transition-all"
                                    style={{ borderColor: 'rgba(13, 148, 136,0.25)' }}
                                    onFocus={e => { e.target.style.borderColor = '#0d9488'; e.target.style.boxShadow = '0 0 0 3px rgba(13, 148, 136,0.12)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(13, 148, 136,0.25)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-black text-base transition-all duration-300 mt-2"
                            style={{
                                background: loading ? '#5a8a9a' : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                boxShadow: loading ? 'none' : '0 8px 24px rgba(13, 148, 136,0.35)',
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                    Sign In to Dashboard
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer note */}
                    <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
                        <i className="fa-solid fa-shield-halved mr-1.5" style={{ color: '#0d9488' }}></i>
                        This portal is restricted to authorized personnel only.<br />
                        Unauthorized access is strictly prohibited.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
