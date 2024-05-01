import './App.css';
import { ToastContainer } from 'react-toastify';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Authenticate from './Pages/Authenticate';
import AdminDash from './Pages/Admin/Admin_Dash'
import ClientDash from './Pages/Client/Client_Dash'
import 'react-toastify/dist/ReactToastify.min.css';
import { auth } from './firebase'
import { useEffect, useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import AddItem from './Pages/Admin/AddItem';


function App() {

  const [user, setUser] = useState(null);


  useEffect(() => {
      auth.onAuthStateChanged((authUser) => {
        if(authUser){
          setUser(authUser)
        }
        else{
          setUser(null)
        }
      })
  })

  return (

    <Router>
    <div className="App">
      <CssBaseline/>
      <ToastContainer position='top-center' theme='colored' autoClose={3000}/>
      <Routes>
        <Route path="/" element={<Authenticate />} />
        
        
        <Route path="/adminDash" element={<AdminDash user={user}/>}/>
        <Route path='/addItem' element={<AddItem user={user}/>}/>






        <Route path="/clientDash" element={<ClientDash user={user}/>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
