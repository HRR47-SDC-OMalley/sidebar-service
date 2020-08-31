const fs = require('fs');
const faker = require('faker');
const writeProductStream = fs.createWriteStream('./generateProducts.csv');
const writeSellersStream = fs.createWriteStream('./generateSellers.csv');

const conditions = ['Mint', 'Near Mint', 'Damaged'];
const trueOrFalse = [true, false];
const guitarCategories = ['Acoustic', 'Bass', 'Electric'];

let seller = '';
let sellerID = 0;

function writeTenMillionTimes(writer, otherwriter, callback) {
  const start = new Date();
  let i = 10000000;
  let id = 0;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      id++;
      if (id === 0 || id % Math.floor(Math.random() * 10) === 0) {
        sellerID = id;
        seller = `${id}, ${faker.name.findName()}, ${faker.address.streetAddress()}, ${trueOrFalse[Math.floor(Math.random() * 2)]}, ${Math.floor(Math.random() * 61) + 1960}, ${Math.floor(Math.random() * 6)}\n`
      }

      const priceOriginal = (Math.floor(Math.random() * 21) + 20) * 100;
      const product = `${id}, ${faker.name.findName()}, ${conditions[Math.floor(Math.random() * 3)]}, ${Math.floor(Math.random() * 51) + 50}, ${priceOriginal}, ${trueOrFalse[Math.floor(Math.random() * 2)]}, ${guitarCategories[Math.floor(Math.random() * 3)]}, ${faker.fake('{{commerce.productAdjective}}')} Guitar, ${faker.fake('{{company.companyName}}')}, ${Math.floor(priceOriginal * 0.008) * 100}, ${sellerID}\n`;

      if (i === 0) {
        writeSellersStream.write(seller);
        writeProductStream.write(product, callback);
        const memoryUsage = process.memoryUsage();
        const end = new Date() - start;
        console.log('Execution time: %dms', end);
        console.log(memoryUsage);
      } else {
        writeSellersStream.write(seller);
        ok = writeProductStream.write(product);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writeSellersStream.once('drain', write);
      writeProductStream.once('drain', write);
    }
  }
}

writeTenMillionTimes(writeProductStream, writeSellersStream, (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('done')
  }
})