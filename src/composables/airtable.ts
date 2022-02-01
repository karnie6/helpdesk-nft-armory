import { DEFAULTS } from "@/globals";
import Airtable from 'airtable';

import { sendEmail } from "@/composables/emailjs";

const airtableApiKey = DEFAULTS.AIRTABLE_API_KEY
const airtableAppBaseId = DEFAULTS.AIRTABLE_APP_BASE_ID
const gmnhUserTable = DEFAULTS.AIRTABLE_GMNH_USER_TABLE_NAME

var base = new Airtable({ apiKey: airtableApiKey }).base(airtableAppBaseId);

async function queryAirtable(tableName: string, selectionCriteria: Object) {
    /* Query AirTable 
      Inputs: selection critera & table to query
      Outputs: all record results from the executed query
    */
    
    return await base(tableName).select(selectionCriteria).firstPage().then((records: any) => {
                if (records.length) {
                  console.log("yeah found")
                  return records
                } else {
                  console.log("yike")
                  return "nope"
                }
              })

}


export async function notifyGMNHUser(userWalletId: string, emailType: string, questionLink: string){
  /* Lookup a GMNHUser's email address in airtable & send specified email type
     Input: 
        userWalletId --> user's wallet id
        emailType --> type of email to send (tied to template)
        questionLink --> /question/ link

  */

    let emailAddressColumn = 'EmailAddress'
    let walletKeyColumn = 'WalletKey'

    let filterString = `({${walletKeyColumn}} = '${userWalletId}')`

    let selectionCriteria = {
        maxRecords: 1,
        fields: [emailAddressColumn],
        filterByFormula: filterString
    }

    let output = await queryAirtable(gmnhUserTable, selectionCriteria)
    let userEmailAddress = output[0].get(emailAddressColumn)

    console.log("output email address is: ", userEmailAddress )
    sendEmail(userEmailAddress, emailType, questionLink)
  

}


