export default function BlogLoading() {
  return (
    <div className="aee-blog" aria-busy="true" aria-label="Loading blog">
      <section className="aee-blog-hero">
        <div className="aee-blog-hero-inner">
          <div className="mx-auto h-3 w-20 animate-pulse rounded-full bg-[var(--color-border)]" />
          <div className="mx-auto mt-5 h-12 w-[min(100%,28rem)] animate-pulse rounded-2xl bg-[var(--color-border)]" />
          <div className="mx-auto mt-4 h-16 w-[min(100%,34rem)] animate-pulse rounded-xl bg-[var(--color-border)]/70" />
        </div>
      </section>
      <div className="aee-blog-body">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[16/10] animate-pulse rounded-[1.75rem] bg-[var(--color-border)]" />
          <div className="space-y-3">
            <div className="h-3 w-40 animate-pulse rounded bg-[var(--color-border)]" />
            <div className="h-10 w-[80%] animate-pulse rounded-xl bg-[var(--color-border)]" />
            <div className="h-20 w-full animate-pulse rounded-xl bg-[var(--color-border)]/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
