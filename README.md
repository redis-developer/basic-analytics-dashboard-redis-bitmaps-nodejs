# Redis Analytics Bitmaps demo

Showcases how to implement analytics system using Redis Bitmaps (and other data types) in NodeJS

<a href="https://github.com/RemoteCraftsmen/redis-analytics-bitmaps/blob/main/preview.png?raw=true"><img src="https://github.com/RemoteCraftsmen/redis-analytics-bitmaps/blob/main/preview-min.png?raw=true" width="100%" height="auto"></a>
<a href="https://github.com/RemoteCraftsmen/redis-analytics-bitmaps/blob/main/preview-2.png?raw=true"><img src="https://github.com/RemoteCraftsmen/redis-analytics-bitmaps/blob/main/preview-2-min.png?raw=true" width="50%" height="auto"></a><a href="https://github.com/RemoteCraftsmen/redis-analytics-bitmaps/blob/main/preview-3.png?raw=true"><img src="https://github.com/RemoteCraftsmen/redis-analytics-bitmaps/blob/main/preview-3-min.png?raw=true" width="50%" height="auto"></a>


## How it works
### How the data is stored:

* The event data is stored in various keys and various data types.
    * For each of time spans:
        * year: like 2021
        * month: like 2021-03 (means March of 2021)
        * day: like 2021-03-03 (means 3rd March of 2021)
        * weekOfMonth: like 2021-03/4 (means 4th week of March 2021)
        * anytime
        
    * and for each of scopes:
        * source
        * action
        * source + action
        * action + page
        * userId + action
        * global
        
    * and for each of data types (types):
        * count (Integer stored as String)
        * bitmap
        * set
        
Is generated key like: `rab:{type}[:custom:{customName}][:user:{userId}][:source:{source}][:action:{action}][:page:{page}]:timeSpan:{timeSpan}`, where values in `[]` are optional.
* For each generated key like `rab:count:*`, data is stored like: `INCR {key}`
    * E.g `INCR rab:count:action:addToCart:timeSpan:2015-12/3`
* For each generated key like: `rab:set:*`, data is stored like: `SADD {key} {userId}`
    * E.g `SADD rab:set:action:addToCart:timeSpan:2015-12/3 8`
* For each generated key like `rab:bitmap:*`, data is stored like: `SETBIT {key} {userId} 1`.
    * E.g `SETBIT rab:bitmap:action:addToCart:timeSpan:2015-12/3 8 1`
* Cohort data:
    * We store users who register and then bought some products (action order matters).
    * For each buy action in December we check if user performed register action before (register counter must be greater than zero).
    * If so, we set user bit to 1 like: `SETBIT rab:bitmap:custom:cohort-buy:timeSpan:{timeSpan} {userId} 1`
    * E.g User Id 2 bought 2 products on 2015-12-17. He won't be stored.
    * E.g User Id 10 bought 1 product on 2015-12-17 and registered on 2015-12-16. He will be stored like: `SETBIT rab:bitmap:custom:cohort-buy:timeSpan:2015-12 10 1`.
    * We assume that user cannot buy without register.
* Retention data:
    * Retention means users who bought on two different dates
    * For each buy action we check if user bought more products anytime than bought on particular day (current purchase not included).
    * If so, we add user id to set like: `SADD rab:set:custom:retention-buy:timeSpan:{timeSpan} {userId}`
    * E.g User Id 5 bought 3 products on 2015-12-15. His retention won't be stored (products bought on particular day: 2, products bought anytime: 0).
    * E.g User Id 3 bought 1 product on 2015-12-15 and before - 1 product on 2015-12-13. His retention will be stored (products bought on particular day: 0, products bought anytime: 1) like: `SADD rab:set:custom:retention-buy:timeSpan:2015-12 3`.

### How the data is accessed:

* Total Traffic: 
    * December: `BITCOUNT rab:bitmap:custom:global:timeSpan:2015-12`
    * X week of December: `BITCOUNT rab:bitmap:custom:global:timeSpan:2015-12/{X}`
        * E.g `BITCOUNT rab:bitmap:custom:global:timeSpan:2015-12/3`

* Traffic per Page ({page} is one of: homepage, product1, product2, product3):
    * December: `BITCOUNT rab:bitmap:action:visit:page:{page}:timeSpan:2015-12`
        * E.g `BITCOUNT rab:bitmap:action:visit:page:homepage:timeSpan:2015-12`
    * X week of December: `BITCOUNT rab:bitmap:action:visit:page:{page}:timeSpan:2015-12/{X}`
        * E.g `BITCOUNT rab:bitmap:action:visit:page:product1:timeSpan:2015-12/2`

