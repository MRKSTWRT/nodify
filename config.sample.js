config = {
  app: {
    name: 'APP NAME HERE',
    url: 'https://URL TO APP HERE.com',
    apiKey: 'APP API KEY HERE',
    sharedSecret: 'APP SHARED SECRET HERE',
    scope: 'write_products,write_themes',
    sessionSecret: 'SESSION SECRET'
  },
  db: {
    host: 'localhost',
    user: 'DATABASE USERNAME',
    pass: 'DATABASE PASSWORD',
    name: 'DATABASE NAME'
  },
  ssl: {
    cert: './ssl/.CRT FILE PATH',
    key: './ssl/.KEY FILE PATH'
  }
};

module.exports = config;
