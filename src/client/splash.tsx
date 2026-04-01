import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { requestExpandedMode } from '@devvit/web/client';

const COLORS = [
  '#AFA9EC','#5DCAA5','#F0997B','#85B7EB','#CECBF6',
  '#9FE1CB','#F5C4B3','#B5D4F4','#7F77DD','#1D9E75',
  '#D85A30','#378ADD','#B4B2A9','#888780'
];

function SplashWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 150, cx = 75, cy = 75;
    const count = 14;
    const lengths = Array.from({ length: count }, (_, i) =>
      32 + 42 * Math.abs(Math.sin(i * 1.3 + 0.7))
    );

    function draw() {
      ctx.clearRect(0, 0, W, W);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRef.current);
      ctx.translate(-cx, -cy);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const len = lengths[i] ?? 40;
        const color = COLORS[i % COLORS.length] ?? '#888';
        const x2 = cx + Math.cos(angle) * len;
        const y2 = cy + Math.sin(angle) * len;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x2, y2);
        ctx.strokeStyle = color; ctx.lineWidth = 2.5;
        ctx.lineCap = 'round'; ctx.globalAlpha = 0.8; ctx.stroke();
        ctx.beginPath(); ctx.arc(x2, y2, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.globalAlpha = 0.9; ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a1a'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();

      angleRef.current += 0.003;
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={150} height={150} />;
}

export function Splash() {
  const handleStart = (e: React.MouseEvent) => {
    requestExpandedMode(e.nativeEvent, 'game');
  };

  return (
    <div style={{
      fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
      background: '#0e0e0e',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      textAlign: 'center',
      overflow: 'hidden',
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>WalkIN</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <SplashWheel />
        <h1 style={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.92)', textAlign: 'center', lineHeight: 1.3, maxWidth: 240, letterSpacing: '-0.01em', margin: 0 }}>
          That feeling before a{' '}
          <span style={{ color: '#fff', fontWeight: 500 }}>big meeting?</span>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.5, maxWidth: 220, margin: 0 }}>
          Let's walk in as your best self.
        </p>
      </div>

      <button
        onClick={handleStart}
        style={{
          width: '100%', maxWidth: 280,
          background: '#fff', color: '#0e0e0e',
          border: 'none', borderRadius: 25,
          padding: '12px 24px', fontSize: 14,
          fontWeight: 500, fontFamily: 'inherit',
          cursor: 'pointer', letterSpacing: '0.01em',
        }}
      >
        Let's work through it
      </button>

    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><Splash /></StrictMode>
);