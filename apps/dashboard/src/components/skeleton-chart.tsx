export function SkeletonChart() {
  return (
    <div className="h-64 w-full rounded-lg border border-primary/10 bg-primary/[0.02] p-4">
      <div className="mb-4 h-4 w-32 rounded bg-primary/10 animate-skeleton" />
      <div className="flex h-[calc(100%-2rem)] items-end justify-between gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-primary/10 animate-skeleton"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}
