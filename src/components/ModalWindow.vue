<template>
  <!-- https://v3.vuejs.org/examples/modal.html -->
  <div class="modal-mask">
    <div ref="wrapper" class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header"> header </slot>
        </div>
        <div class="modal-body">
          <slot name="body"> body </slot>
        </div>

        <button class="modal-button" @click="$emit('ok')">OK</button>
        <button class="modal-button" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, Ref, SetupContext } from 'vue'

export default defineComponent({
  name: 'ModalWindow',
  emits: {
    cancel: null,
    ok: null,
  },
  setup(_, context: SetupContext) {
    const wrapper: Ref<HTMLElement | null> = ref(null)

    const clickListener = (event: MouseEvent) => {
      if (event.target === wrapper.value) {
        context.emit('cancel')
      }
    }
    onMounted(() => document.addEventListener('click', clickListener))
    onUnmounted(() => document.removeEventListener('click', clickListener))

    return {
      wrapper,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';

.modal-header {
  font-size: 120%;
  font-weight: bold;
  margin: 15px;
}

.modal-button {
  @include app.base-button(10px);
  & {
    padding: 8px;
    margin-top: 20px;
    + .modal-button {
      margin-left: 10px;
    }
  }
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 60%;
  margin: 0px auto;
  padding: 15px 30px 30px;
  background-color: var(--main-background-color);
  color: var(--main-font-color);
  border-radius: 15px;
}
</style>
