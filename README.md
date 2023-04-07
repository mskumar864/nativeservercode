# Team SDK Sample Merchant Server

This server is deployed to `https://sdk-sample-merchant-server.herokuapp.com`.

## Local Development

1. Make sure you have [Node.js installed](https://nodejs.org/en/download/)

1. In the root of the repo, run `npm install`:
    * PayPal corp laptops require you to use the PayPal npm registry. Make sure you have set it via:
    ```
    npm config set registry https://npm.paypal.com/
    npm config set scope @paypalcorp
    ```
    
1. Set your account credentials by adding a local `.env` file:
  
    * For example:
    ```
    PAY_PAL_CLIENT_ID=123456
    PAY_PAL_CLIENT_SECRET=abcdef
    ```
    * Do not commit your `.env` file.

1. Run `npm start` to run the sample server on port 8080

_Note: Sample API requests to this server live in the `/scripts` directory._

## Deployment

Open Terminal (or your preferred command-line tool) and execute the following commands:

```bash
# login with heroku@getbraintree.com credentials (located in 1Pass)
heroku login

# add 'heroku' as a remote origin
heroku git:remote -a sdk-sample-merchant-server

# deploy to heroku by pushing to heroku remote origin
git checkout main && git pull origin main && git push heroku main
```

> For more in-depth documentation on deployment, see the official [Heroku Deployment Documentation](https://devcenter.heroku.com/articles/git)
