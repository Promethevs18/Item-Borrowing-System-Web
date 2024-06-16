import { AssignmentReturn, CompassCalibration, Dashboard, PlaylistAdd, ReportSharp, RequestPage } from '@mui/icons-material';
import { Avatar, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { toast } from 'react-toastify';
import { getAuth, signOut } from 'firebase/auth';
import { useAuth } from '../AuthContext';

const AdminDrawer = () => {
    
    const user = useAuth();

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setOpen(true);
    }

    const handleMouseLeave = () => {
        setOpen(false);
    }
    const logoutUser = () => {
            signOut(getAuth()).then(()=>{
                toast.success("You have successfully logged out!");
                navigate("/")
            })
        
    }

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
                <Box sx={{width: 250, height: '100%', background: "#8c2e40"}} role='presentation'>
                        <List sx={{color: 'white'}}>
                            <Avatar 
                                    alt='userProfile' 
                                    src='https://image.pngaaa.com/743/6496743-middle.png'
                                    sx={{height: '150px', width: '150px', boxShadow: '20px', m: '20px', marginLeft: '40px'}}
                                    style={{cursor: 'pointer'}}
                                    />
                            <ListItem>
                                <ListItemButton onClick={() => navigate('/adminDash')}>
                                    <ListItemIcon sx={{color: 'white'}}>
                                        <Dashboard/>
                                    </ListItemIcon>
                                    <ListItemText primary='Dashboard'/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton onClick={() => navigate('/addItem')}>
                                    <ListItemIcon sx={{color: 'white'}}>
                                        <PlaylistAdd/>
                                    </ListItemIcon>
                                    <ListItemText primary='Inventory List'/>
                                </ListItemButton>
                            </ListItem>
                            {user?.uid === 'rt5MKdHOWyZaAS3h5LtdsnLWXae2' && (
                            <ListItem>
                                <ListItemButton onClick={() => navigate('/calibration')}>
                                    <ListItemIcon sx={{color: 'white'}}>
                                        <CompassCalibration/>
                                    </ListItemIcon>
                                    <ListItemText primary='Calibration List'/>
                                </ListItemButton>
                            </ListItem>
                               )}
                            <ListItem>
                                <ListItemButton onClick={() => navigate('/requests')}>
                                    <ListItemIcon sx={{color: 'white'}}>
                                        <RequestPage/>
                                    </ListItemIcon>
                                    <ListItemText primary='Borrow Requests'/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton onClick={() => navigate('/returns')}>
                                    <ListItemIcon sx={{color: 'white'}}>
                                        <AssignmentReturn/>
                                    </ListItemIcon>
                                    <ListItemText primary='Return Items'/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton onClick={() => navigate('/reports')}>
                                    <ListItemIcon sx={{color: 'white'}}>
                                        <ReportSharp/>
                                    </ListItemIcon>
                                    <ListItemText primary='Report Generation'/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                {user?.uid === 'rt5MKdHOWyZaAS3h5LtdsnLWXae2' && (
                                    <ListItemButton onClick={() => navigate('/accountManagement')}>
                                        <ListItemIcon sx={{color: 'white'}}>
                                            <GroupAddIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary='Account Management'/>
                                    </ListItemButton>
                                )}
                            </ListItem>
                        </List>
                        <Box display='flex' justifyContent='center'>
                    <Button variant='contained' 
                            sx={{width: '50px', marginTop: '20px', backgroundColor:'yellow', color:'black'}}
                            onClick={() => logoutUser()}
                            >Logout</Button>
                </Box>
                </Box>
               
              
            </Drawer>
           
        </Box>

    </Box>
  )
}

export default AdminDrawer