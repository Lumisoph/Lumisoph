import { useState, useEffect } from 'react';

interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface Props {
  photos: Photo[];
}

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                   rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="关闭"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        src={photo.src}
        alt={photo.alt}
        className="max-w-full max-h-[90vh] object-contain rounded-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function PhotoWallMasonry({ photos }: Props) {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      setColumns(window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const columnPhotos: Photo[][] = Array.from({ length: columns }, () => []);
  const columnHeights = Array(columns).fill(0);

  for (const photo of photos) {
    const shortest = columnHeights.indexOf(Math.min(...columnHeights));
    columnPhotos[shortest].push(photo);
    columnHeights[shortest] += photo.height / photo.width;
  }

  return (
    <>
      <div className="flex gap-4">
        {columnPhotos.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map((photo, pi) => (
              <div
                key={pi}
                className="rounded-card overflow-hidden cursor-pointer
                           hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                onClick={() => setActivePhoto(photo)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {activePhoto && (
        <Lightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />
      )}
    </>
  );
}
