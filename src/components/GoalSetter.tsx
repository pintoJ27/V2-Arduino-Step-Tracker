"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardLabel } from "@/components/ui/card";

interface GoalSetterProps {
  goal: number;
  onGoalChange: (goal: number) => void;
  onCloudSync: (goal: number) => Promise<void>;
}

export default function GoalSetter({ goal, onGoalChange, onCloudSync }: GoalSetterProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(goal.toString());

  async function handleSave() {
    const num = parseInt(input, 10);
    if (num > 0) {
      onGoalChange(num);
      await onCloudSync(num);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <Card>
        <CardHeader>
          <CardLabel>Daily Goal</CardLabel>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xl font-bold text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-white/[0.05] hover:bg-white/[0.09] text-slate-400 px-3 py-2.5 rounded-xl text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <button
      onClick={() => {
        setInput(goal.toString());
        setEditing(true);
      }}
      className="w-full text-left bg-white/[0.03] border border-white/[0.07] rounded-2xl group hover:border-white/[0.12] transition-colors"
    >
      <div className="px-4 pt-4 pb-2">
        <CardLabel className="mb-3">Daily Goal</CardLabel>
      </div>
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-white tabular-nums">
          {goal.toLocaleString()}
          <span className="text-sm text-slate-500 font-normal ml-2">steps</span>
        </span>
        <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-400 bg-white/[0.04] group-hover:bg-white/[0.07] border border-white/[0.07] rounded-lg px-2.5 py-1 transition-all">
          Edit
        </span>
      </div>
    </button>
  );
}
