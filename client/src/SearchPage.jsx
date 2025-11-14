import BarreRecherche from "./BarreRecherche";
import Logout from "./Logout";
import MessageList from "./MessageList";
import { useEffect, useState } from "react";
import axios from "axios";


function SearchPage({
    logout,
    handleProfil,
    login,
    listMessages,
    addList,
    search,
    recherche,
    setRecherche,
    dateDeb,
    setDateDeb,
    dateFin,
    setDateFin,
    getProfilUser,
    setProfilUser,
    page,
    userData
}){

    const [list, setList] = useState([]);

    
    useEffect(() => {

        const getSearchList = async () => {
            try {

                await axios.get('http://localhost:8000/api/messages')
                .then (res => {
                    if (res.request.status === 200) {
                        const list_res = res.data.filter((msg, index) => {
                            const [d1, m1, y1] = msg.date.split('-')
                            const [y2, m2, d2] = dateDeb.split('-')
                            const [y3, m3, d3] = dateFin.split('-')
                            const dateObj = new Date(`${y1}-${m1}-${d1}`)
                            const dateDebObj = new Date(`${y2}-${m2}-${d2}`)
                            const dateFinObj = new Date(`${y3}-${m3}-${d3}`)
                            const pseudo = msg.pseudo.toLowerCase()
                            const chercher = recherche.toLowerCase()
                            const content = msg.contenu.toLowerCase()

                            if (!isNaN(dateDebObj) && !isNaN(dateFinObj)) { // date debut et fin selectionnee
                                if ((dateObj >= dateDebObj) && (dateObj <= dateFinObj)) { // 
                                    return (pseudo === chercher) || (content.includes(chercher))

                                }

                                return false
                            }

                            if (isNaN(dateDebObj) && isNaN(dateFinObj)) {
                                // l'utilisateur n'a pas sélectionné de date
                                return (pseudo === chercher) || (content.includes(chercher))
                            
                            }
                            
                            if (!isNaN(dateDebObj)) {
                                if (dateObj >= dateDebObj) {
                                    return (pseudo === chercher) || (content.includes(chercher))
                                }

                                return false
                            }

                            if (!isNaN(dateFinObj)) {
                                if (dateObj <= dateFinObj) {
                                    return (pseudo === chercher) || (content.includes(chercher))
                                }

                                return false
                            }

                        })

                        setList(list_res)
                    }
                })
                .catch(e => {
                    console.log("Erreur : ", e)
                })
            } catch (e) {
                console.log("Erreur : ", e)
            }
        }

        getSearchList();

    }, [recherche])

    const messagesPublic = list.filter(msg => msg.public && !msg.comment)
    
    return(

        <div className="container">
    
            <header>
                
                <img src={"./src/images.png"} alt="Logo" id="logo"></img>
                
                <BarreRecherche recherche={recherche} setRecherche={setRecherche} dateDeb={dateDeb} setDateDeb={setDateDeb} dateFin={dateFin} setDateFin={setDateFin} search={search} />

                <div className="login-area">

                    <button onClick={login}>Accueil</button>
                    <Logout logout={logout}/>

                </div>

            </header>

            <div className="content-area">

                <div className="infos-area">

                    <h3>Informations</h3>

                    <nav className="infos-content">

                        <button onClick={getProfilUser}>Mon profil</button>
                    </nav>
                    
                    

                </div>

                <main>

                    <div className="msg-area">

                        <div className="title">
                            <h3>All messages</h3>
                        </div>

                        <MessageList messages={messagesPublic} 
                        page={page}
                        userData={userData}
                        setProfilUser={setProfilUser}
                        handleProfil={handleProfil}
                        addList={addList}/>

                    </div>

                </main>

            </div>

        </div>

    )
}


export default SearchPage;