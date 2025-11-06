export default async function handler(req, res) {
  const username = req.query.username || "dvqk4";
  const url = `https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${username}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Kiểm tra dữ liệu trả về hợp lệ
    if (data?.userInfo?.stats) {
      const { followerCount, heartCount } = data.userInfo.stats;
      res.status(200).json({
        followers: followerCount,
        hearts: heartCount,
      });
    } else {
      console.error("⚠️ Dữ liệu không hợp lệ:", data);
      res.status(500).json({ error: "Invalid TikTok data" });
    }
  } catch (error) {
    console.error("❌ Lỗi khi fetch API TikTok:", error);
    res.status(500).json({ error: "Failed to fetch TikTok data" });
  }
}
