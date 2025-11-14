
import User from "./User"

function UserList({userList, userData, update}){

    return(
        <div className="user-list">
            {userList.length == 0 ? <p>No Users.</p> : 
                userList.map((user,index)=>
                <User key={index}
                user={user}
                userData={userData}
                update={update}/>)
            }
        </div>
    )
};

export default UserList;