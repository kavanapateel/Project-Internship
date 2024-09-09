import React, { useState, useEffect } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const [trolleys, setTrolleys] = useState([]);
  const [trolleyNumber, setTrolleyNumber] = useState('');
  const [trolleyName, setTrolleyName] = useState('');
  const [trolleyDescription, setTrolleyDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/trolleys')
      .then(response => {
        setTrolleys(response.data);
      })
      .catch(error => {
        console.error('Error fetching trolleys: ', error);
      });
  }, []);

  const handleBack = () => {
    navigate("/page1");
  };

  const handleAddTrolley = () => {
    const newTrolley = { trolleyNumber, trolleyName, trolleyDescription };
    if (editId) {
      axios.put(`http://localhost:5000/trolleys/${editId}`, newTrolley)
        .then(response => {
          const updatedTrolleys = trolleys.map(trolley => {
            if (trolley.id === editId) {
              return { ...trolley, ...newTrolley };
            }
            return trolley;
          });
          setTrolleys(updatedTrolleys);
          setEditId(null);
        })
        .catch(error => {
          console.error('Error editing trolley: ', error);
        });
    } else {
      axios.post('http://localhost:5000/trolleys', newTrolley)
        .then(response => {
          setTrolleys([...trolleys, { ...newTrolley, id: response.data.id }]);
        })
        .catch(error => {
          console.error('Error adding trolley: ', error);
        });
    }
    setTrolleyNumber('');
    setTrolleyName('');
    setTrolleyDescription('');
  };

  const handleEditTrolley = (trolley) => {
    setTrolleyNumber(trolley.trolleyNumber);
    setTrolleyName(trolley.trolleyName);
    setTrolleyDescription(trolley.trolleyDescription);
    setEditId(trolley.id);
  };

  const handleDeleteTrolley = (id) => {
    axios.delete(`http://localhost:5000/trolleys/${id}`)
      .then(response => {
        const updatedTrolleys = trolleys.filter(trolley => trolley.id !== id);
        setTrolleys(updatedTrolleys);
      })
      .catch(error => {
        console.error('Error deleting trolley: ', error);
      });
  };

  return (
    <div style={{
      height: "90vh",
      width: "95vw",
      margin: "0 auto",
      padding: "20px",
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    }}>
      <Button onClick={handleBack} style={{ marginTop: "0" }}>
        Back
      </Button>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ fontWeight: 'bold', textAlign: 'center', textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
      >
        Trolley Master
      </Typography>
      <div style={{ marginBottom: '20px', display: 'flex' }}>
        <Typography style={{ marginRight: '14px' }}>Trolley Number:</Typography>
        <TextField
          value={trolleyNumber}
          onChange={(e) => setTrolleyNumber(e.target.value)}
          variant="outlined"
          sx={{ '& .MuiInputBase-input': { height: '10px', padding: '10px 14px' } }}
          size="small"
        />
      </div>
      <div style={{ marginBottom: '20px', display: 'flex' }}>
        <Typography style={{ marginRight: '28px' }}>Trolley Name:</Typography>
        <TextField
          value={trolleyName}
          onChange={(e) => setTrolleyName(e.target.value)}
          variant="outlined"
          sx={{ '& .MuiInputBase-input': { height: '10px', padding: '10px 14px' } }}
          size="small"
        />
      </div>
      <div style={{ marginBottom: '20px', display: 'flex' }}>
        <Typography style={{ marginRight: '38px' }}> Description:</Typography>
        <TextField
          value={trolleyDescription}
          onChange={(e) => setTrolleyDescription(e.target.value)}
          variant="outlined"
          sx={{ '& .MuiInputBase-input': { height: '10px', padding: '10px 14px' } }}
          size="small"
        />
      </div>
      <Button variant="contained" color="primary" onClick={handleAddTrolley}>
        {editId ? 'Update' : 'Add'}
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '10px', maxWidth: '60%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No</TableCell>
              <TableCell>Trolley Number</TableCell>
              <TableCell>Trolley Name</TableCell>
              <TableCell>Trolley Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trolleys.map((trolley, index) => (
              <TableRow key={trolley.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{trolley.trolleyNumber}</TableCell>
                <TableCell>{trolley.trolleyName}</TableCell>
                <TableCell>{trolley.trolleyDescription}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditTrolley(trolley)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteTrolley(trolley.id)}>
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
}

export default App;
