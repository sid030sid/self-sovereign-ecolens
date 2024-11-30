import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import axios from 'axios';
import VcReceivingPopUp from './components/VcReceivingPopUp';

export default function IssuanceForm() {
  const [credentialOfferUrl, setCredentialOfferUrl] = React.useState("")
  const [ecopoints, setEcopoints] = useState("");

  const handlePopUpClose = () => {
    setCredentialOfferUrl("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // create credential offer
    const credentialOfferRes = await axios.post("/api-issuer/offer", {
      ecopoints: ecopoints
    })

    // if credential offer created, then pop-up QR code for user to claim VC offer and thus receive ecopoints
    if(credentialOfferRes){
        setCredentialOfferUrl(credentialOfferRes.data)
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Issue Eco-points
        </Typography>
        <TextField
          type="number"
          label="Number of Eco-points"
          variant="outlined"
          value={ecopoints}
          onChange={(e) => setEcopoints(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
      <VcReceivingPopUp
        open={credentialOfferUrl? true : false} 
        handleClose={handlePopUpClose} 
        url={credentialOfferUrl}
        ecopoints={ecopoints}
      />
    </Container>
  );
}

