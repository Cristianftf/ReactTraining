import './App.css'
import { Navbar } from './components/navbar/navbar'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header'
import {Section} from './components/Section/Section'

function App() {
 return (
  <>
  <Navbar/>
  <Header title="mi pagina web en react" show={true}>
    <h1>esto es un header </h1>
  </Header>
  <Section/> 
  <Footer/>
  </>
  )
}

export default App
