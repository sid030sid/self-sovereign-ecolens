import {Drawer, List, ListItemButton} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function DrawerMenu(props) {

    // object for changing path in browser for user
    const navigate = useNavigate();
    
    return (
        <Drawer
            className='App-text-bold'
            anchor="left"
            open={props.open}
            onClose={props.closeDrawerMenu}
        >
            <List>
                <ListItemButton onClick={()=>{props.closeDrawerMenu(); navigate("/")}}>
                    Home
                </ListItemButton>
                <ListItemButton onClick={()=>{props.closeDrawerMenu(); navigate("/issue")}}>
                    Issuance form
                </ListItemButton>
            </List>
        </Drawer>
    );
}

export default DrawerMenu;