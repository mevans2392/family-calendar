"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = void 0;
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const init_1 = require("./init");
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
// Securely reference Stripe secrets
const STRIPE_SECRET_TEST = (0, params_1.defineSecret)("STRIPE_SECRET_TEST");
const STRIPE_WEBHOOK_SECRET = (0, params_1.defineSecret)("STRIPE_WEBHOOK_SECRET");
// Initialize Stripe using runtime-injected secret
const app = (0, express_1.default)();
app.use(express_1.default.raw({ type: "application/json" }));
app.post("/", async (req, res) => {
    var _a;
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_TEST, {
        apiVersion: "2025-06-30.basil",
    });
    let event;
    try {
        console.log("Stripe signature header:", sig);
        console.log("Is raw body a buffer:", Buffer.isBuffer(req.rawBody));
        const payload = (_a = req.rawBody) !== null && _a !== void 0 ? _a : req.body;
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    }
    catch (err) {
        console.error("Webhook Error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    const data = event.data.object;
    switch (event.type) {
        case "invoice.payment_succeeded": {
            const customerId = data.customer;
            const familiesSnapshot = await init_1.db
                .collection("families")
                .where("stripeCustomerId", "==", customerId)
                .get();
            for (const docRef of familiesSnapshot.docs) {
                await docRef.ref.update({ subStatus: "paid" });
            }
            break;
        }
        case "invoice.payment_failed":
        case "customer.subscription.deleted": {
            const customerId = data.customer;
            const familiesSnapshot = await init_1.db
                .collection("families")
                .where("stripeCustomerId", "==", customerId)
                .get();
            for (const docRef of familiesSnapshot.docs) {
                await docRef.ref.update({ subStatus: "expired" });
            }
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).send("Received");
});
// Export the webhook function using v2 HTTPS trigger
exports.handleStripeWebhook = (0, https_1.onRequest)({
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    secrets: [STRIPE_SECRET_TEST, STRIPE_WEBHOOK_SECRET],
}, app);
//# sourceMappingURL=stripeWebhook.js.map