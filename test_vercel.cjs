const express = require('express');
const multer = require('multer');
const request = require('supertest');

const app = express();
const upload = multer();

app.post('/ipn', upload.none(), express.urlencoded({ extended: true }), (req, res) => {
  res.json({ body: req.body });
});

request(app)
  .post('/ipn')
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send('WP_ACTION=sale&WP_BUYER_EMAIL=test@test.com')
  .expect(200)
  .end((err, res) => {
    if (err) throw err;
    console.log("URLEncoded Response:", res.body);
  });
