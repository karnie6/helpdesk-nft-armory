<template>
  <!-- no mobile -->
  <!--<TheMobileCover v-if="$isMobile()" /> -->
  <div class="relative h-full min-h-screen">
    <!--navbar + logo-->
    <TheNavBar />
      
 <!-- <div v-if="isConnected && shouldShowEmailModal" class="modal" tabindex="-1" style="display: block">
  <div class="modal-dialog" style="margin-top: 200px;">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Enter Email Address</h5>
        <button type="button" v-on:click="shouldShowEmailModal=false" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form v-if="!emailSubmitted" @submit.prevent="enterEmail" class="flex-grow">
        <div style="margin: 10px">Enter your email address so we can notify you when your questions get answered.</div>
        <input type="text" id="emailAddress" placeholder="What's your email address?" class="nes-input gmnh-question focus-visible" v-model="emailAddress" />
        <div class="modal-footer">
        <button v-on:click="shouldShowEmailModal=false" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button
          class="btn btn-primary"
          type="submit"
        >
          Get Notified
        </button>
        </div>
      </form>
      <div v-if="emailSubmitted" style="margin: 10px">
        Thank you for submitting your email.
      </div>
    </div>
  </div>
</div> -->

      <!-- tabs -->
      <div v-if="$route.name !== 'Ticket Details' && isWalletApprovedFlag" class="container mt-3">
        <tabs @tabChanged="tabChanged">
          <tab title="Ask Question" >
      <div v-if="showInstructions" class="row g-4 row-cols-1 row-cols-lg-3">
      <div class="col d-flex align-items-start instruction">
      <!--  <div class="icon-square d-inline-flex align-items-center justify-content-center fs-4 me-3">
          <img style="display: inline;" src="one.png"/>
        </div> -->
        <div>
          <h4 class="instruction-header">1. Ask for help</h4>
          <p class="instruction-text">Ask us any crypto/web3 question (concepts, recent news, tech support, you name it)!</p>
        </div>
      </div>
      <div class="col d-flex align-items-start instruction">
        <!-- <div class="icon-square bg-light text-dark d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
          <svg class="bi" width="1em" height="1em"><use xlink:href="#cpu-fill"></use></svg>
        </div> -->
        <div>
          <h4 class="instruction-header">2. Get an answer in your inbox</h4>
          <p class="instruction-text">We'll notify you via email with a personalized answer from our community of crypto experts (often in less than 1 hr).</p>
        </div>
      </div>
      <div class="col d-flex align-items-start instruction">
       <!-- <div class="icon-square d-inline-flex align-items-center justify-content-center fs-4 me-3">
          <img style="display: inline" height="10em" src="number1.svg"/>
        </div> -->
        <div>
          <h4 class="instruction-header">3. Mint a free NFT (optional)</h4>

          <p class="instruction-text">Commemorate your question and earn a NFT by connecting your Solana wallet above.</p>
        </div>
      </div>
    </div>
                  <section class="mt-3">
                    <IWantUrNFTForm :is-question=true v-bind:clearAskQuestion="clearAskQuestion" @submitted="submitted"/>
                  </section>
               <!--   <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to ask a question!</span>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
                  </section> -->
          </tab>
          <tab title="My Questions">
            <section v-if="isConnected">
              <QuestionList tabType="myQuestions" v-bind:updateMyQuestions="updateMyQuestions" />
            </section>
            <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to view your questions.</span>
                   <!-- <ConfigPane/> -->
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section>
          </tab>
          <tab title="Open Questions">
            <section v-if="isConnected">
              <QuestionList tabType="openQuestions" v-bind:updateOpenQuestions="updateOpenQuestions"/>
            </section>
            <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to answer a question!</span>
                   <!-- <ConfigPane/> -->
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section>
          </tab>
          <tab title="See Answers">
            <section>
              <QuestionList tabType="answeredQuestions" v-bind:updateAnsweredQuestions="updateAnsweredQuestions"/>
            </section>
        <!--    <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to answer a question!</span>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section> -->
          </tab>
        </tabs>
      </div>
      <div v-else-if="$route.name !== 'Ticket Details' && !isWalletApprovedFlag" class="container mt-3">
        <tabs @tabChanged="tabChanged">
          <tab title="Ask Question" >
           <div v-if="showInstructions" class="row g-4 row-cols-1 row-cols-lg-3">
      <div class="col d-flex align-items-start instruction">
      <!--  <div class="icon-square d-inline-flex align-items-center justify-content-center fs-4 me-3">
          <img style="display: inline;" src="one.png"/>
        </div> -->
        <div>
          <h4 class="instruction-header">1. Ask for help</h4>
          <p class="instruction-text">Ask us any crypto/web3 question (concepts, recent news, tech support, you name it)!</p>
        </div>
      </div>
      <div class="col d-flex align-items-start instruction">
        <!-- <div class="icon-square bg-light text-dark d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
          <svg class="bi" width="1em" height="1em"><use xlink:href="#cpu-fill"></use></svg>
        </div> -->
        <div>
          <h4 class="instruction-header">2. Get an answer in your inbox</h4>
          <p class="instruction-text">We'll notify you via email with a personalized answer from our community of crypto experts (often in less than 1 hr).</p>
        </div>
      </div>
      <div class="col d-flex align-items-start instruction">
       <!-- <div class="icon-square d-inline-flex align-items-center justify-content-center fs-4 me-3">
          <img style="display: inline" height="10em" src="number1.svg"/>
        </div> -->
        <div>
          <h4 class="instruction-header">3. Mint a free NFT (optional)</h4>

          <p class="instruction-text">Commemorate your question and earn a NFT by connecting your Solana wallet above.</p>
        </div>
      </div>
    </div>
                  <section class="mt-3">
                    <IWantUrNFTForm :is-question=true v-bind:clearAskQuestion="clearAskQuestion" @submitted="submitted"/>
                  </section>
               <!--   <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to ask a question!</span>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
                  </section> -->
          </tab>
          <tab title="See Answers">
            <section>
              <QuestionList tabType="answeredQuestions" v-bind:updateAnsweredQuestions="updateAnsweredQuestions"/>
            </section>
        <!--    <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to answer a question!</span>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section> -->
          </tab>
        </tabs>
      </div>
      <div v-else-if="$route.name == 'Ticket Details'">
        <TicketDetail/>
      </div>
  </div>


