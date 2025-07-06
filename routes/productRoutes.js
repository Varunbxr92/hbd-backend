const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.array('images', 3), async (req, res) => {
  const { name, description, price, category } = req.body;
  const imageUrls = req.files.map(file => file.path);

  const newProduct = new Product({ name, description, price, category, images: imageUrls });
  await newProduct.save();

  res.status(201).json(newProduct);
});

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
