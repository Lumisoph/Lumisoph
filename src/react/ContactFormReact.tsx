import { useState, type FormEvent } from 'react';

interface Labels {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
}

interface Props {
  endpoint: string;
  labels: Labels;
}

export default function ContactFormReact({ endpoint, labels }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        throw new Error(await res.text());
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {status === 'success' ? (
        <div className="text-center py-12 rounded-card bg-[var(--color-card)] border border-[var(--color-card-border)]">
          <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-[var(--color-text)]">{labels.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text)] mb-1">
              {labels.name}
            </label>
            <input
              id="name" type="text" name="name" required
              placeholder={labels.namePlaceholder}
              className="w-full px-4 py-2.5 rounded-btn bg-[var(--color-card)] border border-[var(--color-card-border)]
                     text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                     transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text)] mb-1">
              {labels.email}
            </label>
            <input
              id="email" type="email" name="email" required
              placeholder={labels.emailPlaceholder}
              className="w-full px-4 py-2.5 rounded-btn bg-[var(--color-card)] border border-[var(--color-card-border)]
                     text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                     transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[var(--color-text)] mb-1">
              {labels.message}
            </label>
            <textarea
              id="message" name="message" rows={5} required
              placeholder={labels.messagePlaceholder}
              className="w-full px-4 py-2.5 rounded-btn bg-[var(--color-card)] border border-[var(--color-card-border)]
                     text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                     transition-all duration-300 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 px-6 bg-[var(--color-primary)] text-white font-medium rounded-btn
                   hover:opacity-90 hover:shadow-lg transition-all duration-300
                   disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? labels.sending : labels.send}
          </button>

          {status === 'error' && (
            <p className="text-sm text-red-500 text-center">{labels.error}</p>
          )}
        </form>
      )}
    </div>
  );
}
