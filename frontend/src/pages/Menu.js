import React from 'react';
import { Grid, Container, Typography } from '@mui/material';
import MediaCard from './components/MediaCard';
import VpRequestPopUp from './components/VpRequstPopUp';
import VpSuccessPopUp from './components/VpSuccessPopUp';
import axios from 'axios';

const meals = [
    {
        name: "Vegan Fish and Chips",
        price: 9.99,
        numberEcoPointsNeeded: 10,
        description: "Vegan Fish based local Mushroom",
        image: "https://media.istockphoto.com/id/1178035212/photo/british-traditional-fish-and-chips-with-mashed-peas-tartar-sauce-and-cold-beer.jpg?s=612x612&w=0&k=20&c=10IPCrlJ067jWKtaN9CVlWfPA8XDM451dZk23lMP9_Q=",
    },
    {
        name: "Grilled Chicken Salad",
        price: 12.50,
        description: "Fresh mixed greens topped with grilled chicken and balsamic dressing.",
        image: "https://media.istockphoto.com/id/1036965974/photo/caprese-lunch-bowl-with-grilled-chicken.jpg?s=612x612&w=0&k=20&c=VoB4Gag47G7q2KlVIWj2JzB915zCk8A8i0UirW2WTa8=",
    },
    {
        name: "Tiramisu",
        price: 8,
        description: "Delicious Italian dessert with layers of mascarpone and coffee-soaked sponge.",
        image: "https://img.freepik.com/free-photo/layered-chocolate-tiramisu-cake-with-mascarpone-cream-generated-by-ai_188544-18033.jpg",
    },
];

export default function Menu() {
  const [oid4vpUrl, setOid4vpUrl] = React.useState("")
  const [ecopointsCredential, setEcopointsCredenital] = React.useState("")

  const handlePopUpClose = () => {
    setOid4vpUrl("")
  }
  const handlePop2UpClose = () => {
    setEcopointsCredenital("")
  }

  const buyWithEcopoints = async () => {
    const requestOid4vpUrl = await axios.get("/api-verifier/generate-vp-request");

    // update url for user to scan and initiate OID4VP
    setOid4vpUrl(requestOid4vpUrl.data.vpRequest)

    //websocket connection to get token from verifier service
    const state = requestOid4vpUrl.data.state
    const ws = new WebSocket(`wss://${process.env.REACT_APP_BASE_URL}/ws?state=${state}`);
    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const ecopoints = data.ecopoints;
        const issuer = data.issuer;

        console.log("data:", data)
        
        if (ecopoints & issuer) {
            // update view because of successful OID4VP
            setOid4vpUrl("")
            setEcopointsCredenital({
              ecopoints: ecopoints,
              issuer: issuer
            })
        }else{
            alert("Data from Ecopoints VC not received after OID4VP")
        }
    };
    ws.onclose = () => {
        console.log("WebSocket connection closed");
    };
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Menu
      </Typography>
      <Grid container spacing={4}>
        {meals.map((meal, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <MediaCard meal={meal} buyWithEcopoints={buyWithEcopoints}/>
          </Grid>
        ))}
      </Grid>
      <VpRequestPopUp 
        open={oid4vpUrl? true : false} 
        handleClose={handlePopUpClose} 
        url={oid4vpUrl}
      />
      <VpSuccessPopUp 
        open={ecopointsCredential? true : false} 
        handleClose={handlePop2UpClose}
        ecopointsCredential={ecopointsCredential} 
      />
    </Container>
  );
}
