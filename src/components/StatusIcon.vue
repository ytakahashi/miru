<template>
  <div v-if="status" class="status-icon" :title="status">
    <svg
      v-if="status === 'SUCCESS'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      class="icon-success"
    >
      <path
        fill-rule="evenodd"
        d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
      ></path>
    </svg>
    <svg
      v-else-if="status === 'FAILURE'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      class="icon-failure"
    >
      <path
        fill-rule="evenodd"
        d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
      ></path>
    </svg>
    <svg
      v-else-if="status === 'PENDING'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      class="icon-pending"
    >
      <circle cx="8" cy="8" r="4" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      class="icon-neutral"
    >
      <circle cx="8" cy="8" r="4" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { CheckStatus } from '@/application/domain/model/github'

export default defineComponent({
  name: 'StatusIcon',
  props: {
    status: {
      type: String as PropType<CheckStatus>,
      required: true,
    },
  },
})
</script>

<style scoped>
.status-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
}

.icon-success {
  fill: #2da44e;
}

.icon-failure {
  fill: #cf222e;
}

.icon-pending {
  fill: #d29922;
}

.icon-neutral {
  fill: #6e7781;
}
</style>
