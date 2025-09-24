import React from 'react'
import { useState } from 'react';

export const UserCard = ({user}) => {
    const{id,name,description}=user;
    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
        setIsVisible(!isVisible);
    };
    
  return (
    
        <div className='card' key={id}>
            <img className="imageuser" src="" alt="" />
            <h2 className="username">{name}</h2>
            <p className="description">{description}</p>
            <button id={id} onClick={()=>handleClick({name})}>
              {
                isVisible ? 'Ocultar' : 'Mostrar'
              }
            </button>
        </div>
    
  )
}

export default UserCard
