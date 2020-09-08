const { Pool } = require('pg');
const fs = require('fs');
const copyFrom = require('pg-copy-streams').from;
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || "hewbahrami",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB || "sidebar",
  password: process.env.POSTGRES_PASS || "password",
  port: process.env.POSTGRES_PORT,
});

const createSellersTable = `
  CREATE TABLE IF NOT EXISTS sellers (
    seller_id serial PRIMARY KEY,
    sellerName varchar(60),
    address varchar(100),
    isQuickShipper boolean,
    joinYear smallint,
    reviews smallint
  );
`;

const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
  product_id serial PRIMARY KEY,
  productName varchar(60),
  condition varchar(9),
  shippingFee smallint,
  priceOriginal smallint,
  priceActual smallint,
  isOpenToOffers boolean,
  category varchar(9),
  style varchar(30),
  brand varchar(60),
  sellerID integer REFERENCES sellers (seller_id)
  );
`;

const loadSellers = `COPY sellers (seller_id, sellerName, address, isQuickShipper, joinYear, reviews) FROM STDIN WITH DELIMITER ',' CSV HEADER;`;
const loadProducts = `COPY products (product_id, productName, condition, shippingFee, priceOriginal, priceActual, isOpenToOffers, category, style, brand, sellerID) FROM STDIN WITH DELIMITER ',' CSV HEADER;`;

pool.connect((err, client, done) => {
  if (err) {
    throw err;
  }
  client.query(createSellersTable, (err) => {
    if (err) throw err;
    client.query(createProductsTable, (err) => {
      if (err) throw err;
      let sellerFileStream = fs.createReadStream('./database/sellerData.csv');
      sellerFileStream.on('error', () => {
        client.release();
        done();
      });
      let sellerStream = client.query(copyFrom(loadSellers));
      const sellersDataLoadStart = new Date();
      sellerFileStream.pipe(sellerStream).on('finish', () => {
        console.log('Sellers loaded')
        const sellersDataLoadEnd = new Date() - sellersDataLoadStart;
        console.log('Execution time: %dms', sellersDataLoadEnd);
        let productFileStream = fs.createReadStream('./database/productData.csv');
        productFileStream.on('error', () => {
          client.release();
          done();
        });
        let productStream = client.query(copyFrom(loadProducts));
        const productsDataLoadStart = new Date();
        productFileStream.pipe(productStream).on('finish', () => {
          console.log('Products loaded');
          productsDataLoadEnd = new Date() - productsDataLoadStart;
          console.log('Execution time: %dms', productsDataLoadEnd);
          done();
        });
      });
    });
  });
});



// UBUNTU POSTGRES LOAD FROM COMMAND LINE
// \copy sellers (seller_id, sellerName, address, isQuickShipper, joinYear, reviews) FROM /home/ubuntu/sidebar-service/database/sellerData.csv WITH DELIMITER ',' CSV HEADER;
// \copy products (product_id, productName, condition, shippingFee, priceOriginal, priceActual, isOpenToOffers, category, style, brand, sellerID) FROM /home/ubuntu/sidebar-service/database/productData.csv WITH DELIMITER ',' CSV HEADER;