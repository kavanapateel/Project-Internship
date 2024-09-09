const express = require('express')
const mysql = require('mysql2')
const mysql_promise = require("mysql2/promise");
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'idex',
})

// Initialize variables for tracking database changes
let lastRequestTimestamp = Date.now();
let latestDatabaseChangeTimestamp = Date.now();

// Connect to MySQL database and create tables if they do not exist
db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");

  const createProductsTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      productID INT PRIMARY KEY,
      productName varchar(30),
      zone1_ideal DOUBLE,
      zone2_ideal DOUBLE,
      zone3_ideal DOUBLE,
      zone4_ideal DOUBLE,
      zone5_ideal DOUBLE
    )
  `;

  const createCheckpointsTableQuery = `
    CREATE TABLE IF NOT EXISTS product_checkpoints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productID INT,
      line varchar(10),
      zone1_ET DATETIME,
      zone2_ET DATETIME,
      zone3_ET DATETIME,
      zone4_ET DATETIME,
      zone5_ET DATETIME,
      zone5_QT DATETIME,
      FOREIGN KEY (productID) REFERENCES products(productID)
    )
  `;

  db.query(createProductsTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating 'products' table:", err);
      process.exit(1);
    }
    console.log("Ensured 'products' table exists");
  });

  db.query(createCheckpointsTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating 'product_checkpoints' table:", err);
      process.exit(1);
    }
    console.log("Ensured 'product_checkpoints' table exists");
  });
});

const pool = mysql_promise.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "idex",
});

// Middleware for checking database changes before sending data
const checkDatabaseChangesMiddleware = async (req, res, next) => {
  try {
    const currentTimestamp = Date.now();
    if (lastRequestTimestamp < latestDatabaseChangeTimestamp) {
      // Database has been changed since the last request
      latestDatabaseChangeTimestamp = currentTimestamp;
    }
    next();
  } catch (error) {
    console.error("Error checking database changes:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Middleware for updating last request timestamp
const updateLastRequestTimestampMiddleware = (req, res, next) => {
  lastRequestTimestamp = Date.now();
  next();
};

// Apply middleware for checking database changes and updating last request timestamp
app.use(checkDatabaseChangesMiddleware);
app.use(updateLastRequestTimestampMiddleware);

app.get("/register/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Records per page
    const offset = (page - 1) * perPage;

    const connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM products LIMIT ?, ?`, [
      offset,
      perPage,
    ]);
    const [total] = await connection.query(
      "SELECT COUNT(*) AS total FROM products"
    );

    connection.release();
    res.json({ products: rows, total: total[0].total });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

