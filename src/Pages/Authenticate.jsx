import { Box,Button,DialogActions,DialogContentText,Fab, TextField, Typography } from '@mui/material';
import  Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from '@mui/material/DialogContent';
import React, { useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { toast } from 'react-toastify';
import { auth } from '../firebase'
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Form, Formik } from 'formik';

const Authenticate = ({ user }) => {

  //for Google Authentication
 const GoogleProv = new GoogleAuthProvider();

 //for opening the dialog
 const [openDialog, setOpenDialog] = useState(false);

  const googlePressed = () => {
    signInWithPopup(auth, GoogleProv).then((resulta) => {
      const user = resulta.user;
      console.log(user)
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
    const auth = getAuth();
    signInWithEmailAndPassword(auth, values.email, values.password)
    .then((result) =>{
      
    })
    .catch((error)=>{
      console.log(error.message)
    })
  }

    return (
      <Box>
          <Box 
           sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '55vh',
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/item-borrowing-system.appspot.com/o/Rectangle%201.png?alt=media&token=525c6685-89cc-4cda-a2d9-15cc3175d46a')`,
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
          <Box m='10px'>

              <Typography variant='h2' fontSize='50px' fontWeight='bold' marginTop='10px'>
                INVENTORY MANAGEMENT SYSTEM
              </Typography>
              <Typography variant='h4' fontSize="20px" fontStyle='oblique'>
              A Web and Mobile Application With QR Integration and Cloud Computing
              </Typography>
              
          </Box>
          <Box mt='50px' display='flex' justifyContent='space-evenly'>
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
                      {({handleChange}) => (
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
