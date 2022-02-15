<template>
  <div class="cover">
    <p class="text-xl text-white m-10">Thanks for visiting GMneedhelp 🌞!  

We currently do not support mobile devices (we’re working on it!), so please view this on Desktop.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped>
.cover {
  @apply fixed inset-0 flex flex-col justify-center align-middle text-center;
  overflow-wrap: normal;
  z-index: 99999;
  background-color: black;
}
</style>
