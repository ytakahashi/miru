<template>
  <div v-if="loading" ref="mask" class="background-mask">
    <div ref="wrapper" class="icon-wrapper">
      <span class="loading01"><span></span></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, Ref, SetupContext } from 'vue'

export default defineComponent({
  name: 'LoadingImage',
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    cancel: null,
  },
  setup(_, context: SetupContext) {
    const mask: Ref<HTMLElement | null> = ref(null)
    const wrapper: Ref<HTMLElement | null> = ref(null)

    const clickListener = (event: MouseEvent) => {
      if (event.target === null) {
        return
      }
      if (event.target === wrapper.value || event.target === mask.value) {
        context.emit('cancel')
      }
    }
    onMounted(() => document.addEventListener('click', clickListener))
    onUnmounted(() => document.removeEventListener('click', clickListener))

    return {
      mask,
      wrapper,
    }
  },
})
</script>

<style scoped lang="scss">
@use 'sass:math';

.background-mask {
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

.icon-wrapper {
  display: table-cell;
  vertical-align: middle;
}

$circle-size: 6px;
$color-off: var(--color-gray);
$color-on: var(--color-light-gray);

// https://mamewaza.com/tools/loading.html
span.loading01,
span.loading01:after {
  display: inline-block;
  width: 60px;
  height: 60px;
  background-repeat: no-repeat;
  background-image:
    radial-gradient($circle-size $circle-size at 10% 50%, $color-off, $color-off 95%, transparent),
    radial-gradient($circle-size $circle-size at 50% 10%, $color-off, $color-off 95%, transparent),
    radial-gradient($circle-size $circle-size at 90% 50%, $color-off, $color-off 95%, transparent),
    radial-gradient($circle-size $circle-size at 50% 90%, $color-off, $color-off 95%, transparent);
}
span.loading01 {
  position: relative;
  vertical-align: middle;
}
span.loading01:after {
  position: absolute;
  content: ' ';
  z-index: -1;
  left: 0;
  top: 0;
  margin: 0;
  transform: rotate(45deg);
}
span.loading01 span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  background-image: radial-gradient(
    $circle-size $circle-size at 10% 50%,
    $color-on,
    $color-on 95%,
    transparent
  );
  animation: animation01 1.5s linear infinite;
}

@keyframes animation01 {
  $num: 8;
  @for $i from 1 through $num {
    #{math.div($i, $num) * 100 - 0.1%} {
      transform: rotate(#{($i - 1) * math.div(360, $num)}deg);
    }
    #{math.div($i, $num) * 100%} {
      transform: rotate(#{$i * math.div(360, $num)}deg);
    }
  }
}
</style>
