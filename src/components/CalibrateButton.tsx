"use client";

import { useState } from "react";

interface CalibrateButtonProps {
  calibrating: boolean;
  onCalibrate: () => Promise<void>;
}

export default function CalibrateButton({ calibrating, onCalibrate }: CalibrateButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await onCalibrate();
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || calibrating;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full rounded-2xl py-5 font-semibold text-base transition-all border ${
        calibrating
          ? "bg-amber-500/10 border-amber-500/30 text-amber-400 cursor-not-allowed"
          : disabled
            ? "bg-indigo-600/30 border-indigo-500/20 text-indigo-300 cursor-not-allowed"
            : "bg-indigo-600 border-indigo-500/50 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-600/20"
      }`}
    >
      {calibrating ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Calibrating...
        </span>
      ) : loading ? (
        "Sending..."
      ) : (
        "Calibrate Sensor"
      )}
    </button>
  );
}
