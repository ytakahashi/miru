<template>
  <div :class="boxStyle" @click="openRelease()">
    <div class="release-information">
      <span>
        <span class="tooltip" :data-tooltip="release.getUpdatedLocalDate()">
          <i class="fas fa-clock"></i>{{ release.getUpdatedRelativeDate() }}
        </span>
        <span v-if="release.isDraft" class="draft-mark">Draft</span>
        <span v-if="release.isPrerelease" class="prerelease-mark">Pre-release</span>
      </span>
      <span v-if="release.tagName"><i class="fas fa-tag"></i>{{ release.tagName }}</span>
    </div>

    <span class="content-title">
      {{ releaseTitle }}
    </span>

    <div class="release-description">
      <span>{{ release.authorName }}</span>
      <span>{{ releaseType }}</span>
      <span class="tooltip" :data-tooltip="releaseLocalTime">{{ releaseRelativeTime }}</span>
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
      required: true,
    },
  },
  setup(props: PropsType) {
    const webBrowserUserCase = inject(WebBrowserUserCaseKey)
    const openRelease = () => webBrowserUserCase.openUrl(props.release.url)

    const boxStyle = computed(() => ({
      'content-box-open': !props.release.isDraft && !props.release.isPrerelease,
      'content-box-release-draft': props.release.isDraft,
      'content-box-pre-release': props.release.isPrerelease,
    }))

    const releaseTitle =
      props.release.isDraft === true
        ? props.release.title === ''
          ? 'Draft'
          : props.release.title
        : props.release.title === ''
        ? props.release.tagName
        : props.release.title

    const releaseType = props.release.isDraft === true ? 'drafted' : 'published'
    const releaseLocalTime =
      props.release.isDraft === true
        ? props.release.getUpdatedLocalDate()
        : props.release.getCreatedLocalDate()
    const releaseRelativeTime =
      props.release.isDraft === true
        ? props.release.getUpdatedRelativeDate()
        : props.release.getCreatedRelativeDate()

    return {
      boxStyle,
      openRelease,
      releaseTitle,
      releaseType,
      releaseLocalTime,
      releaseRelativeTime,
    }
  },
})
</script>

<style scoped lang="scss">
@use '@/assets/app';
@use '@/assets/contents';

.content-box-release-draft {
  @include contents.content-box(var(--color-draft-release));
}

.content-box-pre-release {
  @include contents.content-box(var(--color-prerelease));
}

.draft-mark {
  @include app.badge-box(var(--color-draft-release), var(--color-draft-release));
}

.prerelease-mark {
  @include app.badge-box(var(--color-prerelease), var(--color-prerelease));
}

.release-information {
  @include contents.base-content-description(space-between);
}

.release-description {
  @include contents.base-content-description(center);
}
</style>
