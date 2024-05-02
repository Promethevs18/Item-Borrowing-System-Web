import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import AdminDrawer from './AdminDrawer'
import Header from '../Header'
import * as yup from 'yup'
import { Form, Formik } from 'formik'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { CloudUpload, UploadFile } from '@mui/icons-material'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

const AddItem = () => {
  
    //elements declaration
    const db = getFirestore();
    const storage = getStorage();
    const [openLoad, setOpenLoad] = useState(false);
    const [openWithNum, setOpenWithNum] = useState(false)
    const [progress, setProgress] = useState('')
    const [itemImage, setItemImage] = useState(null);



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
    const uploadData = async (values) => {
        setOpenLoad(true)

        await setDoc(doc(db, "Items", values.iic), {
          ...values, 
          itemImage: itemImage

        }).then(() => {
          setOpenLoad(false)
          toast.success("Data uploaded successfully!")
        }).catch((error) => {
          toast.info(`Error occured due to: ${error}`)
        })
    }

    //change handler for the image
    const imageChanger = (event) => {
      setOpenWithNum(true);
      const file = event.target.files[0];
      const storageRef = ref(storage, `item-images/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            toast.info(`File upload disrupted due to: ${error}`);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setItemImage(downloadURL);
              setOpenWithNum(false);
              toast.success("File uploaded successfully!")
            });
          }
        );
    };


  return (
    <Box display='grid'> 

     {/* Loading element */}
      {openLoad !== false && (
          <CircularProgress 
          sx={{ color: 'blue',     
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999, }}
          size="80px" 
          /> 
        )} 

      {/* Loading element with number */}
      {openWithNum !== false && (
        <Box>
        <CircularProgress 
        sx={{ color: 'blue',     
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999, }}
        size="80px" 
          />
          <Box
          sx={{
            top: '55.5%',
            left: '52.5%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            position: 'fixed'
          }}
        >
          <Typography variant="caption" component="div" color="white">
                {`${Math.round(progress)}%`}
          </Typography>
        </Box>
        </Box>
      )} 

      
      <Header title='Add item/material' description='Create a new item/material that is ready for students/teachers to borrow'/>
        <Box m='20px' justifyContent='space-around' alignSelf='center' display='flex' marginTop='100px'>
            <Formik 
                initialValues={initialValues}
                validationSchema={validation}
                onSubmit={uploadData}
            >
              {({values, errors, touched, handleChange, handleBlur}) => (
                <Form>
                  {/* First textfields */}
                  <Box m='5px'>
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

                      {/* Second textfields */}
                  <Box m='5px' marginTop='40px'>
                  <Grid container spacing={2}>
                    <Grid item>
                    <TextField
                        fullWidth
                        variant='filled'
                        type='text'
                        label='Brand Model'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.brandModel}
                        name='brandModel'
                        error={!!touched.brandModel && !!errors.brandModel}
                        helperText={touched.brandModel && errors.brandModel}
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
                        label='General Specifications'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.genSpecs}
                        name='genSpecs'
                        error={!!touched.genSpecs && !!errors.genSpecs}
                        helperText={touched.genSpecs && errors.genSpecs}
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

                        {/* Third textfield and a button */}
                  <Box m='5px' marginTop='40px'>
                    <Grid>
                    <TextField
                        fullWidth
                        variant='filled'
                        type='text'
                        label='Location'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.location}
                        name='location'
                        error={!!touched.location && !!errors.location}
                        helperText={touched.location && errors.location}
                        sx={{
                          width: '300px',
                          gridColumn: 'span 2',
                          "& .MuiInputBase-root":{
                            color: 'white'
                          }
                        }}
                        />                    
                        <Button variant='contained' component='label'
                            startIcon={<CloudUpload/>}
                            sx={{marginLeft: '20px', background: 'brown'}}
                        >
                          Upload a photo
                          <input style={{display: 'none'}} type='file' accept='image/' onChange={imageChanger} id='imageinput'/>
                        </Button>
                    </Grid>
                  </Box>
                  
                  <Box marginTop='20px' marginLeft='5px' justifyContent='center' alignSelf='center' display='flex'>
                    <Button startIcon={<UploadFile/>} type='submit' variant='contained' sx={{width: '100%', background: 'brown'}}
                    >Upload data to Database
                    </Button>
                  </Box>
                </Form>
              )}

            </Formik>

            <Box>
              Heil
            </Box>
        </Box>
      <AdminDrawer/>
    </Box>
 
  )
}

export default AddItem