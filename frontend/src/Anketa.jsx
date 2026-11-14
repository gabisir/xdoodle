import './App.css'
import { useState } from 'react'

function Anketa() {
  const [datum, setDatum] = useState('')

  return (
    <main className="anketa-page">
      <a className="back-link" href="/">
        &larr; Natrag na aplikaciju
      </a>
      <h1>Kreiraj anketu</h1>
      <form className="anketa-form">
        <label htmlFor="anketa-question">Naziv:</label>
        <input
          id="anketa-question"
          name="question"
          type="text"
          placeholder="Naziv"
        />

        <label htmlFor="anketa-option-one">Opcije: </label>
        <input
          id="anketa-option-one"
          name="lokacija"
          type="text"
          placeholder="upisi lokaciju"
        />
        <input
          id="anketa-option-two"
          name="opis"
          type="text"
          placeholder="dodatan opis"
        />

        <div>DIV ZA KALENDAR</div>

        <label htmlFor="anketa-datum">Odaberi datum</label>
        <input
          id="anketa-datum"
          name="datum"
          type="date"
          value={datum}
          onChange={(event) => setDatum(event.target.value)}
        />

      
      <div>DIV ZA DODATNE OPCIJE ANKETE</div>
      
        <button type="submit" className="anketa-submit">
          Kreiraj anketu
        </button>
      </form>

    </main>
  )
}

export default Anketa
