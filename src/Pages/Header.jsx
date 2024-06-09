import { Box, Typography } from '@mui/material'
import React from 'react'

const Header = ({title, description}) => {
  return (
    <Box m='20px'>
        <Typography
            variant='h1'
            color='black'
            fontWeight='bold'
            sx={{textAlign: 'center', fontSize: '50px', textShadow:" -1px -1px 0 #FFF, -1px -1px 0 #FFF, -1px -1px 0 #FFF, -1px -1px 0 #FFF"
            }}
        >
            {title}
        </Typography>

        <Typography variant='h5' color='black' fontStyle='oblique' textAlign='center' sx={{textShadow: ' -1px -1px 0 #FFF, -1px -1px 0 #FFF, -1px -1px 0 #FFF, -1px -1px 0 #FFF' }}>
            {description}
        </Typography>
    </Box>
  )
}

export default Header