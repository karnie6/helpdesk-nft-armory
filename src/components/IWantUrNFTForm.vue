<template>
  <div>
      <div class="flex mt-10 text-white" style="background: #343A3F; ">
      <form v-if="isQuestion && !isLoading" @submit.prevent="createTicket">

      <!--  <input focus-visible type="text" id="emailAddress" maxlength="255" placeholder="Enter email address..." class="nes-input gmnh-question" v-model="emailAddress" /> -->
        <input for="email" focus-visible type="email" maxlength="255" placeholder="What's your email?" class="nes-input gmnh-question" v-model="emailAddress" />
        <input type="text" id="nftName" maxlength="255" placeholder="What's your question?" class="nes-input gmnh-question" v-model="nftName" />

        <div><textarea type="text" id="description" placeholder="Add context/background..." class="nes-input gmnh-description" v-model="description" /></div>

        <button
          class="gmnh-question-submit"
          :class="{ 'is-disabled': isLoading }"
          :disabled="isLoading"
          type="submit"
        >
          Ask Question
        </button>
      </form>
      <form v-if="!isQuestion && !isLoading && isWalletApprovedFlag" @submit.prevent="createAnswer" class="flex-grow">
        <div v-if="!fromQuestionDetail"><textarea focus-visible type="text" id="nftName" placeholder="Add answer.." class="nes-input gmnh-answer" v-model="nftName" /></div>
        <div v-else><textarea focus-visible type="text" id="nftName" placeholder="Add answer.." class="nes-input gmnh-answer-detail" v-model="nftName" /></div>
        <button v-if="!fromQuestionDetail"
          class="gmnh-answer-submit"
          :class="{ 'is-disabled': isLoading || !isConnected || !isWalletApprovedFlag }"
          :disabled="isLoading || !isConnected || !isWalletApprovedFlag"
          type="submit"
        >
          Answer Question
        </button>
        <button v-else
          class="gmnh-answer-submit gmnh-answer-submit-detail"
          :class="{ 'is-disabled': isLoading || !isConnected || isWalletApprovedFlag }"
          :disabled="isLoading || !isConnected || isWalletApprovedFlag"
          type="submit"
        >
          Answer Question
        </button>
    
      </form>

       <!--notifications-->
    
    <div v-if="isLoading" class="flex-grow">
      <StdNotifications v-if="!mintResult" :is-question="isQuestion" :is-connected="isConnected" :is-loading="isLoading" :is-created="isCreated" />
      <StdNotifications v-else :is-question="isQuestion" :is-connected="isConnected" :is-loading="isLoading" :is-created="isCreated" :mint-id="mintResult.mint"  />
    </div>
   <!-- <NotifySuccess v-if="mintResult" class="mt-5">
      <p>Mint successful! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!newNFT"
        >Loading your new NFT... (might take a min or two)</LoadingIcon
      >
      <div v-else>
        <ExplorerLink :tx-id="mintResult.txId" />
        <NFTViewCard :n="newNFT" class="text-black" />
      </div>
    </NotifySuccess> -->

      <div v-if="isQuestion && !isLoading" class="display display-canvas" id="canvas" :style="{ fontSize: `${textSize}px`} ">
        <p>{{ nftName.substring(0,254) }}</p>
      </div>
      <div v-else-if="!fromQuestionDetail && isWalletApprovedFlag" class=" display-answer display-canvas" v-bind:id="canvasIdentifier" :style="{ fontSize: `${textSize}px`} ">
        <p>{{ nftName.substring(0,254) }}</p>
      </div>
      <div v-else-if="isWalletApprovedFlag" class="display-answer-detail display-canvas" v-bind:id="canvasIdentifier" :style="{ fontSize: `${textSize}px`} ">
        <p>{{ nftName.substring(0,254) }}</p>
      </div>
   
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import html2canvas from 'html2canvas';
// @ts-ignore
import { PublicKey, Keypair } from '@solana/web3.js';
import { NodeWallet } from '@metaplex/js';
import {DEFAULTS} from '@/globals'
import usePinata from '@/composables/pinata';
import getWallet from '@/composables/wallet';
import useError from '@/composables/error';
import { IMintResult, INFT } from '@/common/helpers/types';
import StdNotifications from '@/components/StdNotifications.vue';
import NotifySuccess from '@/components/notifications/NotifySuccess.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import ExplorerLink from '@/components/ExplorerLink.vue';
import NFTViewCard from '@/components/NFTViewCard.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipIWantUrNFT from '@/components/content/tooltip/ContentTooltipIWantUrNFT.vue';
import useModal from '@/composables/modal';

