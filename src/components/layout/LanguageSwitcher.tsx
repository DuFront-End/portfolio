// src/components/layout/LanguageSwitcher.tsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaGlobe, FaCheck, FaChevronDown } from 'react-icons/fa'
import { changeLanguage, fetchAvailableLanguages, type LanguageInfo } from '../../i18n'
import AutoTranslate from '../common/AutoTranslate'

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [languages, setLanguages] = useState<LanguageInfo[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isChanging, setIsChanging] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadLanguages = async () => {
            setIsLoading(true)
            const langs = await fetchAvailableLanguages()
            setLanguages(langs)
            setIsLoading(false)
        }
        loadLanguages()
    }, [])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    const currentLang = languages.find(l => l.lang === i18n.language)

    const handleLanguageChange = async (lang: string) => {
        if (lang === i18n.language) {
            setIsOpen(false)
            return
        }

        setIsChanging(true)
        await changeLanguage(lang)
        localStorage.setItem('i18nextLng_userSelected', 'true')
        setIsChanging(false)
        setIsOpen(false)
    }

    return (
        <div ref={dropdownRef} className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl music-card
                    border border-music-purple/30 hover:border-music-gold/40
                    text-music-cream transition-all duration-300 group
                    backdrop-blur-md relative overflow-hidden"
                aria-label="Change Language"
                aria-expanded={isOpen}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-music-gold/0 via-music-gold/5 to-music-gold/0 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <motion.div
                    animate={isOpen ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaGlobe className="text-music-gold text-sm" />
                </motion.div>

                <div className="flex items-center gap-1.5 relative z-10">
                    {currentLang ? (
                        <>
                            <span className="text-base leading-none">{currentLang.flag}</span>
                            <span className="text-xs font-bold font-tech uppercase tracking-wider hidden sm:inline">
                                {currentLang.lang}
                            </span>
                        </>
                    ) : (
                        <span className="text-xs font-tech uppercase tracking-wider">
                            {i18n.language.toUpperCase()}
                        </span>
                    )}
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaChevronDown className="text-[8px] text-music-cream/50" />
                </motion.div>

                {isChanging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-music-dark/80 backdrop-blur-sm rounded-xl z-20">
                        <div className="w-4 h-4 border-2 border-music-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 min-w-[220px] z-[200]
                            bg-music-dark/95 backdrop-blur-2xl border border-music-purple/30
                            rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
                    >
                        <div className="px-4 py-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <FaGlobe className="text-music-gold text-xs" />
                                <span className="text-[10px] font-tech uppercase tracking-[0.25em] text-music-cream/40">
                                    <AutoTranslate text={t('language.switch_title', 'Select Language')} />
                                </span>
                            </div>
                        </div>

                        <div className="py-1.5">
                            {isLoading ? (
                                <div className="px-4 py-3 space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3 animate-pulse">
                                            <div className="w-8 h-6 bg-white/10 rounded" />
                                            <div className="flex-1 h-4 bg-white/10 rounded" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                languages.map((lang, idx) => {
                                    const isActive = i18n.language === lang.lang

                                    return (
                                        <motion.button
                                            key={lang.lang}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => handleLanguageChange(lang.lang)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group/item
                                                ${isActive
                                                    ? 'bg-music-gold/10 border-l-2 border-music-gold'
                                                    : 'hover:bg-white/5 border-l-2 border-transparent hover:border-music-purple/50'
                                                }`}
                                        >
                                            <span className="text-xl leading-none w-8 text-center transition-transform duration-200 group-hover/item:scale-110">
                                                {lang.flag}
                                            </span>

                                            <div className="flex-1 text-left">
                                                <p className={`text-sm font-medium transition-colors ${isActive ? 'text-music-gold' : 'text-music-cream group-hover/item:text-music-cream'
                                                    }`}>
                                                    {lang.nativeName}
                                                </p>
                                                <p className="text-[10px] text-music-cream/40 font-tech uppercase tracking-wider">
                                                    {lang.label} • {lang.lang.toUpperCase()}
                                                </p>
                                            </div>

                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex items-center gap-1"
                                                >
                                                    <span className="text-[8px] text-music-gold/60 font-tech uppercase">
                                                        <AutoTranslate text={t('language.current', 'Current')} />
                                                    </span>
                                                    <div className="w-5 h-5 rounded-full bg-music-gold/20 flex items-center justify-center">
                                                        <FaCheck className="text-music-gold text-[8px]" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    )
                                })
                            )}
                        </div>

                        <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[9px] text-music-cream/30 font-tech uppercase tracking-wider">
                                    <AutoTranslate text={t('language.auto_detect', 'Auto Detect')} />: {navigator.language}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LanguageSwitcher
