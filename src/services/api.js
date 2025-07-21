/**
 * API Service Layer for Portfolio Desktop OS
 * Handles all external API integrations with caching, rate limiting, and error handling
 */

// Environment configuration
const config = {
  openWeatherApiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
  alphaVantageApiKey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
  finnhubApiKey: import.meta.env.VITE_FINNHUB_API_KEY,
  newsApiKey: import.meta.env.VITE_NEWS_API_KEY,
  googleCalendarApiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  coingeckoApiKey: import.meta.env.VITE_COINGECKO_API_KEY,
  spotifyClientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  spotifyClientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
  emailjsServiceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  emailjsTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  emailjsPublicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  ipgeolocationApiKey: import.meta.env.VITE_IPGEOLOCATION_API_KEY,
  unsplashApiKey: import.meta.env.VITE_UNSPLASH_API_KEY,
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  enableRateLimiting: import.meta.env.VITE_ENABLE_RATE_LIMITING === 'true',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000
};

// Cache implementation
class Cache {
  constructor() {
    this.cache = new Map();
    this.timeouts = new Map();
  }

  set(key, value, ttl = 300000) { // 5 minutes default
    this.cache.set(key, value);
    
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }
    
    const timeout = setTimeout(() => {
      this.cache.delete(key);
      this.timeouts.delete(key);
    }, ttl);
    
    this.timeouts.set(key, timeout);
  }

  get(key) {
    return this.cache.get(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

// Rate limiter implementation
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  canMakeRequest(endpoint, limit = 60, window = 60000) { // 60 requests per minute default
    if (!config.enableRateLimiting) return true;

    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < window);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(endpoint, validRequests);
    return true;
  }
}

const cache = new Cache();
const rateLimiter = new RateLimiter();

// Generic API request function
async function apiRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.apiTimeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Weather API Service
export const weatherService = {
  async getCurrentWeather(city = 'New York') {
    const cacheKey = `weather_current_${city}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    if (!rateLimiter.canMakeRequest('weather', 10, 60000)) {
      throw new Error('Rate limit exceeded for weather API');
    }

    try {
      if (config.useMockData || !config.openWeatherApiKey || config.openWeatherApiKey === 'demo_key') {
        return this.getMockWeatherData(city);
      }

      const response = await apiRequest(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.openWeatherApiKey}&units=metric`
      );

      const weatherData = {
        location: `${response.name}, ${response.sys.country}`,
        temperature: Math.round(response.main.temp),
        feels_like: Math.round(response.main.feels_like),
        condition: this.mapCondition(response.weather[0].main),
        description: response.weather[0].description,
        humidity: response.main.humidity,
        pressure: response.main.pressure,
        visibility: Math.round(response.visibility / 1000),
        wind_speed: Math.round(response.wind.speed * 3.6), // Convert m/s to km/h
        wind_direction: this.getWindDirection(response.wind.deg),
        updated: new Date()
      };

      cache.set(cacheKey, weatherData, 600000); // 10 minutes cache
      return weatherData;
    } catch (error) {
      console.warn('Weather API failed, using mock data:', error.message);
      return this.getMockWeatherData(city);
    }
  },

  async getForecast(city = 'New York') {
    const cacheKey = `weather_forecast_${city}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      if (config.useMockData || !config.openWeatherApiKey || config.openWeatherApiKey === 'demo_key') {
        return this.getMockForecastData();
      }

      const response = await apiRequest(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${config.openWeatherApiKey}&units=metric`
      );

      const forecastData = {
        hourly: response.list.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
          condition: this.mapCondition(item.weather[0].main),
          rain: item.pop * 100
        })),
        daily: this.groupByDay(response.list)
      };

      cache.set(cacheKey, forecastData, 1800000); // 30 minutes cache
      return forecastData;
    } catch (error) {
      console.warn('Forecast API failed, using mock data:', error.message);
      return this.getMockForecastData();
    }
  },

  mapCondition(condition) {
    const conditionMap = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Drizzle': 'drizzle',
      'Snow': 'snow',
      'Thunderstorm': 'thunderstorm',
      'Mist': 'cloudy',
      'Fog': 'cloudy'
    };
    return conditionMap[condition] || 'cloudy';
  },

  getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  },

  groupByDay(list) {
    const daily = [];
    const today = new Date().toDateString();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayItems = list.filter(item => 
        new Date(item.dt * 1000).toDateString() === date.toDateString()
      );
      
      if (dayItems.length > 0) {
        const temps = dayItems.map(item => item.main.temp);
        daily.push({
          day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' }),
          high: Math.round(Math.max(...temps)),
          low: Math.round(Math.min(...temps)),
          condition: this.mapCondition(dayItems[Math.floor(dayItems.length / 2)].weather[0].main),
          rain: Math.round(Math.max(...dayItems.map(item => item.pop * 100)))
        });
      }
    }
    
    return daily;
  },

  getMockWeatherData(city) {
    return {
      location: city,
      temperature: 22 + Math.floor(Math.random() * 10),
      feels_like: 24 + Math.floor(Math.random() * 8),
      condition: ['sunny', 'partly_cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
      description: 'Partly Cloudy',
      humidity: 60 + Math.floor(Math.random() * 20),
      pressure: 1010 + Math.floor(Math.random() * 20),
      visibility: 10,
      wind_speed: 5 + Math.floor(Math.random() * 15),
      wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      updated: new Date()
    };
  },

  getMockForecastData() {
    const conditions = ['sunny', 'partly_cloudy', 'cloudy', 'rainy'];
    return {
      hourly: Array.from({ length: 8 }, (_, i) => ({
        time: `${12 + i}:00`,
        temp: 20 + Math.floor(Math.random() * 10),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        rain: Math.floor(Math.random() * 100)
      })),
      daily: Array.from({ length: 7 }, (_, i) => ({
        day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
        high: 25 + Math.floor(Math.random() * 10),
        low: 15 + Math.floor(Math.random() * 8),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        rain: Math.floor(Math.random() * 100)
      }))
    };
  }
};

