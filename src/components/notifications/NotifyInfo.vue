<template>
  <div v-if="isQuestion" style="padding: 16px;">
    <h5 v-if="isLoading">Your question was successfully submitted.</h5>
    <h5 v-if="isLoading">We're hustling to get back to you, keep your eyes peeled on your email.</h5>
    <span v-if="isLoading && !isCreated && isConnected">Generating a NFT (this may take a minute)...</span>
    <div v-if="isLoading && isCreated && isConnected">
    <span>Yay - NFT created! </span><ExplorerLink :mint-id="mintId" />
    </div>
  </div>
  <div v-else style="padding: 16px;">
    <h4 v-if="isLoading && !isCreated">Answer Submitted</h4>
    <span v-if="isLoading && !isCreated">Generating a NFT (this may take a minute)...</span>
    <div v-if="isLoading && isCreated">
    <span>GMNH Answer NFT created! </span><ExplorerLink :mint-id="mintId" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExplorerLink from '@/components/ExplorerLink.vue';

export default defineComponent({
  components: {
    ExplorerLink
  },
  props: {
    isCreated: Boolean,
    isLoading: Boolean,
    isQuestion: Boolean,
    isConnected: Boolean,
    mintId: String
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>


</style>
