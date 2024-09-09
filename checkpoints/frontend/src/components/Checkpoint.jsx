/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import styled from '@emotion/styled';

const Body = styled.div`
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
`;

const Root = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
`;

const ContainerStyled = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding-top: 30px;
`;

const CardStyled = styled(Card)`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
`;

const CardContentStyled = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonStyled = styled(Button)`
  background-color: #fda085;
  color: #fff;
  &:hover {
    background-color: #f6d365;
  }
`;

const TypographyStyled = styled(Typography)`
  color: #333;
`;

const Checkpoint = () => {
  const [productID, setProductID] = useState(""); // Removed default value
  const [checkpoint, setCheckpoint] = useState(1);
  const [zone, setZone] = useState("");
  const [rfid, setRfid] = useState("");
  const [line, setLine] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const token = "your_auth_token_here"; 

  useEffect(() => {
    if (rfid) {
      // Simulate fetching productID based on RFID
      // You should replace this with an actual API call or logic to get productID based on RFID
      const rfidToProductID = {
        "8906": "8906",
        "9803": "9803",
        "6210": "6210",
        "4093": "4093",
      };
      setProductID(rfidToProductID[rfid] || "");
    }
  }, [rfid]);

  const handleCheckpoint = async () => {
    try {
      console.log("Sending data to server:", { productID, checkpoint, zone, rfid, line });
      const response = await axios.post("http://localhost:5000/checkpoint", {
        productID,
        checkpoint,
        zone,
        rfid,
        line
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setCheckpoint(checkpoint + 1);
        setSnackbarMessage("Checkpoint recorded successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error recording checkpoint:", error);
      setSnackbarMessage("Error recording checkpoint");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Sending logout data to server:", { productID, checkpoint });
      const response = await axios.post("http://localhost:5000/logout", {
        productID,
        checkpoint,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        window.location.href = "/";
      } else {
        setSnackbarMessage("Error checking out");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error checking out:", error);
      setSnackbarMessage("Error checking out");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Body>
      <Root>
        <ContainerStyled maxWidth="xs">
          <CardStyled>
            <CardContentStyled>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TypographyStyled variant="h4" fontWeight={700} align="center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                    Zone Selection
                  </TypographyStyled>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Zone</InputLabel>
                    <Select
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                    >
                      <MenuItem value="Zone 1">Zone 1</MenuItem>
                      <MenuItem value="Zone 2">Zone 2</MenuItem>
                      <MenuItem value="Zone 3">Zone 3</MenuItem>
                      <MenuItem value="Zone 4">Zone 4</MenuItem>
                      <MenuItem value="Zone 5">Zone 5</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>RFID</InputLabel>
                    <Select
                      value={rfid}
                      onChange={(e) => setRfid(e.target.value)}
                    >
                      <MenuItem value="8906">8906</MenuItem>
                      <MenuItem value="9803">9803</MenuItem>
                      <MenuItem value="6210">6210</MenuItem>
                      <MenuItem value="4093">4093</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Line</InputLabel>
                    <Select
                      value={line}
                      onChange={(e) => setLine(e.target.value)}
                    >
                      <MenuItem value="line1">line1</MenuItem>
                      <MenuItem value="line2">line2</MenuItem>
                      <MenuItem value="line3">line3</MenuItem>
                      <MenuItem value="line4">line4</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <ButtonStyled
                    variant="contained"
                    onClick={handleCheckpoint}
                    fullWidth
                    disabled={!productID} // Disable button if productID is not set
                  >
                    Save Zone {checkpoint}
                  </ButtonStyled>
                </Grid>
                {checkpoint === 6 && (
                  <Grid item xs={12}>
                    <ButtonStyled
                      variant="contained"
                      onClick={handleLogout}
                      fullWidth
                    >
                      Logout
                    </ButtonStyled>
                  </Grid>
                )}
              </Grid>
            </CardContentStyled>
          </CardStyled>
        </ContainerStyled>
      </Root>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Body>
  );
};

export default Checkpoint;
