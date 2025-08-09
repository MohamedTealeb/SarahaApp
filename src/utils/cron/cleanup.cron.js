import cron from "node-cron";
import { UserModel } from "../../DB/models/user.modle.js";

export function scheduleCleanupJobs() {
  cron.schedule("0 2 * * *", async () => {
    try {
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      const cutoffDate = new Date(Date.now() - thirtyDaysMs);

      const result = await UserModel.deleteMany({
        provider: "local",
        confirmEmail: { $exists: false },
        createdAt: { $lte: cutoffDate },
      });

      if (result?.deletedCount) {
        console.log(
          `[CRON] Deleted ${result.deletedCount} unverified users older than 30 days`
        );
      }
    } catch (error) {
      console.error("[CRON] Failed to clean up unverified users:", error);
    }
  });
}

