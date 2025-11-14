import { useState, useEffect } from "react"
import BarreRecherche from "./BarreRecherche"
import Logout from "./Logout"
import MessageList from "./MessageList"
import './accueil-style.css'
import './accueiladmin-style.css'
import GestionInscrit from "./GestionInscrit"
import axios from "axios"


function AccueilAdmin ({
    page,
    logout,
    handleProfil,
    userData,
    login,
    listMessages,
    addList,
    search,
    setRecherche,
    setDateDeb,
    setDateFin,
    getProfilUser,
    setProfilUser
}) {
    const [champMsg, setChampMsg] = useState('');
    const [userList, setUserList]=useState([]); /*Pour récupérer la liste des users */


    useEffect(() => {
        const getListUsers = async () =>{
            try{

                await axios.get('http://localhost:8000/api/userList')
                .then((res)=>{
                    setUserList(res.data)

                })
                .catch((e)=>console.log("Erreur lors du axios dans GestionInscrit",e))

            }catch(e){
                console.log("Erreur : "+ e)
            }
        }

    

        getListUsers()
    

    },[]);


    const addMessage = () => {

        if (champMsg != "") {
            const message = document.getElementById("nouv_msg").value;
            const publicMsg = false; //le message est écrit sur le forum fermé
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
                
                <BarreRecherche search={search} setRecherche={setRecherche} setDateDeb={setDateDeb} setDateFin={setDateFin}/>

                <div className="login-area">

                    <button onClick={login}>Accueil</button>
                    <Logout logout={logout}/>

                </div>

            </header>

            <div className="content-area">

                <div className="infos-area">

                    

                    <nav className="infos-content">
                        <h3>Informations</h3>

                        <button onClick={getProfilUser}>Mon profil</button>
                    </nav>

                    <GestionInscrit userData={userData}/>

                </div>

                <main>

                    <div className="new-msg">
                        
                        <div className="title">
                            <h3>Entre admins</h3>
                        </div>

                        <div className="send-new-msg">
                            
                            <textarea id="nouv_msg" value={champMsg} placeholder="Ecrire un nouveau message ici..." onChange={evt => setChampMsg(evt.target.value)}/>
                            <input type="submit" value="Envoyer" id="envoyer" onClick={addMessage}/>

                        </div>

                    </div>

                    <div className="msg-area">

                        <div className="title">
                            <h3>All messages</h3>
                        </div>

                        <MessageList page={page} 
                        messages={listMessages}
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

export default AccueilAdmin
