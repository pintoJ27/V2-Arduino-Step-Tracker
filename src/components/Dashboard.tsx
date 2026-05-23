"use client";

import { useState, useEffect } from "react";
import { useArduinoCloud } from "@/hooks/useArduinoCloud";
import StepRing from "./StepRing";
import BatteryIndicator from "./BatteryIndicator";
import PaceCard from "./PaceCard";
import SPMCard from "./SPMCard";
import GoalSetter from "./GoalSetter";
import LEDToggle from "./LEDToggle";

export default function Dashboard() {
  const { data, connected, error } = useArduinoCloud();
  const [goal, setGoal] = useState(10000);

  useEffect(() => {
    const saved = localStorage.getItem("stepGoal");
    if (saved) setGoal(parseInt(saved, 10));
  }, []);

  function handleGoalChange(newGoal: number) {
    setGoal(newGoal);
    localStorage.setItem("stepGoal", newGoal.toString());
  }

  const statusDot = connected
    ? "bg-emerald-500 animate-pulse"
    : error
      ? "bg-red-500"
      : "bg-amber-500 animate-pulse";
  const statusLabel = connected ? "Live" : error ? "Offline" : "Connecting";

  return (
    <div
      className="min-h-screen bg-[#09090f] text-white flex flex-col"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-5 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-widest uppercase text-white">
            Stride
          </span>
        </div>

        {/* Connection pill */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          <span className="text-[11px] text-slate-400 font-medium">{statusLabel}</span>
        </div>
      </header>

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mx-5" />

      {/* Main content */}
      <main className="flex-1 px-5 pt-6 pb-4 space-y-4">
        {/* Hero: Step Ring */}
        <div className="flex justify-center">
          <StepRing steps={data.steps} goal={goal} />
        </div>

        {/* Goal card */}
        <GoalSetter goal={goal} onGoalChange={handleGoalChange} />

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <PaceCard pace={data.currentPace} status={data.status} />
          <SPMCard spm={data.currentSPM} />
        </div>

        {/* Device row */}
        <div className="grid grid-cols-2 gap-3">
          <BatteryIndicator battery={data.Battery} />
          <LEDToggle ledOn={data.led_switch} onToggle={() => {}} />
        </div>

        {/* Footer wordmark */}
        <p className="text-center text-[10px] text-slate-700 tracking-wider uppercase pt-2">
          Arduino IoT Cloud
        </p>
      </main>
    </div>
  );
}
