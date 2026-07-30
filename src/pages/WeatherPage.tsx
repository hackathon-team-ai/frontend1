import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { WeatherData } from '../types';
import { useAuth } from '../context/AuthContext';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Thermometer, Sparkles, MapPin, RefreshCw } from 'lucide-react';

// All Maharashtra districts
const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara',
  'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
  'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban',
  'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar',
  'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
];

export const WeatherPage: React.FC = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialise to the user's registered district, or empty to force selection
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    user?.district || ''
  );
  const [selectedState, setSelectedState] = useState<string>(
    user?.state || 'Maharashtra'
  );

  const fetchWeather = async (district: string, state: string) => {
    if (!district) return;
    setLoading(true);
    try {
      const res = await api.get('/weather', {
        params: { district, state }
      });
      setWeather(res.data);
    } catch (err) {
      console.error('Weather load error', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount once user is loaded
  useEffect(() => {
    const district = user?.district || 'Pune';
    const state = user?.state || 'Maharashtra';
    setSelectedDistrict(district);
    setSelectedState(state);
    fetchWeather(district, state);
  }, [user]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    fetchWeather(district, selectedState);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <CloudSun className="w-8 h-8 text-amber-400" />
            Agricultural Weather & Spray Advisor
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            7-day extended forecasts with automated spray, fertilizer, and irrigation window recommendations.
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <MapPin className="w-4 h-4 text-agri-400" />
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="bg-darkbg-800 border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agri-500 cursor-pointer"
          >
            <option value="" disabled>Select District</option>
            {MAHARASHTRA_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button
            onClick={() => fetchWeather(selectedDistrict, selectedState)}
            disabled={loading || !selectedDistrict}
            className="p-2 rounded-xl bg-agri-600 hover:bg-agri-500 disabled:opacity-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-agri-400 animate-spin" />
          <span className="ml-3 text-slate-400">Loading weather for {selectedDistrict}...</span>
        </div>
      )}

      {!loading && weather && (
        <>
          {/* Current Weather Card */}
          <GlassCard className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center space-x-2 text-agri-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{weather.location}, {weather.state}</span>
              </div>
              <div className="flex items-baseline space-x-3">
                <h2 className="text-5xl font-extrabold text-white">{weather.current_temp}°C</h2>
                <span className="text-lg font-semibold text-agri-300">{weather.condition}</span>
              </div>
              <p className="text-xs text-slate-400">Feels like {weather.feels_like}°C • UV Index: {weather.uv_index}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-2 bg-darkbg-900/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3">
                <Droplets className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Humidity</p>
                  <p className="text-base font-bold text-white">{weather.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Wind className="w-6 h-6 text-slate-300" />
                <div>
                  <p className="text-xs text-slate-400">Wind Speed</p>
                  <p className="text-base font-bold text-white">{weather.wind_speed} km/h</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CloudRain className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Rain Prob.</p>
                  <p className="text-base font-bold text-blue-400">{weather.rain_probability}%</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Thermometer className="w-6 h-6 text-amber-400" />
                <div>
                  <p className="text-xs text-slate-400">Sun Index</p>
                  <p className="text-base font-bold text-white">Moderate</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Agricultural Advice Card */}
          <GlassCard className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-agri-400" />
              Agronomist Weather Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weather.agri_recommendations.map((tip, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-agri-950/40 border border-agri-500/20 text-xs text-slate-200 leading-relaxed">
                  {tip}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 7-Day Forecast Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {weather.forecast.map((day, idx) => (
              <GlassCard key={idx} className="!p-4 text-center space-y-2">
                <p className="text-xs font-bold text-slate-300">{day.day_name}</p>
                <p className="text-[10px] text-slate-500">{day.date.slice(5)}</p>

                <div className="my-2 flex justify-center">
                  {day.rain_probability > 40 ? (
                    <CloudRain className="w-8 h-8 text-blue-400" />
                  ) : (
                    <Sun className="w-8 h-8 text-amber-400" />
                  )}
                </div>

                <p className="text-sm font-extrabold text-white">{day.temp_max}° / {day.temp_min}°</p>
                <Badge variant={day.rain_probability > 40 ? 'blue' : 'green'} className="text-[10px]">
                  {day.rain_probability}% Rain
                </Badge>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {!loading && !weather && (
        <GlassCard className="text-center py-16">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Select a district above to load weather data.</p>
        </GlassCard>
      )}
    </div>
  );
};