app.get("/products/checkpoints", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const offset = (page - 1) * perPage;

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM product_checkpoints ORDER BY id DESC LIMIT ?, ? `,
      [offset, perPage]
    );
    const [total] = await connection.query(
      "SELECT COUNT(*) AS total FROM product_checkpoints"
    );

    const [ideal_times] = await connection.query("SELECT * FROM products");

    connection.release();
    res.json({
      products: rows,
      total: total[0].total,
      efficiencyList: ideal_times,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

app.post("/registerProduct", (req, res) => {
  const {
    productID,
    productName,
    zone1_ideal,
    zone2_ideal,
    zone3_ideal,
    zone4_ideal,
    zone5_ideal,
  } = req.body.formData;

  const sql = "SELECT productID FROM products WHERE productID = ?";
  db.query(sql, [productID], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    if (results.length > 0) {
      console.log("Invalid Product ID. Product Details already exist.");
      return res
        .status(401)
        .json({ success: false, message: "Product ID exists." });
    }

    const insertNewProductQuery =
      "INSERT INTO products (productID, productName, zone1_ideal, zone2_ideal, zone3_ideal, zone4_ideal, zone5_ideal) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      insertNewProductQuery,
      [
        productID,
        productName,
        zone1_ideal * 1000,
        zone2_ideal * 1000,
        zone3_ideal * 1000,
        zone4_ideal * 1000,
        zone5_ideal * 1000,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting new product:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }
        console.log(`Product ${productID} details stored.`);
        return res.json({
          success: true,
          message: `Product ${productID} saved.`,
        });
      }
    );
  });
});

app.post("/checkpoint", (req, res) => {
  const { productID, checkpoint,line } = req.body;

  if (!productID || !checkpoint || !line) {
    return res.status(400).json({
      success: false,
      message: "Product ID and checkpoint,line  are required",
    });
  }

  const sql = "SELECT * FROM products WHERE productID = ?";
  db.query(sql, [productID], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    if (results.length === 0) {
      console.log("Invalid Product ID. Product Details not found.");
      return res
        .status(401)
        .json({ success: false, message: "Invalid Product ID" });
    }

    const currentTime = new Date();

    if (checkpoint === 1) {
      // Insert the first checkpoint with entryTime
      const insertCheckpointQuery =
        "INSERT INTO product_checkpoints (productID, zone1_ET,line) VALUES (?, ?, ?)";
      db.query(
        insertCheckpointQuery,
        [productID, currentTime, line],
        (err, result) => {
          if (err) {
            console.error("Error inserting checkpoint data:", err);
            return res
              .status(500)
              .json({ success: false, message: "Internal server error" });
          }
          return res.json({
            success: true,
            message: `Checkpoint ${checkpoint} entry time recorded`,
          });
        }
      );
    } else {
      const previousCheckpoint = checkpoint - 1;
      const entryTimeQuery = `SELECT zone${previousCheckpoint}_ET FROM product_checkpoints WHERE productID = ? ORDER BY zone${previousCheckpoint}_ET DESC LIMIT 1`;
      db.query(entryTimeQuery, [productID], (err, entryResults) => {
        if (err) {
          console.error("Error querying database:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        }

        if (entryResults.length === 0) {
          return res.status(400).json({
            success: false,
            message: `No entry time found for checkpoint ${previousCheckpoint}`,
          });
        }

        const lastZoneTime = entryResults[0][`zone${previousCheckpoint}_ET`];

        // Update the query for the previous checkpoint
        const updatePreviousCheckpointQuery = `UPDATE product_checkpoints SET zone${checkpoint}_ET = ? WHERE productID = ? AND zone${previousCheckpoint}_ET = ?`;
        db.query(
          updatePreviousCheckpointQuery,
          [currentTime, productID, lastZoneTime],
          (err, updateResult) => {
            if (err) {
              console.error("Error updating previous checkpoint data:", err);
              return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
            }

            // Send response indicating success
            return res.json({
              success: true,
              message: `Checkpoint ${checkpoint} entry time recorded`,
            });
          }
        );
      });
    }
  });
});

app.post("/logout", (req, res) => {
  const { productID } = req.body;

  if (!productID) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  const sql = "SELECT * FROM products WHERE productID = ?";
  db.query(sql, [productID], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
    if (results.length === 0) {
      console.log("Invalid Product ID. Product not found.");
      return res.status(401).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const checkpoint = 5; // Assuming checkpoint 5 is the logout checkpoint
    const currentTime = new Date();

    const entryTimeQuery =
      "SELECT zone5_ET FROM product_checkpoints WHERE productID = ? ORDER BY zone5_ET DESC LIMIT 1";
    db.query(entryTimeQuery, [productID, checkpoint], (err, entryResults) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

      if (entryResults.length === 0) {
        return res.status(400).json({
          success: false,
          message: `No entry time found for checkpoint ${checkpoint}`,
        });
      }

      const zone5_ET = entryResults[0][`zone5_ET`];

      // Update the exitTime and totalTime for the checkpoint 5
      const updateCheckpointQuery =
        "UPDATE product_checkpoints SET zone5_QT = ? WHERE productID = ? AND zone5_ET = ?";
      db.query(
        updateCheckpointQuery,
        [currentTime, productID, zone5_ET],
        (err, updateResult) => {
          if (err) {
            console.error("Error updating checkpoint data:", err);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }

          return res.json({
            success: true,
            message: `Checkpoint ${checkpoint} recorded for logout`,
          });
        }
      );
    });
  });
});


//supervised code
// Login route
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body

  const sql = 'SELECT password FROM admin WHERE username = ?'
  db.query(sql, [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error during login attempt', error: err })
    } else if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }) // User not found
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error during login attempt', error: err })
      }

      if (isMatch) {
        return res.json({ message: 'Login successful.' })
      } else {
        return res.json({ message: 'Invalid credentials.' })
      }
    })
  })
})

// Register route
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' })
  }

  const query = 'SELECT * FROM admin WHERE username = ?'
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists.' })
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error hashing password', error: err })
      }

      const insertQuery = 'INSERT INTO admin (username, password) VALUES (?, ?)'
      db.query(insertQuery, [username, hash], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err })
        }

        res.json({ message: 'Registration successful' })
      })
    })
  })
})

// Endpoint to get all records
app.get('/api/records', (req, res) => {
  db.query('SELECT * FROM records', (err, results) => {
    if (err) {
      console.error('Error fetching records:', err)
      return res.status(500).json({ error: 'Failed to fetch records' })
    }
    return res.json(results)
  })
})

// Endpoint to add a new record
app.post('/api/records', (req, res) => {
  const { slNo, workPartNumber, partNumber,line, quantity, startDate, endDate } =
    req.body
  const query =
    'INSERT INTO records (slNo, workPartNumber, partNumber, line, quantity, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)'
  db.query(
    query,
    [slNo, workPartNumber, partNumber,line, quantity, startDate, endDate],
    (err, result) => {
      if (err) {
        console.error('Error adding record:', err)
        res.status(500).json({ error: 'Failed to add record' })
        return
      }
      res.status(201).json({ message: 'Record added successfully' })
    }
  )
})

// Endpoint to delete a record  
app.post('/api/records/delete/:id', (req, res) => {
  const recordId = req.params.id
  const query = 'DELETE FROM records WHERE id = ?'
  db.query(query, [recordId], (err, result) => {
    if (err) {
      console.error('Error deleting record:', err)
      return res.status(500).json({ error: 'Failed to delete record' })
    }
    return res.status(200).json({ message: 'Record deleted successfully' })
  })
})

// Endpoint to get RFID details for a specific record
app.get('/api/records/:recordId/rfid', (req, res) => {
  const recordId = req.params.recordId
  const query =
    'SELECT ID, Zone, RFIDNumber, RFIDName, Line FROM rfidlist WHERE ID = ?'
  db.query(query, [recordId], (err, results) => {
    if (err) {
      console.error('Error fetching RFID details:', err)
      return res.status(500).json({ error: 'Failed to fetch RFID details' })
    }
    return res.json(results)
  })
})

// Endpoint to add RFID details to a specific record
app.post('/api/records/:recordId/rfid', (req, res) => {
  const { recordId } = req.params
  const { zone, rfidName, rfidNumber, rfidline } = req.body

  // Query to find the record ID based on work part number and part number
  const query =
    'SELECT id FROM records WHERE workPartNumber = ? AND partNumber = ?'
  db.query(
    query,
    [req.body.workPartNumber, req.body.partNumber],
    (err, results) => {
      if (err) {
        console.error('Error finding record ID:', err)
        res.status(500).json({ error: 'Failed to add RFID details' })
        return
      }

      if (results.length === 0) {
        // Record not found
        res.status(404).json({ message: 'Record not found' })
        return
      }

      const recordId = results[0].id

      // Query to insert RFID details into the rfidlist table
      const insertQuery =
        'INSERT INTO rfidlist (ID, Zone, RFIDName, RFIDNumber, Line) VALUES (?, ?, ?, ?, ?)'
      db.query(
        insertQuery,
        [recordId, zone, rfidName, rfidNumber, rfidline],
        (err, result) => {
          if (err) {
            console.error('Error adding RFID details:', err)
            res.status(500).json({ error: 'Failed to add RFID details' })
            return
          }
          res.status(201).json({ message: 'RFID details added successfully' })
        }
      )
    }
  )
})

// Endpoint to delete an RFID detail from a record
app.delete('/api/records/:recordId/rfid/:rfidId', (req, res) => {
  const { recordId, rfidId } = req.params

  const query = 'DELETE FROM rfidlist WHERE ID = ? AND RFIDNumber = ?'
  db.query(query, [recordId, rfidId], (err, result) => {
    if (err) {
      console.error('Error deleting RFID detail:', err)
      res.status(500).json({ error: 'Failed to delete RFID detail' })
      return
    }

    if (result.affectedRows === 0) {
      // No RFID detail deleted (perhaps not found)
      res.status(404).json({ message: 'RFID detail not found' })
      return
    }

    // RFID detail deleted successfully
    res.status(200).json({ message: 'RFID detail deleted successfully' })
  })
})

//locations 
app.get('/api/locations', (req, res) => {
  const sql = 'SELECT * FROM locations';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error inserting location:', err);
      return res.status(500).json({ error: 'Error inserting location' });
    }
    return result.length > 0 ?
      res.status(201).json({ result }) : res.status(200).json({ message: "0 records attached. " })
  });
});

//locations
app.post('/api/locations/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body
  const sql = "SELECT * FROM locations where id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error updating location:', err);
      return res.status(500).json({ error: 'Error updating location' });
    }
    const newQuery = result.length > 0 ? "UPDATE locations SET name = ?, description = ? WHERE id = ?" :
      "INSERT INTO locations (name, description) VALUES (?, ?)";
    db.query(newQuery, [name, description, id], (err, results) => {
      if (err) {
        console.error('Error updating table location:', err);
        return res.status(500).json({ error: 'Error updating table location' });
      }
      return res.status(200).json({ message: 'Record saved. ', results });
    })
  })
})

//delete
app.post('/delete/locations/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM locations WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting location:', err);
      return res.status(500).json({ error: 'Error deleting location' });
    }
    return res.status(204).json({ result: `Location ID: ${id} has been deleted.` });
  });
});

//readers
app.get('/readers', (req, res) => {
  db.query('SELECT * FROM readers', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/readers', (req, res) => {
  const { location, readerName, readerIp, readerTag, terminalReader } = req.body;
  const query = 'INSERT INTO readers (location, readerName, readerIp, readerTag, terminalReader) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [location, readerName, readerIp, readerTag, terminalReader], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId });
  });
});

app.put('/readers/:id', (req, res) => {
  const { id } = req.params;
  const { location, readerName, readerIp, readerTag, terminalReader } = req.body;
  const query = 'UPDATE readers SET location = ?, readerName = ?, readerIp = ?, readerTag = ?, terminalReader = ? WHERE id = ?';
  db.query(query, [location, readerName, readerIp, readerTag, terminalReader, id], (err, result) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.delete('/readers/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM readers WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

//port vs cycleTime
app.get('/api/parts', (req, res) => {
  db.query('SELECT * FROM parts', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.status(200).json({ results });
    }
  });
});

// Add a new part
app.post('/api/parts', (req, res) => {
  const { part_number, operation, cycle_time } = req.body;
  db.query('INSERT INTO parts (part_number, operation, cycle_time) VALUES (?, ?, ?)', [part_number, operation, cycle_time], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.status(201).send('Part added successfully.');
    }
  });
});

// Update a part
app.put('/api/parts/:id', (req, res) => {
  const { id } = req.params;
  const { part_number, operation, cycle_time } = req.body;
  db.query('UPDATE parts SET part_number = ?, operation = ?, cycle_time = ? WHERE id = ?', [part_number, operation, cycle_time, id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.status(200).send('Part updated successfully.');
    }
  });
});

// Delete a part
app.delete('/api/parts/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM parts WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.status(200).send('Part deleted successfully.');
    }
  });
});

//tag master
// Route to fetch all tags
app.get('/tags', (req, res) => {
  const query = 'SELECT * FROM tags';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching tags: ', err);
      res.status(500).send('Error fetching tags');
      return;
    }
    res.status(200).json(result);
  });
});

// Add Tag
app.post('/tags/add', (req, res) => {
  const { tagType, tagDescription } = req.body;
  const query = 'INSERT INTO tags (tagType, tagDescription) VALUES (?, ?)';
  db.query(query, [tagType, tagDescription], (err, result) => {
    if (err) {
      console.error('Error adding tag: ', err);
      res.status(500).send('Error adding tag');
      return;
    }
    res.status(200).send('Tag added successfully');
  });
});

// Edit Tag
app.put('/tags/edit/:id', (req, res) => {
  const id = req.params.id;
  const { tagType, tagDescription } = req.body;
  const query = 'UPDATE tags SET tagType=?, tagDescription=? WHERE id=?';
  db.query(query, [tagType, tagDescription, id], (err, result) => {
    if (err) {
      console.error('Error updating tag: ', err);
      res.status(500).send('Error updating tag');
      return;
    }
    res.status(200).send('Tag updated successfully');
  });
});

// Delete Tag
app.delete('/tags/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM tags WHERE id=?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting tag: ', err);
      res.status(500).send('Error deleting tag');
      return;
    }
    res.status(200).send('Tag deleted successfully');
  });
});

//Trolley master
// fetch all trolleys
app.get('/trolleys', (req, res) => {
  const sql = 'SELECT * FROM trolleys';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching trolleys: ', err);
      res.status(500).send('Error fetching trolleys');
      return;
    }
    res.json(results);
  });
});

//add a trolley
app.post('/trolleys', (req, res) => {
  const { trolleyNumber, trolleyName, trolleyDescription } = req.body;
  const sql = 'INSERT INTO trolleys (trolleyNumber, trolleyName, trolleyDescription) VALUES (?, ?, ?)';
  db.query(sql, [trolleyNumber, trolleyName, trolleyDescription], (err, result) => {
    if (err) {
      console.error('Error adding trolley: ', err);
      res.status(500).send('Error adding trolley');
      return;
    }
    console.log('Trolley added successfully');
    res.sendStatus(200);
  });
});

//edit a trolley
app.put('/trolleys/:id', (req, res) => {
  const id = req.params.id;
  const { trolleyNumber, trolleyName, trolleyDescription } = req.body;
  const sql = 'UPDATE trolleys SET trolleyNumber = ?, trolleyName = ?, trolleyDescription = ? WHERE id = ?';
  db.query(sql, [trolleyNumber, trolleyName, trolleyDescription, id], (err, result) => {
    if (err) {
      console.error('Error editing trolley: ', err);
      res.status(500).send('Error editing trolley');
      return;
    }
    console.log('Trolley edited successfully');
    res.sendStatus(200);
  });
});

//delete a trolley
app.delete('/trolleys/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM trolleys WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting trolley: ', err);
      res.status(500).send('Error deleting trolley');
      return;
    }
    console.log('Trolley deleted successfully');
    res.sendStatus(200);
  });
});

//Line master
// fetch all lines
app.get('/linesm', async (req, res) => {
  try {
    const sql = "SELECT * FROM linesm"
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching records:', err);
        return res.status(500).json({ error: 'Error fetching records' });
      }
      return res.status(200).json({ rows: results })
    })
  } catch (err) {
    console.error('Error fetching lines:', err);
    res.status(500).json({ error: err.message });
  }
});

//add a line
app.post('/linesm', (req, res) => {
  const { id, line, lineDescription } = req.body;
  const sql = "SELECT * FROM linesm where id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error locating record:', err);
      return res.status(500).json({ error: 'Error locating record' });
    }
    const newQuery = result.length > 0 ? "UPDATE linesm SET line = ?, line_description = ? WHERE id = ?" :
      "INSERT INTO linesm (line, line_description) VALUES (?, ?)";
    db.query(newQuery, [line, lineDescription, id], (err, results) => {
      if (err) {
        console.error('Error updating table location:', err);
        return res.status(500).json({ error: 'Error updating table location' });
      }
      return res.status(200).json({ message: 'Record saved. ', results });
    })
  })
});

//delete a line
app.post('/linesm/delete/:id', (req, res) => {
  const { id } = req.params;
  try {
    const sql = "SELECT * FROM linesm WHERE id = ?"
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error fetching record:', err);
        return res.status(500).json({ error: 'Error fetching record' });
      }
      const deleteQuery = "DELETE FROM linesm WHERE id = ?"
      db.query(deleteQuery, [id], (err, result) => {

        return err ? res.status(500).json({ error: `Error deleting record` }) : res.status(200).json({ message: 'Record deleted' })
      })
    })
  } catch (err) {
    console.error('Error fetching lines:', err);
    res.status(500).json({ error: err.message });
  }
});

//report page 
app.get("/products", (req, res) => {
  const sql = `
    SELECT 
      productID, 
      zone1_ET, zone2_ET, 
      zone2_ET, zone3_ET, 
      zone3_ET, zone4_ET, 
      zone4_ET, zone5_ET, 
      zone5_ET, zone5_QT
    FROM product_checkpoints
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching report data:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
    res.json({ success: true, data: results });
  });
});

