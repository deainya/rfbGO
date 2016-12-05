# RFB-GO app

## General info
App is built using MEAN stack
* MongoDB
* Express
* Angular
* Node

## Developing
* `npm install` to resolve dependencies
* `npm install gulp` to install Gulp
* `npm run watch` to start transpile watch
* `node server/app.js` to run app on server side

## Seeding MongoDB
* `mongoimport -u user -p pass --db rfbgo-dev --collection actions --type json --file server/seeds/a-seed.json --jsonArray --drop`
* `mongoimport -u user -p pass --db rfbgo-dev --collection orders --type json --file server/seeds/o-seed.json --jsonArray --drop`
* `mongoimport -u user -p pass --db rfbgo-dev --collection tradepoints --type json --file server/seeds/t-seed.json --jsonArray --drop`
* `mongoimport -u user -p pass --db rfbgo-dev --collection users --type json --file server/seeds/u-seed.json --jsonArray --drop`

## To Do & Done
* Client side
 - [x] Angular module
 - [x] bundle.js
 - [x] index.html file
 - [x] Routing
 - [x] Simple styling
* Server side
 - [ ] Authorization
 - [x] Basic routing
 - [x] Connection to MongoDB
