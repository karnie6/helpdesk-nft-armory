import { DEFAULTS } from "@/globals";
import {PNFT, IMintResult} from "@/common/helpers/types"
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

export async function getOpenQuestionsFromGMNH(): Promise<PNFT[]> {
    const pnfts = await retrieveOpenQuestions();
    return pnfts;
}

async function retrieveOpenQuestions(): Promise<PNFT[]> {
    let openQuestionsUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'openquestions';

    return fetch(openQuestionsUrl)
            // the JSON body is taken from the response
            .then(res => res.json())
            .then(res => {
                return res as PNFT[]
            })
}

export async function getAnsweredQuestionsFromGMNH(): Promise<PNFT[]> {
    const pnfts = await retrieveAnsweredQuestions();
    return pnfts;
}

async function retrieveAnsweredQuestions(): Promise<PNFT[]> {
    let answeredQuestionsUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'answeredquestions';

    return fetch(answeredQuestionsUrl)
            // the JSON body is taken from the response
            .then(res => res.json())
            .then(res => {
                return res as PNFT[]
            })
}

export async function getMyQuestionsFromGMNH(userWalletAddr: string): Promise<PNFT[]> {
    const pnfts = await retrieveMyQuestions(userWalletAddr);
    return pnfts;
}

async function retrieveMyQuestions(userWalletAddr: string): Promise<PNFT[]> {
    let myQuestionsUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'myquestions' + '/' + userWalletAddr;
    
    return fetch(myQuestionsUrl)
            // the JSON body is taken from the response
            .then(res => res.json())
            .then(res => {
                return res as PNFT[]
            })
}

export async function retrieveAnswersFromGMNH(questionMintId: string): Promise<PNFT[]> {
    const pnfts = await retrieveAnswers(questionMintId);
    return pnfts;
}

async function retrieveAnswers(questionMintId: string): Promise<PNFT[]> {
    let getAnswersUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'answers' + '/' + questionMintId;
    
    return fetch(getAnswersUrl)
            // the JSON body is taken from the response
            .then(res => res.json())
            .then(res => {
                return res as PNFT[]
    })
}

export async function retrieveMintFromGMNH(mintId: string): Promise<PNFT[]> {
    const pnfts = await retrieveMint(mintId);
    return pnfts;
}

async function retrieveMint(mintId: string): Promise<PNFT[]> {
    let getMintUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'mint' + '/' + mintId;
    
    return fetch(getMintUrl)
            // the JSON body is taken from the response
            .then(res => res.json())
            .then(res => {
                return res as PNFT[]
    })
}

  export async function createGMNHQuestion (img: string, title: string, description: string, email: string, walletAddr: PublicKey): Promise<IMintResult> {

    const createQuestionUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'createQuestion';

    const data = new FormData();
    data.append('file', img);
    data.append('title', title);
    data.append('description', description);
    data.append('email', email);

    if (walletAddr) {
        data.append('userWalletAddr', walletAddr.toBase58());
    }
    //TODO: ADD ERROR HANDLING
    const res = await axios.post(createQuestionUrl, data, { });
    
    return res.data;
  };

  export async function createGMNHAnswer (img: string, title: string, questionID: string, questionIPFSHash: string, walletAddr: PublicKey): Promise<IMintResult> {

    const createAnswerUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'createAnswer';

    const data = new FormData();
    data.append('file', img);
    data.append('title', title);
    data.append('questionID', questionID);
    data.append('questionIPFSHash', questionIPFSHash);
    data.append('userWalletAddr', walletAddr.toBase58());

    //TODO: ADD ERROR HANDLING
    const res = await axios.post(createAnswerUrl, data, { });

    return res.data;
  };

  export async function isWalletApproved(userWalletAddress: string): Promise<boolean> {
    /* Input: user wallet address
       Output: boolean of whether user has been asked previously for email already
    */
    const isWalletApprovedUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'isWalletApproved' + `/${userWalletAddress}`;

    //TODO: ADD ERROR HANDLING
    const result = await axios.get(isWalletApprovedUrl);
    return result.data;
  };

  export async function getQuestionEmailAddress(questionMintId: string): Promise<string> {
    /* Input: user wallet address
       Output: boolean of whether user has been asked previously for email already
    */
    const getQuestionEmailAddressUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'getGMNHUserEmail' + `/${questionMintId}`;

    //TODO: ADD ERROR HANDLING
    const result = await axios.get(getQuestionEmailAddressUrl);
    return result.data;
  };




  export async function checkHasUserBeenAsked(userWalletAddress: string): Promise<boolean> {
    /* Input: user wallet address
       Output: boolean of whether user has been asked previously for email already
    */
    const hasUserBeenAskedUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'queryAirtableHasUserBeenAsked' + `/${userWalletAddress}`;

    //TODO: ADD ERROR HANDLING
    const result = await axios.get(hasUserBeenAskedUrl);

    return result.data;
  };


 export async function addUserInfoAirtable(userWalletAddress: string, userEmailAddress: string): Promise<boolean> {
    /* Input: user wallet address & user email address
       Output: boolean of whether user has been successfully added to Airtable
    */
    const addUserInfoAirtableUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'addUserInfoAirtable/';
  
    const data = new FormData();
    data.append('userWalletAddress', userWalletAddress);
    data.append('userEmailAddress', userEmailAddress);

    const result = await axios.post(addUserInfoAirtableUrl, data, { });

    return result.data;
 }

  export async function getGMNHUserEmailAddress(userWalletAddress: string): Promise<string> {
    /* Input: user wallet address & email type & question link that was answered
       Output: boolean of whether user has been successfully notified
    */
    const GMNHUserEmailAddressUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'getGMNHUserEmailAddress/';
  
    const data = new FormData();
    data.append('userWalletAddress', userWalletAddress);

    const result = await axios.post(GMNHUserEmailAddressUrl, data, { });

    return result.data;
 }