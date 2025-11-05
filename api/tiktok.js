// api/tiktok.js
// ✅ Tự động lấy followers + hearts TikTok (bằng backend proxy an toàn, không bị CORS)

export default async function handler(req, res) {
  const username = (req.query.username || "dvqk4").replace(/^@/, "");
  const profileUrl = `https://www.tiktok.com/@${encodeURIComponent(username)}`;

  try {
    const r = await fetch(profileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!r.ok) {
      return res
        .status(502)
        .json({ error: "Không thể tải profile TikTok", status: r.status });
    }

    const html = await r.text();

    // === Tìm dữ liệu followers, hearts, following ===
    const matchFollowers = html.match(/"followerCount":\s*(\d+)/);
    const matchHearts = html.match(/"heartCount":\s*(\d+)/);
    const matchFollowing = html.match(/"followingCount":\s*(\d+)/);

    const followers = matchFollowers ? parseInt(matchFollowers[1]) : 0;
    const hearts = matchHearts ? parseInt(matchHearts[1]) : 0;
    const following = matchFollowing ? parseInt(matchFollowing[1]) : 0;

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=59");
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({
      username,
      followers,
      hearts,
      following,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Lỗi khi fetch TikTok:", error);
    return res.status(500).json({
      error: "Lỗi server khi lấy dữ liệu TikTok",
      detail: error.message,
    });
  }
}
