// src/components/sections/Hero.tsx
import { motion } from 'framer-motion'
import {
    FaGithub,
    FaLinkedin,
    FaDownload,
    FaArrowDown,
    FaMusic,
    FaFileExcel,
} from 'react-icons/fa'
import { GiCompactDisc } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'
import AutoTranslate from '../common/AutoTranslate'
import { useProfile } from '../../hooks/useProfile'

const Hero = () => {
    const { t } = useTranslation()
    const { profile } = useProfile()

    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border-2 border-music-red/10"
                        style={{
                            width: `${300 + i * 200}px`,
                            height: `${300 + i * 200}px`,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{
                            rotate: {
                                duration: 25 + i * 5,
                                repeat: Infinity,
                                ease: 'linear',
                            },
                            scale: { duration: 4 + i, repeat: Infinity },
                        }}
                    />
                ))}

                <motion.div 
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ 
                        opacity: 0.1, 
                        x: 0,
                        y: ["-50%", "-53%", "-50%"],
                        rotate: [-8, -4, -8]
                    }}
                    transition={{
                        opacity: { duration: 1.5 },
                        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute left-[0rem] top-1/2 text-[30rem] text-music-gold pointer-events-none select-none drop-shadow-[0_0_40px_rgba(255,215,0,0.15)] z-0"
                >
                    𝄞
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ 
                        opacity: 0.05, 
                        x: 0,
                        y: [0, 20, 0],
                        rotate: [12, 15, 12]
                    }}
                    transition={{
                        opacity: { duration: 1.5 },
                        y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute -right-20 bottom-1/4 text-[18rem] text-music-cream pointer-events-none select-none"
                >
                    🎶
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 z-[40]"
            >
                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center gap-6"
                >
                    <div className="flex flex-col items-center space-y-8 relative">
                        <motion.a
                            href="https://github.com/DuFront-End"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.15, y: -8, rotate: 5 }}
                            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-music-blue/60 backdrop-blur-xl border border-music-gold/30 hover:border-music-gold hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-500"
                        >
                            <div className="absolute inset-0 rounded-full border-2 border-music-gold opacity-0 group-hover:animate-ping-slow pointer-events-none" />
                            <div className="absolute inset-0 rounded-full bg-music-gold/10 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                            
                            <FaGithub className="text-2xl text-music-gold group-hover:text-white transition-colors relative z-10" />
                            <span className="absolute left-full ml-6 px-3 py-1 bg-music-gold text-music-dark text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap uppercase tracking-[0.2em] shadow-xl">GitHub</span>
                        </motion.a>

                        <motion.a
                            href="https://www.linkedin.com/in/du-nguy%E1%BB%85n-881916180"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.15, y: -8, rotate: -5 }}
                            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-music-blue/60 backdrop-blur-xl border border-music-gold/30 hover:border-music-gold hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-500"
                        >
                            <div className="absolute inset-0 rounded-full border-2 border-music-gold opacity-0 group-hover:animate-ping-slow pointer-events-none" />
                            <div className="absolute inset-0 rounded-full bg-music-gold/10 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />

                            <FaLinkedin className="text-2xl text-music-gold group-hover:text-white transition-colors relative z-10" />
                            <span className="absolute left-full ml-6 px-3 py-1 bg-music-gold text-music-dark text-[11px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap uppercase tracking-[0.2em] shadow-xl">LinkedIn</span>
                        </motion.a>
                    </div>

                    <span className="[writing-mode:vertical-lr] rotate-180 text-[12px] font-tech tracking-[0.6em] text-music-gold/80 font-bold uppercase select-none drop-shadow-[0_0_12px_rgba(255,215,0,0.4)]">
                        <AutoTranslate text="Social Connect" />
                    </span>

                    <div className="w-[1.5px] h-32 overflow-hidden relative shadow-[0_0_8px_rgba(255,215,0,0.2)]">
                        <div className="w-full h-full bg-music-gold/10" />
                        <motion.div 
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-music-gold to-transparent"
                        />
                    </div>
                </motion.div>
            </motion.div>

            <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 z-[40]">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-[1.5px] h-32 overflow-hidden relative shadow-[0_0_8px_rgba(255,215,0,0.2)]">
                            <div className="w-full h-full bg-music-gold/10" />
                            <motion.div 
                                animate={{ y: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-music-gold to-transparent"
                            />
                        </div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="text-music-gold/80 text-xl"
                        >
                            <FaArrowDown />
                        </motion.div>
                    </div>

                    <span className="[writing-mode:vertical-lr] text-[12px] font-tech tracking-[0.6em] text-music-gold/80 font-bold uppercase select-none drop-shadow-[0_0_12px_rgba(255,215,0,0.4)]">
                        <AutoTranslate text="Scroll Down" />
                    </span>
                </div>
            </div>

            <div className="section-container text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        className="flex justify-center items-center mb-8 space-x-4"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <FaMusic className="text-music-red text-2xl" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <GiCompactDisc className="text-music-gold text-4xl" />
                        </motion.div>
                        <FaMusic className="text-tech-cyan text-2xl" />
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-music font-bold mb-6 text-music-cream leading-tight"
                    >
                        <span className="inline-block"><AutoTranslate text={profile?.lastName || 'NGUYỄN'} /></span>
                        <br />
                        <span className="text-music-gold inline-block">
                            <AutoTranslate text={profile?.firstName || 'KHÁNH DU'} />
                        </span>
                    </motion.h1>

                    <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full music-card mb-8 border border-music-purple/30">
                        <div className="w-2 h-2 rounded-full bg-music-red animate-pulse" />
                        <span className="text-xl font-tech text-music-cream">
                            {profile?.role ? <AutoTranslate text={profile.role} /> : t('hero.role')}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-tech-cyan animate-pulse" />
                    </div>

                    <p className="text-lg text-music-cream/80 mb-12 max-w-2xl mx-auto">
                        {profile?.tagline ? <AutoTranslate text={profile.tagline} /> : t('hero.tagline')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                        <motion.a
                            href="#projects"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary flex items-center space-x-2 min-w-[200px] justify-center"
                        >
                            <span><AutoTranslate text={t('hero.cta_project')} /></span>
                            <FaArrowDown className="animate-bounce" />
                        </motion.a>

                        <motion.a
                            href={profile?.cvUrl?.startsWith('http') 
                                ? profile.cvUrl 
                                : profile?.cvUrl 
                                    ? profile.cvUrl 
                                    : "/cv.pdf"
                            }
                            download={profile?.cvUrl?.startsWith('http') ? undefined : "Nguyen-Khanh-Du-CV.pdf"}
                            target={profile?.cvUrl?.startsWith('http') ? "_blank" : undefined}
                            whileHover={{
                                scale: 1.05,
                                boxShadow:
                                    '0 0 25px rgba(212, 175, 55, 0.4)',
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center space-x-2 min-w-[200px] justify-center border border-music-gold/50"
                        >
                            <FaDownload />
                            <span><AutoTranslate text={t('hero.cta_cv')} /></span>
                        </motion.a>

                        <motion.a
                            href="/Bảng điểm  FPT Polytechnic.xlsx"
                            download="Nguyen-Khanh-Du-Bang-Diem.xlsx"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center space-x-2 min-w-[200px] justify-center border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 transition-all bg-emerald-950/10 hover:border-emerald-400/60"
                        >
                            <FaFileExcel className="animate-pulse" />
                            <span><AutoTranslate text={t('hero.cta_transcript')} /></span>
                        </motion.a>
                    </div>

                    <div className="flex lg:hidden items-center justify-center space-x-8">
                        <a
                            href="https://github.com/DuFront-End"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub className="text-2xl text-music-cream hover:scale-125 transition" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/du-nguy%E1%BB%85n-881916180"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaLinkedin className="text-2xl text-music-cream hover:scale-125 transition" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero
