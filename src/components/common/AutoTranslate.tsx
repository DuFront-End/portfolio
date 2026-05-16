import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Cache tĩnh trong RAM để tránh gọi API nhiều lần cho cùng một chuỗi
const translationCache: Record<string, string> = {};

interface AutoTranslateProps {
    text: string;
}

const AutoTranslate = ({ text }: AutoTranslateProps) => {
    const { i18n } = useTranslation();
    const targetLang = i18n.language || 'vi';
    const cacheKey = `${targetLang}_${text}`;
    const [translatedText, setTranslatedText] = useState(translationCache[cacheKey] || '');
    const [isTranslating, setIsTranslating] = useState(false);

    const TECH_KEYWORDS = [
        'React', 'ReactJS', 'Node.js', 'NodeJS', 'TypeScript', 'JavaScript', 
        'MongoDB', 'Express', 'ExpressJS', 'Python', 'Java', 'HTML', 'CSS', 
        'Tailwind', 'TailwindCSS', 'Figma', 'Git', 'GitHub', 'Vite', 'Next.js', 
        'NextJS', 'SQL', 'NoSQL', 'Docker', 'AWS', 'Firebase', 'Redux', 'Socket.io',
        'Postman', 'Trello', 'Jira', 'Slack', 'Vercel', 'Netlify', 'Cloudflare'
    ];

    useEffect(() => {
        const translate = async () => {
            if (!text) return;
            
            const currentTargetLang = i18n.language || 'vi';
            const currentCacheKey = `${currentTargetLang}_${text}`;

            if (TECH_KEYWORDS.some(kw => text.trim().toLowerCase() === kw.toLowerCase())) {
                setTranslatedText(text);
                return;
            }

            if (translationCache[currentCacheKey]) {
                setTranslatedText(translationCache[currentCacheKey]);
                return;
            }

            setTranslatedText('');
            setIsTranslating(true);
            try {
                let parsedLang = currentTargetLang;
                if (currentTargetLang === 'zh') parsedLang = 'zh-CN';

                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${parsedLang}&dt=t&q=${encodeURIComponent(text)}`;
                const response = await fetch(url);
                
                if (!response.ok) throw new Error('Google API Error');
                const data = await response.json();
                const result = data[0].map((item: any) => item[0]).join('');
                
                translationCache[currentCacheKey] = result;
                setTranslatedText(result);
            } catch (error) {
                console.error('Translation API failed:', error);
                if (currentTargetLang === 'vi') {
                    setTranslatedText(text);
                } else {
                    setTranslatedText('【 Không thể dịch / Translation Error 】');
                }
            } finally {
                setIsTranslating(false);
            }
        };

        translate();
    }, [text, i18n.language]);

    return (
        <span className={isTranslating ? 'animate-pulse opacity-70' : 'transition-opacity duration-300'}>
            {translatedText}
        </span>
    );
};

export default AutoTranslate;
