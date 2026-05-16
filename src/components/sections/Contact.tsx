// src/components/sections/Contact.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FaPhone, FaEnvelope, FaMapMarkerAlt,
    FaCheck, FaPaperPlane, FaGithub,
    FaLinkedin, FaMusic
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import AutoTranslate from '../common/AutoTranslate'
import { useProfile } from '../../hooks/useProfile'
import SectionFocusWrapper from '../common/SectionFocusWrapper'

const Contact = ({ activeSection }: { activeSection?: string }) => {
    const isActive = activeSection === 'contact'
    const { t } = useTranslation()
    const { profile } = useProfile()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                })
            });
            const result = await response.json();

            if (result.success) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                throw new Error(result.message || "Lỗi gửi email từ Web3Forms");
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert(t('contact.error_message'));
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const contactInfo = [
        {
            icon: FaPhone,
            title: t('contact.phone'),
            value: profile?.contact?.phone || '+84 397 311 449',
            href: `tel:${(profile?.contact?.phone || '+84 397 311 449').replace(/\s/g, '')}`,
        },
        {
            icon: FaEnvelope,
            title: t('contact.email'),
            value: profile?.contact?.email || 'khanhdungnguyen123456@gmail.com',
            fullValue: profile?.contact?.email || 'khanhdungnguyen123456@gmail.com',
            href: `mailto:${profile?.contact?.email || 'khanhdungnguyen123456@gmail.com'}`,
        },
        {
            icon: FaMapMarkerAlt,
            title: t('contact.location'),
            value: profile?.contact?.location || 'Quận 12, TP. Hồ Chí Minh',
            href: `https://maps.google.com/?q=${profile?.contact?.location || 'Quận 12, TP. Hồ Chí Minh'}`,
            target: '_blank'
        },
    ]

    const socialLinks = [
        { icon: FaGithub, href: profile?.contact?.github || 'https://github.com/DuFront-End', label: 'GitHub' },
        { icon: FaLinkedin, href: profile?.contact?.linkedin || 'https://www.linkedin.com/in/du-nguy%E1%BB%85n-881916180', label: 'LinkedIn' },
    ]

    return (
        <section id="contact" className="section-container px-4 relative">
            <SectionFocusWrapper isActive={isActive}>
                <h2 className="section-title">
                    <span className="flex items-center justify-center gap-3 uppercase tracking-widest text-xl md:text-3xl">
                        <AutoTranslate text={t('contact.title')} />
                        <FaMusic className="text-music-red text-lg" />
                    </span>
                </h2>

                <div className="max-w-6xl mx-auto mt-10">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="order-2 lg:order-1"
                        >
                            <div className="music-card p-6 md:p-8">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="vinyl-effect w-10 h-10 md:w-12 md:h-12 shrink-0" />
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-music-gold uppercase">
                                            <AutoTranslate text={t('contact.get_in_touch')} />
                                        </h3>
                                        <p className="text-[10px] font-tech text-white/40 uppercase">Track 06: Contact</p>
                                    </div>
                                </div>

                                <p className="text-white/70 mb-8 text-sm md:text-base leading-relaxed">
                                    <AutoTranslate text={t('contact.description')} />
                                </p>

                                <div className="grid grid-cols-1 gap-4">
                                    {contactInfo.map((info) => {
                                        const Icon = info.icon
                                        return (
                                            <motion.a
                                                key={info.title}
                                                href={info.href}
                                                target={info.target || '_self'}
                                                rel="noopener noreferrer"
                                                whileTap={{ scale: 0.98 }}
                                                className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-music-gold/30 transition-all group"
                                            >
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                                                    <Icon className="text-music-gold text-lg" />
                                                </div>
                                                <div className="ml-4 overflow-hidden">
                                                    <p className="text-[10px] uppercase tracking-widest text-white/40">{info.title}</p>
                                                    <p className="font-tech text-white/90 text-sm md:text-base truncate group-hover:text-music-red transition-colors">
                                                        <AutoTranslate text={info.fullValue || info.value} />
                                                    </p>
                                                </div>
                                            </motion.a>
                                        )
                                    })}
                                </div>

                                <div className="pt-8 mt-8 border-t border-white/10">
                                    <div className="flex flex-wrap gap-3">
                                        {socialLinks.map((social) => (
                                            <a
                                                key={social.label}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 min-w-[120px] px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:border-music-gold/50 transition-all flex items-center justify-center space-x-2 text-xs"
                                            >
                                                <social.icon className="text-music-gold" />
                                                <span className="font-tech uppercase tracking-tighter">{social.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="music-card p-6 md:p-8 relative overflow-hidden">
                                <div className="absolute inset-0 music-wave opacity-5 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-8">
                                        <div className="flex space-x-1 items-end h-5">
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1 bg-music-gold rounded-full"
                                                    animate={{ height: ['30%', '100%', '30%'] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                            ))}
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-music-gold uppercase italic">
                                            <AutoTranslate text={t('contact.send_message')} />
                                        </h3>
                                    </div>

                                    {isSubmitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12 md:py-20"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-music-gold/20 flex items-center justify-center mx-auto mb-4 border border-music-gold/50">
                                                <FaCheck className="text-music-gold text-2xl" />
                                            </div>
                                            <h4 className="text-lg font-bold text-white uppercase"><AutoTranslate text={t('contact.sent')} /></h4>
                                            <p className="text-white/60 text-xs mt-2"><AutoTranslate text={t('contact.sent_description')} /></p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">
                                                    <AutoTranslate text={t('contact.name')} />
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-4 rounded-lg bg-black/60 border border-white/10 text-white focus:border-music-gold transition-all text-sm"
                                                    placeholder={t('contact.name_placeholder')}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">
                                                    <AutoTranslate text={t('contact.email')} />
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-4 rounded-lg bg-black/60 border border-white/10 text-white focus:border-music-gold transition-all text-sm"
                                                    placeholder={t('contact.email_placeholder')}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">
                                                    <AutoTranslate text={t('contact.message')} />
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows={4}
                                                    className="w-full px-4 py-4 rounded-lg bg-black/60 border border-white/10 text-white focus:border-music-gold transition-all resize-none text-sm"
                                                    placeholder={t('contact.message_placeholder')}
                                                />
                                            </div>

                                            <motion.button
                                                type="submit"
                                                disabled={isSubmitting}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-music-gold hover:bg-white text-black font-black py-4 rounded-lg flex items-center justify-center space-x-3 uppercase tracking-widest transition-all disabled:opacity-50 mt-4 shadow-lg shadow-music-gold/10"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <FaPaperPlane className="text-xs" />
                                                        <span className="text-sm"><AutoTranslate text={t('contact.send')} /></span>
                                                    </>
                                                )}
                                            </motion.button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </SectionFocusWrapper>
        </section>
    )
}

export default Contact
