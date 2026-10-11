const headers = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

export function onRequestGet() {
  return new Response(JSON.stringify({ status: "ok" }), { headers });
}

export function onRequest() {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { ...headers, Allow: "GET" },
  });
}
