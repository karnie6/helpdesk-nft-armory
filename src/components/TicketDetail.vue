<template>
    <div class="question-nav"><a href="/" class="gmnh-back">&laquo; Back</a></div> 
    <div v-if="doesQuestionExist && !errorFinding" direction="vertical" class="gmnh-detail">
      <div v-for="(n, idx) in question" :key="n.id" :id="idx">     
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}</div>
            <div class="gmnh-tab-content-byline">Asked {{getUserName(n)}} {{getFormattedDatePinned(n)}}</div>
            <div class="gmnh-tab-content-description">{{getDescription(n)}}</div>

            <div v-for="(a, idx) in answersToQuestion" :key="a.id" :id="idx">
                <hr style="border: 5px solid #219653;"/>
                <div class="gmnh-tab-content-status">{{readTicketName(a)}}</div>
              </div>
<!--            <img class="gmnh-tab-content-nft" v-bind:src="getImageUrl(n)"/> -->
            <div v-if="!isConnected" style="margin: 0 auto;">
                    <span class="wallet-text" style="justify-content: center; display: flex; margin-top: 16px;">Connect your Solana wallet to answer this question!</span>
                  <!--  <ConfigPane/> -->
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </div>
            <div v-else-if="needsToBeAnswered(n)">
              <IWantUrNFTForm :questionID="getQuestionId(n)" :hash="getIPFSHash(n)" :fromQuestionDetail="true"/>
            </div>
      </div>

    </div>
    <div v-if="errorFinding" class="gmnh-detail gmnh-tab-content-title">
      Question Not Found!
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
// @ts-ignore
import { PublicKey } from '@solana/web3.js';

import getWallet from '@/composables/wallet';
import useError from '@/composables/error';
import { INFT } from '@/common/helpers/types';
import { useRoute } from 'vue-router';
import NFTViewCard from '@/components/NFTViewCard.vue';
import ConfigPane from '@/components/ConfigPane.vue';
import useCluster, { Cluster } from '@/composables/cluster';
import IWantUrNFTForm from '@/components/IWantUrNFTForm.vue';
import * as pnftInteractions from '@/composables/pnftInteractions';
import { PNFT } from '@/common/helpers/types';
import { retrieveAnswersFromGMNH, retrieveMintFromGMNH} from '@/composables/gmnh-service';


const question = ref<PNFT[]>([]); // this is everything fetched in mem

const answersToQuestion = ref<PNFT[]>([]); //answer(s) to one question
const ticket = ref<INFT | null>(null);
const ticketID = ref<string | null>(null);
const errorFinding = ref<boolean>(false);


export default defineComponent({
  components: {
    NFTViewCard, IWantUrNFTForm, ConfigPane
  },
  computed: {
    doesQuestionExist() {
      return question.value.length > 0;
    }
  },
  methods: {
      readTicketName: function(ticket: PNFT) {
      return pnftInteractions.readTicketName(ticket)
    }, getImageUrl: function(ticket: PNFT) {
      return pnftInteractions.getImageURL(ticket)
    }, getQuestionId: function(ticket: PNFT) {
      return pnftInteractions.readMintID(ticket);  
    }, getIPFSHash: function(ticket: PNFT) {
      return pnftInteractions.readIPFSHash(ticket);  
    }, getAnswer: function(ticket: PNFT) {
      return pnftInteractions.getAnswerText(ticket);
    }, needsToBeAnswered: function(ticket: PNFT) {
      return pnftInteractions.needsToBeAnswered(ticket);
    }, getDescription: function(ticket: PNFT) {
      return pnftInteractions.readDescription(ticket);
    }, getUserName: function(ticket: PNFT) {
      return pnftInteractions.readUserName(ticket);
    }, getFormattedDatePinned: function(ticket: PNFT){
      return pnftInteractions.formatBylineTicketDatetime(pnftInteractions.readDatePinned(ticket));
    },
  },
  setup() {

    //todo: temporary, but set to DEV for now
    const { cluster, setCluster, getClusterURL } = useCluster();
  
    const { isConnected, getWalletAddress } = getWallet();
    const { error, clearError, setError } = useError();

    //grabbing ticketID from URL
    
      const route = useRoute();
      const {
        ticketID: goTicketID
      } = route.params;

      if (goTicketID !== undefined || goTicketID !== null) {
          ticketID.value = goTicketID as any as string;

          retrieveMintFromGMNH(ticketID.value!) 
          .then((pinataTickets) => {
            
          if (pinataTickets.length && pinataTickets.length == 1) {
            question.value = pinataTickets;

          //load answers
          retrieveAnswersFromGMNH(ticketID.value!).then((answers) => {
                  answersToQuestion.value = answers;
          });  
        } else {
          errorFinding.value = true;
            //TODO: add error message
        //  updateLoadingStdErr(ERR_NO_NFTS);
        }
      }) 

         // fetchTicket(ticketID.value);
      }

      
    

     return {
         isConnected,
        ticketID: ticketID,
        question: question,
        errorFinding,
        answersToQuestion: answersToQuestion
        };
  
  },
});
</script>

<style scoped>
.gmnh-detail {
  margin: 16px;
}

.gmnh-tab-content-title {
    font-size: 24px;
    color: #F2F4F8;
}

.gmnh-tab-content-byline {
    font-size: 12px;
    color: #878D96;
}

.gmnh-tab-content-status {
    font-size: 16px;
    font-weight: bold;
    color: #F2F4F8;
    margin-top: 10px;
    white-space: pre-wrap;
}

.gmnh-tab-content-description {
    font-size: 14px;
    color: #878D96;
    margin-top: 8px;
    white-space: pre-wrap;
}

.gmnh-tab-content-nft {
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
    width: 150px;
}

a.gmnh-back {
  text-decoration: none;
  display: inline-block;
  padding: 8px 16px;
}

a.gmnh-back:hover {
  background-color: #ddd;
  color: black;
}

.gmnh-back {
  background-color: #f1f1f1;
  color: black;
}

.question-nav {
  margin: 16px;
}

.gmnh-answer-wallet-text {
  display: flex;
  justify-content: center;
}
</style>
