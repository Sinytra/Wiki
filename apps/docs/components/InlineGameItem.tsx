export default function InlineGameItem({id, size = 28}: { id: string; size?: number }) {
  const root = process.env.BUILTIN_ASSET_SOURCES;
  if (!root) {
    return null;
  }
  const src = new URL(`/.assets/minecraft/item/${id}.png`, root);

  return (
    <img
      width={size} height={size}
      src={src.toString()}
      className="inline mr-1 toc-hidden"
      alt={id}
    />
  );
}