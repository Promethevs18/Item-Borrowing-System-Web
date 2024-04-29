import './App.css';
import { ToastContainer } from 'react-toastify';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Authenticate from './Pages/Authenticate';
import AdminDash from './Pages/Admin/Admin_Dash'
import ClientDash from './Pages/Client/Client_Dash'
import 'react-toastify/dist/ReactToastify.min.css';
import auth from './firebase'


function App() {
  return (
    <Router>
    <div className="App">
      <ToastContainer position='top-center' theme='colored' autoClose={3000}/>
      <Routes>
        <Route path="/" element={<Authenticate/>} />
        <Route path='/admin_dash' element={<AdminDash/>}/>
        <Route path='/client_dash' element={<ClientDash/>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
