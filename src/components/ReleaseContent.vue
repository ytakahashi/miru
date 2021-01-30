<template>
  <div :class="boxStyle" v-on:click="openRelease()">
    <div class="text-tiny align-left padding-bottom">
      <i class="fas fa-clock"></i>
      {{ release.getUpdatedRelativeDate() }}
    </div>
    <span class="text-strong">{{ releaseTitle }}</span>
    <div class="text-small padding-bottom">
      {{ releaseDescription }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Release } from '@/application/domain/model/github'
import { inject } from '@/di/injector'
import { WebBrowserUserCaseKey } from '@/di/types'

type PropsType = {
  release: Release
}

export default defineComponent({
  name: 'ReleaseContent',
  props: {
    release: {
      type: Release,
      required: true
    }
  },
  setup (props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openRelease = () => webBrowserUserCase.openUrl(props.release.url)

    const boxStyle = computed(() => ({
      'content-box-open': !props.release.isDraft,
      'content-box-release-draft': props.release.isDraft
    }))

    const releaseTitle = props.release.isDraft === true
      ? props.release.title === '' ? 'Draft' : props.release.title
      : props.release.title === '' ? props.release.tagName : props.release.title

    const releaseType = props.release.isDraft === true ? 'drafted' : 'published'
    const releaseRelativeTime = props.release.isDraft === true
      ? props.release.getUpdatedRelativeDate()
      : props.release.getCreatedRelativeDate()
    const releaseDescription = computed(() =>
      (`${props.release.authorName} ${releaseType} ${releaseRelativeTime}`))

    return {
      boxStyle,
      openRelease,
      releaseTitle,
      releaseDescription
    }
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.content-box-release-draft {
  @include contents.content-box(var(--color-draft-release));
}
</style>
