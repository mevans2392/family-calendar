"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSubscription = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const stripe_1 = __importDefault(require("stripe"));
const init_1 = require("./init");
const STRIPE_SECRET_TEST = (0, params_1.defineSecret)("STRIPE_SECRET_TEST");
exports.cancelSubscription = (0, https_1.onCall)({
    secrets: [STRIPE_SECRET_TEST],
    region: "us-central1",
}, async (request) => {
    const { auth } = request;
    if (!auth) {
        throw new https_1.HttpsError("unauthenticated", "User must be logged in");
    }
    const uid = auth.uid;
    const familySnap = await init_1.db
        .collection("families")
        .where("createdBy", "==", uid)
        .limit(1)
        .get();
    if (familySnap.empty) {
        throw new https_1.HttpsError("not-found", "Family not found");
    }
    const familyDoc = familySnap.docs[0];
    const familyData = familyDoc.data();
    const subscriptionId = familyData.stripeSubscriptionId;
    if (!subscriptionId) {
        throw new https_1.HttpsError("failed-precondition", "No subscription found");
    }
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_TEST, {
        apiVersion: "2025-06-30.basil",
    });
    try {
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });
        return { success: true };
    }
    catch (error) {
        console.error("Stripe cancellation error:", error);
        throw new https_1.HttpsError("internal", "Failed to cancel subscription");
    }
});
//# sourceMappingURL=cancelSubscription.js.map