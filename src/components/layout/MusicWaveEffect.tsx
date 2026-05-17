import { useEffect, useRef } from 'react'

interface MusicWaveEffectProps {
    isPlaying: boolean
    scrollY: number
    activeSection: string
}

interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string
    life: number
    maxLife: number
}

const MusicWaveEffect = ({ isPlaying, scrollY, activeSection }: MusicWaveEffectProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const particlesRef = useRef<Particle[]>([])

    const isPlayingRef = useRef(isPlaying)
    const scrollYRef = useRef(scrollY)
    const activeSectionRef = useRef(activeSection)

    useEffect(() => {
        isPlayingRef.current = isPlaying
        scrollYRef.current = scrollY
        activeSectionRef.current = activeSection
    }, [isPlaying, scrollY, activeSection])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const animate = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const playing = isPlayingRef.current

            // Audio Analysis
            let intensity = 0;
            let bass = 0;
            let treble = 0;
            const analyser = (window as any).audioAnalyser;
            if (playing && analyser) {
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);
                
                let bassSum = 0;
                let trebleSum = 0;
                let totalSum = 0;
                
                for (let i = 0; i < 6; i++) bassSum += dataArray[i];
                for (let i = bufferLength - 20; i < bufferLength; i++) trebleSum += dataArray[i];
                for (let i = 0; i < bufferLength; i++) totalSum += dataArray[i];
                
                bass = Math.pow(bassSum / 6 / 255, 1.5); 
                treble = (trebleSum / 20 / 255);
                intensity = Math.pow((totalSum / bufferLength) / 255, 1.2);
            }

            // Dynamic Section Colors
            const getSectionColors = (section: string) => {
                switch(section) {
                    case 'about': return ['168, 85, 247', '233, 69, 96']; // Purple
                    case 'skills': return ['6, 182, 212', '37, 99, 235']; // Cyan/Blue
                    case 'projects': return ['255, 215, 0', '233, 69, 96']; // Gold/Red
                    case 'achievements': return ['16, 185, 129', '255, 215, 0']; // Emerald/Gold
                    case 'contact': return ['51, 65, 85', '233, 69, 96']; // Slate/Red
                    default: return ['233, 69, 96', '255, 215, 0', '37, 99, 235', '6, 182, 212'];
                }
            }
            const currentColors = getSectionColors(activeSectionRef.current);

            // 1. Particle creation (Burst on bass)
            const particleChance = playing ? (0.2 + bass * 1.5 + treble) : 0.1;
            if (Math.random() < particleChance) {
                const color = currentColors[Math.floor(Math.random() * currentColors.length)];
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: canvas.height + 10,
                    size: Math.random() * 3.5 + 1.5,
                    speedX: Math.random() * 2 - 1,
                    speedY: Math.random() * -4 - 1.5, 
                    color,
                    life: 1,
                    maxLife: Math.random() * 120 + 180 
                })
            }

            // 2. Update particles & Draw
            const particles = particlesRef.current;
            const speedMultiplier = playing ? (1.5 + bass * 5) : 1.1; 
            const isMobile = canvas.width < 768;
            const connectionDist = playing 
                ? (isMobile ? 60 + intensity * 60 : 110 + intensity * 120) 
                : (isMobile ? 40 : 80);
            const connectionDistSq = connectionDist * connectionDist;

            particlesRef.current = particles.filter(p => {
                p.x += (p.speedX + Math.sin(Date.now() / 2000 + p.x) * 0.3) * speedMultiplier;
                p.y += (p.speedY - bass * 8 - treble * 2) * speedMultiplier; 
                p.life -= 0.004;
                return p.life > 0 && p.y > -20;
            });

            const activeParticles = particlesRef.current;
            const len = activeParticles.length;
            
            for (let i = 0; i < len; i++) {
                const p1 = activeParticles[i];
                const alpha = playing ? (0.7 + intensity * 0.3) * p1.life : 0.4 * p1.life;
                
                ctx.shadowBlur = playing ? (10 + bass * 40) : 0;
                ctx.shadowColor = `rgba(${p1.color}, 0.9)`;
                ctx.fillStyle = `rgba(${p1.color}, ${alpha})`;
                ctx.beginPath();
                const dynamicSize = playing ? p1.size * (1 + bass * 2 + treble * 2) : p1.size;
                ctx.arc(p1.x, p1.y, dynamicSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                for (let j = i + 1; j < len; j++) {
                    const p2 = activeParticles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistSq) {
                        const connAlpha = (1 - Math.sqrt(distSq) / connectionDist) * (playing ? 0.3 + intensity * 0.7 : 0.15) * p1.life;
                        ctx.strokeStyle = `rgba(${p1.color}, ${connAlpha})`;
                        ctx.lineWidth = playing ? (0.5 + intensity * 2) : 0.3;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // 3. Ultra Aggressive Multi-Wave effect
            if (playing) {
                const time = Date.now() / 1000
                const isMobile = canvas.width < 768;
                const baseAmplitude = isMobile 
                    ? (15 + intensity * 100) 
                    : (40 + intensity * 350); 
                
                const waveColors = currentColors.map(c => `rgba(${c}, ${0.4 + intensity})`);
                
                for (let wave = 0; wave < Math.min(5, waveColors.length); wave++) {
                    const amplitude = baseAmplitude * (1 - wave * 0.15) * (0.8 + bass * 0.5); // Amplitude reacts to bass!
                    const freq = 0.004 + wave * 0.001;
                    const speed = time * (1 + wave * 0.2);
                    
                    ctx.lineWidth = (2 + intensity * 12) * (1 - wave * 0.1);
                    ctx.shadowBlur = intensity * 40;
                    ctx.shadowColor = waveColors[wave];
                    ctx.strokeStyle = waveColors[wave];
                    
                    ctx.beginPath()
                    for (let x = 0; x < canvas.width; x += 15) {
                        const y = (canvas.height * (0.4 + wave * 0.03)) +
                            Math.sin(x * freq + speed + wave * 2) * amplitude +
                            Math.sin(x * freq * 0.6 + speed * 1.5 + wave) * (amplitude * 0.5) +
                            Math.cos(x * 0.002 - speed * 0.5) * (amplitude * 0.3);
                        
                        if (x === 0) ctx.moveTo(x, y)
                        else ctx.lineTo(x, y)
                    }
                    ctx.stroke()
                    ctx.shadowBlur = 0;
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{
                opacity: isPlaying ? 0.9 : 0.55,
                transition: 'opacity 0.5s ease'
            }}
        />
    )
}

export default MusicWaveEffect
