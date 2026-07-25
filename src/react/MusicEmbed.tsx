import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  audioSrc?: string;
  coverSrc?: string;
  title?: string;
  artist?: string;
}

export default function MusicEmbed({ audioSrc, coverSrc, title, artist }: Props) {
  const [playing, setPlaying] = useState(() =>
    typeof window !== 'undefined' && sessionStorage.getItem('music-playing') === 'true'
  );
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 跨页面恢复播放 + 获取时长
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 读取已缓存的时长
    if (audio.duration && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }
    // 若尚未加载 metadata，监听一次
    const onMeta = () => setDuration(audio.duration);
    audio.addEventListener('loadedmetadata', onMeta, { once: true });

    const saved = sessionStorage.getItem('music-time');
    if (saved) audio.currentTime = parseFloat(saved);

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }

    const saveTime = () => {
      sessionStorage.setItem('music-time', String(audio.currentTime));
      sessionStorage.setItem('music-playing', String(playing));
    };
    window.addEventListener('beforeunload', saveTime);
    return () => {
      window.removeEventListener('beforeunload', saveTime);
      audio.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem('music-playing', String(playing));
  }, [playing]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setExpanded(false);
    sessionStorage.setItem('music-time', '0');
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!audioSrc) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setCurrentTime(t);
          window.dispatchEvent(new CustomEvent('music-tick', { detail: t }));
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={stop}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* 音乐卡片 */}
        <div
          className={`
            overflow-hidden rounded-2xl shadow-2xl w-72
            bg-[var(--color-card)]/95 backdrop-blur-xl
            border border-[var(--color-card-border)]
            transition-all duration-500 ease-out origin-bottom-right
            ${expanded ? 'opacity-100 scale-100 max-h-80' : 'opacity-0 scale-95 max-h-0'}
          `}
        >
          <div className="p-4">
            {/* 封面 + 信息 */}
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-card-border)] shadow-md">
                {coverSrc ? (
                  <img src={coverSrc} alt={title ?? ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <p className="text-sm font-semibold text-[var(--color-text)] truncate">{title ?? '未知歌曲'}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{artist ?? '未知歌手'}</p>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-3">
              <div
                className="h-1 rounded-full bg-[var(--color-card-border)] cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  if (audioRef.current) audioRef.current.currentTime = pct * duration;
                }}
              >
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[var(--color-text-muted)]">{fmt(currentTime)}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">{duration > 0 ? fmt(duration) : '--:--'}</span>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center gap-4">
              {/* 停止 */}
              <button
                onClick={stop}
                className="w-8 h-8 rounded-full flex items-center justify-center
                           text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-400/10
                           transition-colors duration-300"
                aria-label="停止"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h12v12H6z" />
                </svg>
              </button>

              {/* 播放/暂停 */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full flex items-center justify-center
                           bg-[var(--color-primary)] text-white shadow-lg
                           hover:shadow-xl hover:scale-105 active:scale-95
                           transition-all duration-300"
                aria-label={playing ? '暂停' : '播放'}
              >
                {playing ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 悬浮按钮 */}
        <div className="relative">
          <div
            className={`
              absolute inset-0 rounded-full bg-[var(--color-primary)]
              transition-all duration-700
              ${playing ? 'opacity-20 animate-ping' : 'opacity-0'}
            `}
            style={{ animationDuration: playing ? '2s' : '0s' }}
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className={`
              relative w-11 h-11 rounded-full flex items-center justify-center
              transition-all duration-500 ease-out shadow-lg
              ${playing
                ? 'bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/30'
                : 'bg-[var(--color-card)]/80 backdrop-blur-md text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:scale-110'
              }
            `}
            aria-label="音乐控制"
            title="音乐控制"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </button>
          {playing && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
          )}
        </div>
      </div>
    </>
  );
}
