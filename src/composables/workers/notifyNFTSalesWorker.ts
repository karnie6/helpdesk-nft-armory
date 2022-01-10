import Discord, { MessageEmbed, TextChannel } from "discord.js";
import {ref } from 'vue';
import { Worker } from "../workers/types";
import {PNFT} from '../../common/helpers/types';
import { fetchDiscordChannel } from "../discord";
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
  
    const { retrieveOpenTickets} = usePinata();
  
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
    
          if (!discordClient.isReady()) {
            return;
          }
        
          const description = `HELPDESK TEST MESSAGE`;
        
          const embedMsg = new MessageEmbed({
            color: "#0099ff",
            title: "TEST",
            description,
    
          });
    
          
          await channel.send({
            embeds: [embedMsg],
          });
          const logMsg = `Notified discord #${channel.name}: ${description}`;
          console.log(logMsg);
        
        },
      };
  }

// # todo: package versions etc. ----> required updating typescript versions
// # clean up of relative paths with imports
// #  expand code to notify with new pins?
// # merge together usage of env and globals.