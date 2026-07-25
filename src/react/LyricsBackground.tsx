import { useEffect, useState, useRef } from 'react';

interface LyricLine {
  time: number;
  text: string;
}

interface Props {
  lrcPath: string;
}

function parseLRC(raw: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('{')) continue;
    const match = trimmed.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (!match) continue;
    const min = parseInt(match[1]);
    const sec = parseInt(match[2]);
    const ms = parseInt(match[3]) / (match[3].length === 3 ? 1000 : 100);
    const text = match[4].trim();
    if ((text.startsWith('（') && text.endsWith('）')) || (text.startsWith('(') && text.endsWith(')'))) continue;
    if (!text) continue;
    lines.push({ time: min * 60 + sec + ms, text });
  }
  return lines;
}

/** 墨滴粒子 */
function InkDrops() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const drops: { x: number; y: number; r: number; alpha: number; vy: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 缓慢生成墨滴
    const spawn = () => {
      if (drops.length < 5) {
        drops.push({
          x: Math.random() * canvas.width,
          y: -10,
          r: Math.random() * 3 + 1,
          alpha: Math.random() * 0.15 + 0.05,
          vy: Math.random() * 0.3 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of drops) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        const isDark = document.documentElement.classList.contains('dark');
        ctx.fillStyle = isDark ? `rgba(233,196,106,${d.alpha})` : `rgba(80,60,40,${d.alpha})`;
        ctx.fill();
        d.y += d.vy;
        if (d.y > canvas.height + 10) {
          drops.splice(drops.indexOf(d), 1);
        }
      }
      if (Math.random() < 0.03) spawn();
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
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
    fetch(lrcPath)
      .then((r) => r.text())
      .then((raw) => setLyrics(parseLRC(raw)))
      .catch(() => {});
  }, [lrcPath]);

  useEffect(() => {
    if (lyrics.length === 0) return;

    const onTick = (e: Event) => {
      const t = (e as CustomEvent).detail as number;
      let i = -1;
      for (let j = 0; j < lyrics.length; j++) {
        if (lyrics[j].time <= t) i = j;
        else break;
      }
      setLineIndex(i);
    };

    window.addEventListener('music-tick', onTick);
    return () => window.removeEventListener('music-tick', onTick);
  }, [lyrics]);

  // 行切换时逐字动画
  useEffect(() => {
    if (lineIndex !== prevIndex.current) {
      prevIndex.current = lineIndex;
      setCharCount(0);
      const text = lyrics[lineIndex]?.text ?? '';
      if (!text) return;
      const interval = Math.max(80, 1200 / text.length); // 每字间隔，至少 80ms
      let c = 0;
      const timer = setInterval(() => {
        c++;
        setCharCount(c);
        if (c >= text.length) clearInterval(timer);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [lineIndex]);

  const text = lyrics[lineIndex]?.text ?? '';
  const visibleChars = text.slice(0, charCount);

  return (
    <>
      <InkDrops />

      {/* 歌词文字 */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ zIndex: -1 }}
      >
        {text && (
          <div className="px-10 text-center max-w-2xl">
            <p
              className="text-3xl md:text-5xl font-bold tracking-[0.2em] leading-relaxed"
              style={{
                color: 'var(--color-text)',
                opacity: 0.15,
                textShadow: `
                  0 0 20px var(--color-primary),
                  0 0 60px var(--color-primary),
                  0 0 100px var(--color-primary)
                `,
              }}
            >
              {/* 逐字渲染：已出现的字 + 最后字的下划线笔触 */}
              {visibleChars.split('').map((ch, i) => (
                <span
                  key={i}
                  className="inline-block animate-[charIn_0.4s_ease-out]"
                  style={{ animationDelay: '0s' }}
                >
                  {ch}
                </span>
              ))}
              {/* 笔触光标 */}
              {charCount < text.length && (
                <span className="inline-block w-[2px] h-[0.8em] bg-[var(--color-primary)]/40 align-middle animate-pulse" />
              )}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes charIn {
          0% { opacity: 0; transform: translateY(4px); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </>
  );
}
