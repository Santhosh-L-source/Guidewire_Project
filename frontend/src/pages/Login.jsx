import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { login } from '../services/api';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(phone, password);
            toast.success('Login successful');
            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/worker');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed. Try 9876543210 / admin');
        }
    };

    return (
        <div className="min-h-screen flex text-slate-900 relative">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 z-10 bg-white shadow-xl max-w-lg lg:max-w-none">

                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            GigShield
                        </h2>
                    </div>

                    <h2 className="mt-8 text-2xl font-bold text-slate-900">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Or{' '}
                        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                            register as a new worker
                        </Link>
                    </p>

                    <div className="mt-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Phone Number
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Smartphone className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none transition-all shadow-sm"
                                        placeholder="Enter 10-digit number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none transition-all shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors shadow-brand-500/30"
                                >
                                    Sign In <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-brand-600 to-emerald-900">
                <div className="absolute inset-0 h-full w-full object-cover">
                    <div className="absolute inset-0 bg-brand-900 mix-blend-multiply opacity-50" />
                    <div className="h-full flex flex-col justify-center items-start px-24 py-12 relative z-10 text-white">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">AI-Powered Income <br /><span className="text-brand-300">Protection</span> for the Gig Economy</h1>
                        <p className="text-xl max-w-lg text-slate-200">Instant parametric insurance covering weather disruptions (Rain, Heat, Air Quality). No manual claims, automatic payouts.</p>

                        <div className="mt-12 grid grid-cols-2 gap-8">
                            <div className="border border-white/20 bg-white/10 backdrop-blur-md rounded-2xl p-6">
                                <div className="text-3xl mb-2">☔</div>
                                <div className="font-semibold text-lg">Auto-Payouts</div>
                                <div className="text-slate-300 text-sm mt-1">Cash credited instantly when weather triggers hit parameters.</div>
                            </div>
                            <div className="border border-white/20 bg-white/10 backdrop-blur-md rounded-2xl p-6">
                                <div className="text-3xl mb-2">⚡</div>
                                <div className="font-semibold text-lg">Dynamic Pricing</div>
                                <div className="text-slate-300 text-sm mt-1">Smart AI weekly premiums based on accurate live API data.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
