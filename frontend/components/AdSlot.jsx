export default function AdSlot({ label = "Advertisement", className = "" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/50 text-xs text-slate-500 ${className}`}
      style={{ minHeight: 90 }}
    >
      {label}
      {/* <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-XXXXXXX" data-ad-slot="XXXXXXX" data-ad-format="auto" /> */}
    </div>
  );
}
