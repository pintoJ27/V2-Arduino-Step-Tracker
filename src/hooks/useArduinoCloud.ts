"use client";

import { useState, useEffect, useCallback } from "react";

export interface ArduinoData {
  steps: number;
  Battery: number;
  currentPace: string;
  spm_cloud: number;
}

const DEFAULT_DATA: ArduinoData = {
  steps: 0,
  Battery: 0,
  currentPace: "N/A",
  spm_cloud: 0,
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
      setData({
        steps: props.steps ?? 0,
        Battery: props.Battery ?? 0,
        currentPace: props.current_pacea ?? "N/A",
        spm_cloud: props.spm_cloud ?? 0,
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
