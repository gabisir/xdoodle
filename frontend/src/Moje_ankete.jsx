import { useState } from 'react'
import './App.css'

function Moje_ankete() {
  const [email, setEmail] = useState('') // privremeno dok nema prijave
  const [ankete, setAnkete] = useState(null)

  async function ucitaj(event) {
    event.preventDefault()
    const res = await fetch(`/api/korisnici/${encodeURIComponent(email)}/ankete`)
    setAnkete(await res.json())
  }

  return (
    <main className="moja-anketa-page">
      <a className="back-link" href="/">Natrag na aplikaciju</a>
      <h1>Moje ankete</h1>

      <form onSubmit={ucitaj}>
        <input
          type="email"
          placeholder="tvoj email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Prikaži</button>
      </form>

      {ankete && ankete.length === 0 && <p>Nemaš nijednu anketu.</p>}

      <ul className="no-bullets">
        {ankete?.map((a) => (
          <li className="moja-anketa-li" key={a.anketa_id}>
            <a href={`/glasanje?id=${a.anketa_id}`}>
              <div className="moja-anketa-info">
                <h2>{a.naslov}</h2>
                <h2 className="moja-anketa-desno">
                  {a.lokacija && `${a.lokacija} · `}br glasova: {a.broj_glasova}
                </h2>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Moje_ankete