// Planned
app.get('/api/quantity/line', (req, res) => {
  const totalQuantityPerLineQuery = `
    SELECT line, SUM(quantity) AS totalQuantity
    FROM records
    GROUP BY line
  `;

  db.query(totalQuantityPerLineQuery, (err, results) => {
    if (err) {
      console.error('Error fetching total quantity per line:', err);
      return res.status(500).json({ error: 'Failed to fetch total quantity per line' });
    }

    const lineTotals = {};
    results.forEach(row => {
      lineTotals[row.line] = row.totalQuantity || 0; // Use row.line as the key
    });

    res.json(lineTotals); // This should return an object like { "1": 100, "2": 200 }
  });
});

//actual
app.get('/api/actual/line', (req, res) => {
  const countQuery = `
    SELECT line, COUNT(*) AS totalCount
    FROM product_checkpoints
    GROUP BY line
  `;
  db.query(countQuery, (err, results) => {
    if (err) {
      console.error('Error fetching actual count:', err);
      return res.status(500).json({ error: 'Failed to fetch actual count' });
    }
    res.json({ lines: results }); // Return the array of results
  });
});


//actual zone 1
app.get('/api/product_checkpoints/', (req, res) => {
  const line = req.query.line;

  if (!line) {
    return res.status(400).json({
      success: false,
      message: "Line parameter is required",
    });
  }

  const query = `
  SELECT COUNT(*) AS actualCount
  FROM product_checkpoints
  WHERE line = ? AND zone1_ET IS NOT NULL
`;
console.log('Executing query with line:', line); // Log the line parameter
  console.log('SQL Query:', query);
db.query(query, [line], (err, results) => {
  if (err) {
    console.error('Error fetching actual count:', err);
    return res.status(500).json({ error: 'Failed to fetch actual count' });
  }
  console.log('Query results:', results);
  if (results.length === 0) {
    return res.status(404).json({ success: false, message: 'No data found' });
  }
  
  const actualCount = results[0].actualCount;
  console.log('Actual Count:', actualCount);
  res.json({ actualCount });
});
});



