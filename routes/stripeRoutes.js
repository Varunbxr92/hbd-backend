const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

router.post('/create-checkout-session', async (req, res) => {
  const { product } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            images: [product.image], // optional
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://hbd-frontend.vercel.app/success',
      cancel_url: 'https://hbd-frontend.vercel.app/cancel',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    // res.status(500).json({ error: 'Payment failed' });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
