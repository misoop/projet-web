import './accueil-style.css'
import BarreRecherche from './BarreRecherche'
import Logout from './Logout'
import UserList from './UserList'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import User from './User'


function GestionInscrit ({userData}) {

    const [searchTerm, setSearchTerm] = useState('');
    const [listType, setListType] = useState('member');


    const [adminList, setAdminList] = useState([])
    const [memberList, setMemberList] = useState([])
    const [reqList, setReqList] = useState([])


    useEffect(() => {
        const getListUsers = async () => {
            try {
                updateMembres()

                await axios.get('http://localhost:8000/api/users/requests')
                .then (res => {
                    if (res.request.status === 200 ) {
                        setReqList(res.data)
                    }
                })

            } catch(e) {
                console.log("Erreur : "+ e)
            }
        }

        getListUsers()

    }, []); //[userList]


    const updateAdmins = async () => {
        try {
            setListType('admin')
            await axios.get('http://localhost:8000/api/users/admins')
            .then (res => {
                if (res.request.status === 200 ) {
                    setAdminList(res.data)
                }
            })

        } catch (e) {
            console.log("Erreur : ", e)
        }
    }

    const updateMembres = async () => {
        try {
            setListType('member')
            await axios.get('http://localhost:8000/api/users/membres')
            .then (res => {
                if (res.request.status === 200 ) {
                    setMemberList(res.data)
                }
            })

        } catch (e) {
            console.log("Erreur : ", e)
        }
    }

    const updateReq = async () => {
        try {
            setListType('request')
            await axios.get('http://localhost:8000/api/users/requests')
            .then (res => {
                if (res.request.status === 200 ) {
                    setReqList(res.data)
                }
            })

        } catch (e) {
            console.log("Erreur : ", e)
        }
    }

    const renderUserList = () => {
        if (listType === 'member') {
            const filteredUsers = memberList.filter(user =>
                user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return (
                <UserList userList={filteredUsers} userData={userData} update={updateMembres} />
            );
        }
        
        if (listType === 'admin') {
            const filteredUsers = adminList.filter(user =>
                user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return (
                <UserList userList={filteredUsers} userData={userData} update={updateAdmins}/>
            );

        } else if(listType=="request"){
            const filteredUsers = reqList.filter(user =>
                user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            return(
                <UserList userList={filteredUsers} userData={userData} update={updateReq}/>
            )
        }
    };

    const SearchUsers = (evt)=>{
        setSearchTerm(evt.target.value);

    }


    return (

        <div className='gestion-container'>
            <h3>Members</h3>

            <div className='search-bar'>
                <span className='uil uil-search'></span>
                <input type="search" placeholder="Search members" onChange={SearchUsers}/>
            </div>

            <div className='category'>

                <h5 className={listType=="member"? "active" : ""} onClick={updateMembres} >Members</h5>
                <h5 className={listType=="admin"? "active" : ""} onClick={updateAdmins}>Admin</h5>
                <h5 className={listType=="request"? "active" : ""} id="request" onClick={updateReq}>Requests({reqList.length})</h5>
    
            </div>

            
            {renderUserList()}

        </div>
    )
}

export default GestionInscrit;