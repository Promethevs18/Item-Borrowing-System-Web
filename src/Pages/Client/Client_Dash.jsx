import { Box } from '@mui/material'
import React, { useState } from 'react'
import Header from '../Header'
import { DataGrid } from '@mui/x-data-grid'
import ClientDrawer from './ClientDrawer'


const Client_Dash = ({user}) => {

  const [dataRows, setDataRows] = useState([])

  const dataColumns = [
    { field: "number", headerName: "Number", flex: 1},
    { field: "number", headerName: "Number", flex: 1},
    { field: "number", headerName: "Number", flex: 1},
  ]

  return (
    <Box>
        <Header title="Client Dashboard" description="These are the items available to borrow"/>

        <Box m='20px' display='flex' justifyContent='center'>
        <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
        height="78vh"
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
          "& .MuiButtonBase-root":{
            color: 'wheat'
          }
        }}
      >
        <DataGrid
          columns={dataColumns}
          rows={dataRows}
          editMode="row"
          slots={
            {       
          }}
          sx={{
            '@media print':{
              '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
            },
            '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
              backgroundColor: "maroon",
              color: "white",
              fontWeight: 700,
           },
           '& .MuiTablePagination-root':{
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
          <ClientDrawer user={user}/>
    </Box>
  )
}

export default Client_Dash