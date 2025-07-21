import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Server,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  Clock,
  Zap,
  Database,
  Globe,
  Key,
  Eye,
  EyeOff,
  TestTube,
  BarChart3,
  Wifi,
  WifiOff,
  Code,
  Copy,
  ExternalLink,
  PlayCircle,
  StopCircle
} from 'lucide-react';
import { playClick, playSuccess, playError } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';
import { 
  weatherService, 
  stockService, 
  newsService, 
  cryptoService, 
  geolocationService,
  config,
  cache,
  rateLimiter
} from '../../../services/api';

const APIMonitor = () => {
  const [apiStatus, setApiStatus] = useState({});
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [showAPIKeys, setShowAPIKeys] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const addNotification = useNotificationStore((state) => state.addNotification);

  const apiEndpoints = [
    {
      id: 'weather',
      name: 'OpenWeatherMap',
      service: weatherService,
      testFunction: () => weatherService.getCurrentWeather('London'),
      description: 'Weather data and forecasts',
      icon: Globe,
      color: 'bg-blue-500',
      rateLimit: '10 requests/minute',
      apiKey: config.openWeatherApiKey,
      documentation: 'https://openweathermap.org/api'
    },
    {
      id: 'stocks',
      name: 'Finnhub',
      service: stockService,
      testFunction: () => stockService.getQuote('AAPL'),
      description: 'Real-time stock market data',
      icon: BarChart3,
      color: 'bg-green-500',
      rateLimit: '60 requests/minute',
      apiKey: config.finnhubApiKey,
      documentation: 'https://finnhub.io/docs/api'
    },
    {
      id: 'news',
      name: 'NewsAPI',
      service: newsService,
      testFunction: () => newsService.getTopHeadlines('technology'),
      description: 'Latest news and headlines',
      icon: Database,
      color: 'bg-purple-500',
      rateLimit: '1000 requests/month',
      apiKey: config.newsApiKey,
      documentation: 'https://newsapi.org/docs'
    },
    {
      id: 'crypto',
      name: 'CoinGecko',
      service: cryptoService,
      testFunction: () => cryptoService.getTopCryptocurrencies(5),
      description: 'Cryptocurrency market data',
      icon: Zap,
      color: 'bg-yellow-500',
      rateLimit: 'Free tier available',
      apiKey: config.coingeckoApiKey || 'Not required',
      documentation: 'https://www.coingecko.com/en/api/documentation'
    },
    {
      id: 'geolocation',
      name: 'IPGeolocation',
      service: geolocationService,
      testFunction: () => geolocationService.getCurrentLocation(),
      description: 'User location detection',
      icon: Globe,
      color: 'bg-indigo-500',
      rateLimit: '1000 requests/month',
      apiKey: config.ipgeolocationApiKey,
      documentation: 'https://ipgeolocation.io/documentation.html'
    }
  ];

  const checkAPIStatus = useCallback(async (api) => {
    const startTime = performance.now();
    
    try {
      await api.testFunction();
      const responseTime = performance.now() - startTime;
      
      return {
        status: 'online',
        responseTime: Math.round(responseTime),
        lastChecked: new Date(),
        error: null
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      
      return {
        status: 'error',
        responseTime: Math.round(responseTime),
        lastChecked: new Date(),
        error: error.message
      };
    }
  }, []);

  const checkAllAPIs = useCallback(async () => {
    const results = {};
    
    for (const api of apiEndpoints) {
      try {
        results[api.id] = await checkAPIStatus(api);
      } catch (error) {
        results[api.id] = {
          status: 'error',
          responseTime: 0,
          lastChecked: new Date(),
          error: error.message
        };
      }
    }
    
    setApiStatus(results);
  }, [apiEndpoints, checkAPIStatus]);

  const testSpecificAPI = async (api) => {
    playClick();
    
    try {
      const result = await checkAPIStatus(api);
      setTestResults(prev => ({ ...prev, [api.id]: result }));
      
      addNotification({
        message: `${api.name} API test ${result.status === 'online' ? 'passed' : 'failed'}`,
        type: result.status === 'online' ? 'success' : 'error'
      });
      
      if (result.status === 'online') {
        playSuccess();
      } else {
        playError();
      }
    } catch (error) {
      playError();
      addNotification({
        message: `Failed to test ${api.name} API`,
        type: 'error'
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    playSuccess();
    addNotification({
      message: 'Copied to clipboard',
      type: 'success'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-yellow-500/30 bg-yellow-500/10';
    }
  };

  const formatResponseTime = (time) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  const getCacheInfo = () => {
    return {
      entries: cache.cache.size,
      memoryUsage: 'Unknown'
    };
  };

  const getRateLimitInfo = () => {
    return Array.from(rateLimiter.requests.entries()).map(([endpoint, requests]) => ({
      endpoint,
      requests: requests.length
    }));
  };

  useEffect(() => {
    checkAllAPIs();
  }, [checkAllAPIs]);

  useEffect(() => {
    if (autoRefresh && isMonitoring) {
      const interval = setInterval(checkAllAPIs, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isMonitoring, checkAllAPIs]);

  const APICard = ({ api }) => {
    const status = apiStatus[api.id];
    const testResult = testResults[api.id];
    const IconComponent = api.icon;

    return (
      <motion.div
        className={`bg-glass-dark rounded-xl border border-white/10 p-4 hover:border-accent/30 cursor-pointer transition-all ${
          selectedAPI?.id === api.id ? 'ring-2 ring-accent/30' : ''
        }`}
        onClick={() => {
          playClick();
          setSelectedAPI(api);
        }}
        whileHover={{ y: -2 }}
        layout
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${api.color} rounded-lg flex items-center justify-center`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{api.name}</h3>
              <p className="text-white/60 text-sm">{api.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {status && getStatusIcon(status.status)}
            <button
              onClick={(e) => {
                e.stopPropagation();
                testSpecificAPI(api);
              }}
              className="p-1.5 hover:bg-white/10 rounded-lg transition"
              title="Test API"
            >
              <TestTube className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        <div className={`rounded-lg border p-3 ${getStatusColor(status?.status)}`}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-white/60 mb-1">Status</div>
              <div className="text-white font-medium capitalize">
                {status?.status || 'Checking...'}
              </div>
            </div>
            <div>
              <div className="text-white/60 mb-1">Response Time</div>
              <div className="text-white font-medium">
                {status ? formatResponseTime(status.responseTime) : '--'}
              </div>
            </div>
          </div>
          
          {status?.error && (
            <div className="mt-3 p-2 bg-red-500/20 rounded border border-red-500/30">
              <div className="text-red-400 text-xs">{status.error}</div>
            </div>
          )}
          
          {testResult && (
            <div className="mt-3 p-2 bg-accent/20 rounded border border-accent/30">
              <div className="text-accent text-xs">
                Last test: {testResult.status} ({formatResponseTime(testResult.responseTime)})
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-white/60">
          <span>Rate Limit: {api.rateLimit}</span>
          <span>
            {status?.lastChecked ? 
              status.lastChecked.toLocaleTimeString() : 
              'Not checked'
            }
          </span>
        </div>
      </motion.div>
    );
  };

  const DetailPanel = () => {
    if (!selectedAPI) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-glass-dark rounded-xl border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{selectedAPI.name} Details</h3>
          <button
            onClick={() => setSelectedAPI(null)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <StopCircle className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">API Configuration</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/60">API Key</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">
                    {showAPIKeys ? selectedAPI.apiKey : '••••••••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowAPIKeys(!showAPIKeys)}
                    className="p-1 hover:bg-white/10 rounded transition"
                  >
                    {showAPIKeys ? 
                      <EyeOff className="w-4 h-4 text-white/60" /> : 
                      <Eye className="w-4 h-4 text-white/60" />
                    }
                  </button>
                  <button
                    onClick={() => copyToClipboard(selectedAPI.apiKey)}
                    className="p-1 hover:bg-white/10 rounded transition"
                  >
                    <Copy className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Rate Limit</span>
                <span className="text-white">{selectedAPI.rateLimit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Documentation</span>
                <button
                  onClick={() => window.open(selectedAPI.documentation, '_blank')}
                  className="flex items-center gap-1 text-accent hover:text-accent/80 transition"
                >
                  <span>View Docs</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Test API</h4>
            <button
              onClick={() => testSpecificAPI(selectedAPI)}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-black rounded-lg transition"
            >
              <PlayCircle className="w-4 h-4" />
              Run Test
            </button>
          </div>

          {testResults[selectedAPI.id] && (
            <div>
              <h4 className="text-white font-semibold mb-2">Last Test Result</h4>
              <div className={`p-4 rounded-lg border ${getStatusColor(testResults[selectedAPI.id].status)}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-sm">Status</div>
                    <div className="text-white font-semibold capitalize">
                      {testResults[selectedAPI.id].status}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Response Time</div>
                    <div className="text-white font-semibold">
                      {formatResponseTime(testResults[selectedAPI.id].responseTime)}
                    </div>
                  </div>
                </div>
                {testResults[selectedAPI.id].error && (
                  <div className="mt-3 p-2 bg-red-500/20 rounded border border-red-500/30">
                    <div className="text-red-400 text-sm">{testResults[selectedAPI.id].error}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const SystemInfo = () => (
    <div className="bg-glass-dark rounded-xl border border-white/10 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-white font-medium mb-2">Cache Status</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Cache Entries</span>
              <span className="text-white">{getCacheInfo().entries}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Rate Limiting</h4>
          <div className="space-y-2">
            {getRateLimitInfo().map(({ endpoint, requests }) => (
              <div key={endpoint} className="flex justify-between text-sm">
                <span className="text-white/60">{endpoint}</span>
                <span className="text-white">{requests} requests</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Configuration</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Mock Data</span>
              <span className={config.useMockData ? 'text-yellow-400' : 'text-green-400'}>
                {config.useMockData ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Rate Limiting</span>
              <span className={config.enableRateLimiting ? 'text-green-400' : 'text-red-400'}>
                {config.enableRateLimiting ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-white">API Monitor</h2>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-white/60">
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClick();
              setAutoRefresh(!autoRefresh);
            }}
            className={`px-3 py-2 rounded-lg border transition text-sm ${
              autoRefresh 
                ? 'bg-accent text-black border-accent' 
                : 'bg-black/20 text-white/80 border-white/10 hover:bg-white/10'
            }`}
          >
            Auto Refresh
          </button>
          
          <button
            onClick={() => {
              playClick();
              checkAllAPIs();
            }}
            className="p-2 bg-black/20 border border-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              playClick();
              setIsMonitoring(!isMonitoring);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-accent hover:bg-accent/80 text-black rounded-lg transition text-sm font-medium"
          >
            {isMonitoring ? <StopCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            {isMonitoring ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto scrollbar-glass p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API Cards */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-white">API Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apiEndpoints.map((api) => (
                <APICard key={api.id} api={api} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {selectedAPI ? <DetailPanel /> : <SystemInfo />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIMonitor;