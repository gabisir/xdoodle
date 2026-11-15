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

app.post('/api/ankete', async (req, res) => {
  const { email_organizatora, naslov, opis, lokacija, termini = [] } = req.body;
  const { rows } = await pool.query(
    "insert into anketa (email_organizatora, naslov, opis, lokacija, status_id) values ($1, $2, $3, $4, 'ACTIVE') returning anketa_id",
    [email_organizatora, naslov, opis, lokacija]
  );
  const id = rows[0].anketa_id;
  for (const t of termini) {
    await pool.query('insert into termin (anketa_id, vrijeme_pocetka, vrijeme_kraja) values ($1, $2, $3)', [id, t.vrijeme_pocetka, t.vrijeme_kraja]);
  }
  await pool.query('insert into anketa_odgovor (anketa_id, odgovor_id) values ($1, 1), ($1, 2)', [id]);
  res.json({ anketa_id: id });
});

app.get('/api/ankete/:id', async (req, res) => {
  const id = req.params.id;
  const anketa = await pool.query('select * from anketa where anketa_id = $1', [id]);
  if (!anketa.rows.length) return res.status(404).json({ greska: 'Anketa ne postoji' });

  const termini = await pool.query('select * from termin where anketa_id = $1 order by vrijeme_pocetka', [id]);
  const odgovori = await pool.query('select * from anketa_odgovor where anketa_id = $1 order by odgovor_id', [id]);
  const sudionici = await pool.query(
    `select s.sudionik_id, s.ime, json_agg(g) as glasovi
     from glas g join sudionik s using (sudionik_id) join termin t using (termin_id)
     where t.anketa_id = $1 group by s.sudionik_id order by s.sudionik_id`,
    [id]
  );

  res.json({ ...anketa.rows[0], termini: termini.rows, odgovori: odgovori.rows, sudionici: sudionici.rows });
});

async function spremiGlasove(sudionikId, glasovi) {
  for (const g of glasovi) {
    await pool.query('insert into glas (sudionik_id, termin_id, anketa_odgovor_id) values ($1, $2, $3)', [sudionikId, g.termin_id, g.anketa_odgovor_id]);
  }
}

app.post('/api/ankete/:id/glasovi', async (req, res) => {
  const { rows } = await pool.query('insert into sudionik (ime) values ($1) returning sudionik_id', [req.body.ime]);
  await spremiGlasove(rows[0].sudionik_id, req.body.glasovi);
  res.json({ sudionik_id: rows[0].sudionik_id });
});

app.put('/api/ankete/:id/glasovi/:sudionikId', async (req, res) => {
  const id = req.params.sudionikId;
  await pool.query('update sudionik set ime = $1 where sudionik_id = $2', [req.body.ime, id]);
  await pool.query('delete from glas where sudionik_id = $1', [id]);
  await spremiGlasove(id, req.body.glasovi);
  res.json({ ok: true });
});

app.get('/api/korisnici/:email/ankete', async (req, res) => {
  const { rows } = await pool.query(
    `select a.anketa_id, a.naslov, a.lokacija, count(distinct g.sudionik_id)::int as broj_glasova
     from anketa a left join termin t using (anketa_id) left join glas g using (termin_id)
     where a.email_organizatora = $1 group by a.anketa_id order by a.anketa_id desc`,
    [req.params.email]
  );
  res.json(rows);
});

app.use((err, req, res, next) => {
  res.status(400).json({ greska: err.message });
});

app.listen(process.env.PORT || 3000, () => console.log('Backend radi'));
