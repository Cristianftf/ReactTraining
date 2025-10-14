import './App.css';
import Navbar from './components/navbar/Navbar';
import { UserTable } from './components/Section_User/User_table';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <UserTable />
      </main>
    </div>
  );
}

export default App;