export const maxDuration = 30;

const agent = { "User-Agent": "Milpa/1.0 (farmworker safety app; milpa-california.vercel.app)" };

function miles(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

export async function GET(req: Request) {
  const zip = new URL(req.url).searchParams.get("zip")?.trim() ?? "";
  if (!/^\d{5}$/.test(zip)) return new Response("zip required", { status: 400 });
  try {
    const place = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=us&format=json&limit=1`,
      { headers: agent, signal: AbortSignal.timeout(8000) },
    ).then((response) => response.json());
    if (!place?.[0]) return Response.json({ shops: [] });
    const center = { lat: Number(place[0].lat), lon: Number(place[0].lon) };
    const box = [center.lon - 0.09, center.lat + 0.07, center.lon + 0.09, center.lat - 0.07].join(",");
    const found = await fetch(
      `https://nominatim.openstreetmap.org/search?q=supermarket&format=json&limit=20&addressdetails=1&bounded=1&viewbox=${box}`,
      { headers: agent, signal: AbortSignal.timeout(10000) },
    ).then((response) => response.json());
    const shops = (Array.isArray(found) ? found : [])
      .filter((item: { name?: string }) => item.name)
      .map((item: { name: string; type: string; lat: string; lon: string; address?: Record<string, string> }) => {
        const lat = Number(item.lat);
        const lon = Number(item.lon);
        const street = [item.address?.house_number, item.address?.road].filter(Boolean).join(" ");
        return {
          name: item.name,
          kind: item.type,
          address: [street, item.address?.city ?? item.address?.town].filter(Boolean).join(", "),
          miles: Math.round(miles(center, { lat, lon }) * 10) / 10,
          lat,
          lon,
        };
      })
      .sort((a: { miles: number }, b: { miles: number }) => a.miles - b.miles)
      .slice(0, 6);
    return Response.json({ shops });
  } catch {
    return new Response("shops failed", { status: 502 });
  }
}
