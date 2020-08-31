const faker = require('faker');
const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

const generateProductAndSeller = () => {
  const conditions = ['Mint', 'Near Mint', 'Damaged'];
  const trueOrFalse = [true, false];
  const guitarCategories = ['Acoustic', 'Bass', 'Electric'];
  var productAndSellerArray = [];
  var seller = {
    id: 1,
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    isQuickShipper: trueOrFalse[Math.floor(Math.random() * 2)],
    joinYear: Math.floor(Math.random() * 61) + 1960, // range 1960~2020
    reviews: {
      rating: Math.floor(Math.random() * 6) // range 0~5
    }
  };

  for (var i = 1; i <= 100; i++) {
    if (i % Math.floor(Math.random() * 5) === 0) {
      seller = {
        id: i,
        name: faker.name.findName(),
        address: faker.address.streetAddress(),
        isQuickShipper: trueOrFalse[Math.floor(Math.random() * 2)],
        joinYear: Math.floor(Math.random() * 61) + 1960, // range 1960~2020
        reviews: {
          rating: Math.floor(Math.random() * 6) // range 0~5
        }
      };
    }
      var product = {
        name: faker.name.findName(),
        condition: conditions[Math.floor(Math.random() * 3)],
        shippingFee: Math.floor(Math.random() * 51) + 50, // range 50~100
        priceOriginal: (Math.floor(Math.random() * 21) + 20) * 100, // range 2000~4000
        isOpenToOffers: trueOrFalse[Math.floor(Math.random() * 2)],
        category: guitarCategories[Math.floor(Math.random() * 3)],
        style: `${faker.fake('{{commerce.productAdjective}}')} Guitar`,
        brand: faker.fake('{{company.companyName}}'),
        seller: seller,
    };
    // need to finish defining product before able to get that value
    product.priceActual = Math.floor(product.priceOriginal * 0.008) * 100; // 20% off, trim
    // var seller = {
    //   name: faker.name.findName(),
    //   address: faker.address.streetAddress(),
    //   isQuickShipper: trueOrFalse[Math.floor(Math.random() * 2)],
    //   joinYear: Math.floor(Math.random() * 61) + 1960, // range 1960~2020
    //   reviews: {
    //     rating: Math.floor(Math.random() * 6) // range 0~5
    //   }
    // };

    // productAndSellerArray.push({ id: i, product, seller });
    productAndSellerArray.push({ id: i, product });
  }

  return productAndSellerArray;
};

mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    throw err;
  } else {
    const db = client.db('reburke');
    // clear the database
    db.collection('reburke').deleteMany({});

    // create a list of 100 randomly generated data
    var list = generateProductAndSeller();
    // insert the randam data into the database
    db.collection('reburke').insertMany(list, (error) => {
      if (error) {
        throw error;
      } else {
        client.close();
      }
    });
  }
});

module.exports = generateProductAndSeller;
