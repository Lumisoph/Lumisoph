import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  musicId?: string;
  type?: number;
}

export default function MusicEmbed({ musicId, type = 0 }: Props) {
  const [playing, setPlaying] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('music-playing') === 'true'
  );
  const [expanded, setExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const iframeSrc = `https://music.163.com/outchain/player?type=${type}&id=${musicId}&auto=${playing ? 1 : 0}&height=66`;

  useEffect(() => {
    localStorage.setItem('music-playing', String(playing));
  }, [playing]);


  const startPlay = useCallback(() => {
    setPlaying(true);
    setExpanded(true);
  }, []);

  const stopPlay = useCallback(() => {
    setPlaying(false);
    setExpanded(false);
    if (iframeRef.current) {
      iframeRef.current.src = iframeSrc.replace('auto=1', 'auto=0');
    }
  }, [iframeSrc]);

  const toggleExpand = () => setExpanded(!expanded);

  if (!musicId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* 毛玻璃卡片 — 展开时显示 */}
      <div
        className={`
          overflow-hidden rounded-xl shadow-2xl
          bg-[var(--color-card)]/95 backdrop-blur-xl
          border border-[var(--color-card-border)]
          transition-all duration-500 ease-out origin-bottom-right
          ${expanded ? 'opacity-100 scale-100 max-h-40' : 'opacity-0 scale-95 max-h-0'}
        `}
      >
        <div className="flex items-center gap-4 p-3 pr-3">
          {/* 封面 */}
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/15 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>

          {/* 信息 */}
          <div className="min-w-0">
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">正在播放</p>
            <p className="text-xs font-medium text-[var(--color-text)] truncate">网易云音乐</p>
          </div>

          {/* 停止按钮 */}
          <button
            onClick={stopPlay}
            className="w-8 h-8 rounded-full flex items-center justify-center
                       text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10
                       transition-colors duration-300"
            aria-label="停止播放"
            title="停止播放"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 隐藏的 iframe — 始终存在以维持播放 */}
      <iframe
        ref={iframeRef}
        key={playing ? 'on' : 'off'}
        src={iframeSrc}
        width="280"
        height="66"
        frameBorder="0"
        allow="autoplay"
        title="网易云音乐"
        className="fixed opacity-0 pointer-events-none"
        style={{ left: '-9999px', top: '-9999px' }}
      ></iframe>

      {/* 悬浮按钮 */}
      <div className="relative">
        {/* 呼吸光环 */}
        <div
          className={`
            absolute inset-0 rounded-full bg-[var(--color-primary)]
            transition-all duration-700
            ${playing ? 'opacity-20 animate-ping' : 'opacity-0 scale-100'}
          `}
          style={{ animationDuration: playing ? '2s' : '0s' }}
        />
        <button
          onClick={playing ? toggleExpand : startPlay}
          className={`
            relative w-11 h-11 rounded-full flex items-center justify-center
            transition-all duration-500 ease-out shadow-lg
            ${playing
              ? 'bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/30'
              : 'bg-[var(--color-card)]/80 backdrop-blur-md text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:scale-110 hover:bg-[var(--color-card)]'
            }
          `}
          aria-label={playing ? (expanded ? '收起' : '展开控制') : '播放音乐'}
          title={playing ? (expanded ? '单击收起' : '单击展开控制面板') : '播放音乐'}
        >
          <svg
            className={`w-[18px] h-[18px] transition-transform duration-500 ${playing ? 'animate-pulse' : ''}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </button>
        {playing && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
        )}
      </div>
    </div>
  );
}
