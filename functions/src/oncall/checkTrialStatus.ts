import {onSchedule} from "firebase-functions/v2/scheduler";
import {Timestamp} from "firebase-admin/firestore";
import {db} from "./init";

export const checkTrialStatus = onSchedule("every day 00:00", async () => {
  const families = await db.collection("families")
    .where("subStatus", "==", "trial")
    .get();
  const now = Timestamp.now();

  const updatePromises: Promise<any>[] = [];

  for (const doc of families.docs) {
    const start = doc.data().trialStartDate?.toDate();
    if (!start) continue;

    const diffDays = Math.floor(
      (now.toDate().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 14) {
      updatePromises.push(doc.ref.update({subStatus: "expired"}));
    }
  }

  await Promise.all(updatePromises);
});
