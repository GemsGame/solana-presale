import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Tooltip, Link as LinkM } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { PublicKey } from '@solana/web3.js';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles(() => ({
  headerLink: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
  }
}));

const ItemHead = ({ item, links = true }) => {
  const style = useStyles();

  const price_per_one_token =
    item?.campaign_amount / item?.campaign_token_count;
  const price_per_one_token_15 = price_per_one_token.toFixed(12);
 
  let address = '';
  if (item?.campaign_token_mint_account) {
    address = new PublicKey(item?.campaign_token_mint_account).toString();
  }


  return (
    <Box>
      <Box display="flex" gap={2}>
        {links && (
          <Link to={item?.pubId.toString()}>
            <Box>
              <Avatar sx={{ height: 80, width: 80 }} src={item && item?.campaign_image} />
            </Box>
          </Link>
        )}
        {!links && (
          <Box>
            <Avatar sx={{ height: 80, width: 80 }} src={item && item?.campaign_image} />
          </Box>
        )}
        <Box width="100%">
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              {links && <Link to={item?.pubId.toString()} className={style.headerLink}>
                <Typography variant="h6" style={{ wordBreak: "break-all" }}>
                  {(() => {
                    if (item.campaign_name?.length > 20) {
                      return item?.campaign_name.slice(0, 15) + '...'
                    } else {
                      return item?.campaign_name;
                    }
                  })()}
                </Typography>
              </Link>}
              {!links &&
                <Typography variant="h6" style={{ wordBreak: "break-all" }}>
                  {(() => {
                    if (item && item.campaign_name?.length > 20) {
                      return item && item.campaign_name?.slice(0, 15) + '...'
                    } else {
                      return item && item?.campaign_name;
                    }
                  })()}
                </Typography>}
            </Grid>
            <Grid>
              <Tooltip title={"The campaign creation time"}>
                <Typography
                  style={{ fontSize: 12 }}
                  variant="subtitle2"
                  color="gray"
                >
                  {item && new Date(item.campaign_time?.toNumber()).toLocaleString()}
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Tooltip
                title={
                  (() => {
                    if(item) {
                      return "Tokens count is " + item.campaign_token_count?.toString();
                    } else {
                      return '';
                    }
                  })()
                }
              >
                <Typography variant="subtitle2">
                  {item && item.campaign_token_count?.toString()}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip
                title={
                  "The price per one token in SOL is " + price_per_one_token_15
                }
              >
                <Typography variant="subtitle2">
                  {price_per_one_token_15}
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item position="relative" style={{ left: -8 }}>
              <IconButton size="small" onClick={(e) => { }}>
                <LanguageIcon sx={{ height: 19.5 }} />
              </IconButton>

              <IconButton size="small">
                <TelegramIcon sx={{ height: 20 }} />
              </IconButton>

              <IconButton size="small">
                <TwitterIcon sx={{ height: 20 }} />
              </IconButton>
            </Grid>

            <Grid item>
              <Tooltip
                title={"The token address " + address}
              >
                <Typography
                  variant="subtitle2"
                  style={{ wordBreak: "break-all", fontSize: 12 }}
                >
                  <LinkM href={"https://explorer.solana.com/address/" + address} style={{ textDecoration: 'none' }}>
                    {address.slice(0, 30) + "..."}
                  </LinkM>
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box pt={1} position="relative">
        <LinearProgress
          variant="determinate"
          value={70}
          style={{ height: 20, borderRadius: 8 }}
        />
        <Typography
          style={{
            position: "absolute",
            color: "white",
            top: 5.5,
            left: 10,
          }}
        >
          {item && item.campaign_fullfiled?.toString()} / 1000 SOL
        </Typography>
      </Box>
    </Box>
  );
};

export default ItemHead;
