import pinataSDK, { PinataClient, PinataPinListResponse, PinataPinListResponseRow } from '@pinata/sdk';
import { PNFT } from '@/common/helpers/types';
import { DEFAULTS } from '@/globals';

export default function usePinata() {
  const pinata = pinataSDK(DEFAULTS.PINATA_API_KEY, DEFAULTS.PINATA_API_SECRET);

  const hashToURI = (hash: string) => `https://gateway.pinata.cloud/ipfs/${hash}`;

  const URIToHash = (uri: string) => uri.substring(uri.lastIndexOf("/") + 1, uri.length);

  const searchByMintId =  async(mintId: string) => {
    /* Search Pinata account by mintId
    */
    const metadataFilter = {
      keyvalues: {
        mintId: {
              value: mintId,
              op: 'eq'
          }      
      },
    };
  
    const filters = {
        status : 'pinned',
        pageLimit: 1,
        pageOffset: 0,
        metadata: metadataFilter
    };

    const res = (await pinata.pinList(filters))
    const pnfts = (await convertTicketsToPNFTs(res.rows));
    return pnfts;
  };

  const retrieveByMintId =  async(mintId: string) => {
    /* Search Pinata account for open NTF tickets & 
       preprocess retrieved metadata by saving as PNFT objects
    */

    const pinata_results = await searchByMintId(mintId!);
    const pnfts = (await convertTicketsToPNFTs(pinata_results));

    return pnfts;


      //NO LONGER NEED THIS SINCE WE'RE STORING ANSWER TEXT direclty in question metadata
   // await pnfts.forEach(pnft => getAnswerText(pnft)); 
  };

  async function convertTicketsToPNFTs(tokens: PinataPinListResponseRow[]): Promise<PNFT[]> {
    /* Convert tickets from Pinata search by cross-mapping data to new objects in memory
       Takes PinataPinListResponseRow[] ----> PNFT
    */
    return Promise.all(tokens.map(async (t) =>
        (
          {
          id: t.id,
          user_id: t.user_id,
          size: t.size,
          ipfs_pin_hash: t.ipfs_pin_hash,
          date_pinned: t.date_pinned,
          date_unpinned: t.date_unpinned,
          metadata: t.metadata,
        })
      )
    )
  }

  return {
    hashToURI,
    URIToHash,
    convertTicketsToPNFTs,
    searchByMintId,
    retrieveByMintId,
  };
}

usePinata();
