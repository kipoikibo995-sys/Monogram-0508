const express = require('express');
const multer = require('multer');
const request = require('supertest');

const app = express();
const upload = multer();

app.post('/ipn', upload.none(), express.urlencoded({ extended: true }), (req, res) => {
  res.json(req.body);
});

request(app)
  .post('/ipn')
  .field('WP_ACTION', 'sale')
  .field('WP_BUYER_EMAIL', 'kangjijae@gmail.com')
  .expect(200)
  .end((err, res) => {
    if (err) throw err;
    console.log(res.body);
  });
