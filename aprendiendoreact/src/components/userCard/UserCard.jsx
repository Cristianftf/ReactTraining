import React from 'react'
import { useState } from 'react';

export const UserCard = ({user}) => {
    const{id,firstname,email}=user;
    const [isVisible, setIsVisible] = useState(false);
    const [address,setaddress]=useState('');

    const handleClick = () => {
        setaddress({...address,city:'medellin',country:'colombia'});
        setIsVisible(!isVisible);
    };
    
  return (
    
        <div className='card' key={id}>
            <img className="imageuser" src="" alt="" />
            <h2 className="username">{firstname}</h2>
            <p className="description">{email}</p>
            <button id={id} onClick={()=>handleClick({name})}>
              {
                isVisible ? 'Ocultar' : 'Mostrar'
              }
            </button>
        </div>
    
  )
}

export default UserCard
