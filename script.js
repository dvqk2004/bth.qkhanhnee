document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if ((e.ctrlKey && e.key === 's') || (e.ctrlKey && e.key === 'u')) e.preventDefault();
});
if(window.location.hostname !== "qkhanh.bio"){
  document.body.innerHTML = "<h1>Unauthorized Copy Detected</h1>";
}
// ===== TikTok API (Free Unofficial) =====
// ⚠️ Thay "qkhanhnee" bằng username TikTok của bạn
const TIKTOK_USERNAME = "dvqk4";

// Hàm lấy dữ liệu người dùng TikTok
async function fetchTikTokStats() {
  try {
    const response = await fetch(`https://api.lovetik.com/api/user?username=${TIKTOK_USERNAME}`);
    const data = await response.json();

    if (data && data.data) {
      const user = data.data;

      // Cập nhật số followers, hearts, và video count
      document.getElementById("tiktok-followers").textContent = user.follower_count.toLocaleString();
      document.getElementById("tiktok-likes").textContent = user.heart_count.toLocaleString();
      document.getElementById("tiktok-videos").textContent = user.video_count.toLocaleString();
    } else {
      console.error("Không lấy được dữ liệu TikTok:", data);
    }
  } catch (err) {
    console.error("Lỗi khi gọi API TikTok:", err);
  }
}

// Gọi API ngay khi tải trang
fetchTikTokStats();

// Cập nhật lại mỗi 10 phút
setInterval(fetchTikTokStats, 10 * 60 * 1000);
