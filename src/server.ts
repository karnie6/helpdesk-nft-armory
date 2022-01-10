import dotenv from "dotenv";
import { Worker } from "./composables/workers/types";
import notifyNFTSalesWorker from "./composables/workers/notifyNFTSalesWorker";


import {
    initClient as initDiscordClient,
  } from './composables/discord';
import { loadConfig } from "./composables/configs/config";
import initWorkers from "./composables/workers/initWorkers";

(async () => {
  console.log("Trying to run")  
  try {
      const result = dotenv.config();
      if (result.error) {
        throw result.error;
      }
  
      const config = loadConfig();

      console.log("awaiting discord client creation");

      const discordClient = await initDiscordClient();

      console.log("discord client created");
  
      console.log("now looking at workers");
  

     const workers: Worker[] = config.subscriptions.map((s) => {
        return notifyNFTSalesWorker(discordClient, {
            discordChannelId: s.discordChannelId,
            mintAddress: s.mintAddress,
        });
        });

      initWorkers(workers);
      
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  
  })();
  