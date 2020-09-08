CREATE KEYSPACE sidebar WITH replication ={'class':'SimpleStrategy','replication_factor':3};

USE sidebar;

const createProductTable = `CREATE TABLE products (
    product_id int,
    productName text,
    condition text,
    shippingFee int,
    priceOriginal int,
    priceActual int,
    isOpenToOffers boolean,
    category text,
    style text,
    brand text,
    sellerName text,
    address text,
    isQuickShipper boolean,
    joinYear int,
    reviews int,
    PRIMARY KEY(product_id)
  );`

const loadProducts = `COPY products(product_id, productName, condition, shippingFee, priceOriginal, priceActual, isOpenToOffers, category, style, brand, sellerName, address, isQuickShipper, joinYear, reviews) FROM '/Users/hewbahrami/sidebar-service/database/productDataCS.csv' WITH DELIMITER=',' AND HEADER=TRUE;`


// \copy (SELECT p.product_id, p.productName, p.condition, p.shippingFee, p.priceOriginal, p.priceActual, p.isOpenToOffers, p.category, p.style, p.brand, s.sellerName, s.address, s.isQuickShipper, s.joinYear, s.reviews FROM products p INNER JOIN sellers s ON p.sellerID=s.seller_id) TO '/Users/hewbahrami/sidebar-service/database/productDataCS.csv' CSV HEADER;