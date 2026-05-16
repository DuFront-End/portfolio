import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaPause, FaStepForward } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import AutoTranslate from '../common/AutoTranslate'

const FALLBACK_PLAYLIST = [
  { id: 0, title: "Lofi Study", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
]

interface MusicPlayerProps {
  onMusicStateChange?: (isPlaying: boolean) => void
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onMusicStateChange }) => {
  const { t } = useTranslation()
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playlist, setPlaylist] = useState(FALLBACK_PLAYLIST)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    onMusicStateChange?.(isMusicPlaying)
  }, [isMusicPlaying, onMusicStateChange])

  // Fetch playlist
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
        const res = await fetch(`${apiUrl}/api/playlist`);
        const data = await res.json();
        if (data.success) {
          const formattedPlaylist = data.data.map((item: any, index: number) => ({
            id: index,
            title: item.title,
            url: item.url,
          }));
          setPlaylist(formattedPlaylist.length > 0 ? formattedPlaylist : FALLBACK_PLAYLIST);
        }
      } catch (error) {
        console.error('❌ Failed to fetch playlist:', error);
      }
    }
    fetchPlaylist();
  }, []);

  // Listen for AI commands
  useEffect(() => {
    const handleAIPlay = (e: any) => {
      const songName = e.detail.songName.toLowerCase();
      const trackIndex = playlist.findIndex(track => 
        track.title.toLowerCase().includes(songName)
      );

      if (trackIndex !== -1) {
        setCurrentTrackIndex(trackIndex);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play()
              .then(() => setIsMusicPlaying(true))
              .catch(err => console.error("AI Playback failed:", err));
          }
        }, 300);
      }
    };

    window.addEventListener('ai-play-song', handleAIPlay);
    return () => window.removeEventListener('ai-play-song', handleAIPlay);
  }, [playlist]);

  const nextTrack = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length
    setCurrentTrackIndex(nextIndex)

    if (isMusicPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().catch(err => console.error("Auto-play next track failed:", err));
        }
      }, 200);
    }
  }

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      if (audioRef.current) {
        // Setup Web Audio API for visualizer
        if (!(window as any).audioContext) {
          try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const context = new AudioContext();
            const analyser = context.createAnalyser();
            const source = context.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(context.destination);
            analyser.fftSize = 256;
            (window as any).audioContext = context;
            (window as any).audioAnalyser = analyser;
          } catch (err) {
            console.error("Failed to setup AudioContext:", err);
          }
        }
        
        // Resume context if suspended (browser security)
        if ((window as any).audioContext?.state === 'suspended') {
          (window as any).audioContext.resume();
        }

        audioRef.current.volume = 1;
        audioRef.current.muted = false;
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(err => console.error("🎵 Playback failed:", err));
      }
    }
  }

  const currentAudioUrl = useMemo(() => {
    const track = playlist[currentTrackIndex];
    if (!track) return '';
    
    let url = track.url;
    // If the URL is already an absolute HTTP URL (like Cloudinary), use it directly.
    if (url.startsWith('http')) {
      return `${url}?v=${track.id}`;
    }

    // Otherwise, it's a relative path hosted on the backend.
    // Strip '/public' prefix if it exists, as the backend serves it directly under /public
    // Wait, the backend uses `app.use('/public', express.static(...))`, so `/public/uploads/...` is correct for the backend.
    // Let's just make sure it has a leading slash and prepend the backend URL.
    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    return `${apiUrl}${encodeURI(cleanUrl)}?v=${track.id}`;
  }, [playlist, currentTrackIndex]);

  return (
    <>
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        crossOrigin="anonymous"
        onEnded={() => nextTrack()}
        preload="auto"
      />

      {playlist.length > 0 && (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6">
          <AnimatePresence mode="wait">
            {isMusicPlaying ? (
              <motion.div
                key="playing-indicator"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="bg-black/80 border-r-4 border-music-gold px-4 py-1.5 backdrop-blur-md shadow-2xl flex items-center gap-3 rounded-l-md"
              >
                <p className="text-[10px] font-tech text-music-gold tracking-[2px] uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-music-red animate-pulse shadow-[0_0_8px_#e94560]" />
                  <AutoTranslate text="Playing" />: {playlist[currentTrackIndex]?.title}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="hint-indicator"
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="relative bg-gradient-to-r from-music-blue/90 to-music-dark/95 border border-music-gold/30 px-4 py-2 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3 cursor-pointer select-none hover:border-music-gold transition-colors group"
                onClick={toggleMusic}
              >
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-music-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-music-gold"></span>
                </div>
                <p className="text-xs font-semibold text-music-gold tracking-wide whitespace-nowrap flex items-center gap-1.5 group-hover:text-white transition-colors">
                  <AutoTranslate text={t('music.hint')} />
                </p>
                <div className="absolute right-8 -bottom-1.5 w-3 h-3 bg-music-dark/95 border-r border-b border-music-gold/30 rotate-45 z-[-1]"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-5">
            <AnimatePresence>
              {isMusicPlaying && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={nextTrack}
                  className="w-9 h-9 rounded-lg bg-music-blue/40 border border-music-gold/20 flex items-center justify-center hover:border-music-red transition-all group backdrop-blur-sm"
                >
                  <FaStepForward className="text-music-gold group-hover:text-music-red text-xs" />
                </motion.button>
              )}
            </AnimatePresence>

            <motion.div 
              className="relative cursor-pointer group" 
              onClick={toggleMusic}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.div
                animate={{ rotate: isMusicPlaying ? -12 : -45 }}
                transition={{ type: "spring", stiffness: 60 }}
                className="absolute -top-5 -right-1 w-14 h-1.5 bg-gradient-to-l from-music-gold to-music-cream rounded-full z-[110] origin-right shadow-lg"
              >
                <div className="absolute left-0 top-0 w-3.5 h-4 bg-music-dark border border-music-gold/50 rounded-sm -rotate-12 shadow-md" />
              </motion.div>

              <motion.div
                animate={!isMusicPlaying ? {
                  boxShadow: ['0 0 15px rgba(255, 215, 0, 0.2)', '0 0 28px rgba(255, 215, 0, 0.45)', '0 0 15px rgba(255, 215, 0, 0.2)']
                } : {
                  boxShadow: ['0 0 30px rgba(233, 69, 96, 0.4)', '0 0 50px rgba(233, 69, 96, 0.75)', '0 0 30px rgba(233, 69, 96, 0.4)']
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`w-20 h-20 rounded-full relative flex items-center justify-center vinyl-rings overflow-hidden border-2 transition-colors duration-700
                  ${isMusicPlaying ? 'border-music-red' : 'border-music-gold/40 group-hover:border-music-gold'}`}
              >
                <motion.div
                  animate={isMusicPlaying ? { rotate: 360 } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 vinyl-shine z-10 opacity-60"
                />

                <motion.div
                  animate={isMusicPlaying ? { rotate: 360 } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-7 h-7 rounded-full bg-music-red flex items-center justify-center z-20 border-2 border-black/40 shadow-inner"
                >
                  {isMusicPlaying ? <FaPause className="text-white text-[9px]" /> : <FaPlay className="text-white text-[9px] ml-0.5" />}
                </motion.div>
                <div className="absolute inset-0 m-auto w-1 h-1 bg-music-gold rounded-full z-30" />
              </motion.div>

              <div className={`absolute -inset-2 rounded-2xl -z-10 blur-md transition-colors duration-1000
                ${isMusicPlaying ? 'bg-music-red/15' : 'bg-music-blue/25'}`}
              />
            </motion.div>
          </div>
        </div>
      )}
    </>
  )
}

export default MusicPlayer
