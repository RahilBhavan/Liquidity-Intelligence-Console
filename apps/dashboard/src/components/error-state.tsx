import Link from "next/link";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again or go back.",
  onRetry,
  backHref = "/markets",
  backLabel = "Back to markets",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-primary/10 bg-surface py-8 px-5 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-primary/50">
        Error
      </p>
      <h3 className="mt-1.5 text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-primary/70">{message}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-surface focus-ring rounded"
          >
            Try again
          </button>
        )}
        <Link
          href={backHref}
          className="inline-flex items-center text-sm font-medium text-primary/70 underline underline-offset-2 hover:text-primary focus-ring rounded px-2 py-1"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
