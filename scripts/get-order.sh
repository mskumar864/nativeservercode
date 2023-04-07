#!/usr/bin/env bash

curl -v -X POST http://localhost:8080/orders \
    -H 'Content-Type: application/json' \
    -d  '{
              "intent": "CAPTURE",
              "purchase_units": [
                {
                
                  "amount": {
                    "currency_code": "USD",
                    "value": "95.00"
                  }
                }
              ],
              "payment_source": {
                "paypal": {
                  "attributes": {
                    "vault": {
                      "confirm_payment_token": "ON_ORDER_COMPLETION",
                      "usage_type": "MERCHANT"
                    }
                  }
                }
              },
              "application_context": {
                "return_url": "https://example.com/returnUrl",
                "cancel_url": "https://example.com/cancelUrl"
              }
            }'
