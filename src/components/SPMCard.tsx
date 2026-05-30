"use client";

import { Card, CardHeader, CardContent, CardLabel } from "@/components/ui/card";

interface SPMCardProps {
  spm: number;
}

export default function SPMCard({ spm }: SPMCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardLabel>Avg SPM</CardLabel>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-white tabular-nums leading-none">
          {spm}
        </p>
        <p className="text-[11px] text-slate-500 font-medium mt-2">steps / min</p>
      </CardContent>
    </Card>
  );
}