// Stock Market API Service
export const stockService = {
  async getQuote(symbol) {
    const cacheKey = `stock_${symbol}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    if (!rateLimiter.canMakeRequest('stocks', 5, 60000)) {
      throw new Error('Rate limit exceeded for stock API');
    }

    try {
      if (config.useMockData || !config.finnhubApiKey || config.finnhubApiKey === 'demo_key') {
        return this.getMockStockData(symbol);
      }

      // Try Finnhub first (more generous free tier)
      const quoteResponse = await apiRequest(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${config.finnhubApiKey}`
      );

      const profileResponse = await apiRequest(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${config.finnhubApiKey}`
      );

      const stockData = {
        symbol,
        name: profileResponse.name || symbol,
        price: quoteResponse.c,
        change: quoteResponse.d,
        changePercent: quoteResponse.dp,
        volume: this.formatVolume(profileResponse.shareOutstanding),
        marketCap: this.formatMarketCap(profileResponse.marketCapitalization),
        pe: quoteResponse.pe || 0,
        sector: profileResponse.finnhubIndustry || 'Technology',
        logo: this.getStockEmoji(symbol)
      };

      cache.set(cacheKey, stockData, 30000); // 30 seconds cache for real-time feel
      return stockData;
    } catch (error) {
      console.warn(`Stock API failed for ${symbol}, using mock data:`, error.message);
      return this.getMockStockData(symbol);
    }
  },

  async getMultipleQuotes(symbols) {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    return Promise.allSettled(promises).then(results =>
      results.map((result, index) =>
        result.status === 'fulfilled' ? result.value : this.getMockStockData(symbols[index])
      )
    );
  },

  async getMarketOverview() {
    const cacheKey = 'market_overview';
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      if (config.useMockData || !config.finnhubApiKey || config.finnhubApiKey === 'demo_key') {
        return this.getMockMarketData();
      }

      // Get major indices
      const indices = ['SPY', 'QQQ', 'DIA']; // ETFs that track S&P 500, NASDAQ, and Dow
      const quotes = await this.getMultipleQuotes(indices);

      const marketData = {
        sp500: {
          value: quotes[0].price * 10, // Approximate S&P 500 value
          change: quotes[0].change * 10,
          changePercent: quotes[0].changePercent
        },
        nasdaq: {
          value: quotes[1].price * 40, // Approximate NASDAQ value
          change: quotes[1].change * 40,
          changePercent: quotes[1].changePercent
        },
        dow: {
          value: quotes[2].price * 100, // Approximate Dow value
          change: quotes[2].change * 100,
          changePercent: quotes[2].changePercent
        }
      };

      cache.set(cacheKey, marketData, 60000); // 1 minute cache
      return marketData;
    } catch (error) {
      console.warn('Market overview API failed, using mock data:', error.message);
      return this.getMockMarketData();
    }
  },

  formatVolume(volume) {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume?.toString() || '0';
  },

  formatMarketCap(marketCap) {
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(1)}M`;
    return marketCap?.toString() || '0';
  },

  getStockEmoji(symbol) {
    const emojiMap = {
      'AAPL': '🍎', 'GOOGL': '🔍', 'TSLA': '⚡', 'MSFT': '⊞',
      'AMZN': '📦', 'META': '📘', 'NVDA': '🎮', 'NFLX': '🎬',
      'SPY': '📈', 'QQQ': '💻', 'DIA': '🏭'
    };
    return emojiMap[symbol] || '📊';
  },

  getMockStockData(symbol) {
    const basePrice = { 'AAPL': 175, 'GOOGL': 2800, 'TSLA': 250, 'MSFT': 380 }[symbol] || 100;
    const change = (Math.random() - 0.5) * 10;
    
    return {
      symbol,
      name: `${symbol} Inc.`,
      price: basePrice + change,
      change: change,
      changePercent: (change / basePrice) * 100,
      volume: `${(Math.random() * 50 + 10).toFixed(1)}M`,
      marketCap: `${(Math.random() * 2 + 1).toFixed(1)}T`,
      pe: Math.floor(Math.random() * 30 + 15),
      sector: 'Technology',
      logo: this.getStockEmoji(symbol)
    };
  },

  getMockMarketData() {
    return {
      sp500: { value: 4150 + Math.random() * 100, change: (Math.random() - 0.5) * 50, changePercent: (Math.random() - 0.5) * 2 },
      nasdaq: { value: 12800 + Math.random() * 200, change: (Math.random() - 0.5) * 100, changePercent: (Math.random() - 0.5) * 2 },
      dow: { value: 33200 + Math.random() * 300, change: (Math.random() - 0.5) * 150, changePercent: (Math.random() - 0.5) * 2 }
    };
  }
};

