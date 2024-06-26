import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button } from '@mui/material';
import { DataGrid, GridToolbar, gridFilteredSortedRowEntriesSelector, gridVisibleColumnFieldsSelector, useGridApiRef } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminDrawer from './AdminDrawer';
import Header from '../Header';
import CustomGridToolbar from '../CustomToolBar';

const Reports = () => {
  const [reportType, setReportType] = useState('inventory');
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const db = getFirestore();
  const dataGridRef = useGridApiRef(); // Create a reference for the DataGrid API
  const fieldsToIgnore = ["imageUrl", "profileImage", "itemImage", "receiptImage", "id"];

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


  const generatePDF = () => {
    const api = dataGridRef.current;
  
    if (!api) {
      return;
    }
  
    // Get visible columns
    const visibleColumns = gridVisibleColumnFieldsSelector(api.state);
  
    // Get filtered and sorted rows
    const visibleRows = gridFilteredSortedRowEntriesSelector(api.state);
  
    const doc = new jsPDF('landscape');
  
    // Add logo
    const logoUrl = '/perpetual-logo.png';
    const imgWidth = 125;
    const imgHeight = 25;
  
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      // Add the first image (logo)
      doc.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);
  
      // Load and position the second image
      const secondImgUrl = '/Picture2.png';
      const secondImg = new Image();
      secondImg.src = secondImgUrl;
      secondImg.onload = () => {
        const x2 = 215; // Adjust x-coordinate to position second image next to the first image
        doc.addImage(secondImg, 'PNG', x2, 15, 60, 20);
  
        // Add header
        doc.setFontSize(16).setFont(undefined, 'bold');
        doc.setTextColor(128, 0, 0); // Maroon color
        doc.text("INVENTORY OF BSECE LABORATORY TOOLS & EQUIPMENTS S.Y. 2022 – 2023", 150, 50, { align: 'center' });
  
        // Add DataGrid content
        const startY = 60; // Position of DataGrid below logo and header
        const headers = visibleColumns.map((colField) => columns.find(col => col.field === colField).headerName);
        const rowsData = visibleRows.map(({ model }) =>
          visibleColumns.map((colField) => model[colField])
        );
  
        doc.autoTable({
          head: [headers],
          body: rowsData,
          startY: startY,
          theme: 'grid',
          styles: {
            headerFill: [128, 0, 0], // Maroon color for header background
            textColor: [255, 255, 255], // White color for header text
            alternateRowFill: [245, 245, 220], // Yellow color for alternate rows
          },
          bodyStyles: { textColor: [0, 0, 0] }, // Black color for body text
          didDrawPage: addFooter // Call addFooter function after drawing each page
        });
  
        // Save PDF
        doc.save(`${reportType}_report.pdf`);
      };
    };
  
    // Function to add footer
    function addFooter() {
      const pageCount = doc.internal.getNumberOfPages(); // Get total number of pages
  
      // Footer content
      const footerContentLeft = {
        text: `${reportType.toUpperCase()} Report - Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
        x: 10,
        y: doc.internal.pageSize.height - 10,
        align: 'left'
      };
  
      const footerContentRight = {
        text: "UPHMO-COE-ACAD-1020/rev0",
        x: doc.internal.pageSize.width - 10,
        y: doc.internal.pageSize.height - 10,
        align: 'right'
      };
  
      // Set font style for footer
      doc.setFontSize(10);
      doc.setTextColor(100); // Dark gray color
  
      // Add left footer text
      doc.text(footerContentLeft.text, footerContentLeft.x, footerContentLeft.y, { align: footerContentLeft.align });
  
      // Add right footer text
      doc.text(footerContentRight.text, footerContentRight.x, footerContentRight.y, { align: footerContentRight.align });
    }
  };
  
  

  

  return (
    <div style={{ textAlign: 'center', paddingTop: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header title="Reports Generation" description="Choose an item, then generate a report through PDF encoding" />
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
            apiRef={dataGridRef} // Assign the reference to the DataGrid API
            slots={{ toolbar: CustomGridToolbar }}
            sx={{
              '@media print': {
                '.MuiDataGrid-main': { color: 'black' },
                '.MuiDataGrid-root ': { color: 'black' },
              }
            }}
            rows={rows}
            columns={columns}
            pageSize={5}
          />
        </div>
        <Button variant="contained" onClick={generatePDF} style={{ marginBottom: '20px' }}>
          Export to PDF
        </Button>
      </div>
      <AdminDrawer />
    </div>
  );
};

export default Reports;
