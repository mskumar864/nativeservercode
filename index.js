
const express = require('express');
const app = express();
const paypalRoutes = require('./lib/routers/pay-pal');
const braintreeRoutes = require('./lib/routers/braintree');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// parse HTTP application/json request bodies into JS objects
app.use(express.json());

app.use('/', paypalRoutes)
app.use('/braintree', braintreeRoutes)

const { PORT = 8080 } = process.env;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
