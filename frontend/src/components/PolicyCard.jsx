import React from 'react';
import { ShieldCheck, IndianRupee, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PolicyCard({ planName, premium, coverage, validFrom, validTo, onRenew }) {
    return (
        <div className="bg-brand-600 rounded-2xl shadow-lg overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-brand-500 opacity-50 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-brand-700 opacity-50 blur-xl"></div>

            <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/30 border border-brand-400/30 text-xs font-semibold tracking-wide mb-3">
                            <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE POLICY
                        </div>
                        <h2 className="text-3xl font-bold">{planName} Plan</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="text-brand-200 text-sm mb-1">Weekly Premium</div>
                        <div className="text-2xl font-bold flex items-center">
                            <IndianRupee className="w-5 h-5" />{premium}
                        </div>
                    </div>
                    <div>
                        <div className="text-brand-200 text-sm mb-1">Coverage Limit</div>
                        <div className="text-2xl font-bold flex items-center">
                            <IndianRupee className="w-5 h-5" />{coverage}
                        </div>
                    </div>
                </div>

                <div className="border-t border-brand-500/50 pt-4 flex items-center gap-2 text-sm text-brand-100">
                    <Calendar className="w-4 h-4" />
                    <span>Valid: {validFrom} — {validTo}</span>
                </div>
            </div>

            <div className="bg-brand-700/50 p-4 relative z-10 flex justify-between items-center">
                <span className="text-sm">Auto-renews next Monday</span>
                <button onClick={onRenew} className="bg-white text-brand-700 hover:bg-brand-50 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                    Renew Early
                </button>
            </div>
        </div>
    );
}
