import events from 'events';
import * as dotenv from 'dotenv';

export const EE = new events.EventEmitter.EventEmitter();

// --------------------------------------- errors

export const ERR_NO_NFTS = new Error('No NFTs Found:( Are you on the right network?');

// ---------------------------------------  defaults

dotenv.config();
console.log(process.env);

console.log('process: ', process.env.SOLANA_ENV);

export const DEFAULTS = {
  CLUSTER: process.env.SOLANA_ENV ? process.env.SOLANA_ENV : 'devnet',

  OWNER: 'AEahaRpDFzg74t7NtWoruabo2fPJQjKFM9kQJNjH7obK',
  CREATOR: '9px36ZsECEdSbNAobezC77Wr9BfACenRN1W8X7AUuWAb',
  AUTHORITY: '9px36ZsECEdSbNAobezC77Wr9BfACenRN1W8X7AUuWAb',
  MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',

  URI: 'https://gateway.pinata.cloud/ipfs/Qmawjub6LNBQUZ9KnVLMobf3bUiKwjusKpb52p86k5SAZG',
  MAX_SUPPLY: null,

  MASTER_MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',
  UPDATE_AUTHORITY: null,

  NFT_MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',
  METADATA: null,
  PRIMARY_SALE: null,

  METADATA_PROGRAM_ID: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
};
