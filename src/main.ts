import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import VueGtag from 'vue-gtag';
import 'bootstrap/dist/css/bootstrap.min.css'
//import './bootstrap.min.css';
import './style.css';
import VueMobileDetection from 'vue-mobile-detection'

if (process.env.VUE_APP_MAINNET_URL && process.env.VUE_APP_MAINNET_URL!.includes('genesysgo')) {
  console.log('powered by gg');
}

createApp(App)
  .use(router)
  .use(VueGtag, {
    config: { id: 'G-6MN98MZZPL' },
  })
  .use(VueMobileDetection) // enable usage of $isMobile() with App.vue for Mobile Cover
  .mount('#app');
