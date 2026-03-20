import React, { useState, useEffect } from 'react';
import { IndianRupee, Users, AlertTriangle, Activity, Settings, LogOut, Search, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DisruptionMap from '../components/DisruptionMap';
import { PremiumVsClaimsChart, ClaimsByTriggerChart } from '../components/AdminCharts';
import { getAdminOverview, getAdminClaims, manualTrigger, reviewClaim } from '../services/api';
import { toast } from 'react-toastify';

const cityRiskData = [
    { city: 'Chennai', temp: '33°', aqi: '120', rain: '8mm', policies: 452, exposure: 452000 },
    { city: 'Mumbai', temp: '29°', aqi: '85', rain: '0mm', policies: 530, exposure: 530000 },
    { city: 'Bangalore', temp: '26°', aqi: '90', rain: '2mm', policies: 490, exposure: 245000 },
    { city: 'Delhi', temp: '40°', aqi: '320', rain: '0mm', policies: 240, exposure: 480000 },
    { city: 'Hyderabad', temp: '38°', aqi: '145', rain: '0mm', policies: 133, exposure: 133000 }
];

export default function AdminHome() {
    const navigate = useNavigate();
    const [triggerCity, setTriggerCity] = useState('Chennai');
    const [triggerType, setTriggerType] = useState('Social Disruption');
    const [overview, setOverview] = useState(null);
    const [claims, setClaims] = useState([]);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadError(null);
                const [stats, claimsData] = await Promise.all([getAdminOverview(), getAdminClaims()]);
                setOverview(stats);
                setClaims(Array.isArray(claimsData) ? claimsData : []);
            } catch (err) {
                console.error('Admin data fetch error:', err);
                const status = err?.response?.status;
                if (status === 401 || status === 403) {
                    toast.error("Session expired or unauthorized. Please login again.");
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    const msg = err?.message || 'Unknown error';
                    setLoadError(msg);
                    toast.error(`Failed to load admin data: ${msg}. Is the backend server running on port 5000?`);
                }
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleManualTrigger = async (e) => {
        e.preventDefault();
        try {
            await manualTrigger({ city: triggerCity, triggerType, durationHours: 4 });
            toast.success(`Manual trigger for ${triggerType} broadcasted to ${triggerCity} workers.`);
            // refresh data safely
            const [stats, claimsData] = await Promise.all([getAdminOverview(), getAdminClaims()]);
            setOverview(stats); setClaims(claimsData);
        } catch (err) {
            toast.error("Manual trigger failed");
        }
    };

    const handleClaimAction = async (id, action) => {
        try {
            await reviewClaim(id, action);
            toast.info(`Claim ${id} ${action} manually.`);
            const claimsData = await getAdminClaims();
            setClaims(claimsData);
        } catch (err) {
            toast.error("Action failed");
        }
    };

    if (loadError) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
            <div className="text-red-600 font-bold text-lg">Failed to load admin dashboard</div>
            <div className="text-slate-600 text-sm">{loadError}</div>
            <div className="text-slate-500 text-sm">Make sure the backend server is running on <code className="bg-slate-200 px-2 py-0.5 rounded">http://localhost:5000</code></div>
            <button onClick={() => window.location.reload()} className="mt-2 bg-brand-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-brand-700">Retry</button>
        </div>
    );

    if (!overview) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold">Loading Admin...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Navbar Header */}
            <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-brand-500 rounded-lg p-1.5 text-white">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight text-white">GigShield Admin</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300">
                            <button className="hover:text-white transition-colors p-2 text-sm font-semibold flex items-center gap-2">
                                <Settings className="w-4 h-4" /> System Config
                            </button>
                            <button onClick={handleLogout} className="hover:text-white transition-colors p-2 text-sm font-semibold flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

                {/* Top Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <StatCard title="Active Policies" value={overview?.activePolicies || 0} icon={<Users />} color="blue" />
                    <StatCard title="Premium Collected" value={`₹${(overview?.premiumsCollected || 0).toLocaleString()}`} icon={<IndianRupee />} color="emerald" />
                    <StatCard title="Payouts This Week" value={`₹${(overview?.payoutsThisWeek || 0).toLocaleString()}`} icon={<IndianRupee />} color="orange" />
                    <StatCard title="Loss Ratio" value={`${overview?.lossRatio || 0}%`} icon={<Activity />} color="indigo" />
                    <StatCard title="Active Fraud Flags" value={overview?.activeFlags || 0} icon={<AlertTriangle />} color="red" />
                </div>

                {/* Middle Row: Map & Manual Trigger */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">Live Disruption Map</h2>
                        <DisruptionMap />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">Manual / Social Trigger</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-[400px] flex flex-col justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-6">Use this to manually trigger a parametric payout for non-weather municipal events (e.g. Strike, Curfew, App Outage).</p>

                                <form onSubmit={handleManualTrigger} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Select City</label>
                                        <select value={triggerCity} onChange={(e) => setTriggerCity(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none">
                                            <option value="Chennai">Chennai</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Hyderabad">Hyderabad</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Event Type</label>
                                        <select value={triggerType} onChange={(e) => setTriggerType(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none">
                                            <option value="Social Disruption">Social Disruption / Curfew</option>
                                            <option value="App Outage">Major App Outage</option>
                                            <option value="City Strike">City-wide Strike</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Estimated Disruption Hours</label>
                                        <input type="number" defaultValue="4" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none" />
                                    </div>

                                    <button type="submit" className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Broadcast Trigger Now
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Third Row: Charts & City Risk Table */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-sm font-semibold text-slate-600 mb-4 border-b pb-2">Weekly Premium vs Payouts</h3>
                            <PremiumVsClaimsChart />

                            <h3 className="text-sm font-semibold text-slate-600 mb-4 mt-8 border-b pb-2">Claims by Trigger Event</h3>
                            <ClaimsByTriggerChart />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">City Risk Profile & Exposure</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 bg-slate-50 border-b">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">City</th>
                                        <th className="px-5 py-4 font-semibold text-center">Live Risks (T/AQI/R)</th>
                                        <th className="px-5 py-4 font-semibold text-right">Policies</th>
                                        <th className="px-5 py-4 font-semibold text-right">Max Exposure (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cityRiskData.map((data, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-5 py-4 font-semibold text-slate-800">{data.city}</td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="text-orange-600 font-medium">{data.temp}</span> /
                                                <span className={parseInt(data.aqi) > 200 ? 'text-red-500 font-bold ml-1' : 'text-slate-500 ml-1'}>{data.aqi}</span> /
                                                <span className="text-blue-500 ml-1">{data.rain}</span>
                                            </td>
                                            <td className="px-5 py-4 text-right text-slate-600">{data.policies}</td>
                                            <td className="px-5 py-4 text-right font-semibold text-slate-800">{data.exposure.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Fraud Flags & Manual Review</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b bg-yellow-50 flex gap-2 items-center text-yellow-800 text-sm font-semibold">
                                <Activity className="w-4 h-4" /> {claims.filter(c => c.status === 'UNDER REVIEW').length} Claim{claims.filter(c => c.status === 'UNDER REVIEW').length !== 1 ? 's' : ''} flagged for manual review
                            </div>
                            <div className="divide-y divide-slate-100">
                                {claims.filter(c => c.status === 'UNDER REVIEW').length === 0 ? (
                                    <div className="p-5 text-slate-500 text-center font-medium">No claims require manual review.</div>
                                ) : claims.filter(c => c.status === 'UNDER REVIEW').map((claim, idx) => (
                                    <div key={idx} className="p-5 flex justify-between items-center hover:bg-slate-50">
                                        <div>
                                            <div className="font-semibold text-slate-800 mb-1">CLM-{claim.id} — {claim.worker_name}</div>
                                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{claim.trigger_type}</span>
                                                <span className="text-red-600 font-medium text-xs border border-red-200 bg-red-50 px-2 py-0.5 rounded">Fraud Score: {claim.fraud_score}/100</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="font-bold flex items-center"><IndianRupee className="w-4 h-4" />{claim.payout_amount}</div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleClaimAction(claim.id, 'APPROVED')} className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-md font-bold transition-colors">Approve</button>
                                                <button onClick={() => handleClaimAction(claim.id, 'REJECTED')} className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md font-bold transition-colors">Reject</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    const colorVariants = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        red: "bg-red-50 text-red-600 border-red-100"
    };

    return (
        <div className={`rounded-2xl p-5 border ${colorVariants[color]} shadow-sm relative overflow-hidden group`}>
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <div className="text-sm font-semibold opacity-80 mb-1">{title}</div>
                    <div className="text-2xl font-bold">{value}</div>
                </div>
                <div className="p-2 bg-white/50 rounded-lg">{icon}</div>
            </div>
        </div>
    );
}

// Inline Icon
function ShieldCheckIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
