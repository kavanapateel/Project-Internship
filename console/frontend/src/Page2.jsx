import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, InputLabel, TextField, Button, Box } from "@mui/material";
import axios from 'axios';


const Dashboard = () => {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDatabaseSettings, setOpenDatabaseSettings] = useState(false);
  const [databaseSettings, setDatabaseSettings] = useState({
    server: '',
    database: '',
    authentication: '',
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [lineTotals, setLineTotals] = useState({});
  const [selectedLine, setSelectedLine] = useState("line1"); // Default to Line 1
  const [currentTotal, setCurrentTotal] = useState(0);
  const [lineQuantities, setLineQuantities] = useState({});
  const [currentActual, setCurrentActual] = useState(0);
  const [pending, setPending] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [actualCount, setActualCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualCountForZone2, setActualCountForZone2] = useState(null);
  const [actualCountForZone3, setActualCountForZone3] = useState(null);
  const [actualCountForZone4, setActualCountForZone4] = useState(null);
  const [actualCountForZone5_ET, setActualCountForZone5_ET] = useState(null);
  const [actualCountForZone5_QT, setActualCountForZone5_QT] = useState(null);
  const [efficiencyZone1, setEfficiencyZone1] = useState(0);
  const [efficiencyZone2, setEfficiencyZone2] = useState(0);
  const [efficiencyZone3, setEfficiencyZone3] = useState(0);
  const [efficiencyZone4, setEfficiencyZone4] = useState(0);
  const [efficiencyZone5ET, setEfficiencyZone5ET] = useState(0);
  const [efficiencyZone5QT, setEfficiencyZone5QT] = useState(0);
  const [totalWork, setTotalWork] = useState(0);
  const [productData, setProductData] = useState([]);



  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

 

  //Planned
  useEffect(() => {
    const fetchLineTotals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quantity/line");
        // console.log('Fetched line totals:', response.data); // Log to see the structure
        setLineTotals(response.data);

        // Set the initial total for the default selected line
        setCurrentTotal(response.data[selectedLine] || 0); // Default to Line 1
      } catch (error) {
        console.error('Error fetching total quantities per line:', error);
      }
    };
    fetchLineTotals();
  }, [selectedLine]);

  const handleLineChange = (e) => {
    const lineNumber = e.target.value;
    const selectedLineKey = `line${lineNumber}`;
    setSelectedLine(selectedLineKey);

    // Update the total quantity for the selected line
    setCurrentTotal(lineTotals[selectedLineKey] || 0);

    // Update the actual quantity for the selected line
  setCurrentActual(lineQuantities[selectedLineKey] || 0);
  };

  //Actual
  useEffect(() => {
    const fetchLineQuantities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/actual/line");
  
        // Convert array to object for easier access
        const lineQuantitiesObject = response.data.lines.reduce((acc, line) => {
          // Remove the "Line " prefix and add the "line" prefix
          const lineKey = `line${line.line.replace('line', '')}`;
          acc[lineKey] = line.totalCount;
          return acc;
        }, {});
        // console.log(lineQuantitiesObject);
  
        setLineQuantities(lineQuantitiesObject);
  
        // Set the initial actual count for the default selected line
        setCurrentActual(lineQuantitiesObject[selectedLine] || 0);
  
      } catch (error) {
        console.error('Error fetching line quantities:', error);
      }
    };
    fetchLineQuantities();
  }, [selectedLine]);
  

  // Calculate Pending
  useEffect(() => {
    setPending(currentTotal - currentActual);
  }, [currentTotal, currentActual]);

  //efficiency
  useEffect(() => {
    setPending(currentTotal - currentActual); 
    if (currentTotal > 0) {
      setEfficiency(((currentActual / currentTotal) * 100).toFixed(2)); // Calculate efficiency
    } else {
      setEfficiency(0);
    }
  }, [currentTotal, currentActual]);

  
