import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function VpSuccessPopUp(props) {

    return (
        <React.Fragment>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>Ecopoints successfully presented!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The customer has {props.ecopointsCredential.ecopoints} Eco-points that were issued by {props.ecopointsCredential.issuer}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}