// Endpoint for fetching the actual count for zone 2
app.get('/api/product_checkpoints/zone2', (req, res) => {
  const line = req.query.line;

  if (!line) {
    return res.status(400).json({
      success: false,
      message: "Line parameter is required",
    });
  }

  const query = `
  SELECT COUNT(*) AS actualCount
  FROM product_checkpoints
  WHERE line = ? AND zone2_ET IS NOT NULL
  `;
  
  console.log('Executing query for zone 2 with line:', line);
  console.log('SQL Query:', query);
  
  db.query(query, [line], (err, results) => {
    if (err) {
      console.error('Error fetching actual count for zone 2:', err);
      return res.status(500).json({ error: 'Failed to fetch actual count for zone 2' });
    }
    
    console.log('Query results for zone 2:', results);
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found for zone 2' });
    }
    
    const actualCount = results[0].actualCount;
    console.log('Actual Count for zone 2:', actualCount);
    
    res.json({ actualCount });
  });
});



// Endpoint for fetching the actual count for zone 3
app.get('/api/product_checkpoints/zone3', (req, res) => {
  const line = req.query.line;

  if (!line) {
    return res.status(400).json({
      success: false,
      message: "Line parameter is required",
    });
  }

  const query = `
  SELECT COUNT(*) AS actualCount
  FROM product_checkpoints
  WHERE line = ? AND zone3_ET IS NOT NULL
  `;
  
  console.log('Executing query for zone 3 with line:', line);
  console.log('SQL Query:', query);
  
  db.query(query, [line], (err, results) => {
    if (err) {
      console.error('Error fetching actual count for zone 3:', err);
      return res.status(500).json({ error: 'Failed to fetch actual count for zone 3' });
    }
    
    console.log('Query results for zone 3:', results);
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found for zone 3' });
    }
    
    const actualCount = results[0].actualCount;
    console.log('Actual Count for zone 3:', actualCount);
    
    res.json({ actualCount });
  });
});


