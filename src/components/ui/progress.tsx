import { cn } from "@/lib/utils";

interface ProgressProps {
  value?: number;
  className?: string;
  barClassName?: string;
}

export function Progress({ value = 0, className, barClassName }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
