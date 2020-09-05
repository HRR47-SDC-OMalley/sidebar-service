const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const poolPG = new Pool({
  user: process.env.POSTGRES_USER || "hewbahrami",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB || "sidebar",
  password: process.env.POSTGRES_PASS || "password",
  port: process.env.POSTGRES_PORT,
});

const getProductInfoFromPG = (id, callback) => {
  const query = `SELECT * FROM products inner join sellers ON products.sellerID = sellers.seller_id WHERE products.product_id = ${id};`
  poolPG.connect()
    .then(client => {
      client.query(query)
        .then((result) => {
          callback(null, result);
          client.release();
        })
        .catch(err => {
          if (err) throw err;
        })
    })
}



module.exports = {
  getProductInfoFromPG,
};
