importScripts("ts-strip.js");

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("message", (event) => {
  if (event.data === "ts-loader:claim") event.waitUntil(self.clients.claim());
});

const isTypeScript = (url) =>
  /\.m?ts$/.test(url.pathname) && !url.pathname.endsWith(".d.ts") && !url.searchParams.has("raw");

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !isTypeScript(url)) return;
  event.respondWith(compile(event.request, url));
});

async function compile(request, url) {
  const response = await fetch(request);
  if (!response.ok) return response;
  const source = await response.text();
  let body;
  try {
    body = self.tsStrip(source, url.pathname);
  } catch (error) {
    body = `throw new SyntaxError(${JSON.stringify(`${url.pathname}: ${error.message}`)});`;
  }
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-TS-Loader": "stripped"
    }
  });
}
