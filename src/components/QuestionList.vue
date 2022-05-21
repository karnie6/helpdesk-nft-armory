<template>  
  <tabs v-if="doMyQuestionsExist && (tabType == 'myQuestions')" direction="vertical" v-model="myQuestionList" @tabChanged="tabChanged">
      <tab v-for="(n, idx) in myQuestionList" :key="n.id" :id="idx" :title='readTicketName(n)' :mintId='readMintId(n)'>     
        <div class="gmnh-tab-content">
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}
              <span><a :href="`/question/${readMintId(n)}`" target="_blank"><img width=20 style="display: inline" src="copy_link.png"/></a></span>
            </div>
            <div class="gmnh-tab-content-byline">Asked by you {{getFormattedDatePinned(n)}} </div>
            <div class="gmnh-tab-content-description">{{getDescription(n)}}</div>
            
            <div v-if="!areAnswersLoading">
              <div v-for="(a, idx) in answersToQuestion" :key="a.id" :id="idx">
                <hr style="border: 5px solid #219653;"/>
                <div class="gmnh-tab-content-status">{{readTicketName(a)}}</div>
              </div>
            </div>
        </div> 
    </tab>
   </tabs>

    <tabs v-if="doOpenQuestionsExist && (tabType == 'openQuestions')" direction="vertical" v-model="openQuestionList" @tabChanged="tabChanged">
      <tab v-for="(n, idx) in openQuestionList" :key="n.id" :id="idx" :title='readTicketName(n)' :mintId='readMintId(n)'>     
        <div class="gmnh-tab-content">
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}
              <span><a :href="`/question/${readMintId(n)}`" target="_blank"><img width=20 style="display: inline" src="copy_link.png"/></a></span>
            </div>
            <div class="gmnh-tab-content-byline">Asked {{getUserName(n)}} {{getFormattedDatePinned(n)}} </div>
            <div class="gmnh-tab-content-description">{{getDescription(n)}}</div>
            <IWantUrNFTForm @answer-submitted="answerSubmitted" :is-question=false :fromQuestionDetail=false v-bind:clearAskQuestion="clearAskQuestion" :questionID="getQuestionId(n)" :hash="getIPFSHash(n)" v-bind:updateOpenQuestions="updateOpenQuestions"/>        
        </div> 
    </tab>
   </tabs> 

   <tabs v-if="doAnsweredQuestionsExist && (tabType == 'answeredQuestions')" direction="vertical" v-model="answeredQuestions" @tabChanged="tabChanged">
      <tab v-for="(n, idx) in answeredQuestions" :key="n.id" :id="idx" :title='readTicketName(n)' :mintId='readMintId(n)'>     
        <div class="gmnh-tab-content">
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}
              <span><a :href="`/question/${readMintId(n)}`" target="_blank"><img width=20 style="display: inline" src="copy_link.png"/></a></span>
            </div>
         <!--   <div class="gmnh-tab-content-byline">Asked {{getUserName(n)}} {{getFormattedDatePinned(n)}}</div> -->
            <div class="gmnh-tab-content-description">{{getDescription(n)}}</div>
            
            <div v-if="!areAnswersLoading">
              <div v-for="(a, idx) in answersToQuestion" :key="a.id" :id="idx">
                <hr style="border: 5px solid #219653;"/>
                <div class="gmnh-tab-content-status">{{readTicketName(a)}}</div>
              </div>
            </div>

            <IWantUrNFTForm @answer-submitted="answerSubmitted" :is-question=false :fromQuestionDetail=false v-bind:clearAskQuestion="clearAskQuestion" :questionID="getQuestionId(n)" :hash="getIPFSHash(n)" v-bind:updateOpenQuestions="updateOpenQuestions"/>        

        </div> 
    </tab>
   </tabs>

<!--
       <QuestionItem v-for="n in PNFTs" :key="n.id" :n="n"></QuestionItem>

    -->
        
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'; 
import 'vue-json-pretty/lib/styles.css'; 
import getWallet from '@/composables/wallet';
import Tabs from '@/components/Tabs.vue';
import Tab from '@/components/Tab.vue';
import IWantUrNFTForm from '@/components/IWantUrNFTForm.vue';
import { PNFT } from '@/common/helpers/types';
import QuestionItem from '@/components/QuestionItem.vue';
import * as pnftInteractions from '@/composables/pnftInteractions'
import { getOpenQuestionsFromGMNH, getAnsweredQuestionsFromGMNH, getMyQuestionsFromGMNH, retrieveAnswersFromGMNH} from '@/composables/gmnh-service';
import {isWalletApproved} from '@/composables/gmnh-service'

const { isConnected, getWalletAddress } = getWallet();
const clearAskQuestion = ref<Boolean>(false);
const answersToQuestion = ref<PNFT[]>([]); //answer(s) to one question
const myQuestions = ref<PNFT[]>([]); // this is everything fetched in mem
const openQuestions = ref<PNFT[]>([]); // this is everything fetched in mem
const answeredQuestions = ref<PNFT[]>([]); // this is everything fetched in mem
const isWalletApprovedFlag = ref<Boolean>(false);

