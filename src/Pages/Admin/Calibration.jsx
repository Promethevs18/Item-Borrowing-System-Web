import { Box, Button, CircularProgress, FormControlLabel, FormGroup, Switch, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header'
import { Form, Formik } from 'formik'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import * as yup from 'yup'
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete';
import AdminDrawer from './AdminDrawer'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomToolBar from '../CustomToolBar'
import { useAuth } from '../AuthContext'

const Calibration = () => {
    
    const database = getFirestore();
    const [dataRows, setDataRows] = useState([]);
    const [openLoad, setOpenLoad] = useState(false)
    const [selectionModel, setSelectionModel] = useState([])
    const [desc, setDesc] = useState("Not Calibrated");

    const initialValues = {
        number: "",
        instrumentType: "",
        manufacturerName: "",
        model: "",
        iic: "",
        stickerNo: "",
        dateCalibrated: "",
        expirationDate: null, // Added expirationDate field
    };
    
    const formikRef = useRef(null);

    const validation = yup.object().shape({
        number: yup.string().required("This field is required"),
        manufacturerName: yup.string().required("This field is required"),
        instrumentType: yup.string().required("This field is required"),
        model: yup.string().required("This field is required"),
        iic: yup.string().required("This field is required"),
        stickerNo: yup.string().required("This field is required"),
        dateCalibrated: yup.string().required("This field is required"),
        expirationDate: yup.string().required("This field is required"), // Added validation for expirationDate
    });

    const addData = async (values) => {
        setOpenLoad(true)

        await setDoc(doc(database, "Calibrated Items", values.number), {
            ...values,
            status: desc
        }).then(() => {
            setOpenLoad(false)
            toast.success("Data uploaded successfully!")
        }).catch((error) => {
            toast.info(`Error occurred due to: ${error}`)
        })
    }

    const switchChanger = (event) => {
        setDesc(event.target.checked ? "Calibrated" : "Not Calibrated")
    }

    useEffect(() => {
        const getData = async () => {
            const querySnap = await getDocs(collection(database, "Calibrated Items"));
            const data = querySnap.docs.map((mapa) => ({ id: mapa.id, ...mapa.data() }))

            setDataRows(data)
        }
        getData();
    })

    const burahin = async (laman) => {
        setOpenLoad(true)
        await deleteDoc(doc(database, "Calibrated Items", `${laman}`)).then(() => {
            setOpenLoad(false)
            toast.success("Data deleted successfully!")
        });
    }

    const dataColumns = [
        { field: "number", headerName: "Number", flex: 1 },
        { field: "instrumentType", headerName: "Instrument Type", flex: 1 },
        { field: "model", headerName: "Model", flex: 1 },
        { field: "iic", headerName: "Student iic", flex: 1 },
        { field: "manufacturerName", headerName: "Manufacturer's Name", flex: 1 },
        { field: "stickerNo", headerName: "Sticker No.", flex: 1 },
        { field: "dateCalibrated", headerName: "Date Calibrated", flex: 1 },
        { field: "expirationDate", headerName: "Expiration Date", flex: 1 }, // Added column for expirationDate
        {
            field: "actions", type: 'actions', headerName: 'Action', flex: 1, getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label='Delete'
                    onClick={() => {
                        burahin(params.id)
                    }}
                    sx={{ color: 'red' }}
                />
            ]
        }
    ];

    const checkSelected = async (items) => {
        const selectedID = items[0];
        setSelectionModel(items)
        setOpenLoad(true);
        try {
            const takeItems = doc(database, `Calibrated Items/${selectedID}`);
            const snap = await getDoc(takeItems);

            if (snap.exists()) {
                const updatedIni = snap.data();
                formikRef.current.setValues(updatedIni);
                setOpenLoad(false)
            }
        }
        catch (error) {
            setOpenLoad(false);
            toast.error(`Error occurred due to: ${error}`);
        }
    }

    return (
        <Box m="20px">
            {/* Loading element */}
            {openLoad !== false && (
                <CircularProgress
                    sx={{
                        color: 'blue',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                    }}
                    size="80px"
                />
            )}

            {/* HEADER */}
            <Header
                title="Calibration List"
            />
            <Box m="20px" display="flex" justifyContent="space-between">
                <Box display="flex">
                    <Formik
                        innerRef={formikRef}
                        initialValues={initialValues}
                        validationSchema={validation}
                    >
                        {({ values, errors, touched, handleBlur, handleChange }) => (
                            <Form>
                                <Box grid="flex">
                                    <Box display="flex" m="5px" marginTop='100px' marginLeft='20px'>
                                        <TextField
                                            variant="filled"
                                            fullWidth
                                            type="text"
                                            value={values.number}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Number"
                                            name="number"
                                            error={!!touched.number && !!errors.number}
                                            helperText={
                                                touched.number && (
                                                    <span className="error-message">
                                                        {errors.number}
                                                    </span>
                                                )
                                            }
                                            sx={{ maxWidth: "50%", marginRight: "2px" }}
                                        />

                                        <TextField
                                            variant="filled"
                                            fullWidth
                                            type="text"
                                            value={values.iic}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Physical IIC"
                                            name="iic"
                                            error={!!touched.iic && !!errors.iic}
                                            helperText={
                                                touched.iic && (
                                                    <span className="error-message">
                                                        {errors.iic}
                                                    </span>
                                                )
                                            }
                                            sx={{ maxWidth: "50%", marginLeft: "15px" }}
                                        />
                                    </Box>

                                    <Box display="flex" m="5px">
                                        <TextField
                                            variant="filled"
                                            fullWidth
                                            type="text"
                                            value={values.stickerNo}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Sticker Number"
                                            name ="stickerNo"
                                            error={!!touched.stickerNo && !!errors.stickerNo}
                                            helperText={
                                                touched.stickerNo && (
                                                    <span className="error-message">
                                                        {errors.stickerNo}
                                                    </span>
                                                )
                                            }
                                            sx={{ maxWidth: "50%", marginLeft: "15px", marginTop: "10px" }}
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Expiration Date"
                                                value={values.expirationDate}
                                                onChange={(date) => {
                                                    handleChange({
                                                        target: {
                                                            name: "expirationDate",
                                                            value: date,
                                                        },
                                                    });
                                                }}
                                               
                                                sx={{ maxWidth: "50%", marginLeft: "15px", marginTop: "10px" }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box display="flex" m="5px">
                                        <TextField
                                            variant="filled"
                                            fullWidth
                                            type="text"
                                            value={values.instrumentType}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Instrument Type"
                                            name="instrumentType"
                                            error={!!touched.instrumentType && !!errors.instrumentType}
                                            helperText={
                                                touched.instrumentType && (
                                                    <span className="error-message">{errors.instrumentType}</span>
                                                )
                                            }
                                            sx={{ maxWidth: "50%", marginLeft: "15px", marginTop: "10px" }}
                                        />
                                        <TextField
                                            variant="filled"
                                            fullWidth
                                            type="text"
                                            value={values.manufacturerName}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Manufacturing Name"
                                            name="manufacturerName"
                                            error={!!touched.manufacturerName && !!errors.manufacturerName}
                                            helperText={
                                                touched.instrumentType && (
                                                    <span className="error-message">{errors.manufacturerName}</span>
                                                )
                                            }
                                            sx={{ maxWidth: "50%", marginLeft: "15px", marginTop: "10px" }}
                                        />
                                    </Box>
                                    <Box m='5px' display='flex' >
                                        <TextField
                                            variant="filled"
                                            fullWidth
                                            type="text"
                                            value={values.model}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Model"
                                            name="model"
                                            error={!!touched.model && !!errors.model}
                                            helperText={
                                                touched.model && (
                                                    <span className="error-message">{errors.model}</span>
                                                )
                                            }
                                            sx={{ maxWidth: "50%", marginLeft: "15px", marginTop: "10px" }}
                                        />
                                        <TextField
                                            variant="filled"
                                            fullWidth
                                            type="text"
                                            value={values.dateForCalibration}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Date for Calibration"
                                            name="dateForCalibration"
                                            error={!!touched.dateForCalibration && !!errors.dateForCalibration}
                                            helperText={
                                                touched.dateForCalibration && (
                                                    <span className="error-message">{errors.dateForCalibration}</span>
                                                )
                                            }
                                            sx={{ maxWidth: "50%", marginLeft: "15px", marginTop: "10px" }}
                                        />
                                    </Box>
                                    <FormGroup sx={{ margin: '20px' }}>
                                        <FormControlLabel control={<Switch color='secondary' onChange={switchChanger} />} label={desc} />
                                    </FormGroup>
                                    <Button
                                        variant="contained"
                                        sx={{ m: "20px", background: 'yellow', color: 'black' }}
                                        onClick={() => addData(values)}
                                    >Update Information</Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignContent="center"
                    height="65vh"
                    width="65%"
                    sx={{
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
                        "& .MuiButtonBase-root": {
                            color: 'wheat'
                        }
                    }}
                >
                    <DataGrid
                        columns={dataColumns}
                        rows={dataRows}
                        editMode="row"
                        rowSelectionModel={selectionModel}
                        slots={{toolbar: CustomToolBar}}
                        onRowSelectionModelChange={(newSelected) => checkSelected(newSelected)}
                        sx={{
                            '@media print': {
                                '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
                            },
                        }}
                    />
                </Box>
            </Box>
            <AdminDrawer />
        </Box>
    )
}

export default Calibration

