export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );
}
