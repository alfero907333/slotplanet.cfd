export const prerender = false;

import slugify from "../utils/slugify";

export const GET = async () => {
  const PUBLIC_BASE_URL = import.meta.env.PUBLIC_BASE_URL;

  if (!PUBLIC_BASE_URL) {
    return new Response("PUBLIC_BASE_URL not configured", { status: 500 });
  }

  const now = new Date().toISOString();

  // Static pages (built-in)
  const staticPages = [{ loc: "/", lastmod: now, priority: 1 }];

  const footerPages = [
    { loc: "/contact-us/", lastmod: now, priority: 0.3 },
    { loc: "/privacy-policy/", lastmod: now, priority: 0.3 },
    { loc: "/dmca/", lastmod: now, priority: 0.3 },
  ];

  // Dynamic SSR pages (fetch from API or DB)
  //   const res = await fetch(`${import.meta.env.API}/events?sport=true`);
  //   const sports = await res.json();

  //   const dynamicPages = sports.data.map((event) => ({
  //     loc: `/watch/${slugify(event.sport.name)}/${slugify(`${event.team1} vs ${event.team2}`)}/${event.id}/`,
  //     lastmod: now,
  //     priority: 0.8,
  //   }));

  const urls = [...staticPages];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
      .map(
        (url) => `
  <url>
    <loc>${PUBLIC_BASE_URL}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    <changefreq>daily</changefreq>
    ${url.priority ? `<priority>${url.priority}</priority>` : ""}
  </url>
`,
      )
      .join("")}
</urlset>`;

  return new Response(body.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
