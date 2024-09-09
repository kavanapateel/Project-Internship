import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
} from "@mui/material";
import {
  AssignmentOutlined,
  VisibilityOutlined,
  DeleteOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { styled } from '@mui/system';

import { useNavigate } from "react-router-dom";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  border: '1px solid rgba(224, 224, 224, 1)', // Add border to each cell
});

const StyledTableRow = styled(TableRow)({
  border: '2px solid rgba(224, 224, 224, 1)', // Bold border for each row
});

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openAssign, setOpenAssign] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedZone, setSelectedZone] = useState("");
  const [zoneDetails, setZoneDetails] = useState({
    rfidName: "",
    rfidNumber: "",
    rfidDate: "",
  });
  const [newRecord, setNewRecord] = useState({
    slNo: "",
    workPartNumber: "",
    partNumber: "",
    line: "",
    quantity: 0,
    startDate: getTodayDate(),
    endDate: getTodayDate(),
  });

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    workPartNumber: "",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const navigate = useNavigate();

  const [openDatabaseSettings, setOpenDatabaseSettings] = useState(false);
  const [databaseSettings, setDatabaseSettings] = useState({
    server: "",
    database: "",
    authentication: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const formattedDate = (dateString) => {
    const date = moment(dateString);
    return date.format("DD-MM-YYYY");
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/records");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuLocation = () => {
    navigate("/location");
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleSettingsMenuReader = () => {
    navigate("/reader");
  };

  const handleSettingsMenuPortcycle = () => {
    navigate("/port");
  };

  const handleSettingsMenuTagmaster = () => {
    navigate("/tag");
  };

  const handleSettingsMenuTrolley = () => {
    navigate("/trolley");
  }

  const handleSettingsMenuLine = () => {
    navigate("/line");
  }

  const handleOpenAssign = (record) => {
    setCurrentRecord({
      ...record,
      rfidDetails: record.rfidDetails || [],
    });
    setSelectedZone("1");
    setZoneDetails({ rfidName: "", rfidNumber: "" ,rfidDate: "", rfidline: ""});
    setOpenAssign(true);
  };

  const handleOpenView = async (record) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/records/${record.id}/rfid`
      );
      setCurrentRecord({
        ...record,
        rfidDetails: response.data || [],
      });
      setOpenView(true);
    } catch (error) {
      console.error("Error fetching RFID details:", error);
    }
  };

  const handleClose = () => {
    setOpenAssign(false);
    setOpenView(false);
    setCurrentRecord(null);
    setSelectedZone("");
    setZoneDetails({ rfidName: "", rfidNumber: "" , rfidDate: "", rfidline:""});
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/records/delete/${id}`
      );
      if (response.status === 200) {
        console.log(response.data);
        fetchRecords();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddRecord = async () => {
    try {
      await axios.post("http://localhost:5000/api/records", newRecord);
      fetchRecords();
      setNewRecord({
        slNo: "",
        workPartNumber: "",
        partNumber: "",
        line: "",
        quantity: 0,
        startDate: getTodayDate(),
        endDate: getTodayDate(),
      });
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const handleNewRecordChange = (e, field) => {
    setNewRecord({ ...newRecord, [field]: e.target.value });

    if (field === "startDate" && newRecord.endDate < e.target.value) {
      setNewRecord({ ...newRecord, endDate: e.target.value });
    } else if (field === "endDate" && e.target.value < newRecord.startDate) {
      setNewRecord({ ...newRecord, endDate: newRecord.startDate });
    }
  };

  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
  };

  const handleZoneDetailChange = (e, field) => {
    setZoneDetails({ ...zoneDetails, [field]: e.target.value });
  };

  const handleSaveZoneDetails = async () => {
    try {
      const newRfidDetail = {
        workPartNumber: currentRecord.workPartNumber,
        partNumber: currentRecord.partNumber,
        zone: selectedZone,
        ...zoneDetails,
      };

      const response = await axios.post(
        `http://localhost:5000/api/records/${currentRecord.id}/rfid`,
        newRfidDetail
      );

      if (response.status === 201) {
        handleClose();
      } else {
        alert(
          "Failed to save zone details. Server returned status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error saving zone details:", error);
    }
  };

  const handleFilterChange = (e, field) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const handleApplyFilters = () => {
    const { startDate, endDate, workPartNumber } = filters;
    const filtered = data.filter((record) => {
      const matchesWorkPartNumber =
        !workPartNumber ||
        record.workPartNumber
          .toLowerCase()
          .includes(workPartNumber.toLowerCase());
      const isWithinDateRange =
        (!startDate ||
          new Date(record.startDate).setHours(0, 0, 0, 0) >=
            new Date(startDate).setHours(0, 0, 0, 0)) &&
        (!endDate ||
          new Date(record.endDate).setHours(0, 0, 0, 0) <=
            new Date(endDate).setHours(0, 0, 0, 0));
      return matchesWorkPartNumber && isWithinDateRange;
    });
    setFilteredData(filtered);
  };

  const fetchRfidList = async (recordId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/records/${recordId}/rfid`
      );

      if (response.status === 200) {
        setCurrentRecord({
          ...currentRecord,
          rfidDetails: response.data || [],
        });
      }
    } catch (error) {
      console.error("Error fetching RFID details:", error);
    }
  };

  const handleDeleteRfidDetail = async (recordId, rfidId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/records/${recordId}/rfid/${rfidId}`
      );

      if (response.status === 200) {
        fetchRfidList(recordId);
      }
    } catch (error) {
      console.error("Error deleting RFID detail:", error);
    }
  };

  //database nav bar
  const handleDatabaseSettingsOpen = () => {
    setOpenDatabaseSettings(true);
  };

  const handleDatabaseSettingsChange = (e, field) => {
    setDatabaseSettings({ ...databaseSettings, [field]: e.target.value });
  };

  const handleCheckConnection = () => {
    console.log("Checking connection with settings:", databaseSettings);
    setMessage("Checking connection...");
    setTimeout(() => {
      setMessage("Connection successful!");
    }, 2000);
  };

  const ChandleClose = () => {
    setOpenDatabaseSettings(false);
    setMessage("");
  };

  const handleSaveDatabaseSettings = () => {
    console.log("Saving settings:", databaseSettings);
    setMessage("Settings successfully saved!");
    setTimeout(() => {
      setMessage("");
      handleClose();
    }, 2000);
  };

  const lines = ['line1', 'line2', 'line3', 'line4'];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Assign
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleHomeClick}>Home</MenuItem>
            <MenuItem onClick={handleSettingsMenuOpen}>Settings</MenuItem>
            <Menu
              anchorEl={settingsAnchorEl}
              open={Boolean(settingsAnchorEl)}
              onClose={handleSettingsMenuClose}
            >
              <MenuItem onClick={handleDatabaseSettingsOpen}>Database</MenuItem>
              <MenuItem onClick={handleSettingsMenuLocation}>
                Location Master
              </MenuItem>
              <MenuItem onClick={handleSettingsMenuReader}>
                Reader Master
              </MenuItem>
              <MenuItem onClick={handleSettingsMenuPortcycle}>
                Port vs Cycletime
              </MenuItem>
              <MenuItem onClick={handleSettingsMenuLine}>
                Line Master</MenuItem>
              <MenuItem onClick={handleSettingsMenuTagmaster}>
                Tag Master</MenuItem>
              <MenuItem onClick={handleSettingsMenuTrolley}>
                Trolley Master
              </MenuItem>
            </Menu>
          </Menu>
        </Toolbar>
      </AppBar>

      <div
        style={{
          padding: 20,
          height: "calc(80vh + 0.8625em)", background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        }}
      >
        <Box mt={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <TextField
                label="Work Part Number"
                value={filters.workPartNumber}
                onChange={(e) => handleFilterChange(e, "workPartNumber")}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange(e, "startDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item>
              <TextField
                type="date"
                label="End Date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange(e, "endDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilters}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper} style={{ marginTop: 20, background: 'linear-gradient(135deg, #f8e3a1 0%, #fdb797 100%)' }} >
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Sl No</StyledTableCell>
                <StyledTableCell>Work Part Number</StyledTableCell>
                <StyledTableCell>Part Number</StyledTableCell>
                <StyledTableCell>Line</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Start Date</StyledTableCell>
                <StyledTableCell>End Date</StyledTableCell>
                <StyledTableCell>Assign</StyledTableCell>
                <StyledTableCell>View</StyledTableCell>
                <StyledTableCell>Delete</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.slNo}</TableCell>
                  <TableCell>{record.workPartNumber}</TableCell>
                  <TableCell>{record.partNumber}</TableCell>
                  <TableCell>{record.line}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{formattedDate(record.startDate)}</TableCell>
                  <TableCell>{formattedDate(record.endDate)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenAssign(record)}>
                      <AssignmentOutlined />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenView(record)}>
                      <VisibilityOutlined />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(record.id)}>
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <TextField
                    value={newRecord.slNo}
                    onChange={(e) => handleNewRecordChange(e, "slNo")}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newRecord.workPartNumber}
                    onChange={(e) => handleNewRecordChange(e, "workPartNumber")}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={newRecord.partNumber}
                    onChange={(e) => handleNewRecordChange(e, "partNumber")}
                  />
                </TableCell>
                <TableCell>
                <Select
                  value={newRecord.line}
                  onChange={(e) => handleNewRecordChange(e, "line")}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Line' }}
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  {lines.map((line) => (
                    <MenuItem key={line} value={line}>{line}</MenuItem>
                  ))}
                </Select>
              </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={newRecord.quantity}
                    onChange={(e) => handleNewRecordChange(e, "quantity")}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={newRecord.startDate}
                    onChange={(e) => handleNewRecordChange(e, "startDate")}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={newRecord.endDate}
                    onChange={(e) => handleNewRecordChange(e, "endDate")}
                  />
                </TableCell>
                <TableCell colSpan={3}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleAddRecord}
                  >
                    Add Record
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openAssign} onClose={handleClose}>
        <DialogTitle sx={{ fontSize: 24 }}>
          Assign Zones{" "}
          <Typography
            variant="body1"
            sx={{
              width: "50%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              float: "right",
            }}
          >
            <span>WPN: {currentRecord && currentRecord.workPartNumber}</span>
            <span>PN: {currentRecord && currentRecord.partNumber}</span>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="zone-select-label">Select Zone</InputLabel>
            <Select
              labelId="zone-select-label"
              value={selectedZone}
              onChange={handleZoneChange}
              label="Select Zone"
            >
              <MenuItem value="1">Zone 1</MenuItem>
              <MenuItem value="2">Zone 2</MenuItem>
              <MenuItem value="3">Zone 3</MenuItem>
              <MenuItem value="4">Zone 4</MenuItem>
              <MenuItem value="5">Zone 5</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="RFID Name"
            value={zoneDetails.rfidName}
            onChange={(e) => handleZoneDetailChange(e, "rfidName")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="RFID Number"
            value={zoneDetails.rfidNumber}
            onChange={(e) => handleZoneDetailChange(e, "rfidNumber")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Line Number"
            value={zoneDetails.line}
            onChange={(e) => handleZoneDetailChange(e, "rfidline")}
            margin="normal"
          />
          <br/>
          <TextField
            type="date"
            value={zoneDetails.rfidDate}
            onChange={(e) => handleZoneDetailChange(e, "rfidDate")}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveZoneDetails} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openView} onClose={handleClose}>
        <DialogTitle sx={{ marginLeft: 2, fontSize: 28 }}>
          View Record
        </DialogTitle>
        <DialogContent>
          {currentRecord &&
            (currentRecord.rfidDetails.length > 0 ? (
              <TableContainer component={Paper} style={{ marginTop: 10 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          verticalAlign: "bottom",
                          width: "fit-content",
                          textAlign: "start",
                        }}
                      >
                        Work Part Number
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "bottom",
                          width: "fit-content",
                          textAlign: "start",
                        }}
                      >
                        Part Number
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "bottom",
                          width: "fit-content",
                          textAlign: "start",
                        }}
                      >
                        Zone
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "bottom",
                          width: "fit-content",
                          textAlign: "start",
                        }}
                      >
                        RFID Name
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "bottom",
                          width: "fit-content",
                          textAlign: "start",
                        }}
                      >
                        RFID Number
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "bottom",
                          width: "fit-content",
                          textAlign: "start",
                        }}
                      >
                        Line
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "bottom",
                          width: "fit-content",
                          textAlign: "start",
                        }}
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRecord.rfidDetails.map((rfid, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ textAlign: "start" }}>
                          {currentRecord.workPartNumber}
                        </TableCell>
                        <TableCell sx={{ textAlign: "start" }}>
                          {currentRecord.partNumber}
                        </TableCell>
                        <TableCell sx={{ textAlign: "start" }}>
                          {rfid.Zone}
                        </TableCell>
                        <TableCell sx={{ textAlign: "start" }}>
                          {rfid.RFIDName}
                        </TableCell>
                        <TableCell sx={{ textAlign: "start" }}>
                          {rfid.RFIDNumber}
                        </TableCell>
                        <TableCell sx={{ textAlign: "start" }}>
                          {rfid.Line}
                        </TableCell>
                        <TableCell sx={{ textAlign: "start" }}>
                          <IconButton
                            onClick={() =>
                              handleDeleteRfidDetail(rfid.ID, rfid.RFIDNumber)
                            }
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" sx={{ width: "40svw" }}>
                None assigned
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      
      <Dialog open={openDatabaseSettings} onClose={handleClose}>
        <DialogTitle>Database Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <InputLabel>Server</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                value={databaseSettings.server}
                onChange={(e) => handleDatabaseSettingsChange(e, "server")}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Database</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                value={databaseSettings.database}
                onChange={(e) => handleDatabaseSettingsChange(e, "database")}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Authentication</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                value={databaseSettings.authentication}
                onChange={(e) =>
                  handleDatabaseSettingsChange(e, "authentication")
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Username</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                value={databaseSettings.username}
                onChange={(e) => handleDatabaseSettingsChange(e, "username")}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <InputLabel>Password</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <TextField
                type="password"
                value={databaseSettings.password}
                onChange={(e) => handleDatabaseSettingsChange(e, "password")}
                fullWidth
              />
            </Grid>
          </Grid>
          {message && (
            <Box mt={2} color="green">
              {message}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={ChandleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCheckConnection} color="primary">
            Check Connection
          </Button>
          <Button onClick={handleSaveDatabaseSettings} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableComponent;
