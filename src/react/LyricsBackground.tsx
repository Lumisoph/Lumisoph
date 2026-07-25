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
      radial-gradient(ellipse at 20% 50%, rgba(139,119,90,0.04) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 50%, rgba(139,119,90,0.04) 0%, transparent 50%),
      repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,119,90,0.015) 2px, rgba(139,119,90,0.015) 4px)
    `}} aria-hidden="true" />
  );
}

export default function LyricsBackground({ lrcPath }: Props) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [lineIndex, setLineIndex] = useState(-1);
  const [charCount, setCharCount] = useState(0);
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

  // 逐字动画
  useEffect(() => {
    if (lineIndex !== prevIndex.current) {
      prevIndex.current = lineIndex;
      keyRef.current++;
      setCharCount(0);
      const text = lyrics[lineIndex]?.text ?? '';
      if (!text) return;
      const interval = Math.max(150, 3600 / text.length);
      let c = 0;
      const timer = setInterval(() => { c++; setCharCount(c); if (c >= text.length) clearInterval(timer); }, interval);
      return () => clearInterval(timer);
    }
  }, [lineIndex]);

  const currentLine = lyrics[lineIndex]?.text ?? '';
  const nextLine = lyrics[lineIndex + 1]?.text ?? '';

  if (lineIndex < 0) return <RicePaper />;

  const lineStyle: React.CSSProperties = {
    fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'SimSun', serif",
    writingMode: 'vertical-rl',
    textOrientation: 'upright',
  };

  return (
    <>
      <RicePaper />

      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="h-full flex items-center justify-center gap-[30px] md:gap-[60px] px-8">

          {/* 左联 — 当前句，从左侧滑入 */}
          <div key={`L-${keyRef.current}`} className="animate-[slideFromLeft_0.8s_ease-out]">
            <p
              className="text-2xl md:text-4xl font-bold tracking-[0.25em] leading-loose"
              style={{
                ...lineStyle,
                color: 'var(--color-text)',
                opacity: 0.18,
                textShadow: '1px 1px 0 rgba(139,119,90,0.1), 0 0 40px var(--color-primary), 0 0 80px var(--color-primary)',
              }}
            >
              {currentLine.slice(0, charCount)}
              {charCount < currentLine.length && (
                <span className="inline-block w-[2px] h-[0.7em] bg-[var(--color-primary)]/30 animate-pulse" />
              )}
            </p>
          </div>

          {/* 中线分隔 */}
          <div className="w-px h-40 md:h-60 self-center"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--color-primary), transparent)', opacity: 0.15 }}
          />

          {/* 右联 — 下一句，从右侧滑入 */}
          {nextLine && (
            <div key={`R-${keyRef.current}`} className="animate-[slideFromRight_0.8s_ease-out]">
              <p
                className="text-lg md:text-2xl font-normal tracking-[0.2em] leading-loose"
                style={{
                  ...lineStyle,
                  color: 'var(--color-text)',
                  opacity: 0.08,
                  textShadow: '0 0 20px var(--color-primary)',
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
          0% { opacity: 0; transform: translateX(-120px); filter: blur(4px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        @keyframes slideFromRight {
          0% { opacity: 0; transform: translateX(120px); filter: blur(4px); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
      `}</style>
    </>
  );
}
