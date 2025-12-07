const pg = require('pg');
const Pool = pg.Pool;

// Load in process env vars from dotenv
require('dotenv').config();

// [Donnell]: this code forces the parser for the TIMESTAMP WITHOUT TIME ZONE
// type (code 1114) to return a standard JS time string with a Z at the end,
// which indicates that JS should parse the time string as though it were a UTC
// timestamp. I needed to do this because the default `pg` parser thought it was
// parsing a CST (Texas time) string.
pg.types.setTypeParser(1114, (stringValue) => {
  return (stringValue.replaceAll(" ", "T") + "Z"); 
});

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
const ImageManager = require('./managers/ImageManager');
const MenuBoardManager = require('./managers/MenuBoardManager');

db.orderManager = new OrderManager(db);
db.userManager = new UserManager(db);
db.menuManager = new MenuManager(db);
db.ingredientManager = new IngredientManager(db);
db.imageManager = new ImageManager(db);
db.menuBoardManager = new MenuBoardManager(db);

module.exports = db;
