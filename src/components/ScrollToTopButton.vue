<template>
  <div v-if="scrollY > 150" v-on:click="scrollToTop()" class="top-button">
    <i class="fas fa-chevron-up"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'ScrollToTopButton',
  setup () {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const scrollY = ref(0)
    const setScrollValue = () => (scrollY.value = window.scrollY)
    onMounted(() => window.addEventListener('scroll', setScrollValue))

    return {
      scrollToTop,
      scrollY
    }
  }
})
</script>

<style scoped lang="scss">
$button-size: 35px;

.top-button {
  cursor: pointer;
  position: fixed;
  right: 5%;
  bottom: 3%;
  width: $button-size;
  height: $button-size;
  line-height: $button-size;
  border-radius: 50%;
  background: var(--sub-background-color);
}
</style>
