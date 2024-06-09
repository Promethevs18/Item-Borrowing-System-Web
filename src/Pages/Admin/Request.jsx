import { Box, Button, CircularProgress } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Header from '../Header';
import AdminDrawer from './AdminDrawer';
import { DataGrid } from '@mui/x-data-grid';
import QRCode from 'qrcode';
import emailjs from '@emailjs/browser';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const Request = () => {
    const [requests, setRequests] = useState([]);
    const [openLoad, setOpenLoad] = useState(false);

    const db = getFirestore();
    const storage = getStorage();

    const columns = [
        { field: 'transactionCode', headerName: 'Transaction Code', flex: 1 },
        { field: 'borrower', headerName: 'Borrower', flex: 1 },
        { field: 'date', headerName: 'Date requested', flex: 1 },
        { field: 'tools', headerName: 'Tools requested', flex: 1 },
        { field: 'actions', type: 'actions', headerName: 'Action', flex: 1, getActions: (params) => [
            <Button
                variant="contained"
                color="primary"
                onClick={() => approve(params.row.id, params.row)}>
                Approved
            </Button>,
            <Button
                variant="contained"
                color="secondary"
                onClick={() => { denied(params.row.id, params.row) }}>
                Denied
            </Button>
        ] }
    ];

    useEffect(() => {
        const getData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Requests"));
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    transactionCode: doc.id,
                    ...doc.data()
                }));
                setRequests(data);
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [db]);

    const generateQRCode = async (value) => {
        try {
            const qrCodeUrl = await QRCode.toDataURL(value);
            return qrCodeUrl;
        } catch (error) {
            console.log(`Error generating QR Code ${error}`);
            return null;
        }
    };

    const uploadQRCode = async (qrCodeDataUrl) => {
        try {
            const qrCodeRef = ref(storage, 'qr_codes/' + Date.now() + '.png');
            await uploadString(qrCodeRef, qrCodeDataUrl, 'data_url');
            const downloadUrl = await getDownloadURL(qrCodeRef);
            return downloadUrl;
        } catch (error) {
            console.error("Error uploading QR code:", error);
            return null;
        }
    };

    const approve = async (docId, values) => {
        setOpenLoad(true);
        try {
            const qrRoute = await generateQRCode(docId);
            const qrDownloadUrl = await uploadQRCode(qrRoute);
            if (qrDownloadUrl) {
                const emailTemplate = {
                    ...values,
                    transaction_code: docId,
                    qr_code: qrDownloadUrl
                };
                await setDoc(doc(db, "Approved Requests", docId), {
                    ...values,
                    transaction_code: docId,
                });
                await emailjs.send("service_t1pnh7h", "template_caoc6rw", emailTemplate, "w6M46-gvrb52cc9Sz");
                console.log("Email sent successfully");
                setOpenLoad(false);
            }
        } catch (error) {
            console.error("Error:", error);
            setOpenLoad(false);
        }
    };

    const denied = async (docId, values) => {
        setOpenLoad(true);
        try {
                await deleteDoc(doc(db, "Requests", docId));
                setRequests(requests.filter(request => request.id !== docId));

                await setDoc(doc(db, "Rejected Requests", docId), {
                    ...values,
                    transaction_code: docId,
                });
            
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setOpenLoad(false);
        }
    };

    return (
        <Box m='20px'>
            {openLoad && (
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

            <Header title="Requests Manifesto" description="This page displays the list for the request of items borrowed by some users" />

            <Box display='flex' justifyContent='center' alignItems='center' height='75vh' width='97%' m='20px' sx={{
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { borderBottom: "none" },
                "& .name-column--cell": { color: "#303030" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "#ba828c", borderBottom: "none" },
                "& .MuiDataGrid-virtualScroller": {},
                "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: "#8c2e40" },
                "& .MuiButtonBase-root": { color: "black" },
                "& .MuiDataGrid-virtualScrollerRenderZone": { color: 'black' }
            }}>
                <DataGrid
                    rows={requests}
                    columns={columns}
                />
            </Box>

            <AdminDrawer />
        </Box>
    );
}

export default Request;
