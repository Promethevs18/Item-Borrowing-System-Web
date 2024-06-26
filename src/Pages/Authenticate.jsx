import { Box,Button,CircularProgress,DialogActions,DialogContentText,Fab, TextField, Typography } from '@mui/material';
import  Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { toast } from 'react-toastify';
import { auth } from '../firebase'
import { GoogleAuthProvider, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';


const Authenticate = () => {

  //for Google Authentication
 const GoogleProv = new GoogleAuthProvider();

 //for opening the dialog
 const [openDialog, setOpenDialog] = useState(false);

 //for opening the loading
 const [openLoad, setOpenLoad] = useState(false)

 //for using in history
  const history = useNavigate(); 

  const googlePressed = () => {
    setOpenLoad(true);
    signInWithPopup(auth, GoogleProv).then(() => {
      setOpenLoad(false);
      history('/clientDash')
      toast.success('You are now logged in')
    }).catch((error) => {
      // Handle Errors here.
        toast.error(error)
    });
  }

  const emailPressed = () => {
    setOpenDialog(true);
  }
  
  const closeDialog = () => {
    setOpenDialog(false)
  }

  const emailLogIn = (values) => {
    setOpenLoad(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, values.email, values.password)
    .then(() =>{
      setOpenLoad(false)
      history('/adminDash')
      toast.success('You are now logged in')
    })
    .catch((error)=>{
      setOpenLoad(false)
      toast.error(error.message)
    })
  
  }


  const nalimutan = (value) => {
    if(value === "" || value === null){
      toast.error("Write your email on the text field above")
    }
    else{

      const newAuth = getAuth();
      sendPasswordResetEmail(newAuth, value).then(() => {
        toast.success("Password reset email link sent. Check your inbox")
      })
      .catch((error) => {
        toast.error(error)
      })
    }
  }

    return (
      <Box sx={{background: 'white', minHeight: '100vh'}}>
      
      {/* Loading element */}
      {openLoad !== false && (
        <Box
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: 'blue' }} size="80px" />
        </Box>
      )}
          <Box 
           sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '55vh',
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/item-borrowing-system.appspot.com/o/Rectangle%201%20(1).png?alt=media&token=821a6e08-430d-45a3-aff6-38d0d287dfa2')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          >
            <img
              src='https://perpetualdalta.edu.ph/wp-content/uploads/2018/02/perpetual-logo.png'
              alt='perpetual-logo'
              style={{
                alignSelf: 'flex-start',
                marginLeft: '20px',
              }}
            />
            <Typography variant='h1'
              sx={{
                color: 'white',
                marginTop: '120px',
                fontFamily: 'Helvetica, sans-serif '
                
              }}
            >College of Engineering</Typography>
          </Box>
          <Box m='10px' display='flex' justifyContent='center'>
              <Typography variant='h2' fontSize='50px' fontWeight='bold' marginTop='10px' >
                  QR-CLaIMS
              </Typography>
          </Box>
          <Box m='10px' display='flex' justifyContent='center'>
              <Typography variant='h4' fontSize="20px" fontStyle='oblique' >
                  A Cloud Based Laboratory Inventory Management System Using Web and Mobile Application with QR Code Integration
                  </Typography>
          </Box>
             
          
          {/* For the buttons */}
          <Box mt='50px' display='flex' justifyContent='space-evenly'>
              <Typography variant='h3' fontSize='20px'>
                Faculty/Student Sign in
              </Typography>

              <Typography variant='h3' fontSize='20px'>
                Administrator Sign in
              </Typography>
          </Box>
          <Box mt='20px' display='flex' justifyContent='space-evenly'>
              <Fab variant='extended' sx={{background: 'red', color: 'white'}} onClick={googlePressed}>
                <GoogleIcon sx={{mr: 1}}/>
                Continue with Google
              </Fab>
              <Fab variant='extended' sx={{background: 'yellow'}} onClick={emailPressed}>
                <EmailIcon sx={{mr: 1}}/>
                Log in using email
              </Fab>
              <Dialog 
                  open={openDialog}
                  onClose={closeDialog}
              >
                  <Formik initialValues={{email: '', password: ''}} onSubmit={emailLogIn}>
                      {({handleChange, values}) => (
                        <Form>
                          <DialogTitle>Please Enter Credentials Here</DialogTitle>
                          <DialogContent>
                            <DialogContentText>Use your email and password to login</DialogContentText>
                            <TextField 
                                variant='filled'
                                fullWidth
                                id='email'
                                label='Email'
                                name='email'
                                type='text'
                                required
                                onChange={handleChange}
                                />
                            <TextField
                                variant='filled'
                                fullWidth
                                id='password'
                                label='Password'
                                name='password'
                                type='password'
                                required
                                onChange={handleChange}
                                />
                                <Button onClick={() => nalimutan(values.email)}>Forgotten Password</Button>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={closeDialog}>Cancel</Button>
                            <Button type='submit'>Proceed</Button>
                          </DialogActions>
                        </Form>
                      )}
                  </Formik>

              </Dialog>
          </Box>
      </Box>
    );
  
};

export default Authenticate;
