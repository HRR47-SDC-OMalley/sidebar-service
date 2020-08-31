const fs = require('fs');
const faker = require('faker');
// const generateProductAndSeller = require('./seeding.js');

const writeStream = fs.createWriteStream('./generateProducts.csv');

function writeTenMillionTimes(writer, encoding, callback) {
  const start = new Date();
  const conditions = ['Mint', 'Near Mint', 'Damaged'];
  const trueOrFalse = [true, false];
  const guitarCategories = ['Acoustic', 'Bass', 'Electric'];
  let i = 10000000;
  let id = 0;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      id++;
      const priceOriginal = (Math.floor(Math.random() * 21) + 20) * 100;
      const product = `${id}, ${faker.name.findName()}, ${conditions[Math.floor(Math.random() * 3)]}, ${Math.floor(Math.random() * 51) + 50}, ${priceOriginal}, ${trueOrFalse[Math.floor(Math.random() * 2)]}, ${guitarCategories[Math.floor(Math.random() * 3)]}, ${faker.fake('{{commerce.productAdjective}}')} Guitar, ${faker.fake('{{company.companyName}}')}, ${Math.floor(priceOriginal * 0.008) * 100}\n`;

      if (i === 0) {
        // Last time!
        writer.write(product, encoding, callback);
        const memoryUsage = process.memoryUsage();
        const end = new Date() - start;
        console.log('Execution time: %dms', end);
        console.log(memoryUsage);
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.
        ok = writer.write(product, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Had to stop early!
      // Write some more once it drains.
      writer.once('drain', write);
    }
  }
}

writeTenMillionTimes(writeStream, 'utf-8', (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('done');
  }
});



// if (id % Math.floor(Math.random() * 5) === 0) {
//   seller = {
//     name: faker.name.findName(),
//     address: faker.address.streetAddress(),
//     isQuickShipper: trueOrFalse[Math.floor(Math.random() * 2)],
//     joinYear: Math.floor(Math.random() * 61) + 1960, // range 1960~2020
//     reviews: {
//       rating: Math.floor(Math.random() * 6) // range 0~5
//     }
//   };
// }