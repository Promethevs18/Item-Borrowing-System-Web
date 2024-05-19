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
      <Box display="flex" justifyContent="center" alignItems="center">
        <div>
          <Typography
            textAlign="center"
            fontSize="50px"
            alignContent="center"
            variant="h1"
            fontWeight="bold"
            color="white"
          >
           Philosophy
          </Typography>
          <Box
            display="flow"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant='h2' color='white' textAlign='center'
              fontSize='30px' marginLeft="50px" marginRight='50px' marginTop='20px'
            >The University of Perpetual Help System DALTA believes and invokes Divine Guidance in the betterment of the quality of life through national development and transformation, which are predicated upon the quality of education of its people. Towards this end, the Institution is committed to the ideals of teaching, community service, and research as it nurtures the value of “Helpers of God”, with “Character Building is Nation Building” as its guiding principle.</Typography>
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
            <Typography fontWeight="bold" variant="h2" color="white"   display='flex'
              justifyContent='center'>
              Mission
            </Typography>
            <Typography
              variant="h5"
              color="white"
              marginTop="10px"
              alignContent="center"
              sx={{ width: "400px" }}
            >
             The UNIVERSITY OF PERPETUAL HELP SYSTEM DALTA is dedicated to the development of the Filipino as a leader. It aims to graduate dynamic students who are physically, intellectually, socially and spiritually committed to the achievement of the highest quality of life.

            </Typography>
          </span>
        </div>
        <div style={{ padding: "20px" }}>
          <span>
            <Typography
              variant="h2"
              color="white"
              alignItems="center"
              display='flex'
              justifyContent='center'
              fontWeight='bold'
            >
              Vision
            </Typography>
            <Typography
              variant="h5"
              color="white"
              marginTop="10px"
              alignContent="space-evenly"
              sx={{ width: "600px", justifyContent: 'center' }}
            >
              The University of Perpetual Help System DALTA shall emerge as a premier university in the Philippines. It shall provide a venue for the pursuit of excellence in academics, technology, and research through community partnership.

The University shall take the role of a catalyst for human development. It shall inculcate Christian values – Catholic in doctrine as a way of strengthening the moral fiber of the Filipino – a people who are “Helpers of God”, proud of their race and prepared for the exemplary global participation in the arts, sciences, humanities, and business.

It foresees the Filipino people enjoying a quality of life in abundance, living in peace, and building a nation that the next generation will nourish, cherish, and value.
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
