import './App.css'

function Anketa() {
  return (
    <main className="poll-page">
      <a className="back-link" href="/">
        &larr; Back to app
      </a>
      <h1>Create a poll</h1>
      <form className="poll-form">
        <label htmlFor="poll-question">Naziv:</label>
        <input
          id="poll-question"
          name="question"
          type="text"
          placeholder="Naziv"
        />

        <label htmlFor="poll-option-one">Opcije: </label>
        <input
          id="poll-option-one"
          name="lokacija"
          type="text"
          placeholder="upisi lokaciju"
        />
        <input
          id="poll-option-two"
          name="opis"
          type="text"
          placeholder="dodatan opis"
        />

      <div>DIV ZA KALENDAR</div>
      <div>DIV ZA DODATNE OPCIJE ANKETE</div>
      
        <button type="submit" className="poll-submit">
          Create poll
        </button>
      </form>

    </main>
  )
}

export default Anketa
