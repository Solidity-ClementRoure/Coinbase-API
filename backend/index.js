const express = require("express")
const app = express()
const https = require('https');
require('dotenv').config()

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

/// POST ///




app.listen(4000, () => {
console.log("App is listening to port 4000")
});