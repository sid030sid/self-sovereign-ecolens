import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={props.meal.image}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.meal.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {props.meal.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          variant="outlined" 
          size="small"
          onClick={()=>alert("Not part of demo.")}
        >
          Buy for {props.meal.price} CHF
        </Button>
        {
            props.meal.numberEcoPointsNeeded ? 
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={props.buyWithEcopoints}
                >
                  Buy for {props.meal.numberEcoPointsNeeded} Eco-points
                </Button>
            :
            ""
        }
      </CardActions>
    </Card>
  );
}