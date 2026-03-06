import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-primary/10 bg-surface py-8 px-5 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-primary/50">
        No data
      </p>
      <h3 className="mt-1.5 text-lg font-semibold text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-primary/70">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-surface focus-ring rounded"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
