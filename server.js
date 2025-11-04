// server.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.get('/api/proxy', async (req,res) => {
  const q = req.query.q || '';
  const KEY = process.env.THIRD_KEY;
  const r = await fetch(`https://third.party/api?q=${encodeURIComponent(q)}&key=${KEY}`);
  const data = await r.json();
  res.json(data);
});
app.listen(process.env.PORT || 3000);
