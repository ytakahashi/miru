<template>
  <div class="home">
    <UserSetting />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserSetting from '@/components/UserSetting.vue'

export default defineComponent({
  name: 'Home',
  components: {
    UserSetting
  }
})
</script>
