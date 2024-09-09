import React, { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";

const ReaderList = () => {
  const [readers, setReaders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const response = await fetch('http://localhost:5000/readers');
        const data = await response.json();
        setReaders(data);
      } catch (error) {
        console.error('Error fetching readers:', error);
      }
    };
    fetchReaders();
  }, []);

  const handleBack = () => {
    navigate("/page2");
  };

  return (
    <Box 
      className="reader-list" 
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
        Reader List
      </Typography>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Reader Name</th>
            <th>Reader IP</th>
            <th>Reader Tag</th>
            <th>Terminal Reader</th>
          </tr>
        </thead>
        <tbody>
          {readers.map(reader => (
            <tr key={reader.id}>
              <td>{reader.location}</td>
              <td>{reader.readerName}</td>
              <td>{reader.readerIp}</td>
              <td>{reader.readerTag}</td>
              <td>{reader.terminalReader ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        table {
          width: 70%;
          border-collapse: collapse;
          margin: 20px auto;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #233646;
          color: white;
          text-align: centre;
        }
      `}</style>
    </Box>
  );
};

export default ReaderList;
