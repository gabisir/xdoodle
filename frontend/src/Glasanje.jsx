import { useState } from 'react'
import './App.css'

// Primjer podataka za isprobavanje stranice dok se ne spoji backend.
const anketa = {
  naziv: 'Dogovor za sastanak',
  lokacija: 'FER',
  opis: 'Označi sve termine u kojima možeš doći.',
  termini: [
    { id: 1, datum: 'Pon, 16. 11.', vrijeme: '14:00-15:00' },
    { id: 2, datum: 'Uto, 17. 11.', vrijeme: '15:00-16:00' },
    { id: 3, datum: 'Sri, 18. 11.', vrijeme: '12:00-13:00' },
  ],
  glasovi: [
    { id: 1, ime: 'Ana', termini: [1, 3] },
    { id: 2, ime: 'Luka', termini: [2, 3] },
  ],
}

function Glasanje() {
  const [ime, setIme] = useState('')
  const [odabraniTermini, setOdabraniTermini] = useState([])
  const [uredujeGlas, setUredujeGlas] = useState(true)

  function promijeniTermin(id, oznacen) {
    setOdabraniTermini((trenutni) =>
      oznacen ? [...trenutni, id] : trenutni.filter((terminId) => terminId !== id),
    )
  }

  function spremiGlas(event) {
    event.preventDefault()

    if (!ime.trim()) return

    setUredujeGlas(false)
  }

  return (
    <main className="anketa-page">
      <a className="back-link" href="/">Natrag na aplikaciju</a>

      <h1>{anketa.naziv}</h1>
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
                <th key={termin.id} scope="col">
                  {termin.datum} {termin.vrijeme}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {anketa.glasovi.map((glas) => (
              <tr key={glas.id}>
                <th scope="row">{glas.ime}</th>
                {anketa.termini.map((termin) => (
                  <td key={termin.id}>
                    {glas.termini.includes(termin.id) ? (
                        <span style={{ color: 'green' }} role="img" aria-label="Može">✓</span>
                    ) : (
                        <span style={{ color: 'red' }} role="img" aria-label="Ne može">✗</span>
                    )}
                  </td>
                ))}

              </tr>
            ))}

            <tr>
              <th scope="row">Tvoj odabir</th>
              {anketa.termini.map((termin) => (
                <td key={termin.id}>
                  <input
                    type="checkbox"
                    aria-label={termin.datum + ' ' + termin.vrijeme}
                    checked={odabraniTermini.includes(termin.id)}
                    onChange={(e) => promijeniTermin(termin.id, e.target.checked)}
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

        <p role="status">
          {!uredujeGlas && 'Glas je spremljen do osvježavanja stranice.'}
        </p>
      </form>
    </main>
  )
}

export default Glasanje