const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'donation_v1',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
