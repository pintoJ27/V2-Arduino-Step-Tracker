"use client";

import { useState, useEffect, useCallback } from "react";

export interface ArduinoData {
  steps: number;
  Battery: number;
  currentPace: string;
  currentSPM: number;
  spm_cloud: number;
  status: string;
  led_switch: boolean;
}

const DEFAULT_DATA: ArduinoData = {
  steps: 0,
  Battery: 0,
  currentPace: "N/A",
  currentSPM: 0,
  spm_cloud: 0,
  status: "N/A",
  led_switch: false,
};

export function useArduinoCloud(pollInterval = 3000) {
  const [data, setData] = useState<ArduinoData>(DEFAULT_DATA);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/arduino/properties", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const props = await res.json();
      const paceMap: Record<number, string> = { 0: "Stationary", 1: "Walking", 2: "Running" };
      const paceValue = props.current_pace ?? props.Pace;
      setData({
        steps: props.steps ?? 0,
        Battery: props.Battery ?? 0,
        currentPace: paceMap[paceValue] ?? (typeof paceValue === "string" ? paceValue : "N/A"),
        currentSPM: props.spm_cloud ?? 0,
        spm_cloud: props.spm_cloud ?? 0,
        status: props.status ?? "N/A",
        led_switch: props.led_switch ?? false,
      });
      setConnected(true);
      setError(null);
    } catch (e) {
      setConnected(false);
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    const interval = setInterval(fetchProperties, pollInterval);
    return () => clearInterval(interval);
  }, [fetchProperties, pollInterval]);

  return { data, connected, error, refetch: fetchProperties };
}
