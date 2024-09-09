import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  const [readers, setReaders] = useState([]);
  const [form, setForm] = useState({
    location: '',
    readerName: '',
    readerIp: '',
    readerTag: '',
    terminalReader: false,
  });
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    const response = await axios.get('http://localhost:5000/readers');
    setReaders(response.data);
  };

  const handleBack = () => {
    navigate('/page1');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAdd = async () => {
    if (editIndex !== null) {
      const id = readers[editIndex].id;
      await axios.put(`http://localhost:5000/readers/${id}`, form);
    } else {
      await axios.post('http://localhost:5000/readers', form);
    }
    fetchReaders();
    setForm({
      location: '',
      readerName: '',
      readerIp: '',
      readerTag: '',
      terminalReader: false,
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setForm(readers[index]);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const id = readers[index].id;
    await axios.delete(`http://localhost:5000/readers/${id}`);
    fetchReaders();
  };

  return (
    <div style={styles.container}>
      <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'center',textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }} gutterBottom>
        Reader Master
      </Typography>
      <Box component="form" sx={{ maxWidth: '600px', marginBottom: '20px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <InputLabel id="location-label">Location :</InputLabel>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth size="small">
              <Select
                labelId="location-label"
                name="location"
                value={form.location}
                onChange={handleChange}
                label="Location"
              >
                <MenuItem value="warehouse">Warehouse</MenuItem>
                <MenuItem value="assembly">Assembly</MenuItem>
                <MenuItem value="testing">Testing</MenuItem>
                <MenuItem value="painting">Painting</MenuItem>
                <MenuItem value="packing">Packing</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <InputLabel htmlFor="readerName">Reader Name :</InputLabel>
          </Grid>
          <Grid item xs={8}>
            <TextField
              id="readerName"
              name="readerName"
              value={form.readerName}
              onChange={handleChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel htmlFor="readerIp">Reader IP Address :</InputLabel>
          </Grid>
          <Grid item xs={8}>
            <TextField
              id="readerIp"
              name="readerIp"
              value={form.readerIp}
              onChange={handleChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <InputLabel htmlFor="readerTag">Reader Tag Number :</InputLabel>
          </Grid>
          <Grid item xs={8}>
            <TextField
              id="readerTag"
              name="readerTag"
              value={form.readerTag}
              onChange={handleChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  name="terminalReader"
                  checked={form.terminalReader}
                  onChange={handleChange}
                />
              }
              label="Terminal Reader"
            />
          </Grid>
          <Grid item xs={8}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              {editIndex !== null ? 'Update' : 'Add'}
            </Button>
            <Button onClick={handleBack} style={{ marginTop: '0' }}>
              Back
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ overflowX: 'auto', backgroundColor: 'white' }}>
        <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Reader Name</TableCell>
              <TableCell>Reader IP Address</TableCell>
              <TableCell>Reader Tag Number</TableCell>
              <TableCell>Terminal Reader</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {readers.map((reader, index) => (
              <TableRow key={index}>
                <TableCell>{reader.location}</TableCell>
                <TableCell>{reader.readerName}</TableCell>
                <TableCell>{reader.readerIp}</TableCell>
                <TableCell>{reader.readerTag}</TableCell>
                <TableCell>{reader.terminalReader ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
  },
};

export default App;
