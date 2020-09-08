require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/database.js');
const pg = require('../database/queryFunctions.js');
// const cs = require('../database/queryTestCS.js');
require('dotenv').config();

const app = express();

// app.use('/', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

// app.get('*/bundle.js', (req, res) => {
//   res.redirect('https://hrr47-fec-sidebar.s3.ap-northeast-2.amazonaws.com/js/bundle.js');
// });

app.use(express.static(`${__dirname}/../public`));
app.use('/item/:id', express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

//create
app.post('/sb/api/item/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  db.postProductAndSellerInfo(Number(id), body, (err) => {
    if (err) {
      throw err;
    } else {
      res.send('Posted!');
    }
  });
});

//read
app.get('/sb/api/item/:id', (req, res) => {
  //legacy code get request to mongo database
  // db.getAllProductAndSellerInfo(req.params.id || 0, (err, result) => {
  //   if (err) {
  //     res.status(404).send('Not found!');
  //   } else {
  //     console.log(result)
  //     res.send(result);
  //   }
  // });

  //get request to postgres db
  pg.getProductInfoFromPG(req.params.id || 0, (err, result) => {
    // console.log('first')
    if (err) {
      // console.log('error')
      res.status(404).send('Not found!');
    } else {
      // console.log(result)
      res.send(result)
    }
  })
})
  //get request to cassandra db
//   cs.getProductInfoFromCS(req.params.id || 0, (err, result) => {
//     if(err) {
//       res.status(404).send('Not found!');
//     } else {
//       res.send(result);
//     }
//   });
// });

//update
app.put('/sb/api/item/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  //find item at id, change the seller's name to the name in the req body
  db.changeProductAndSellerInfo(Number(id), body, (err, result) => {
    if(err) {
      res.status(404).send('Seller not found');
    } else {
      res.send(result);
    }
  });
});

//delete
app.delete('/sb/api/item/:id', (req, res) => {
  const id = req.params.id;
  //delete product and seller info at this id
  db.deleteProductAndSellerInfo(Number(id), (err) => {
    if (err) {
      res.status(404).send('Product not found');
    } else {
      res.end('Removed Product and Seller Info');
    }
  });
});

const port = process.env.SERVER_PORT || 3210;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
