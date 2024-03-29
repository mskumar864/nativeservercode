const express = require('express');
const router = express.Router();
const axios = require('axios').default;

require('dotenv').config();
const { PAY_PAL_CLIENT_ID, PAY_PAL_CLIENT_SECRET } = process.env;


const http = axios.create({
    baseURL: 'https://api.sandbox.paypal.com'
});

async function fetchFullScopedAccessToken() {
    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        response_type: 'token',
        return_authn_schemes: true
    });
    const config = {
       auth: {
            /*
            username: 'ARNYaqo5_8MzGS0A37LE2od89B77jfLO92oj7u0CUtuzureZtLput9-d0iomIXeBxfNJEUcPYNQN8kA9',
            password: 'EMtcsjO8hmzs6l163MtFzsr5Bq4wCc1uF7zykbE9X36yPPKT5Jt0h5vnYO75XCJIH6JeM7n9ZxKRFKsN'
            */

            username: 'ARv7LRCiQRue7lqaHHyh4-bCbrvdAYnm44hN-ExL8CEc4dswywf5rA2sKE9uD90fjnlRAgcIBEXOKhvM',
            password: 'EKO1WKp5PnWbUn8-f4cEwoIZ15-FL9aSr29f8jilBgLf0BhKFApFZL-ALSiPGWCKIWCvKLs0YA8aYauv'
       },

       headers: {
       // 'PayPal-Auth-Assertion':'eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBUk5ZYXFvNV84TXpHUzBBMzdMRTJvZDg5Qjc3amZMTzkyb2o3dTBDVXR1enVyZVp0THB1dDktZDBpb21JWGVCeGZOSkVVY1BZTlFOOGtBOSIsInBheWVyX2lkIjoiM001U0ZIRDg3VUNOQSJ9.',
        'Content-Type': 'application/json',
        //'PayPal-Auth-Assertion':'eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBUk5ZYXFvNV84TXpHUzBBMzdMRTJvZDg5Qjc3amZMTzkyb2o3dTBDVXR1enVyZVp0THB1dDktZDBpb21JWGVCeGZOSkVVY1BZTlFOOGtBOSIsInBheWVyX2lkIjoiQ0tCNEozQjJGSktWSiJ9.'
       // 'PayPal-Auth-Assertion':'eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBU3BXalA0UTVmWVByQUdHb3lQbnlwMjNLVzk1b2VnM2JkSHdDeUpQNGd3ZzlFdk9oMkRnaDMwdUc1ajdDQnpPNDVMWDQ2RUNzS0hZRFJCeiIsInBheWVyX2lkIjoiUkU4WEtEQjc2TkNITCJ9.'
    }

    /*    auth: {
            username: 'ASpWjP4Q5fYPrAGGoyPnyp23KW95oeg3bdHwCyJP4gwg9EvOh2Dgh30uG5j7CBzO45LX46ECsKHYDRBz',
            password: 'EMcXfiK2k__n8dwqEyzcaZBYolmtPkWEXew0YYCgfmG13Vi9hxxmfbliI-KtLDPUmc2vsuhnVlqsMIid'
        }*/
        
    };
    return http.post('/v1/oauth2/token', body, config);
}

router.post('/access_tokens', async (req, res) => {

    console.log("Suresh"+"entering access_tokens");

    
    try {
        const { data } = await fetchFullScopedAccessToken();
        console.log("Suresh data"+"data");
        res.status(201).send(data);
    } catch (e) {
        res.status(500).send({ internal: e });
    }
    console.log("Suresh"+"Existing access_tokens");
});