// News API Service
export const newsService = {
  async getTopHeadlines(category = 'technology', country = 'us') {
    const cacheKey = `news_${category}_${country}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    if (!rateLimiter.canMakeRequest('news', 10, 3600000)) { // 10 requests per hour
      throw new Error('Rate limit exceeded for news API');
    }

    try {
      if (config.useMockData || !config.newsApiKey || config.newsApiKey === 'demo_key') {
        return this.getMockNewsData(category);
      }

      const response = await apiRequest(
        `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&pageSize=20&apiKey=${config.newsApiKey}`
      );

      const newsData = response.articles.map(article => ({
        id: article.url,
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: new Date(article.publishedAt),
        urlToImage: article.urlToImage
      }));

      cache.set(cacheKey, newsData, 1800000); // 30 minutes cache
      return newsData;
    } catch (error) {
      console.warn('News API failed, using mock data:', error.message);
      return this.getMockNewsData(category);
    }
  },

  getMockNewsData(category) {
    return [
      {
        id: '1',
        title: `Breaking: Latest ${category} developments`,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        url: '#',
        source: 'Tech News',
        publishedAt: new Date(),
        urlToImage: null
      },
      {
        id: '2',
        title: `${category} industry sees major growth`,
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
        url: '#',
        source: 'Business Wire',
        publishedAt: new Date(Date.now() - 3600000),
        urlToImage: null
      }
    ];
  }
};

// Cryptocurrency API Service (using free CoinGecko API)
export const cryptoService = {
  async getTopCryptocurrencies(limit = 10) {
    const cacheKey = `crypto_top_${limit}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      // CoinGecko API is free and doesn't require API key for basic usage
      const response = await apiRequest(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );

      const cryptoData = response.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        image: coin.image
      }));

      cache.set(cacheKey, cryptoData, 60000); // 1 minute cache
      return cryptoData;
    } catch (error) {
      console.warn('Crypto API failed, using mock data:', error.message);
      return this.getMockCryptoData();
    }
  },

  getMockCryptoData() {
    return [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 45000, change24h: 2.5, marketCap: 850000000000, volume: 25000000000, image: null },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3200, change24h: -1.2, marketCap: 380000000000, volume: 15000000000, image: null }
    ];
  }
};

// Geolocation Service
export const geolocationService = {
  async getCurrentLocation() {
    const cacheKey = 'user_location';
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      if (config.useMockData || !config.ipgeolocationApiKey || config.ipgeolocationApiKey === 'demo_key') {
        return { city: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 };
      }

      const response = await apiRequest(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${config.ipgeolocationApiKey}`
      );

      const locationData = {
        city: response.city,
        country: response.country_code2,
        lat: parseFloat(response.latitude),
        lon: parseFloat(response.longitude)
      };

      cache.set(cacheKey, locationData, 3600000); // 1 hour cache
      return locationData;
    } catch (error) {
      console.warn('Geolocation API failed, using mock data:', error.message);
      return { city: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 };
    }
  }
};

// Export cache and rate limiter for debugging
export { cache, rateLimiter, config };