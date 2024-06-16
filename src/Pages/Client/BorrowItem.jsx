import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Header from '../Header';
import { DataGrid } from '@mui/x-data-grid';
import ClientDrawer from './ClientDrawer';
import { collection, getDocs, getFirestore, query, where, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import CustomGridToolbar from '../CustomToolBar';

const BorrowItem = ({ user }) => {
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
        collection(database, "Items"),
        where("ItemExistence", "!=", "borrowed")
      );

      const queryData = await getDocs(itemsQuery);
      const data = queryData.docs.map((mapa) => ({
        id: mapa.id,
       ...mapa.data()
      }));
      setDataRows(data);
    };

    getData();
  }, [database]); // Added dependency array to ensure the effect runs only once

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
  };

  const borrowItem = async () => {
    const userDisplayName = user.displayName || 'Unknown User';
    const userEmail = user.email || 'unknown@example.com';
    const userPhotoURL = user.photoURL || '';
    const requestDate = new Date().toISOString(); // Current date in ISO format
  
    try {
      // Get the current transaction counter from Firestore
      const counterDocRef = doc(database, "Counters", "transactionCounter");
      const counterDoc = await getDoc(counterDocRef);
      let transactionNumber = 1; // Default value if counter document doesn't exist
  
      if (counterDoc.exists()) {
        transactionNumber = counterDoc.data().value;
      }
  
      // Borrow selected items
      for (let itemId of selectedRows) {
        // Get the item details from dataRows
        const itemDetails = dataRows.find((item) => item.id === itemId);
        if (itemDetails) {
          // Generate transaction code
          const transactionCode = `2024-${padWithZeros(transactionNumber, 5)}`;
  
          // Add to Requests collection with the transaction number
          await addDoc(collection(database, `Requests`), {
            transactionCode: transactionCode,
            tools: itemDetails.assetName,
            borrower: userDisplayName,
            email: userEmail,
            profileImage: userPhotoURL,
            date: requestDate,
            iic: itemDetails.iic,
            assetName: itemDetails.assetName,
            brandModel: itemDetails.brandModel,
            genSpecs: itemDetails.genSpecs,
            location: itemDetails.location
           
          });
  
          // Update ItemStatus in Items collection
          const itemDocRef = doc(database, "Items", itemId);
          await updateDoc(itemDocRef, { ItemExistence: "borrowed" });
        }
      }
  
      // Increment the transaction counter in Firestore
      await updateDoc(counterDocRef, { value: transactionNumber + 1 });
  
      toast.info("Items successfully borrowed!");
    } catch (error) {
      console.error("Error borrowing items: ", error);
      toast.error("Error borrowing items. Please try again.");
    }
  };
  
  // Function to pad a number with zeros to ensure it has a certain length
  const padWithZeros = (number, length) => {
    let result = number.toString();
    while (result.length < length) {
      result = "0" + result;
    }
    return result;
  };
  
  

  return (
    <Box>
      <Header title="Item Lists" description="These are the items available to borrow" />

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
            checkboxSelection
            keepNonExistentRowsSelected
            slots={{toolbar: CustomGridToolbar}}
            onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
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
        <Button variant='contained' onClick={borrowItem}>Borrow Selected Items</Button>
      </Box>

      <ClientDrawer user={user} />
    </Box>
  );
}

export default BorrowItem;
