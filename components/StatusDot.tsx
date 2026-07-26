export function StatusDot({ label = "operational" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="status-dot" />
      <span className="label-mono">{label}</span>
    </span>
  );
}
