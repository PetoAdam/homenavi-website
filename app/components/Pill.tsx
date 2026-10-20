export function Pill({ variant = "neutral", label }: { variant?: "neutral" | "success" | "warning" | "danger" | "primary"; label: string }) {
  const cls = variant === "neutral" ? "pill" : `pill ${variant}`;
  return <span className={cls}>{label}</span>;
}
