import pinataSDK, { PinataClient, PinataPinListResponse, PinataPinListResponseRow } from '@pinata/sdk';
import { DEFAULTS } from '@/globals';

export default function usePinata() {
  const pinata = pinataSDK(DEFAULTS.PINATA_API_KEY, DEFAULTS.PINATA_API_SECRET);

  const hashToURI = (hash: string) => `https://gateway.pinata.cloud/ipfs/${hash}`;

  const URIToHash = (uri: string) => uri.substring(uri.lastIndexOf("/") + 1, uri.length);

  return {
    hashToURI,
    URIToHash,
  };
}

usePinata();
