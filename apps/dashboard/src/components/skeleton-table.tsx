type SkeletonTableProps = {
  rows?: number;
  cols?: number;
};

const colClasses: Record<number, string> = {
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
};

export function SkeletonTable({ rows = 5, cols = 6 }: SkeletonTableProps) {
  const gridClass = colClasses[cols] ?? "grid-cols-6";
  return (
    <div className="w-full overflow-hidden rounded-lg border border-primary/10">
      <div className={`bg-primary/5 grid ${gridClass} gap-4 px-4 py-3 text-sm font-medium text-primary`}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 w-20 rounded bg-primary/10 animate-skeleton" />
        ))}
      </div>
      <div className="divide-y divide-primary/10">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className={`grid ${gridClass} gap-4 px-4 py-3`}
          >
            {Array.from({ length: cols }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-4 rounded bg-primary/10 animate-skeleton"
                style={{ width: colIdx === 0 ? "60%" : "40%" }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
