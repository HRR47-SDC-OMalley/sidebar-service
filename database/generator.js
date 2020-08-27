const fs = require('fs');
const faker = require('faker');
// const generateProductAndSeller = require('./seeding.js');

const writeStream = fs.createWriteStream('./generateData.csv');

// let index = 1;
// const generateProductAndSeller = (index) => {
  const conditions = ['Mint', 'Near Mint', 'Damaged'];
  const trueOrFalse = [true, false];
  const guitarCategories = ['Acoustic', 'Bass', 'Electric'];
//   var productAndSellerArray = [];

//   for (var i = 1; i <= 100; i++) {
//     var product = {
//       name: faker.name.findName(),
//       condition: conditions[Math.floor(Math.random() * 3)],
//       shippingFee: Math.floor(Math.random() * 51) + 50, // range 50~100
//       priceOriginal: (Math.floor(Math.random() * 21) + 20) * 100, // range 2000~4000
//       isOpenToOffers: trueOrFalse[Math.floor(Math.random() * 2)],
//       category: guitarCategories[Math.floor(Math.random() * 3)],
//       style: `${faker.fake('{{commerce.productAdjective}}')} Guitar`,
//       brand: faker.fake('{{company.companyName}}')
//     };
//     // need to finish defining product before able to get that value
//     product.priceActual = Math.floor(product.priceOriginal * 0.008) * 100; // 20% off, trim

//     var seller = {
//       name: faker.name.findName(),
//       address: faker.address.streetAddress(),
//       isQuickShipper: trueOrFalse[Math.floor(Math.random() * 2)],
//       joinYear: Math.floor(Math.random() * 61) + 1960, // range 1960~2020
//       reviews: {
//         rating: Math.floor(Math.random() * 6) // range 0~5
//       }
//     };

//     productAndSellerArray.push({ id: index, product, seller });
//     index++;
//   }

//   return productAndSellerArray;
// };
const start = new Date();
// console.log(new Date())
// console.log('//////////////START////////////////')
function writeOneMillionTimes(writer, callback) {
  let i = 10000000;
  let id = 0;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      id++;
      const data = {};
      data.id = id;
      var product = {
        name: faker.name.findName(),
        condition: conditions[Math.floor(Math.random() * 3)],
        shippingFee: Math.floor(Math.random() * 51) + 50, // range 50~100
        priceOriginal: (Math.floor(Math.random() * 21) + 20) * 100, // range 2000~4000
        isOpenToOffers: trueOrFalse[Math.floor(Math.random() * 2)],
        category: guitarCategories[Math.floor(Math.random() * 3)],
        style: `${faker.fake('{{commerce.productAdjective}}')} Guitar`,
        brand: faker.fake('{{company.companyName}}')
      };
      // need to finish defining product before able to get that value
      product.priceActual = Math.floor(product.priceOriginal * 0.008) * 100; // 20% off, trim

      var seller = {
        name: faker.name.findName(),
        address: faker.address.streetAddress(),
        isQuickShipper: trueOrFalse[Math.floor(Math.random() * 2)],
        joinYear: Math.floor(Math.random() * 61) + 1960, // range 1960~2020
        reviews: {
          rating: Math.floor(Math.random() * 6) // range 0~5
        }
      };
      data.product = product;
      data.seller = seller;
      if (i === 0) {
        // Last time!
        writer.write(JSON.stringify(data), callback);
        const memoryUsage = process.memoryUsage();
        const end = new Date() - start;
        console.log('Execution time: %dms', end);
        console.log(memoryUsage);
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.
        ok = writer.write(JSON.stringify(data));
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Had to stop early!
      // Write some more once it drains.
      writer.once('drain', write);
    }
  }
}

writeOneMillionTimes(writeStream, (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('done')
  }
})


// const readFile = fs.readFile('./generateData.csv', 'utf8', (err, result) => {
//   console.log(result)

// });
