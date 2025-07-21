import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  Search,
  RefreshCw,
  ExternalLink,
  Clock,
  User,
  TrendingUp,
  Globe,
  Briefcase,
  Activity,
  Gamepad2,
  Microscope,
  Zap,
  Filter,
  BookOpen,
  Star,
  Share,
  Eye
} from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';
import { newsService } from '../../../services/api';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('technology');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const addNotification = useNotificationStore((state) => state.addNotification);

  const categories = [
    { id: 'technology', label: 'Technology', icon: Zap, color: 'text-blue-400' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'text-green-400' },
    { id: 'general', label: 'General', icon: Globe, color: 'text-purple-400' },
    { id: 'health', label: 'Health', icon: Activity, color: 'text-red-400' },
    { id: 'science', label: 'Science', icon: Microscope, color: 'text-indigo-400' },
    { id: 'sports', label: 'Sports', icon: TrendingUp, color: 'text-orange-400' },
    { id: 'entertainment', label: 'Entertainment', icon: Star, color: 'text-pink-400' }
  ];

  const fetchNews = useCallback(async (category = selectedCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      const newsData = await newsService.getTopHeadlines(category);
      setArticles(newsData);
      
      addNotification({
        message: `Latest ${category} news loaded`,
        type: 'success'
      });
    } catch (err) {
      setError('Failed to fetch news');
      addNotification({
        message: 'Failed to fetch news',
        type: 'error'
      });
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, addNotification]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleCategoryChange = (category) => {
    playClick();
    setSelectedCategory(category);
    setSearchTerm('');
    fetchNews(category);
  };

  const handleRefresh = () => {
    playClick();
    fetchNews();
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openArticle = (article) => {
    playClick();
    setSelectedArticle(article);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const shareArticle = (article) => {
    playSuccess();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url
      });
    } else {
      navigator.clipboard.writeText(article.url);
      addNotification({
        message: 'Article URL copied to clipboard',
        type: 'success'
      });
    }
  };

  const ArticleCard = ({ article, index }) => (
    <motion.div
      className="bg-glass-dark rounded-xl border border-white/10 overflow-hidden hover:border-accent/30 cursor-pointer group transition-all"
      onClick={() => openArticle(article)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      layout
    >
      {article.urlToImage && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
          <User className="w-3 h-3" />
          <span>{article.source}</span>
          <Clock className="w-3 h-3 ml-2" />
          <span>{formatTimeAgo(article.publishedAt)}</span>
        </div>
        
        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        
        {article.description && (
          <p className="text-white/70 text-sm line-clamp-3 mb-3">
            {article.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(article.url, '_blank');
            }}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Read Full Article</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              shareArticle(article);
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Share article"
          >
            <Share className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (loading && articles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-black/5">
        <motion.div
          className="text-center text-white/80"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 mx-auto mb-2" />
          <p>Loading latest news...</p>
        </motion.div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-black/5">
        <div className="text-center text-white/80">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-semibold mb-2">News Unavailable</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchNews}
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
          <Newspaper className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-white">News</h2>
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
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-10 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none w-48"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          </div>
          
          <button
            onClick={handleRefresh}
            className="p-2 bg-black/20 border border-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto border-b border-white/10 bg-black/5 p-2 gap-2 scrollbar-thin">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                selectedCategory === category.id
                  ? 'bg-accent text-black'
                  : 'bg-black/20 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto scrollbar-glass p-4">
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <Search className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p>Try adjusting your search terms or selecting a different category</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            <AnimatePresence>
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.id || index} article={article} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-glass backdrop-blur-lg rounded-xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedArticle.urlToImage && (
                <div className="aspect-video relative">
                  <img
                    src={selectedArticle.urlToImage}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition"
                  >
                    <ExternalLink className="w-5 h-5 text-white rotate-45" />
                  </button>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                  <User className="w-4 h-4" />
                  <span>{selectedArticle.source}</span>
                  <Clock className="w-4 h-4 ml-4" />
                  <span>{formatTimeAgo(selectedArticle.publishedAt)}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">{selectedArticle.title}</h2>
                
                {selectedArticle.description && (
                  <p className="text-white/80 text-lg mb-6 leading-relaxed">
                    {selectedArticle.description}
                  </p>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      window.open(selectedArticle.url, '_blank');
                      setSelectedArticle(null);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 text-black rounded-lg transition font-medium"
                  >
                    <BookOpen className="w-5 h-5" />
                    Read Full Article
                  </button>
                  <button
                    onClick={() => shareArticle(selectedArticle)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                  >
                    <Share className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;