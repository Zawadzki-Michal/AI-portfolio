export function StatusDot({
  label = "operational",
  labelClassName = "",
}: {
  label?: string;
  labelClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="status-dot" />
      <span className={`label-mono ${labelClassName}`}>{label}</span>
    </span>
  );
}