// Automatically change lines every 1 minute
useEffect(() => {
  const lines = ['line1', 'line2', 'line3', 'line4'];
  let currentIndex = 0;

  const intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % lines.length;
    setSelectedLine(lines[currentIndex]);
  }, 30000); // 30000ms = 30 seconds

  return () => clearInterval(intervalId); // Cleanup on component unmount
}, []);


   // Fetch the count whenever the selected line changes
   useEffect(() => {
    if (selectedLine) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/product_checkpoints/?line=${selectedLine}`)
        .then(response => {
          console.log("API Response:", response.data); // Log the API response
          setActualCount(response.data.actualCount); // Ensure this matches the API response
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          setActualCount(null); // Handle fetch errors
        })
        .finally(() => {
          setLoading(false); // End loading state
        });
    }
  }, [selectedLine]);

//efficiency zone 1
useEffect(() => {
  if (currentTotal > 0) {
    setEfficiencyZone1(((actualCount / currentTotal) * 100).toFixed(2)); // Calculate efficiency
  } else {
    setEfficiencyZone1(0);
  }
}, [currentTotal, actualCount]);

//efficiency zone 2
useEffect(() => {
  if (currentTotal > 0) {
    setEfficiencyZone2(((actualCountForZone2 / currentTotal) * 100).toFixed(2)); // Calculate efficiency
  } else {
    setEfficiencyZone2(0);
  }
}, [currentTotal, actualCountForZone2]);

//efficiency zone 3
useEffect(() => {
  if (currentTotal > 0) {
    setEfficiencyZone3(((actualCountForZone3 / currentTotal) * 100).toFixed(2)); // Calculate efficiency
  } else {
    setEfficiencyZone2(0);
  }
}, [currentTotal, actualCountForZone3]);

//efficiency zone 4
useEffect(() => {
  if (currentTotal > 0) {
    setEfficiencyZone4(((actualCountForZone4 / currentTotal) * 100).toFixed(2)); // Calculate efficiency
  } else {
    setEfficiencyZone2(0);
  }
}, [currentTotal, actualCountForZone4]);

//efficiency zone 5ET
useEffect(() => {
  if (currentTotal > 0) {
    setEfficiencyZone5ET(((actualCountForZone5_ET / currentTotal) * 100).toFixed(2)); // Calculate efficiency
  } else {
    setEfficiencyZone2(0);
  }
}, [currentTotal, actualCountForZone5_ET]);

//efficiency zone 5QT
useEffect(() => {
  if (currentTotal > 0) {
    setEfficiencyZone5QT(((actualCountForZone5_QT / currentTotal) * 100).toFixed(2)); // Calculate efficiency
  } else {
    setEfficiencyZone2(0);
  }
}, [currentTotal, actualCountForZone5_QT]);


  // Fetch the count for zone 2 whenever the selected line changes
useEffect(() => {
  if (selectedLine) {
    setLoading(true);
    axios.get(`http://localhost:5000/api/product_checkpoints/zone2?line=${selectedLine}`)
      .then(response => {
        console.log("API Response for Zone 2:", response.data); // Log the API response
        setActualCountForZone2(response.data.actualCount); // Ensure this matches the API response
      })
      .catch(error => {
        console.error("Error fetching data for Zone 2:", error);
        setActualCountForZone2(null); // Handle fetch errors
      })
      .finally(() => {
        setLoading(false); // End loading state
      });
  }
}, [selectedLine]);


// Fetch the count for zone 3 whenever the selected line changes
useEffect(() => {
  if (selectedLine) {
    setLoading(true);
    axios.get(`http://localhost:5000/api/product_checkpoints/zone3?line=${selectedLine}`)
      .then(response => {
        console.log("API Response for Zone 3:", response.data); // Log the API response
        setActualCountForZone3(response.data.actualCount); // Ensure this matches the API response
      })
      .catch(error => {
        console.error("Error fetching data for Zone 3:", error);
        setActualCountForZone3(null); // Handle fetch errors
      })
      .finally(() => {
        setLoading(false); // End loading state
      });
  }
}, [selectedLine]);



