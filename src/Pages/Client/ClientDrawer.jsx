import { Dashboard } from '@mui/icons-material';
import { Avatar, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getAuth, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

const ClientDrawer = ({ user: initialUser}) => {
   
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(initialUser || JSON.parse(localStorage.getItem('user')));

  const navigate = useNavigate();

  const handleMouseEnter = () => {
      setOpen(true);
  }

  const handleMouseLeave = () => {
      setOpen(false);
  }

  const logOutUser = () => {
    if(user?.uid){
        signOut(getAuth()).then(() => {
            toast.success("You have successfully logged out!")
            navigate("/")
        })
    }
  }

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);


return (
  <Box sx={{height: '100%', position: 'inherit'}}>
      <Box sx={{position: 'absolute', top: 0, left: 0, height: '100%', width: '5px' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
      >
          <Drawer anchor='left' open={open} onClose={() => setOpen(false)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                 
          >
              <Box sx={{width: 250, height: '100%', background: "#8c2e40" }} role='presentation'>
                      <List sx={{color: 'white'}}>
                          <Avatar 
                                  alt='userProfile' 
                                  src={user.photoURL}
                                  sx={{height: '150px', width: '150px', boxShadow: '20px', m: '20px', marginLeft: '50px'}}
                                  style={{cursor: 'pointer'}}
                                  onClick={() => logOutUser()}
                                  />
                           <Box display='flex' alignItems='center' flexDirection='column' marginBottom='30px'>
                           <Typography variant='h2' fontSize='20px' fontWeight='bold'>{user.displayName}</Typography>
                          <Typography variant='h4' fontSize='15px' fontWeight='bold' fontStyle='italic'>Account user</Typography>
                          </Box>       
                         
                          <ListItem>
                              <ListItemButton onClick={() => navigate('/clientDash')}>
                                  <ListItemIcon sx={{color: 'white'}}>
                                      <Dashboard/>
                                  </ListItemIcon>
                                  <ListItemText primary='Dashboard'/>
                              </ListItemButton>
                          </ListItem>
                          <ListItem>
                              <ListItemButton onClick={() => navigate('/clientAccount')}>
                                  <ListItemIcon sx={{color: 'white'}}>
                                      <AccountCircleIcon/>
                                  </ListItemIcon>
                                  <ListItemText primary='Account Details'/>
                              </ListItemButton>
                          </ListItem>

                      </List>
              </Box>
          </Drawer>
      </Box>

  </Box>
)
}

export default ClientDrawer