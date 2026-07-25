import { useState, useEffect } from 'react';

interface Props {
  musicId?: string;
  type?: number;
}

export default function MusicEmbed({ musicId, type = 0 }: Props) {
  const [show, setShow] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('music-open') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('music-open', String(show));
  }, [show]);

  if (!musicId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* 播放条 */}
      {show && (
        <div className="rounded-card overflow-hidden shadow-xl bg-[var(--color-card)] border border-[var(--color-card-border)]
                        transition-all duration-300 animate-in slide-in-from-bottom-2">
          <iframe
            src={`https://music.163.com/outchain/player?type=${type}&id=${musicId}&auto=0&height=66`}
            width="280"
            height="66"
            frameBorder="0"
            allow="autoplay"
            title="网易云音乐"
          ></iframe>
        </div>
      )}

      {/* 音符按钮 */}
      <button
        onClick={() => setShow(!show)}
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md
                    transition-all duration-300 backdrop-blur-sm
                    ${show
                      ? 'bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/30'
                      : 'bg-[var(--color-card)]/80 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:scale-110'
                    }`}
        aria-label={show ? '关闭音乐' : '打开音乐'}
        title={show ? '关闭音乐' : '打开音乐'}
      >
        <svg className={`w-4 h-4 ${show ? 'animate-pulse' : ''}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </button>
    </div>
  );
}
