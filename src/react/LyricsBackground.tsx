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

/** 宣纸纹理背景 */
function RicePaper() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1,
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(139,119,90,0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(139,119,90,0.04) 0%, transparent 50%),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,119,90,0.015) 2px, rgba(139,119,90,0.015) 4px)
        `,
      }}
      aria-hidden="true"
    />
  );
}

export default function LyricsBackground({ lrcPath }: Props) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [lineIndex, setLineIndex] = useState(-1);
  const [charCount, setCharCount] = useState(0);
  const prevIndex = useRef(-1);

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

  return (
    <>
      <RicePaper />

      {/* 左右双栏歌词 */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: -1 }}>
        <div className="h-full max-w-6xl mx-auto flex items-center justify-center gap-16 md:gap-24 px-8">
          {/* 左栏 — 当前句 */}
          <div className="flex-1 text-right">
            <div className="inline-block max-w-xs">
              <p className="text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]/30 mb-2 font-sans">
                當 前
              </p>
              <p
                className="text-2xl md:text-4xl font-bold leading-relaxed tracking-[0.15em]"
                style={{
                  fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'SimSun', serif",
                  color: 'var(--color-text)',
                  opacity: 0.18,
                  textShadow: `
                    1px 1px 0 rgba(139,119,90,0.1),
                    0 0 40px var(--color-primary),
                    0 0 80px var(--color-primary)
                  `,
                }}
              >
                {currentLine.slice(0, charCount).split('').map((ch, i) => (
                  <span key={i} className="inline-block animate-[charIn_0.5s_ease-out]">{ch}</span>
                ))}
                {charCount < currentLine.length && (
                  <span className="inline-block w-[2px] h-[0.7em] bg-[var(--color-primary)]/30 align-middle animate-pulse" />
                )}
              </p>
            </div>
          </div>

          {/* 竖线分隔 */}
          <div
            className="hidden md:block w-px h-32 self-center"
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--color-primary), transparent)',
              opacity: 0.15,
            }}
          />

          {/* 右栏 — 下一句 */}
          <div className="flex-1 text-left">
            {nextLine && (
              <div className="inline-block max-w-xs">
                <p className="text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]/30 mb-2 font-sans">
                  即 將
                </p>
                <p
                  className="text-lg md:text-2xl font-normal leading-relaxed tracking-[0.12em]"
                  style={{
                    fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'SimSun', serif",
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
      </div>

      <style>{`
        @keyframes charIn {
          0% { opacity: 0; transform: translateY(6px) scale(0.9); filter: blur(3px); }
          60% { opacity: 0.7; filter: blur(1px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .dark p {
          text-shadow: 1px 1px 0 rgba(200,180,140,0.1), 0 0 40px #E9C46A, 0 0 80px #E9C46A !important;
        }
      `}</style>
    </>
  );
}
