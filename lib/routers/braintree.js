
const express = require('express');
const router = express.Router();
const getBraintreeGateway = require('../utils/get-braintree-gateway');

function createBraintreeRouter(envName) {
    const braintreeRouter = express.Router({ mergeParams: true });

    braintreeRouter.post('/client_tokens', async (req, res, next) => {
        const { body = {}} = req;
        const { customerId, merchantAccountId } = body;

        const gateway = getBraintreeGateway({ envName });
        try {
            const opts = {};
            if (customerId) {
                await gateway.customer.create({ id: customerId });
                opts.customerId = customerId;
            }
            if (merchantAccountId) {
                opts.merchantAccountId = merchantAccountId;
            }

            const { clientToken } = await gateway.clientToken.generate(opts);
            res.status(201).send({ value: clientToken });
        } catch (e) {
            next(e);
        }
    });

    // Ported from OG Sample Server: https://github.braintreeps.com/braintreeps/braintree-sample-merchant/blob/047169948695405d2f016b4c1740ea1cd481097f/merchant_server/server.rb#L257
    braintreeRouter.post('/transactions', async (req, res, next) => {
        const { body = {}} = req;
        const {
            amount = '1.00',
            paymentMethodNonce,
            merchantAccountId,
            threeDSecureRequired
        } = body;

        async function executeTransaction(opts) {
            const gateway = getBraintreeGateway({ envName });
            const { transaction, success: transactionSuccess, message: transactionMessage } =
                await gateway.transaction.sale(opts);

            if (transactionSuccess && transaction) {
                if (envName === 'production') {
                    // void production transactions immediately to prevent accidental charges
                    const { success: voidSuccess, message: voidMessage } =
                        await gateway.transaction.void(transaction.id);
                    if (!voidSuccess) {
                        return { errorMessage: voidMessage };
                    }
                }
                return { transaction };
            } else {
                return { errorMessage: transactionMessage };
            }
        }

        try {
            const transactionOpts = { amount, paymentMethodNonce };
            if (merchantAccountId) {
                transactionOpts.merchantAccountId = merchantAccountId;
            }
            if (threeDSecureRequired) {
                transactionOpts.options = { threeDSecure: { required: true }};
            }

            let json;
            const { transaction, errorMessage } = await executeTransaction(transactionOpts);
            if (transaction) {
                json = { message: `created ${transaction.id} ${transaction.status}` };
            } else {
                json = { message: errorMessage };
            }
            
            // always return 'created' status code to mimic existing merchant server
            res.status(201).send(json);

        } catch (e) {
            next(e);
        }
    });

    return braintreeRouter;
}

router.use('/sandbox', createBraintreeRouter('sandbox'));
router.use('/production', createBraintreeRouter('production'));
router.use('/mock_pay_pal', createBraintreeRouter('mock_pay_pal'));

module.exports = router;
