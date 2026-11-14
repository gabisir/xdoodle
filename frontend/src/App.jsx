import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { useState } from 'react'
import './App.css'
import Anketa from './Anketa.jsx'
import Glasanje from './Glasanje.jsx'
import Moje_ankete from './Moje_ankete.jsx'

function App() {
  // const [count, setCount] = useState(0)

  if (window.location.pathname === '/anketa') {
    return <Anketa />
  }
  if (window.location.pathname === '/glasanje') {
    return <Glasanje />
  }
  if (window.location.pathname === '/moje_ankete') {
    return <Moje_ankete/>
  }

  return (
    <div className='centerdiv'>
      <h1>My Doodle</h1>
      <br />
      <div className='centerdiv'>

        <a className="anketa-link" href="/anketa">
          Kreiraj anketu
        </a>
        <br></br>
        <a className="anketa-link" href="/glasanje">
          Isprobaj glasanje
        </a>
        <br></br>
        <a className="anketa-link" href="/moje_ankete">
          moje ankete
        </a>
      </div>
    </div>
  )
}

export default App
