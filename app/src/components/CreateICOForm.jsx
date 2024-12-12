import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createCampaign, createCampaign2 } from '../solana/requests';



export default function CreateICOForm({ open, onClose }) {
  const [object, setObject] = useState({
    campaign_name: null,
    campaign_description: null,
    campaign_image: null,
    campaign_token_mint_account: null,
    campaign_token_count: null,
    campaign_amount: null
  });
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create presale</DialogTitle>
        <DialogContent>
          <TextField
            value={object.campaign_name || ''}
            margin="dense"
            label="Name"
            onChange={(e) => setObject({ ...object, campaign_name: e.target.value })}
            fullWidth
          />
          <TextField
            value={object.campaign_description || ''}
            margin="dense"
            label="Description"
            onChange={(e) => setObject({ ...object, campaign_description: e.target.value })}
            fullWidth
          />

          <TextField
            value={object.campaign_token_mint_account || ''}
            margin="dense"
            label="Token address"
            onChange={(e) => setObject({ ...object, campaign_token_mint_account: e.target.value })}
            fullWidth
          />
          <TextField
            value={object.campaign_token_count || ''}
            margin="dense"
            label="Token count"
            onChange={(e) => setObject({ ...object, campaign_token_count: Number(e.target.value) })}
            fullWidth
          />
          <TextField
            value={object.campaign_amount || ''}
            margin="dense"
            label="SOL amount"
            onChange={(e) => setObject({ ...object, campaign_amount: e.target.value })}
            fullWidth
          />
      
            <Grid container justifyContent='space-between'>
              <Grid item xs={5.8}>
                <TextField
                  value={object.campaign_twitter || ''}
                  margin="dense"
                  label="Website"
                  onChange={(e) => setObject({ ...object, campaign_twitter: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5.8}>
                <TextField
                  value={object.campaign_twitter || ''}
                  margin="dense"
                  label="Twitter"
                  onChange={(e) => setObject({ ...object, campaign_twitter: e.target.value })}
                  fullWidth
                />

              </Grid>
              <Grid item xs={5.8}>
                <TextField
                  value={object.campaign_twitter || ''}
                  margin="dense"
                  label="Telegram"
                  onChange={(e) => setObject({ ...object, campaign_twitter: e.target.value })}
                  fullWidth
                />

              </Grid>
              <Grid item xs={5.8}>
                <TextField
                  value={object.campaign_image || ''}
                  margin="dense"
                  label="Logo"
                  onChange={(e) => setObject({ ...object, campaign_image: e.target.value })}
                  fullWidth
                />

              </Grid>

            </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={async () => {
            await createCampaign2(object);
            onClose();
          }}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}