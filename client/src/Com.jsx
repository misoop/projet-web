import { useState, useEffect } from "react"
import axios from 'axios'

function Com ({com,
    handleProfil,
    userData,
    msg,
    setComsInfo,
    setProfilUser}) {
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)

    useEffect (() => {
        const getLikes = async () => {
            try {
                await axios.get('http://localhost:8000/api/message/' + com._id + '/likes')
                .then (res => {
                    setLikes(res.data.length)

                    if ((userData) && res.data.includes(userData.pseudo)) {
                        setLiked(true)
    
                    } else {
                        setLiked(false)
                    }
                })
                .catch (e => console.log(e))
                
            } catch (e) {
                console.log("Erreur : ", e)
            }
        }

        getLikes()

    }, [])


    const getProfilUser = () => {
        try {
            axios.get('http://localhost:8000/api/user/' + com.pseudo)
            .then (res => {
                setProfilUser(res.data)
                handleProfil()
            })
            .catch(e => console.log("Erreur : ", e))
        } catch (e) {
            console.log("Erreur : " + e)
        }
        
    }


    const addLikes = async () => {
        try {
            const pseudo = userData.pseudo
            await axios.post('http://localhost:8000/api/message/' + com._id + '/likes', {pseudo})
            .then(async res => {
                await axios.get('http://localhost:8000/api/message/' + com._id + '/likes')
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

    const deleteCom = () => {
        const reponse = window.confirm("Etes-vous sûr(e) de vouloir supprimer ce commentaire ? Cette action aura des conséquences irrévocables.");

        if (reponse) {
            axios.delete('http://localhost:8000/api/message/' + msg._id + '/reponse/' + com._id)
            .then(async res => {
                if (res.data.status === 200) {
                    let list = []
                    await axios.get('http://localhost:8000/api/message/' + msg._id + '/reponses')
                    .then (async (res) => {
                        let info = {}

                        for (let i = 0; i < res.data.length; i++) {
                            info = await axios.get('http://localhost:8000/api/message/' + res.data[i])
                            list.push(info)
                        }

                        setComsInfo(list)
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

    return (
        <div className="com">
            <div className="msg-info-com">

                <div className="msg-user">
                    from: <button onClick={getProfilUser}>{com.pseudo}</button>
                </div>

                <div className="msg-date">
                    date: <span className="msg-date">{com.date} à {com.temps}</span>
                </div>

            </div>

            <div className="msg-content">
                {com.contenu}

                <div className="msg-icon">
                    <div className="notif">
                        <span className={`uil uil-heart ${liked ? 'couleur-rouge' : ''}`} id="like" onClick={addLikes}></span>
                        <small id="notif-like">{likes}</small>
                    </div>

                    {(typeof(userData) !== 'undefined') && (userData.admin || (com.pseudo === userData.pseudo)) && <span className="uil uil-trash" id="trash" onClick={deleteCom}></span>}

                </div>
            </div>
        </div>
    )
}

export default Com