/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'tech-blue': {
                    50: '#e6f7ff',
                    100: '#b3e0ff',
                    200: '#80caff',
                    300: '#4db3ff',
                    400: '#1a9dff',
                    500: '#0080ff',
                    600: '#0066cc',
                    700: '#004d99',
                    800: '#003366',
                    900: '#001a33',
                },
                'cyan': {
                    50: '#e0ffff',
                    100: '#b3ffff',
                    200: '#80ffff',
                    300: '#4dffff',
                    400: '#1affff',
                    500: '#00e6e6',
                    600: '#00b3b3',
                    700: '#008080',
                    800: '#004d4d',
                    900: '#001a1a',
                }
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'heading': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
                'tech': ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'wave': 'wave 8s linear infinite',
                'music-note': 'musicNote 2s ease-out infinite',
                'neon-glow': 'neonGlow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                wave: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                musicNote: {
                    '0%': {
                        transform: 'translateY(0) scale(1)',
                        opacity: 1
                    },
                    '100%': {
                        transform: 'translateY(-100px) scale(0.5)',
                        opacity: 0
                    },
                },
                neonGlow: {
                    'from': {
                        filter: 'drop-shadow(0 0 2px rgba(0, 128, 255, 0.7))',
                    },
                    'to': {
                        filter: 'drop-shadow(0 0 8px rgba(0, 128, 255, 0.9))',
                    },
                }
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}