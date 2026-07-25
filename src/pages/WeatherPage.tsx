import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { WeatherData } from '../types';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Thermometer, Sparkles, MapPin } from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await api.get('/weather');
        setWeather(res.data);
      } catch (err) {
        console.error("Weather load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <CloudSun className="w-8 h-8 text-amber-400" />
          Agricultural Weather & Spray Advisor
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          7-day extended forecasts with automated spray, fertilizer, and irrigation window recommendations.
        </p>
      </div>

      {weather && (
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
    </div>
  );
};
