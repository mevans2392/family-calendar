import {onSchedule} from "firebase-functions/v2/scheduler";
import {db} from "./init";

export const checkTrialStatus = onSchedule("every day 00:00", async () => {
  const families = await db.collection("families")
    .where("subStatus", "==", "trial")
    .get();
  const today = new Date();

  const updatePromises: Promise<any>[] = [];

  for (const doc of families.docs) {
    const startStr = doc.data().trialStart as string;
    if (!startStr) continue;

    const startDate = new Date(startStr);

    const diffDays = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 14) {
      console.log(`Expiring Family ${doc.id}`);
      updatePromises.push(doc.ref.update({subStatus: "expired"}));
    }
  }

  await Promise.all(updatePromises);
});
