import { useState, useEffect, useCallback } from 'react';

const SIZES = [
  { key: 'md', label: 'A', size: '14px' },
  { key: 'lg', label: 'A', size: '16px' },
  { key: 'sm', label: 'A', size: '11px' },
] as const;

export default function FontSizeToggle() {
  const [idx, setIdx] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('font-size');
    return SIZES.findIndex((s) => s.key === saved);
  });

  const apply = useCallback((i: number) => {
    const { key } = SIZES[i];
    localStorage.setItem('font-size', key);
    document.documentElement.classList.remove('font-sm', 'font-lg');
    if (key !== 'md') document.documentElement.classList.add(`font-${key}`);
  }, []);

  useEffect(() => { apply(idx); }, [idx, apply]);

  const cycle = () => setIdx((i) => (i + 1) % SIZES.length);
  const current = SIZES[idx];

  return (
    <button
      onClick={cycle}
      className="w-9 h-9 rounded-full flex items-center justify-center
                 font-bold transition-colors duration-300
                 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]
                 hover:bg-[var(--color-card-border)]"
      aria-label={`字号：${current.key === 'md' ? '中' : current.key === 'lg' ? '大' : '小'}`}
      title={`字号：${current.key === 'md' ? '中' : current.key === 'lg' ? '大' : '小'}（点击切换）`}
      style={{ fontSize: current.size }}
    >
      {current.label}
    </button>
  );
}
