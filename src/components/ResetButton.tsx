"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardLabel } from "@/components/ui/card";

interface ResetButtonProps {
  onReset: () => Promise<void>;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await onReset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardLabel>Reset Steps</CardLabel>
      </CardHeader>
      <CardContent>
        <button
          onClick={handleClick}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-600/20 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Resetting..." : "Reset"}
        </button>
      </CardContent>
    </Card>
  );
}
