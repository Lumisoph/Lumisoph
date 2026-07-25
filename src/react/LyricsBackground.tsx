import { useEffect, useState, useRef } from 'react';

interface LyricLine { time: number; text: string; }
interface Props { lrcPath: string; }

function parseLRC(raw: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('{')) continue;
    const match = trimmed.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (!match) continue;
    const min = parseInt(match[1]), sec = parseInt(match[2]);
    const ms = parseInt(match[3]) / (match[3].length === 3 ? 1000 : 100);
    const text = match[4].trim();
    if ((text.startsWith('（') && text.endsWith('）')) || (text.startsWith('(') && text.endsWith(')'))) continue;
    if (!text) continue;
    lines.push({ time: min * 60 + sec + ms, text });
  }
  return lines;
}

function RicePaper() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, background: `
      radial-gradient(ellipse at 25% 30%, rgba(139,119,90,0.05) 0%, transparent 60%),
      radial-gradient(ellipse at 75% 70%, rgba(139,119,90,0.04) 0%, transparent 60%),
      repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120,100,70,0.02) 2px, rgba(120,100,70,0.02) 3px)
    `}} aria-hidden="true" />
  );
}

export default function LyricsBackground({ lrcPath }: Props) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [lineIndex, setLineIndex] = useState(-1);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<'ink' | 'dry'>('ink');
  // 当前句显示在哪一侧，每次换行交替
  const [side, setSide] = useState<'left' | 'right'>('left');
  const prevIndex = useRef(-1);
  const keyRef = useRef(0);

  useEffect(() => {
    fetch(lrcPath).then(r => r.text()).then(raw => setLyrics(parseLRC(raw))).catch(() => {});
  }, [lrcPath]);

  useEffect(() => {
    if (lyrics.length === 0) return;
    const onTick = (e: Event) => {
      const t = (e as CustomEvent).detail as number;
      // 时间归零 = 停止/重头，保持当前歌词不消失
      if (t <= 0) return;
      let i = -1;
      for (let j = 0; j < lyrics.length; j++) {
        if (lyrics[j].time <= t) i = j; else break;
      }
      setLineIndex(i);
    };
    window.addEventListener('music-tick', onTick);
    return () => window.removeEventListener('music-tick', onTick);
  }, [lyrics]);

  // 换行时交替方向 + 逐字动画
  useEffect(() => {
    if (lineIndex !== prevIndex.current && lineIndex >= 0) {
      prevIndex.current = lineIndex;
      keyRef.current++;
      setSide(s => s === 'left' ? 'right' : 'left');
      setCharCount(0);
      setPhase('ink');
      const text = lyrics[lineIndex]?.text ?? '';
      if (!text) return;
      const interval = Math.max(80, 1800 / text.length);
      let c = 0;
      const timer = setInterval(() => {
        c++;
        setCharCount(c);
        if (c >= text.length) {
          clearInterval(timer);
          setTimeout(() => setPhase('dry'), 400);
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [lineIndex]);

  const currentLine = lyrics[lineIndex]?.text ?? '';
  const nextLine = lyrics[lineIndex + 1]?.text ?? '';

  if (lineIndex < 0) return <RicePaper />;

  const lineStyle: React.CSSProperties = {
    fontFamily: "'Ma Shan Zheng', 'Noto Serif SC', 'KaiTi', 'STKaiti', cursive",
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
  };

  // 当前句是大字侧，下一句是小字侧
  const bigSide = side;
  const smallSide = side === 'left' ? 'right' : 'left';

  return (
    <>
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="ink-wash" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ink-dry" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <RicePaper />

      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="h-full max-w-5xl mx-auto flex items-center justify-between px-8">

          {/* 左栏 */}
          <div key={`L-${keyRef.current}`} className={bigSide === 'left' ? 'animate-[slideFromLeft_0.6s_ease-out]' : ''}>
            <p
              className={`transition-all duration-700 leading-loose tracking-[0.3em] font-black
                ${bigSide === 'left' ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl opacity-5'}`}
              style={{
                ...lineStyle,
                color: 'var(--color-text)',
                opacity: bigSide === 'left' ? (phase === 'ink' ? 0.16 : 0.22) : 0.05,
                filter: bigSide === 'left' ? (phase === 'ink' ? 'url(#ink-wash)' : 'url(#ink-dry)') : 'url(#ink-dry)',
                textShadow: bigSide === 'left'
                  ? (phase === 'ink'
                    ? '0 0 60px var(--color-primary), 0 0 120px rgba(139,90,43,0.3)'
                    : '1px 1px 2px rgba(139,90,43,0.12), 0 0 30px var(--color-primary)')
                  : '0 0 10px var(--color-primary)',
              }}
            >
              {bigSide === 'left'
                ? currentLine.slice(0, charCount)
                : nextLine}
              {bigSide === 'left' && charCount < currentLine.length && (
                <span className="inline-block w-[2px] h-[0.7em] bg-[var(--color-primary)]/40 animate-pulse" />
              )}
            </p>
          </div>

          {/* 右栏 */}
          <div key={`R-${keyRef.current}`} className={bigSide === 'right' ? 'animate-[slideFromRight_0.6s_ease-out]' : ''}>
            <p
              className={`transition-all duration-700 leading-loose
                ${bigSide === 'right'
                  ? 'text-2xl md:text-4xl font-black tracking-[0.3em]'
                  : 'text-lg md:text-xl font-normal tracking-[0.2em]'}`}
              style={{
                ...lineStyle,
                color: 'var(--color-text)',
                opacity: bigSide === 'right' ? (phase === 'ink' ? 0.16 : 0.22) : 0.05,
                filter: bigSide === 'right' ? (phase === 'ink' ? 'url(#ink-wash)' : 'url(#ink-dry)') : 'url(#ink-dry)',
                textShadow: bigSide === 'right'
                  ? (phase === 'ink'
                    ? '0 0 60px var(--color-primary), 0 0 120px rgba(139,90,43,0.3)'
                    : '1px 1px 2px rgba(139,90,43,0.12), 0 0 30px var(--color-primary)')
                  : '0 0 10px var(--color-primary)',
              }}
            >
              {bigSide === 'right'
                ? currentLine.slice(0, charCount)
                : nextLine}
              {bigSide === 'right' && charCount < currentLine.length && (
                <span className="inline-block w-[2px] h-[0.7em] bg-[var(--color-primary)]/40 animate-pulse" />
              )}
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slideFromLeft {
          0% { opacity: 0; transform: translateX(-80px); filter: blur(4px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        @keyframes slideFromRight {
          0% { opacity: 0; transform: translateX(80px); filter: blur(4px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        .dark p { text-shadow: 0 0 60px #D4B858, 0 0 120px rgba(212,184,88,0.25) !important; }
      `}</style>
    </>
  );
}
