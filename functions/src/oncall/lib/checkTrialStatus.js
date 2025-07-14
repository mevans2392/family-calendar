"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTrialStatus = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const init_1 = require("./init");
exports.checkTrialStatus = (0, scheduler_1.onSchedule)("every day 00:00", async () => {
    const families = await init_1.db.collection("families")
        .where("subStatus", "==", "trial")
        .get();
    const today = new Date();
    const updatePromises = [];
    for (const doc of families.docs) {
        const startStr = doc.data().trialStart;
        if (!startStr)
            continue;
        const startDate = new Date(startStr);
        const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 14) {
            console.log(`Expiring Family ${doc.id}`);
            updatePromises.push(doc.ref.update({ subStatus: "expired" }));
        }
    }
    await Promise.all(updatePromises);
});
//# sourceMappingURL=checkTrialStatus.js.map