<template>
  <div :class="boxStyle" v-on:click="openRelease()">
    <div class="release-information">
      <span><i class="fas fa-clock"></i>{{ release.getUpdatedRelativeDate() }}</span>
      <span v-if="release.tagName"><i class="fas fa-tag"></i>{{ release.tagName }}</span>
    </div>

    <span class="content-title">
      {{ releaseTitle }}
    </span>

    <div class="text-small padding-bottom">
      {{ releaseDescription }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Release } from '@/application/domain/model/github'
import { inject } from '@/plugins/di/injector'
import { WebBrowserUserCaseKey } from '@/plugins/di/types'

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

.release-information {
  @include contents.base-content-description(space-between);
}

.release-description {
  @include contents.base-content-description(center);
}
</style>
