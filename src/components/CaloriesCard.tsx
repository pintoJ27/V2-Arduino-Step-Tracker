"use client";

import { Card, CardHeader, CardContent, CardLabel } from "@/components/ui/card";

interface CaloriesCardProps {
  steps: number;
}

// Average: ~0.04 calories per step (based on 2,000 steps per mile, ~80 cal/mile)
const CALORIES_PER_STEP = 0.04;

export default function CaloriesCard({ steps }: CaloriesCardProps) {
  const calories = Math.round(steps * CALORIES_PER_STEP);

  return (
    <Card>
      <CardHeader>
        <CardLabel>Calories</CardLabel>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 23c-4.97 0-7-3.58-7-7 0-2.79 1.34-4.73 2.56-6.49C8.93 7.6 10 6.13 10 4c0-.78-.13-1.53-.36-2.24A.5.5 0 0110.12 1c3.73 1.07 7.88 5.16 7.88 10 0 1.2-.3 2.24-.78 3.12.48-.42.88-.96 1.18-1.62a.5.5 0 01.91.16C19.87 15.33 18.07 23 12 23z"
                fill="currentColor"
                className="text-orange-500"
              />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-white tabular-nums leading-none">
              {calories.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">kcal burned</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
