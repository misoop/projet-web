import ComList from "./ComList"
import { useState, useEffect } from "react"
import axios from "axios"


function Message ({msg, page, userData, setProfilUser, handleProfil, addList}) {
    const [com, setCom] = useState('')
    const [comsInfo, setComsInfo] = useState([])
    const [see, setSee] = useState(false)
    const [add, setAdd] = useState(false)
    const [likes, setLikes] = useState(0) 
    const [liked, setLiked] = useState(false)

    
    useEffect (() => {
        const getListReponse = async () => {
            try {
                await axios.get('http://localhost:8000/api/message/' + msg._id + '/reponses')
                .then (async (res) => {
                    let list = []
                    let info = {}

                    for (let i = 0; i < res.data.length; i++) {
                        info = await axios.get('http://localhost:8000/api/message/' + res.data[i])
                        list.push(info.data)
                    }

                    setComsInfo(list.reverse())

                    await axios.get('http://localhost:8000/api/message/' + msg._id + '/likes')
                    .then (res => {
                        setLikes(res.data.length)

                        if ((typeof(userData) !== 'undefined') && res.data.includes(userData.pseudo)) {
                            setLiked(true)
        
                        } else {
                            setLiked(false)
                        }
                    })
                    .catch (e => console.log(e))
                })
                .catch((e) => console.log(e))

            } catch (e) {
                console.log("Erreur : " + e)
            }
        }

        getListReponse()
    }, [])
    

    const addLikes = async () => {
        try {
            const pseudo = userData.pseudo
            await axios.post('http://localhost:8000/api/message/' + msg._id + '/likes', {pseudo})
            .then(async res => {

                await axios.get('http://localhost:8000/api/message/' + msg._id + '/likes')
                .then (res => {
                    setLikes(res.data.length)

                    if ((typeof(userData) !== 'undefined') && res.data.includes(userData.pseudo)) {
                        setLiked(true)
    
                    } else {
                        setLiked(false)
                    }
                })
                .catch (e => console.log(e))
            })
            .catch(e => {
                console.log("Erreur : ", e)
            })

        } catch (e) {
            console.log("Erreur : ", e)
        }
    }


    const getProfilUser = () => {
        try {
            axios.get('http://localhost:8000/api/user/' + msg.pseudo)
            .then (res => {
                setProfilUser(res.data)
                handleProfil()
            })
            .catch(e => console.log("Erreur : ", e))
        } catch (e) {
            console.log("Erreur : " + e)
        }
        
    }

    const deleteMessage = () => {
        const reponse = window.confirm("Etes-vous sûr(e) de vouloir supprimer ce message ? Cette action aura des conséquences irrévocables.");

        if (reponse) {
            axios.delete('http://localhost:8000/api/message/' + msg._id)
            .then(async res => {
                if (res.data.status === 200) {
                    console.log("Suppression du message réussie !")

                    await axios.get('http://localhost:8000/api/messages')
                    .then ((res) => {
                        addList(res.data.reverse())
                    })
                    .catch((e) => console.log(e))

                }
                
            })
            .catch(e => {

                if (e.response && e.response === 401) {
                    console.log("Erreur : tentative de suppression d'un message inexistant !")
                } else {
                    console.log("Erreur : ", e)
                }
            })
        }
    }

    var seeComs = () => {
        if (see) {
            setSee(false)

        } else {
            setSee(true)
        }
    }

    var ajoutCom = () => {
        setAdd(!add)
    }

    var addCom = async () => {
        
        if (com != "") {
            const contenu = document.getElementById("nouv_com").value
            const msgid = msg._id
            const pseudo = userData.pseudo
            const publicMsg = msg.public // si le message est public le commentaire aussi
            const id_com = await axios.post('http://localhost:8000/api/user/' + msg.pseudo + '/messages/reponses', {pseudo, publicMsg, contenu, msgid})
            
            await axios.get('http://localhost:8000/api/message/' + msg._id + '/reponses')
                .then (async (res) => {
                    let list = []
                    let info = {}

                    for (let i = 0; i < res.data.length; i++) {
                        info = await axios.get('http://localhost:8000/api/message/' + res.data[i])
                        list.push(info.data)
                    }

                    setComsInfo(list.reverse())
                })
                .catch (e => console.log("Erreur : ", e))
            
            setCom('')
            
        }
        
    }

    return (
        <div className="msg">

            <div className="msg-info">

                <div className="msg-user">
                    <button onClick={getProfilUser}>{msg.pseudo}</button>
                </div>

                <div className="msg-date">
                    <span className="msg-date">{msg.date} à {msg.temps}</span>
                </div>

            </div>

            <div className="msg-content">
                {msg.contenu}

                <div className="msg-icon">
                    <div className="notif">
                        <span className={`uil uil-heart ${liked ? 'couleur-rouge' : ''}`} id="like" onClick={addLikes}></span>
                        <small id="notif-like">{likes}</small>
                    </div>

                    {(typeof(userData) !== 'undefined') && (userData.admin || (msg.pseudo === userData.pseudo)) && <span className="uil uil-trash" id="trash" onClick={deleteMessage}></span>}

                </div>
            </div>

            {page !== 'profil_page' && <button className="reply-button-com" onClick={ajoutCom}>Add a comment</button>}
            {add &&
                <div className="send-new-com">
                            
                    <textarea id="nouv_com" value={com} placeholder="Ecrire un commentaire ici..." onChange={evt => setCom(evt.target.value)}/>
                    <input type="submit" value="Envoyer" id="envoyer" onClick={addCom}/>

                </div>
            }
            <button className="see-coms" onClick={seeComs}>See comments</button>
            {
                see &&
                <ComList coms={comsInfo} 
                handleProfil={handleProfil}
                userData={userData}
                msg={msg}
                setComsInfo={setComsInfo}
                setProfilUser={setProfilUser}/>
            }

        </div>
    )
}

export default Message 