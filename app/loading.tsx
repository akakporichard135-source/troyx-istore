export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/10 border-t-brand-blue" aria-label="Loading" />
    </div>
  );
}
