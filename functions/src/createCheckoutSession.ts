import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import Stripe from "stripe";
import {db} from "./init";

// Securely reference the Stripe secret key from Firebase Secret Manager
const STRIPE_SECRET_TEST = defineSecret("STRIPE_SECRET_TEST");

// Initialize Stripe with the secret injected at runtime


export const createCheckoutSession = onCall(
  {
    secrets: [STRIPE_SECRET_TEST],
    region: "us-central1", // or your preferred region
  },
  async (data, context: any): Promise<{ url: string | null }> => {
    if (!context.auth) {
      throw new HttpsError("unauthenticated", "User must be logged in");
    }

    const uid = context.auth.uid;
    const familySnap = await db
      .collection("families")
      .where("createdBy", "==", uid)
      .limit(1)
      .get();

    if (familySnap.empty) {
      throw new HttpsError("not-found", "Family not found");
    }

    const familyDoc = familySnap.docs[0];
    const familyId = familyDoc.id;
    const familyData = familyDoc.data();

    const stripe = new Stripe(process.env.STRIPE_SECRET_TEST!, {
      apiVersion: "2025-06-30.basil" as const,
    });


    let customerId = familyData.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {familyId},
      });

      customerId = customer.id;

      await db.collection("families").doc(familyId).update({
        stripeCustomerId: customerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: "price_1RhUjmD7X1eeHlBhKVPz42Fj",
          quantity: 1,
        },
      ],
      success_url: "http://localhost:4200/success",
      cancel_url: "http://localhost:4200/cancel",
    });

    return {
      url: session.url,
    };
  }
);

