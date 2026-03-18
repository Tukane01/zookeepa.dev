const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const pool = require('./db');
// Load Environment Variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Import Routes
const authRoutes = require('./auth');
const userRoutes = require('./users');
const orderRoutes = require('./orders');
const productRoutes = require('./products');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

async function createSchemaTables() {
  try {
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    if (!schemaSql.trim()) return;

    const statements = schemaSql
      .split(';')
      .map((sql) => sql.trim())
      .filter((sql) => sql.length > 0);

    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (err) {
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
          continue;
        }
        if (err.code === 'ER_PARSE_ERROR') {
          console.warn('Skipping parse error for statement:', stmt.slice(0, 100));
          continue;
        }
        throw err;
      }
    }

    console.log('Database schema tables checked/created.');
  } catch (error) {
    console.error('Error creating database schema:', error.message);
    throw error;
  }
}

async function startServer() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log('Connected to MySQL database!');

    await createSchemaTables();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to the database or create schema:', err.message);
    process.exit(1);
  }
}

startServer();