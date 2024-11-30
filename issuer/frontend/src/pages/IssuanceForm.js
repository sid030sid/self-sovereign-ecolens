import React from 'react';
import { Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import VcReceivingPopUp from './components/VcReceivingPopUp';


export default function IssuanceForm() {
  const [credentialOfferUrl, setCredentialOfferUrl] = React.useState("")

  const handlePopUpClose = () => {
    setCredentialOfferUrl("")
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Issue Eco-points
      </Typography>
      <VcReceivingPopUp
        open={credentialOfferUrl? true : false} 
        handleClose={handlePopUpClose} 
        url={credentialOfferUrl}
      />
    </Container>
  );
}
