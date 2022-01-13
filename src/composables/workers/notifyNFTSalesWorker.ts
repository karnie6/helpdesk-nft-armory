import Discord, { MessageEmbed, TextChannel } from "discord.js";
import {ref } from 'vue';
import { Worker } from "@/composables/workers/types";
import {PNFT} from '@/common/helpers/types';
import { fetchDiscordChannel } from "@/composables/discord";
import notifyDiscordSale from "@/composables//discord/notifyDiscordSale"
import usePinata from "@/composables//pinata";

export interface Project {
    mintAddress: string;
    discordChannelId: string;
  }

export function updateNotifyAfterDate(){
  /* Calculate a new date
  */
  return new Date(Date.now());
  // return new Date(2021, 10, 31, 0, 0) // NOTE: FIXED DATE FOR TESTING: check 3 tickets are found
}



export default function newWorker(
    discordClient: Discord.Client,
    project: Project
  ): Worker {
    

    let notifyAfter = updateNotifyAfterDate();

    const allPinataTickets = ref<PNFT[]>([]); // this is everything fetched in mem
    const {retrieveOpenTickets} = usePinata();  

      return {
        async execute() {

          console.log("Worker func called");
          console.log(`notifyAfter timestamp: ${notifyAfter}`)

          // configurable parameters to pass to Pinata API Calls
          let pinataFilters = {
            pinStart: notifyAfter.toISOString()
          };

          retrieveOpenTickets(pinataFilters)
            .then((pinataTickets) => {
              if (pinataTickets.length) {
                  allPinataTickets.value = pinataTickets
                  console.log("Pinata tickets found has length: ", allPinataTickets.value.length)
              } else {
                console.log("No pinata tickets found")
              }
            }).catch();

                  
          if (!discordClient.isReady()) {
            console.log("client not ready")
            return;
          }
    
          const channel = await fetchDiscordChannel(
            discordClient,
            project.discordChannelId
          );

          if (!channel) {
            console.log("no channel exists yet")
            return;
          }
          // Means we don't have new tickets
          if (allPinataTickets.value.length == 0){
            notifyAfter = updateNotifyAfterDate();
            console.log(`No new tickets detected;`);
            return;
          }

          console.log(`${allPinataTickets.value.length} New Tickets Found`, )
          await notifyDiscordSale(discordClient, channel, allPinataTickets.value);
          notifyAfter = updateNotifyAfterDate();
        },


      };
  }

  