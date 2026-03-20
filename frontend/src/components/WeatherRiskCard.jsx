import React, { useState, useEffect } from 'react';
import { CloudRain, ThermometerSun, Wind, AlertCircle, RefreshCw } from 'lucide-react';

export default function WeatherRiskCard({ city }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock initial data, in real app would fetch from Open-Meteo
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setWeather({
                temp: 32.5,
                rainForecast: 24, // mm
                aqi: 165,
                riskLevel: 'Medium',
                message: 'Moderate rain expected this week. Unhealthy air quality.'
            });
            setLoading(false);
        }, 1500);
    }, [city]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center min-h-[250px]">
                <RefreshCw className="h-8 w-8 text-brand-500 animate-spin mb-4" />
                <p className="text-slate-500 text-sm">Fetching live weather data for {city}...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 p-4 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-brand-500" />
                    Live Weather Risk <span className="text-xs font-normal text-slate-500 ml-2">({city})</span>
                </h3>
                <div className={`px-3 py-1 text-xs font-bold rounded-full ${weather.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                        weather.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                    }`}>
                    {weather.riskLevel} Risk
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <ThermometerSun className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800">{weather.temp}°</div>
                        <div className="text-xs text-slate-500">Current</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <CloudRain className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800">{weather.rainForecast} <span className="text-sm">mm</span></div>
                        <div className="text-xs text-slate-500">Weekly Rain</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                        <Wind className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800">{weather.aqi}</div>
                        <div className="text-xs text-slate-500">AQI</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{weather.message}</p>
                </div>
            </div>
        </div>
    );
}
