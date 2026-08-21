const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/wplus/ipn',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});
req.write('WP_ACTION=sale&WP_BUYER_EMAIL=test@test.com&WP_ITEM_NAME=test&WP_ITEM_NUMBER=wso_tbn52k&WP_TXNID=123');
req.end();
