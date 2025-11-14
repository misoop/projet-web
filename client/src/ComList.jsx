
import Com from "./Com";


function ComList ({coms, handleProfil, userData, msg, setComsInfo, setProfilUser}) {

    return (
        <div className="list-msg">
            { coms.length > 0 ?
                coms.map ((com, index) => <Com key={index}
                handleProfil={handleProfil}
                userData={userData}
                com={com}
                msg={msg}
                setComsInfo={setComsInfo}
                setProfilUser={setProfilUser}/>)
            : <p>No comments.</p>}
        </div>
    )
}

export default ComList