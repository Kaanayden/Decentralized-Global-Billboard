import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import bigNumberToFloat from '../../scripts/bigNumberToFloat';



export default function BillboardCard( props ) {

    const date = new Date(props.billboard.startTime * 1000);
    const goToWebsite = () => {
        window.open( props.domainName );
    }

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
    {"Since: " + date.toString() }
    <br />
    {"Traffic Data: " +  props.billboard.rewardCoefficient }
    <br />
    {"Reward: " +  bigNumberToFloat( props.reward, 12 ) + " BBRD" }
  </Typography>
</CardContent>
<CardActions>
  <Button size="small" onClick = {goToWebsite} >Go to website</Button>
  { props.billboard.ownerAddress.toLowerCase() == props.account.toLowerCase() && props.billboard.isActive &&  <Button size="small" onClick = { () => props.deactivateButton( props.domainName ) }>Deactivate</Button>}
  {props.billboard.ownerAddress.toLowerCase() == props.account.toLowerCase() && !props.billboard.isActive &&  <Button size="small" onClick = { () => props.activateButton( props.domainName ) }>Activate</Button>}
  { props.billboard.ownerAddress.toLowerCase() == props.account.toLowerCase() && props.billboard.isActive &&  <Button size="small" onClick = { () => props.withdraw( props.domainName ) }>Withdraw</Button>}
</CardActions>
</React.Fragment>

      }</Card>
    </Box>
  );
}