import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  MapPin,
  Search,
  RefreshCw,
  Calendar,
  Clock,
  Navigation,
  Activity,
  Zap,
  Umbrella
} from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';
import { weatherService, geolocationService } from '../../../services/api';

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('New York, NY');
  const [units, setUnits] = useState('metric'); // metric, imperial
  const [activeTab, setActiveTab] = useState('current'); // current, hourly, daily

  const addNotification = useNotificationStore((state) => state.addNotification);

  const weatherIcons = {
    sunny: Sun,
    partly_cloudy: Cloud,
    cloudy: Cloud,
    rainy: CloudRain,
    drizzle: CloudDrizzle,
    snow: CloudSnow,
    thunderstorm: CloudLightning,
    clear: Sun
  };

  const getWeatherIcon = (condition) => {
    const IconComponent = weatherIcons[condition] || Cloud;
    return IconComponent;
  };

  const getWeatherColor = (condition) => {
    const colors = {
      sunny: 'text-yellow-400',
      partly_cloudy: 'text-blue-400',
      cloudy: 'text-gray-400',
      rainy: 'text-blue-600',
      drizzle: 'text-blue-500',
      snow: 'text-white',
      thunderstorm: 'text-purple-400',
      clear: 'text-yellow-300'
    };
    return colors[condition] || 'text-gray-400';
  };

  const convertTemperature = (temp) => {
    if (units === 'imperial') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  const getTemperatureUnit = () => {
    return units === 'imperial' ? '°F' : '°C';
  };

  const fetchWeatherData = async (location = currentLocation) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current weather and forecast data from API
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(location || currentLocation),
        weatherService.getForecast(location || currentLocation)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      
      addNotification({
        message: `Weather updated for ${location || currentLocation}`,
        type: 'success'
      });
    } catch (err) {
      setError('Failed to fetch weather data');
      addNotification({
        message: 'Failed to fetch weather data',
        type: 'error'
      });
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect user location on first load
  const detectLocation = async () => {
    try {
      const location = await geolocationService.getCurrentLocation();
      const locationName = location.city;
      setCurrentLocation(locationName);
      await fetchWeatherData(locationName);
    } catch (error) {
      console.warn('Geolocation failed, using default location:', error);
      await fetchWeatherData();
    }
  };

  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      playClick();
      setCurrentLocation(searchLocation.trim());
      fetchWeatherData(searchLocation.trim());
      setSearchLocation('');
    }
  };

  const handleRefresh = () => {
    playClick();
    fetchWeatherData();
  };

  const handleUnitToggle = () => {
    playClick();
    setUnits(units === 'metric' ? 'imperial' : 'metric');
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const WeatherCard = ({ title, children, className = "" }) => (
    <motion.div
      className={`bg-glass-dark rounded-xl p-4 border border-white/10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-white/90 font-semibold mb-3 text-sm">{title}</h3>
      {children}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black/5">
        <motion.div
          className="text-center text-white/80"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 mx-auto mb-2" />
          <p>Loading weather data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-black/5">
        <div className="text-center text-white/80">
          <Cloud className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-semibold mb-2">Weather Unavailable</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => fetchWeatherData()}
            className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Cloud className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-white">Weather</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                className="pl-3 pr-10 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none w-48"
              />
              <button
                onClick={handleLocationSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded transition"
              >
                <Search className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
          
          {/* Unit Toggle */}
          <button
            onClick={handleUnitToggle}
            className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition text-sm"
          >
            {units === 'metric' ? '°C' : '°F'}
          </button>
          
          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-black/20 border border-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-black/5">
        {[
          { id: 'current', label: 'Current', icon: Activity },
          { id: 'hourly', label: 'Hourly', icon: Clock },
          { id: 'daily', label: '7-Day', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClick();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-3 transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto scrollbar-glass p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'current' && currentWeather && (
            <motion.div
              key="current"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Current Weather */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-semibold text-white">{currentWeather.location}</h3>
                  </div>
                  <div className="text-right text-white/60 text-sm">
                    <div>Updated</div>
                    <div>{currentWeather.updated.toLocaleTimeString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {React.createElement(getWeatherIcon(currentWeather.condition), {
                        className: `w-16 h-16 ${getWeatherColor(currentWeather.condition)}`
                      })}
                    </motion.div>
                    <div>
                      <div className="text-4xl font-bold text-white">
                        {convertTemperature(currentWeather.temperature)}{getTemperatureUnit()}
                      </div>
                      <div className="text-white/80">
                        Feels like {convertTemperature(currentWeather.feels_like)}{getTemperatureUnit()}
                      </div>
                      <div className="text-accent font-medium">{currentWeather.description}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <WeatherCard title="Humidity">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-2xl font-semibold text-white">{currentWeather.humidity}%</div>
                      <div className="text-white/60 text-sm">Moisture</div>
                    </div>
                  </div>
                </WeatherCard>

                <WeatherCard title="Wind">
                  <div className="flex items-center gap-3">
                    <Wind className="w-8 h-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-semibold text-white">{currentWeather.wind_speed}</div>
                      <div className="text-white/60 text-sm">km/h {currentWeather.wind_direction}</div>
                    </div>
                  </div>
                </WeatherCard>

                <WeatherCard title="Pressure">
                  <div className="flex items-center gap-3">
                    <Gauge className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="text-2xl font-semibold text-white">{currentWeather.pressure}</div>
                      <div className="text-white/60 text-sm">hPa</div>
                    </div>
                  </div>
                </WeatherCard>

                <WeatherCard title="Visibility">
                  <div className="flex items-center gap-3">
                    <Eye className="w-8 h-8 text-indigo-400" />
                    <div>
                      <div className="text-2xl font-semibold text-white">{currentWeather.visibility}</div>
                      <div className="text-white/60 text-sm">km</div>
                    </div>
                  </div>
                </WeatherCard>
              </div>

              {/* Sun Times */}
              <WeatherCard title="Sun & Moon">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Sunrise className="w-6 h-6 text-orange-400" />
                    <div>
                      <div className="text-white/90 font-medium">Sunrise</div>
                      <div className="text-white/60">{currentWeather.sunrise}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sunset className="w-6 h-6 text-red-400" />
                    <div>
                      <div className="text-white/90 font-medium">Sunset</div>
                      <div className="text-white/60">{currentWeather.sunset}</div>
                    </div>
                  </div>
                </div>
              </WeatherCard>
            </motion.div>
          )}

          {activeTab === 'hourly' && (
            <motion.div
              key="hourly"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WeatherCard title="24-Hour Forecast">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {forecast.hourly?.map((hour, index) => {
                    const Icon = getWeatherIcon(hour.condition);
                    return (
                      <motion.div
                        key={index}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-white/60 text-sm mb-2">{hour.time}</div>
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${getWeatherColor(hour.condition)}`} />
                        <div className="text-white font-semibold">
                          {convertTemperature(hour.temp)}{getTemperatureUnit()}
                        </div>
                        {hour.rain > 0 && (
                          <div className="text-blue-400 text-xs mt-1 flex items-center justify-center gap-1">
                            <Umbrella className="w-3 h-3" />
                            {hour.rain}%
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </WeatherCard>
            </motion.div>
          )}

          {activeTab === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WeatherCard title="7-Day Forecast">
                <div className="space-y-3">
                  {forecast.daily?.map((day, index) => {
                    const Icon = getWeatherIcon(day.condition);
                    return (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 text-white/90 font-medium">{day.day}</div>
                          <Icon className={`w-6 h-6 ${getWeatherColor(day.condition)}`} />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {day.rain > 0 && (
                            <div className="text-blue-400 text-sm flex items-center gap-1">
                              <Umbrella className="w-4 h-4" />
                              {day.rain}%
                            </div>
                          )}
                          <div className="text-right">
                            <div className="text-white font-semibold">
                              {convertTemperature(day.high)}{getTemperatureUnit()}
                            </div>
                            <div className="text-white/60 text-sm">
                              {convertTemperature(day.low)}{getTemperatureUnit()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </WeatherCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Weather;