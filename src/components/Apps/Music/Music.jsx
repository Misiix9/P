import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music as MusicIcon, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Heart,
  Download,
  Share,
  Plus,
  List,
  Search,
  MoreHorizontal,
  Grid3X3,
  Settings,
  Radio,
  Disc3,
  User,
  Clock,
  TrendingUp
} from 'lucide-react';
import { playClick, playSuccess } from '../../../utils/soundManager';
import { useNotificationStore } from '../../../stores/useStore';

const Music = () => {
  // Sample music data
  const [tracks] = useState([
    {
      id: 1,
      title: 'Neon Dreams',
      artist: 'Synthwave Artist',
      album: 'Digital Horizons',
      duration: '3:42',
      src: '', // No actual audio file
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MSkiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiLz48cGF0aCBkPSJtOSAxMiAyIDIgNC00bTYtMkE5IDkgMCAxIDEgMyAxMmE5IDkgMCAwIDEgMTggMFoiLz48L3N2Zz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQxIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzY2NjZmZiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNjYzY2ZmYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
      genre: 'Synthwave',
      year: '2023',
      liked: true
    },
    {
      id: 2,
      title: 'Code Flow',
      artist: 'Dev Beats',
      album: 'Programming Vibes',
      duration: '4:15',
      src: '',
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MikiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Im0xNiA2LTQgMTQiLz48cGF0aCBkPSJtMTIgNi00IDE0Ii8+PHBhdGggZD0ibTggNi00IDE0Ii8+PC9zdmc+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MiI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMGZmZDAiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDBhYWZmIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
      genre: 'Electronic',
      year: '2024',
      liked: false
    },
    {
      id: 3,
      title: 'Midnight Coding',
      artist: 'Lo-Fi Developer',
      album: 'Focus Sessions',
      duration: '5:28',
      src: '',
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MykiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiLz48cGF0aCBkPSJNMTIgMnYyIi8+PHBhdGggZD0iTTEyIDIwdjIiLz48cGF0aCBkPSJtNC45MyA0LjkzIDEuNDEgMS40MSIvPjxwYXRoIGQ9Im0xNy42NiAxNy42NiAxLjQxIDEuNDEiLz48cGF0aCBkPSJNMiAxMmgyIi8+PHBhdGggZD0iTTIwIDEyaDIiLz48cGF0aCBkPSJtNi4zNCAyMC42Ni0xLjQxLTEuNDEiLz48cGF0aCBkPSJtMTkuMDcgNC45My0xLjQxIDEuNDEiLz48L3N2Zz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQzIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzIyMjIyMiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0NDQ0NDQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
      genre: 'Lo-Fi',
      year: '2023',
      liked: true
    },
    {
      id: 4,
      title: 'React Symphony',
      artist: 'Frontend Orchestra',
      album: 'Component Collection',
      duration: '3:33',
      src: '',
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50NCkiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0yIDNhMSAxIDAgMCAxIDEtMWgxNmExIDEgMCAwIDEgMSAxdjE4YTEgMSAwIDAgMS0xIDFIM2ExIDEgMCAwIDEtMS0xVjN6Ii8+PHBhdGggZD0ibTcgMTAgMiAyIDQtNCIvPjwvc3ZnPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDQiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmYzMzY2Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmNjY5OSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==',
      genre: 'Orchestral',
      year: '2024',
      liked: false
    },
    {
      id: 5,
      title: 'Terminal Jazz',
      artist: 'Command Line Quartet',
      album: 'Shell Scripts',
      duration: '4:07',
      src: '',
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50NSkiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwb2x5bGluZSBwb2ludHM9IjQgMTcgMTAgMTEgNCA1Ii8+PGxpbmUgeDE9IjEyIiB5MT0iMTkiIHgyPSIyMCIgeTI9IjE5Ii8+PC9zdmc+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50NSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzMzMzMzMiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTU1NTU1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
      genre: 'Jazz',
      year: '2023',
      liked: true
    }
  ]);

  const [playlists] = useState([
    { id: 1, name: 'Coding Vibes', tracks: [1, 2, 3], cover: '🎵' },
    { id: 2, name: 'Focus Mode', tracks: [3, 5], cover: '🎯' },
    { id: 3, name: 'Liked Songs', tracks: [1, 3, 5], cover: '❤️' },
    { id: 4, name: 'Recently Played', tracks: [1, 2, 4], cover: '🕒' }
  ]);

  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(222); // 3:42 in seconds
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [viewMode, setViewMode] = useState('tracks'); // 'tracks', 'playlists', 'albums'
  const [searchTerm, setSearchTerm] = useState('');
  const [likedTracks, setLikedTracks] = useState(new Set([1, 3, 5]));
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const progressInterval = useRef(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Simulate audio progress
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            if (isRepeat) {
              return 0;
            } else {
              setIsPlaying(false);
              return duration;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }

    return () => clearInterval(progressInterval.current);
  }, [isPlaying, duration, isRepeat]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playTrack = (track) => {
    playClick();
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    // Simulate different durations for different tracks
    const durations = { 1: 222, 2: 255, 3: 328, 4: 213, 5: 247 };
    setDuration(durations[track.id] || 222);
    
    addNotification({
      message: `Now playing: ${track.title}`,
      type: 'success'
    });
  };

  const togglePlay = () => {
    playClick();
    setIsPlaying(!isPlaying);
  };

  const previousTrack = () => {
    playClick();
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    playTrack(tracks[prevIndex]);
  };

  const nextTrack = () => {
    playClick();
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    playTrack(tracks[nextIndex]);
  };

  const toggleLike = (trackId) => {
    playSuccess();
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
        addNotification({ message: 'Removed from liked songs', type: 'info' });
      } else {
        newSet.add(trackId);
        addNotification({ message: 'Added to liked songs', type: 'success' });
      }
      return newSet;
    });
  };

  const downloadTrack = (track) => {
    playSuccess();
    addNotification({
      message: `${track.title} downloaded`,
      type: 'success'
    });
  };

  // Audio visualization bars (simulated)
  const VisualizationBars = () => {
    const [bars] = useState(Array.from({ length: 20 }, (_, i) => i));
    
    return (
      <div className="flex items-end justify-center gap-1 h-16 px-4">
        {bars.map((bar) => (
          <motion.div
            key={bar}
            className="bg-accent w-1 rounded-full"
            animate={{
              height: isPlaying 
                ? [Math.random() * 40 + 10, Math.random() * 50 + 15, Math.random() * 30 + 8]
                : 4
            }}
            transition={{
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    );
  };

  const TrackItem = ({ track, index, onClick }) => (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer group transition-all"
      onClick={() => onClick(track)}
      whileHover={{ x: 4 }}
      layout
    >
      <div className="relative flex-shrink-0">
        <img
          src={track.cover}
          alt={track.album}
          className="w-12 h-12 rounded object-cover"
        />
        {currentTrack.id === track.id && isPlaying && (
          <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Pause className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${
          currentTrack.id === track.id ? 'text-accent' : 'text-white/90'
        }`}>
          {track.title}
        </h3>
        <p className="text-white/60 text-sm truncate">{track.artist}</p>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
          className="p-1 hover:bg-white/10 rounded transition"
        >
          <Heart 
            className={`w-4 h-4 ${likedTracks.has(track.id) ? 'text-red-500 fill-red-500' : 'text-white/60'}`}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadTrack(track);
          }}
          className="p-1 hover:bg-white/10 rounded transition"
        >
          <Download className="w-4 h-4 text-white/60" />
        </button>
      </div>
      
      <span className="text-white/60 text-sm font-mono">{track.duration}</span>
    </motion.div>
  );

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.album.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-black/5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <MusicIcon className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-white">Music Player</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Search music..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-accent focus:outline-none w-48"
            />
          </div>
          
          {/* View Mode */}
          <div className="flex bg-black/20 rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('tracks')}
              className={`px-3 py-2 rounded-l-lg transition text-sm ${
                viewMode === 'tracks' ? 'bg-accent text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              Tracks
            </button>
            <button
              onClick={() => setViewMode('playlists')}
              className={`px-3 py-2 rounded-r-lg transition text-sm ${
                viewMode === 'playlists' ? 'bg-accent text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              Playlists
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Now Playing Card */}
          <div className="bg-black/10 border-b border-white/10 p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.album}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-accent/60"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg truncate">{currentTrack.title}</h3>
                <p className="text-white/80 truncate">{currentTrack.artist}</p>
                <p className="text-white/60 text-sm truncate">{currentTrack.album}</p>
              </div>
              
              <VisualizationBars />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto scrollbar-glass p-4">
            {viewMode === 'tracks' ? (
              <div className="space-y-1">
                <h3 className="text-white/80 text-sm uppercase tracking-wide font-semibold mb-3">
                  All Tracks ({filteredTracks.length})
                </h3>
                {filteredTracks.map((track, index) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    index={index}
                    onClick={playTrack}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    className="bg-glass-dark rounded-xl p-4 border border-white/10 hover:border-accent/30 cursor-pointer transition-all"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPlaylist(playlist)}
                  >
                    <div className="text-4xl mb-3 text-center">{playlist.cover}</div>
                    <h3 className="text-white font-medium text-center">{playlist.name}</h3>
                    <p className="text-white/60 text-sm text-center mt-1">
                      {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="bg-black/20 border-t border-white/10 p-4">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white/60 text-sm font-mono">{formatTime(currentTime)}</span>
          <div className="flex-1 bg-white/20 rounded-full h-1 cursor-pointer">
            <motion.div
              className="bg-accent h-1 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
              initial={false}
            />
          </div>
          <span className="text-white/60 text-sm font-mono">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-2 rounded transition ${
                isShuffle ? 'text-accent bg-accent/20' : 'text-white/60 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={previousTrack}
              className="p-2 text-white/80 hover:text-white transition"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-accent text-black rounded-full hover:bg-accent/80 transition"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-2 text-white/80 hover:text-white transition"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-2 rounded transition ${
                isRepeat ? 'text-accent bg-accent/20' : 'text-white/60 hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/60 hover:text-white transition"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              className="w-20 accent-accent"
            />
            <span className="text-white/60 text-xs font-mono w-8">
              {isMuted ? 0 : volume}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music;