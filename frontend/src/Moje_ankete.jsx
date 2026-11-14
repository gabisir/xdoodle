import { useState } from 'react'
import './App.css'

function Moje_ankete() {

return (
<main class="moja-anketa-page">
    <a class="back-link" href="/">Natrag na aplikaciju</a>
    <h1>Moje ankete</h1>
    <p>Lista anketa korisnika K, idejno dodat jos nesto pored naziva, za sad neznam sta tocno: lokaciju, datum kreiranja, broj glasova na anketi... </p>
    <ul class='no-bullets'>
        <li class='moja-anketa-li'>
            <div class='moja-anketa-info'>
                <h2>Proslava rodendana</h2>
                <h2 class='moja-anketa-desno'> desno info</h2>
            </div>
        </li>
        <li class='moja-anketa-li'>
            <div class='moja-anketa-info'>
                <h2>Projekt sastanak</h2>
                <h2 class='moja-anketa-desno'> br glasova:2</h2>
            </div>
        </li>
        <li class='moja-anketa-li'>
            <div class='moja-anketa-info'>
                <h2>TEST t</h2>
                <h2 class='moja-anketa-desno'> lokacija: Lokacija moja</h2>
            </div>
        </li>
    </ul>
</main>
)
}

export default Moje_ankete