import Message from "./Message";
import axios from 'axios'
import { useState, useEffect } from "react";


function MessageList ({messages, page, userData, setProfilUser, handleProfil, addList}) {

    return (
        <div className="list-msg">
            {messages && messages.length == 0 ? <p>No messages.</p> : 
                messages.map((msg, index) =>
                    <Message key={index} 
                    msg={msg} 
                    page={page}
                    userData={userData}
                    setProfilUser={setProfilUser}
                    handleProfil={handleProfil}
                    addList={addList} />
                )
            }
        </div>
    )
}

export default MessageList