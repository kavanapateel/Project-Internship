import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { Height } from "@mui/icons-material";

function App() {
  const [locations, setLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [editId, setEditId] = useState(null); // State to hold ID of location being edited
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleBack = () => {
    navigate("/page1");
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/locations");
      if (response.status === 200 && response.data.message) {
        console.log(response.data.message);
      } else if (response.status === 201 && response.data.result) {
        setLocations(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/locations/${null}`,
        {
          name: locationName,
          description: locationDescription,
        }
      );
      if (response.status === 200 && response.data.results) {
        console.log("New Location set: ", response.data.results);
        fetchLocations();
      }
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/locations/${id}`,
        {
          name: locationName,
          description: locationDescription,
        }
      );
      if (response.status === 200) {
        setLocations(
          locations.map((loc) =>
            loc.id === id
              ? { ...loc, name: locationName, description: locationDescription }
              : loc
          )
        );
      }
      console.log("Location updated:", response.data.message);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const handleEdit = (id) => {
    const locationToEdit = locations.find((location) => location.id === id);
    setLocationName(locationToEdit.name);
    setLocationDescription(locationToEdit.description);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/delete/locations/${id}`
      );
      if (response.status === 204) {
        setLocations(locations.filter((location) => location.id !== id));
        console.log("Location deleted:", id);
      } else {
        alert("Deletion failed. ");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleSave = () => {
    if (editId) {
      handleUpdate(editId);
    } else {
      handleAdd();
    }
    setEditId(null);
    setLocationName("");
    setLocationDescription("");
  };

  return (
    <Container style={{background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',}} sx={{ height: "100vh", width: "100vw" }}>
      <Button onClick={handleBack} style={{ marginTop: "0" }}>
        Back
      </Button>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        style={{ marginTop: "10px", textAlign:"center",fontWeight:"bold" ,textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}
      >
        Location Master
      </Typography>
      <div>
        <Box mt={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="body1" style={{ marginRight: '38px' }}>Location Name:</Typography>
            </Grid>
            <Grid item>
              <TextField
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                sx={{ '& .MuiInputBase-input': { height: '10px', padding: '10px 14px' } }}
                size="small"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" mt={2}>
            <Grid item>
              <Typography variant="body1">Location Description:</Typography>
            </Grid>
            <Grid item>
              <TextField
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                sx={{ '& .MuiInputBase-input': { height: '10px', padding: '10px 14px' } }}
                size="small"
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginTop: "1rem" }}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </Box>
        <Box mt={4}>
          <TableContainer component={Paper} style={{ marginTop: '10px', maxWidth: '50%', overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locations.map((location, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>{location.description}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(location.id)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(location.id)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </Container>
  );
}

export default App;
