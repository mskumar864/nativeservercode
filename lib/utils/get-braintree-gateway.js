
const braintree = require('braintree');

require('dotenv').config();
const {
    BRAINTREE_SANDBOX_MERCHANT_ID,
    BRAINTREE_SANDBOX_PUBLIC_KEY,
    BRAINTREE_SANDBOX_PRIVATE_KEY,
    BRAINTREE_PRODUCTION_MERCHANT_ID,
    BRAINTREE_PRODUCTION_PUBLIC_KEY,
    BRAINTREE_PRODUCTION_PRIVATE_KEY,
    BRAINTREE_MOCK_PAY_PAL_MERCHANT_ID,
    BRAINTREE_MOCK_PAY_PAL_PUBLIC_KEY,
    BRAINTREE_MOCK_PAY_PAL_PRIVATE_KEY,
} = process.env;

const GATEWAY_INSTANCES = {};

function getBraintreeGateway(opts) {
    const { envName } = opts;
    
    const instanceFromCache = GATEWAY_INSTANCES[envName];
    if (instanceFromCache) {
        // return instance from cache if available; this prevents gateway instances from
        // being created multiple times when loaded lazily
        return instanceFromCache;
    }

    let environment, merchantId, publicKey, privateKey;
    switch (envName) {
        case 'sandbox':
            environment = braintree.Environment.Sandbox;
            merchantId = BRAINTREE_SANDBOX_MERCHANT_ID;
            publicKey = BRAINTREE_SANDBOX_PUBLIC_KEY;
            privateKey = BRAINTREE_SANDBOX_PRIVATE_KEY;
            break;
        case 'production':
            environment = braintree.Environment.Production;
            merchantId = BRAINTREE_PRODUCTION_MERCHANT_ID;
            publicKey = BRAINTREE_PRODUCTION_PUBLIC_KEY;
            privateKey = BRAINTREE_PRODUCTION_PRIVATE_KEY;
            break;
        case 'mock_pay_pal':
            environment = braintree.Environment.Sandbox;
            merchantId = BRAINTREE_MOCK_PAY_PAL_MERCHANT_ID;
            publicKey = BRAINTREE_MOCK_PAY_PAL_PUBLIC_KEY;
            privateKey = BRAINTREE_MOCK_PAY_PAL_PRIVATE_KEY;
            break;
    }
    
    // cache instance before returning
    const instance = new braintree.BraintreeGateway({ environment, merchantId, publicKey, privateKey });
    GATEWAY_INSTANCES[envName] = instance;

    return instance;
}

module.exports = getBraintreeGateway;
