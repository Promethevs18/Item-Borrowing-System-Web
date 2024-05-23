import { Box } from '@mui/material'
import React from 'react'
import ClientDrawer from './ClientDrawer'

const Client_Account = ({user}) => {
  return (
    <Box>

        <ClientDrawer user={user}/>
    </Box>
  )
}

export default Client_Account