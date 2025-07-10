"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTrialStatus = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firestore_1 = require("firebase-admin/firestore");
const init_1 = require("./init");
exports.checkTrialStatus = (0, scheduler_1.onSchedule)("every day 00:00", async () => {
    const families = await init_1.db.collection("families")
        .where("subStatus", "==", "trial")
        .get();
    const now = firestore_1.Timestamp.now();
    const updatePromises = [];
    for (const doc of families.docs) {
        const start = doc.data().trialStartDate?.toDate();
        if (!start)
            continue;
        const diffDays = Math.floor((now.toDate().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 14) {
            updatePromises.push(doc.ref.update({ subStatus: "expired" }));
        }
    }
    await Promise.all(updatePromises);
});
//# sourceMappingURL=checkTrialStatus.js.map