import {getQuestionUserWalletId, formatTicketDetailLink} from '@/composables/pnftInteractions';
import {emailTypeAnswered, emailTypeResponder} from '@/composables/emailNotifications';
import {notifyGMNHUser} from '@/composables/emailNotifications';
import { createGMNHQuestion, createGMNHAnswer, retrieveMintFromGMNH, getQuestionEmailAddress, getGMNHUserEmailAddress} from '@/composables/gmnh-service';
import {isWalletApproved} from '@/composables/gmnh-service'

const isWalletApprovedFlag = ref<Boolean>(false);
const { isConnected, getWalletAddress } = getWallet();

export default defineComponent({
  components: {
    ContentTooltipIWantUrNFT,
    ModalWindow,
    NFTViewCard,
    ExplorerLink,
    LoadingIcon,
    NotifySuccess,
    StdNotifications,
  },
  props: {
    isQuestion: {type: Boolean},
    questionID: { type: String },
    uri: { type: String },
    hash: {type: String},
    clearAskQuestion: {type: Boolean},
    updateOpenQuestions: {type: Boolean},
    fromQuestionDetail: {type: Boolean}
  },
  watch: { 
    clearAskQuestion: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.isLoading = false;
          this.isCreated = false;
          this.mintResult = null;
          this.nftName = '';
          this.emailAddress = '';
          this.description = '';
        }
      }
    }, updateOpenQuestions: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.isLoading = false;
          this.isCreated = false;
          this.mintResult = null;
          this.nftName = '';
          this.description = '';
        }
      }
    },
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
  },
  },
  setup(props, { emit }) {
    const isLoading = ref<boolean>(false);
    const isCreated = ref<boolean>(false);
    const mintResult = ref<IMintResult | null>(null);
    const newNFT = ref<INFT | null>(null);
    const contactDets = ref('BLANK');
    const textSize = ref(16);
    const nftName = ref('');
    const emailAddress = ref('');
    const description = ref('');

    const canvasIdentifier = computed(() => {return "canvas-" + props.hash});

    const { clearError, setError } = useError();

    const reset = () => {
      isLoading.value = true;
      isCreated.value = false;
      mintResult.value = null;
      newNFT.value = null;
      clearError();
    };

    // --------------------------------------- prep metadata    
    const generateImgQuestionForGMNHService = async () => {
      const canvas = await html2canvas(document.getElementById('canvas')!);
      return canvas.toDataURL('image/png');

    };

    const generateImgAnswerForGMNHService = async () => {
      const canvas = await html2canvas(document.getElementById(canvasIdentifier.value)!);
      return canvas.toDataURL('image/png');
    };

    const createTicket = async () => {
      //switch to loading view
      reset();
      
      //create NFT
      const img = await generateImgQuestionForGMNHService();      
      await createGMNHQuestion(img, nftName.value!, description.value!, emailAddress.value!, getWalletAddress()! )
      .then(async (result) => {
        mintResult.value = result;
        isCreated.value = true;
      }).catch((e) => {
          console.log('error occured when creating a question: ', e);
          setError(e);
          isLoading.value = false;
        });
    };

    const sendEmailUpdateQuestionAsker = async() => {
      /*  Send email to question asker to let them know their question was answered
          Flow: questionId -> user walletId -> GMNH Users Airtable
      */
        if (typeof props.questionID != 'undefined'){

            let questionUserIDWallet = undefined
            let ticketLink = formatTicketDetailLink(props.questionID, DEFAULTS.APP_URL)

            retrieveMintFromGMNH(props.questionID) 
                .then((pinataTickets) => {

                if (pinataTickets.length && pinataTickets.length == 1) {
                  questionUserIDWallet = getQuestionUserWalletId(pinataTickets[0]);
                 // notifyGMNHUser(questionUserIDWallet.toString(), emailTypeAnswered, ticketLink)
                  getGMNHUserEmailAddress(questionUserIDWallet).then(async (userEmailAddress) =>
                       {
                         notifyGMNHUser(userEmailAddress, emailTypeAnswered, ticketLink);
                       }
                  )
              }
            }) 
      
        }
    } 

    const sendEmailUpdateQuestionAskerAMA = async() => {
      /*  Send email to question asker to let them know their question was answered
          Flow: questionMintId-> GMNH Users Airtable
      */
        if (typeof props.questionID != 'undefined'){

            let ticketLink = formatTicketDetailLink(props.questionID, DEFAULTS.APP_URL)

            await getQuestionEmailAddress(props.questionID)
            .then(async (result) => {
                  notifyGMNHUser(result,emailTypeAnswered, ticketLink);
            }).catch((e) => {
              console.log('error sending email back to question asker', e);
              setError(e);
            });
        }
    } 

      const sendEmailUpdateQuestionResponder = async() => {
      /*  Send email to question responder to reconfirm their answer was posted
          Flow: user walletId -> GMNH Users Airtable
      */
        let userWalletId = getWalletAddress() ? getWalletAddress()?.toString() : undefined

        if (typeof userWalletId != 'undefined' && typeof props.questionID != 'undefined'){
            let ticketLink = formatTicketDetailLink(props.questionID, DEFAULTS.APP_URL)
            getGMNHUserEmailAddress(userWalletId).then(async (userEmailAddress) =>
                       {
                         notifyGMNHUser(userEmailAddress, emailTypeAnswered, ticketLink);
                       }
            )
        } else{
        }
      
    }

    const createAnswer = async () => {
      //switch to loading view
      reset();
      
      //create NFT
      const img = await generateImgAnswerForGMNHService();      
      await createGMNHAnswer(img, nftName.value!, props.questionID!, props.hash!, getWalletAddress()! )
      .then(async (result) => {
        mintResult.value = result;
        isCreated.value = true;
      }).catch((e) => {
          console.log('error occured when creating a answer: ', e);
          setError(e);
          isLoading.value = false;
      });

        // Email question asker about their question being answered
        //sendEmailUpdateQuestionAsker();
        sendEmailUpdateQuestionAskerAMA();

        // Email question responder about their answer
        // sendEmailUpdateQuestionResponder();
    }

    // --------------------------------------- modals
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipWant');

    return {
      isConnected,
      isWalletApprovedFlag,
      isCreated,
      isLoading,
      mintResult,
      newNFT,
      emailAddress,
      // prep
      nftName,
      contactDets,
      textSize,
      // mint
      createTicket,
      createAnswer,
      // modals
      isModalVisible,
      showModal,
      hideModal,
      canvasIdentifier,
      description
    };
  },
});
</script>

