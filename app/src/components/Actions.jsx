import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CreatePresale from "./CreateICOForm";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";

const Actions = () => {
  const [network, setNetwork] = useState("Devnet");
  const [createPresaleDialogOpen, setCreatePresaleDialogOpen] = useState(false);
  return (
    <div>
      <Box>
        <Grid item xs={12} md={12}>
          <Box display="flex" justifyContent="space-between" gap={2} p={2}>
            <Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => setCreatePresaleDialogOpen(true)}
                  endIcon={<LocalGroceryStoreIcon fontSize="small"/>}
                 >
                  Create presale
                </Button>
              </Box>
            </Box>
            <Box>
              <Box>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => {
                    setNetwork((state) => {
                      if (state === "Devnet") {
                        return "Mainnet";
                      } else {
                        return "Devnet";
                      }
                    });
                  }}
                >
                  {network}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
      <CreatePresale
        open={createPresaleDialogOpen}
        onClose={() => setCreatePresaleDialogOpen(false)}
      />
    </div>
  );
};

export default Actions;
