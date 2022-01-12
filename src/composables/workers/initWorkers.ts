import { Worker } from "@/composables/workers/types";

const defaultInterval = 1000 * 60; // 1 minute (calculated in ms)

export default async function initWorkers(
  workers: Worker[],
  interval: number = defaultInterval
) {
  if (!workers.length) {
    throw "Cannot init workers because no workers are configured: check env vars";
  }

  console.log(`starting ${workers.length} worker(s)...`);

  const runWorkers = async () => {
    const promises = workers.map(async (w) => {
      try {
        return await w.execute();
      } catch (e) {
        console.warn(e);
      }
    });

    return Promise.all(promises);
  };

  const _ = runWorkers();
  setInterval(runWorkers, interval);
}