import '../Section/Section.css'

import UserCard from '../userCard/UserCard';
const user=[
  {
    id:1,
    name:"Cristian",
    description:'soy un desarrollador web'
  }
]

export const Section = () => {
  
 

  
  return (
    <section>
      {
        user.map((user) => (
          <UserCard key={user.id} user={user} />
        ))
      }
    </section>    
   
  )
}

export default Section
