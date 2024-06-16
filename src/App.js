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
import AccountManagement from './Pages/Admin/AccountManagement';
import Request from './Pages/Admin/Request';
import Notif from './Pages/Notif';
import Reports from './Pages/Admin/Reports'
import BorrowItem from './Pages/Client/BorrowItem';
import ReturnedItems from './Pages/Client/ReturnedItems'
import {AuthProvider} from './Pages/AuthContext'


function App() {

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  

    return () => unsubscribe();
  }, []); 
  

  return (

    <AuthProvider>
      <Router>
      <div className="app">
        <main className='content'>


        <CssBaseline/>
        <ToastContainer position='top-center' theme='colored' autoClose={3000}/>
        <Notif/>
  
        <Routes>
          <Route path="/" element={<Authenticate   />} />
          
          
          <Route path="/adminDash" element={<AdminDash  />}/>
          <Route path='/addItem' element={<AddItem  />}/>
          <Route path='/calibration' element={<Calibration  />}/>
          <Route path='/returns' element={<Returns  />}/>
          <Route path="/accountManagement" element={<AccountManagement  />}/>
          <Route path='/requests' element={<Request  />}/>
          <Route path='/reports' element={<Reports  />}/>


          <Route path="/clientDash" element={<ClientDash  />}/>
          <Route path="/clientAccount" element={<ClientAccount  />}/>
          <Route path="/borrow" element={<BorrowItem  />}/>
          <Route path='/returned' element={<ReturnedItems  />}/>
        </Routes>
        </main>
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
