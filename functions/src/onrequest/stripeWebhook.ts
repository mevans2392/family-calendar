import express from "express";
import Stripe from "stripe";
import {db} from "./init";
import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";

// Securely reference Stripe secrets
const STRIPE_SECRET_TEST = defineSecret("STRIPE_SECRET_TEST");
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");

// Initialize Stripe using runtime-injected secret


const app = express();
app.use(express.raw({type: "application/json"}));

app.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const stripe = new Stripe(process.env.STRIPE_SECRET_TEST!, {
    apiVersion: "2025-06-30.basil" as const,
  });

  let event: Stripe.Event;

  try {
    console.log("Stripe signature header:", sig);
    console.log("Is raw body a buffer:",
      Buffer.isBuffer((req as any).rawBody));
    const payload = (req as any).rawBody ?? req.body;
    event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const data = event.data.object as any;

  switch (event.type) {
  case "invoice.payment_succeeded": {
    const customerId = data.customer;
    const familiesSnapshot = await db
      .collection("families")
      .where("stripeCustomerId", "==", customerId)
      .get();

    for (const docRef of familiesSnapshot.docs) {
      await docRef.ref.update({subStatus: "paid"});
    }

    break;
  }

  case "invoice.payment_failed":
  case "customer.subscription.deleted": {
    const customerId = data.customer;
    const familiesSnapshot = await db
      .collection("families")
      .where("stripeCustomerId", "==", customerId)
      .get();

    for (const docRef of familiesSnapshot.docs) {
      await docRef.ref.update({subStatus: "expired"});
    }

    break;
  }

  default:
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send("Received");
});

// Export the webhook function using v2 HTTPS trigger
export const handleStripeWebhook = onRequest(
  {
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    secrets: [STRIPE_SECRET_TEST, STRIPE_WEBHOOK_SECRET],
  },
  app
);


