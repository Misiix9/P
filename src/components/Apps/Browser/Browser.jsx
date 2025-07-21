import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Star, 
  Plus, 
  X, 
  Lock, 
  Shield,
  Bookmark,
  Menu,
  Search,
  Settings,
  Download
} from 'lucide-react';
import { useNotificationStore } from '../../../stores/useStore';
import { playClick, playSuccess } from '../../../utils/soundManager';

const Browser = () => {
  const [tabs, setTabs] = useState([
    { 
      id: 1, 
      title: 'Welcome to Portfolio Browser', 
      url: 'portfolio://welcome',
      isActive: true,
      isLoading: false,
      favicon: '🏠'
    }
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [addressBar, setAddressBar] = useState('portfolio://welcome');
  const [bookmarks, setBookmarks] = useState([
    { name: 'Portfolio Home', url: 'portfolio://welcome', favicon: '🏠' },
    { name: 'My Projects', url: 'portfolio://projects', favicon: '💼' },
    { name: 'Contact Me', url: 'portfolio://contact', favicon: '📧' },
    { name: 'GitHub', url: 'https://github.com', favicon: '🐙' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', favicon: '📚' }
  ]);
  const [history, setHistory] = useState(['portfolio://welcome']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);

  const addNotification = useNotificationStore((state) => state.addNotification);

  // Sample pages content
  const pages = {
    'portfolio://welcome': {
      title: 'Welcome to Portfolio Browser',
      content: (
        <div className="p-8 text-center">
          <div className="mb-8">
            <Globe className="w-24 h-24 mx-auto mb-4 text-accent" />
            <h1 className="text-4xl font-bold text-white mb-4">Portfolio Browser</h1>
            <p className="text-white/70 text-lg mb-8">
              Experience the web in a whole new way. This browser showcases modern web technologies 
              and demonstrates advanced portfolio capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-dark p-6 rounded-xl">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast & Modern</h3>
              <p className="text-white/60">Built with the latest web technologies for optimal performance.</p>
            </div>
            <div className="glass-dark p-6 rounded-xl">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
              <p className="text-white/60">Advanced security features to protect your browsing experience.</p>
            </div>
            <div className="glass-dark p-6 rounded-xl">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-white/60">Optimized for speed with instant page loads and smooth animations.</p>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigateToUrl('portfolio://projects')}
                className="glass-dark px-6 py-3 rounded-lg hover:bg-white/20 transition text-white"
              >
                View Projects
              </button>
              <button 
                onClick={() => navigateToUrl('portfolio://contact')}
                className="glass-dark px-6 py-3 rounded-lg hover:bg-white/20 transition text-white"
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>
      )
    },
    'portfolio://projects': {
      title: 'My Projects',
      content: (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-8">My Projects</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Desktop Portfolio', tech: 'React, Framer Motion', status: 'Active' },
              { name: 'E-commerce Platform', tech: 'Next.js, Stripe', status: 'Completed' },
              { name: 'Mobile App', tech: 'React Native', status: 'In Progress' },
              { name: 'AI Assistant', tech: 'Python, TensorFlow', status: 'Planning' }
            ].map((project, index) => (
              <div key={index} className="glass-dark p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-accent mb-2">{project.tech}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                  project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'portfolio://contact': {
      title: 'Contact Me',
      content: (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Get In Touch</h1>
          <div className="max-w-2xl mx-auto">
            <div className="glass-dark p-8 rounded-xl">
              <form className="space-y-6">
                <div>
                  <label className="block text-white/80 mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-accent focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-accent focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Message</label>
                  <textarea 
                    rows="5" 
                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white focus:border-accent focus:outline-none resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/80 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    playSuccess();
                    addNotification({ 
                      message: 'Message sent successfully!', 
                      type: 'success' 
                    });
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )
    }
  };

  const navigateToUrl = (url) => {
    playClick();
    setAddressBar(url);
    
    // Update active tab
    setTabs(tabs.map(tab => 
      tab.id === activeTab 
        ? { 
            ...tab, 
            url, 
            title: pages[url]?.title || url,
            isLoading: true 
          }
        : tab
    ));

    // Simulate loading
    setTimeout(() => {
      setTabs(tabs => tabs.map(tab => 
        tab.id === activeTab ? { ...tab, isLoading: false } : tab
      ));
    }, 500);

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const createNewTab = () => {
    playClick();
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    const newTab = {
      id: newId,
      title: 'New Tab',
      url: 'portfolio://welcome',
      isActive: true,
      isLoading: false,
      favicon: '🆕'
    };
    
    setTabs([...tabs.map(t => ({ ...t, isActive: false })), newTab]);
    setActiveTab(newId);
    setAddressBar('portfolio://welcome');
  };

  const closeTab = (tabId) => {
    playClick();
    if (tabs.length === 1) return; // Don't close last tab
    
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      const newActiveTab = newTabs[newTabs.length - 1];
      setActiveTab(newActiveTab.id);
      setAddressBar(newActiveTab.url);
    }
  };

  const switchTab = (tabId) => {
    playClick();
    setTabs(tabs.map(t => ({ ...t, isActive: t.id === tabId })));
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    setAddressBar(tab.url);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      playClick();
      setHistoryIndex(historyIndex - 1);
      navigateToUrl(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      playClick();
      setHistoryIndex(historyIndex + 1);
      navigateToUrl(history[historyIndex + 1]);
    }
  };

  const refresh = () => {
    playClick();
    const currentTab = tabs.find(t => t.id === activeTab);
    if (currentTab) {
      setTabs(tabs.map(tab => 
        tab.id === activeTab ? { ...tab, isLoading: true } : tab
      ));
      
      setTimeout(() => {
        setTabs(tabs => tabs.map(tab => 
          tab.id === activeTab ? { ...tab, isLoading: false } : tab
        ));
      }, 500);
    }
  };

  const addBookmark = () => {
    playSuccess();
    const currentTab = tabs.find(t => t.id === activeTab);
    if (currentTab && !bookmarks.some(b => b.url === currentTab.url)) {
      setBookmarks([...bookmarks, {
        name: currentTab.title,
        url: currentTab.url,
        favicon: currentTab.favicon
      }]);
      addNotification({ 
        message: 'Bookmark added successfully!', 
        type: 'success' 
      });
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);
  const currentPage = pages[currentTab?.url] || { title: '404 Not Found', content: <div className="p-8 text-center text-white/60">Page not found</div> };

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Tab Bar */}
      <div className="flex items-center bg-black/20 border-b border-white/10">
        <div className="flex-1 flex items-center">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 border-r border-white/10 cursor-pointer min-w-0 max-w-48 ${
                tab.id === activeTab ? 'bg-black/30' : 'hover:bg-white/5'
              }`}
              onClick={() => switchTab(tab.id)}
              layout
            >
              <span className="text-sm">{tab.favicon}</span>
              <span className="text-white/80 text-sm truncate flex-1">
                {tab.isLoading ? 'Loading...' : tab.title}
              </span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="w-4 h-4 flex items-center justify-center hover:bg-white/20 rounded"
                >
                  <X className="w-3 h-3 text-white/60" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
        <button
          onClick={createNewTab}
          className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-3 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/70"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/70"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={refresh}
            className="p-2 rounded hover:bg-white/10 text-white/70"
          >
            <RotateCw className={`w-4 h-4 ${currentTab?.isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex-1 flex items-center bg-black/20 rounded-lg border border-white/10 px-3 py-2">
          <div className="flex items-center gap-2 text-green-400">
            <Lock className="w-4 h-4" />
            <Shield className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                navigateToUrl(addressBar);
              }
            }}
            className="flex-1 bg-transparent text-white/90 px-3 py-1 outline-none"
            placeholder="Search or enter URL..."
          />
          <button className="text-white/60 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={addBookmark}
            className="p-2 rounded hover:bg-white/10 text-white/70"
            title="Add bookmark"
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="p-2 rounded hover:bg-white/10 text-white/70"
            title="Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDownloads(!showDownloads)}
            className="p-2 rounded hover:bg-white/10 text-white/70"
            title="Downloads"
          >
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded hover:bg-white/10 text-white/70">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <AnimatePresence>
        {showBookmarks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/10 border-b border-white/10 p-2"
          >
            <div className="flex items-center gap-2 overflow-x-auto">
              {bookmarks.map((bookmark, index) => (
                <button
                  key={index}
                  onClick={() => navigateToUrl(bookmark.url)}
                  className="flex items-center gap-2 px-3 py-1 rounded hover:bg-white/10 text-white/80 text-sm whitespace-nowrap"
                >
                  <span>{bookmark.favicon}</span>
                  <span>{bookmark.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto scrollbar-glass">
        <motion.div
          key={currentTab?.url}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {currentTab?.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3 text-white/60">
                <RotateCw className="w-6 h-6 animate-spin" />
                <span>Loading...</span>
              </div>
            </div>
          ) : (
            currentPage.content
          )}
        </motion.div>
      </div>

      {/* Status Bar */}
      <div className="bg-black/20 border-t border-white/10 px-3 py-1 text-xs text-white/60 flex items-center justify-between">
        <span>Ready</span>
        <div className="flex items-center gap-4">
          <span>{isIncognito ? '🕵️ Incognito' : '🌐 Normal'}</span>
          <span>Zoom: 100%</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Secure
          </span>
        </div>
      </div>
    </div>
  );
};

export default Browser;