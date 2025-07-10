import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import Stripe from "stripe";
import {db} from "./init";

const STRIPE_SECRET_TEST = defineSecret("STRIPE_SECRET_TEST");

export const cancelSubscription = onCall(
  {
    secrets: [STRIPE_SECRET_TEST],
    region: "us-central1",
  },
  async (request): Promise<{success: boolean}> => {
    const {auth} = request;

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
    const familyData = familyDoc.data();

    const subscriptionId = familyData.stripeSubscriptionId;

    if (!subscriptionId) {
      throw new HttpsError("failed-precondition", "No subscription found");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_TEST!, {
      apiVersion: "2025-06-30.basil" as const,
    });

    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      return {success: true};
    } catch (error: any) {
      console.error("Stripe cancellation error:", error);
      throw new HttpsError("internal", "Failed to cancel subscription");
    }
  }
);
