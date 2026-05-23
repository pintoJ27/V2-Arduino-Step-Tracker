"use client";

import { Card, CardHeader, CardContent, CardLabel } from "@/components/ui/card";

interface PaceCardProps {
  pace: string;
  status: string;
}

const PACE_CONFIG: Record<string, { label: string; color: string; dotColor: string }> = {
  STATIONARY: {
    label: "Stationary",
    color: "text-slate-400",
    dotColor: "bg-slate-600",
  },
  WALKING: {
    label: "Walking",
    color: "text-blue-400",
    dotColor: "bg-blue-500",
  },
  RUNNING: {
    label: "Running",
    color: "text-violet-400",
    dotColor: "bg-violet-500",
  },
};

export default function PaceCard({ pace, status }: PaceCardProps) {
  const config = PACE_CONFIG[pace] ?? {
    label: pace || "—",
    color: "text-slate-500",
    dotColor: "bg-slate-700",
  };
  const isActive = status === "ACTIVE";

  return (
    <Card>
      <CardHeader>
        <CardLabel>Pace</CardLabel>
      </CardHeader>
      <CardContent>
        <p className={`text-xl font-bold tracking-tight ${config.color}`}>
          {config.label}
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : config.dotColor}`}
          />
          <span className="text-[11px] text-slate-500 font-medium">
            {isActive ? "Active" : "Idle"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
