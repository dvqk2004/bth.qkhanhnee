export default async function handler(req, res) {
  const response = await fetch('https://example.com/data?api_key=' + process.env.API_KEY);
  const data = await response.json();
  res.status(200).json(data);
}
