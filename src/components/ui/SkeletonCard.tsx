export default function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-cream-200 bg-white">
      <div className="aspect-[3/4] bg-cream-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-cream-200" />
        <div className="h-3 w-1/2 rounded bg-cream-200" />
        <div className="h-3 w-1/3 rounded bg-cream-200" />
        <div className="flex justify-between pt-2">
          <div className="h-5 w-16 rounded bg-cream-200" />
          <div className="h-3 w-14 rounded bg-cream-200" />
        </div>
      </div>
    </div>
  );
}
