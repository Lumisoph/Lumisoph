interface Props {
  albumId?: string;
  type?: 'album' | 'playlist';
}

export default function SpotifyEmbed({ albumId, type = 'album' }: Props) {
  if (!albumId) return null;

  return (
    <div className="w-full max-w-sm mx-auto rounded-card overflow-hidden">
      <iframe
        src={`https://open.spotify.com/embed/${type}/${albumId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify 播放器"
        className="rounded-card"
      ></iframe>
    </div>
  );
}
