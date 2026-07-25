interface Props {
  /** 网易云音乐 ID — 从分享链接提取，例如 music.163.com/#/playlist?id=123456789 → ID = 123456789 */
  musicId?: string;
  /** 0=歌单, 1=专辑, 2=单曲 */
  type?: number;
}

export default function MusicEmbed({ musicId, type = 0 }: Props) {
  if (!musicId) return null;

  return (
    <div className="w-full max-w-sm mx-auto rounded-card overflow-hidden">
      <iframe
        src={`https://music.163.com/outchain/player?type=${type}&id=${musicId}&auto=0&height=152`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay"
        loading="lazy"
        title="网易云音乐播放器"
        className="rounded-card"
      ></iframe>
    </div>
  );
}
