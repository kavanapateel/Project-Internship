import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const operations = ["Warehouse", "Assembly", "Testing", "Painting", "Packing"];

const App = () => {
  const [partNumber, setPartNumber] = useState("");
  const [operation, setOperation] = useState("");
  const [cycleTime, setCycleTime] = useState("");
  const [entries, setEntries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/parts");
      setEntries(response.data.results);
      console.log(response.data.results);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  const handleBack = () => {
    navigate("/page1");
  };

  const handleAdd = async () => {
    const newEntry = {
      part_number: partNumber,
      operation,
      cycle_time: cycleTime,
    };
    try {
      if (editIndex !== null) {
        await axios.put(
          `http://localhost:5000/api/parts/${entries[editIndex].id}`,
          newEntry
        );
        setEditIndex(null);
      } else {
        await axios.post("http://localhost:5000/api/parts", newEntry);
      }
      fetchParts();
      setPartNumber("");
      setOperation("");
      setCycleTime("");
    } catch (error) {
      console.error("Error adding/updating part:", error);
    }
  };

  const handleEdit = (index) => {
    const entry = entries[index];
    setPartNumber(entry.part_number);
    setOperation(entry.operation);
    setCycleTime(entry.cycle_time);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/parts/${entries[index].id}`
      );
      fetchParts();
    } catch (error) {
      console.error("Error deleting part:", error);
    }
  };

  return (
    <div
      style={{
        height: "90vh",
        width: "95vw",
        margin: "0 auto",
        padding: "20px",
        background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      }}
    >
      <Button onClick={handleBack} style={{ marginTop: "0" }}>
        Back
      </Button>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ fontWeight: 'bold', textAlign: 'center',textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}
      >
        Port vs CycleTime
      </Typography>
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <label
            style={{
              marginRight: "40px",
              minWidth: "100px",
              fontWeight: "normal",
            }}
          >
            Part Number :
          </label>
          <TextField
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            sx={{
              "& .MuiInputBase-input": { height: "10px", padding: "10px 14px" },
            }}
            size="small"
          />
        </div>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <label
            style={{
              marginRight: "40px",
              minWidth: "100px",
              fontWeight: "normal",
            }}
          >
            Operation :
          </label>
          <TextField
            select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            style={{ minWidth: "150px" }}
            sx={{
              "& .MuiInputBase-root": { height: "30px", padding: "0 14px" },
              "& .MuiInputLabel-root": { lineHeight: "1.5em" },
            }}
            size="small"
          >
            {operations.map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <label
            style={{
              marginRight: "10px",
              minWidth: "100px",
              fontWeight: "normal",
            }}
          >
            Cycle Time (sec) :
          </label>
          <TextField
            value={cycleTime}
            onChange={(e) => setCycleTime(e.target.value)}
            sx={{
              "& .MuiInputBase-input": { height: "10px", padding: "10px 14px" },
            }}
            size="small"
          />
        </div>
        <Button variant="contained" onClick={handleAdd}>
          {editIndex !== null ? "Update" : "Add"}
        </Button>
      </div>

      <TableContainer component={Paper} style={{ marginTop: '10px', maxWidth: '60%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl No</TableCell>
              <TableCell>Part Number</TableCell>
              <TableCell>Operation</TableCell>
              <TableCell>Cycle Time (sec)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.part_number}</TableCell>
                <TableCell>{entry.operation}</TableCell>
                <TableCell>{entry.cycle_time}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;
