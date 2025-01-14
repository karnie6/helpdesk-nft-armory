import { DEFAULTS } from "@/globals";
import emailjs from '@emailjs/browser/';

const gmnhEmailHandle = DEFAULTS.GMNH_EMAIL_HANDLE
const emailjsServiceId = DEFAULTS.EMAILJS_SERVICE_ID;
const emailjsTemplateId = DEFAULTS.EMAILJS_TEMPLATE_ID;
const emailjsUserId = DEFAULTS.EMAILJS_USER_ID;

export const emailTypeResponder= 'QuestionResponder';
export const emailTypeAnswered = 'QuestionAnswered';
export const emailTypeAsked = 'QuestionAsked';
export const emailTypeSignUp = 'UserSignUp';

export function sendEmail(userEmailAddress: string, emailType: string, questionLink: string) {
  /* Initialize message and send specified email using emailjs
     Input:
        emailAddress --> user's wallet id
        emailType --> type of email to send (tied to template)
        questionLink --> /question/ link
  */

  // TODO down the road: clean this up more
  if (emailType == 'QuestionResponder') {
    var templateParams = {
      header: 'GMNH: Your answer to an open question was posted on GMNH',
      from_email: gmnhEmailHandle,
      to_email: userEmailAddress,
      message: `You answered an open question! Check out your full response here anytime: ${questionLink}`
    };
  }
  else if (emailType == 'QuestionAsked') {
    var templateParams = {
      header: 'GMNH: Your question was posted on GMNH',
      from_email: gmnhEmailHandle,
      to_email: userEmailAddress,
      message: `Your question was posted on GMNH! Check out your question here anytime: ${questionLink}`
    };
  }
  else if (emailType == 'QuestionAnswered') {
    var templateParams = {
      header: 'Yay! Your question was answered by GMneedhelp',
      from_email: gmnhEmailHandle,
      to_email: userEmailAddress,
      message: `Check out our community's response to your question: ${questionLink}`
    };
  }
  // emailType == UserSignUp
  else {
    var templateParams = {
      header: 'GMNH: You signed up for GMNH',
      from_email: gmnhEmailHandle,
      to_email: userEmailAddress,
      message: `Thanks for joining GMNH! Be on the lookout for emails when you ask a question or answer one!`
    };
  }

  emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams, emailjsUserId)
    .then(function (response) {
    }, function (error) {
      console.log('FAILED...', error);
    });


}


export async function notifyGMNHUser(userEmailAddress: string, emailType: string, questionLink: string){
    /* Lookup a GMNHUser's email address in airtable & send specified email type
       Input: 
          userEmailAddress --> user's email address
          emailType --> type of email to send (tied to template)
          questionLink --> /question/ link
  
    */

       try {
              
            if (userEmailAddress){
                sendEmail(userEmailAddress, emailType, questionLink)
            }
        } 
  
        catch (err) {
            console.log("Error occurred when trying to add user info to airtable: ", err);
        }
  
      
      return;
}
  