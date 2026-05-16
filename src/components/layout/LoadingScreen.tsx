// src/components/layout/LoadingScreen.tsx
import { motion } from 'framer-motion'
import { FaCode, FaMusic } from 'react-icons/fa'
import { GiCompactDisc } from 'react-icons/gi'
import AutoTranslate from '../common/AutoTranslate'

const LoadingScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-music-dark via-music-blue to-music-purple"
        >
            <div className="text-center space-y-10">
                <motion.div
                    animate={{
                        scale: [0.9, 1.05, 0.9],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative mx-auto flex justify-center items-center"
                >
                    <div className="absolute inset-0 bg-music-red/20 blur-3xl rounded-full" />

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="relative w-48 h-48 md:w-56 md:h-56 rounded-full vinyl-effect border-4 border-music-red/30 flex items-center justify-center shadow-2xl"
                    >
                        <GiCompactDisc className="w-full h-full text-music-dark/40 p-1" />

                        <div className="absolute inset-14 md:inset-16 rounded-full bg-music-dark border-2 border-music-gold/40 flex items-center justify-center shadow-inner">
                            <div className="text-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <FaCode className="text-2xl md:text-3xl text-music-cream mx-auto mb-1" />
                                </motion.div>
                                <span className="text-[8px] md:text-[10px] text-music-gold font-tech tracking-widest uppercase">
                                    <AutoTranslate text="NKD Studio" />
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                x: [0, Math.cos(i * Math.PI / 2) * 120],
                                y: [0, Math.sin(i * Math.PI / 2) * 120],
                                rotate: 360,
                                scale: [0.5, 1.5, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.4,
                                ease: "easeOut"
                            }}
                        >
                            <FaMusic className="text-music-red text-xl opacity-60" />
                        </motion.div>
                    ))}
                </motion.div>

                <div className="space-y-6">
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-4xl md:text-5xl font-music font-bold text-music-cream tracking-tight"
                        >
                            <AutoTranslate text="Music" /> <span className="text-music-gold"><AutoTranslate text="Tech" /></span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-col items-center space-y-4"
                    >
                        <p className="text-music-cream/60 font-tech tracking-[0.3em] text-xs uppercase">
                            <AutoTranslate text="Harmonizing Code & Soul" />
                        </p>

                        <div className="flex items-end justify-center space-x-1.5 h-12">
                            {[0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0].map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className="w-1.5 bg-gradient-to-t from-music-red via-music-purple to-music-gold rounded-full"
                                    animate={{
                                        height: [
                                            `${20 + Math.random() * 20}%`,
                                            `${60 + Math.random() * 40}%`,
                                            `${20 + Math.random() * 20}%`
                                        ]
                                    }}
                                    transition={{
                                        duration: 0.5 + Math.random(),
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default LoadingScreen
