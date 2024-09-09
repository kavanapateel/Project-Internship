const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const mysql_promise = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "idex",
});

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
        zone1_ideal * 1000 * 60 * 60,
        zone2_ideal * 1000 * 60 * 60,
        zone3_ideal * 1000 * 60 * 60,
        zone4_ideal * 1000 * 60 * 60,
        zone5_ideal * 1000 * 60 * 60,
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
  const { productID, checkpoint } = req.body;

  if (!productID || !checkpoint) {
    return res.status(400).json({
      success: false,
      message: "Product ID and checkpoint are required",
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
        "INSERT INTO product_checkpoints (productID, zone1_ET) VALUES (?, ?)";
      db.query(
        insertCheckpointQuery,
        [productID, currentTime],
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
