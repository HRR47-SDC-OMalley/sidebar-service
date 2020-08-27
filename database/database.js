const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

const postProductAndSellerInfo = (id, body, callback) => {
  const productKeys = Object.keys(body.product);
  const productValues = Object.values(body.product);
  const sellerKeys = Object.keys(body.seller);
  const sellerValues = Object.values(body.seller);
  let setObject = {};
  setObject.id = id;
  if (productKeys.length) {
    setObject.products = {};
    for (let i = 0; i < productKeys.length; i++) {
      setObject.products[productKeys[i]] = productValues[i];
    }
  }
  if (sellerKeys.length) {
    setObject.seller = {};
    for (let j = 0; j < sellerKeys.length; j++) {
      setObject.seller[sellerKeys[j]] = sellerValues[j];
    }
  }
  mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, connection) => {
    if (err) {
      throw err;
    } else {
      // check if id exists, if yes, close connection and send back id already exists
      const db = connection.db('reburke');
      db.collection('reburke').findOne({ id }, (err, result) => {
        if (err) {
          throw err;
        } else if (!result) {
          db.collection('reburke').insertOne(setObject, (err, result) => {
            if (err) {
              throw err;
            } else {
              callback(err, result);
            }
          });
        }
      });
    }
  });
};

const getAllProductAndSellerInfo = (id, callback) => {
  mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
      throw err;
    } else {
      // try to access the db and get some data
      const db = client.db('reburke');
      db.collection('reburke').findOne({ id }, (error, result) => {
        if (error || !result) {
          const emptyResultError = new Error('Not Found');
          emptyResultError.status = 404;
          callback(emptyResultError, { product: {}, seller: { reviews: { rating: 0 } } });
        } else {
          const data = {
            product: result.product,
            seller: result.seller
          };
          callback(error, data);
          client.close();
        }
      });
    }
  });
};

const changeProductAndSellerInfo = (id, body, callback) => {
  const productKeys = Object.keys(body.product);
  const productValues = Object.values(body.product);
  const sellerKeys = Object.keys(body.seller);
  const sellerValues = Object.values(body.seller);
  let setObject = {};
  for (let i = 0; i < productKeys.length; i++) {
    setObject[`product.${productKeys[i]}`] = productValues[i];
  }
  for (let j = 0; j < sellerKeys.length; j++) {
    setObject[`seller.${sellerKeys[j]}`] = sellerValues[j];
  }
  mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, connection) => {
    if (err) {
      throw err;
    } else {
      const db = connection.db('reburke');
      db.collection('reburke').findOneAndUpdate({ id }, { $set: setObject }, { returnOriginal: false }, (err, result) => {
        callback(err, result);
        connection.close();
      });
    }
  });
};

const deleteProductAndSellerInfo = (id, callback) => {
  mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, connection) => {
    if (err) {
      throw err;
    } else {
      const db = connection.db('reburke');
      db.collection('reburke').deleteOne({ id }, (err) => {
        if (err) {
          throw err;
        } else {
          callback();
          connection.close();
        }
      });
    }
  });
};

var database = {
  postProductAndSellerInfo,
  getAllProductAndSellerInfo,
  changeProductAndSellerInfo,
  deleteProductAndSellerInfo
};

module.exports = database;
