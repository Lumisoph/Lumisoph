interface Props {
  currentPath: string;
  currentLang: string;
}

export default function LangToggle({ currentPath, currentLang }: Props) {
  const targetLang = currentLang === 'zh' ? 'en' : 'zh';
  const targetPath = currentPath.replace(/^\/(zh|en)/, `/${targetLang}`);

  return (
    <a
      href={targetPath}
      className="px-3 py-1.5 rounded-btn text-sm font-medium transition-colors duration-300
                 border border-[var(--color-card-border)] hover:bg-[var(--color-card-border)]"
    >
      {targetLang === 'zh' ? '中文' : 'EN'}
    </a>
  );
}
