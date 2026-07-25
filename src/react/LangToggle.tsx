interface Props {
  href: string;
  label: string;
}

export default function LangToggle({ href, label }: Props) {

  return (
    <a
      href={href}
      className="px-3 py-1.5 rounded-btn text-sm font-medium transition-colors duration-300
                 border border-[var(--color-card-border)] hover:bg-[var(--color-card-border)]"
    >
      {label}
    </a>
  );
}
