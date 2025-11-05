// api/tiktok.js
// Vercel Serverless function — scrape TikTok profile and return { username, followers, hearts, following }
// Cache on CDN to reduce scraping frequency.

export default async function handler(req, res) {
  const username = (req.query.username || req.query.user || "dvqk4").replace(/^@/, "");
  const profileUrl = `https://www.tiktok.com/@${encodeURIComponent(username)}`;

  try {
    const r = await fetch(profileUrl, {
      headers: {
        // pretend to be a real browser
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!r.ok) {
      return res.status(502).json({ error: "Cannot fetch TikTok profile", status: r.status });
    }

    const html = await r.text();

    // 1) quick regex
    let follower_count = null;
    let heart_count = null;
    let following_count = null;

    const m1 = html.match(/"followerCount":\s*(\d+)/);
    const m2 = html.match(/"heartCount":\s*(\d+)/);
    const m3 = html.match(/"followingCount":\s*(\d+)/);

    if (m1) follower_count = parseInt(m1[1], 10);
    if (m2) heart_count = parseInt(m2[1], 10);
    if (m3) following_count = parseInt(m3[1], 10);

    // 2) fallback: try JSON in SIGI_STATE or window['SIGI_STATE']
    if ((follower_count === null || heart_count === null)) {
      const sigiMatch =
        html.match(/window\['SIGI_STATE'\]\s*=\s*({[\s\S]*?});\s*<\/script>/) ||
        html.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);

      if (sigiMatch) {
        try {
          const jsonText = sigiMatch[1];
          const parsed = JSON.parse(jsonText);
          // common paths: parsed.UserModule.users
          const users = parsed && parsed.UserModule && parsed.UserModule.users;
          if (users) {
            const keys = Object.keys(users);
            const userKey = keys.find(k => k.toLowerCase().includes(username.toLowerCase())) || keys[0];
            const u = users[userKey];
            if (u) {
              if (u.followerCount != null) follower_count = parseInt(u.followerCount, 10);
              if (u.heart != null) heart_count = parseInt(u.heart, 10);
              if (u.followingCount != null) following_count = parseInt(u.followingCount, 10);
            }
          }

          // other possible path: parsed.UserModule.stats (unlikely) -> adapt if needed
        } catch (e) {
          // ignore parse errors
        }
      }
    }

    // Fallbacks to 0
    follower_count = Number.isInteger(follower_count) ? follower_count : 0;
    heart_count = Number.isInteger(heart_count) ? heart_count : 0;
    following_count = Number.isInteger(following_count) ? following_count : 0;

    const out = {
      username,
      followers: follower_count,
      hearts: heart_count,
      following: following_count,
      source: "scrape",
      updated_at: new Date().toISOString()
    };

    // Cache on CDN 5 minutes, browsers short
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=59");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(out);

  } catch (err) {
    console.error("TikTok scrape error:", err);
    return res.status(500).json({ error: "Server error fetching TikTok", detail: String(err) });
  }
}
