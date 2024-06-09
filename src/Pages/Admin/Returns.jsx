import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AdminDrawer from './AdminDrawer'
import Header from '../Header'
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import { Check } from '@mui/icons-material'
import { toast } from 'react-toastify'

const Inventory = () => {

  const database = getFirestore();

  const [pendings, setPendings] = useState([]);
  const [openLoad, setOpenLoad] = useState(false);
  const [naibalik, mgaNabalik] = useState([]);

  useEffect(() => {
    const getData = async () => {
        try {
          const getQuery = await getDocs(collection(database, "Approved Requests"));
          const data = getQuery.docs.map((info) => ({
            id: info.id,
            transactionCode: info.id,
            ...info.data()
          }));
          setPendings(data);
        } catch (error) {
          toast.error(`Error occured due to: ${error}`);
        }
    }

    const getReturns = async () => {
      try {
        const getReturn = await getDocs(collection(database, "Returned Items"));
        const data = getReturn.docs.map((info) => ({
          id: info.id,
          transactionCode: info.id,
          ...info.data()
        }));
        mgaNabalik(data);
      } catch (error) {
        toast.error(`Error occured due to: ${error}`);
      }
    }

    getReturns();
    getData();
  }, [database]);

  const pendingCols = [
    { field: "transactionCode", headerName: "Transaction Code", flex: 1 },
    { field: "borrower", headerName: "Borrower's name", flex: 1 },
    { field: "date", headerName: "Date Requested", flex: 1 },
    { field: "tools", headerName: "Tools borrowed", flex: 1 },
    { field: 'actions', type: 'actions', headerName: "Action", flex: 1, getActions: (params) => [
      <GridActionsCellItem
        icon={<Check />}
        label="Accept"
        onClick={() => returned(params.row)}
      />
    ]}
  ];

  const returnedCols = [
    { field: "transactionCode", headerName: "Transaction Code", flex: 1 },
    { field: "borrower", headerName: "Borrower's name", flex: 1 },
    { field: "date", headerName: "Date Requested", flex: 1 },
    { field: "tools", headerName: "Tools borrowed", flex: 1 },
    { field: "returnedDate", headerName: "Date Returned", flex: 1 }
  ];

  const returned = async (data) => {
    setOpenLoad(true);
    try {
      await setDoc(doc(database, "Returned Items", data.id), {
        ...data,
        returnedDate: new Date().toDateString()
      }).then(() => {
        deleteDoc(doc(database, "Approved Requests", data.id));
      });
      toast.success("Items are returned");
    } catch (error) {
      toast.error(`Error occured due to ${error}`);
    }
    setOpenLoad(false);
  }

  return (
    <Box>
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
      <Header title="RETURN ITEMS" description="This section displays all items that are currently borrowed by different people. All returned items are also shown in this section" />
      <Box display='flex' justifyContent='space-around'>
        <Typography variant='h2' fontSize='40px' sx={{ color: 'blacksmoke', textShadow: " -1px -1px 0 #000, -1px -1px 0 #000, -1px -1px 0 #000, -1px -1px 0 #000" }}>Pending Returns</Typography>
        <Typography variant='h2' fontSize='40px' sx={{ color: 'blacksmoke', textShadow: " -1px -1px 0 #000, -1px -1px 0 #000, -1px -1px 0 #000, -1px -1px 0 #000" }}>Returned Items</Typography>
      </Box>
      <Box m='20px' display='flex' justifyContent='center' height='65vh'>
        <DataGrid
          columns={pendingCols}
          rows={pendings}
          sx={{
            margin: '20px',
            "& .MuiButtonBase-root": { color: "black" },
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: "#303030" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#ba828c", borderBottom: "none" },
            "& .MuiDataGrid-virtualScroller": {},
            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: "#8c2e40" },
            "& .MuiDataGrid-virtualScrollerRenderZone": { color: 'black' }
          }}
        />

        <DataGrid
          columns={returnedCols}
          rows={naibalik}
          sx={{
            margin: '20px',
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: "#303030" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#ba828c", borderBottom: "none" },
            "& .MuiDataGrid-virtualScroller": {},
            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: "#8c2e40" },
            "& .MuiButtonBase-root": { color: "black" },
            "& .MuiDataGrid-virtualScrollerRenderZone": { color: 'black' }
          }}
        />
      </Box>
      <AdminDrawer />
    </Box>
  )
}

export default Inventory
