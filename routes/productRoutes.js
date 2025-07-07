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
// In routes/productRoutes.js or similar
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});
router.post('/products/upload', async (req, res) => {
  try {
    const { name, description, price, images } = req.body;
    const product = new Product({ name, description, price, images });
    await product.save();
    res.status(201).json({ message: 'Product saved', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload', error: err.message });
  }
});

router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
