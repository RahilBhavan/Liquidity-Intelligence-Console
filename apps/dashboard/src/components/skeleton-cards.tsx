type SkeletonCardsProps = {
  count?: number;
};

export function SkeletonCards({ count = 3 }: SkeletonCardsProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-primary/10 bg-surface p-4"
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 rounded bg-primary/10 animate-skeleton" />
            <div className="h-4 w-16 rounded bg-primary/10 animate-skeleton" />
            <div className="h-4 w-20 rounded bg-primary/10 animate-skeleton" />
          </div>
          <div className="mt-3 h-4 w-full max-w-md rounded bg-primary/10 animate-skeleton" />
          <div className="mt-2 h-3 w-32 rounded bg-primary/10 animate-skeleton" />
        </div>
      ))}
    </div>
  );
}
