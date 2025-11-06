import fetch from "node-fetch";

export default async function handler(req, res) {
  const username = req.query.username || "dvqk4";
  const url = `https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${username}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "d4f67352f9mshe1bfeed8733aa64p1f5521jsnbac20444ea63",
      "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com"
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data && data.userInfo && data.userInfo.stats) {
      const { followerCount, heartCount } = data.userInfo.stats;
      res.status(200).json({
        followers: followerCount,
        hearts: heartCount
      });
    } else {
      res.status(500).json({ error: "Invalid TikTok data" });
    }
  } catch (err) {
    console.error("Server API Error:", err);
    res.status(500).json({ error: "Failed to fetch TikTok data" });
  }
}
