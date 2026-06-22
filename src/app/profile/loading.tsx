export default function ProfileLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-4 animate-pulse">
      {/* Identity card skeleton */}
      <div className="h-36 rounded-3xl bg-brand-purple/8" />
      {/* Tab bar skeleton */}
      <div className="h-10 rounded-full bg-brand-purple/8" />
      {/* Calendar skeleton */}
      <div className="h-64 rounded-3xl bg-brand-purple/8" />
    </div>
  );
}
