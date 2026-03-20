import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, MapPin, Briefcase, Phone, Lock, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import { register } from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        city: 'Chennai',
        zone: '',
        platform: 'Zomato',
        weeklyEarnings: '',
        experienceYears: '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        toast.info('Analyzing risk profile via Open-Meteo data...', { autoClose: 2000 });

        try {
            // Map the frontend names to the backend keys
            const payload = {
                name: formData.name,
                phone: formData.phone,
                password: formData.password,
                city: formData.city,
                zone: formData.zone,
                platform: formData.platform,
                weekly_earnings: parseInt(formData.weeklyEarnings, 10),
                experience_years: parseInt(formData.experienceYears, 10)
            };
            const data = await register(payload);
            toast.success(`Registered successfully! Profile: ${data.riskProfile?.tier} Risk.`);
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">

                <div className="bg-brand-600 px-8 py-10 text-white text-center rounded-t-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-900 opacity-20 mix-blend-multiply"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-xl mb-4">
                            <Shield size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Worker Onboarding</h2>
                        <p className="mt-2 text-brand-100 max-w-md">Join GigShield to get instant algorithmic income protection against weather and municipal disruptions.</p>
                    </div>
                </div>

                <form onSubmit={handleRegister} className="px-8 py-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none" placeholder="Rajesh Kumar" />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none" placeholder="9876543210" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none" placeholder="••••••••" />
                            </div>
                        </div>

                        {/* Platform */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Delivery Platform</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-slate-400" />
                                </div>
                                <select name="platform" value={formData.platform} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none">
                                    <option value="Zomato">Zomato</option>
                                    <option value="Swiggy">Swiggy</option>
                                </select>
                            </div>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">City</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                </div>
                                <select name="city" value={formData.city} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none">
                                    <option value="Chennai">Chennai</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                </select>
                            </div>
                        </div>

                        {/* Zone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Delivery Zone</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                </div>
                                <input required type="text" name="zone" value={formData.zone} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none" placeholder="e.g. Andheri East" />
                            </div>
                        </div>

                        {/* Earnings */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Avg Weekly Earnings</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IndianRupee className="h-5 w-5 text-slate-400" />
                                </div>
                                <input required type="number" name="weeklyEarnings" value={formData.weeklyEarnings} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none" placeholder="4500" />
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Experience (Years)</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-slate-400" />
                                </div>
                                <input required type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none" placeholder="2" />
                            </div>
                        </div>

                        {/* Mock Aadhaar */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Aadhaar Number (Mock Verification)</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input required type="text" className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-slate-50 outline-none" placeholder="XXXX XXXX XXXX" />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Only needed for basic identity check. No actual API call will be made.</p>
                        </div>

                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-center sm:items-center">
                        <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                            Already have an account? Sign in
                        </Link>
                        <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-8 border border-transparent rounded-xl shadow-sm md:shadow-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors">
                            Evaluate Risk & Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