// Endpoint for fetching the actual count for zone 4
app.get('/api/product_checkpoints/zone4', (req, res) => {
  const line = req.query.line;

  if (!line) {
    return res.status(400).json({
      success: false,
      message: "Line parameter is required",
    });
  }

  const query = `
  SELECT COUNT(*) AS actualCount
  FROM product_checkpoints
  WHERE line = ? AND zone4_ET IS NOT NULL
  `;
  
  console.log('Executing query for zone 4 with line:', line);
  console.log('SQL Query:', query);
  
  db.query(query, [line], (err, results) => {
    if (err) {
      console.error('Error fetching actual count for zone 4:', err);
      return res.status(500).json({ error: 'Failed to fetch actual count for zone 4' });
    }
    
    console.log('Query results for zone 4:', results);
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found for zone 4' });
    }
    
    const actualCount = results[0].actualCount;
    console.log('Actual Count for zone 4:', actualCount);
    
    res.json({ actualCount });
  });
});


// Endpoint for fetching the actual count for either zone 5 (ET) or zone 5 (QT)
app.get('/api/product_checkpoints/zone5', (req, res) => {
  const line = req.query.line;
  const zoneType = req.query.zoneType; // Expecting 'ET' or 'QT'

  if (!line || !zoneType) {
    return res.status(400).json({
      success: false,
      message: "Line and zoneType parameters are required",
    });
  }

  const column = zoneType === 'ET' ? 'zone5_ET' : 'zone5_QT';
  
  const query = `
  SELECT COUNT(*) AS actualCount
  FROM product_checkpoints
  WHERE line = ? AND ${column} IS NOT NULL
  `;
  
  console.log(`Executing query for zone 5 (${zoneType}) with line:`, line);
  db.query(query, [line], (err, results) => {
    if (err) {
      console.error(`Error fetching actual count for zone 5 (${zoneType}):`, err);
      return res.status(500).json({ error: `Failed to fetch actual count for zone 5 (${zoneType})` });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: `No data found for zone 5 (${zoneType})` });
    }
    
    const actualCount = results[0].actualCount;
    console.log(`Actual Count for zone 5 (${zoneType}):`, actualCount);
    res.json({ actualCount });
  });
});


//total work
app.get("/product_checkpoints", (req, res) => {
  const { line } = req.query;

  if (!line) {
    return res.status(400).json({ success: false, message: "Line parameter is required" });
  }

  const sql = `
    SELECT 
      zone1_ET, 
      zone5_ET 
    FROM 
      product_checkpoints 
    WHERE 
      zone1_ET IS NOT NULL 
      AND zone5_ET IS NOT NULL
      AND line = ?
    ORDER BY zone1_ET ASC
  `;

  db.query(sql, [line], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    res.json(results);
  });
});





app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port http://0.0.0.0:${PORT}/`)
})
