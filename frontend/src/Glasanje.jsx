import { useEffect, useState } from 'react'
import './App.css'

// id ankete iz URL-a, npr. /glasanje?id=1
const anketaId = new URLSearchParams(window.location.search).get('id') || 1

function formatirajTermin(termin) {
  const pocetak = new Date(termin.vrijeme_pocetka)
  const kraj = new Date(termin.vrijeme_kraja)
  const datum = pocetak.toLocaleDateString('hr-HR', { weekday: 'short', day: 'numeric', month: 'numeric' })
  const sat = (d) => d.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })
  return `${datum} ${sat(pocetak)}-${sat(kraj)}`
}

function Glasanje() {
  const [anketa, setAnketa] = useState(null)
  const [greska, setGreska] = useState('')
  const [ime, setIme] = useState('')
  const [odabraniTermini, setOdabraniTermini] = useState([])
  const [uredujeGlas, setUredujeGlas] = useState(true)
  const [sudionikId, setSudionikId] = useState(null) // postavi se nakon prvog spremanja

  async function ucitajAnketu() {
    const res = await fetch(`/api/ankete/${anketaId}`)
    const podaci = await res.json()
    if (!res.ok) return setGreska(podaci.greska)
    setAnketa(podaci)
  }

  useEffect(() => {
    ucitajAnketu()
  }, [])

  if (greska) return <main className="anketa-page"><p>{greska}</p></main>
  if (!anketa) return <main className="anketa-page"><p>Učitavanje...</p></main>

  // Kvačica = prvi ponuđeni odgovor ("Može"), prazno = drugi ("Ne može")
  const odgovorDa = anketa.odgovori[0]?.anketa_odgovor_id
  const odgovorNe = anketa.odgovori[1]?.anketa_odgovor_id

  function promijeniTermin(id, oznacen) {
    setOdabraniTermini((trenutni) =>
      oznacen ? [...trenutni, id] : trenutni.filter((terminId) => terminId !== id),
    )
  }

  async function spremiGlas(event) {
    event.preventDefault()
    if (!ime.trim()) return

    const glasovi = anketa.termini
      .map((t) => ({
        termin_id: t.termin_id,
        anketa_odgovor_id: odabraniTermini.includes(t.termin_id) ? odgovorDa : odgovorNe,
      }))
      .filter((g) => g.anketa_odgovor_id)

    const res = await fetch(
      sudionikId ? `/api/ankete/${anketaId}/glasovi/${sudionikId}` : `/api/ankete/${anketaId}/glasovi`,
      {
        method: sudionikId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ime, glasovi }),
      },
    )
    const podaci = await res.json()
    if (!res.ok) return setGreska(podaci.greska)

    if (!sudionikId) setSudionikId(podaci.sudionik_id)
    setUredujeGlas(false)
    ucitajAnketu()
  }

  // Svoj red ne prikazujemo dvaput (on je u "Tvoj odabir")
  const ostali = anketa.sudionici.filter((s) => s.sudionik_id !== sudionikId)

  return (
    <main className="anketa-page">
      <a className="back-link" href="/">Natrag na aplikaciju</a>

      <h1>{anketa.naslov}</h1>
      <p>Lokacija: {anketa.lokacija}</p>
      <p>{anketa.opis}</p>

      <form className="anketa-form" onSubmit={spremiGlas}>
        <label htmlFor="glasanje-ime">Tvoje ime</label>
        <input
          id="glasanje-ime"
          type="text"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          readOnly={!uredujeGlas}
          required
        />

        <table>
          <thead>
            <tr>
              <th scope="col">Sudionik</th>
              {anketa.termini.map((termin) => (
                <th key={termin.termin_id} scope="col">
                  {formatirajTermin(termin)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ostali.map((sudionik) => (
              <tr key={sudionik.sudionik_id}>
                <th scope="row">{sudionik.ime}</th>
                {anketa.termini.map((termin) => {
                  const glas = sudionik.glasovi.find((g) => g.termin_id === termin.termin_id)
                  return (
                    <td key={termin.termin_id}>
                      {glas?.anketa_odgovor_id === odgovorDa ? (
                        <span style={{ color: 'green' }} role="img" aria-label="Može">✓</span>
                      ) : (
                        <span style={{ color: 'red' }} role="img" aria-label="Ne može">✗</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}

            <tr>
              <th scope="row">Tvoj odabir</th>
              {anketa.termini.map((termin) => (
                <td key={termin.termin_id}>
                  <input
                    type="checkbox"
                    aria-label={formatirajTermin(termin)}
                    checked={odabraniTermini.includes(termin.termin_id)}
                    onChange={(e) => promijeniTermin(termin.termin_id, e.target.checked)}
                    disabled={!uredujeGlas}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {uredujeGlas ? (
          <button className="anketa-submit" type="submit" disabled={!ime.trim()}>
            Spremi glas
          </button>
        ) : (
          <button
            className="anketa-submit"
            type="button"
            onClick={() => setUredujeGlas(true)}
          >
            Uredi glas
          </button>
        )}

        <p role="status">{!uredujeGlas && 'Glas je spremljen.'}</p>
      </form>
    </main>
  )
}

export default Glasanje
