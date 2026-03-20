import React, { useState, useEffect } from 'react';
import { IndianRupee, LogOut, Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PolicyCard from '../components/PolicyCard';
import WeatherRiskCard from '../components/WeatherRiskCard';
import ClaimsTable from '../components/ClaimsTable';
import { getWorkerDashboard, renewPolicy, createPolicy } from '../services/api';
import { toast } from 'react-toastify';

export default function WorkerHome() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showManualClaim, setShowManualClaim] = useState(false);

    const fetchData = async () => {
        try {
            const res = await getWorkerDashboard();
            setData(res);
        } catch (err) {
            toast.error("Failed to load dashboard data");
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleRenew = async () => {
        try {
            toast.info('Renewing your policy...');
            await renewPolicy();
            toast.success('Policy successfully renewed for next week!');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Renewal failed');
        }
    };

    const handleCreatePolicy = async (plan) => {
        try {
            toast.info(`Activating ${plan} plan...`);
            await createPolicy({ planName: plan });
            toast.success(`${plan} Plan activated successfully!`);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Activation failed');
        }
    };

    if (loading || !data) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading Dashboard...</div>;
    }

    const { worker, activePolicy, claims, earnings } = data;

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-brand-500 rounded-lg p-1.5 text-white">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-slate-900">GigShield</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-slate-500 hover:text-slate-700 relative">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>
                            <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-600">
                                {worker.name.charAt(0)}
                            </div>
                            <button onClick={handleLogout} className="text-slate-500 hover:text-slate-700 ml-2 hidden sm:block">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Welcome Banner */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {worker.name} 👋</h1>
                    <p className="text-slate-500">Here's your income protection summary for today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Policy & Earnings */}
                    <div className="lg:col-span-2 space-y-8">
                        {activePolicy ? (
                            <PolicyCard
                                planName={activePolicy.plan_name}
                                premium={activePolicy.weekly_premium}
                                coverage={activePolicy.coverage_amount}
                                validFrom={new Date(activePolicy.valid_from).toLocaleDateString()}
                                validTo={new Date(activePolicy.valid_to).toLocaleDateString()}
                                onRenew={handleRenew}
                            />
                        ) : (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800">No Active Policy</h3>
                                <p className="text-slate-500 text-sm mt-1 mb-4">You must activate coverage to be protected this week.</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleCreatePolicy('Basic')} className="bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Basic Plan</button>
                                    <button onClick={() => handleCreatePolicy('Standard')} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Standard Plan</button>
                                    <button onClick={() => handleCreatePolicy('Premium')} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Premium Plan</button>
                                </div>
                            </div>
                        )}

                        {/* Earnings Protected Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-brand-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                                <div className="text-slate-500 text-sm font-medium mb-1 relative z-10">Protected This Week</div>
                                <div className="text-2xl font-bold text-slate-900 flex items-center relative z-10">
                                    <IndianRupee className="w-5 h-5 text-slate-400 mr-1" />{earnings.thisWeek}
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-brand-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                                <div className="text-slate-500 text-sm font-medium mb-1 relative z-10">Protected This Month</div>
                                <div className="text-2xl font-bold text-slate-900 flex items-center relative z-10">
                                    <IndianRupee className="w-5 h-5 text-slate-400 mr-1" />{earnings.thisMonth}
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                                <div className="text-emerald-600 text-sm font-bold mb-1 relative z-10">Lifetime Total</div>
                                <div className="text-2xl font-bold text-emerald-700 flex items-center relative z-10">
                                    <IndianRupee className="w-5 h-5 mr-1" />{earnings.lifetime}
                                </div>
                            </div>
                        </div>

                        <ClaimsTable claims={claims.map(c => ({ type: c.trigger_type, date: c.created_at, amount: c.payout_amount, status: c.status }))} />

                    </div>

                    {/* Right Column: Risk Profiler */}
                    <div className="space-y-8">
                        <WeatherRiskCard city={worker.city} />

                        {/* Help / Support CTA */}
                        <div className="bg-slate-800 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 opacity-50"></div>
                            <div className="relative z-10">
                                <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                                <p className="text-slate-300 text-sm mb-4">Payouts are completely automatic, but if an event was missed, you can dispute it here.</p>
                                <button onClick={() => setShowManualClaim(true)} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2 rounded-xl text-sm font-semibold transition-colors">
                                    File Manual Claim
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* Manual Claim Modal */}
            {showManualClaim && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">File Manual Claim</h3>
                            <p className="text-sm text-slate-500 mb-6">Missed an automatic payout? Upload proof of social disruption or strike to file a manual claim.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Disruption Date</label>
                                    <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Disaster Type</label>
                                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 outline-none">
                                        <option>Social Disruption / Curfew</option>
                                        <option>City-wide Strike</option>
                                        <option>Major App Outage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Upload Photo Proof</label>
                                    <input type="file" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button onClick={() => setShowManualClaim(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button onClick={() => {
                                    toast.success('Manual claim submitted! It is now under review by our Admin team.');
                                    setShowManualClaim(false);
                                }} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-colors">
                                    Submit Claim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Inline icon since it's only used here
function ShieldCheckIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
