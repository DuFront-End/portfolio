// src/utils/iconMap.ts
// Map tên icon (string từ Database) → React Component thực tế
import type { ComponentType } from 'react'

import {
  FaReact, FaJs, FaHtml5, FaGitAlt, FaFigma,
  FaTrophy, FaAward, FaMedal, FaMusic, FaCode
} from 'react-icons/fa'

import {
  SiTypescript, SiTailwindcss, SiNextdotjs, SiVite,
  SiNodedotjs, SiPostman, SiHtml5, SiCss3,
  SiJavascript, SiPhp, SiFigma, SiWordpress
} from 'react-icons/si'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const iconMap: Record<string, ComponentType<any>> = {
  // Font Awesome icons
  FaReact,
  FaJs,
  FaHtml5,
  FaGitAlt,
  FaFigma,
  FaTrophy,
  FaAward,
  FaMedal,
  FaMusic,
  FaCode,

  // Simple Icons
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiVite,
  SiNodedotjs,
  SiPostman,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiPhp,
  SiFigma,
  SiWordpress,
}

/**
 * Lấy React icon component từ tên string.
 * Fallback về FaCode nếu không tìm thấy.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getIcon = (name: string): ComponentType<any> => {
  return iconMap[name] || FaCode
}
