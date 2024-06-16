import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button } from '@mui/material';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminDrawer from './AdminDrawer';
import Header from '../Header';
import CustomToolbar from '../CustomToolBar';

const Reports = () => {
  const [reportType, setReportType] = useState('inventory');
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const db = getFirestore();
  const dataGridRef = useGridApiRef()
  const fieldsToIgnore = ["imageUrl", "profileImage", "itemImage", "receiptImage"];

  const handleChange = (event) => {
    setReportType(event.target.value);
  };

  const formalizeHeader = (key) => {
    const camelCaseKey = key.replace(/(_\w)/g, matches => matches[1].toUpperCase());
    const spacedWords = camelCaseKey.replace(/([a-z])([A-Z])/g, '$1 $2');
    return spacedWords.charAt(0).toUpperCase() + spacedWords.slice(1);
  };

  const fetchData = async () => {
    let data = [];
    let cols = [];
    try {
      let querySnapshot;
      if (reportType === 'Utilization') {
        const requestsQuery = query(
          collection(db, 'Requests')
        );
        const returnedItemsQuery = query(
          collection(db, 'Returned Items')
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        const returnedItemsSnapshot = await getDocs(returnedItemsQuery);
        querySnapshot = [...requestsSnapshot.docs, ...returnedItemsSnapshot.docs];
      } else {
        querySnapshot = await getDocs(collection(db, reportType));
      }
      
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      if (data.length > 0) {
        cols = Object.keys(data[0]).filter(key => !fieldsToIgnore.includes(key)).map((key) => ({
          field: key,
          headerName: formalizeHeader(key),
          width: 150,
        }));
      }
      setRows(data);
      setColumns(cols);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reportType]);

  // const generatePDF = () => {
  //   const doc = new jsPDF();
  
  //   // Add logo
  //   const logoUrl = '/perpetual-logo.png';
  //   const imgWidth = 50;
  //   const imgHeight = 15;
  
  //   try {
  //     const img = new Image();
  //     img.src = logoUrl;
  //     img.onload = () => {
  //       doc.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);
  //       //generateContent();
  //     };
  //   } catch (error) {
  //     console.error('Error adding logo to PDF:', error);
  //    // generateContent();
  //   }

  //   // const generateContent = () => {
  //   //   // Add header
  //   //   doc.setFontSize(16);
  //   //   doc.setTextColor(128, 0, 0); // Maroon color
  //   //   doc.text("Item Borrowing System", 105, 20, { align: 'center' });
  //   //   doc.setFontSize(12);
  //   //   doc.setTextColor(0, 0, 0); // Black color
  //   //   doc.text("Report Type: " + reportType.toUpperCase(), 105, 30, { align: 'center' });
  
  //   //   // Get DataGrid visible rows
  //   //   const visibleRows = dataGridRef.current.getAllRowModels();
  //   //   const visibleData = visibleRows.map(row => row.data); // Access the data property
    
  
  //   //   // Add DataGrid content
  //   //   doc.autoTable({
  //   //     head: [columns.map((col) => col.headerName)],
  //   //     body: visibleData.map((row) => columns.map((col) => row[col.field])),
  //   //     startY: 40, // Position of DataGrid below logo and header
  //   //     theme: 'grid',
  //   //     styles: {
  //   //       headerFill: [128, 0, 0], // Maroon color for header background
  //   //       textColor: [255, 255, 255], // White color for header text
  //   //       alternateRowFill: [245, 245, 220], // Yellow color for alternate rows
  //   //     },
  //   //     bodyStyles: { textColor: [0, 0, 0] } // Black color for body text
  //   //   });
  
  //   //   // Save PDF
  //   //   doc.save(`${reportType}_report.pdf`);
  //   // };
  // };

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header title="Reports Generation" description="Choose an item, then generate a report through PDF encoding"/>
      <div style={{ backgroundColor: '#8c2e40', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)', maxWidth: '90%' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend" style={{ color: 'yellow' }}>Select Report Type</FormLabel>
          <RadioGroup row value={reportType} onChange={handleChange}>
            <FormControlLabel value="Items" control={<Radio />} label="Inventory Report" />
            <FormControlLabel value="Calibrated Items" control={<Radio />} label="Calibration Report" />
            <FormControlLabel value="Utilization" control={<Radio />} label="Utilization Report" />
          </RadioGroup>
        </FormControl>
        <div style={{ height: 400, width: '100%', marginTop: '20px', marginBottom: '20px' }}>
          <DataGrid
            ref={dataGridRef}
            slots={{ toolbar: GridToolbar }}
            sx={{ 
             '@media print':{
                    '.MuiDataGrid-main': { color: 'black' },
                    '.MuiDataGrid-root ': { color: 'black' },
                  }
              }}
            rows={rows}
            columns={columns}
            pageSize={5}
          />
        </div>
      </div>
      <AdminDrawer/>
    </div>
  );
};

export default Reports;
