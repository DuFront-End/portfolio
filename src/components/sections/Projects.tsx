// src/components/sections/Projects.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaMusic, FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { getIcon } from '../../utils/iconMap'
import AutoTranslate from '../common/AutoTranslate'
import { useSmartPolling } from '../../hooks/useSmartPolling'
import SectionFocusWrapper from '../common/SectionFocusWrapper'

interface ProjectAPI {
    _id: string
    title: string
    role: string
    description: string
    tech: { name: string; icon: string; color: string }[]
    stats: { label: string; value: string }[]
    links: { github: string; demo: string }
    albumColor: string
    order: number
}

const Projects = ({ activeSection }: { activeSection?: string }) => {
    const { t } = useTranslation()
    const [projects, setProjects] = useState<ProjectAPI[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const isActive = activeSection === 'projects'

    useSmartPolling(async () => {
        try {
            const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
            const res = await fetch(`${apiUrl}/api/projects`);
            if (res.status === 429) return res;

            const data = await res.json();
            if (data.success) {
                setProjects(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data.data)) {
                        return data.data;
                    }
                    return prev;
                });
            }
        } catch (error) {
            throw error;
        }
    }, 20000);

    const nextProject = () => {
        if (currentIndex + 2 < projects.length) {
            setCurrentIndex(currentIndex + 2);
        }
    };

    const prevProject = () => {
        if (currentIndex - 2 >= 0) {
            setCurrentIndex(currentIndex - 2);
        }
    };

    const visibleProjects = projects.slice(currentIndex, currentIndex + 2);
    const hasMultiplePages = projects.length > 2;

    return (
        <section id="projects" className="section-container relative">
            <SectionFocusWrapper isActive={isActive}>
                <div className="relative flex items-center justify-center mb-12">
                    <h2 className="section-title !mb-0">
                        <span className="flex items-center justify-center gap-4">
                            <AutoTranslate text={t('projects.title')} />
                            <FaMusic className="text-music-gold music-note" />
                        </span>
                    </h2>
                    
                    {/* Navigation Arrows for Desktop (Absolutely positioned to the right) */}
                    {hasMultiplePages && (
                        <div className="absolute right-0 hidden lg:flex items-center gap-3">
                            <button 
                                onClick={prevProject}
                                disabled={currentIndex === 0}
                                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-music-gold hover:bg-music-gold hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                            >
                                <FaChevronLeft size={14} className="group-active:scale-90 transition-transform" />
                            </button>
                            <button 
                                onClick={nextProject}
                                disabled={currentIndex + 2 >= projects.length}
                                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-music-gold hover:bg-music-gold hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                            >
                                <FaChevronRight size={14} className="group-active:scale-90 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="grid lg:grid-cols-2 gap-8"
                        >
                            {visibleProjects.map((project, index) => (
                                <motion.div
                                    key={project._id}
                                    whileHover={{ y: -5 }}
                                    className="group"
                                >
                                    <div className={`music-card p-6 sm:p-8 h-full relative overflow-hidden ${project.albumColor} bg-gradient-to-br`}>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <button className="w-16 h-16 rounded-full bg-music-red/80 flex items-center justify-center">
                                                <FaPlay className="text-white text-xl" />
                                            </button>
                                        </div>

                                        <div className="absolute top-4 right-4 opacity-10">
                                            <div className="vinyl-effect w-20 h-20" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <h3 className="text-xl sm:text-2xl font-bold text-music-cream mb-2">
                                                        <AutoTranslate text={project.title} />
                                                    </h3>
                                                    <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-music-dark/50 border border-music-purple/50">
                                                        <FaMusic className="text-music-red text-xs" />
                                                        <span className="text-[10px] sm:text-sm text-music-cream/80 font-medium">
                                                            <AutoTranslate text={project.role} />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-music-dark border border-music-gold/50 flex items-center justify-center shrink-0">
                                                    <span className="text-music-gold font-bold text-sm sm:text-base">0{currentIndex + index + 1}</span>
                                                </div>
                                            </div>

                                            <p className="text-sm sm:text-base text-music-cream/70 mb-8 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                                                <AutoTranslate text={project.description} />
                                            </p>

                                            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
                                                {project.stats.map((stat) => (
                                                    <div
                                                        key={stat.label}
                                                        className="text-center p-2 sm:p-3 rounded-lg bg-music-dark/30 border border-music-purple/30"
                                                    >
                                                        <p className="text-sm sm:text-xl font-bold text-music-gold">{stat.value}</p>
                                                        <p className="text-[9px] sm:text-xs text-music-cream/50 mt-1">
                                                            <AutoTranslate text={stat.label} />
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mb-8">
                                                <h4 className="text-sm sm:text-lg font-semibold text-music-cream mb-4"><AutoTranslate text={t('projects.tech_stack')} /></h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tech.map((tech) => {
                                                        const Icon = getIcon(tech.icon)
                                                        return (
                                                            <div
                                                                key={tech.name}
                                                                className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 rounded-lg bg-music-dark/50 border border-music-purple/30"
                                                            >
                                                                <Icon className={tech.color} size={12} />
                                                                <span className="text-[10px] sm:text-sm text-music-cream">
                                                                    <AutoTranslate text={tech.name} />
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <motion.a
                                                    href={project.links.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 btn-tech flex items-center justify-center space-x-2 py-3"
                                                >
                                                    <FaGithub />
                                                    <span className="text-xs sm:text-sm"><AutoTranslate text={t('projects.view_code')} /></span>
                                                </motion.a>
                                                <motion.a
                                                    href={project.links.demo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                                                >
                                                    <FaExternalLinkAlt />
                                                    <span className="text-xs sm:text-sm"><AutoTranslate text={t('projects.view_demo')} /></span>
                                                </motion.a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows for Mobile (Bottom centered) */}
                {hasMultiplePages && (
                    <div className="flex lg:hidden items-center justify-center gap-6 mt-8">
                        <button 
                            onClick={prevProject}
                            disabled={currentIndex === 0}
                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-music-gold disabled:opacity-20 transition-all active:scale-90"
                        >
                            <FaChevronLeft size={20} />
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: Math.ceil(projects.length / 2) }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-2 h-2 rounded-full transition-all ${Math.floor(currentIndex / 2) === i ? 'bg-music-gold w-6' : 'bg-white/20'}`} 
                                />
                            ))}
                        </div>
                        <button 
                            onClick={nextProject}
                            disabled={currentIndex + 2 >= projects.length}
                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-music-gold disabled:opacity-20 transition-all active:scale-90"
                        >
                            <FaChevronRight size={20} />
                        </button>
                    </div>
                )}
            </SectionFocusWrapper>
        </section>
    )
}

export default Projects
