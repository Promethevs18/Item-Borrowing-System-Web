import { Box, Grid, TextField } from '@mui/material'
import React from 'react'
import AdminDrawer from './AdminDrawer'
import Header from '../Header'
import * as yup from 'yup'
import { Form, Formik } from 'formik'

const AddItem = () => {
  
  


  //form-related codes
    //declaring initalvalues 
    const initialValues = {
      iic: '',
      assetName: '',
      brandModel: '',
      genSpecs: '',
      location: ''
    }

    //validation schema
    const validation = yup.object().shape({
      iic: yup.string().required("This field is required"),
      assetName: yup.string().required("This field is required"),
      brandModel: yup.string().required("This field is required"),
      genSpecs: yup.string().required("This field is required"),
      location: yup.string().required("This field is required")
    })
  
    //uploading data to Firestore
    const uploadData = (values) => {

    }
  
  
  return (
    <Box>  
      <Header title='Add item/material' description='Create a new item/material that is ready for students/teachers to borrow'/>
        <Box m='20px' justifyContent='center' alignSelf='center' display='flex' marginTop='100px'>
            <Formik 
                initialValues={initialValues}
                validationSchema={validation}
                onSubmit={uploadData}
            >
              {({values, errors, touched, handleChange, handleBlur}) => (
                <Form>
                  <Box m='5px' >
                  <Grid container spacing={2}>
                    <Grid item>
                    <TextField
                        fullWidth
                        variant='filled'
                        type='text'
                        label='Inventory Identification Code'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.iic}
                        name='iic'
                        error={!!touched.iic && !!errors.iic}
                        helperText={touched.iic && errors.iic}
                        sx={{
                          width: '300px',
                          gridColumn: 'span 2',
                          "& .MuiInputBase-root":{
                            color: 'white'
                          }
                        }}
                        />
                    </Grid>
                    <Grid item>
                    <TextField
                        fullWidth
                        variant='filled'
                        type='text'
                        label='Asset Name'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.assetName}
                        name='assetName'
                        error={!!touched.assetName && !!errors.assetName}
                        helperText={touched.assetName && errors.assetName}
                        sx={{
                          width: '300px',
                          gridColumn: 'span 2',
                          "& .MuiInputBase-root":{
                            color: 'white'
                          }
                        }}
                        />
                    </Grid>
                  </Grid>
                  </Box>
                  
                </Form>
              )}

            </Formik>
        </Box>
      <AdminDrawer/>
    </Box>
 
  )
}

export default AddItem