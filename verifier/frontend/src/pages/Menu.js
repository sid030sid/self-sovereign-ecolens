import React from 'react';
import { Grid, Container, Typography } from '@mui/material';
import MediaCard from './components/MediaCard';

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
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Menu
      </Typography>
      <Grid container spacing={4}>
        {meals.map((meal, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <MediaCard meal={meal} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
