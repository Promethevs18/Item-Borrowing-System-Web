import { Box, Typography } from '@mui/material'
import React from 'react'
import AdminDrawer from './AdminDrawer'
import { Card, CardCover } from '@mui/joy'


const Admin_Dash = ({user}) => {

  return (

    <Box m='20px'>
        <img 
        src='https://perpetualdalta.edu.ph/wp-content/uploads/2018/02/perpetual-logo.png'
        alt=''
        />
      <Box display='flex' justifyContent='center'>
         {/* This is for the title and image */}
      <Box display="flex" justifyContent="center" alignItems="center" marginTop='50px'>
        <div>
          <Typography
            textAlign="center"
            fontSize="50px"
            alignContent="center"
            variant="h1"
            fontWeight="bold"
            color="black"
          >
          A Cloud Based Laboratory Inventory Management System Using Web and Mobile Application with QR Code Integration. 
          </Typography>
          <Box
            display="flow"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant='h2' color='black' textAlign='center'
              fontSize='30px' marginLeft="50px" marginRight='50px' marginTop='20px'
            >Focusing on security and user accessibility, the system offers a secured user registration process with varying access levels tailored for laboratory management on both mobile and web platforms. It boasts a robust database that houses equipment inventory, user information, and transaction records, all stored in the cloud with automated QR code generation. Additionally, the system includes a feature for generating standardized reports that ensures data confidentiality and integrity by preventing unauthorized alterations to the reports stored in the cloud-based database..</Typography>
          </Box>

            <Box  justifyContent='center'
            sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 0, m: 4 }}>
  
            <Card sx={{height: 200, width: 300}}>
                  <CardCover>
                  <iframe width="1519" height="566" src="https://www.youtube.com/embed/-kAjQsGA5LQ" title="University of Perpetual Help System DALTA: College of Maritime" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </CardCover>
                  </Card>
 
               <Card sx={{height: 200, width: 300}}>
                    <CardCover>
                      <img
                        src='http://services.perpetualdalta.edu.ph:8345/images/banners/About-Home-Banner-2014.jpg'
                        loading='lazy'
                        alt=''
                      />
                    </CardCover>
                  </Card>

                  <Card sx={{height: 200, width: 300}}>
                    <CardCover>
                      <img
                        src='https://edukasyon-production.s3.ap-southeast-1.amazonaws.com/uploads/facility/image/2389/mo-e1518972880388.jpg'
                        loading='lazy'
                        alt=''
                      />
                    </CardCover>
                  </Card>

                  <Card sx={{height: 200, width: 300}}>
                  <CardCover>
                      <iframe 
                      width="1519" 
                      height="566" 
                      src="https://www.youtube.com/embed/1bSTzwIt-L4" 
                      title="University of Perpetual Help: Be AHEAD, Achieve the UNIVERSITY EDGE" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerpolicy="strict-origin-when-cross-origin" 
                      allowfullscreen></iframe>
                  </CardCover>
                  </Card>

            </Box>
      

           {/* This is for the mission and Vision content */}
           <Box display="flex" justifyContent="space-evenly" alignContent="center">
        <div style={{ padding: "20px" }}>
          <span>
            <Typography fontWeight="bold" variant="h2" color="black"   display='flex'
              justifyContent='center'>
           
            </Typography>
            <Typography
              variant="h5"
              color="black"
              marginTop="10px"
              alignContent="center"
              sx={{ width: "400px" }}
            >
          
            </Typography>
          </span>
        </div>
        <div style={{ padding: "20px" }}>
          <span>
            <Typography
              variant="h2"
              color="black"
              alignItems="center"
              display='flex'
              justifyContent='center'
              fontWeight='bold'
            >
            
            </Typography>
            <Typography
              variant="h5"
              color="black"
              marginTop="10px"
              alignContent="space-evenly"
              sx={{ width: "600px", justifyContent: 'center' }}
            >
    
            </Typography>
          </span>
        </div>
           </Box>
    
        </div>
         
      </Box>
      
      </Box>
      <AdminDrawer user={user}/>
    </Box>
  )
}
export default Admin_Dash
