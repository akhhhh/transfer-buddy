// app/api/register/route.js
let codes = {}; // temporary in-memory store

export async function POST(req) {
  const { peerId } = await req.json();

  const code = Math.floor(10000 + Math.random() * 90000).toString();

  // store mapping
  codes[code] = peerId;

  // auto-expire after 5 minutes
  setTimeout(() => delete codes[code], 5 * 60 * 1000);

  return Response.json({ code });
}

// Export so resolve API can reuse storage (Next.js isolates modules)
export { codes };
