// src/components/sections/About.tsx
import { motion } from 'framer-motion'
import { FaMusic } from 'react-icons/fa'
import { GiCompactDisc } from 'react-icons/gi'
import { useTranslation } from 'react-i18next'
import { useProfile } from '../../hooks/useProfile'
import AutoTranslate from '../common/AutoTranslate'
import { getIcon } from '../../utils/iconMap'
import SectionFocusWrapper from '../common/SectionFocusWrapper'

const ROTATE_DURATION = 20

const About = ({ activeSection }: { activeSection?: string }) => {
    const { t } = useTranslation()
    const { profile } = useProfile()
    const isActive = activeSection === 'about'

    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
    const avatarUrl = profile?.avatar 
        ? (profile.avatar.startsWith('http') 
            ? profile.avatar 
            : `${apiUrl}${profile.avatar.startsWith('/') ? '' : '/'}${profile.avatar}`)
        : '/Du.jpg';

    return (
        <section id="about" className="section-container relative">
            <SectionFocusWrapper isActive={isActive}>
                <h2 className="section-title">
                    <span className="relative">
                        <AutoTranslate text={t('about.title')} />
                        <FaMusic className="absolute -top-2 -right-8 text-music-red music-note" />
                    </span>
                </h2>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative w-96 h-96 mx-auto lg:mx-0">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: ROTATE_DURATION,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                className="absolute inset-0 rounded-full vinyl-effect border-4 border-music-purple/50 flex items-center justify-center"
                            >
                                <GiCompactDisc className="w-full h-full p-2 text-music-dark/20" />
                            </motion.div>

                            <div className="absolute inset-10 rounded-full music-card flex items-center justify-center z-10">
                                <div className="text-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: ROTATE_DURATION,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                        className="relative w-44 h-44 rounded-full overflow-hidden bg-music-dark border-4 border-music-red/30 mx-auto mb-2"
                                    >
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            className="w-full h-full object-cover object-top"
                                            loading="lazy"
                                        />

                                        <div className="absolute inset-0 flex items-end justify-center bg-black/30">
                                            <span className="text-[10px] font-bold text-music-cream tracking-widest mb-1">
                                                {profile?.firstName ? profile.firstName.split(' ').map(w => w[0]).join('') : 'NKD'}
                                            </span>
                                        </div>
                                    </motion.div>

                                    <p className="text-[10px] text-music-gold font-tech uppercase tracking-widest">
                                        {profile?.role ? <AutoTranslate text={profile.role} /> : <AutoTranslate text={t('hero.role')} />}
                                    </p>
                                </div>
                            </div>

                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute z-20"
                                    style={{
                                        left: `${Math.cos((i * Math.PI) / 2) * 185 + 185}px`,
                                        top: `${Math.sin((i * Math.PI) / 2) * 185 + 185}px`,
                                    }}
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        rotate: {
                                            duration: 10,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        },
                                        scale: {
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.5,
                                        },
                                    }}
                                >
                                    <FaMusic className="text-music-red/50" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-8"
                    >
                        <div className="music-card p-8">
                            <p className="text-lg text-music-cream/80 leading-relaxed mb-6">
                                {profile?.aboutDescription ? <AutoTranslate text={profile.aboutDescription} /> : <AutoTranslate text={t('about.description')} />}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {(profile?.aboutStats || [
                                    { label: 'Điểm GPA', value: '3.65/4.0', icon: 'FaGraduationCap' },
                                    { label: 'Trạng thái', value: 'Sinh viên Xuất sắc', icon: 'FaAward' }
                                ]).map((stat, index) => {
                                    const Icon = getIcon(stat.icon)
                                    return (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.02 }}
                                            className={`p-4 rounded-xl border ${index % 2 === 0 ? 'bg-music-purple/30 border-music-purple/50' : 'bg-music-red/10 border-music-red/30'}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon
                                                    className={index % 2 === 0 ? 'text-music-gold' : 'text-music-red'}
                                                    size={20}
                                                />
                                                <div>
                                                    <p className="text-sm text-music-cream/60">
                                                        <AutoTranslate text={stat.label} />
                                                    </p>
                                                    <p className="text-xl font-bold text-music-cream">
                                                        <AutoTranslate text={stat.value} />
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </SectionFocusWrapper>
        </section>
    )
}

export default About