router.post('/orders', async (req, res) => {

    console.log("Suresh"+"entering create order orders");
    console.log(req.body);

    const { data: tokenData } = await fetchFullScopedAccessToken();
    const { access_token: accessToken } = tokenData;
    console.log("Suresh data accessToken " +accessToken);
    
    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'paypal-request-id': `${Date.now()}`, //necessary header for one-shot-payments
            'PayPal-Partner-Attribution-Id':'USNATIVE_SB_SP',
          // 'PayPal-Auth-Assertion':'eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBUk5ZYXFvNV84TXpHUzBBMzdMRTJvZDg5Qjc3amZMTzkyb2o3dTBDVXR1enVyZVp0THB1dDktZDBpb21JWGVCeGZOSkVVY1BZTlFOOGtBOSIsInBheWVyX2lkIjoiM001U0ZIRDg3VUNOQSJ9.',
            'Content-Type': 'application/json',
            //'PayPal-Auth-Assertion':'eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBUk5ZYXFvNV84TXpHUzBBMzdMRTJvZDg5Qjc3amZMTzkyb2o3dTBDVXR1enVyZVp0THB1dDktZDBpb21JWGVCeGZOSkVVY1BZTlFOOGtBOSIsInBheWVyX2lkIjoiQ0tCNEozQjJGSktWSiJ9.'
           // 'PayPal-Auth-Assertion':'eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBU3BXalA0UTVmWVByQUdHb3lQbnlwMjNLVzk1b2VnM2JkSHdDeUpQNGd3ZzlFdk9oMkRnaDMwdUc1ajdDQnpPNDVMWDQ2RUNzS0hZRFJCeiIsInBheWVyX2lkIjoiUkU4WEtEQjc2TkNITCJ9.'
        }
    };
    try {
        const { data: orderData } = await http.post('/v2/checkout/orders', req.body, config);
        console.log("Suresh data" +orderData);
        console.log("Suresh"+"existing create order orders");
        res.status(201).send(orderData);
    } catch (e) {
        console.log("Suresh data error " +e);
        res.status(500).send({ internal: e });
    }
});

router.post('/ordersmerchant', async (req, res) => {

    console.log("Suresh ordersmerchant"+"entering create order");
    const { data: tokenData } = await fetchFullScopedAccessToken();
    const { access_token: accessToken } = tokenData;

    const { body } = req;
    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'paypal-request-id': `${Date.now()}` //necessary header for one-shot-payments
        }
    };
    try {
        const { data: orderData } = await http.post('/v2/checkout/orders', body, config);
        console.log("Suresh ordersmerchant"+"existing create order");
        res.status(201).send(orderData);
    } catch (e) {
        res.status(500).send({ internal: e });
    }
});

router.post('/orders/:orderID/authorize', async (req, res) => {
    processOrder(req, res, "authorize");
});

router.post('/authorize-order', async (req, res) => {
    processOrder1(req, res, "authorize");
});

router.post('/orders/:orderID/capture', async (req, res) => {
    processOrder(req, res, "capture");
});

router.post('/capture-order', async (req, res) => {
    processOrder1(req, res, "capture");
});


async function processOrder1(req, res, intent) {

   //console.log("Suresh"+"entering processOrder1 body "+req.body.toJSON()+ "req.params.order_id"+req.params.order_id);
     console.log(req.body);

     
    const { data: tokenData } = await fetchFullScopedAccessToken();
    const { access_token: accessToken } = tokenData;

    //const { access_token: accessToken } = 'A21AAIfHkndnyrtqsV-dSa2uvabJaZRuws8VqG9Mj6c8xdxwyYXrohtNF4EykTgwTcBcOKuWTShmzcd3oHh6QHywBaoZoJh9w'

    const { body } = {};
    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Partner-Attribution-Id':'USNATIVE_SB_SP',
           // 'PayPal-Auth-Assertion':'eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBUk5ZYXFvNV84TXpHUzBBMzdMRTJvZDg5Qjc3amZMTzkyb2o3dTBDVXR1enVyZVp0THB1dDktZDBpb21JWGVCeGZOSkVVY1BZTlFOOGtBOSIsInBheWVyX2lkIjoiQ0tCNEozQjJGSktWSiJ9.'
         //  'PayPal-Auth-Assertion':'eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBUk5ZYXFvNV84TXpHUzBBMzdMRTJvZDg5Qjc3amZMTzkyb2o3dTBDVXR1enVyZVp0THB1dDktZDBpb21JWGVCeGZOSkVVY1BZTlFOOGtBOSIsInBheWVyX2lkIjoiM001U0ZIRDg3VUNOQSJ9.'
         
        
        }
    };

    try {
        const { data } = await http.post(`/v2/checkout/orders/${req.body.order_id}/${intent}`, body, config);
        console.log("Suresh"+"existing processOrder1 ");
        res.status(201).send(data);
    } catch (e) { 
        console.log("exist with error processOrder1"+e.toString()) 
        res.status(500).send({ internal: e });
    }

    console.log("Suresh existing the function processOrder1 ");
}



async function processOrder(req, res, intent) {
    const { data: tokenData } = await fetchFullScopedAccessToken();
    const { access_token: accessToken } = tokenData;

    const { body } = req;
    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const { data } = await http.post(`/v2/checkout/orders/${req.params.orderID}/${intent}`, body, config);
        res.status(201).send(data);
    } catch (e) {
        res.status(500).send({ internal: e });
    }
}

module.exports = router;
