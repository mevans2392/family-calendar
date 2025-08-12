import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import Stripe from "stripe";
import {db} from "./init";

// Securely reference the Stripe secret key from Firebase Secret Manager
const STRIPE_SECRET_TEST = defineSecret("STRIPE_SECRET_TEST");
//const STRIPE_SECRET = defineSecret("STRIPE_SECRET");

// Initialize Stripe with the secret injected at runtime


export const testCheckoutSession = onCall(
  {
    secrets: [STRIPE_SECRET_TEST],
    region: "us-central1", // or your preferred region
  },
  async (request): Promise<{ url: string | null }> => {
    const {auth} = request;

    console.log("Function triggered. Auth:", auth);

    if (!auth) {
      throw new HttpsError("unauthenticated", "User must be logged in");
    }

    const uid = auth.uid;
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
    const planType = familyData.planType;
    const subscriptionId = familyData.stripeSubscriptionId;

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
    const isLocal = request.rawRequest.headers.origin?.includes("localhost");

    const successUrl = isLocal ?
      "http://localhost:4200/success" :
      "https://familycalendar-2a3ec.web.app/success";

    const cancelUrl = isLocal ?
      "http://localhost:4200/home" :
      "https://familycalendar-2a3ec.web.app/home";

    const INDIVIDUAL_TEST_PRICE_ID = ''; //add test individual price id
    const FAMILY_TEST_PRICE_ID = ''; //add test family price id

    let priceId: string;

    if (planType === 'family') {
      priceId = FAMILY_TEST_PRICE_ID;
    } else if (planType === 'individual') {
      priceId = INDIVIDUAL_TEST_PRICE_ID;
    } else {
      throw new HttpsError("invalid-argument", "invalid or missing planType");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      url: session.url,
    };
  }
);