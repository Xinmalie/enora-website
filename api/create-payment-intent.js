const Stripe = require('stripe');

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items } = req.body;

    // Calculate amount
    // Each worksheet = $1 USD (RM5), bundle = $2.50 USD (RM10)
    const PRICES = {
      bundle: 250,   // $2.50 in cents
      B2: 100,       // $1.00 in cents
      C1: 100,
      C2: 100,
    };

    const item = items[0];
    const amount = PRICES[item.id] || 100;
    const description = item.id === 'bundle'
      ? 'ENORA Premium Bundle (B2 + C1 + C2 Worksheets)'
      : `ENORA ${item.id} Worksheet`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description,
      metadata: { item_id: item.id },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount,
      description,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};
