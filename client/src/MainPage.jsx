import { useState, useEffect } from "react"
import NavigationPanel from "./NavigationPanel"
import axios from 'axios'

function MainPage () {
    const [currentPage, setCurrentPage] = useState('login_page');
    const [userData, setUserData] = useState({});
    const [messages, setMessages] = useState([]);
    const [profilUser, setProfilUser] = useState({})

    /*Pour gérer la barre de recherche */

    const[recherche, setRecherche]=useState("");
    const[dateDeb, setDateDeb]=useState('');
    const[dateFin, setDateFin]=useState('');

    /***************************************** */

    //Pour récupérer la liste des messages dans la base de données
    // afficher les messages "par defaut"
    useEffect( () => {
        const getListMessage = async () => {
            try {
                await axios.get('http://localhost:8000/api/messages')
                .then ((res) => {
                    setMessages(res.data.reverse())
                })
                .catch((e) => console.log(e))
            } catch (e) {
                console.log("Erreur : " + e)
            }
        }

        getListMessage()
    }, []) 

    const messagesPublic = messages.filter(msg=>msg.public);
    const messagesPrivate = messages.filter(msg=>msg.public===false);

    const getProfilUser = () => {
        try {
            setProfilUser(userData)
            getProfil()
        } catch (e) {
            console.log("Erreur : " + e)
        }
    }
   
    var getConnected = () => { 
        setCurrentPage('main_page');
        console.log('accueil page');
    }

    var getLogout = () => {
        setCurrentPage('login_page')
        setUserData({});
        console.log('login page')
    }

    var getProfil = () => {
        setCurrentPage('profil_page')
        console.log('profile page')
    }

    var getRegister = () => {
        setCurrentPage('signin_page')
        console.log('signin page')
    }

    var getSearchPage = () => {
        setCurrentPage("search_page")
        console.log("Page de recherche")
    }

    var getForumAdmin = () => {
        setCurrentPage("admin_page")
        console.log("admin page")
    }

    return (
        <div>
            <NavigationPanel page={currentPage} 
            connect={getConnected} 
            logout={getLogout} 
            setUserData={setUserData}
            userData={userData}
            profil={getProfil} 
            adminPage={getForumAdmin}
            register={getRegister} 
            listMessages={messagesPublic}
            addList={setMessages}
            messagesPrivate={messagesPrivate} 
            search={getSearchPage}
            recherche={recherche}
            setRecherche={setRecherche}
            dateDeb={dateDeb}
            setDateDeb={setDateDeb}
            dateFin={dateFin}
            setDateFin={setDateFin}
            profilUser={profilUser}
            setProfilUser={setProfilUser}
            getProfilUser={getProfilUser}
            />
        </div>
    )
}

export default MainPage