import { useState } from 'react';

interface Props {
  musicId?: string;
  /** 0=歌单, 1=专辑, 2=单曲 */
  type?: number;
}

export default function MusicEmbed({ musicId, type = 0 }: Props) {
  const [show, setShow] = useState(false);

  if (!musicId) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 px-4 py-2 rounded-btn text-sm font-medium
                   border border-[var(--color-card-border)] text-[var(--color-text-muted)]
                   hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]
                   transition-all duration-300"
        aria-label={show ? '关闭音乐' : '播放音乐'}
      >
        {show ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            关闭音乐
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            播放音乐
          </>
        )}
      </button>

      {show && (
        <iframe
          src={`https://music.163.com/outchain/player?type=${type}&id=${musicId}&auto=0&height=66`}
          width="100%"
          height="66"
          frameBorder="0"
          allow="autoplay"
          loading="lazy"
          title="网易云音乐播放器"
          className="w-full max-w-sm rounded-card"
        ></iframe>
      )}
    </div>
  );
}
