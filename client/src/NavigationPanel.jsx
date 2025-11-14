import Login from "./Login"
import Signin from "./Signin"
import Accueil from "./Accueil"
import Profil from "./Profil"
import AccueilAdmin from "./AccueilAdmin"
import SearchPage from "./SearchPage"

function NavigationPanel (
    {page,
    connect,
    logout,
    setUserData,
    userData,
    profil,
    adminPage,
    register,
    listMessages,
    messagesPrivate,
    addList,
    search,
    recherche,
    setRecherche,
    dateDeb,
    setDateDeb,
    dateFin,
    setDateFin,
    profilUser,
    setProfilUser,
    getProfilUser
}) {

    if (page === 'main_page'){ 
        return (
            <div>
                <Accueil 
                page={page} 
                logout={logout} 
                handleProfil={profil} 
                login={connect} 
                userData={userData} 
                listMessages={listMessages} 
                addList={addList}
                search={search}
                setRecherche={setRecherche}
                setDateDeb={setDateDeb}
                setDateFin={setDateFin}
                setProfilUser={setProfilUser}
                adminPage={adminPage}
                getProfilUser={getProfilUser}
                />
            </div>
        )
    }

    if (page === "admin_page") {
        return (
            <AccueilAdmin 
            page={page}
            logout={logout}
            login={connect} 
            handleProfil={profil} 
            userData={userData}
            listMessages={messagesPrivate} 
            addList={addList}
            search={search}
            setRecherche={setRecherche}
            setDateDeb={setDateDeb}
            setDateFin={setDateFin}
            getProfilUser={getProfilUser} 
            setProfilUser={setProfilUser}/>
        )
    }

    if (page === "profil_page") {
        return (
            <Profil
            page={page} 
            logout={logout} 
            login={connect}
            userData={profilUser}
            search={search}
            setRecherche={setRecherche}
            setDateDeb={setDateDeb}
            setDateFin={setDateFin}
            setProfilUser={setProfilUser}
            handleProfil={profil}
            addList={addList}
            listMessages={listMessages}
            />
        )
    }

    if (page == "search_page"){
        return(
            <SearchPage 
            logout={logout}
            handleProfil={profil}
            login={connect}
            listMessages={listMessages}
            addList={addList}
            search={search}
            recherche={recherche}
            setRecherche={setRecherche}
            dateDeb={dateDeb}
            setDateDeb={setDateDeb}
            dateFin={dateFin}
            setDateFin={setDateFin}
            getProfilUser={getProfilUser}
            setProfilUser={setProfilUser}
            page={page}
            userData={userData}
            />
        )
    }



    if (page === 'signin_page') {
        return (
            <Signin
            login={connect} 
            logout={logout}/>
        )
    }

    return (
        <Login
        connect={connect} 
        register={register} 
        setUserData={setUserData}/> /*la page par defaut est le login */
    ) 
}

export default NavigationPanel;