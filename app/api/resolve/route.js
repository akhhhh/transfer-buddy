// app/api/resolve/route.js
import { codes } from "../register/route";

export async function POST(req) {
  const { code } = await req.json();

  if (!codes[code]) {
    return Response.json({ error: "Invalid code" }, { status: 404 });
  }

  return Response.json({ peerId: codes[code] });
}
