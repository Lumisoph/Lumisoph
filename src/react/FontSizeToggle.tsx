import { useState, useEffect } from 'react';

const SIZES = [
  { key: 'md', label: 'A', scale: 100 },
  { key: 'lg', label: 'A', scale: 118 },
  { key: 'sm', label: 'A', scale: 88 },
] as const;

export default function FontSizeToggle() {
  const [idx, setIdx] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('font-size');
    const found = SIZES.findIndex((s) => s.key === saved);
    return found >= 0 ? found : 0;
  });

  useEffect(() => {
    const { key, scale } = SIZES[idx];
    localStorage.setItem('font-size', key);
    document.documentElement.style.fontSize = `${scale}%`;
  }, [idx]);

  const cycle = () => setIdx((i) => (i + 1) % SIZES.length);
  const current = SIZES[idx];

  return (
    <button
      onClick={cycle}
      className="w-9 h-9 rounded-full flex items-center justify-center
                 text-sm font-bold transition-colors duration-300
                 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
                 hover:bg-[var(--color-card-border)]"
      aria-label={`字号：${current.key === 'md' ? '中' : current.key === 'lg' ? '大' : '小'}`}
      title={`字号：${current.key === 'md' ? '中' : current.key === 'lg' ? '大' : '小'}（点击切换）`}
      style={{ fontSize: current.key === 'sm' ? '11px' : current.key === 'lg' ? '15px' : '13px' }}
    >
      {current.label}
    </button>
  );
}
