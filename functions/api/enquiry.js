const responseHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

const MAX_BODY_SIZE = 8_000;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2_000;

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...responseHeaders, ...extraHeaders },
  });
}

function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "POST, OPTIONS" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  const contentType = request.headers.get("Content-Type") || "";

  if (contentLength > MAX_BODY_SIZE || !contentType.includes("application/json")) {
    return json({ error: "Invalid request" }, 400);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const name = text(data.name, MAX_NAME_LENGTH);
  const email = text(data.email, MAX_EMAIL_LENGTH);
  const message = text(data.message, MAX_MESSAGE_LENGTH);

  if (!name || !isEmail(email) || !message) {
    return json({ error: "Please provide a name, email address, and message." }, 400);
  }

  // This remains disabled until a secret webhook URL is added in Cloudflare.
  if (!env.ENQUIRY_WEBHOOK_URL) {
    return json({ error: "Enquiries are not configured yet." }, 503);
  }

  try {
    const upstream = await fetch(env.ENQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, source: "art.mauforge.com" }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!upstream.ok) {
      return json({ error: "Unable to send your enquiry. Please try again later." }, 502);
    }
  } catch {
    return json({ error: "Unable to send your enquiry. Please try again later." }, 502);
  }

  return json({ message: "Thank you. Your enquiry has been sent." }, 202);
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405, { Allow: "POST, OPTIONS" });
}
