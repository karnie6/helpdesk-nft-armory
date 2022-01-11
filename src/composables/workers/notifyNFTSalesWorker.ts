import Discord, { MessageEmbed, TextChannel } from "discord.js";
import {ref } from 'vue';
import { Worker } from "../workers/types";
import {PNFT} from '../../common/helpers/types';
import { fetchDiscordChannel } from "../discord";
import notifyDiscordSale from "../discord/notifyDiscordSale"
import usePinata from "../pinata";

export interface Project {
    mintAddress: string;
    discordChannelId: string;
  }


export default function newWorker(
    discordClient: Discord.Client,
    project: Project
  ): Worker {
    const timestamp = Date.now();
    let notifyAfter = new Date(timestamp);

    const {retrieveOpenTickets} = usePinata();
  
    let initialTickets: number = 0;

    const allPinataTickets = ref<PNFT[]>([]); // this is everything fetched in mem
  
    console.log("Worker func called");
    retrieveOpenTickets() 
      .then((pinataTickets) => {
        if (pinataTickets.length) {
           allPinataTickets.value = pinataTickets
           console.log("pinata tickets found")
           console.log("has length: ", allPinataTickets.value.length)
        } else {
          console.log("No pinata tickets found")
        }
      });
  
  
  
      return {
        async execute() {
    
    
          if (!discordClient.isReady()) {
            return;
          }
    
          const channel = await fetchDiscordChannel(
            discordClient,
            project.discordChannelId
          );
          if (!channel) {
            return;
          }
          if (allPinataTickets.value.length <= initialTickets){
            console.log("no new tickets detected - New Tickets: ", allPinataTickets.value.length , " Old Tickets: ", initialTickets)
            return;
          }
          console.log("ASYNC EXECUTION ##########")
          console.log("New Tickets: ", allPinataTickets.value.length , "Old Tickets: ", initialTickets)
          await notifyDiscordSale(discordClient,channel);
          initialTickets = allPinataTickets.value.length
        },
      };
  }

