import React from 'react'
import {useEffect,useState} from 'react';

export const Extractuser = () => {
   const [users,setUsers]=useState([]);
   useEffect(()=>{
    //llamada a la api
    fetch('https://dummyjson.com/users')
    .then(res=>res.json())
    .then(data=>setUsers(data))
   },[])
  return (
    <div>
        <h3>usuarios</h3>
        <ul>
            {users.map(user=>(
                <li key={user.id}>{user.firstName} {user.lastName}</li>
            ))}
        </ul>
      
    </div>
  )
}

export default Extractuser
