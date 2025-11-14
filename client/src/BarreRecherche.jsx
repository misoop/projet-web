import { useState, useRef } from "react";


function BarreRecherche ({
    search,
    setRecherche,
    setDateDeb,
    setDateFin

}) {

    const [chercher, setChercher] = useState('')
    const [debut, setDebut] = useState('');
    const [fin, setFin] = useState('')

    const searchOnClick = () => {
        setRecherche(chercher); // on stocke dans "recherche" l'element recherche par l'utilisateur
        setDateDeb(debut);
        setDateFin(fin);

        
        search();

        setChercher('')
    }

    return (
        <div className="search-area">

            <input type="search" id="recherche" placeholder="Rechercher ici..." value={chercher} onChange={evt => setChercher(evt.target.value)}/>
            <button onClick={searchOnClick}>Rechercher</button>

            <div className="search-date">

                <div>
                    <label htmlFor="start-date">start-date: </label>
                    <input type="date" className="date-input" id="start-date" name="start-date" placeholder="Date de début"  value={debut} onChange={evt => setDebut(evt.target.value)}/>
                </div>
                
                <div>
                    <label htmlFor="start-date">end-date: </label>
                    <input type="date" className="date-input" id="end-date" name="end-date" placeholder="Date de fin"  value={fin} onChange={evt => setFin(evt.target.value)}/>
                </div>
            </div>

        </div>
    )
}

export default BarreRecherche