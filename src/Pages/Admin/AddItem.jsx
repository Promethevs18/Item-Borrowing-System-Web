import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { CloudUpload, UploadFile } from '@mui/icons-material';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import AdminDrawer from './AdminDrawer';
import DeleteIcon from '@mui/icons-material/Delete';

const AddItem = () => {
  const db = getFirestore();
  const storage = getStorage();
  const [openLoad, setOpenLoad] = useState(false);
  const [openWithNum, setOpenWithNum] = useState(false);
  const [progress, setProgress] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [receiptImage, setReceipt] = useState('');
  const [selectionModel, setSelectionModel] = useState([]);
  const [rows, setRows] = useState([]);
  
  const formikRef = useRef(null);

  const initialValues = {
    iic: '',
    assetName: '',
    brandModel: '',
    genSpecs: '',
    location: '',
    receiptImage: ''
  };

  const validation = yup.object().shape({
    iic: yup.string().required("This field is required"),
    assetName: yup.string().required("This field is required"),
    brandModel: yup.string().required("This field is required"),
    genSpecs: yup.string().required("This field is required"),
    location: yup.string().required("This field is required")
  });

  const uploadData = async (values, { resetForm }) => {
    setOpenLoad(true);

    try {
      await setDoc(doc(db, "Items", values.iic), {
        ...values, 
        itemImage: itemImage
      });
      setOpenLoad(false);
      toast.success("Data uploaded successfully!");
      resetForm(); 
      setReceipt('');
    } catch (error) {
      setOpenLoad(false);
      toast.info(`Error occurred due to: ${error}`);
    }
  };

  const uploadFile = (file, path, setStateCallback) => {
    setOpenWithNum(true);
    const storageRef = ref(storage, path);
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
          setStateCallback(downloadURL);
          setOpenWithNum(false);
          toast.success("File uploaded successfully!");
        });
      }
    );
  };

  const imageChanger = (event) => {
    const file = event.target.files[0];
    uploadFile(file, `item-images/${file.name}`, setItemImage);
  };

  const receiptChanger = (event) => {
    const file = event.target.files[0];
    uploadFile(file, `receipt-images/${file.name}`, setReceipt);
  };

  const burahin = async (laman) => {
    setOpenLoad(true);
    try {
      await deleteDoc(doc(db, "Items", laman));
      setOpenLoad(false);
      toast.success("Data deleted successfully!");
    } catch (error) {
      setOpenLoad(false);
      toast.error(`Error occurred due to: ${error}`);
    }
  };

  const checkSelected = async (selected) => {
    const selectedId = selected[0];
    setSelectionModel(selected);
    setOpenLoad(true);
    try {
      const takeUser = doc(db, `Items/${selectedId}`);
      const snapshot = await getDoc(takeUser);

      if (snapshot.exists()) {
        const updatedIni = snapshot.data();
        formikRef.current.setValues(updatedIni);
        setOpenLoad(false);
      }
    } catch (error) {
      setOpenLoad(false);
      toast.error(`Error occurred due to: ${error}`);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "Items"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id, ...doc.data()
      }));
      setRows(data);
    };
    getData();
  }, []);

  const columns = [
    { field: 'iic', headerName: 'I.I.C', flex: 1 },
    { field: 'assetName', headerName: 'Asset Name', flex: 1 },
    { field: 'brandModel', headerName: 'Brand Model', flex: 1 },
    { field: 'genSpecs', headerName: 'General Specifications', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'actions', type: 'actions', headerName: 'Action', flex: 1, getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label='Delete'
        onClick={() => burahin(params.id)}
        sx={{ color: 'red' }}
      />
    ] }
  ];

  return (
    <Box display='grid'> 
      {openLoad && (
        <CircularProgress 
          sx={{ color: 'blue', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}
          size="80px" 
        />
      )}
      {openWithNum && (
        <Box>
          <CircularProgress 
            sx={{ color: 'blue', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}
            size="80px" 
          />
          <Box sx={{ top: '55.5%', left: '52.5%', transform: 'translate(-50%, -50%)', zIndex: 9999, position: 'fixed' }}>
            <Typography variant="caption" component="div" color="white">{`${Math.round(progress)}%`}</Typography>
          </Box>
        </Box>
      )}
      <Header title='Add item/material' description='Create a new item/material that is ready for students/teachers to borrow' />
      <Box m='20px' justifyContent='space-around' alignSelf='center' display='flex' marginTop='100px'>
        <Formik 
          initialValues={initialValues}
          innerRef={formikRef}
          validationSchema={validation}
          onSubmit={uploadData}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
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
                      sx={{ width: '350px', "& .MuiInputBase-root": { color: 'white' } }}
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
                      label='Brand Model'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.brandModel}
                      name='brandModel'
                      error={!!touched.brandModel && !!errors.brandModel}
                      helperText={touched.brandModel && errors.brandModel}
                      sx={{ width: '350px', "& .MuiInputBase-root": { color: 'white' } }}
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
                      sx={{ width: '350px', "& .MuiInputBase-root": { color: 'white' } }}
                    />
                  </Grid>
                </Grid>
              </Box>
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
                    sx={{ width: '300px', "& .MuiInputBase-root": { color: 'white' } }}
                  />                    
                  <Button variant='contained' component='label' startIcon={<CloudUpload />} sx={{ marginLeft: '20px', background: 'brown' }}>
                    Upload item photo
                    <input style={{ display: 'none' }} type='file' accept='image/' onChange={imageChanger} id='imageinput' />
                  </Button>
                  <Button variant='contained' component='label' startIcon={<CloudUpload />} sx={{ marginLeft: '20px', background: 'brown', marginTop: '20px' }}>
                    Upload receipt photo
                    <input style={{ display: 'none' }} type='file' accept='image/' onChange={receiptChanger} id='receiptImage' />
                  </Button>
                </Grid>
              </Box>
              <Box marginTop='20px' marginLeft='5px' justifyContent='center' alignSelf='center' display='flex'>
                <Button startIcon={<UploadFile />} type='submit' variant='contained' sx={{ width: '100%', background: 'brown' }}>
                  Upload data to Database
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Box display='flex' height='75vh' width='50%' marginLeft='20px' sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: "#303030" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "#ba828c", borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: "#8c2e40" },
          "& .MuiButtonBase-root": { color: "white" }
        }}>
          <DataGrid 
            rows={rows} 
            columns={columns} 
            slots={{ toolbar: GridToolbar }}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newSelected) => checkSelected(newSelected)}
          />
        </Box>
      </Box>
      <AdminDrawer />
    </Box>
  );
};

export default AddItem;