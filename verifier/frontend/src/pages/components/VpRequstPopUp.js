import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from "react-qr-code";
import { Link } from '@mui/material';

export default function VpRequestPopUp(props) {

    return (
        <React.Fragment>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle>Present your Ecopoints</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Present the Verifable Credential that attest your owned Ecopoints in order to use them for purchasing the selected meal.
                    </DialogContentText>
                    <br></br>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <QRCode value={props.url}/>
                    </div>
                    <br></br>
                    <DialogContentText>
                        NOTE:         
                    </DialogContentText>
                    <DialogContentText>
                        1. To present verifiable credentials wallets are needed. We recommend using grant.io's  <Link href="https://igrant.io/datawallet.html">Data Wallet</Link>.
                    </DialogContentText>
                    <DialogContentText>
                        2. Ensure that you only have one Ecopoint verifiable credential in your wallet before scanning the QR code for OID4VP.       
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}