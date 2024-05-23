import { AssignmentReturn, CompassCalibration, Dashboard, PlaylistAdd } from '@mui/icons-material';
import { Avatar, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AdminDrawer = ({user}) => {
    
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setOpen(true);
    }

    const handleMouseLeave = () => {
        setOpen(false);
    }

    console.log(user)
    

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
                                    <ListItemText primary='Add Item'/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton onClick={() => navigate('/calibration')}>
                                    <ListItemIcon sx={{color: 'white'}}>
                                        <CompassCalibration/>
                                    </ListItemIcon>
                                    <ListItemText primary='Calibrate Items'/>
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
                        </List>
                </Box>
            </Drawer>
        </Box>

    </Box>
  )
}

export default AdminDrawer