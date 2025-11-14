import axios from "axios"

function User ({user, userData, update}) {

    const handleAdmin = async () => {
        try {
            const status = user.admin

            await axios.post('http://localhost:8000/api/user/gestion/admins/' + user.pseudo, {status})
            .then (async res => {
                if (res.data.status === 200) {
                    update()
                }
            })
            .catch(e => console.log("Erreur : ", e))

        } catch (e) {
            console.log("Erreur dans le handleAdmin : ", e);
        }
    }

    const handleMembre = async () => {
        try {
            const status = user.membre
            await axios.post('http://localhost:8000/api/user/gestion/membres/' + user.pseudo, {status})
            .then (async res => {
                if (res.data.status === 200) {
                    update()
                }
            })
            .catch(e => console.log("Erreur : ", e))

        } catch (e) {
            console.log("Erreur dans le handleMembre : ", e);
        }
    }

    const handleReqOK = async () => {
        try {
            handleMembre()

        } catch (e) {
            console.log("Erreur : ", e);
        }
    }

    const handleReqNO = async () => {
        try {
            await axios.delete('http://localhost:8000/api/user/' + user.pseudo)

            update()

        } catch (e) {
            console.log("Erreur : ", e);
        }
    }

    return(
        <div className="user">
            <div className="head">
                <h4>{user.pseudo}</h4>
            </div>
            
                {user.pseudo==userData.pseudo ? ""  //Pour ne pas se retier l'admin à soit même
                :

                    !user.membre ? 
                        <div className="action req">
                            <button onClick={handleReqOK}>Accept</button>
                            <button onClick={handleReqNO}>Decline</button>
                        </div>
                    : 
                        !user.admin ? 
                            <div className="action member">
                                <button onClick={handleAdmin}>admin</button> 
                            </div>
                    :       <div className="action admin">
                                <button onClick={handleAdmin}>no admin</button>
                            </div>
                
                } 
                
            
        </div>
    )
};


export default User;