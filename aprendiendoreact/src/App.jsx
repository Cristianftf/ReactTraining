import './App.css'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

function App() {
 return (
  <>
  <Header title="mi pagina web en react" show={true}>
    <h1>esto es un header </h1>
  </Header>
  <section>
    peste es el contenido de la sección
  </section>
  <Footer/>
  </>
  )
}

export default App