* Traffic per Source ({source} is one of: google, Facebook, email, direct, referral, none):
    * December: `BITCOUNT rab:bitmap:source:{source}:timeSpan:2015-12`
        * E.g `BITCOUNT rab:bitmap:source:referral:timeSpan:2015-12`
    * X week of December: `BITCOUNT rab:bitmap:source:{source}:timeSpan:2015-12/{X}`
        * E.g `BITCOUNT rab:bitmap:source:google:timeSpan:2015-12/1`

* Trend traffic ({page} is one of: homepage, product1, product2, product3):
    * December: from `BITCOUNT rab:bitmap:action:visit:{page}:timeSpan:2015-12-01` to `BITCOUNT rab:bitmap:action:visit:{page}:timeSpan:2015-12-31`
    * 1 Week of December: Similar as above, but from 2015-12-01 to 2015-12-07
    * 2 Week of December: Similar as above, but from 2015-12-08 to 2015-12-14
    * 3 Week of December: Similar as above, but from 2015-12-15 to 2015-12-21
    * 4 Week of December: Similar as above, but from 2015-12-22 to 2015-12-28
    * 5 Week of December: Similar as above, but from 2015-12-29 to 2015-12-31
        * E.g `BITCOUNT rab:bitmap:action:visit:homepage:timeSpan:2015-12-29` => `BITCOUNT rab:bitmap:action:visit:homepage:timeSpan:2015-12-30` => `BITCOUNT rab:bitmap:action:visit:homepage:timeSpan:2015-12-31`

* Total products bought:
    * December: `GET rab:count:action:buy:timeSpan:2015-12`
    * X week of December: `GET rab:count:action:buy:timeSpan:2015-12/{X}`
        * E.g `GET rab:count:action:buy:timeSpan:2015-12/1`

* Total products added to cart:
    * December: `GET rab:count:action:addToCart:timeSpan:2015-12`
    * X week of December: `GET rab:count:action:addToCart:timeSpan:2015-12/{X}`
        * E.g `GET rab:count:action:addToCart:timeSpan:2015-12/1`

* Shares of products bought ({productPage} is on of product1, product2, product3):
    * December: `GET rab:count:action:buy:page:{productPage}:timeSpan:2015-12`
        * E.g `GET rab:count:action:buy:page:product3:timeSpan:2015-12`
    * X week of December: `GET rab:count:action:buy:page:{productPage}:timeSpan:2015-12/{X}`
        * E.g `GET rab:count:action:buy:page:product1:timeSpan:2015-12/2`

* Customer and Cohort Analysis:
    * People who registered: `BITCOUNT rab:bitmap:action:register:timeSpan:2015-12`
    * People who register then bought (order matters): `BITCOUNT rab:bitmap:custom:cohort-buy:timeSpan:2015-12`
    * Dropoff: (People who register then bought / People who register) * 100 [%]

* Customers who bought only specified product ({productPage} is one of: product1, product2, product3): `SMEMBERS rab:set:action:buy:page:{productPage}:timeSpan:2015-12`
    * E.g `SMEMBERS rab:set:action:buy:page:product2:timeSpan:2015-12`
* Customers who bought Product1 and Product2: `SINTER rab:set:action:buy:page:product1:timeSpan:anytime rab:set:action:buy:page:product2:timeSpan:anytime`
* Customer Retention (customers who bought on the different dates): `SMEMBERS rab:set:custom:retention-buy:timeSpan:anytime`

## Hot to run it locally?

### Prerequisites

- Node - v12.19.0
- NPM - v6.14.8
- Docker - v19.03.13 (optional)

### Local installation

Go to `/server` folder and then:

```
# copy file and set proper data inside
cp .env.example .env

# install dependencies
npm cache clean && npm install

# run docker compose or install redis manually
docker network create global
docker-compose up -d --build

# Run dev server
npm run dev
```

Go to `/client` folder and then:

```
# copy file and set proper data inside
cp .env.example .env

# install dependencies
npm cache clean && npm install

# run development mode
npm run serve
```

## Deployment

To make deploys work, you need to create free account in https://redislabs.com/try-free/

### Google Cloud Run

[![Run on Google
Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run/?git_repo=https://github.com/RemoteCraftsmen/redis-analytics-bitmaps.git&revision=feature/deploy-buttons)

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FRemoteCraftsmen%2Fredis-analytics-bitmaps&env=REDIS_ENDPOINT_URI,REDIS_PASSWORD)
