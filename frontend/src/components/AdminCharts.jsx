import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' },
        title: { display: false },
    },
};

const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Premiums Collected (₹)',
            data: [15000, 18000, 12000, 19000, 22000, 14000, 11000],
            backgroundColor: '#22c55e', // brand-500
        },
        {
            label: 'Claims Paid (₹)',
            data: [2000, 5000, 1000, 9000, 3000, 2000, 1000],
            backgroundColor: '#f97316', // orange-500
        },
    ],
};

const donutData = {
    labels: ['Heavy Rain', 'Extreme Heat', 'Severe AQI', 'Flood', 'Disruption'],
    datasets: [
        {
            data: [45, 25, 15, 5, 10],
            backgroundColor: [
                '#3b82f6', // blue-500
                '#f97316', // orange-500
                '#94a3b8', // slate-400
                '#06b6d4', // cyan-500
                '#ef4444', // red-500
            ],
            borderWidth: 0,
        },
    ],
};

export function PremiumVsClaimsChart() {
    return (
        <div className="h-64 w-full">
            <Bar options={barOptions} data={barData} />
        </div>
    );
}

export function ClaimsByTriggerChart() {
    return (
        <div className="h-64 w-full flex justify-center">
            <Doughnut
                data={donutData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right' } }
                }}
            />
        </div>
    );
}
