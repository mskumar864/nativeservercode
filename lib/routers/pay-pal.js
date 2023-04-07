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
            username: 'ARNYaqo5_8MzGS0A37LE2od89B77jfLO92oj7u0CUtuzureZtLput9-d0iomIXeBxfNJEUcPYNQN8kA9',
            password: 'EMtcsjO8hmzs6l163MtFzsr5Bq4wCc1uF7zykbE9X36yPPKT5Jt0h5vnYO75XCJIH6JeM7n9ZxKRFKsN'
        }
    };
    return http.post('/v1/oauth2/token', body, config);
}

router.post('/access_tokens', async (req, res) => {
    try {
        const { data } = await fetchFullScopedAccessToken();
        res.status(201).send(data);
    } catch (e) {
        res.status(500).send({ internal: e });
    }
});

router.post('/orders', async (req, res) => {
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
        res.status(201).send(orderData);
    } catch (e) {
        res.status(500).send({ internal: e });
    }
});

router.post('/orders/:orderID/authorize', async (req, res) => {
    processOrder(req, res, "authorize");
});

router.post('/orders/:orderID/capture', async (req, res) => {
    processOrder(req, res, "capture");
});

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
