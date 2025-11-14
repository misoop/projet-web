import MessageList from "./MessageList"
import BarreRecherche from "./BarreRecherche"
import Logout from "./Logout"
import './profil-style.css'


function Profil ({page,
    logout,
    login,
    userData,
    search,
    setRecherche,
    setDateDeb,
    setDateFin,
    setProfilUser,
    handleProfil,
    addList,
    listMessages
    }) {

    const messagesPublic = listMessages.filter(msg=>msg.public && !msg.comment && (userData.pseudo === msg.pseudo))

    return (
        <div className="container_main">
    
            <header>

                <img src="./src/images.png" alt="Logo" id="logo"/>
                
                <BarreRecherche search={search} setRecherche={setRecherche} setDateDeb={setDateDeb} setDateFin={setDateFin} />

                <div className="login-area">

                    <button onClick={login}>Accueil</button>
                    <Logout logout={logout}/>

                </div>

            </header>

            <div className="container_pro">

                <div className="title-pro">

                    <h3>Welcome to @{userData.pseudo}'s profile !</h3>

                </div>

                <main id="main_pro">

                    <aside>

                        <section className="basic-info">

                            <img src="https://i.pinimg.com/564x/f2/cc/84/f2cc84282a7eaacba5aa4f5efaa758c5.jpg" alt="Photo de profil" id="pdp"/>

                            <h3>{userData.prenom}</h3>

                            {userData.admin ? <p>Admin</p> : <p>Member</p>}

                        </section>

                    </aside>

                    <div className="principal">
                    
                        <section className="more-info">

                            <div className="pers-info sns-pad-bot">
                                <h4>Full name</h4>
                                <p>{userData.prenom} {userData.nom}</p>
                            </div>

                            <div className="pers-info sns-pad-bot">
                                <h4>Email</h4>
                                <p>{userData.email}</p>
                            </div>

                            <div className="pers-info">
                                <h4>Inscription</h4>
                                <p>{userData.date}</p>
                            </div>

                        </section>

                        <div className="title-pro">

                            <h3>Messages</h3>
                    
                        </div>

                        <div className="msg-pro">
                            <MessageList page={page} 
                            messages={messagesPublic}
                            userData={userData}
                            setProfilUser={setProfilUser}
                            handleProfil={handleProfil}
                            addList={addList}/>
                        </div>

                    </div>

                </main>

            </div>

        </div>
    )
}

export default Profil