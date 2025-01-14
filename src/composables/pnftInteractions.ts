import { PNFT } from '@/common/helpers/types';

export function formatTicketDetailLink(questionMintId: string, appUrl?: string)  {
   /* Input: Takes in a question's mintId 
      Output: link to ticket detail page using mintID or undefined (some tickets may not have mintID)
   */
      const appUrlPrefix =  typeof appUrl != undefined ? appUrl : "https://gmnh.vercel.app"
      const ticketPageEndpoint = "/question/"
      return appUrlPrefix + ticketPageEndpoint + questionMintId
 }


export function generateTicketDetailLink(ticket: PNFT, appUrl?: string)  {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: link to ticket detail page using mintID or undefined (some tickets may not have mintID)
   */
      const appUrlPrefix =  typeof appUrl != undefined ? appUrl : ""
      const ticketPageEndpoint = "/question/"
      const attr_key = "mintId"
      let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
      return typeof attr != 'undefined' ? appUrlPrefix + ticketPageEndpoint + attr : undefined
 }
  

  export function readTicketName (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket name from metadata or undefined (some tickets may not have a name)
    */
     const attr_key = 'name';
    
      //we used to store title in 'name' within metadata, but realized it has a 255 char limit. 
      //So we're moving to its own metadata element, so we'll check metadata first, and then 'name' next.
      
      let title = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
      let backupTitle = ticket.metadata.hasOwnProperty(attr_key) ? ticket.metadata[attr_key] : undefined


      if (title && typeof title != 'undefined') {
         return title;
      } else if (backupTitle && typeof backupTitle != 'undefined') {
         return backupTitle;
      } else {
         return "";
      }
  };

  export function readDescription (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: reads description from metadata or undefined
   */
    const attr_key = 'description'
    let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
    return typeof attr != 'undefined' ? attr : ""
 };
  
  export function readTicketStatus (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket status from metadata or undefined
    */
     const attr_key = 'status'
     let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };
  export function readTicketType (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket status from metadata or undefined
    */
     const attr_key = 'ticket_type'
     let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };
  export function readMintID (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket mint ID from metadata or undefined
    */
     const attr_key = 'mintId'
     let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : ""
  };

  export function getImageURL (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: URL of where image is stored in IPFS
   */
    const attr_key = 'imageURI'
    let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
    return typeof attr != 'undefined' ? attr : "Attribute Not Set"
 };

 export function getAnswerMintId (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: mintId of answer (if exists)
   */
    const attr_key = 'answerMintId'
    let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
    return typeof attr != 'undefined' ? attr : ""
 };

 export function getAnswerText (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: mintId of answer (if exists)
   */
     const attr_key = 'answerText'
     let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Awaiting answer..."
    };

 export function needsToBeAnswered (ticket: PNFT) {
   return (readTicketType(ticket) == 'question');   
 }

  export function readUserID (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket user ID from metadata or undefined
    */
     const attr_key = 'user_id'
     let attr = ticket.hasOwnProperty(attr_key) ? ticket[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };

  export function readUserName (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: reads ticket user ID from metadata or undefined
   */
    const attr_key = 'userWallet'
    let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
    return typeof attr != 'undefined' ? ("by " + attr) : ""
 };

  export function readDatePinned (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket date pinned to pinata from metadata or undefined
    */
     const attr_key = 'date_pinned'
     let attr = ticket.hasOwnProperty(attr_key) ? ticket[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };

  export function readIPFSHash (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: reads ipfshash pinned to pinata 
   */
   return ticket.ipfs_pin_hash;
 };

 export function getQuestionUserWalletId(ticket: PNFT){
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: reads question user's wallet id from metadata 
   */
   const attr_key = 'userWallet'
   let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
   return typeof attr != 'undefined' ? attr : "Attribute Not Set"
 }


export function formatBylineTicketDatetime(ticketDatetimeString: string){
   /* Input: Takes in a ticket's datetime value
      Output: converts ticket's datetime value to specified string format
      Example input: 2022-02-11T01:42:25.185Z
      Example output: Thursday, Feb 10 2022 at 8:42PM
   */

   let ticketDatetime: Date

   try {
      let ticketDatetimeUnixTs = Date.parse(ticketDatetimeString)
      // certain scenarios -> don't display anything
      if (isNaN(ticketDatetimeUnixTs)){
         return ''
      }
      ticketDatetime = new Date(ticketDatetimeUnixTs)

   } catch(err){
      console.error('Error raised from parsing ticket datetime', err)
      return ''
   }

   // leaving undefined; should pick up from user's system
   let locale_option = undefined

   let ticketWeekday = ticketDatetime.toLocaleString(locale_option, {weekday:"long"})
   let ticketMonth = ticketDatetime.toLocaleString(locale_option,{ month: 'short' } )
   let ticketDay = ticketDatetime.toLocaleString(locale_option,{ day: 'numeric' } )
   let ticketYear = ticketDatetime.toLocaleString(locale_option, {  year: 'numeric'} )
   let ticketTime = ticketDatetime.toLocaleString(locale_option, { hour: 'numeric', hour12: true, minute:'2-digit'})

   let timestampDisplayString = `on ${ticketWeekday}, ${ticketMonth} ${ticketDay} ${ticketYear} at ${ticketTime}`
   return timestampDisplayString
}