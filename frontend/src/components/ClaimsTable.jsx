import React, { useState } from 'react';
import { IndianRupee, CheckCircle2, Clock, XCircle, FileText, X } from 'lucide-react';

export default function ClaimsTable({ claims }) {
    const [selectedClaim, setSelectedClaim] = useState(null);

    if (!claims || claims.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
                <div className="text-slate-400 mb-2 font-medium">No Recent Claims</div>
                <p className="text-sm text-slate-500">You haven't had any weather disruption claims yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 p-4 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Recent Claims History</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Trigger Event</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold text-right">Amount</th>
                            <th className="px-6 py-4 font-semibold text-center">Status</th>
                            <th className="px-6 py-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {claims.map((claim, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${claim.type === 'HEAVY RAIN' ? 'bg-blue-500' : claim.type === 'EXTREME HEAT' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                                    {claim.type}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {new Date(claim.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-slate-800">
                                    <div className="flex items-center justify-end">
                                        <IndianRupee className="w-3.5 h-3.5" />{claim.amount}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            claim.status === 'UNDER REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {claim.status === 'APPROVED' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                            claim.status === 'UNDER REVIEW' ? <Clock className="w-3.5 h-3.5" /> :
                                                <XCircle className="w-3.5 h-3.5" />}
                                        {claim.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => setSelectedClaim(claim)} className="text-brand-600 hover:text-brand-800 p-1 bg-brand-50 rounded">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Receipt Modal */}
            {selectedClaim && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative">
                        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-500"/>
                                Claim Details
                            </h3>
                            <button onClick={() => setSelectedClaim(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="text-center">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${selectedClaim.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {selectedClaim.status}
                                </span>
                                <div className="text-3xl font-bold flex justify-center items-center text-slate-900">
                                    <IndianRupee className="w-6 h-6 mr-1"/>{selectedClaim.amount}
                                </div>
                                <div className="text-sm text-slate-500 mt-1">Payout via UPI</div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Event Type</span>
                                    <span className="font-medium text-slate-800">{selectedClaim.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date</span>
                                    <span className="font-medium text-slate-800">{new Date(selectedClaim.date).toLocaleDateString()}</span>
                                </div>
                                {selectedClaim.status === 'APPROVED' && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Transaction ID</span>
                                        <span className="font-mono bg-slate-50 px-2 rounded text-slate-700">{selectedClaim.transaction_id || `rzp_test_${Math.floor(Math.random()*100000)}`}</span>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setSelectedClaim(null)} className="w-full bg-brand-600 text-white font-semibold py-2 rounded-xl mt-4 hover:bg-brand-700">
                                Close Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
