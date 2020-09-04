const { Pool } = require('pg');
const fs = require('fs');
const cassie = require('cassandra-driver');

const poolPG = new Pool({
  user: "hewbahrami",
  host: "localhost",
  database: "sidebar",
  password: "password",
  port: 5432
});

const clientCS = new cassie.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'sidebar',
})

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

const getProductInfoFromCS = (id, callback) => {
  const query = `SELECT * FROM products WHERE product_id=${id};`
  clientCS.execute(query)
    .then((result) => {
      callback(null, result);
    })
    .catch(err => {
      if (err) throw err;
    });
};

module.exports = {
  getProductInfoFromPG,
  getProductInfoFromCS
}