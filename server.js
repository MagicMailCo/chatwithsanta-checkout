// server.js
require("dotenv").config();
const express = require("express");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");

app.use(express.static("public"));  // serve files from /public
app.use(express.json());

// Create a PaymentIntent for Santa Chat
app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2900, // $29.00 in cents
      currency: "usd",
      description: "Santa Chat – Chat With Santa",
      metadata: { product: "Santa Chat" },
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// Default route (we'll add the HTML file in /public next)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chatwithsanta-checkout.html"));
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
