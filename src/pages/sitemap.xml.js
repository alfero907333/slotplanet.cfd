export const prerender = false;

import slugify from "../utils/slugify";

export const GET = async () => {
  const PUBLIC_BASE_URL = import.meta.env.PUBLIC_BASE_URL || "https://smartbahis.cfd";

  const now = new Date().toISOString();

  // Static pages (built-in)
  const staticPages = [
    { loc: "/", lastmod: now, priority: 1 },
    { loc: "/methstreams/", lastmod: now, priority: 0.8 },
    { loc: "/crackstreams/", lastmod: now, priority: 0.8 },
    { loc: "/buffstreams/", lastmod: now, priority: 0.8 },
    { loc: "/totalsportek/", lastmod: now, priority: 0.8 },
  ];

  const footerPages = [
    { loc: "/blog/", lastmod: now, priority: 0.5 },
    { loc: "/blog/footybite-premier-league/", lastmod: now, priority: 0.6 },
    { loc: "/blog/methstreams-nfl-streams/", lastmod: now, priority: 0.6 },
    { loc: "/blog/rojadirecta-footybite-guide/", lastmod: now, priority: 0.6 },
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
