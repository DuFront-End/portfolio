// src/components/layout/Header.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaBars, FaTimes, FaMusic } from 'react-icons/fa'
import { GiCompactDisc } from 'react-icons/gi'
import clsx from 'clsx'
import LanguageSwitcher from './LanguageSwitcher'
import AutoTranslate from '../common/AutoTranslate'

interface HeaderProps {
    activeSection: string
}

const Header = ({ activeSection }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
        setIsMenuOpen(false);
    };

    const navItems = ['home', 'about', 'skills', 'projects', 'achievements', 'contact']

    const sectionTranslations: Record<string, string> = {
        home: t('nav.home'),
        about: t('nav.about'),
        skills: t('nav.skills'),
        projects: t('nav.projects'),
        achievements: t('nav.achievements'),
        contact: t('nav.contact')
    }

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={clsx(
                "fixed top-0 w-full z-[100] transition-all duration-500",
                scrolled
                    ? "music-nav py-3 shadow-lg bg-music-dark/95 backdrop-blur-md"
                    : "bg-transparent py-5"
            )}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="group relative flex items-center space-x-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="relative"
                        >
                            <div className="w-10 h-10 rounded-full music-card flex items-center justify-center vinyl-effect overflow-hidden">
                                <GiCompactDisc className="text-music-red text-2xl" />
                            </div>
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-xl font-heading font-bold text-music-cream uppercase">NKD<span className="text-music-red">.</span></span>
                            <span className="text-[9px] text-music-gold font-tech tracking-[0.2em]">
                                <AutoTranslate text="MUSIC TECH" />
                            </span>
                        </div>
                    </a>

                    <nav className="hidden md:flex items-center space-x-1">
                        <div className="flex items-center music-card px-2 py-1 bg-music-dark/40 backdrop-blur-md border border-music-purple/20 rounded-xl">
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    href={`#${item}`}
                                    onClick={(e) => scrollToSection(e, item)}
                                    className={clsx(
                                        "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                                        activeSection === item ? "text-music-cream bg-music-purple/50 shadow-inner" : "text-music-cream/70 hover:text-music-cream"
                                    )}
                                >
                                    <span className="capitalize"><AutoTranslate text={sectionTranslations[item]} /></span>
                                </a>
                            ))}
                        </div>
                    </nav>

                    <div className="flex items-center space-x-3">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg music-card border border-music-purple/30 z-[110]"
                        >
                            {isMenuOpen ? <FaTimes className="text-music-red" size={20} /> : <FaBars className="text-music-cream" size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-0 left-0 w-full h-screen bg-music-dark/98 backdrop-blur-2xl z-[105] flex flex-col pt-24 px-6"
                    >
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item, idx) => (
                                <motion.a
                                    key={item}
                                    href={`#${item}`}
                                    onClick={(e) => scrollToSection(e, item)}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={clsx(
                                        "px-6 py-5 rounded-2xl text-xl font-medium flex items-center justify-between transition-all active:bg-music-purple/40",
                                        activeSection === item ? 'bg-music-purple/30 text-music-cream border-l-4 border-music-red' : 'text-music-cream/60 border border-white/5'
                                    )}
                                >
                                    <span className="capitalize"><AutoTranslate text={sectionTranslations[item]} /></span>
                                    {activeSection === item && <FaMusic className="text-music-red animate-pulse" />}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}

export default Header
