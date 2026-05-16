import React, { useEffect, useRef } from 'react';

const MusicTrail: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<any[]>([]);
    const lastPos = useRef({ x: -100, y: -100 });
    const symbols = ['♪', '♫', '♬', '♩', '∮', '♭'];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        };

        const createParticle = (x: number, y: number, vx: number = 0, vy: number = 0) => {
            const size = Math.random() * 15 + 20;
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            return {
                x,
                y,
                size,
                symbol,
                vx: (Math.random() - 0.5) * 2 + vx * 0.1,
                vy: (Math.random() - 0.5) * 2 + vy * 0.1,
                life: 1,
                opacity: 1,
                hue: Math.random() * 360,
            };
        };

        const animate = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.015;
                p.opacity = p.life;
                p.hue = (p.hue + 2) % 360;

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    continue;
                }

                const color = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
                ctx.shadowBlur = 15 * p.life;
                ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.6)`;
                
                ctx.font = `bold ${p.size}px serif`;
                ctx.fillStyle = color;
                ctx.fillText(p.symbol, p.x, p.y);

                ctx.shadowBlur = 0;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.min(4, Math.max(1, Math.floor(distance / 45)));
            
            for (let i = 0; i < steps; i++) {
                const x = lastPos.current.x + (dx * (i + 1)) / steps;
                const y = lastPos.current.y + (dy * (i + 1)) / steps;
                if (Math.random() > 0.4) {
                    particles.current.push(createParticle(x, y, dx, dy));
                }
            }
            lastPos.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default MusicTrail;
