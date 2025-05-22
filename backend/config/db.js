// const { Pool } = require('pg');
require('dotenv').config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// module.exports = pool;

// import postgres from 'postgres'

const postgres = require('postgres')

const connectionString = process.env.DATABASE_URL
const pool = postgres(connectionString)

module.exports = pool

