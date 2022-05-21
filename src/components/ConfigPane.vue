<template>
  <div class="gmnh-center flex justify-center content-center">
        <wallet-multi-button dark></wallet-multi-button>
    <!--<div class="nes-select is-dark flex-1">
      <select required id="cluster" v-model="chosenCluster">
        <option :value="Cluster.Mainnet">Mainnet</option>
        <option :value="Cluster.Devnet">Devnet</option>
        <option :value="Cluster.Testnet">Testnet</option>
        <option :value="Cluster.Localnet">Localnet</option>
      </select>
    </div>-->
 <!--   <select class="form-select bg-black text-primary" required id="wallet" v-model="chosenWallet">
      <option :value="null">Connect wallet..</option>
      <option :value="WalletName.Phantom">Phantom</option>
      <option :value="WalletName.Sollet">Sollet</option>
      <option :value="WalletName.SolletExtension">Sollet Extension</option>
      <option :value="WalletName.Solflare">Solflare</option>
      <option :value="WalletName.SolflareWeb">Solflare Web</option>
    </select> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
//import { WalletName } from '@solana/wallet-adapter-wallets';
import { WalletMultiButton } from 'solana-wallets-vue'
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { initWallet } from 'solana-wallets-vue';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const walletOptions = {
    wallets: [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Testnet}),
    ]
}

export default defineComponent({
  components: {
    WalletMultiButton
  },
  setup() {

    

  //  initWallet(walletOptions);

    return {
    };
  },
});
</script>

<style scoped>
.gmnh-center {
  margin: 0 auto;
}
</style>
