import { useState } from 'react';

interface Photo {
  src: string;
  alt: string;
}

interface Props {
  photos: Photo[];
}

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
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

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-card overflow-hidden cursor-pointer
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

      {activePhoto && (
        <Lightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />
      )}
    </>
  );
}
