import './App.css'
import { useState } from 'react'

function Anketa() {
  const [email, setEmail] = useState('')
  const [naslov, setNaslov] = useState('')
  const [lokacija, setLokacija] = useState('')
  const [opis, setOpis] = useState('')
  const [datum, setDatum] = useState('')
  const [od, setOd] = useState('')
  const [doVremena, setDoVremena] = useState('')
  const [termini, setTermini] = useState([])
  const [greska, setGreska] = useState('')

  function dodajTermin() {
    if (!datum || !od || !doVremena) return
    setTermini([
      ...termini,
      {
        vrijeme_pocetka: new Date(`${datum}T${od}`).toISOString(),
        vrijeme_kraja: new Date(`${datum}T${doVremena}`).toISOString(),
      },
    ])
  }

  async function kreiraj(event) {
    event.preventDefault()
    setGreska('')

    const res = await fetch('/api/ankete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_organizatora: email, naslov, lokacija, opis, termini }),
    })
    const podaci = await res.json()
    if (!res.ok) return setGreska(podaci.greska)

    window.location.href = `/glasanje?id=${podaci.anketa_id}`
  }

  return (
    <main className="anketa-page">
      <a className="back-link" href="/">
        &larr; Natrag na aplikaciju
      </a>
      <h1>Kreiraj anketu</h1>
      <form className="anketa-form" onSubmit={kreiraj}>
        {/* privremeno dok nema prijave */}
        <label htmlFor="anketa-email">Tvoj email (organizator):</label>
        <input
          id="anketa-email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="anketa-question">Naziv:</label>
        <input
          id="anketa-question"
          type="text"
          placeholder="Naziv"
          value={naslov}
          onChange={(e) => setNaslov(e.target.value)}
          required
        />

        <label htmlFor="anketa-option-one">Opcije: </label>
        <input
          id="anketa-option-one"
          type="text"
          placeholder="upisi lokaciju"
          value={lokacija}
          onChange={(e) => setLokacija(e.target.value)}
        />
        <input
          id="anketa-option-two"
          type="text"
          placeholder="dodatan opis"
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
        />

        <div>DIV ZA KALENDAR</div>

        <label htmlFor="anketa-datum">Odaberi datum i vrijeme termina</label>
        <input
          id="anketa-datum"
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
        />
        <input type="time" aria-label="Od" value={od} onChange={(e) => setOd(e.target.value)} />
        <input type="time" aria-label="Do" value={doVremena} onChange={(e) => setDoVremena(e.target.value)} />
        <button type="button" onClick={dodajTermin}>
          Dodaj termin
        </button>

        <ul>
          {termini.map((t, i) => (
            <li key={i}>
              {new Date(t.vrijeme_pocetka).toLocaleString('hr-HR')} –{' '}
              {new Date(t.vrijeme_kraja).toLocaleTimeString('hr-HR')}
            </li>
          ))}
        </ul>

        <div>DIV ZA DODATNE OPCIJE ANKETE</div>

        <button type="submit" className="anketa-submit">
          Kreiraj anketu
        </button>
        {greska && <p role="alert">{greska}</p>}
      </form>
    </main>
  )
}

export default Anketa
