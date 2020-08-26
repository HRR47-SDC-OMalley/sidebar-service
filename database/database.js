const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

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

const changeProductAndSellerInfo = (id, name, callback) => {
  mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, connection) => {
    if (err) {
      throw err;
    } else {
      const db = connection.db('reburke');
      db.collection('reburke').findOneAndUpdate({ id }, { $set: { "seller.name": name } }, { returnOriginal: false }, (err, result) => {
        callback(err, result);
        connection.close();
      })
    }
  })
}

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
      })
    }
  })
}


var database = {
  getAllProductAndSellerInfo,
  changeProductAndSellerInfo,
  deleteProductAndSellerInfo,
};

module.exports = database;
