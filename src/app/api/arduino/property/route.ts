import { NextResponse } from "next/server";
import { setProperty } from "@/lib/arduino";

export async function POST(request: Request) {
  const thingId = process.env.ARDUINO_THING_ID;
  if (!thingId) {
    return NextResponse.json(
      { error: "ARDUINO_THING_ID not configured" },
      { status: 500 }
    );
  }

  try {
    const { propertyName, value } = await request.json();

    if (!propertyName) {
      return NextResponse.json(
        { error: "propertyName is required" },
        { status: 400 }
      );
    }

    await setProperty(thingId, propertyName, value);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
