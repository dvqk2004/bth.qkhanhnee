export default async function handler(req, res) {
  const username = req.query.username || "dvqk4";
  const url = `https://tiktok-api23.p.rapidapi.com/user/info?unique_id=${username}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "tiktok-api23.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data && data.user && data.user.stats) {
      const { followerCount, heartCount } = data.user.stats;
      res.status(200).json({
        followers: followerCount,
        hearts: heartCount,
      });
    } else {
      console.error("Invalid data:", data);
      res.status(500).json({ error: "Invalid TikTok data" });
    }
  } catch (err) {
    console.error("Server API Error:", err);
    res.status(500).json({ error: "Failed to fetch TikTok data" });
  }
}
