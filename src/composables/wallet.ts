/*this composable is to support the fancier UX from solava-vue-wallets */

import {ref, computed, shallowRef, Ref } from 'vue';

import { PublicKey } from '@solana/web3.js';
import { useWallet } from 'solana-wallets-vue';

export default function getWallet() {
  const getWalletAddress = (): PublicKey | null => { return useWallet().publicKey.value; };
  const isConnected = computed(() => useWallet().connected.value);

  return {
    isConnected,
    getWalletAddress
  };
}
