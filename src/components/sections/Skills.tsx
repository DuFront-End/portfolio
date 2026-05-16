// src/components/sections/Skills.tsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaMusic } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { getIcon } from '../../utils/iconMap'
import AutoTranslate from '../common/AutoTranslate'
import { useProfile } from '../../hooks/useProfile'
import { useSmartPolling } from '../../hooks/useSmartPolling'
import SectionFocusWrapper from '../common/SectionFocusWrapper'

interface SkillItem {
    name: string
    icon: string
    level: number
}

interface SkillCategoryAPI {
    _id: string
    title: string
    icon: string
    skills: SkillItem[]
    order: number
}

const Skills = ({ activeSection }: { activeSection?: string }) => {
    const isActive = activeSection === 'skills'
    const { t } = useTranslation()
    const { profile } = useProfile()
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [apiCategories, setApiCategories] = useState<SkillCategoryAPI[] | null>(null)

    useSmartPolling(async () => {
        try {
            const res = await fetch('/api/skills');
            if (res.status === 429) return res;

            const data = await res.json();
            if (data.success) {
                setApiCategories(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data.data)) {
                        return data.data;
                    }
                    return prev;
                });
            }
        } catch (error) {
            throw error;
        }
    }, 15000);

    const playTechNote = (frequency: number) => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioCtxRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.8);
    };

    const techKeys = [
        { name: 'React', color: 'bg-cyan-600', freq: 261.63 },
        { name: 'TS', color: 'bg-blue-600', freq: 293.66 },
        { name: 'JS', color: 'bg-yellow-500', freq: 329.63 },
        { name: 'Tailwind', color: 'bg-teal-500', freq: 349.23 },
        { name: 'NextJS', color: 'bg-slate-800', freq: 392.00 },
        { name: 'NodeJS', color: 'bg-green-600', freq: 440.00 },
        { name: 'Git', color: 'bg-orange-600', freq: 493.88 },
        { name: 'UI/UX', color: 'bg-pink-600', freq: 523.25 },
    ];
    const [selectedTech, setSelectedTech] = useState<string | null>(null);
    const [lastInteraction, setLastInteraction] = useState(0);

    const handleKeyClick = (tech: any) => {
        playTechNote(tech.freq);
        setSelectedTech(tech.name);
        setLastInteraction(Date.now());
    };

    const softSkills = profile?.softSkills || [
        { name: t('skills.problem_solving') || 'Problem Solving', level: 90 },
        { name: t('skills.teamwork') || 'Teamwork', level: 85 },
        { name: t('skills.time_management') || 'Time Management', level: 88 },
        { name: 'Communication', level: 85 },
    ];

    const languages = profile?.languages || [
        { name: 'Vietnamese', level: t('skills.native') || 'Native', flag: '🇻🇳' },
        { name: 'English', level: t('skills.english_level') || 'IELTS 6.5', flag: '🇺🇸' },
    ];

    return (
        <section id="skills" className="section-container relative overflow-hidden">
            <SectionFocusWrapper isActive={isActive}>
                <h2 className="section-title">
                    <span className="flex items-center justify-center gap-4 uppercase tracking-widest font-music">
                        <AutoTranslate text={t('skills.title')} />
                        <FaMusic className="text-music-red animate-pulse" />
                    </span>
                </h2>

                <div className="max-w-5xl mx-auto mb-20 px-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {techKeys.map((tech, index) => {
                            const isKeyActive = selectedTech === tech.name;
                            return (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => handleKeyClick(tech)}
                                    whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
                                    animate={isKeyActive ? { 
                                        y: 10,
                                        boxShadow: "0 0 25px rgba(255, 215, 0, 0.4)",
                                        filter: "brightness(1.3)"
                                    } : { y: 0 }}
                                    className={`
                                        ${tech.color} w-20 h-32 rounded-b-xl flex items-end justify-center pb-4 
                                        cursor-pointer shadow-[0_6px_0_0_rgba(0,0,0,0.4)]
                                        transition-all border-t-4 border-white/20 relative group
                                        ${isKeyActive ? 'border-b-4 border-music-gold ring-4 ring-music-gold/20' : 'hover:shadow-none'}
                                    `}
                                >
                                    {isKeyActive && (
                                        <motion.div 
                                            initial={{ scale: 0, y: 0 }}
                                            animate={{ scale: 1.5, y: -80, opacity: 0 }}
                                            key={`${tech.name}-${lastInteraction}`}
                                            className="absolute text-music-gold font-bold pointer-events-none"
                                        >
                                            <FaMusic />
                                        </motion.div>
                                    )}
                                    <div className="absolute top-2 w-1 h-8 bg-black/10 rounded-full" />
                                    <span className="text-white font-tech font-bold text-xs rotate-[-90deg] origin-center mb-4 block whitespace-nowrap">
                                        {tech.name}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                    <p className="text-center text-music-gold/40 text-[10px] mt-8 font-tech uppercase tracking-[0.3em]">
                        <AutoTranslate text={t('skills.piano_hint')} />
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {apiCategories ? (
                        apiCategories.map((category, categoryIndex) => {
                            const Icon = getIcon(category.icon);
                            return (
                                <motion.div
                                    key={category._id}
                                    initial={{ opacity: 0, x: categoryIndex === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="music-card p-8 border border-music-gold/10 backdrop-blur-sm"
                                >
                                    <div className="flex items-center space-x-4 mb-8">
                                        <div className="w-12 h-12 rounded-full bg-music-red/10 flex items-center justify-center border border-music-red/20">
                                            <Icon className="text-music-red" size={24} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-music-gold font-music">
                                            <AutoTranslate text={category.title} />
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        {category.skills.map((skill) => {
                                            const SkillIcon = getIcon(skill.icon);
                                            return (
                                                <div key={skill.name} className="group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <SkillIcon className="text-music-cream/50 group-hover:text-music-red transition-colors" />
                                                            <span className="text-music-cream group-hover:translate-x-1 transition-transform inline-block">
                                                                <AutoTranslate text={skill.name} />
                                                            </span>
                                                        </div>
                                                        <span className="text-music-gold/60 text-xs font-tech">{skill.level}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${skill.level}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            className="h-full bg-gradient-to-r from-music-red to-music-gold relative"
                                                        >
                                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-center py-16">
                            <p className="text-music-cream/50 text-lg">⚠️ Không thể kết nối tới server. Vui lòng khởi động backend.</p>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 music-card p-8">
                        <h3 className="text-xl font-bold text-music-gold mb-8 text-center uppercase tracking-widest">
                            <AutoTranslate text={t('skills.soft_skills') || 'Professional Qualities'} />
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            {softSkills.map((skill) => (
                                <div key={skill.name} className="flex flex-col gap-2">
                                    <span className="text-sm text-music-cream/80">
                                        <AutoTranslate text={skill.name} />
                                    </span>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full ${i < Math.round(skill.level / 20) ? 'bg-music-red' : 'bg-white/10'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="music-card p-8 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-music-gold mb-8 text-center uppercase tracking-widest">
                            <AutoTranslate text={t('skills.languages') || 'Languages'} />
                        </h3>
                        <div className="space-y-6">
                            {languages.map((lang) => (
                                <div key={lang.name} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className="font-bold text-sm uppercase tracking-tighter">
                                            <AutoTranslate text={lang.name} />
                                        </span>
                                    </div>
                                    <span className="text-xs text-music-gold font-tech">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionFocusWrapper>
        </section>
    );
};

export default Skills;
