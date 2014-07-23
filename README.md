# nodify

A barebones framework for a Shopify embedded app written in node.js express.

Currently includes authentication with shopify, signature checking of requests, creates a webhook when installed for handling uninstalls and uses SSL (https).

All that needs to be done to get it running is creating a config.js file like the one shown in config.sample.js and editing the title in package.json then running npm install to get the dependencies.
