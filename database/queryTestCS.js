const fs = require('fs');
const cassie = require('cassandra-driver');

const clientCS = new cassie.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'sidebar',
});

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
  getProductInfoFromCS
};
