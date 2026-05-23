"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardLabel } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface LEDToggleProps {
  ledOn: boolean;
  onToggle: (value: boolean) => void;
}

export default function LEDToggle({ ledOn, onToggle }: LEDToggleProps) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/arduino/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyName: "led_switch", value: !ledOn }),
      });
      if (res.ok) onToggle(!ledOn);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardLabel>LED Light</CardLabel>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className={`text-xl font-bold ${ledOn ? "text-amber-400" : "text-slate-500"}`}>
            {ledOn ? "On" : "Off"}
          </p>
          <Switch
            checked={ledOn}
            onCheckedChange={handleToggle}
            disabled={loading}
            accentClass="bg-amber-500"
          />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              ledOn ? "bg-amber-400 animate-pulse" : "bg-slate-700"
            }`}
          />
          <span className="text-[11px] text-slate-500 font-medium">
            {ledOn ? "Active" : "Inactive"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