<style scoped>
.display {
  @apply text-center flex flex-col justify-center align-middle ml-10 mt-2;
  background-color: #219653;
  width: 250px;
  height: 250px;
  margin: 16px;
  word-wrap: break-word;
}

.display-answer {
  @apply text-center flex flex-col justify-center align-middle ml-10 mt-2;
  background-color: #219653;
  width: 250px;
  height: 250px;
  margin-right: 16px;
  margin-bottom: 16px;
  margin-top: 0px;
  word-wrap: break-word;
}

.display-answer-detail {
  @apply text-center flex flex-col justify-center align-middle ml-10 mt-2;
  background-color: #219653;
  width: 250px;
  height: 250px;
  margin-right: 16px;
  margin-bottom: 16px;
  margin-top: 16px;
  word-wrap: break-word;
}

.gmnh-question {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 16px;

position: static;
width: 816px;
height: 57px;
left: 0px;
top: 0px;

/* Gray-90 */

background: #21272A;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
margin: 16px 16px;
}

.gmnh-description {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 16px;

position: static;
width: 816px;
height: 131px;
left: 0px;
top: 0px;

/* Gray-90 */

background: #21272A;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
margin: 16px 16px;
}

.gmnh-answer {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 16px;

position: static;
width: 416px;
height: 131px;
left: 0px;
top: 0px;

/* Gray-90 */

background: #21272A;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}

.gmnh-answer-detail {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 16px;
margin: 16px;

position: static;
width: 816px;
height: 131px;
left: 0px;
top: 0px;

/* Gray-90 */

background: #21272A;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}

.gmnh-question-submit {
flex-direction: row;
align-items: flex-start;
position: static;
width: 169px;
height: 47px;
left: 0px;
top: 73px;

background: #082CAB;
/* Gray-90 */
box-sizing: border-box;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
margin: 16px 16px;
}

.gmnh-answer-submit {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 14px 20px;

position: static;
width: 169px;
height: 47px;
left: 0px;
top: 73px;

background: #082CAB;
/* Gray-90 */
box-sizing: border-box;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
margin-top: 16px;
}

.gmnh-answer-submit-detail {
margin: 16px;
}

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #f2f4f8;
  opacity: 1; /* Firefox */
}
</style>
