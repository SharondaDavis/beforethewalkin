import './index.css';
import { StrictMode, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';

type AuraPalette = { spokes: string[]; center: string; dot: string };

const NEUTRAL_AURA: AuraPalette = {
  spokes: ['#5DCAA5','#1D9E75','#9FE1CB','#0F6E56','#5DCAA5','#1D9E75','#9FE1CB','#0F6E56','#5DCAA5','#1D9E75','#9FE1CB','#0F6E56'],
  center: '#E1F5EE', dot: '#1D9E75',
};

const AURA: Record<string, AuraPalette> = {
  drained:    { spokes: ['#B4B2A9','#888780','#D3D1C7','#5F5E5A','#B4B2A9','#888780','#D3D1C7','#5F5E5A','#B4B2A9','#888780','#D3D1C7','#5F5E5A'], center: '#F1EFE8', dot: '#888780' },
  anxious:    { spokes: ['#AFA9EC','#7F77DD','#CECBF6','#534AB7','#AFA9EC','#7F77DD','#CECBF6','#534AB7','#AFA9EC','#7F77DD','#CECBF6','#534AB7'], center: '#EEEDFE', dot: '#7F77DD' },
  frustrated: { spokes: ['#F0997B','#D85A30','#F5C4B3','#993C1D','#F0997B','#D85A30','#F5C4B3','#993C1D','#F0997B','#D85A30','#F5C4B3','#993C1D'], center: '#FAECE7', dot: '#D85A30' },
  neutral:    NEUTRAL_AURA,
  good:       { spokes: ['#85B7EB','#378ADD','#B5D4F4','#185FA5','#85B7EB','#378ADD','#B5D4F4','#185FA5','#85B7EB','#378ADD','#B5D4F4','#185FA5'], center: '#E6F1FB', dot: '#378ADD' },
};

const VIBES: Record<string, Record<string, { word: string; tag: string; reframe: string }>> = {
  drained: {
    review:   { word: 'Still water',   tag: "You don't have to perform. You just have to show up.",         reframe: "You're tired, and that's real. But tired doesn't mean wrong. You know your work better than anyone in that room. You don't need to be sharp — you just need to be honest." },
    conflict: { word: 'The gap',       tag: "Slow is strong when the room is loud.",                        reframe: "When you're drained, conflict feels heavier than it is. You don't have to win today — you just have to say the one true thing you came to say. That's enough." },
    pitch:    { word: 'Quiet gravity', tag: "The quietest person in the room is often the most confident.", reframe: "Low energy can actually read as calm authority if you let it. You don't need to perform excitement. Speak slowly, pause when you need to, and trust that the work carries itself." },
    collab:   { word: 'Anchor',        tag: "Being present is the whole job today.",                        reframe: "You're not going to be the most energetic person in the room today, and that's fine. Your job is to listen carefully and say one useful thing. That's a real contribution." },
    decision: { word: 'Signal',        tag: "Tired minds cut straight to what matters.",                    reframe: "Here's the thing about being drained — you don't have the energy to overthink. Your gut read on this might actually be your clearest. Trust it. Say it simply." },
  },
  anxious: {
    review:   { word: 'Grounded',    tag: "You've already done the hard part. This is just the conversation.", reframe: "Yeah, you don't know exactly how this is going to go. But the work you've done already made the argument for you. You're not going in empty-handed — you're going in to clarify what's already true." },
    conflict: { word: 'Curious',     tag: "The person who asks the first question controls the room.",        reframe: "I hope this goes well too — and here's what actually helps: go in wanting to understand their side before you make yours. Not because you're weak, but because it's disarming. And it usually works." },
    pitch:    { word: 'Ready',       tag: "You've thought about this more than anyone else in that room.",    reframe: "Yeah, you don't know how they'll respond. Nobody ever does. But you've lived with this idea longer than they have. That matters. The nerves just mean you care — let them." },
    collab:   { word: 'Present',     tag: "Nobody needs you to perform. They just need you to think.",        reframe: "The anxiety you're feeling is your brain trying to protect you from a threat that isn't actually there. This is a collaboration, not an evaluation. You were invited because your thinking is wanted." },
    decision: { word: 'Clear-eyed',  tag: "Honest uncertainty is more useful than false confidence.",         reframe: "You're worried you don't have all the answers. Good — nobody does. The most useful thing you can bring into a decision meeting is what you genuinely know and what you genuinely don't. That's not weakness, that's clarity." },
  },
  frustrated: {
    review:   { word: 'Underneath',  tag: "The feeling is valid. What you do with it is the choice.",        reframe: "Something feels off or unfair, and you're carrying that in. That's real. But the most powerful thing you can do right now is name it calmly instead of leaking it. People hear you more clearly when you're not hot." },
    conflict: { word: 'Precise',     tag: "The cleaner the sentence, the harder it is to ignore.",           reframe: "You're frustrated and you have every right to be. But frustration that stays frustration just creates noise. Find the sentence underneath it — the thing that's actually true — and say that instead." },
    pitch:    { word: 'Edge',        tag: "Belief is more convincing than polish.",                          reframe: "That frustration? It means you actually believe in this. Use it. The best pitches aren't the smoothest ones — they're the ones where it's clear the person giving them genuinely means it." },
    collab:   { word: 'Measured',    tag: "You don't have to give everything today.",                        reframe: "You're carrying something and it's heavy. Give yourself permission to be a quieter participant today. One good, well-timed contribution is worth more than ten reactive ones." },
    decision: { word: 'Deliberate',  tag: "Say it once, clearly, and let the room do the rest.",             reframe: "You have a strong opinion and you're probably right. But frustration makes us push harder than the moment needs. State your position clearly, say it once with confidence, and then let the room respond." },
  },
  neutral: {
    review:   { word: 'Open',        tag: "No defenses up means you can actually hear something useful.",    reframe: "You're in the best possible state for a review — no anxiety, no agenda. Treat this like a calibration conversation, not a verdict. You're here to get data, not to be judged." },
    conflict: { word: 'Steady',      tag: "The calmest person in the room usually wins.",                   reframe: "Your neutrality is actually a superpower here. You can afford to listen fully before you respond. You're not triggered, which means you can actually hear what they're really saying underneath what they're saying." },
    pitch:    { word: 'Focused fire',tag: "Find the reason you care before you walk in.",                   reframe: "You're steady, which is good — but pitches need a spark. Take 30 seconds to remember why this idea actually matters to you. Not why it's good on paper. Why you personally give a damn. That's what lands." },
    collab:   { word: 'Receptive',   tag: "The best idea in the room might not be yours today. Stay open.", reframe: "Neutral is actually the ideal collaboration state. You're not trying to win, not trying to prove anything. You're here to build something. Stay loose — the best contribution might come from somewhere you didn't expect." },
    decision: { word: 'Calibrated',  tag: "No ego in the room means cleaner decisions.",                    reframe: "You can weigh this without attachment, which is rare. Most people in decision meetings are defending something. You're not — which means your read is probably the clearest one in the room." },
  },
  good: {
    review:   { word: 'Grounded',    tag: "Confidence is most useful when it's also curious.",              reframe: "You're in a great headspace — just don't let it close you off. The best feedback often comes when you're not defending. Stay open even when you feel good. Especially when you feel good." },
    conflict: { word: 'Generous',    tag: "You're strong enough to extend first.",                          reframe: "You're in the right state to actually hear the other person — not just wait for your turn. Lead by naming something true about their perspective before you make your point. It changes the whole dynamic." },
    pitch:    { word: 'Lion mode',   tag: "This is yours. You've done the work.",                           reframe: "You're ready. The prep is done, you believe in the idea, and you feel like yourself. Your only job now is to show up as you and trust that the preparation is already in the room with you." },
    collab:   { word: 'Lit',         tag: "Good energy is the most contagious thing in a room.",            reframe: "Your clarity today is a gift — don't hoard it. The best collaborations happen when someone makes it easier for everyone else to be honest and bold. That's your role today." },
    decision: { word: 'Sharp',       tag: "Trust the read. You're seeing clearly today.",                   reframe: "Good energy plus clear thinking is your best state for a big decision. Don't second-guess your instincts today — they're sharp. Say your piece with confidence and let the room respond." },
  },
};

const GOAL_ACTIONS: Record<string, string> = {
  heard:   'Before you speak, repeat back what you just heard from them. Just once. It signals you were actually listening — and it changes how they hear you.',
  moved:   'Identify the one thing that, if said clearly, moves this forward. Say that first. Everything else is secondary.',
  honest:  "The thing you've been holding back — you already know what it is. Prepare to say it clearly, without apologizing for having the thought.",
  through: 'Give yourself full permission to just finish this one. Not every meeting needs to be a win. Done is enough today.',
};

type WellnessTechnique = {
  name: string;
  type: 'breath' | 'visual';
  color: string;
  bgColor: string;
  numColor: string;
  phases?: { label: string; dur: number; toR: number }[];
  steps: string[];
  svg?: string;
};

const NEUTRAL_WELLNESS: WellnessTechnique = {
  name: 'Quick reset walk',
  type: 'visual',
  color: '#1D9E75',
  bgColor: '#E1F5EE',
  numColor: '#0F6E56',
  steps: [
    'Step away from your desk or waiting area',
    'Walk for 2 minutes — outside if possible, hallway if not',
    'No phone. Just walk and breathe naturally.',
    'Come back and walk in. Movement clears the head.',
  ],
  svg: `<svg width="80" height="100" viewBox="0 0 80 100"><circle cx="40" cy="14" r="10" fill="#E1F5EE" stroke="#1D9E75" stroke-width="0.5"/><line x1="40" y1="24" x2="40" y2="60" stroke="#1D9E75" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="38" x2="26" y2="52" stroke="#1D9E75" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="38" x2="54" y2="52" stroke="#1D9E75" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="60" x2="28" y2="88" stroke="#1D9E75" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="60" x2="52" y2="88" stroke="#1D9E75" stroke-width="2" stroke-linecap="round"/></svg>`,
};

const WELLNESS: Record<string, WellnessTechnique> = {
  anxious: {
    name: 'Box breathing',
    type: 'breath',
    color: '#7F77DD',
    bgColor: '#EEEDFE',
    numColor: '#534AB7',
    phases: [
      { label: 'Breathe in...', dur: 4000, toR: 38 },
      { label: 'Hold...',       dur: 4000, toR: 38 },
      { label: 'Breathe out...', dur: 4000, toR: 16 },
      { label: 'Hold...',       dur: 4000, toR: 16 },
    ],
    steps: [
      'Breathe in slowly through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly through your mouth for 4 counts',
      'Hold empty for 4 counts',
      'Repeat 2 times. Your heart rate will slow.',
    ],
  },
  frustrated: {
    name: 'Long exhale',
    type: 'breath',
    color: '#D85A30',
    bgColor: '#FAECE7',
    numColor: '#993C1D',
    phases: [
      { label: 'Breathe in...', dur: 4000, toR: 38 },
      { label: 'Breathe out slowly...', dur: 8000, toR: 16 },
    ],
    steps: [
      'Breathe in through your nose for 4 counts',
      'Exhale slowly through your mouth for 8 counts — twice as long',
      'Let the frustration leave with the breath',
      'Repeat 3 times. The long exhale activates your calm response.',
    ],
  },
  drained: {
    name: '5-4-3-2-1 grounding',
    type: 'visual',
    color: '#888780',
    bgColor: '#F1EFE8',
    numColor: '#5F5E5A',
    steps: [
      'Name 5 things you can see right now',
      'Name 4 things you can physically touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
    ],
    svg: `<svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/><text x="40" y="24" text-anchor="middle" font-size="10" fill="#5F5E5A" font-family="-apple-system,sans-serif">5 · see</text><text x="40" y="36" text-anchor="middle" font-size="10" fill="#5F5E5A" font-family="-apple-system,sans-serif">4 · touch</text><text x="40" y="48" text-anchor="middle" font-size="10" fill="#5F5E5A" font-family="-apple-system,sans-serif">3 · hear</text><text x="40" y="60" text-anchor="middle" font-size="10" fill="#5F5E5A" font-family="-apple-system,sans-serif">2 · smell</text><text x="40" y="72" text-anchor="middle" font-size="10" fill="#5F5E5A" font-family="-apple-system,sans-serif">1 · taste</text></svg>`,
  },
  neutral: {
    ...NEUTRAL_WELLNESS,
  },
  good: {
    name: 'Power pose',
    type: 'visual',
    color: '#378ADD',
    bgColor: '#E6F1FB',
    numColor: '#185FA5',
    steps: [
      'Stand up straight, feet shoulder-width apart',
      'Hands on hips, chin slightly up, shoulders back',
      'Hold for 30 seconds. Breathe normally.',
      "It sounds silly. Research says it works. Now go.",
    ],
    svg: `<svg width="80" height="100" viewBox="0 0 80 100"><circle cx="40" cy="14" r="10" fill="#E6F1FB" stroke="#378ADD" stroke-width="0.5"/><line x1="40" y1="24" x2="40" y2="62" stroke="#378ADD" stroke-width="2.5" stroke-linecap="round"/><line x1="40" y1="36" x2="14" y2="50" stroke="#378ADD" stroke-width="2.5" stroke-linecap="round"/><line x1="40" y1="36" x2="66" y2="50" stroke="#378ADD" stroke-width="2.5" stroke-linecap="round"/><line x1="40" y1="62" x2="28" y2="92" stroke="#378ADD" stroke-width="2.5" stroke-linecap="round"/><line x1="40" y1="62" x2="52" y2="92" stroke="#378ADD" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  },
};

function BreathingCanvas({ technique }: { technique: WellnessTechnique }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const phaseStartRef = useRef(0);
  const fromRRef = useRef(16);
  const [phaseLabel, setPhaseLabel] = useState('Breathe in...');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !technique.phases) return;
    const ctx = canvas.getContext('2d')!;
    const cx = 45, cy = 45, minR = 16, maxR = 38;
    phaseRef.current = 0;
    phaseStartRef.current = performance.now();
    fromRRef.current = minR;

    function ease(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

    function draw(r: number) {
      ctx.clearRect(0, 0, 90, 90);
      ctx.beginPath(); ctx.arc(cx, cy, maxR + 4, 0, Math.PI*2);
      ctx.strokeStyle = technique.color + '22'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.fillStyle = technique.color + '18'; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.strokeStyle = technique.color; ctx.lineWidth = 1.5; ctx.stroke();
    }

    function tick(now: number) {
      const phases = technique.phases!;
      const phase = phases[phaseRef.current];
      if (!phase) return;
      const elapsed = now - phaseStartRef.current;
      const progress = Math.min(1, elapsed / phase.dur);
      const r = fromRRef.current + (phase.toR - fromRRef.current) * ease(progress);
      draw(r);
      setPhaseLabel(phase.label);
      if (progress >= 1) {
        fromRRef.current = phase.toR;
        phaseRef.current = (phaseRef.current + 1) % phases.length;
        phaseStartRef.current = now;
      }
      animRef.current = requestAnimationFrame(tick);
    }

    draw(minR);
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [technique]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <canvas ref={canvasRef} width={90} height={90} />
      <p style={{ fontSize: 12, color: '#666', textAlign: 'center', minWidth: 80, minHeight: 18 }}>{phaseLabel}</p>
    </div>
  );
}

function WellnessSection({ mood }: { mood: string }) {
  const technique = WELLNESS[mood] ?? NEUTRAL_WELLNESS;

  return (
    <div>
      <hr style={{ border: 'none', borderTop: '0.5px solid rgba(0,0,0,0.1)', margin: '1.25rem 0' }} />
      <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '0.75rem' }}>Wellness technique</p>
      <div style={{ border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '1.25rem', background: 'rgba(0,0,0,0.01)' }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: '1rem' }}>{technique.name}</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {technique.type === 'breath' ? (
            <BreathingCanvas technique={technique} />
          ) : (
            <div style={{ flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: technique.svg ?? '' }} />
          )}
          <div style={{ flex: 1 }}>
            {technique.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: technique.bgColor, color: technique.numColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0, marginTop: 1 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#bbb', fontStyle: 'italic', marginTop: '0.75rem', lineHeight: 1.6 }}>
          Always consult your healthcare provider before starting any new wellness, breathing, or exercise program. This is not medical advice.
        </p>
      </div>
    </div>
  );
}

function getLengths(mood: string, count: number, step: number): number[] {
  const s = mood.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: count }, (_, i) => {
    const t = i / count;
    const base = 18 + 52 * Math.abs(Math.sin(t * Math.PI * 3.9 + s * 0.09 + i * 0.7));
    return base * (0.3 + 0.7 * (step / 4));
  });
}

function AuraWheel({ mood, step, size, animated = true }: { mood: string; step: number; size: number; animated?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const pal = AURA[mood] ?? NEUTRAL_AURA;
    const count = 12;
    const cx = size / 2, cy = size / 2;
    const lengths = getLengths(mood, count, step);
    const visibleSpokes = Math.ceil(count * Math.min(1, step / 4 + 0.15));
    const centerR = step === 4 ? 14 : 10;

    function draw(p: number) {
      ctx.clearRect(0, 0, size, size);
      for (let i = 0; i < visibleSpokes; i++) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const len = (lengths[i] ?? 0) * p;
        const color = pal.spokes[i % pal.spokes.length] ?? pal.dot;
        const x2 = cx + Math.cos(angle) * len;
        const y2 = cy + Math.sin(angle) * len;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x2, y2);
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.globalAlpha = 0.5 + 0.5 * (step / 4) * p; ctx.stroke();
        ctx.beginPath(); ctx.arc(x2, y2, 2.5 * p, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.globalAlpha = (step / 4) * p; ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
      ctx.fillStyle = pal.center; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, centerR, 0, Math.PI * 2);
      ctx.strokeStyle = pal.spokes[0] ?? pal.dot; ctx.lineWidth = 0.5; ctx.stroke();
    }

    cancelAnimationFrame(animRef.current);
    if (!animated || step === 0) { draw(1); return; }
    const start = performance.now();
    const dur = step === 4 ? 1100 : 600;
    function frame(now: number) {
      const p = Math.min(1, (now - start) / dur);
      draw(1 - Math.pow(1 - p, 3));
      if (p < 1) animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, [mood, step, size, animated]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}

function Opt({ label, sub, selected, onClick }: { label: string; sub?: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: selected ? 'rgba(0,0,0,0.04)' : 'transparent', border: selected ? '0.5px solid rgba(0,0,0,0.7)' : '0.5px solid rgba(0,0,0,0.15)', borderRadius: 8, padding: '13px 16px', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', color: '#111', lineHeight: 1.4, width: '100%', transition: 'border-color 0.2s, background 0.2s' }}>
      {label}
      {sub && <span style={{ display: 'block', fontSize: 12, color: '#999', marginTop: 3 }}>{sub}</span>}
    </button>
  );
}

type Screen = 's1' | 's2' | 's3' | 's4' | 'result';

export const App = () => {
  const [screen, setScreen] = useState<Screen>('s1');
  const [mood, setMood] = useState('');
  const [meetType, setMeetType] = useState('');
  const [intent, setIntent] = useState('');
  const [goal, setGoal] = useState('');
  const [copied, setCopied] = useState(false);

  const pal = AURA[mood] ?? NEUTRAL_AURA;
  const vibe = VIBES[mood]?.[meetType];
  const goalAction = GOAL_ACTIONS[goal] ?? '';

  function goTo(s: Screen) { setScreen(s); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function restart() { setScreen('s1'); setMood(''); setMeetType(''); setIntent(''); setGoal(''); }
  function doShare() {
    if (!vibe) return;
    navigator.clipboard.writeText(`My WalkIN aura: ${vibe.word}\n"${vibe.tag}"\n\nr/beforethewalkin`).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const base: CSSProperties = { fontFamily: "-apple-system, 'Helvetica Neue', sans-serif", maxWidth: 440, margin: '0 auto', padding: '1.5rem 1.25rem 3rem', background: '#fff', color: '#111', overflow: 'hidden' };

  const brandRow = (label?: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 500 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: mood ? pal.dot : '#111', display: 'inline-block', transition: 'background 0.5s' }} />
        WalkIN
      </div>
      {label && <span style={{ fontSize: 12, color: '#aaa' }}>{label}</span>}
    </div>
  );

  const qHead = (q: string, sub: string) => (
    <><h2 style={{ fontSize: 21, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>{q}</h2>
    <p style={{ fontSize: 14, color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>{sub}</p></>
  );

  const nxtBtn = (label: string, disabled: boolean, onClick: () => void) => (
    <button disabled={disabled} onClick={onClick} style={{ width: '100%', background: 'transparent', border: '0.5px solid rgba(0,0,0,0.25)', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontFamily: 'inherit', cursor: disabled ? 'default' : 'pointer', color: '#111', opacity: disabled ? 0.25 : 1, marginTop: 4 }}>
      {label}
    </button>
  );

  return (
    <div style={base}>
      {screen === 's1' && <div>
        {brandRow('1 of 4')}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0 1.75rem' }}>
          <AuraWheel mood={mood || 'neutral'} step={mood ? 1 : 0} size={180} animated={!!mood} />
        </div>
        {qHead('Where are you right now?', 'Be honest. Nobody else can see this.')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.5rem' }}>
          {[
            {v:'drained',    l:'Running on empty',      s:'Tired, flat, just trying to get through it'},
            {v:'anxious',    l:'Hoping this goes okay', s:"That low-key dread you can't quite shake"},
            {v:'frustrated', l:'Already annoyed',       s:"Something happened and you're still carrying it"},
            {v:'neutral',    l:'Fine, just fine',       s:'Not good, not bad — just here'},
            {v:'good',       l:'Actually ready',        s:'Clear head, good energy, feeling like yourself'},
          ].map(o => (
            <Opt key={o.v} label={o.l} sub={o.s} selected={mood === o.v} onClick={() => setMood(o.v)} />
          ))}
        </div>
        {nxtBtn('Continue', !mood, () => goTo('s2'))}
      </div>}

      {screen === 's2' && <div>
        {brandRow('2 of 4')}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0 1.75rem' }}>
          <AuraWheel mood={mood} step={2} size={180} />
        </div>
        {qHead("What are you walking into?", 'Each one hits different.')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.5rem' }}>
          {[
            {v:'review',   l:"Someone's evaluating me",           s:'Performance review, feedback session, check-in'},
            {v:'conflict', l:'It might get uncomfortable',        s:"A tough conversation that's been building"},
            {v:'pitch',    l:"I'm selling something",             s:'An idea, a plan, a vision — making the case'},
            {v:'collab',   l:"We're figuring it out together",    s:'No set agenda, just working through something'},
            {v:'decision', l:"Something's getting decided today", s:'And your input actually matters'},
          ].map(o => (
            <Opt key={o.v} label={o.l} sub={o.s} selected={meetType === o.v} onClick={() => setMeetType(o.v)} />
          ))}
        </div>
        {nxtBtn('Continue', !meetType, () => goTo('s3'))}
      </div>}

      {screen === 's3' && <div>
        {brandRow('3 of 4')}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0 1.75rem' }}>
          <AuraWheel mood={mood} step={3} size={180} />
        </div>
        {qHead('If this goes well, what did you bring?', 'Not what you said — what you brought.')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.5rem' }}>
          {[
            {v:'clarity',    l:'A clear point of view',   s:'You knew what you thought and you said it'},
            {v:'presence',   l:'You were actually there', s:'Listening, not just waiting to talk'},
            {v:'courage',    l:'You said the hard thing', s:'The thing that needed to be said'},
            {v:'steadiness', l:"You didn't get rattled",  s:"Calm when others weren't"},
          ].map(o => (
            <Opt key={o.v} label={o.l} sub={o.s} selected={intent === o.v} onClick={() => setIntent(o.v)} />
          ))}
        </div>
        {nxtBtn('Continue', !intent, () => goTo('s4'))}
      </div>}

      {screen === 's4' && <div>
        {brandRow('4 of 4')}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0 1.75rem' }}>
          <AuraWheel mood={mood} step={3} size={180} animated={false} />
        </div>
        {qHead('Last one.', 'What does a win actually look like today?')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.5rem' }}>
          {[
            {v:'heard',   l:'They actually heard me',  s:"Someone in that room gets where I'm coming from"},
            {v:'moved',   l:'Something shifted',       s:'A decision, a relationship, a plan — something moved'},
            {v:'honest',  l:'I said what was true',    s:"Even the part I've been sitting on"},
            {v:'through', l:'I just got through it',   s:"Sometimes that's the whole win"},
          ].map(o => (
            <Opt key={o.v} label={o.l} sub={o.s} selected={goal === o.v} onClick={() => setGoal(o.v)} />
          ))}
        </div>
        {nxtBtn('How do I WalkIN this?', !goal, () => goTo('result'))}
      </div>}

      {screen === 'result' && vibe && <div>
        {brandRow()}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.25rem 0 1.5rem' }}>
          <AuraWheel mood={mood} step={4} size={200} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 4 }}>{vibe.word}</div>
        <p style={{ fontSize: 14, color: '#666', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: 1.6 }}>{vibe.tag}</p>

        <hr style={{ border: 'none', borderTop: '0.5px solid rgba(0,0,0,0.1)', margin: '1.25rem 0' }} />
        <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '0.6rem' }}>Reframe</p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#111' }}>{vibe.reframe}</p>

        <hr style={{ border: 'none', borderTop: '0.5px solid rgba(0,0,0,0.1)', margin: '1.25rem 0' }} />
        <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '0.6rem' }}>Before you walk in</p>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{goalAction}</p>

        <WellnessSection mood={mood} />

        <div style={{ border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '1.25rem', marginTop: '1.5rem', background: 'rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: pal.dot, display: 'inline-block' }} />
            <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa' }}>WalkIN</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>{vibe.word}</div>
          <div style={{ fontSize: 13, color: '#777', fontStyle: 'italic', marginTop: 3 }}>{vibe.tag}</div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem' }}>
          <button onClick={doShare} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 22px', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy to share'}
          </button>
        </div>
        <button onClick={restart} style={{ background: 'none', border: 'none', fontSize: 13, color: '#bbb', cursor: 'pointer', fontFamily: 'inherit', marginTop: '1.25rem', display: 'block' }}>
          Start over
        </button>
      </div>}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
createRoot(rootElement).render(<StrictMode><App /></StrictMode>);
