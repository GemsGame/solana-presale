import React, { useEffect, useState } from "react";
import Actions from "../components/Actions";
import { Grid, Box, Typography, Paper, LinearProgress } from "@mui/material";
import logo from "../images/logo.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAllCampaigns } from "../solana/requests";
import ItemHead from "../components/ItemHead";
import Item from "../components/Item";
import telegram from "../images/Icon awesome-telegram-plane.png";
import twitter from "../images/Icon awesome-twitter.png";
import github from "../images/github.png";
import shiba from "../images/shiba.png";

const ItemList = ({ list }) => {
  return (
    <>
      <Grid container justifyContent="center">
        <Grid paddingTop={10}>
          <Typography
            variant="h2"
            color="white"
            textAlign="center"
            fontWeight="600"
          >
            The first fully decentralized IDO protocol<br></br> on the Solana
            blockchain
          </Typography>

          <Grid container justifyContent="center">
            <Grid item xs={11.8} pt={10}>
              <LinearProgress color="info" variant="query" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" gap={4}>
        {list.map((item, index) => {
          return (
            <Grid item xs={12} md={3} key={index}>
              <Paper>
                <Box p={2}>
                  <ItemHead item={item} />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <Grid container justifyContent="space-between" spacing={2} pt={10}>
        <Grid item xs={12} pt={10} md={2.5}>
          <Paper elevation={4} style={{ backgroundColor: "#1c243d" }}>
            <Box p={2}>
              <Box>
                <Typography variant="h5" color="white" fontWeight="600">
                  Open for everyone
                </Typography>
              </Box>
              <Box pt={2}>
                <Typography variant="body2" color="white" fontWeight="600">
                  Anyone
                  have the possibility to join us. We do not banned countries or regions
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} pt={10} md={2.5}>
          <Paper elevation={4} style={{ backgroundColor: "#1c243d" }}>
            <Box p={2}>
              <Box>
                <Typography variant="h5" color="white" fontWeight="600">
                  Simple
                </Typography>
              </Box>
              <Box pt={2}>
                <Typography variant="body2" color="white" fontWeight="600">
                  You have the great project? Just create presale campaign and
                  told about it to the community
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} pt={10} md={2.5}>
          <Paper elevation={4} style={{ backgroundColor: "#1c243d" }}>
            <Box p={2}>
              <Box>
                <Typography variant="h5" color="white" fontWeight="600">
                  Low fees
                </Typography>
              </Box>
              <Box pt={2}>
                <Typography variant="body2" color="white" fontWeight="600">
                  The transactions fee for the pool creation will be ~0.0005
                  SOL.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} pt={10} md={2.5}>
          <Paper elevation={4} style={{ backgroundColor: "#1c243d" }}>
            <Box p={2}>
              <Box>
                <Typography variant="h5" color="white" fontWeight="600">
                  The new opportunities
                </Typography>
              </Box>
              <Box pt={2}>
                <Typography variant="body2" color="white" fontWeight="600">
                  Join the project on the presale stage! But don't forget to do
                  research
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
function Index() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getAllCampaigns().then((result) => setList(result));
  }, []);

  return (
    <Box>
      <Box paddingLeft={5} paddingRight={5} paddingTop={4}>
        <Grid container gap={6} justifyContent="space-between">
          <Grid item>
            <Box display="flex" alignItems="center">
              <Box pr={2}>
                <img style={{ height: 70 }} src={logo} alt="inu start logo" />
              </Box>
              <Box>
                <Box>
                  <Typography variant="h4" color="white" fontWeight="700">
                    Inustart
                  </Typography>
                  <Typography variant="subtitle2" color="white" fontSize="14px">
                    The IDO/ICO protocol for Solana. Pre-alpha v1.0
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Actions />
          </Grid>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ItemList list={list} />} />
              <Route path="/:hash" element={<Item list={list} />} />
            </Routes>
          </BrowserRouter>
        </Grid>
      </Box>
      <Box className="footer">
        <Box justifyContent="center" display="grid" pt={'250px'}>
          <div className="contact-us__header">
            Contact Us
          </div>
          <div className='social-icons'>
            <div className="social-icon">
              <a href="https://t.me/shibainusolana">
                <img src={telegram} />
              </a>
            </div>
            <div className="social-icon">
              <a href="https://twitter.com/inu_solana">
                <img src={twitter} />
              </a>
            </div>
            <div className="social-icon">
              <a href="https://github.com/shibainusolana">
                <img src={github} />
              </a>
            </div>

            <div className="social-icon">
              <a href="https://solscan.io/token/2xbWx7eSoxvtKq1fjikPx9kbLi3VX8DkUec7iwj3LEyW">
                <img src={logo} />
              </a>
            </div>
            <div className="social-icon">
              <a href="https://solscan.io/token/5Wgco6reiMwazERpAm3JS1xD7JBHNJJQdNEE9MrUkwtJ">
                <img src={shiba} />
              </a>
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
}

export default Index;
