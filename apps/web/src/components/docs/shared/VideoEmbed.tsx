import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import VideoEmbedPlaceholder from "@/components/docs/shared/VideoEmbedPlaceholder";

export default function VideoEmbed({id}: { id: string; }) {
  const src = `https://www.youtube-nocookie.com/embed/${id}`;
  return (
    <ClientLocaleProvider keys={['VideoEmbedPlaceholder']}>
      <VideoEmbedPlaceholder id={id}>
        <iframe className="video-embed" src={src}
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
        </iframe>
      </VideoEmbedPlaceholder>
    </ClientLocaleProvider>
  )
}