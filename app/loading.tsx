// app/loading.tsx
// This is shown by Next.js during RSC/SSR page transitions
// We return a background that matches the app so there's no flash

export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]" />
  );
}