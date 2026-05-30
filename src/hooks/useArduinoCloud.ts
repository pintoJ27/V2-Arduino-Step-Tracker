"use client";

import { useState, useEffect, useCallback } from "react";

export interface ArduinoData {
  steps: number;
  Battery: number;
  currentPace: string;
  spm_cloud: number;
  calibratingCloud: boolean;
  resetCloud: boolean;
  steps_goal: number;
}

const DEFAULT_DATA: ArduinoData = {
  steps: 0,
  Battery: 0,
  currentPace: "N/A",
  spm_cloud: 0,
  calibratingCloud: false,
  resetCloud: false,
  steps_goal: 10000,
};

const BOARD_STALE_MS = 6000; // board is "offline" if no update in 6 seconds

export function useArduinoCloud(pollInterval = 3000) {
  const [data, setData] = useState<ArduinoData>(DEFAULT_DATA);
  const [connected, setConnected] = useState(false);
  const [boardOnline, setBoardOnline] = useState(false);
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
        calibratingCloud: props.calibratingCloud ?? false,
        resetCloud: props.resetCloud ?? false,
        steps_goal: props.steps_goal ?? 10000,
      });

      // Check if the board has sent data recently
      if (props._lastUpdatedAt) {
        const lastUpdate = new Date(props._lastUpdatedAt).getTime();
        const age = Date.now() - lastUpdate;
        setBoardOnline(age < BOARD_STALE_MS);
      } else {
        setBoardOnline(false);
      }

      setConnected(true);
      setError(null);
    } catch (e) {
      setConnected(false);
      setBoardOnline(false);
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    const interval = setInterval(fetchProperties, pollInterval);
    return () => clearInterval(interval);
  }, [fetchProperties, pollInterval]);

  const setProperty = useCallback(async (propertyName: string, value: unknown) => {
    const res = await fetch("/api/arduino/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyName, value }),
    });
    if (!res.ok) throw new Error(`Failed to set ${propertyName}`);
    await fetchProperties();
  }, [fetchProperties]);

  return { data, connected, boardOnline, error, refetch: fetchProperties, setProperty };
}
