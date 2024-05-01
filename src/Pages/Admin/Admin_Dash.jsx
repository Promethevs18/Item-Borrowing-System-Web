import { Box } from '@mui/material'
import React from 'react'
import AdminDrawer from './AdminDrawer'


const Admin_Dash = ({user}) => {

  return (

    <Box m='20px'>
      <Box>
      You are at the admin dash
        <AdminDrawer user={user}/>
       
      </Box>

    </Box>
  )
}
export default Admin_Dash