// Fetch the count for zone 4 whenever the selected line changes
useEffect(() => {
  if (selectedLine) {
    setLoading(true);
    axios.get(`http://localhost:5000/api/product_checkpoints/zone4?line=${selectedLine}`)
      .then(response => {
        console.log("API Response for Zone 4:", response.data); // Log the API response
        setActualCountForZone4(response.data.actualCount); // Ensure this matches the API response
      })
      .catch(error => {
        console.error("Error fetching data for Zone 4:", error);
        setActualCountForZone4(null); // Handle fetch errors
      })
      .finally(() => {
        setLoading(false); // End loading state
      });
  }
}, [selectedLine]);


// Fetch the count for zone 5 (ET or QT) whenever the selected line changes
useEffect(() => {
  if (selectedLine) {
    setLoading(true);
    axios.get(`http://localhost:5000/api/product_checkpoints/zone5?line=${selectedLine}&zoneType=ET`)
      .then(response => {
        console.log("API Response for Zone 5 (ET):", response.data);
        setActualCountForZone5_ET(response.data.actualCount);
      })
      .catch(error => {
        console.error("Error fetching data for Zone 5 (ET):", error);
        setActualCountForZone5_ET(null);
      })
      .finally(() => {
        setLoading(false);
      });

    axios.get(`http://localhost:5000/api/product_checkpoints/zone5?line=${selectedLine}&zoneType=QT`)
      .then(response => {
        console.log("API Response for Zone 5 (QT):", response.data);
        setActualCountForZone5_QT(response.data.actualCount);
      })
      .catch(error => {
        console.error("Error fetching data for Zone 5 (QT):", error);
        setActualCountForZone5_QT(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }
}, [selectedLine]);

  //total work
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/product_checkpoints", {
          params: { line: selectedLine } // Pass the selected line as a query parameter
        });
        const data = response.data;

        if (data.length > 0) {
          const zone1EntryTimeStr = data[0].zone1_ET;
          const zone5ExitTimeStr = data[data.length - 1]?.zone5_ET;

          if (!zone1EntryTimeStr || !zone5ExitTimeStr) {
            console.error("Missing date fields", { zone1EntryTimeStr, zone5ExitTimeStr });
            setTotalWork("0 minutes");
            return;
          }

          const zone1EntryTime = new Date(zone1EntryTimeStr);
          const zone5ExitTime = new Date(zone5ExitTimeStr);

          if (isNaN(zone1EntryTime.getTime()) || isNaN(zone5ExitTime.getTime())) {
            console.error("Invalid date format", { zone1EntryTimeStr, zone5ExitTimeStr });
            setTotalWork("0 minutes");
            return;
          }

          // Calculate total work in minutes
          const totalMinutes = (zone5ExitTime - zone1EntryTime) / (1000 * 60); // Convert to minutes

          // Convert minutes to hours and minutes
          const hours = Math.floor(totalMinutes / 60);
          const minutes = Math.round(totalMinutes % 60);

          // Format the output
          const formattedTotalWork = `${hours} hrs ${minutes} mins`;
          setTotalWork(formattedTotalWork);

        } else {
          console.error("No data available");
          setTotalWork("0 minutes");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [selectedLine]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBack = () => {
    navigate("/home");
  };

  const handleProductStatus = () => {
    navigate("/Page3");
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
      ChandleClose();
    }, 2000);
  };

  const handleReaderList = () => {
    navigate("/readerlist");
  };

  const handleTracker = () => {
    navigate("/page2");
  };

  const handleReportpage = () => {
    navigate("/reportpage");
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div className="menu">
          <button className="menu-button" onClick={toggleMenu}>MENU</button>
          <button className="back-button" onClick={handleBack}>BACK</button>
          {menuOpen && (
            <ul className="dropdown-menu">
              <li onClick={handleTracker}>FTM-Tracker</li>
              <li onClick={handleReaderList} >Reader</li>
              <li onClick={handleProductStatus} >Product Status</li>
              <li onClick={handleDatabaseSettingsOpen} >Settings</li>
              <li onClick={handleReportpage} >Report</li>
            </ul>
          )}
        </div>
        <div className="title">REPORT MASTER</div>
        <div className="datetime">
          <span>Date: {time.toLocaleDateString()}</span>
          <span>Time: {time.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="main-status">
        <div className="status-item select-container">
        <select value={selectedLine.replace("line", "")} onChange={handleLineChange}>
          <option value={1}>Line 1</option>
          <option value={2}>Line 2</option>
          <option value={3}>Line 3</option>
          <option value={4}>Line 4</option>
        </select>
      </div>
        <div className="status-item">Planned {currentTotal} </div>
        <div className="status-item">Actual {currentActual}</div>
        <div className="status-item">Pending {pending} </div>
        <div className="status-item">Total Work {totalWork}</div>
        <div className="status-item">Efficiency {efficiency}%</div>
      </div>

<div className="sections">
  <div className="section pickup">
    <div className="section-title">PICKUP</div>
    <div className="section-details">
      <div className="detail-item">
        <span>Planned</span><span id="pickup-planned"> {currentTotal}</span>
      </div>
      <div className="detail-item">
        <span>Actual</span><span id="pickup-actual">{actualCount}</span>
      </div>
      <div className="detail-item efficiency">
        <span>Efficiency</span>
        <span>
          <div className="gauge">
            <div className="gauge-needle"
           style={{ transform: `rotate(${efficiencyZone1 * 1.8 - 90}deg)` }}></div>
          </div>{efficiencyZone1}%
        </span>
      </div>
    </div>
  </div>

  <div className="section assembly">
    <div className="section-title">ASSEMBLY</div>
    <div className="section-details">
      <div className="detail-item">
        <span>Planned</span><span id="assembly-planned"> {currentTotal}</span>
      </div>
      <div className="detail-item">
        <span>Actual</span><span id="assembly-actual">{actualCountForZone2}</span>
      </div>
      <div className="detail-item efficiency">
        <span>Efficiency</span>
        <span>
          <div className="gauge">
            <div className="gauge-needle"
            style={{ transform: `rotate(${efficiencyZone2 * 1.8 - 90}deg)` }}></div>
          </div>{efficiencyZone2}%
        </span>
      </div>
    </div>
  </div>

  <div className="section testing">
    <div className="section-title">TESTING</div>
    <div className="section-details">
      <div className="detail-item">
        <span>Planned</span><span id="testing-planned"> {currentTotal}</span>
      </div>
      <div className="detail-item">
        <span>Actual</span><span id="testing-actual">{actualCountForZone3}</span>
      </div>
      <div className="detail-item efficiency">
        <span>Efficiency</span>
        <span>
          <div className="gauge">
            <div className="gauge-needle"
            style={{ transform: `rotate(${efficiencyZone3 * 1.8 - 90}deg)` }}></div>
          </div>{efficiencyZone3}%
        </span>
      </div>
    </div>
  </div>

  <div className="section painting">
    <div className="section-title">PAINTING</div>
    <div className="section-details">
      <div className="detail-item">
        <span>Planned</span><span id="painting-planned"> {currentTotal}</span>
      </div>
      <div className="detail-item">
        <span>Actual</span><span id="painting-actual">{actualCountForZone4}</span>
      </div>
      <div className="detail-item efficiency">
        <span>Efficiency</span>
        <span>
          <div className="gauge">
            <div className="gauge-needle"
            style={{ transform: `rotate(${efficiencyZone4 * 1.8 - 90}deg)` }}></div>
          </div>{efficiencyZone4}%
        </span>
      </div>
    </div>
  </div>

  <div className="section packing">
    <div className="section-title">PACKING</div>
    <div className="section-details">
      <div className="detail-item">
        <span>Planned</span><span id="packing-planned"> {currentTotal}</span>
      </div>
      <div className="detail-item">
        <span>Actual</span><span id="packing-actual">{actualCountForZone5_ET}</span>
      </div>
      <div className="detail-item efficiency">
        <span>Efficiency</span>
        <span>
          <div className="gauge">
            <div className="gauge-needle"
            style={{ transform: `rotate(${efficiencyZone5ET * 1.8 - 90}deg)` }}></div>
          </div>{efficiencyZone5ET}%
        </span>
      </div>
    </div>
  </div>

  <div className="section dispatch">
    <div className="section-title">DISPATCH</div>
    <div className="section-details">
      <div className="detail-item">
        <span>Planned</span><span id="dispatch-planned"> {currentTotal}</span>
      </div>
      <div className="detail-item">
        <span>Actual</span><span id="dispatch-actual">{actualCountForZone5_QT}</span>
      </div>
      <div className="detail-item efficiency">
        <span>Efficiency</span>
        <span>
          <div className="gauge">
            <div className="gauge-needle"
            style={{ transform: `rotate(${efficiencyZone5QT * 1.8 - 90}deg)` }}></div>
          </div>{efficiencyZone5QT}%
        </span>
      </div>
    </div>
  </div>
</div>


      <Dialog open={openDatabaseSettings} onClose={ChandleClose}>
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

      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #1c1c1c;
          color: #ffffff;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .dashboard {
          width: 100vw;
          height: 100vh;
          padding: 20px;
          box-sizing: border-box;
          background-color: #2a3f54;
          display: flex;
          flex-direction: column;
          color: #ffffff;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .menu {
          position: relative;
          display: flex;
          align-items: center;
        }

        .menu-button, .back-button {
          background-color: #233646;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .menu-button {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .back-button {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .dropdown-menu {
          position: absolute;
          top: 40px;
          left: 0;
          background-color: #233646;
          list-style: none;
          padding: 10px 0;
          margin: 0;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .dropdown-menu li {
          padding: 10px 20px;
          cursor: pointer;
        }

        .dropdown-menu li:hover {
          background-color: #34495e;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
        }

        .datetime {
          font-size: 14px;
        }

        .datetime span {
          margin-left: 20px;
        }

        .main-status {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }

        .status-item {
          background-color: #233646;
          padding: 10px 20px;
          border-radius: 5px;
          text-align: center;
        }

        .sections {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 20px;
          flex-grow: 1;
        }

        .section {
          background-color: #34495e;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .section-title {
          font-size: 18px;
          margin-bottom: 10px;
          text-align: center;
        }

        .section-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
        }

        .gauge {
          width: 50px;
          height: 25px;
          background: lightgrey;
          border-radius: 50px 50px 0 0;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
        }

        .gauge-needle {
          width: 2px;
          height: 25px;
          background: red;
          position: absolute;
          top: 0;
          left: 50%;
          transform: rotate(-90deg);
          transform-origin: bottom center;
        }

        {/* Add relevant CSS for the table */}
        .readers-table {
          margin-top: 20px;
          background-color: white;
          padding: 10px;
          border-radius: 5px;
        }
        .readers-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .readers-table th, .readers-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .select-container {
          position: relative;
          display: inline-block;
        }

        select {
          background-color: #2c3e50; /* Replace with your default color */
          color: #ecf0f1; /* Replace with your default text color */
          border: none;
          padding: 5px;
          border-radius: 4px;
          font-size: 16px;
          outline: none;
          cursor: pointer;
          appearance: none; /* Remove default arrow */
}


        
      `}</style>
    </div>
  );
};

export default Dashboard;
