import { Box, Fab, Typography } from '@mui/material';
import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { toast } from 'react-toastify';
import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Authenticate = () => {

  //for Google Authentication
 const GoogleProv = new GoogleAuthProvider();

  const googlePressed = () => {
    signInWithPopup(auth, GoogleProv).then((resulta) => {
      const creds = GoogleAuthProvider.credentialFromResult(resulta);
      const token = creds.accessToken;

      const user = resulta.user;

      console.log(user)
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }

  const emailPressed = () => {
    toast.success("Email is pressed")
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
          </Box>
      </Box>
    );
  
};

export default Authenticate;
