import React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material'


const Header : React.FC = () : React.ReactElement => {
  return (

    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Uutissivusto
        </Typography>
      </Toolbar>
    </AppBar>
  </Box>

  );
}

export default Header;