import React from 'react'
import { useState } from "react"
import './enreg-style.css'
import axios from 'axios'


function Signin (props) {
    const [nom, getNom] = useState();
    const [prenom, getPrenom] = useState();
    const [pseudo, getPseudo] = useState();
    const [email, getEmail] = useState();
    const [password, getPassword] = useState();
    const [repassword, getRePassword] = useState();
    const [matchedpwd, setMatchedPwd] = useState(true);
    const [conflict, setConflict] = useState(false);
    const [empty, setEmpty] = useState(false);


    const HandleMatchedPwd = (evt) => {
        evt.preventDefault();

        setConflict(false);
        setEmpty(false);

        if (password != repassword) {
            setMatchedPwd(false);

        } else {
            setMatchedPwd(true);
            
            axios.put('http://localhost:8000/api/user', {nom, prenom, pseudo, email, password})
            .then (res => {
                if (res.data.status == 201) {
                    alert("Inscription pris en compte. Attendez qu'un administrateur valide votre inscription.")
                }
            })
            .catch(e => {
                if (e.response) {
                    if (e.response.status === 400) {
                        setEmpty(true)
                    }
    
                    if (e.response.status === 409) {
                        setConflict(true)
                    }

                    if (!empty || !conflict) { // autre erreur : 500
                        console.log(e)
                    }
                } else {
                    console.log(e);
                }
            })
        }
    }
    

    return (
        <div className="register">
            <form className="enreg" method='PUT' action='/api/user'>

                <h1>Sign Up</h1>

                <div className="name-area">
                    <input type="text" id="Firstname" placeholder="Firstname" onChange={(event) => {getPrenom(event.target.value);}}/>
                    <input type="text" id="Lastname" placeholder="Lastname" onChange={(event) => {getNom(event.target.value);}}/>
                </div>

                <input type="email" id="mail" placeholder="Email" onChange={(event) => {getEmail(event.target.value);}}/>
                <input type="text" id="Login" placeholder="Pseudo" onChange={(event) => {getPseudo(event.target.value);}}/>
                <input type="password" id="Pswd" placeholder="Password" onChange={(event) => {getPassword(event.target.value)}}/>
                <input type="password" id="Retapez" placeholder="Confirm password" onChange={(event) => {getRePassword(event.target.value)}}/>

                <input type="submit" value="OK" onClick={HandleMatchedPwd}/>

                {!matchedpwd && <p style={{color: "red"}}>Erreur: mots de passe differents.</p>}
                {conflict && <p style={{color: "red"}}>Erreur: pseudo ou email déjà existant</p>}
                {empty && <p style={{color: "red"}}>Erreur: champs à compléter</p>}

            </form>

            <div className="sign-in">
                <p>Already have an account ?</p>
                <button id="btn-enreg" onClick={props.logout}>Log in</button>
            </div>
        </div>
        

    )
}

export default Signin