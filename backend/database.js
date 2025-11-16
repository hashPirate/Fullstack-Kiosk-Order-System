const { Pool } = require('pg');

// Load in process env vars from dotenv
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const identityMap = new Map();

const db = {
  query: (text, params) => pool.query(text, params),
  runUpdate: (text, params) => pool.query(text, params),
  identityMap,
  pool,
};

// Managers
const OrderManager = require('./managers/OrderManager');
const UserManager = require('./managers/UserManager');
const MenuManager = require('./managers/MenuManager');
const IngredientManager = require('./managers/IngredientManager');

db.orderManager = new OrderManager(db);
db.userManager = new UserManager(db);
db.menuManager = new MenuManager(db);
db.ingredientManager = new IngredientManager(db);

module.exports = db;
