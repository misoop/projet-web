import { useState } from "react"
import BarreRecherche from "./BarreRecherche"
import Logout from "./Logout"
import MessageList from "./MessageList"
import './accueil-style.css'
import axios from "axios"


function Accueil ({page,
    logout,
    handleProfil,
    userData,
    listMessages,
    addList,
    search,
    setRecherche,
    setDateDeb,
    setDateFin,
    setProfilUser,
    adminPage,
    getProfilUser

}) {
    const [champMsg, setChampMsg] = useState('');


    const addMessage = () => {

        if (champMsg != "") {
            const message = document.getElementById("nouv_msg").value;
            const publicMsg = true; //le message est écrit sur le forum ouvert
            axios.post('http://localhost:8000/api/user/' + userData.pseudo + '/messages', {message, publicMsg})
            .then (res => {
                if (res.data.status === 200) {
                    axios.get('http://localhost:8000/api/messages')
                    .then ((res) => {
                        addList(res.data.reverse())
                    })
                    .catch((e) => console.log(e))
                }
            })
            .catch (e => {
                if (e.response) {
                    console.log(e.response)
                } else {
                    console.log("Erreur : " + e)
                }
            })
            
            // Reanitialiser le champ de message
            setChampMsg('');
            
        }
    
    }

    return (
        <div className="container">
    
            <header>
                
                <img src={"./src/images.png"} alt="Logo" id="logo"></img>
                
                <BarreRecherche search={search} setRecherche={setRecherche} setDateDeb={setDateDeb} setDateFin={setDateFin} />

                <div className="login-area">

                    <Logout logout={logout}/>

                </div>

            </header>

            <div className="content-area">

                <div className="infos-area">

                    <h3>Informations</h3>

                    <nav className="infos-content">
                        <button onClick={getProfilUser}>Mon profil</button>
                        {userData.admin && <button onClick={adminPage}>Forum fermé</button>}
                    </nav>

                </div>

                <main>

                    <div className="new-msg">
                        
                        <div className="title">
                            <h3>What's on your mind ?</h3>
                        </div>

                        <div className="send-new-msg">
                            
                            <textarea id="nouv_msg" value={champMsg} placeholder="Ecrire un nouveau message ici..." onChange={(evt) => {setChampMsg(evt.target.value)}}/>
                            <input type="submit" value="Envoyer" id="envoyer" onClick={addMessage}/>

                        </div>

                    </div>

                    <div className="msg-area">

                        <div className="title">
                            <h3>All messages</h3>
                        </div>

                        <MessageList messages={listMessages}
                        page={page} 
                        userData={userData}
                        setProfilUser={setProfilUser}
                        handleProfil={handleProfil}
                        addList={addList} />

                    </div>

                </main>

            </div>

        </div>
    )
}

export default Accueil