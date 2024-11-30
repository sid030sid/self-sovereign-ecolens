import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Typography} from '@mui/material';

export default function Navbar(props) {
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={props.handleDrawerMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" component="div" sx={{flexGrow:1}}>
            EPFL restaurant 1
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}