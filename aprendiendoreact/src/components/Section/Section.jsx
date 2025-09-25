import '../Section/Section.css'
import  useEffect  from 'react';
import UserCard from '../userCard/UserCard';
import useState from 'react';


const user=[
  {
    id:1,
    name:"Cristian",
    description:'soy un desarrollador web'
  }
]


//el useEffect se utiliza para manejar los ciclos de vida de los componentes
//el primer parametro es una funcion que se va a ejecutar cuando el componente se monte, actualice o desmonte
//el segundo parametro es un array de dependencias, si el array esta vacio, la funcion se ejecuta solo cuando el componente se monta
//si el array tiene dependencias, la funcion se ejecuta cuando alguna de las dependencias cambia
//si no se pone el segundo parametro, la funcion se ejecuta cada vez que el componente se renderiza
//el useEffect puede retornar una funcion que se ejecuta cuando el componente se desmonta

export const Section = () => {
const[count,setCount]=useState(0);
const[likes,setLikes]=useState(0);

  useEffect(()=>{
  fetch('https://dummyjson.com/users')
  .then(res=>res.json())
  .then(console.log)
   
},[count,likes])

const handleClick=()=>{
  setCount(count+1);
} 

 const handleIncreaseLikes=()=>{
  setLikes(likes+1);
 }

  
  return ( 
    <div>
      <h2>{count}</h2>
      <button onClick={handleClick}>contador</button>
      <h2>{likes}</h2>
      <button onClick={handleIncreaseLikes}>aumentar likes</button>

      <section>
        {
          user.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        }
      </section>
    </div>
       
   
  )
}

export default Section
