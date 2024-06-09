import React from 'react';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

// Custom styled toolbar container
const CustomGridToolbarContainer = styled(GridToolbarContainer)({
  '& .MuiButtonBase-root': {
    color: 'black',
  },
});

const CustomGridToolbar = () => {
  return (
    <CustomGridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarQuickFilter />
    </CustomGridToolbarContainer>
  );
};

export default CustomGridToolbar;
