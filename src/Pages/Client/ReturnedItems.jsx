import { Box } from '@mui/material'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Header from '../Header';
import { DataGrid } from '@mui/x-data-grid';
import ClientDrawer from './ClientDrawer';
import { getAuth } from 'firebase/auth';

const ReturnedItems = ({user}) => {
    const database = getFirestore();
    
    const [dataRows, setDataRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    
    const dataColumns = [
      { field: "iic", headerName: "IIC Number", flex: 1 },
      { field: "assetName", headerName: "Asset Name", flex: 1 },
      { field: "brandModel", headerName: "Brand Model", flex: 1 },
      { field: "genSpecs", headerName: "General Specifications", flex: 1 },
      { field: "location", headerName: "Item Location", flex: 1 },
    ];
  
    useEffect(() => {
      const getData = async () => {
        const itemsQuery = query(
          collection(database, "Returned Items"),
          where("borrower", "==", `${user.displayName}`)
        );
  
        const queryData = await getDocs(itemsQuery);
        const data = queryData.docs.map((mapa) => ({
          id: mapa.id,
         ...mapa.data()
        }));
        setDataRows(data);
      };
  
      getData();
    }); // Added dependency array to ensure the effect runs only once
  
    const handleSelectionChange = (newSelectionModel) => {
      setSelectedRows(newSelectionModel);
    };
 
    return (
      <Box>
        <Header title="Returned Items List" description="Items you returned are listed here" />
  
        <Box m='20px' display='flex' justifyContent='center'>
          <Box
            display="flex"
            justifyContent="center"
            alignContent="center"
            height="70vh"
            width="95%"
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
              "& .MuiDataGrid-topContainer": {
                background: 'maroon',
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: '#8c2e40',
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: 'maroon',
              },
              "& .MuiButtonBase-root": {
                color: 'wheat'
              }
            }}
          >
            <DataGrid
              columns={dataColumns}
              rows={dataRows}
              keepNonExistentRowsSelected
              sx={{
                '@media print': {
                  '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
                },
                '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                  backgroundColor: "maroon",
                  color: "white",
                  fontWeight: 700,
                },
                '& .MuiTablePagination-root': {
                  color: "white",
                  fontWeight: 700,
                },
                '& .MuiButtonBase-root': {
                  color: "white",
                  fontWeight: 700,
                }
              }}
            />
          </Box>
        </Box>
        <Box m='20px' display='flex' justifyContent='center'>
    
        </Box>
  
        <ClientDrawer user={user} />
      </Box>
    )
}
export default ReturnedItems