// api/proxy.js
export default async function handler(req, res) {
  const q = req.query.q || "";
  const KEY = process.env.MY_API_KEY; // đặt trên Vercel Dashboard
  const r = await fetch(`https://third.party.example/data?q=${encodeURIComponent(q)}`, {
    headers: {
      'Authorization': `Bearer ${KEY}` // hoặc query param tùy API
    }
  });
  const data = await r.json();
  res.status(200).json(data);
}
