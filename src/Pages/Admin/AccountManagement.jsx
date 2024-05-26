import { Avatar, Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AdminDrawer from './AdminDrawer'
import Header from '../Header'
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import * as yup from 'yup'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'


const AccountManagement = () => {


    const [profileImage, setProfileImage] = useState('https://www.pngkey.com/png/detail/157-1579943_no-profile-picture-round.png')
    const unangValues = {
        email: '',
        fullName: '',
        category: '',
        accountLevel: '',
        password: '',
    }

    const db = getFirestore();
    const storage = getStorage();
    const auth = getAuth();

    const [openLoad, setOpenLoad] = useState(false)
    const innerRef = useRef(null)
    const [status, setStatus] = useState('')
    const [desc, setDesc] = useState('Deactivated')


    //for category radio button
    const [selectedCategory, setCategory] = useState('')
    const categoryChange = (event) => {
        setCategory(event.target.value)
    }

    const userSchema = yup.object().shape({
        email: yup.string().required("This field is required"),
        fullName:  yup.string().required("This field is required"),
        accountLevel:  yup.string().required("This field is required"),
        password: yup.string().required("This field is required"),
    })

    //profileImageChanger
    const profileImageChanger = (event) => {
        const file = event.target.files[0];
        setOpenLoad(true);
        const storageRef = ref(storage, `profile-images/${file.name}`);
        const uploadImage = uploadBytesResumable(storageRef, file);

        uploadImage.then(() => {
            getDownloadURL(uploadImage.snapshot.ref).then((downloadUrl) =>{
                setProfileImage(downloadUrl)
                toast.success("Image uploaded successfully!")
                setOpenLoad(false)
            })
        })
    }

    //switcher changer
    const switchChanger = (event) => {
      setDesc(event.target.checked ? "Activated" : "Deactivated")
      setStatus(event.target.checked ? "Activated" : "Deactivated")
    }

    //Create an account
    const signInToSystem  = async (values) => {
      setOpenLoad(true);
        try{
            await createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((user) => {
              updateProfile(user.user, {
                displayName: values.fullName
              }).then(() => {
                   setDoc(doc(db, "Users list", values.fullName), {
                    ...values,
                    profileImage: profileImage,
                    category: selectedCategory,
                    status: status
                  }).then(() => {
                    signInWithEmailAndPassword(auth, "admin@item.borrow", "admin123")
                  }).catch((error) => {
                    toast.error(`Error occured due to ${error}`)
                  })
              })
              toast.success("Account activated")
           
            })
        }
        catch (error) {
          toast.error(`Error occured due to ${error}`)
        }
        setOpenLoad(false)
    }


    //DATAGRID columns
    const dataColumn = [
      { field: "fullName", headerName: "Full Name", flex: 1},
      { field: "category", headerName: "Category", flex: 1},
      { field: "email", headerName: "Email", flex: 1},
      { field: "accountLevel", headerName: "Account Level", flex: 1},
      { field: "status", headerName: "Account Status", flex: 1},
    ]
  
    const [accountList, setAccountList] = useState([])

    useEffect(() => {
      const getData = async () => {
        const query = await getDocs(collection(db, 'Users list'));
        const data = query.docs.map((mapa) => ({id: mapa.id, ...mapa.data()}))
        setAccountList(data)
      }
      getData();
    },[db])


  return (
    <Box m='10px' display='block' justifyContent='center'>
              <AdminDrawer/>
            {openLoad && (
                <CircularProgress 
                sx={{ color: 'blue', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}
                size="80px" 
                />
            )}
      
        <Header title='Account Management' description='This page allows the administrators to extend access to other accounts'/>
         
        <Box  m='20px' marginTop='50px'>
            <Typography variant='h3' fontSize='30px' color='whitesmoke' sx={{textShadow: ' -1px -1px 0 #000, -1px -1px 0 #000, -1px -1px 0 #000, -1px -1px 0 #000'}}>Add Account</Typography>
        </Box> 

        <Box display='flex' m='20px' justifyContent='space-evenly' marginTop='50px'>
                <label htmlFor='profileImage' style={{cursor: 'pointer'}}>
                    <Avatar alt='defaultPhoto' 
                            src={profileImage}
                            sx={{height: '250px', width: '250px', marginTop: '30px'}}>
                    </Avatar>
                </label>
                    <input style={{display: 'none'}} type='file' accept='image/' onChange={profileImageChanger} id='profileImage'/>

                {/* Forms */}
                <Box m='20px'>
                   <Formik 
                        initialValues={unangValues}
                        innerRef={innerRef}
                        validationSchema={userSchema}
                        onSubmit={signInToSystem}
                    >
                        {({values, errors, touched, handleChange, handleBlur}) => (
                            <Form>
                               <Box m='5px'>
                                    <Grid container spacing={2}>
                                      <Grid item>
                                        <TextField
                                          fullWidth
                                          variant='filled'
                                          type='text'
                                          label='Email'
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.email}
                                          name='email'
                                          error={!!touched.email && !!errors.email}
                                          helperText={touched.email && errors.email}
                                          sx={{ width: '350px', "& .MuiInputBase-root": { color: 'white' } }}
                                        />
                                      </Grid>
                                      <Grid item>
                                        <TextField
                                          fullWidth
                                          variant='filled'
                                          type='text'
                                          label='Full Name'
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.fullName}
                                          name='fullName'
                                          error={!!touched.fullName && !!errors.fullName}
                                          helperText={touched.fullName && errors.fullName}
                                          sx={{ width: '350px', "& .MuiInputBase-root": { color: 'white' } }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                  <Box m='5px' marginTop='40px'>
                                    <Grid container spacing={2}>
                                      <Grid item>
                                        <TextField
                                          fullWidth
                                          variant='filled'
                                          type='text'
                                          label='Account Level'
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.brandModel}
                                          name='accountLevel'
                                          error={!!touched.accountLevel && !!errors.accountLevel}
                                          helperText={touched.accountLevel && errors.accountLevel}
                                          sx={{ width: '350px', "& .MuiInputBase-root": { color: 'white' } }}
                                        />
                                      </Grid>
                                      <Grid item>
                                        <TextField
                                          fullWidth
                                          variant='filled'
                                          type='password'
                                          label='Password'
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.password}
                                          name='password'
                                          error={!!touched.password && !!errors.password}
                                          helperText={touched.password && errors.password}
                                          sx={{ width: '350px', "& .MuiInputBase-root": { color: 'white' } }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                  <Box m='5px' marginTop='40px'>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                          Account Status:
                                          <Switch color="info" onChange={switchChanger}/>
                                          {desc}
                                        </Grid>
                                        <Grid item sx={{marginLeft: '105px'}}>
                                            <FormControl>
                                              <FormLabel
                                                style={{color: 'black'}}
                                              >Category</FormLabel>
                                              <RadioGroup row onChange={categoryChange}>
                                                  <FormControlLabel value="Non-Teaching" control={<Radio/>} label="Non-Teaching"/>
                                                  <FormControlLabel value="Faculty" control={<Radio/>} label="Faculty"/>
                                              </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Box display='flex' justifyContent='center' m='20px'>
                                      <Button type='submit' color='secondary' variant='contained'>
                                          Add account to system
                                      </Button>
                                    </Box>
                                  </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>

              
             
        </Box>
                <Box
                    display="block"
                    justifyContent="center"
                    alignItems="center"
                    height="65vh"
                    sx={{
                      padding: "30px",
                      "& .MuiDataGrid-root": {
                        border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                      },
                      "& .name-column--cell": {
                        color: 'white',
                      },
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: 'maroon',
                        borderBottom: "none",
                      },
                      "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: '#8c2e40',
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: 'white',
                      },
                      "& .MuiButtonBase-root":{
                        color: 'wheat'
                      },
                      "& .MuiDataGrid-virtualScrollerRenderZone":{
                        color: 'white'
                      }
                    }}
                  >
                    <Typography 
                      variant='h3' 
                      fontSize='30px'
                      color='white'
                      sx={{textShadow: ' -1px -1px 0 #000, -1px -1px 0 #000, -1px -1px 0 #000, -1px -1px 0 #000' }}
                      >Accounts Manifest</Typography>
                    <DataGrid
                      columns={dataColumn}
                      rows={accountList}
                      editMode="row"
                      slots={
                        {
                        toolbar: GridToolbar,
                      
                      }}
                      sx={{
                        '@media print':{
                          '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
                        },
                      }}
                      
                    />
                </Box>
    </Box>
  )
}

export default AccountManagement