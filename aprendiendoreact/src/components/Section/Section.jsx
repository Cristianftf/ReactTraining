import '../Section/Section.css'
const user=[
  {
    id:1,
    name:"Cristian",
    description:'soy un desarrollador web'
  }
]
export const Section = () => {

  const handleClick=()=>{
    console.log('click')
  }
  return (
    <section>
      {
        user.map((user, index) => (
          <div className='card' key={index}>
            <img className="imageuser" src="" alt="" />
            <h2 className="username">{user.name}</h2>
            <p className="description">{user.description}</p>
            <button className="btn" onClick={handleClick}>Ver mas</button>

          </div>
         
        ))
       
      }
    </section>    
   
  )
}

export default Section
