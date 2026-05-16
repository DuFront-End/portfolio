// src/components/layout/Footer.tsx
import { FaHeart, FaCode, FaMusic, FaArrowUp, FaRecordVinyl } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import AutoTranslate from '../common/AutoTranslate'

const Footer = () => {
    const { t } = useTranslation()
    const currentYear = new Date().getFullYear()

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const trackList = [
        { number: '01', title: t('nav.home') },
        { number: '02', title: t('nav.about') },
        { number: '03', title: t('nav.skills') },
        { number: '04', title: t('nav.projects') },
        { number: '05', title: t('nav.achievements') },
        { number: '06', title: t('nav.contact') },
    ]

    return (
        <footer className="border-t border-music-purple/30 bg-music-blue/50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                    {trackList.map((track) => (
                        <div key={track.number} className="flex items-center space-x-2 text-music-cream/60 hover:text-music-cream transition-colors cursor-default">
                            <span className="text-xs text-music-red font-tech">{track.number}</span>
                            <span className="text-sm"><AutoTranslate text={track.title} /></span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-music-cream/70">
                            © {currentYear} Nguyễn Khánh Du. <AutoTranslate text={t('footer.rights')} />
                        </p>
                        <p className="text-sm text-music-cream/50 mt-1 flex items-center gap-2">
                            <FaRecordVinyl className="animate-spin" />
                            <AutoTranslate text="Music Tech Portfolio" />
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={scrollToTop}
                            className="flex items-center space-x-2 text-music-cream/70 hover:text-music-cream transition-colors"
                        >
                            <FaArrowUp />
                            <span><AutoTranslate text={t('footer.back_to_top')} /></span>
                        </button>

                        <div className="flex items-center space-x-2 text-music-cream/50">
                            <FaCode className="text-music-red" />
                            <span><AutoTranslate text={t('footer.built_with')} /></span>
                            <FaHeart className="text-music-red animate-pulse" />
                            <FaMusic className="text-music-gold" />
                            <span><AutoTranslate text={t('footer.using')} /></span>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6 pt-4 border-t border-music-purple/30">
                    <p className="text-sm text-music-cream/50 flex items-center justify-center gap-2">
                        <FaMusic className="text-music-red" />
                        <AutoTranslate text={t('footer.audio_credit')} />
                        <span className="text-music-gold">
                            <AutoTranslate text="Music Symphony in Code" />
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
