## Reburke

    A mock e-commerce page for buying and selling guitars.

# Sidebar Service

    A microservice detailing information about products and sellers.

Related Projects

    https://github.com/HRR47-FEC-Burke/main-photo
    https://github.com/HRR47-FEC-Burke/similar-listings-and-news
    https://github.com/HRR47-FEC-Burke/seller-reviews

Table of Contents

1. [Usage](#Usage)
2. [Requirements](#Requirements)
3. [Development](#Development)
4. [Production](#Production)

## Usage

Example URL: http://localhost:3210/item/1
Can input any number between 1 and 100 at the end of the url

## Requirements

Node.js v12.*
https://nodejs.org/

MongoDB v3.6.0
https://www.mongodb.com/

## Development

Execute all of the following commands from the repository's root directory.

### Install Dependencies

npm install

### Seeding

npm run seed

### CRUD API

All requests made to '/sb/api/item/:id'
Create: Post new item to the database. Request takes an object and a unused ID
Read: Get information for a single product and seller
Update: Update any product or seller information. Request takes an object and a valid ID
Delete: Delete information about a single product and seller

## Production

### Webpack

npm run build-production

### Start Server

npm run server-dev
