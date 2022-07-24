import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';




export default function BillboardCard( props ) {

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{

<React.Fragment>
<CardContent>
  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
    { props.billboard.ownerAddress.toLowerCase() == props.account.toLowerCase() && "Owned by you" }
    { props.billboard.ownerAddress.toLowerCase() != props.account.toLowerCase() && "Owned by " + props.billboard.ownerAddress.toLowerCase() }
  </Typography>
  <Typography variant="h5" component="div">
    { props.domainName }
  </Typography>
  <Typography sx={{ mb: 1.5 }} color="text.secondary">
    { props.billboard.isActive ? "Active" : "Deactivated" 
} { props.billboard.isBanned && "(Banned)" }
  </Typography>
  <Typography variant="body2">
    well meaning and kindly.
    <br />
    {'"a benevolent smile"'}
  </Typography>
</CardContent>
<CardActions>
  <Button size="small">Go to website</Button>
  <Button size="small">Deactivate</Button>
</CardActions>
</React.Fragment>

      }</Card>
    </Box>
  );
}