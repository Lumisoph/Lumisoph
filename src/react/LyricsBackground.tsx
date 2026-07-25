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

/** 宣纸纹理 */
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
  const prevIndex = useRef(-1);
  const keyRef = useRef(0);

  useEffect(() => {
    fetch(lrcPath).then(r => r.text()).then(raw => setLyrics(parseLRC(raw))).catch(() => {});
  }, [lrcPath]);

  useEffect(() => {
    if (lyrics.length === 0) return;
    const onTick = (e: Event) => {
      const t = (e as CustomEvent).detail as number;
      let i = -1;
      for (let j = 0; j < lyrics.length; j++) {
        if (lyrics[j].time <= t) i = j; else break;
      }
      setLineIndex(i);
    };
    window.addEventListener('music-tick', onTick);
    return () => window.removeEventListener('music-tick', onTick);
  }, [lyrics]);

  // 逐字浮现 + 水墨晕染
  useEffect(() => {
    if (lineIndex !== prevIndex.current) {
      prevIndex.current = lineIndex;
      keyRef.current++;
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
          // 全部字显现后，等一小段时间再"墨干"
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

  return (
    <>
      {/* 水墨晕染 SVG 滤镜 */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="ink-wash" x="-20%" y="-20%" width="140%" height="140%">
            {/* 基础噪波 — 模拟宣纸纹理 */}
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            {/* 高斯模糊 — 墨迹湿润感 */}
            <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred" />
            {/* 混合 — 保留原文字尖锐度，边缘晕染 */}
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* 墨干后的轻微纹理 */}
          <filter id="ink-dry" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <RicePaper />

      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="h-full max-w-5xl mx-auto flex items-center justify-between px-8">

          {/* 左联 — 当前句 */}
          <div key={`L-${keyRef.current}`} className="animate-[slideFromLeft_0.8s_ease-out]">
            <p
              className="text-2xl md:text-4xl font-black tracking-[0.3em] leading-loose transition-all duration-700"
              style={{
                ...lineStyle,
                color: 'var(--color-text)',
                opacity: phase === 'ink' ? 0.14 : 0.2,
                filter: phase === 'ink' ? 'url(#ink-wash)' : 'url(#ink-dry)',
                textShadow: phase === 'ink'
                  ? '0 0 60px var(--color-primary), 0 0 120px rgba(139,90,43,0.3), 2px 2px 4px rgba(100,60,20,0.15)'
                  : '1px 1px 2px rgba(139,90,43,0.12), 0 0 30px var(--color-primary)',
              }}
            >
              {currentLine.slice(0, charCount)}
              {charCount < currentLine.length && (
                <span className="inline-block w-[2px] h-[0.7em] bg-[var(--color-primary)]/40 animate-pulse" />
              )}
            </p>
          </div>

          {/* 右联 — 下一句 */}
          {nextLine && (
            <div key={`R-${keyRef.current}`} className="animate-[slideFromRight_0.8s_ease-out]">
              <p
                className="text-lg md:text-2xl font-normal tracking-[0.2em] leading-loose"
                style={{
                  ...lineStyle,
                  color: 'var(--color-text)',
                  opacity: 0.07,
                  filter: 'url(#ink-dry)',
                  textShadow: '0 0 16px var(--color-primary)',
                }}
              >
                {nextLine}
              </p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes slideFromLeft {
          0% { opacity: 0; transform: translateX(-100px); filter: blur(6px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        @keyframes slideFromRight {
          0% { opacity: 0; transform: translateX(100px); filter: blur(6px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        .dark p { text-shadow: 0 0 60px #D4B858, 0 0 120px rgba(212,184,88,0.25) !important; }
      `}</style>
    </>
  );
}
