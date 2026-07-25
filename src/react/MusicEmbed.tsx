import { useState, useEffect, useRef } from 'react';

interface Props {
  musicId?: string;
  type?: number;
}

export default function MusicEmbed({ musicId, type = 0 }: Props) {
  // playing: 是否在播放中（按钮状态）
  const [playing, setPlaying] = useState(false);
  // expanded: 卡片是否展开
  const [expanded, setExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('music-playing');
    if (saved === 'true') setPlaying(true);
  }, []);

  const togglePlay = () => {
    const next = !playing;
    setPlaying(next);
    localStorage.setItem('music-playing', String(next));
    // 控制 iframe 的播放 — 通过重新设置 src 带上 autoplay 参数
    if (iframeRef.current && next) {
      const iframe = iframeRef.current;
      const src = iframe.src;
      if (!src.includes('auto=1')) {
        iframe.src = src.replace('auto=0', 'auto=1');
      }
    }
    if (!next) {
      setExpanded(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (!musicId) return null;

  return (
    <>
      {/* iframe 始终存在 — 用 opacity 隐藏但保持在 DOM 中以维持播放 */}
      <iframe
        ref={iframeRef}
        src={`https://music.163.com/outchain/player?type=${type}&id=${musicId}&auto=${playing ? 1 : 0}&height=66`}
        width="1"
        height="1"
        frameBorder="0"
        allow="autoplay"
        title=""
        className="fixed opacity-0 pointer-events-none"
        style={{ left: '-9999px', top: '-9999px' }}
      ></iframe>

      {/* 悬浮控制器 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* 卡片 — 只在 playing 且 expanded 时显示 */}
        <div
          className={`
            overflow-hidden rounded-xl shadow-2xl
            bg-[var(--color-card)]/95 backdrop-blur-xl
            border border-[var(--color-card-border)]
            transition-all duration-500 ease-out
            ${playing && expanded ? 'opacity-100 scale-100 translate-y-0 max-h-40' : 'opacity-0 scale-95 translate-y-4 max-h-0'}
          `}
        >
          <div className="p-3 pr-12">
            <div className="flex items-center gap-3">
              {/* 专辑封面占位 — 音符 */}
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">正在播放</p>
                <p className="text-sm font-medium text-[var(--color-text)] truncate">网易云音乐</p>
              </div>
            </div>
          </div>
        </div>

        {/* 圆形按钮 — 呼吸光环 */}
        <div className="relative">
          {/* 呼吸光环 */}
          <div
            className={`
              absolute inset-0 rounded-full
              transition-all duration-700
              ${playing ? 'scale-150 opacity-20 bg-[var(--color-primary)] animate-ping' : 'scale-100 opacity-0'}
            `}
            style={{ animationDuration: playing ? '2s' : '0s' }}
          />
          {/* 按钮本体 */}
          <button
            onClick={playing ? toggleExpand : togglePlay}
            onDoubleClick={() => playing && togglePlay()}
            className={`
              relative w-11 h-11 rounded-full flex items-center justify-center
              transition-all duration-500 ease-out
              shadow-lg hover:shadow-xl
              ${playing
                ? 'bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/25 hover:scale-105'
                : 'bg-[var(--color-card)]/80 backdrop-blur-md text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:scale-110 hover:bg-[var(--color-card)]'
              }
            `}
            aria-label={playing ? (expanded ? '收起' : '展开') : '播放音乐'}
            title={playing ? (expanded ? '双击暂停 · 单击收起' : '单击展开 · 双击暂停') : '播放音乐'}
          >
            {/* 音符图标 */}
            <svg
              className={`w-[18px] h-[18px] transition-transform duration-500 ${playing ? 'animate-pulse' : ''}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </button>
          {/* 暂停指示 — 极小横条 */}
          {playing && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
          )}
        </div>
      </div>
    </>
  );
}
