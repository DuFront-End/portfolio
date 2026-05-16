import { motion } from 'framer-motion';
import React from 'react';

interface SectionFocusWrapperProps {
  children: React.ReactNode;
  isActive: boolean;
}

const SectionFocusWrapper: React.FC<SectionFocusWrapperProps> = ({ children, isActive }) => {
  return (
    <motion.div
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        opacity: isActive ? 1 : 0.25,
        scale: isActive ? 1 : 0.96,
        z: isActive ? 50 : 0,
        filter: isActive ? 'grayscale(0) blur(0px)' : 'grayscale(0.9) blur(4px)',
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="w-full relative"
    >
      {/* Decorative Corner Accents for Active Section */}
      {isActive && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-music-red/50 rounded-tl-2xl -z-10"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-music-gold/50 rounded-br-2xl -z-10"
          />
        </>
      )}
      
      {children}
    </motion.div>
  );
};

export default SectionFocusWrapper;
