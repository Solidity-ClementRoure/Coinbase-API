const express = require("express")
const app = express()
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

    const url = 'https://api.pro.coinbase.com/currencies'

    fetch(url)
    .then(res => res.json())
    .then(out =>
        console.log('Checkout this JSON! ', out))
        res.status(201).json({
            result: "OK"
        })
    .catch(err => { throw err });
})

/// POST ///




app.listen(4000, () => {
console.log("App is listening to port 4000")
});