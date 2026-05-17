// src/components/sections/Achievements.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrophy, FaMusic, FaMousePointer, FaHandPointer, FaChevronLeft, FaChevronRight, FaTimes, FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { getIcon } from '../../utils/iconMap'
import AutoTranslate from '../common/AutoTranslate'
import { useSmartPolling } from '../../hooks/useSmartPolling'
import SectionFocusWrapper from '../common/SectionFocusWrapper'
// @ts-ignore
import confetti from 'canvas-confetti'

interface AchievementAPI {
    _id: string
    title: string
    period: string
    description: string
    icon: string
    image?: string
    images?: string[]
    imageDescriptions?: string[]
    articleUrl?: string
    articleDescription?: string
    articles?: { url: string; description: string }[]
    color: string
    bgColor: string
    borderColor: string
    order: number
}

interface AchievementUI extends Omit<AchievementAPI, 'icon'> {
    icon: any
}

const Achievements = ({ activeSection }: { activeSection?: string }) => {
    const isActive = activeSection === 'achievements'
    const { t } = useTranslation()
    const [apiAchievements, setApiAchievements] = useState<AchievementAPI[] | null>(null)
    const [activeAchievement, setActiveAchievement] = useState<AchievementUI | null>(null)
    const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0)

    const triggerFireworks = () => {
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
            // @ts-ignore
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#D4AF37', '#FF3366', '#00F0FF'],
                zIndex: 300
            });
            // @ts-ignore
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#D4AF37', '#FF3366', '#00F0FF'],
                zIndex: 300
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }

    useSmartPolling(async () => {
        try {
            const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
            const res = await fetch(`${apiUrl}/api/achievements`);
            if (res.status === 429) return res;

            const data = await res.json();
            if (data.success) {
                setApiAchievements(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data.data)) {
                        return data.data;
                    }
                    return prev;
                });
            }
        } catch (error) {
            throw error;
        }
    }, 25000);

    const achievements = apiAchievements
        ? apiAchievements.map(a => ({
            ...a,
            icon: getIcon(a.icon),
        }))
        : []

    return (
        <section id="achievements" className="section-container overflow-hidden">
            <SectionFocusWrapper isActive={isActive}>
                <h2 className="section-title">
                    <span className="flex items-center justify-center gap-4">
                        <AutoTranslate text={t('achievements.title')} />
                        <FaTrophy className="text-music-gold" />
                    </span>
                </h2>

                <div className="max-w-4xl mx-auto px-4 md:px-0">
                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-music-red via-music-gold to-tech-cyan opacity-30" />

                        {achievements.map((achievement, index) => {
                            const Icon = achievement.icon
                            const isEven = index % 2 === 0

                            return (
                                <motion.div
                                    key={achievement._id}
                                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={clsx(
                                        "relative flex items-center mb-10 md:mb-16 w-full group",
                                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-full md:w-5/12 pl-12 md:pl-0",
                                        isEven ? "md:pr-10 md:text-right" : "md:pl-10 md:text-left"
                                    )}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className={clsx(
                                                "music-card p-5 md:p-6 border relative cursor-pointer",
                                                achievement.bgColor,
                                                achievement.borderColor
                                            )}
                                            onMouseEnter={() => { 
                                                if (window.innerWidth >= 768) {
                                                    const hasContent = achievement.image || (achievement.images && achievement.images.length > 0) || achievement.articleUrl || (achievement.articles && achievement.articles.length > 0);
                                                    if (hasContent) {
                                                        triggerFireworks();
                                                        setActiveAchievement(achievement);
                                                        setActivePhotoIndex(0);
                                                    }
                                                }
                                            }}
                                            onClick={() => { 
                                                const hasContent = achievement.image || (achievement.images && achievement.images.length > 0) || achievement.articleUrl || (achievement.articles && achievement.articles.length > 0);
                                                if (hasContent) {
                                                    triggerFireworks();
                                                    setActiveAchievement(achievement);
                                                    setActivePhotoIndex(0);
                                                }
                                            }}
                                        >
                                            <div className={clsx(
                                                "inline-flex items-center space-x-2 px-3 py-1 rounded-full mb-3 bg-black/20 border border-white/5",
                                                isEven ? "md:ml-auto" : "md:mr-auto"
                                            )}>
                                                <FaMusic className="text-music-red text-[10px]" />
                                                <span className="text-xs text-music-cream/80">{achievement.period}</span>
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-music-cream mb-2">
                                                <AutoTranslate text={achievement.title} />
                                            </h3>
                                            <p className="text-sm md:text-base text-music-cream/70 leading-relaxed">
                                                <AutoTranslate text={achievement.description} />
                                            </p>
                                            {(achievement.image || (achievement.images && achievement.images.length > 0) || achievement.articleUrl || (achievement.articles && achievement.articles.length > 0)) && (
                                                <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-tech text-music-gold/70 uppercase tracking-widest group-hover:text-music-gold transition-all duration-300">
                                                    <FaMousePointer className="hidden md:block animate-pulse shrink-0" />
                                                    <FaHandPointer className="md:hidden block animate-bounce shrink-0" />
                                                    
                                                    <span className="hidden md:inline">
                                                        {achievement.images && achievement.images.length > 0 
                                                            ? <AutoTranslate text="Hover to view Album & Details" /> 
                                                            : <AutoTranslate text="Hover to view details" />
                                                        }
                                                    </span>
                                                    <span className="md:hidden inline">
                                                        {achievement.images && achievement.images.length > 0 
                                                            ? <AutoTranslate text="Tap to view Album & Details" /> 
                                                            : <AutoTranslate text="Tap to view details" />
                                                        }
                                                    </span>

                                                    {achievement.images && achievement.images.length > 0 && (
                                                        <span className="ml-1 bg-music-red/20 text-music-cream border border-music-red/30 px-2 py-0.5 rounded-full text-[9px] lowercase font-mono tracking-normal normal-case font-bold animate-pulse flex items-center gap-1 shadow-sm">
                                                            <span>📷 <AutoTranslate text="Album" /></span>
                                                            <span className="text-music-gold">+{achievement.images.length}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>

                                    <div 
                                        className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10 flex items-center justify-center cursor-pointer"
                                        onClick={() => { 
                                            const hasContent = achievement.image || (achievement.images && achievement.images.length > 0) || achievement.articleUrl || (achievement.articles && achievement.articles.length > 0);
                                            if (hasContent) {
                                                triggerFireworks();
                                                setActiveAchievement(achievement);
                                                setActivePhotoIndex(0);
                                            }
                                        }}
                                    >
                                        <div className={clsx(
                                            "w-9 h-9 md:w-14 md:h-14 rounded-full bg-music-dark border-2 flex items-center justify-center shadow-lg hover:scale-110 transition-transform",
                                            achievement.borderColor
                                        )}>
                                            <Icon className={clsx("text-sm md:text-xl", achievement.color)} />
                                        </div>

                                        <motion.div
                                            className="absolute inset-0 rounded-full border border-music-red/40"
                                            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>

                                    <div className="hidden md:block md:w-5/12" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </SectionFocusWrapper>

            <AnimatePresence>
                {activeAchievement && (
                    <motion.div
                        className="fixed inset-0 z-[200] flex items-center justify-center sm:p-6 bg-black/95 backdrop-blur-xl pointer-events-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveAchievement(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="relative max-w-5xl w-full h-[100dvh] md:h-auto md:max-h-[85vh] bg-[#05080f] md:border border-white/10 rounded-none md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(0,0,0,0.7)] pointer-events-auto"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <button 
                                onClick={() => setActiveAchievement(null)}
                                className="absolute top-4 right-4 z-[250] p-2.5 md:p-2 rounded-full md:rounded-xl bg-slate-800 md:bg-white/5 hover:bg-rose-600 border border-slate-700 md:border-white/5 text-white transition-all active:scale-95 cursor-pointer shadow-xl"
                                title="Đóng cửa sổ"
                            >
                                <FaTimes className="w-5 h-5 sm:w-4 sm:h-4" />
                            </button>
                            <div className="relative w-full h-[40dvh] md:h-full md:flex-1 bg-black/95 flex items-center justify-center group/gallery overflow-hidden select-none border-b md:border-b-0 md:border-r border-white/10 shrink-0">
                                
                                {(() => {
                                    const album = [
                                        ...(activeAchievement.image ? [activeAchievement.image] : []),
                                        ...(activeAchievement.images || [])
                                    ].filter(Boolean);
                                    
                                    if (album.length === 0) return (
                                        <div className="text-music-cream/40 italic text-sm">Chưa có hình ảnh bổ trợ</div>
                                    );

                                    const curImg = album[activePhotoIndex % album.length] || album[0];
                                    const hasMainImage = !!activeAchievement.image;
                                    const currentDesc = hasMainImage 
                                        ? (activePhotoIndex === 0 ? '' : (activeAchievement.imageDescriptions?.[activePhotoIndex - 1] || ''))
                                        : (activeAchievement.imageDescriptions?.[activePhotoIndex] || '');

                                    return (
                                        <>
                                            <motion.img 
                                                key={curImg}
                                                src={curImg} 
                                                alt={activeAchievement.title}
                                                className={clsx(
                                                    "max-w-full max-h-[35dvh] md:max-h-[75vh] w-auto h-auto object-contain p-4 md:p-8 drop-shadow-2xl select-none touch-none",
                                                    album.length > 1 ? "cursor-grab active:cursor-grabbing" : ""
                                                )}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                                drag={album.length > 1 ? "x" : false}
                                                dragConstraints={{ left: 0, right: 0 }}
                                                dragElastic={0.8}
                                                onDragEnd={(_e, info) => {
                                                    const swipeThreshold = 50;
                                                    if (info.offset.x < -swipeThreshold) {
                                                        setActivePhotoIndex((p) => (p + 1) % album.length);
                                                    } else if (info.offset.x > swipeThreshold) {
                                                        setActivePhotoIndex((p) => (p - 1 + album.length) % album.length);
                                                    }
                                                }}
                                            />

                                            {currentDesc && (
                                                <div className="absolute bottom-6 md:bottom-12 left-0 w-full px-4 flex justify-center pointer-events-none z-30">
                                                    <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-center max-w-[90%] shadow-2xl">
                                                        <p className="text-sm md:text-base text-music-cream font-medium shadow-black drop-shadow-md">
                                                            {currentDesc}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {album.length > 1 && (
                                                <>
                                                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/10 text-music-cream px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase font-tech opacity-0 group-hover/gallery:opacity-100 group-hover/gallery:top-5 transition-all duration-300 pointer-events-none z-25 whitespace-nowrap hidden sm:flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                                                        <span className="animate-bounce">💡</span>
                                                        <span><AutoTranslate text="Swipe or use arrows to browse photos" /></span>
                                                    </div>
                                                    <button 
                                                        onClick={() => setActivePhotoIndex((p) => (p - 1 + album.length) % album.length)}
                                                        className="absolute left-2 md:left-3 p-2 md:p-3 rounded-full bg-black/60 border border-white/5 hover:bg-music-red/90 text-white md:opacity-0 md:group-hover/gallery:opacity-100 transition-all active:scale-90 cursor-pointer z-20"
                                                    >
                                                        <FaChevronLeft className="text-xs sm:text-sm" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setActivePhotoIndex((p) => (p + 1) % album.length)}
                                                        className="absolute right-2 md:right-3 p-2 md:p-3 rounded-full bg-black/60 border border-white/5 hover:bg-music-red/90 text-white md:opacity-0 md:group-hover/gallery:opacity-100 transition-all active:scale-90 cursor-pointer z-20"
                                                    >
                                                        <FaChevronRight className="text-xs sm:text-sm" />
                                                    </button>

                                                    <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
                                                        {album.map((_, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setActivePhotoIndex(idx)}
                                                                className={clsx(
                                                                    "h-1 sm:h-1.5 rounded-full transition-all cursor-pointer",
                                                                    (activePhotoIndex % album.length) === idx ? "w-4 sm:w-6 bg-music-red" : "w-1.5 bg-white/30 hover:bg-white/60"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )
                                })()}
                            </div>

                            <div className="w-full md:w-[420px] bg-[#0a0e17] p-6 md:p-8 flex flex-col shrink-0 flex-1 md:flex-none overflow-y-auto custom-main-scrollbar">
                                <div className="space-y-4">
                                    <span className={clsx("inline-block text-[10px] font-mono tracking-widest uppercase py-1.5 px-3 border rounded-lg bg-white/5", activeAchievement.color, activeAchievement.borderColor)}>
                                        {activeAchievement.period}
                                    </span>

                                    <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight font-sans border-b border-white/10 pb-4">
                                        <AutoTranslate text={activeAchievement.title} />
                                    </h3>

                                    <p className="text-sm text-slate-300 leading-relaxed font-sans pb-2">
                                        <AutoTranslate text={activeAchievement.description} />
                                    </p>
                                </div>

                                {(() => {
                                    const allArticles = [
                                        ...(activeAchievement.articleUrl ? [{ url: activeAchievement.articleUrl, description: activeAchievement.articleDescription || '' }] : []),
                                        ...(activeAchievement.articles || [])
                                    ];

                                    if (allArticles.length === 0) return null;

                                    return (
                                        <div className="mt-6 flex flex-col gap-4">
                                            {allArticles.map((art, idx) => (
                                                <motion.a
                                                    key={idx}
                                                    href={art.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex flex-col w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden group/link cursor-pointer transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] shrink-0"
                                                >
                                                    <div className="w-full h-24 md:h-28 relative bg-slate-950 flex items-center justify-center overflow-hidden select-none border-b border-slate-800">
                                                        {/* Abstract background gradient */}
                                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-950 opacity-80 group-hover/link:opacity-100 transition-opacity"></div>
                                                        <div className="absolute inset-0 opacity-20 group-hover/link:opacity-40 transition-opacity duration-500" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                                                        
                                                        {/* Link Icon */}
                                                        <div className="relative z-0 flex items-center justify-center w-full h-full">
                                                            <FaExternalLinkAlt className="w-8 h-8 text-slate-700/80 group-hover/link:text-cyan-500/60 group-hover/link:scale-110 transition-all duration-500" />
                                                        </div>

                                                        <div className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center p-1 shadow-lg z-10">
                                                            <img 
                                                                src={`https://www.google.com/s2/favicons?sz=64&domain=${(() => {
                                                                    try { return new URL(art.url || '').hostname; }
                                                                    catch { return 'google.com'; }
                                                                })()}`} 
                                                                alt="web-brand"
                                                                className="w-full h-full rounded-full bg-white object-contain"
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="p-3.5 flex flex-col justify-center text-left bg-slate-900">
                                                        <div className="text-[13px] md:text-sm font-bold text-slate-200 group-hover/link:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-1">
                                                            <AutoTranslate text={art.description || "Đọc bài viết báo chí / Tài liệu chi tiết"} />
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-500 truncate">
                                                            <FaExternalLinkAlt className="w-2 h-2" />
                                                            <span>{(() => {
                                                                try {
                                                                    return new URL(art.url || '').hostname.replace('www.', '');
                                                                } catch {
                                                                    return 'Liên kết bên ngoài';
                                                                }
                                                            })()}</span>
                                                        </div>
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Achievements
