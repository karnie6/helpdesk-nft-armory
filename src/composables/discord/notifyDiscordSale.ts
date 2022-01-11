import { PNFT } from "../../common/helpers/types";
import Discord, { MessageEmbed, TextChannel } from "discord.js";



export function generateTicketDetailLink (ticket: PNFT) {
  /* Input: Takes in a ticket (pinata NFT metadata)
     Output: link to ticket detail page using mintID or undefined (some tickets may not have mintID)
  */
   const app_url = "https://helpdesk-mlg49xt4w-helpdeskxyz.vercel.app/"
   const ticket_detail_page_prefix = "ticketdetail/"
   const attr_key = "mintId"
   let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
   return typeof attr != 'undefined' ? app_url + ticket_detail_page_prefix + attr : undefined

}

export function readTicketName (ticket: PNFT) {
  /* Input: Takes in a ticket (pinata NFT metadata)
     Output: reads ticket name from metadata or undefined (some tickets may not have a name)
  */
   const attr_key = 'name'
   let attr = ticket.metadata.hasOwnProperty(attr_key) ? ticket.metadata[attr_key] : undefined
   return typeof attr != 'undefined' ? attr : "Attribute Not Set"
}

export function readTicketStatus (ticket: PNFT) {
  /* Input: Takes in a ticket (pinata NFT metadata)
     Output: reads ticket status from metadata or undefined
  */
   const attr_key = 'status'
   let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
   return typeof attr != 'undefined' ? attr : "Attribute Not Set"
}

export function readTicketType (ticket: PNFT) {
  /* Input: Takes in a ticket (pinata NFT metadata)
     Output: reads ticket status from metadata or undefined
  */
   const attr_key = 'ticket_type'
   let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
   return typeof attr != 'undefined' ? attr : "Attribute Not Set"
}

export function readMintID (ticket: PNFT) {
  /* Input: Takes in a ticket (pinata NFT metadata)
     Output: reads ticket mint ID from metadata or undefined
  */
   const attr_key = 'mintId'
   let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
   return typeof attr != 'undefined' ? attr : "Attribute Not Set"
}

export function readUserID (ticket: PNFT) {
  /* Input: Takes in a ticket (pinata NFT metadata)
     Output: reads ticket user ID from metadata or undefined
  */
   const attr_key = 'user_id'
   let attr = ticket.hasOwnProperty(attr_key) ? ticket[attr_key] : undefined
   return typeof attr != 'undefined' ? attr : "Attribute Not Set"
}

export function readDatePinned (ticket: PNFT) {
  /* Input: Takes in a ticket (pinata NFT metadata)
     Output: reads ticket date pinned to pinata from metadata or undefined
  */
   const attr_key = 'date_pinned'
   let attr = ticket.hasOwnProperty(attr_key) ? ticket[attr_key] : undefined
   return typeof attr != 'undefined' ? attr : "Attribute Not Set"
}


export function generateTicketDescription(ticket: PNFT){
  /* Input: Takes in a ticket (pinata NFT metadata)
     Output: A description to put in discord channel with relevant info
  */

     return `This ${readTicketStatus(ticket)} ${readTicketType(ticket)} ticket was asked by user: ${readUserID(ticket)} on ${readDatePinned(ticket)}`

}


export default async function notifyDiscordSale(
    client: Discord.Client,
    channel: TextChannel,
    newOpenTickets: Array<PNFT>,
    test?: boolean
  ) {

    if (!client.isReady()) {
        return;
      }
      for (let ticket of newOpenTickets){
        const description = `GM NEED HELP! New Ticket`;
    
        const embedMsg = new MessageEmbed({
          color: "#0099ff",
          title: readTicketName(ticket),
          description: generateTicketDescription(ticket),
          url: generateTicketDetailLink(ticket)
        });

      
        await channel.send({
          embeds: [embedMsg],
        });
        const logMsg = `Notified discord #${channel.name}: ${description}`;
        console.log(logMsg);
      }
      

}