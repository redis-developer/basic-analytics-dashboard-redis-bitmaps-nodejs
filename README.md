# Redis Analytics Bitmaps demo

Showcases how to implement analytics system using Redis Bitmaps (and other data types) in NodeJS

![alt text](https://github.com/redis-developer/basic-analytics-dashboard-redis-bitmaps-nodejs/blob/main/preview.png?raw=true)

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
        
Is generated key like: `{prefix}:{type}[:custom:{customName}][:user:{userId}][:source:{source}][:action:{action}][:page:{page}]:timeSpan:{timeSpan}`, where values in `[]` are optional.
* For each generated key like `{prefix}:count:*`, data is stored like: `INCR {key}`
* For each generated key like: `{prefix}:set:*`, data is stored like: `SADD {key} {userId}`
* For each generated key like `{prefix}:bitmap:*`, data is stored like: `SETBIT {key} {userId} 1`.
* Retention data is stored like: `SADD {prefix}:set:custom:retention-buy:timeSpan:{timeSpan} {userId}`
* Cohort data is stored like: `SETBIT {prefix}:bitmap:custom:cohort-buy:timeSpan:{timeSpan} userId 1`

### How the data is accessed:

* Total Traffic: 
    * December: `BITCOUNT {prefix}:bitmap:custom:global:timeSpan:2015-12`
    * X week of December: `BITCOUNT {prefix}:bitmap:custom:global:timeSpan:2015-12/{X}`

* Traffic per Page ({page} is one of: homepage, product1, product2, product3):
    * December: `BITCOUNT {prefix}:bitmap:action:visit:page:{page}:timeSpan:2015-12`
    * X week of December: `BITCOUNT {prefix}:bitmap:action:visit:page:{page}:timeSpan:2015-12/{X}`

* Traffic per Source ({source} is one of: google, Facebook, email, direct, referral, none):
    * December: `BITCOUNT {prefix}:bitmap:source:{source}:timeSpan:2015-12`
    * X week of December: `BITCOUNT {prefix}:bitmap:source:{source}:timeSpan:2015-12/{X}`

* Trend traffic ({page} is one of: homepage, product1, product2, product3):
    * December: `BITCOUNT {prefix}:bitmap:action:visit:{page}:timeSpan:2015-12-01` ... `BITCOUNT {prefix}:bitmap:action:visit:{page}:timeSpan:2015-12-31`
    * 1 Week of December: Similar as above, but: 2015-12-01 ... 2015-12-07
    * 2 Week of December: Similar as above, but: 2015-12-08 ... 2015-12-14
    * 3 Week of December: Similar as above, but: 2015-12-15 ... 2015-12-21
    * 4 Week of December: Similar as above, but: 2015-12-22 ... 2015-12-28
    * 5 Week of December: Similar as above, but: 2015-12-29 ... 2015-12-31

* Total products bought:
    * December: `GET {prefix}:count:action:buy:timeSpan:2015-12
    * X week of December: `GET {prefix}:count:action:buy:timeSpan:2015-12/{X}`

* Total products added to cart:
    * December: `GET {prefix}:count:action:addToCart:timeSpan:2015-12
    * X week of December: `GET {prefix}:count:action:addToCart:timeSpan:2015-12/{X}`

* Shares of products bought ({productPage} is on of product1, product2, product3):
    * December: `GET {prefix}:count:action:buy:page:{productPage}:timeSpan:2015-12`
    * X week of December: `GET {prefix}:count:action:buy:page:{productPage}:timeSpan:2015-12/{X}`

* Customer and Cohort Analysis:
    * People who registered: `BITCOUNT {prefix}:bitmap:action:register:timeSpan:2015-12`
    * People who register then bought (order matters): `BITCOUNT {prefix}:bitmap:custom:cohort-buy:timeSpan:2015-12`
    * Dropoff: (People who register then bought / People who register) * 100 [%]

* Customers who bought only specified product ({productPage} is one of: product1, product2, product3): `SMEMBERS {prefix}:set:action:buy:page:{productPage}:timeSpan:2015-12`
* Customers who bought Product1 and Product2: `SINTER {prefix}:set:action:buy:page:product1:timeSpan:2015-12 {prefix}:set:action:buy:page:product2:timeSpan:2015-12`
* Customer Retention (customers who bought on the different dates): `SMEMBERS {prefix}:set:custom:retention-buy:timeSpan:2015-12`

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
Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run/?git_repo=https://github.com/redis-developer/basic-analytics-dashboard-redis-bitmaps-nodejs.git&revision=feature/deploy-buttons)

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fredis-developer%2Fbasic-analytics-dashboard-redis-bitmaps-nodejs&env=REDIS_ENDPOINT_URI,REDIS_PASSWORD)
