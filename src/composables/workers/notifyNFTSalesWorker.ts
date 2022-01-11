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

export function findNewOpenTickets(allTickets: Array<PNFT>, notifyAfterDate: Date ) {
  /* Find only tickets that are new from all tickets
  */

  let newOpenTickets: Array<PNFT> = [];

  for (let ticket of allTickets){
      const attr_key = 'date_pinned'
      let attr = ticket.hasOwnProperty("date_pinned") ? ticket[attr_key] : undefined
      if (attr){
        let attrDate = new Date(attr);
        if (attrDate >= notifyAfterDate){
          console.log("Found new ticket")
          newOpenTickets.push(ticket)
        }
      }
  }

  return newOpenTickets
}


export function updateNotifyAfterdate(){
  /* Calculating a new datetime
  */
  // return new Date(Date.now());
  return new Date(2021, 11, 31, 0, 0) // test date to check 3 tickets are found
}

export default function newWorker(
    discordClient: Discord.Client,
    project: Project
  ): Worker {
    
    let notifyAfter = new Date(Date.now());
    let initialTickets: number = 0;

    const {retrieveOpenTickets} = usePinata();
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
          console.log("finding new tickets since notify after time ", notifyAfter)
          // always check for new tickets for now TODO: replace with array version
          let newOpenTickets: Array<PNFT>;
          newOpenTickets = findNewOpenTickets(allPinataTickets.value, notifyAfter);
    
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
          // Means we don't have new tickets
          if (newOpenTickets.length <= initialTickets){
            console.log("No new tickets detected | New Tickets: ", newOpenTickets.length , " Old Tickets: ", initialTickets);
            notifyAfter = updateNotifyAfterdate();
            console.log("updating notifyAfterdatetime to ", notifyAfter);
            return;
          }

          console.log("New Tickets: ", newOpenTickets.length , "Old Tickets: ", initialTickets)
          await notifyDiscordSale(discordClient, channel, newOpenTickets);
          initialTickets = newOpenTickets.length;
          notifyAfter = updateNotifyAfterdate();
          console.log("updating notifyAfterdatetime to ", notifyAfter);
        },


      };
  }

  