import { useState, useEffect } from 'react';

interface Props {
  musicId?: string;
  /** 0=歌单, 1=专辑, 2=单曲 */
  type?: number;
}

export default function MusicEmbed({ musicId, type = 0 }: Props) {
  const [show, setShow] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('music-open') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('music-open', String(show));
  }, [show]);

  if (!musicId) return null;

  return (
    <div className="flex items-center">
      <button
        onClick={() => setShow(!show)}
        className={`p-2 rounded-btn transition-all duration-300 ${
          show
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
        }`}
        aria-label={show ? '关闭音乐' : '打开音乐'}
        title={show ? '关闭音乐' : '打开音乐'}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </button>

      {show && (
        <div id="music-player-drop" className="absolute top-16 right-20 z-50 rounded-card overflow-hidden shadow-xl">
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
    </div>
  );
}
