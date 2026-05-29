let cachedToken: string | null = null;
let tokenExpiry = 0;

const ARDUINO_API = "https://api2.arduino.cc/iot";

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch("https://api2.arduino.cc/iot/v1/clients/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.ARDUINO_CLIENT_ID!,
      client_secret: process.env.ARDUINO_CLIENT_SECRET!,
      audience: "https://api2.arduino.cc/iot",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Auth response:", res.status, text);
    throw new Error(`Arduino auth failed: ${res.status} - ${text}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 30) * 1000;
  return cachedToken!;
}

export async function getProperties(thingId: string) {
  const token = await getAccessToken();
  const res = await fetch(
    `${ARDUINO_API}/v2/things/${thingId}/properties`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch properties: ${res.status}`);
  }

  const properties = await res.json();
  const result: Record<string, unknown> = {};

  for (const prop of properties) {
    result[prop.variable_name] = prop.last_value;
  }

  return result;
}

const WRITABLE_PROPERTIES = ["calibratingCloud", "resetCloud", "steps_goal"];

export async function setProperty(
  thingId: string,
  propertyName: string,
  value: unknown
) {
  if (!WRITABLE_PROPERTIES.includes(propertyName)) {
    throw new Error(`Property "${propertyName}" is not writable`);
  }

  const token = await getAccessToken();

  const propsRes = await fetch(
    `${ARDUINO_API}/v2/things/${thingId}/properties`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  const properties = await propsRes.json();
  const prop = properties.find(
    (p: { variable_name: string }) => p.variable_name === propertyName
  );

  if (!prop) {
    throw new Error(`Property "${propertyName}" not found`);
  }

  const res = await fetch(
    `${ARDUINO_API}/v2/things/${thingId}/properties/${prop.id}/publish`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to set property: ${res.status}`);
  }
}
