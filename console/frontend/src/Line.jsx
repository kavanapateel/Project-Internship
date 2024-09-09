import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const [line, setLine] = useState("");
  const [lineDescription, setLineDescription] = useState("");
  const [lines, setLines] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/linesm");
      setLines(response.data.rows);
    } catch (error) {
      console.error("Error fetching lines: ", error);
      setLines([]);
    }
  };

  const handleAddOrUpdate = async () => {
    const id = lines[editIndex]?.id || null;  

    if (!line || !lineDescription) {
      alert("Line and Line Description are required");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/linesm`, {
        id,
        line,
        lineDescription,
      });
      console.log(response.data?.message);
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setLine("");
      setLineDescription("");
      setLines();
      fetchLines();
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setLine(lines[index].line);
    setLineDescription(lines[index].line_description);
  };

  const handleDelete = async (index) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/linesm/delete/${lines[index].id}`
      );
      console.log(response.data?.message);
      fetchLines();
    } catch (error) {
      console.error("Error deleting line: ", error);
    }
  };

  const handleBack = () => {
    navigate("/page1");
  };

  return (
    <Container style={{background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',}} sx={{ height: "100vh", width: "100vw" }} >
      <Button onClick={handleBack} style={{ marginTop: "0" }}>
        Back
      </Button>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ fontWeight: 'bold', textAlign: 'center', textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}
      >
        Line Master
      </Typography>
      <Box
        component="form"
        sx={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          gap: 2,
          alignItems: "center",
          mb: 4,
        }}
        noValidate
        autoComplete="off"
      >
        <label htmlFor="line" style={{ fontWeight: "normal" }}>
          Line:
        </label>
        <TextField
          id="line"
          label=""
          value={line}
          onChange={(e) => setLine(e.target.value)}
          sx={{ maxWidth: "300px" }}
        />
        <label htmlFor="lineDescription" style={{ fontWeight: "normal" }}>
          Line Description:
        </label>
        <TextField
          id="lineDescription"
          label=""
          value={lineDescription}
          onChange={(e) => setLineDescription(e.target.value)}
          sx={{ maxWidth: "300px" }}
        />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOrUpdate}
            style={{ marginTop: "20px" }}
          >
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} style={{ marginTop: '10px', maxWidth: '60%', overflowX: 'auto' }} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No</TableCell>
              <TableCell>Line</TableCell>
              <TableCell>Line Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lines && lines.length > 0 ? (
              lines.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.line}</TableCell>
                  <TableCell>{item.line_description}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No lines available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
