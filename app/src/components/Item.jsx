import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";

import BuyTokenForm from "./BuyTokenForm";
import { useParams } from "react-router-dom";
import ItemHead from "./ItemHead";

const Item = ({ list }) => {
  const params = useParams();
  const item = list.find(i => i.pubId.toString() === params.hash);
  const [openBuyForm, setOpenBuyForm] = useState(false);
  

  return (
    <Grid container justifyContent="center" gap={2}>
      <Grid item xs={12} md={3} xl={3}>
        <Paper>
          <Box p={2}>
            <ItemHead item={item} links={false}/>
            <Box pt={2}>
              <Typography variant="body1" paragraph>
                Description
              </Typography>
              <Typography variant="body2" color="gray" paragraph style={{ wordBreak: 'break-all' }}>
                {item?.campaign_description}
              </Typography>
            </Box>
            <Grid container justifyContent="center" gap={1}>
              <Button variant="contained" onClick={() => setOpenBuyForm(true)}>
                Buy
              </Button>
            </Grid>
          </Box>
        </Paper>
      </Grid>
      
      {/*<Grid item xs={12} md={6} lg={3}>
        <Paper>
          <Box p={2}>
            <Typography variant="body1" color="gray" paragraph>
              Transactions
            </Typography>
            <Box overflow="auto" maxHeight={200}>
              <Typography variant="subtitle2" paragraph>
                ..........................
              </Typography>
            </Box>
          </Box>
        </Paper>
  </Grid> */}
      <BuyTokenForm item={item} open={openBuyForm} onClose={() => setOpenBuyForm(false)} />
    </Grid>
  );
};

export default Item;
