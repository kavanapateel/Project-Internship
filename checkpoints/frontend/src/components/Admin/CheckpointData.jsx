import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CheckpointData() {
  const [isLoading, setIsLoading] = useState(false);
  const [checkpoints, setCheckpoints] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [products, setProducts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const handlePageChange = (event, newPage) => {
    setIsLoading(true);
    setCurrentPage(newPage);
    setIsLoading(false);
  };

  const handleRowsPerPageChange = (event) => {
    setIsLoading(true);
    setPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
    setIsLoading(false);
  }; 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [checkpointResponse, productsResponse] = await Promise.all([
          axios.get(
            `http://localhost:5000/products/checkpoints?page=${
              currentPage + 1
            }&perPage=${perPage}`
          ),
          axios.get("http://localhost:5000/register/products"),
        ]);

        setCheckpoints(checkpointResponse.data.products);
        setTotalRecords(checkpointResponse.data.total);
        setProducts(productsResponse.data.products);
      } catch (err) {
        console.error(err);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
      setCurrentTime(new Date());
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentPage, perPage]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) {
      return "WO";
    }
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const formattedDateTime = new Date(dateTimeString).toLocaleString(
      "en-GB",
      options
    );
    return formattedDateTime.replace(",", "");
  };

  const formatDuration = (durationInMilliseconds) => {
    if (isNaN(durationInMilliseconds)) {
      return "WO";
    }

    const seconds = Math.floor((durationInMilliseconds / 1000) % 60);
    const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24);

    let formattedDuration = "";

    if (hours > 0) {
      formattedDuration += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
      formattedDuration += `${minutes}m `;
    }
    if (seconds > 0 || minutes > 0 || hours > 0) {
      formattedDuration += `${seconds}s`;
    }

    return formattedDuration.trim();
  };

  const formatElapsedTime = (startTime) => {
    if (!startTime) {
      return "WO";
    }
    const start = new Date(startTime);
    const now = currentTime;
    const elapsed = now - start;
    return formatDuration(elapsed);
  };

  const calculateEfficiency = (productID, zone, totalTime) => {
    const product = products.find((p) => p.productID === productID);
    if (!product) {
      return "WO";
    }
    const idealTime = product[`zone${zone}_ideal`];
    if (!idealTime || totalTime === 0) {
      return "WO";
    }
    const efficiency = (idealTime * 100) / totalTime;
    return efficiency >= 100 ? "100%" : `${efficiency.toFixed(2)}%`;
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        checkpoints.length > 0 && (
          <>
            <TableContainer sx={{ maxHeight: "75vh" }}>
              <Table stickyHeader aria-label="checkpoints table">
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={2}>Product ID</TableCell>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      Zone 1
                    </TableCell>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      Zone 2
                    </TableCell>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      Zone 3
                    </TableCell>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      Zone 4
                    </TableCell>
                    <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                      Zone 5
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    {[...Array(5)].map((_, index) => (
                      <React.Fragment key={index}>
                        <TableCell sx={{ top: 56.9 }}>Entry Time</TableCell>
                        <TableCell sx={{ top: 56.9 }}>Exit Time</TableCell>
                        <TableCell sx={{ top: 56.9 }}>Total Time</TableCell>
                        <TableCell sx={{ top: 56.9 }}>Efficiency</TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {checkpoints.map((checkpoint) => (
                    <TableRow hover key={checkpoint.id}>
                      <TableCell>{checkpoint.productID}</TableCell>
                      {[1, 2, 3, 4, 5].map((zone) => {
                        const entryTime = checkpoint[`zone${zone}_ET`];
                        const exitTime =
                          checkpoint[`zone${zone + 1}_ET`] ||
                          checkpoint[`zone${zone}_QT`];
                        const totalTime =
                          entryTime && exitTime
                            ? new Date(exitTime) - new Date(entryTime)
                            : null;

                        return (
                          <React.Fragment key={zone}>
                            <TableCell
                              style={
                                formatDateTime(entryTime) === "WO"
                                  ? {
                                      backgroundColor: "#111",
                                      color: "#fa0000",
                                      fontWeight: 700,
                                      textAlign: "center",
                                    }
                                  : null
                              }
                            >
                              {formatDateTime(entryTime)}
                            </TableCell>
                            <TableCell
                              style={
                                formatDateTime(exitTime) === "WO"
                                  ? {
                                      backgroundColor: "#111",
                                      color: "#fa0000",
                                      fontWeight: 700,
                                      textAlign: "center",
                                    }
                                  : null
                              }
                            >
                              {formatDateTime(exitTime)}
                            </TableCell>
                            <TableCell align="right">
                              {totalTime !== null
                                ? formatDuration(totalTime)
                                : entryTime
                                ? formatElapsedTime(entryTime)
                                : "WO"}
                            </TableCell>
                            <TableCell align="right">
                              {totalTime !== null
                                ? calculateEfficiency(
                                    checkpoint.productID,
                                    zone,
                                    totalTime
                                  )
                                : "WO"}
                            </TableCell>
                          </React.Fragment>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              variant="footer"
              component="div"
              count={totalRecords}
              page={currentPage}
              onPageChange={handlePageChange}
              rowsPerPage={perPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 25]}
              labelRowsPerPage="Rows per page"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
              }
              sx={{
                right: 0,
                background: "#121212",
                // borderRadius: "0 0 1rem 1rem",
                color: "#F1F1F1",
                "& .MuiTablePagination-actions": {
                  color: "#F1F1F1",
                  cursor: "pointer",
                  "*": { color: "#F1F1F1" },
                },
                "& .MuiTablePagination-selectLabel": { color: "#F1F1F1" },
                "& .MuiTablePagination-displayedRows": { color: "#F1F1F1" },
                "& .MuiInputBase-root": { color: "#F1F1F1" },
                "& .MuiSelect-icon": { color: "#F1F1F1" },
              }}
            />
          </>
        )
      )}
    </>
  );
}
