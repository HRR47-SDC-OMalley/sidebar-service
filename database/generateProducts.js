const fs = require('fs');
const csvWriter = require('csv-write-stream');
const faker = require('faker');

const products = csvWriter({
  headers: [
    "id",
    "name",
    "condition",
    "shippingFee",
    "priceOriginal",
    "priceActual",
    "isOpenToOffers",
    "category",
    "style",
    "brand",
    "sellerID"

  ]
});

const sellers = csvWriter({
  headers: [
    "id",
    "name",
    "address",
    "isQuickShipper",
    "joinYear",
    "reviews",
  ]
});


const writeTenMillionProducts = () => {
  const start = new Date();
  const conditions = ['Mint', 'Near Mint', 'Damaged'];
  const trueOrFalse = [true, false];
  const guitarCategories = ['Acoustic', 'Bass', 'Electric'];
  const priceOriginal = (Math.floor(Math.random() * 21) + 20) * 100;
  let sellerID = 0;
  products.pipe(fs.createWriteStream('productData.csv'));
  sellers.pipe(fs.createWriteStream('sellerData.csv'));
  for (let i = 0; i < 10000000; i++) {
    if (i === 0 || i % Math.floor(Math.random() * 10) === 0) {
      sellerID = i;
      sellers.write([
        i, faker.name.findName(), faker.address.streetAddress(), trueOrFalse[Math.floor(Math.random() * 2)], Math.floor(Math.random() * 61) + 1960, Math.floor(Math.random() * 6)
      ])
    }
    products.write([
      i, faker.name.findName(), conditions[Math.floor(Math.random() * 3)], Math.floor(Math.random() * 51) + 50, priceOriginal, Math.floor(priceOriginal * 0.008) * 100, trueOrFalse[Math.floor(Math.random() * 2)], guitarCategories[Math.floor(Math.random() * 3)], `${faker.fake('{{commerce.productAdjective}}')} Guitar`, faker.fake('{{company.companyName}}'), sellerID
    ])
  }
  sellers.end();
  products.end();
  const end = new Date() - start;
  const memoryUsage = process.memoryUsage();
  console.log('Execution time: %dms', end);
  console.log(memoryUsage);
  console.log('Finished generating product data');
}

writeTenMillionProducts();