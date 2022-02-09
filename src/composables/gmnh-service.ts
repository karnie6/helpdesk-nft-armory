import { DEFAULTS } from "@/globals";
import {PNFT} from "@/common/helpers/types"

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



