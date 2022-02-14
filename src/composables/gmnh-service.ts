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

export async function uploadImage (img: string, walletAddr: PublicKey): Promise<string> {

    const uploadImgUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'uploadImage';

    const data = new FormData();
    data.append('file', img);

    const metadata = JSON.stringify({
      name: `${walletAddr.toBase58()}.png`,
    });
    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    data.append('pinataOptions', pinataOptions);

    const res = await axios.post(uploadImgUrl, data, { });

    return res.data.IpfsHash;
  };


  export async function createGMNHQuestion (img: string, title: string, description: string, walletAddr: PublicKey): Promise<IMintResult> {

    const createQuestionUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'createQuestion';

    const data = new FormData();
    data.append('file', img);
    data.append('title', title);
    data.append('description', description);
    data.append('userWalletAddr', walletAddr.toBase58());

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



  export async function checkHasUserBeenAsked(userWalletAddress: string): Promise<boolean> {
    /* Input: user wallet address
       Output: boolean of whether user has been asked previously for email already
    */
    const hasUserBeenAskedUrl = DEFAULTS.GMNH_SERVICE_APP_URL + 'queryAirtableHasUserBeenAsked' + `/${userWalletAddress}`;

    //TODO: ADD ERROR HANDLING
    const result = await axios.get(hasUserBeenAskedUrl);

    return result.data;
  };



