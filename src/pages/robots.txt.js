export const prerender = false;

export const GET = () => {
  const PUBLIC_BASE_URL = import.meta.env.PUBLIC_BASE_URL;

  const body = `
  User-agent: *
Allow: /

Sitemap: ${PUBLIC_BASE_URL}/sitemap.xml
  `;

  return new Response(body.trim(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};