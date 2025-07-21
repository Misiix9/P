import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  RefreshCw,
  Search,
  Star,
  Plus,
  Minus,
  Eye,
  Activity,
  Calendar,
  Filter,
  ArrowUp,
  ArrowDown,
  Zap,
  Globe,
  Building,
  Briefcase,
  Target,
  AlertTriangle
} from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState(['AAPL', 'GOOGL', 'TSLA', 'MSFT']);
  const [portfolio, setPortfolio] = useState([
    { symbol: 'AAPL', shares: 10, buyPrice: 150.00 },
    { symbol: 'GOOGL', shares: 5, buyPrice: 2800.00 },
    { symbol: 'TSLA', shares: 3, buyPrice: 800.00 }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('market'); // market, watchlist, portfolio
  const [selectedStock, setSelectedStock] = useState(null);
  const [marketData, setMarketData] = useState({
    sp500: { value: 4150.48, change: 12.34, changePercent: 0.3 },
    nasdaq: { value: 12845.65, change: -23.12, changePercent: -0.18 },
    dow: { value: 33245.78, change: 45.67, changePercent: 0.14 }
  });

  const addNotification = useNotificationStore((state) => state.addNotification);

  // Simulated stock data
  const stockData = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      volume: '45.2M',
      marketCap: '2.8T',
      pe: 28.5,
      sector: 'Technology',
      logo: '🍎'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 2847.92,
      change: -15.68,
      changePercent: -0.55,
      volume: '1.2M',
      marketCap: '1.9T',
      pe: 25.2,
      sector: 'Technology',
      logo: '🔍'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 248.50,
      change: 8.25,
      changePercent: 3.44,
      volume: '28.4M',
      marketCap: '789B',
      pe: 62.1,
      sector: 'Automotive',
      logo: '⚡'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 378.85,
      change: 1.92,
      changePercent: 0.51,
      volume: '22.1M',
      marketCap: '2.8T',
      pe: 32.4,
      sector: 'Technology',
      logo: '⊞'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com, Inc.',
      price: 3247.15,
      change: -18.45,
      changePercent: -0.56,
      volume: '3.8M',
      marketCap: '1.6T',
      pe: 54.8,
      sector: 'E-commerce',
      logo: '📦'
    },
    {
      symbol: 'META',
      name: 'Meta Platforms, Inc.',
      price: 331.26,
      change: 4.78,
      changePercent: 1.47,
      volume: '18.9M',
      marketCap: '842B',
      pe: 22.7,
      sector: 'Social Media',
      logo: '📘'
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 875.42,
      change: 12.68,
      changePercent: 1.47,
      volume: '41.2M',
      marketCap: '2.2T',
      pe: 71.3,
      sector: 'Semiconductors',
      logo: '🎮'
    },
    {
      symbol: 'NFLX',
      name: 'Netflix, Inc.',
      price: 485.73,
      change: -6.42,
      changePercent: -1.30,
      volume: '4.7M',
      marketCap: '216B',
      pe: 43.2,
      sector: 'Entertainment',
      logo: '🎬'
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(currentStocks => 
        currentStocks.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: stock.change + (Math.random() - 0.5) * 0.5,
          changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setStocks(stockData);
  }, []);

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? ArrowUp : ArrowDown;
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(2);
  };

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      playSuccess();
      addNotification({
        message: `${symbol} added to watchlist`,
        type: 'success'
      });
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
    playClick();
    addNotification({
      message: `${symbol} removed from watchlist`,
      type: 'info'
    });
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, holding) => {
      const stock = stocks.find(s => s.symbol === holding.symbol);
      return total + (stock ? stock.price * holding.shares : 0);
    }, 0);
  };

  const calculatePortfolioGain = () => {
    const currentValue = calculatePortfolioValue();
    const investedValue = portfolio.reduce((total, holding) => 
      total + (holding.buyPrice * holding.shares), 0
    );
    return currentValue - investedValue;
  };

  const StockCard = ({ stock, showActions = true }) => {
    const ChangeIcon = getChangeIcon(stock.change);
    const isInWatchlist = watchlist.includes(stock.symbol);
    
    return (
      <motion.div
        className="bg-glass-dark rounded-xl p-4 border border-white/10 hover:border-accent/30 cursor-pointer group transition-all"
        onClick={() => {
          playClick();
          setSelectedStock(stock);
        }}
        whileHover={{ y: -2 }}
        layout
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center text-lg">
              {stock.logo}
            </div>
            <div>
              <h3 className="text-white font-semibold">{stock.symbol}</h3>
              <p className="text-white/60 text-sm truncate max-w-32">{stock.name}</p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isInWatchlist ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol);
                }}
                className="p-1 hover:bg-white/10 rounded transition"
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Star className={`w-4 h-4 ${isInWatchlist ? 'text-yellow-400 fill-yellow-400' : 'text-white/60'}`} />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-white">${stock.price.toFixed(2)}</div>
            <div className="text-white/60 text-sm">{stock.sector}</div>
          </div>
          
          <div className="text-right">
            <div className={`flex items-center gap-1 font-semibold ${getChangeColor(stock.change)}`}>
              <ChangeIcon className="w-4 h-4" />
              <span>${Math.abs(stock.change).toFixed(2)}</span>
            </div>
            <div className={`text-sm ${getChangeColor(stock.change)}`}>
              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-white/60">
          <span>Vol: {stock.volume}</span>
          <span>P/E: {stock.pe}</span>
          <span>{stock.marketCap}</span>
        </div>
      </motion.div>
    );
  };

  const MarketOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {Object.entries(marketData).map(([key, data]) => {
        const ChangeIcon = getChangeIcon(data.change);
        return (
          <div key={key} className="bg-glass-dark rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/90 font-semibold uppercase">{key}</h3>
                <div className="text-2xl font-bold text-white">{data.value.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 font-semibold ${getChangeColor(data.change)}`}>
                  <ChangeIcon className="w-4 h-4" />
                  <span>{Math.abs(data.change).toFixed(2)}</span>
                </div>
                <div className={`text-sm ${getChangeColor(data.change)}`}>
                  {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-white">Stock Market</h2>
          <div className="flex items-center gap-1 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">Live</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-10 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none w-48"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          </div>
          
          <button
            onClick={() => {
              playClick();
              addNotification({ message: 'Market data refreshed', type: 'success' });
            }}
            className="p-2 bg-black/20 border border-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-black/5">
        {[
          { id: 'market', label: 'Market', icon: BarChart3 },
          { id: 'watchlist', label: 'Watchlist', icon: Eye },
          { id: 'portfolio', label: 'Portfolio', icon: Briefcase }
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
          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <MarketOverview />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStocks.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'watchlist' && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">My Watchlist</h3>
                <span className="text-white/60">{watchlist.length} stocks</span>
              </div>
              
              {watchlist.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white/80 mb-2">No stocks in watchlist</h3>
                  <p className="text-white/60">Add stocks to your watchlist to track them</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchlist.map((symbol) => {
                    const stock = stocks.find(s => s.symbol === symbol);
                    return stock ? <StockCard key={symbol} stock={stock} /> : null;
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Portfolio Summary */}
              <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-white/10 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Portfolio Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-white">${formatNumber(calculatePortfolioValue())}</div>
                    <div className="text-white/80">Total Value</div>
                  </div>
                  <div>
                    <div className={`text-3xl font-bold ${getChangeColor(calculatePortfolioGain())}`}>
                      {calculatePortfolioGain() >= 0 ? '+' : ''}${formatNumber(Math.abs(calculatePortfolioGain()))}
                    </div>
                    <div className="text-white/80">Total Gain/Loss</div>
                  </div>
                  <div>
                    <div className={`text-3xl font-bold ${getChangeColor(calculatePortfolioGain())}`}>
                      {calculatePortfolioGain() >= 0 ? '+' : ''}
                      {((calculatePortfolioGain() / portfolio.reduce((total, holding) => 
                        total + (holding.buyPrice * holding.shares), 0)) * 100).toFixed(2)}%
                    </div>
                    <div className="text-white/80">Return</div>
                  </div>
                </div>
              </div>

              {/* Holdings */}
              <h3 className="text-xl font-bold text-white mb-4">Holdings</h3>
              <div className="space-y-4">
                {portfolio.map((holding) => {
                  const stock = stocks.find(s => s.symbol === holding.symbol);
                  if (!stock) return null;
                  
                  const currentValue = stock.price * holding.shares;
                  const investedValue = holding.buyPrice * holding.shares;
                  const gain = currentValue - investedValue;
                  const gainPercent = (gain / investedValue) * 100;
                  
                  return (
                    <motion.div
                      key={holding.symbol}
                      className="bg-glass-dark rounded-xl p-4 border border-white/10"
                      layout
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-xl">
                            {stock.logo}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{stock.symbol}</h4>
                            <p className="text-white/60 text-sm">{holding.shares} shares</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-white font-semibold">${currentValue.toFixed(2)}</div>
                          <div className={`text-sm ${getChangeColor(gain)}`}>
                            {gain >= 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-sm text-white/60">
                        <span>Avg Cost: ${holding.buyPrice.toFixed(2)}</span>
                        <span>Current: ${stock.price.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stock Detail Modal */}
      <AnimatePresence>
        {selectedStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedStock(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-glass backdrop-blur-lg rounded-xl border border-white/20 max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center text-2xl">
                    {selectedStock.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedStock.symbol}</h2>
                    <p className="text-white/80">{selectedStock.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <Plus className="w-5 h-5 text-white/60 rotate-45" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Price Info</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Current Price</span>
                      <span className="text-white font-semibold">${selectedStock.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Change</span>
                      <span className={getChangeColor(selectedStock.change)}>
                        {selectedStock.change >= 0 ? '+' : ''}${selectedStock.change.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Change %</span>
                      <span className={getChangeColor(selectedStock.change)}>
                        {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Market Data</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Market Cap</span>
                      <span className="text-white">{selectedStock.marketCap}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Volume</span>
                      <span className="text-white">{selectedStock.volume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">P/E Ratio</span>
                      <span className="text-white">{selectedStock.pe}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    addToWatchlist(selectedStock.symbol);
                    setSelectedStock(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-black rounded-lg transition"
                >
                  <Star className="w-4 h-4" />
                  Add to Watchlist
                </button>
                <button
                  onClick={() => {
                    playSuccess();
                    addNotification({
                      message: `Simulated buy order for ${selectedStock.symbol}`,
                      type: 'success'
                    });
                    setSelectedStock(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  Buy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stocks;