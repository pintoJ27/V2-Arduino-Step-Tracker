"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StepRingProps {
  steps: number;
  goal: number;
}

export default function StepRing({ steps, goal }: StepRingProps) {
  const radius = 96;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(steps / goal, 1);
  const offset = circumference * (1 - progress);
  const percentage = Math.round(progress * 100);

  const isComplete = progress >= 1;
  const strokeColor = isComplete ? "#f59e0b" : "#6366f1";
  const glowColor = isComplete
    ? "rgba(245,158,11,0.35)"
    : "rgba(99,102,241,0.35)";
  const badgeVariant = isComplete ? "warning" : progress >= 0.5 ? "default" : "muted";

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Ring */}
      <div className="relative flex items-center justify-center">
        <svg
          width="224"
          height="224"
          viewBox="0 0 224 224"
          style={{ filter: `drop-shadow(0 0 14px ${glowColor})` }}
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isComplete ? "#f59e0b" : "#818cf8"} />
              <stop offset="100%" stopColor={isComplete ? "#f97316" : "#6366f1"} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            fill="none"
            stroke="#1a1a2e"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 112 112)"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[42px] font-bold tracking-tight leading-none text-white tabular-nums">
            {steps.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 mt-2 font-medium">
            of {goal.toLocaleString()} steps
          </span>
          <div className="mt-3">
            <Badge variant={badgeVariant}>{percentage}%</Badge>
          </div>
        </div>
      </div>

      {/* Progress bar strip */}
      <div className="w-full px-1">
        <Progress
          value={percentage}
          barClassName={isComplete ? "bg-amber-500" : "bg-indigo-500"}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-slate-600">0</span>
          <span className="text-[10px] text-slate-600">{goal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
