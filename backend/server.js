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
const careersRoutes = require('./careers');
const eventsRoutes = require('./events');
const galleryRoutes = require('./gallery');
const partnersRoutes = require('./partners');
const teamRoutes = require('./team');
const promotionsRoutes = require('./promotions');
const siteSettingsRoutes = require('./site-settings');
const imagesRoutes = require('./images');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/images', imagesRoutes);

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
        if (err.errno === 121) { // Duplicate key
          continue;
        }
        if (err.code === 'ER_DUP_FIELDNAME') {
          continue; // Column already exists
        }
        if (err.code === 'ER_PARSE_ERROR') {
          console.warn('Skipping parse error for statement:', stmt.slice(0, 100));
          continue;
        }
        throw err;
      }
    }

    console.log('Database schema tables checked/created.');

    // Ensure important columns exist on legacy DBs
    const schemaUpserts = [
      { table: 'products', query: 'ALTER TABLE products ADD COLUMN image_id INT' },
      { table: 'products', query: 'ALTER TABLE products ADD COLUMN additional_images JSON' },
      { table: 'events', query: 'ALTER TABLE events ADD COLUMN image_id INT' },
      { table: 'gallery_items', query: 'ALTER TABLE gallery_items ADD COLUMN image_id INT' },
      { table: 'team_members', query: 'ALTER TABLE team_members ADD COLUMN image_id INT' },
      { table: 'site_settings', query: 'ALTER TABLE site_settings ADD COLUMN hero_image_id INT' },
    ];

    for (const op of schemaUpserts) {
      try {
        await pool.query(op.query);
      } catch (err) {
        if (['ER_DUP_FIELDNAME', 'ER_CANT_DROP_FIELD_OR_KEY', 'ER_NO_SUCH_TABLE', 'ER_BAD_FIELD_ERROR', 'ER_DUP_FIELDNAME'].includes(err.code)) {
          continue;
        }
        console.warn(`Schema patch failed (${op.query}):`, err.code, err.message);
      }
    }

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