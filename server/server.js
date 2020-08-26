const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/database.js');

const app = express();

app.use('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('*/bundle.js', (req, res) => {
  res.redirect('https://hrr47-fec-sidebar.s3.ap-northeast-2.amazonaws.com/js/bundle.js');
});

app.use(express.static(`${__dirname}/../public`));
app.use('/item/:id', express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

//create
app.post('/sb/api/item/:id', (req, res) => {

});

//read
app.get('/sb/api/item/:id', (req, res) => {
  // get the id of request product
  // const idIndex = req.url.indexOf('item') + 5;
  // const id = req.url.substr(idIndex);
  const id = req.params.id;
  // look for the first data in the list if no id is passed in
  db.getAllProductAndSellerInfo(Number(id) || 0, (err, result) => {
    if (err) {
      res.status(404).send('Not found!');
    } else {
      res.send(result);
    }
  });
});

//update
app.put('/sb/api/item/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  //find item at id, change the seller's name to the name in the req body
  db.changeProductAndSellerInfo(Number(id), name, (err, result) => {
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

const port = 3210;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
