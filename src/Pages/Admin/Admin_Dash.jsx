import { Box } from '@mui/material'
import React from 'react'
import AdminDrawer from './AdminDrawer'
import Header from '../Header'


const Admin_Dash = ({user}) => {

  return (

    <Box m='20px'>
      <Header title="Dashboard" description="This is the dashboard"/>
      <Box display='flex' justifyContent='center'>
       Heil
      </Box>
      <AdminDrawer user={user}/>
    </Box>
  )
}
export default Admin_Dash
