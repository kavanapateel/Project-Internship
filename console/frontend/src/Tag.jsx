import React, { useState,useEffect } from 'react';
import { Container,Typography, TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Grid } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const App = () => {
  const [tagType, setTagType] = useState('');
  const [tagDescription, setTagDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []); 

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags: ', error);
    }
  };

  const handleBack = () => {
    navigate("/page1");
  };

  const handleAddOrUpdateTag = async () => {
    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:5000/tags/edit/${tags[editIndex].id}`, { tagType, tagDescription });
      } else {
        await axios.post('http://localhost:5000/tags/add', { tagType, tagDescription });
      }
      fetchTags();
      setTagType('');
      setTagDescription('');
      setEditIndex(null);
    } catch (error) {
      console.error('Error adding/updating tag: ', error);
    }
  };

  const handleEditTag = (index) => {
    setEditIndex(index);
    setTagType(tags[index].tagType);
    setTagDescription(tags[index].tagDescription);
  };

  const handleDeleteTag = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tags/delete/${id}`);
      fetchTags(); 
    } catch (error) {
      console.error('Error deleting tag: ', error);
    }
  };
  

  return (
    <Container style={{background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',}} sx={{ height: "100vh", width: "100vw" }}>
      <Button onClick={handleBack} style={{ marginTop: "0" }}>
        Back
      </Button>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ fontWeight: 'bold', textAlign: 'center', textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
      >
        Tag Master
      </Typography>
      <Grid container spacing={2} direction="column">
        <Grid item container spacing={2} alignItems="center">
          <Grid item>
            <label style={{
              marginRight: "55px",
              minWidth: "100px",
              fontWeight: "normal",
            }}
            > Tag Type: </label>
          </Grid>
          <Grid item>
            <TextField
              select
              value={tagType}
              onChange={(e) => setTagType(e.target.value)}
              margin="normal"
              size="small"
              style={{ minWidth: 150 }}
            >
              <MenuItem value="" disabled>
                Select Tag Type
              </MenuItem>
              <MenuItem value="Product Tag">Product Tag</MenuItem>
              <MenuItem value="Reader Tag">Reader Tag</MenuItem>
              <MenuItem value="Trolley Tag">Trolley Tag</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid item container spacing={2} alignItems="center">
          <Grid item>
            <label style={{
              marginRight: "10px",
              minWidth: "100px",
              fontWeight: "normal",
            }}
            > Tag Description: </label>
          </Grid>
          <Grid item>
            <TextField
              value={tagDescription}
              onChange={(e) => setTagDescription(e.target.value)}
              margin="normal"
              size="small"
              placeholder="Enter Tag Description"
              style={{ minWidth: 300 }}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleAddOrUpdateTag}>
            {editIndex !== null ? 'Update' : 'Add '}
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{ marginTop: '10px', maxWidth: '60%', overflowX: 'auto' }} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No</TableCell>
              <TableCell>Tag Type</TableCell>
              <TableCell>Tag Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{tag.tagType}</TableCell>
                <TableCell>{tag.tagDescription}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditTag(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteTag(tag.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default App;
