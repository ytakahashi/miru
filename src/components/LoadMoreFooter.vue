<template>
  <div class="list-footer">
    <span v-if="summary">{{ summary }}</span>
    <span v-if="errorMessage" class="load-more-error">Failed to load more: {{ errorMessage }}</span>
    <button
      v-if="canLoadMore"
      type="button"
      class="load-more-button"
      :disabled="loading"
      @click="$emit('loadMore')"
    >
      {{ loading ? 'Loading…' : 'Load more' }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadMoreFooter',
  props: {
    summary: {
      type: String,
      required: true,
    },
    canLoadMore: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  emits: {
    loadMore: null,
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';

.list-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.load-more-error {
  color: var(--warning-color);
}

.load-more-button {
  @include app.base-button(2px);
  & {
    align-self: center;
    padding: 3px 8px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
    transform: none;
  }
}
</style>
