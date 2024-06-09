import { Avatar, Box, Button, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AdminDrawer from './AdminDrawer'
import Header from '../Header'
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import * as yup from 'yup'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import { DataGrid } from '@mui/x-data-grid'
import CustomToolBar from '../CustomToolBar'


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
    const [accountLevel, setAccountLevel] = useState([])

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

    const switchChanger = (event) => {
      setDesc(event.target.checked ? "Activated" : "Deactivated")
      setStatus(event.target.checked ? "Activated" : "Deactivated")
    }

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
                    status: status,
                    accountLevel: accountLevel
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

    const levelChanger = (event) => {
      setAccountLevel(event.target.value);
    }

    return (
        <Box m='10px' display='block' justifyContent='center'>
            <AdminDrawer />
            {openLoad && (
                <CircularProgress 
                sx={{ color: 'yellow', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}
                size="80px" 
                />
            )}
            
            <Header title='Account Management' description='This page allows the administrators to extend access to other accounts' />
            
            <Box m='20px' marginTop='50px'>
                <Typography variant='h3' fontSize='30px' color='maroon' sx={{textShadow: '0px 0px 3px #000'}}>
                    Add Account
                </Typography>
            </Box> 

            <Box display='flex' m='20px' justifyContent='space-evenly' marginTop='50px'>
                <label htmlFor='profileImage' style={{cursor: 'pointer'}}>
                    <Avatar alt='defaultPhoto' 
                            src={profileImage}
                            sx={{height: '250px', width: '250px', marginTop: '30px'}}>
                    </Avatar>
                </label>
                <input style={{display: 'none'}} type='file' accept='image/' onChange={profileImageChanger} id='profileImage'/>
                
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
                                          sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
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
                                          sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                  <Box m='5px' marginTop='40px'>
                                    <Grid container spacing={2}>
                                      <Grid item>
                                        <FormControl
                                          fullWidth sx={{width:'200px'}}>
                                            <InputLabel>Select a level</InputLabel>
                                            <Select value={accountLevel} onChange={levelChanger} label="Account Level">
                                                <MenuItem value="">
                                                  <em>None</em>
                                                </MenuItem>
                                                <MenuItem value="Admin">Admin</MenuItem>
                                                <MenuItem value="Faculty">Faculty</MenuItem>
                                                <MenuItem value="COE">COE</MenuItem>
                                                <MenuItem value="Non-Teaching">Non-Teaching</MenuItem>
                                                <MenuItem value="Non-COE">Non-COE</MenuItem>
                                            </Select>
                                          </FormControl>
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
                                          sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
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

            <Box display="block" justifyContent="center" alignItems="center" height="65vh" sx={{ padding: "30px" }}>
                <Typography variant='h3' fontSize='30px' color='maroon' sx={{textShadow: '0px 0px 3px #000'}}>
                    Accounts Manifest
                </Typography>
                <DataGrid
                  columns={dataColumn}
                  rows={accountList}
                  editMode="row"
                  slots={{ toolbar: CustomToolBar }}
                  sx={{
                    "& .MuiDataGrid-root": {
                      border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: "none",
                      color: 'white',
                    },
                    "& .name-column--cell": {
                      color: 'black',
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: 'maroon',
                      borderBottom: "none",
                      color: 'black',
                    },
                    "& .MuiDataGrid-virtualScroller": {
                      backgroundColor: 'gray',
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "none",
                      backgroundColor: 'gray',
                      color: 'white',
                    },
                    "& .MuiButtonBase-root": {
                      color: 'Black',
                    },
                    "& .MuiDataGrid-virtualScrollerRenderZone": {
                      color: 'white',
                    }
                  }}
                />
            </Box>
        </Box>
    )
}

export default AccountManagement
