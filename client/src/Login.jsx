import React from 'react'
import { useState , useEffect} from "react"
import './login-style.css'
import axios from 'axios'


function Login ({connect, register, setUserData}) {
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(false);

     const HandleSubmit = async (evt) => {
        evt.preventDefault();

        await axios.post('http://localhost:8000/api/user/login', {login, password})
        .then (res => {
            if (res.data.status === 200) {
                setUserData(res.data.user)

                if (res.data.user.membre) {
                    connect()

                } else {
                    alert("Votre inscription n'a pas été validé par un administrateur, revenez plus tard.")
                }
                
            }
        })
        .catch (e => {
            if (e.response && (e.response.status === 400 || e.response.status === 401 || e.response.status === 403)) {
                setError(true)

                if (!error) { // autre erreur : 500
                    console.log(e)
                }

            } else {
                console.log(e)
            }
        })
    }   

    return (

        <div className="connexion">

            <form className="login-form" method='POST' action='api/user/login'>

                <h1>Login</h1>
                
                <input type="text" id="Login" placeholder="Pseudo" onChange={(event) => {setLogin(event.target.value);}}></input>
                <input type="password" id="Mot_de_passe" placeholder="Password" onChange={(event) => {setPassword(event.target.value)}}></input>

                <input type="submit" value="Connexion" onClick={HandleSubmit}></input>
                {error && <p style={{color: "red"}}>Erreur: pseudo ou mot de passe invalide</p>}

            </form>

            <div className="sign-in">
                <p>Don't have an account ?</p>
                <button id="btn-enreg" onClick={register}>Sign in</button>
            </div>

        </div>

    )
}


export default Login