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
import Calibration from './Pages/Admin/Calibration';
import Returns from './Pages/Admin/Returns';
import ClientAccount from './Pages/Client/Client_Account';


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
    <div className="app">
      <main className='content'>


      <CssBaseline/>
      <ToastContainer position='top-center' theme='colored' autoClose={3000}/>
      <Routes>
        <Route path="/" element={<Authenticate />} />
        
        
        <Route path="/adminDash" element={<AdminDash user={user}/>}/>
        <Route path='/addItem' element={<AddItem user={user}/>}/>
        <Route path='/calibration' element={<Calibration user={user}/>}/>
        <Route path='/returns' element={<Returns user={user}/>}/>


        <Route path="/clientDash" element={<ClientDash user={user}/>}/>
        <Route path="/clientAccount" element={<ClientAccount user={user}/>}/>
      </Routes>
      </main>
    </div>
    </Router>
  );
}

export default App;
