import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { donateToCampaign } from '../solana/requests';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function BuyTokenForm({ item, open, onClose, totalCoins = 100000000000000, totalSOL = 1000 }) {
  
  const [object, setObject] = useState({
    pubId: null,
    sol: null
  });

  const price_per_one_token = totalSOL / totalCoins;
  const price_per_one_token_20 = price_per_one_token.toFixed(20);
  const tokensCount = (object.sol / price_per_one_token_20).toLocaleString();

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Buy tokens</DialogTitle>
        <DialogContent>
          <TextField
            value={object.sol || ''}
            margin="dense"
            helperText='How count of SOL you are want to invest?'
            label="SOL"
            onChange={(e) => setObject({ ...object, sol: e.target.value, pubId: item?.pubId.toString() })}
            fullWidth
          />
          <Box pt={2} display='flex' justifyContent='center'>
            <Typography variant='h6'>
              {tokensCount} tokens
          </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            donateToCampaign(
              object.pubId, 
              object.sol, 
              item
              ).then(() => onClose());
          }} disabled={!object.pubId && !object.sol}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}