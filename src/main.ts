import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import VueGtag from 'vue-gtag';
import 'bootstrap/dist/css/bootstrap.min.css'
import {DEFAULTS} from './globals';
//import './bootstrap.min.css';
import './style.css';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import SolanaWallets from 'solana-wallets-vue';
import { initWallet } from 'solana-wallets-vue';
// You can either import the default styles or create your own.
import 'solana-wallets-vue/styles.css';

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const walletOptions = {
    wallets: [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Testnet}),
    ],
    autoConnect: true,
  }

//initWallet(walletOptions);

createApp(App)
  .use(router)
  .use(VueGtag, {
    config: { id: 'G-6MN98MZZPL' },
  })
  .use(SolanaWallets, walletOptions)
  .mount('#app');
