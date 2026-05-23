import { NextResponse } from "next/server";
import { getProperties } from "@/lib/arduino";

export async function GET() {
  const thingId = process.env.ARDUINO_THING_ID;
  if (!thingId) {
    return NextResponse.json(
      { error: "ARDUINO_THING_ID not configured" },
      { status: 500 }
    );
  }

  try {
    const properties = await getProperties(thingId);
    return NextResponse.json(properties);
  } catch (e) {
    console.error("Arduino API error:", e);
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
