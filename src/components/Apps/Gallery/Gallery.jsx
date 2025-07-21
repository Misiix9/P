import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Grid3X3, 
  List, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download,
  Share,
  Heart,
  Info,
  Filter,
  Search,
  FolderOpen,
  Maximize,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  Upload
} from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';

const Gallery = () => {
  // Sample images for the gallery
  const [images] = useState([
    {
      id: 1,
      name: 'Mountain Landscape',
      src: '/wallpapers/mountains.jpg',
      thumbnail: '/wallpapers/mountains.jpg',
      size: '1920x1080',
      type: 'landscape',
      tags: ['nature', 'mountains', 'landscape'],
      liked: false,
      dateAdded: '2024-01-15'
    },
    {
      id: 2,
      name: 'Abstract Design',
      src: '/wallpapers/abstract.jpg',
      thumbnail: '/wallpapers/abstract.jpg',
      size: '1920x1080',
      type: 'abstract',
      tags: ['abstract', 'art', 'colorful'],
      liked: true,
      dateAdded: '2024-01-14'
    },
    {
      id: 3,
      name: 'Space Nebula',
      src: '/wallpapers/space.jpg',
      thumbnail: '/wallpapers/space.jpg',
      size: '1920x1080',
      type: 'space',
      tags: ['space', 'nebula', 'astronomy'],
      liked: false,
      dateAdded: '2024-01-13'
    },
    {
      id: 4,
      name: 'Gradient Background',
      src: '/wallpapers/gradient.jpg',
      thumbnail: '/wallpapers/gradient.jpg',
      size: '1920x1080',
      type: 'gradient',
      tags: ['gradient', 'minimal', 'design'],
      liked: true,
      dateAdded: '2024-01-12'
    },
    // Portfolio screenshots (simulated)
    {
      id: 5,
      name: 'Portfolio Desktop',
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGI+',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGI+',
      size: '1920x1080',
      type: 'screenshot',
      tags: ['portfolio', 'desktop', 'ui'],
      liked: false,
      dateAdded: '2024-01-11'
    },
    {
      id: 6,
      name: 'Browser App',
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMTExODI3Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZpbGw9IiMwMGZmZDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiI+QnJvd3NlciBBcHA8L3RleHQ+Cjwvc3ZnPg==',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMTExODI3Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZpbGw9IiMwMGZmZDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiI+QnJvd3NlciBBcHA8L3RleHQ+Cjwvc3ZnPg==',
      size: '800x600',
      type: 'screenshot',
      tags: ['browser', 'app', 'web'],
      liked: true,
      dateAdded: '2024-01-10'
    }
  ]);

  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'slideshow'
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showImageDetails, setShowImageDetails] = useState(false);
  const [likedImages, setLikedImages] = useState(new Set([2, 4, 6]));

  const slideshowInterval = useRef(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Filter images based on search and filter
  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || 
                         image.type === filter || 
                         (filter === 'liked' && likedImages.has(image.id));
    return matchesSearch && matchesFilter;
  });

  // Slideshow functionality
  useEffect(() => {
    if (isSlideshow && selectedImage) {
      slideshowInterval.current = setInterval(() => {
        setCurrentImageIndex(prev => 
          prev === filteredImages.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    } else {
      clearInterval(slideshowInterval.current);
    }

    return () => clearInterval(slideshowInterval.current);
  }, [isSlideshow, selectedImage, filteredImages.length]);

  // Update selected image when index changes
  useEffect(() => {
    if (filteredImages[currentImageIndex]) {
      setSelectedImage(filteredImages[currentImageIndex]);
    }
  }, [currentImageIndex, filteredImages]);

  const openImage = (image, index) => {
    playClick();
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setZoomLevel(100);
    setRotation(0);
  };

  const closeImage = () => {
    playClick();
    setSelectedImage(null);
    setIsSlideshow(false);
    setZoomLevel(100);
    setRotation(0);
  };

  const navigateImage = (direction) => {
    playClick();
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % filteredImages.length
      : (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(newIndex);
  };

  const toggleLike = (imageId) => {
    playSuccess();
    setLikedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
        addNotification({ message: 'Removed from favorites', type: 'info' });
      } else {
        newSet.add(imageId);
        addNotification({ message: 'Added to favorites', type: 'success' });
      }
      return newSet;
    });
  };

  const downloadImage = (image) => {
    playSuccess();
    addNotification({ 
      message: `${image.name} downloaded`, 
      type: 'success' 
    });
  };

  const ImageCard = ({ image, index, onClick }) => (
    <motion.div
      className="relative group cursor-pointer bg-glass-dark rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 transition-all duration-300"
      onClick={() => onClick(image, index)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image.thumbnail}
          alt={image.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMmEyYTJhIi8+CjxwYXRoIGQ9Ik0xNDAgODBMMTgwIDEyMEgxMDBMMTQwIDgwWiIgZmlsbD0iIzUwNTA1MCIvPgo8Y2lyY2xlIGN4PSIxMjAiIGN5PSI2MCIgcj0iMTAiIGZpbGw9IiM1MDUwNTAiLz4KPHR3eHQgeD0iMTYwIiB5PSIxMDAiIGZpbGw9IiM5MDkwOTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
          }}
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(image.id);
              }}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
            >
              <Heart 
                className={`w-4 h-4 ${likedImages.has(image.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} 
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadImage(image);
              }}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-white/90 font-medium text-sm truncate">{image.name}</h3>
        <p className="text-white/60 text-xs mt-1">{image.size}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {image.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-white">Gallery</h2>
          <span className="text-white/60 text-sm">
            {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none w-48"
            />
          </div>
          
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none"
          >
            <option value="all">All Images</option>
            <option value="liked">Favorites</option>
            <option value="landscape">Landscapes</option>
            <option value="abstract">Abstract</option>
            <option value="space">Space</option>
            <option value="screenshot">Screenshots</option>
          </select>
          
          {/* View Mode */}
          <div className="flex bg-black/20 rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition ${
                viewMode === 'grid' ? 'bg-accent text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition ${
                viewMode === 'list' ? 'bg-accent text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto scrollbar-glass p-4">
        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <ImageIcon className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No images found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            layout
          >
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  onClick={openImage}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="flex items-center gap-4 p-3 bg-glass-dark rounded-lg border border-white/10 hover:border-accent/30 cursor-pointer transition-all"
                onClick={() => openImage(image, index)}
                whileHover={{ x: 4 }}
                layout
              >
                <img
                  src={image.thumbnail}
                  alt={image.name}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMmEyYTJhIi8+CjxwYXRoIGQ9Ik0yOCAyMEwzNiAzMkgyMEwyOCAyMFoiIGZpbGw9IiM1MDUwNTAiLz4KPGNpcmNsZSBjeD0iMjQiIGN5PSIxNiIgcj0iNCIgZmlsbD0iIzUwNTA1MCIvPgo8L3N2Zz4K';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-white/90 font-medium">{image.name}</h3>
                  <p className="text-white/60 text-sm">{image.size} • {image.dateAdded}</p>
                  <div className="flex gap-1 mt-1">
                    {image.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(image.id);
                    }}
                    className="p-1 hover:bg-white/10 rounded transition"
                  >
                    <Heart 
                      className={`w-4 h-4 ${likedImages.has(image.id) ? 'text-red-500 fill-red-500' : 'text-white/60'}`} 
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(image);
                    }}
                    className="p-1 hover:bg-white/10 rounded transition"
                  >
                    <Download className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={closeImage}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.name}
                  className="w-full h-full object-contain rounded-lg transition-transform duration-300"
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMmEyYTJhIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmaWxsPSIjOTA5MDkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD4KPC9zdmc+';
                  }}
                />
                
                {/* Navigation arrows */}
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setIsSlideshow(!isSlideshow)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded transition"
                  title={isSlideshow ? 'Stop slideshow' : 'Start slideshow'}
                >
                  {isSlideshow ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded transition"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded transition"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded transition"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => toggleLike(selectedImage.id)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded transition"
                  title="Toggle favorite"
                >
                  <Heart 
                    className={`w-4 h-4 ${likedImages.has(selectedImage.id) ? 'text-red-500 fill-red-500' : 'text-white'}`}
                  />
                </button>
                <button
                  onClick={() => downloadImage(selectedImage)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded transition"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={closeImage}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded transition"
                  title="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Image info */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-white font-semibold">{selectedImage.name}</h3>
                <p className="text-white/80 text-sm">{selectedImage.size}</p>
                <div className="flex gap-1 mt-1">
                  {selectedImage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-white text-sm">
                  {currentImageIndex + 1} / {filteredImages.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;