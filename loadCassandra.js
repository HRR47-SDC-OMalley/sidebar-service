CREATE KEYSPACE sidebar WITH replication = {'class': 'SimpleStrategy', 'replication-factor': 3};

USE sidebar;

CREATE TABLE sellers (
    seller_id int,
    name text,
    address text,
    isQuickShipper boolean,
    joinYear int,
    reviews int,
    PRIMARY KEY(seller_id)
  );

CREATE TABLE products (
    product_id int,
    name text,
    condition text,
    shippingFee int,
    priceOriginal int,
    priceActual int,
    isOpenToOffers boolean,
    category text,
    style text,
    brand text,
    seller_id int,
    PRIMARY KEY(product_id, seller_id)
  );

COPY sellers (seller_id, name, address, isQuickShipper, joinYear, reviews) FROM '/Users/hewbahrami/sidebar-service/database/sellerData.csv' WITH DELIMITER=',' AND HEADER=TRUE;

COPY products(product_id, name, condition, shippingFee, priceOriginal, priceActual, isOpenToOffers, category, style, brand, seller_id) FROM '/Users/hewbahrami/sidebar-service/database/productData.csv' WITH DELIMITER=',' AND HEADER=TRUE;