export default defineComponent({
  data() {
    return {
      componentKey: 0,
    };
  },
  watch: { 
    updateMyQuestions: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
             getMyQuestionsFromGMNH(getWalletAddress()!.toBase58()).then((myQuestionsFromGMNH) => {
              myQuestions.value = myQuestionsFromGMNH;

              if (myQuestionsFromGMNH.length > 0 && myQuestionsFromGMNH[0].metadata && myQuestionsFromGMNH[0].metadata.keyvalues) {
                //fetch answers for first item
                retrieveAnswersFromGMNH(myQuestionsFromGMNH[0].metadata.keyvalues.mintId).then((answers) => {
                  answersToQuestion.value = answers;
                });  
              }
            });
        }
      }
    },
    updateOpenQuestions: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
            getOpenQuestionsFromGMNH().then((openQuestionsFromGMNH) => {
              openQuestions.value = openQuestionsFromGMNH;
            });
        }
      }
    },
    updateAnsweredQuestions: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
            getAnsweredQuestionsFromGMNH().then((answeredQuestionsFromGMNH) => {
              answeredQuestions.value = answeredQuestionsFromGMNH;

            if (answeredQuestionsFromGMNH.length > 0 && answeredQuestionsFromGMNH[0].metadata && answeredQuestionsFromGMNH[0].metadata.keyvalues) {
                //fetch answers for first item
                retrieveAnswersFromGMNH(answeredQuestionsFromGMNH[0].metadata.keyvalues.mintId).then((answers) => {
                  answersToQuestion.value = answers;
                });  
              }  
          });
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
    } 
  },
  components: {
        QuestionItem, Tabs, Tab, IWantUrNFTForm
  },
  computed: {
    doMyQuestionsExist() {
      return myQuestions.value.length > 0;
    },
    doOpenQuestionsExist() {
      return openQuestions.value.length > 0;
    },
    doAnsweredQuestionsExist() {
      return answeredQuestions.value.length > 0;
    }
  },
  props: {
    tabType: { type: String, required: true},
    updateMyQuestions: {type: Boolean},
    updateOpenQuestions: {type: Boolean},
    updateAnsweredQuestions: {type: Boolean},

  },
  methods: {
      readTicketName: function(ticket: PNFT) {
      return pnftInteractions.readTicketName(ticket)
    }, readMintId: function(ticket: PNFT) {
      return pnftInteractions.readMintID(ticket);
    }, getImageUrl: function(ticket: PNFT) {
      return pnftInteractions.getImageURL(ticket)
    }, getQuestionId: function(ticket: PNFT) {
      return pnftInteractions.readMintID(ticket);  
    }, getIPFSHash: function(ticket: PNFT) {
      return pnftInteractions.readIPFSHash(ticket);  
    }, getAnswer: function(ticket: PNFT) {
      //return pnftInteractions.getAnswerText(ticket);
    }, getDescription: function(ticket: PNFT) {
      return pnftInteractions.readDescription(ticket);
    }, getUserName: function(ticket: PNFT) {
      return pnftInteractions.readUserName(ticket);
    }, answerSubmitted: function () {
    }, getFormattedDatePinned: function(ticket: PNFT){
      return pnftInteractions.formatBylineTicketDatetime(pnftInteractions.readDatePinned(ticket));
    }, tabChanged: function (index:Number, mintId: string) {
      this.areAnswersLoading = true;

      retrieveAnswersFromGMNH(mintId).then((answers) => {
              answersToQuestion.value = answers;
      }); 

      this.areAnswersLoading = false;
      clearAskQuestion.value = true;

    }
  },
  onUpdated() {
  },
  setup(props) {

    const areAnswersLoading = ref<boolean>(false);

    //fetch initially so that there isn't lag for first tab open
    if (props.tabType && props.tabType == 'myQuestions') {

      getMyQuestionsFromGMNH(getWalletAddress()!.toBase58()).then((myQuestionsFromGMNH) => {
              myQuestions.value = myQuestionsFromGMNH;
      });

    } else if (props.tabType && props.tabType == 'openQuestions') {
      getOpenQuestionsFromGMNH().then((openQuestionsFromGMNH) => {
              openQuestions.value = openQuestionsFromGMNH;
            });
    } else if (props.tabType && props.tabType == 'answeredQuestions') {

      getAnsweredQuestionsFromGMNH().then((answeredQuestionsFromGMNH) => {
              answeredQuestions.value = answeredQuestionsFromGMNH;
          });
    }

    return {
      isWalletApprovedFlag,
      myQuestionList: myQuestions,
      openQuestionList: openQuestions,
      answeredQuestions: answeredQuestions,
      answersToQuestion: answersToQuestion,
      areAnswersLoading: areAnswersLoading,
      clearAskQuestion: clearAskQuestion
     }; 
  },
});
</script>

<style scoped>
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
    margin-top: 7px;
    white-space: pre-wrap;
}

.gmnh-tab-content-description {
    font-size: 15px;
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
</style>