</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed} from 'vue';
import TheLogo from '@/components/TheLogo.vue';
import TheNavBar from '@/components/TheNavBar.vue';
import ConfigPane from '@/components/ConfigPane.vue';
import TheFooter from '@/components/TheFooter.vue';
import IWantUrNFTForm from '@/components/IWantUrNFTForm.vue';
import QuestionList from '@/components/QuestionList.vue';
import TicketDetail from '@/components/TicketDetail.vue';
import TheMobileCover from '@/components/TheMobileCover.vue';

import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';
import {checkHasUserBeenAsked, addUserInfoAirtable} from '@/composables/gmnh-service';
import getWallet from './composables/wallet';
import {isWalletApproved} from './composables/gmnh-service'

const isWalletApprovedFlag = ref<Boolean>(false);
const clearAskQuestion = ref<Boolean>(false);
const updateMyQuestions = ref<Boolean>(false);
const updateOpenQuestions = ref<Boolean>(false);
const updateAnsweredQuestions = ref<Boolean>(false);
const shouldShowEmailModal = ref<Boolean>(false);
const emailSubmitted = ref<Boolean>(false);
const showInstructions = ref<Boolean>(true);

const { isConnected, getWalletAddress } = getWallet();

const emailAddress = ref('');

export default defineComponent({
  components: { TheFooter, TheLogo, ConfigPane, TheNavBar, Tab, Tabs, IWantUrNFTForm, QuestionList, TicketDetail, TheMobileCover},

  methods: {
    submitted: function() {
        showInstructions.value = false;
    },
    tabChanged: function (index:Number) {
      if (index == 0) {
        clearAskQuestion.value = true;
        updateMyQuestions.value = false;
        updateOpenQuestions.value = false;
        updateAnsweredQuestions.value = false;
        showInstructions.value = true;
      }
      if (index == 1) {
        //since only two tabs when
        if (isWalletApprovedFlag) {
          clearAskQuestion.value = false;
          updateMyQuestions.value = false;
          updateOpenQuestions.value = false;
          updateAnsweredQuestions.value = true;
        } else {
        clearAskQuestion.value = false;
        updateMyQuestions.value = true;
        updateOpenQuestions.value = false;
        updateAnsweredQuestions.value = false;
        }
      } else if (index == 2) {
        clearAskQuestion.value = false;
        updateMyQuestions.value = false;
        updateOpenQuestions.value = true;
        updateAnsweredQuestions.value = false;
      } else if (index == 3) {
        clearAskQuestion.value = false;
        updateMyQuestions.value = false;
        updateOpenQuestions.value = false;
        updateAnsweredQuestions.value = true;
      }
    }
  },
  watch: { 
    isConnected: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue && isConnected) {
            isWalletApproved(getWalletAddress()!.toBase58()).
            then(async (result) => {
              isWalletApprovedFlag.value = result;
            });

        }

        if (!newValue) {
          isWalletApprovedFlag.value = false;
        }
      }
    }   
  },
  setup() {
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => {
      windowWidth.value = window.innerWidth;
    };
    onMounted(() => window.addEventListener('resize', onWidthChange));
    onUnmounted(() => window.removeEventListener('resize', onWidthChange));

    const enterEmail = async () => {
      if (isConnected) {

        addUserInfoAirtable(getWalletAddress()!.toBase58().toString(), emailAddress.value).
            then(async (result) => {
              //once email address has been added, set value to true so we can update modal
              emailSubmitted.value = true;
            });

        ;
      }
    }

    return {
      windowWidth,
      isConnected,
      isWalletApprovedFlag,
      getWalletAddress,
      clearAskQuestion,
      updateMyQuestions,
      showInstructions,
      updateOpenQuestions,
      updateAnsweredQuestions,
      emailAddress,
      shouldShowEmailModal,
      enterEmail,
      emailSubmitted
    };
  },
});
</script>

<style>
.gmnh-wallet-center {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.wallet-text {
  font-family: Inter;
  font-weight: 700;
  font-size: 16px;
  color: #F2F4F8;
}

.no-wallet-text {
  font-family: Inter;
  font-weight: 700;
  font-size: 14px;
  color: #F2F4F8;
  justify-content: center;
  display: flex;
  margin-top: 16px;
}

a.phantom-link {
  color: #0d6efd;
  text-decoration: underline;
}

#emailAddress {
  margin: 10px; 
  width: 400px; 
  padding: 5px;

}

.instruction {
  color: #FFFFFF;
  margin-bottom: 0em;
}

.instruction-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0.5em;
  margin-top: 0.5em;
}

.instruction-text {
  font-size: 14px;
}

</style>
