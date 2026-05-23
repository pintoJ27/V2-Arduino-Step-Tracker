"use client";

import { Card, CardHeader, CardContent, CardLabel } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BatteryIndicatorProps {
  battery: number;
}

export default function BatteryIndicator({ battery }: BatteryIndicatorProps) {
  const level = Math.max(0, Math.min(100, battery));

  const { textColor, barColor, statusLabel } =
    level > 50
      ? { textColor: "text-emerald-400", barColor: "bg-emerald-500", statusLabel: "Good" }
      : level > 20
        ? { textColor: "text-amber-400", barColor: "bg-amber-500", statusLabel: "Low" }
        : { textColor: "text-red-400", barColor: "bg-red-500", statusLabel: "Critical" };

  return (
    <Card>
      <CardHeader>
        <CardLabel>Battery</CardLabel>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-3">
          <span className={`text-3xl font-bold tabular-nums leading-none ${textColor}`}>
            {level}
            <span className="text-lg font-semibold">%</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium pb-0.5">{statusLabel}</span>
        </div>
        <Progress value={level} barClassName={barColor} />
      </CardContent>
    </Card>
  );
}
