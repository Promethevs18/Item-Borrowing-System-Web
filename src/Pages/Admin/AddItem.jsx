import {
  Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Modal
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { CloudUpload, UploadFile } from '@mui/icons-material';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AdminDrawer from './AdminDrawer';
import DeleteIcon from '@mui/icons-material/Delete';
import QRCode from 'react-qr-code';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomToolbar from '../CustomToolBar'

const AddItem = ({ user }) => {
  const db = getFirestore();
  const storage = getStorage();
  const [openLoad, setOpenLoad] = useState(false);
  const [openWithNum, setOpenWithNum] = useState(false);
  const [progress, setProgress] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [receiptImage, setReceipt] = useState('');
  const [selectionModel, setSelectionModel] = useState([]);
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control visibility of form
  const [openDetails, setOpenDetails] = useState(false);
  const [itemDetails, setItemDetails] = useState({});
  const formikRef = useRef(null);
  const [status, setStatus] = useState('');
  

  const initialValues = {
    iic: '',
    assetName: '',
    brandModel: '',
    genSpecs: '',
    location: '',
    receiptImage: '',
    quantity: 0, // Add quantity
    status: 'Available' // Add status
  };

  const validation = yup.object().shape({
    iic: yup.string().required("This field is required"),
    assetName: yup.string().required("This field is required"),
    brandModel: yup.string().required("This field is required"),
    genSpecs: yup.string().required("This field is required"),
    location: yup.string().required("This field is required"),
    quantity: yup.number().required("This field is required").min(1, "Quantity must be at least 1") // Validate quantity
  });

  const uploadData = async (values, { resetForm }) => {
    setOpenLoad(true);

    try {
      await setDoc(doc(db, "Items", values.iic), {
        ...values,
        itemImage: itemImage,
        receiptImage: receiptImage,
        ItemExistence: status,
      });
      setOpenLoad(false);
      toast.success("Data uploaded successfully!");
      resetForm();
      setReceipt('');
      setItemImage('');
      setShowForm(false); // Hide the form after submitting
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

  const statusChanger = (event) => {
    setStatus(event.target.value);
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
        setItemImage(updatedIni.itemImage);
        setReceipt(updatedIni.receiptImage);
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
  }, [db]);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleBackClick = () => {
    setShowForm(false);
  };

  const handleItemDetailsClick = (item) => {
    setItemDetails(item);
    setOpenDetails(true);
  };

  const handleDetailsBackClick = () => {
    setOpenDetails(false);
  };


  const columns = [
    { field: 'iic', headerName: 'I.I.C', flex: 1 },
    { field: 'assetName', headerName: 'Asset Name', flex: 1 },
    { field: 'brandModel', headerName: 'Brand Model', flex: 1 },
    { field: 'genSpecs', headerName: 'General Specifications', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 }, // Add quantity column
    { field: 'ItemExistence', headerName: 'Status', flex: 1 }, // Add status column
    { 
      field: 'qrCode', 
      headerName: 'QR Code', 
      flex: 1,
      renderCell: (params) => (
        <QRCode value={`Item: ${params.row.assetName}`} style={{ width: '60px', height: '60px' }}/>
      )
    },
    { field: 'actions', type: 'actions', headerName: 'Action', flex: 1, getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon sx={{ color: 'black' }} />}
        label='Delete'
        onClick={() => burahin(params.id)}
       
      />,
      <GridActionsCellItem
        icon={<Button variant='contained' color='secondary' onClick={() => handleItemDetailsClick(params.row)}>Details</Button>}
        label='Details'
      />
    ] }
  ];

  return (
    <Box>
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
            <Typography variant="caption" component="div" color="black">{`${Math.round(progress)}%`}</Typography>
          </Box>
        </Box>
      )}
      <Header title='Inventory List' description='Create a new item/material that is ready for students/teachers to borrow' />
      <Box m='20px' justifyContent='space-around' alignSelf='center' display='flex' marginTop='100px'>
        {user?.uid === 'rt5MKdHOWyZaAS3h5LtdsnLWXae2' && !showForm && (
            <Button variant="contained" onClick={handleButtonClick}>Add New Item</Button>
        )}
       
        {showForm && (
          <Formik
            initialValues={initialValues}
            innerRef={formikRef}
            validationSchema={validation}
            onSubmit={uploadData}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <Box m='5px'>
                  <Grid container spacing={3}>
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
                        sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
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
                        sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
                      />
                    </Grid>
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
                        sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box m='5px' marginTop='40px'>
                  <Grid container spacing={3}>
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
                        sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
                      />
                    </Grid>
                    <Grid item>
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
                        sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        variant='filled'
                        type='number'
                        label='Quantity'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.quantity}
                        name='quantity'
                        error={!!touched.quantity && !!errors.quantity}
                        helperText={touched.quantity && errors.quantity}
                        sx={{ width: '350px', "& .MuiInputBase-root": { color: 'black' } }}
                      />
                    </Grid>
                    <Grid item>
                      <FormControl sx={{ width: '350px' }}>
                        <InputLabel>Item Status</InputLabel>
                        <Select value={status} onChange={statusChanger} name='status'>
                          <MenuItem value={'Missing'}>Missing</MenuItem>
                          <MenuItem value={'Available'}>Available</MenuItem>
                          <MenuItem value={'Out of stock'}>Out of stock</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Box m='5px' marginTop='40px'>
                  <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                    <Grid item>
                      <Button variant='contained' component='label' startIcon={<CloudUpload />} sx={{ marginLeft: '20px', background: 'yellow', color: 'black' }}>
                        Upload item photo
                        <input style={{ display: 'none' }} type='file' accept='image/' onChange={imageChanger} id='imageinput' />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant='contained' component='label' startIcon={<CloudUpload />} sx={{ marginLeft: '20px', background: 'yellow', color: 'black' }}>
                        Upload receipt photo
                        <input style={{ display: 'none' }} type='file' accept='image/' onChange={receiptChanger} id='receiptImage' />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button startIcon={<UploadFile />} type='submit' variant='contained' sx={{ background: 'yellow', color: 'black' }}>
                        Upload data to Database
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={handleBackClick}>
                        Back
                      </Button>
                    </Grid>
                  </Grid>

                  <a href={itemImage} target="_blank" rel="noopener noreferrer">
                    <img
                      src={itemImage}
                      alt='itemImage'
                      height='200px'
                      width='200px'
                      style={{ margin: "20px", cursor: 'pointer' }}
                    />
                  </a>
                  <a href={receiptImage} target='_blank' rel='noopener noreferrer'>
                    <img src={receiptImage} alt='receiptImage' height='200px' width='200px' style={{ margin: "20px" }}/>
                  </a>
                </Box>
                <Box marginTop='20px' marginLeft='5px'>

                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Box>

      <Box display='flex' height='75vh' width='97%' justifyContent='center' alignSelf='center' marginLeft='20px' sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .name-column--cell": { color: "#303030" },
        "& .MuiDataGrid-topContainer": { backgroundColor: "#8c2e40", borderBottom: "none" },
        "& .MuiDataGrid-virtualScroller": {},
        "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: "#8c2e40" },
        "& .MuiButtonBase-root": { color: "black" }
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowSelectionModel={selectionModel}
          slots={{toolbar: CustomToolbar}}
          onRowSelectionModelChange={(newSelected) => checkSelected(newSelected)}
          density='comfortable'
        />
      </Box>

      <Modal open={openDetails} onClose={handleDetailsBackClick}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4
        }}>
          <Typography variant="h6" component="h2">
            Item Details {itemDetails.iic}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>IIC:</strong> {itemDetails.iic}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Asset Name:</strong> {itemDetails.assetName}
          </Typography>
          <Typography sx={{ mt: 2 }}>
          <strong>Brand Model:</strong> {itemDetails.brandModel}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>General Specifications:</strong> {itemDetails.genSpecs}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Location:</strong> {itemDetails.location}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Quantity:</strong> {itemDetails.quantity}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Status:</strong> {itemDetails.status}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Item Image:</strong> <img src={itemDetails.itemImage}  style={{ height: '100px', width: '100px' }} />
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Receipt Image:</strong> <img src={itemDetails.receiptImage}  style={{ height: '100px', width: '100px' }} />
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>QR Code:</strong>
                <QRCode value={`Item: ${itemDetails.iic}`} size={100}/>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" onClick={handleDetailsBackClick}>Back</Button>
          </Box>
        </Box>
      </Modal>
      <AdminDrawer />
    </Box>
  );
};

export default AddItem;

