import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TableContainer,
  Box,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Report() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/products");
        setReportData(response.data.data);
      } catch (err) {
        console.error("Error fetching report data:", err.response ? err.response.data : err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchReportData();
  }, []);
  
  const calculateTotalTime = (entryTime, exitTime) => {
    if (!entryTime || !exitTime) return 0;
    return (new Date(exitTime) - new Date(entryTime)) / 1000; // Return in seconds
  };

  const formatDuration = (durationInSeconds) => {
    return `${durationInSeconds} seconds`;
  };

  const handleBack = () => {
    navigate("/page2");
  };


  return (
    <Box 
    className="report-page" 
    sx={{ 
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', 
      height: "100vh", 
      width: "100vw", 
      padding: "20px", 
      boxSizing: "border-box"
    }}
  >
    <Button onClick={handleBack} sx={{ marginTop: "0" }}>
        Back
      </Button>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ marginTop: "10px", textAlign: "center", fontWeight: "bold", textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
      >
        Report Page
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer
        sx={{
          width: '80%',
          margin: '20px auto',
          borderCollapse: 'collapse',
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
          },
          '& th, & td': {
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'center',
          },
          '& th': {
            backgroundColor: '#233646',
            color: 'white',
            textAlign: 'center',
          },
        }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Zone 1 Total Time</TableCell>
                <TableCell>Zone 2 Total Time</TableCell>
                <TableCell>Zone 3 Total Time</TableCell>
                <TableCell>Zone 4 Total Time</TableCell>
                <TableCell>Zone 5 Total Time</TableCell>
                <TableCell>Overall Total Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((product) => {
                const zone1Total = calculateTotalTime(product.zone1_ET, product.zone2_ET);
                const zone2Total = calculateTotalTime(product.zone2_ET, product.zone3_ET);
                const zone3Total = calculateTotalTime(product.zone3_ET, product.zone4_ET);
                const zone4Total = calculateTotalTime(product.zone4_ET, product.zone5_ET);
                const zone5Total = calculateTotalTime(product.zone5_ET, product.zone5_QT);
                const overallTotal = zone1Total + zone2Total + zone3Total + zone4Total + zone5Total;

                return (
                  <TableRow key={product.productID}>
                    <TableCell>{product.productID}</TableCell>
                    <TableCell>{formatDuration(zone1Total)}</TableCell>
                    <TableCell>{formatDuration(zone2Total)}</TableCell>
                    <TableCell>{formatDuration(zone3Total)}</TableCell>
                    <TableCell>{formatDuration(zone4Total)}</TableCell>
                    <TableCell>{formatDuration(zone5Total)}</TableCell>
                    <TableCell>{formatDuration(overallTotal)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
