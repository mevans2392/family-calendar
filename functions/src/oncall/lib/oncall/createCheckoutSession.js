"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const stripe_1 = __importDefault(require("stripe"));
const init_1 = require("../init");
// Securely reference the Stripe secret key from Firebase Secret Manager
const STRIPE_SECRET_TEST = (0, params_1.defineSecret)("STRIPE_SECRET_TEST");
// Initialize Stripe with the secret injected at runtime
exports.createCheckoutSession = (0, https_1.onCall)({
    secrets: [STRIPE_SECRET_TEST],
    region: "us-central1", // or your preferred region
}, async (request) => {
    const { auth } = request;
    console.log("Function triggered. Auth:", auth);
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
    const familyId = familyDoc.id;
    const familyData = familyDoc.data();
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_TEST, {
        apiVersion: "2025-06-30.basil",
    });
    let customerId = familyData.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            metadata: { familyId },
        });
        customerId = customer.id;
        await init_1.db.collection("families").doc(familyId).update({
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
});
//# sourceMappingURL=createCheckoutSession.js.map