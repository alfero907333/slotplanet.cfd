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
    { loc: "/blog/", lastmod: now, priority: 0.5 },
    { loc: "/blog/best-soccer-streaming-sites-2026/", lastmod: now, priority: 0.4 },
    { loc: "/blog/soccer100-vs-other-streaming-sites/", lastmod: now, priority: 0.4 },
    { loc: "/blog/soccer100-watch-free-live-streams/", lastmod: now, priority: 0.4 },
    { loc: "/blog/soccer100-best-live-streaming/", lastmod: now, priority: 0.4 },
    { loc: "/blog/how-to-watch-soccer-streams-free/", lastmod: now, priority: 0.4 },
    { loc: "/blog/top-features-soccer-streams-tv/", lastmod: now, priority: 0.4 },
    { loc: "/blog/soccer100-not-working/", lastmod: now, priority: 0.4 },
    { loc: "/blog/sites-like-soccer100/", lastmod: now, priority: 0.4 },
    { loc: "/blog/soccer100-vs-footybite/", lastmod: now, priority: 0.4 },
    { loc: "/blog/soccer100-alternatives-2026/", lastmod: now, priority: 0.4 },
    { loc: "/blog/soccer100-down-fix/", lastmod: now, priority: 0.4 },
    { loc: "/blog/premier-league-soccer100/", lastmod: now, priority: 0.4 },
    { loc: "/blog/champions-league-soccer100/", lastmod: now, priority: 0.4 },
    { loc: "/blog/la-liga-soccer100/", lastmod: now, priority: 0.4 },
    { loc: "/blog/serie-a-soccer100/", lastmod: now, priority: 0.4 },
    { loc: "/blog/world-cup-soccer100/", lastmod: now, priority: 0.4 },
    { loc: "/contact-us/", lastmod: now, priority: 0.3 },
    { loc: "/privacy-policy/", lastmod: now, priority: 0.3 },
    { loc: "/dmca/", lastmod: now, priority: 0.3 },
  ];

  // Dynamic SSR pages (fetch from API)
  let dynamicPages = [];
  try {
    const res = await fetch(`https://spanelv2.andrhino.com/api/v2/appscheduleapi`);
    if (res.ok) {
      const data = await res.json();
      const sportsData = data[0].schedule;
      
      sportsData.forEach(sport => {
        sport.league_schedule.forEach(event => {
          dynamicPages.push({
            loc: `/live/${slugify(sport.sport)}/${slugify(`${event.teams}`)}/${event.sch_id}/`,
            lastmod: now,
            priority: 0.8,
          });
        });
      });
    }
  } catch (error) {
    console.error("Error fetching sitemap dynamic pages:", error);
  }

  const urls = [...staticPages, ...footerPages, ...dynamicPages];

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
