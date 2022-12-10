const express = require("express")
const app = express()
const https = require('https');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
var crypto = require('crypto');
// https://www.sqlitetutorial.net/sqlite-nodejs
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS candles (id INTEGER PRIMARY KEY, date INT NOT NULL,high REAL NOT NULL,low REAL NOT NULL, open REAL NOT NULL, close REAL NOT NULL);");
  db.run("CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, tarded_crypto REAL NOT NULL,price REAL NOT NULL, created_at_int INT NOT NULL, side TEXT NOT NULL);");
  db.run("CREATE TABLE IF NOT EXISTS updates (id INTEGER PRIMARY KEY, exchange TEXT NOT NULL, trading_pair TEXT NOT NULL, duration TEXT NOT NULL, table_name TEXT NOT NULL, last_check INT NOT NULL, startdate INT NOT NULL, last_id INT NOT NULL);");
});
db.close();

// CORS Policy
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Credentials', '*');
    next();
  });

/// GET ///

app.get('/crypto_list',(req,res) => {

  var options = {
    host: 'api.pro.coinbase.com',
    path: '/currencies',
    method: 'GET',
    headers: { 'User-Agent': 'agent' }
  };

  https.request(options, function(response) {
      response.pipe(res);
    }).on('error', function(e) {
      res.sendStatus(500);
    })
    .end();
})

// https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductbook-1

app.get('/getDepth/:pair',(req,res) => {

  var options = {
    host: 'api.pro.coinbase.com',
    path: `/products/${req.params.pair}/book?level=1`,
    method: 'GET',
    headers: { 'User-Agent': 'agent' }
  };

  https.request(options, function(response) {
      response.pipe(res);
    }).on('error', function(e) {
      res.sendStatus(500);
    })
    .end();
})

app.get('/getOrderBook/:pair',(req,res) => {

  var options = {
    host: 'api.pro.coinbase.com',
    path: `/products/${req.params.pair}/book?level=2`,
    method: 'GET',
    headers: { 'User-Agent': 'agent' }
  };

  https.request(options, function(response) {
      response.pipe(res);
    }).on('error', function(e) {
      res.sendStatus(500);
    })
    .end();
})

// https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductcandles-1

app.get('/refreshDataCandle/:pair/:granularity',(req,res) => {

  var options = {
    host: 'api.pro.coinbase.com',
    path: `/products/${req.params.pair}/candles?granularity=${req.params.granularity}`,
    method: 'GET',
    headers: { 'User-Agent': 'agent' }
  };

  https.request(options, function(response) {
      response.pipe(res);
    }).on('error', function(e) {
      res.sendStatus(500);
    })
    .end();
})

app.get('/getCurrentPrice/:pair',(req,res) => {

  var options = {
    host: 'api.pro.coinbase.com',
    path: `/products/${req.params.pair}/ticker`,
    method: 'GET',
    headers: { 'User-Agent': 'agent' },
  };

  https.request(options, function(response) {
      response.pipe(res);
    }).on('error', function(e) {
      res.sendStatus(500);
    })
    .end();
})

/// POST ///

app.post('/createOrder',(req,res) => {

  const cb_access_passphrase = process.env.COINBASE_API_PASSPHRASE;
  const cb_access_key = process.env.COINBASE_API_KEY;
  const cb_access_timestamp = Date.now() / 1000;

  const portofolio_id = process.env.COINBASE_PORTOFOLIO_ID;
  const secret = process.env.COINBASE_API_SECRET;

  const client_order_id = "";

  const generateSignature = () => {

    // create the json request object
    var requestPath = '/orders';
    var body = JSON.stringify({
        price: '1.0',
        size: '1.0',
        side: 'buy',
        product_id: 'BTC-USD'
    });
    var method = 'POST';

    // create the prehash string by concatenating required parts
    var message = cb_access_timestamp + method + requestPath + body;

    // decode the base64 secret
    var key = Buffer.from(secret, 'base64');

    // create a sha256 hmac with the secret
    var hmac = crypto.createHmac('sha256', key);

    // sign the require message with the hmac and base64 encode the result
    var cb_access_sign = hmac.update(message).digest('base64');

    return cb_access_sign;
  }

  const cb_access_signature = generateSignature();

  var options = {
    host: 'api.prime.coinbase.com',
    path: `/v1/portfolios/${portofolio_id}}/order`,
    method: 'POST',
    headers: { 
      'User-Agent': 'agent',
      'X-CB-ACCESS-KEY': cb_access_key,
      'X-CB-ACCESS-PASSPHRASE': cb_access_passphrase,
      'X-CB-ACCESS-SIGNATURE': cb_access_signature,
      'X-CB-ACCESS-TIMESTAMP': cb_access_timestamp,
      'content-type': 'application/json' 
    },
    body: JSON.stringify({
      side: 'BUY', 
      type: 'MARKET', 
      time_in_force: 'GOOD_UNTIL_CANCELLED',
      portfolio_id: portofolio_id,
      product_id: "BTC-USD",
      client_order_id: client_order_id,
    })
  };

  https.request(options, function(response) {
      response.pipe(res);
    }).on('error', function(e) {
      res.sendStatus(500);
    })
    .end();
})


app.post('/cancelOrder',(req,res) => {

  const cb_access_passphrase = process.env.COINBASE_API_PASSPHRASE;
  const cb_access_key = process.env.COINBASE_API_KEY;
  const cb_access_timestamp = Date.now() / 1000;

  const portofolio_id = process.env.COINBASE_PORTOFOLIO_ID;
  const secret = process.env.COINBASE_API_SECRET;

  const order_id = "";

  const generateSignature = () => {

    // create the json request object
    var requestPath = '/orders';
    var body = JSON.stringify({
        price: '1.0',
        size: '1.0',
        side: 'buy',
        product_id: 'BTC-USD'
    });
    var method = 'POST';

    // create the prehash string by concatenating required parts
    var message = cb_access_timestamp + method + requestPath + body;

    // decode the base64 secret
    var key = Buffer.from(secret, 'base64');

    // create a sha256 hmac with the secret
    var hmac = crypto.createHmac('sha256', key);

    // sign the require message with the hmac and base64 encode the result
    var cb_access_sign = hmac.update(message).digest('base64');

    return cb_access_sign;
  }

  const cb_access_signature = generateSignature();

  var options = {
    host: 'api.prime.coinbase.com',
    path: `/v1/portfolios/${portofolio_id}/orders/${order_id}/cancel`,
    method: 'POST',
    headers: { 
      'User-Agent': 'agent',
      'X-CB-ACCESS-KEY': cb_access_key,
      'X-CB-ACCESS-PASSPHRASE': cb_access_passphrase,
      'X-CB-ACCESS-SIGNATURE': cb_access_signature,
      'X-CB-ACCESS-TIMESTAMP': cb_access_timestamp,
      'content-type': 'application/json' 
    },
  };

  https.request(options, function(response) {
      response.pipe(res);
    }).on('error', function(e) {
      res.sendStatus(500);
    })
    .end();
})

// https://pro.coinbase.com/profile/api
// https://docs.cloud.coinbase.com/exchange/docs/authorization-and-authentication#signing-a-message

app.listen(4000, () => {
console.log("App is listening to port 4000")
});