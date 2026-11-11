require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
  const { rows } = await pool.query('select now()');
  res.json({ ok: true, time: rows[0].now });
});

app.listen(process.env.PORT || 3000, () => console.log('Backend radi'));
