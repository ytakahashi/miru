<template>
  <b>{{ issue.title }}</b> ({{ issue.url }}) <br />
  createdAt: {{ issue.createdAt }}, updatedAt: {{ issue.updatedAt }}
  <div v-for="(label, index) in issue.labels" :key="index">
    {{ label.name }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export class Label {
  private readonly name: string;
  private readonly color: string;
  constructor (name: string, color: string) {
    this.name = name
    this.color = color
  }
}

export class Issue {
  private readonly title: string;
  private readonly url: string;
  private readonly createdAt: string;
  private readonly updatedAt: string;
  private readonly labels: Array<Label>;

  constructor (
    title: string,
    url: string,
    createdAt: string,
    updatedAt: string,
    labels: Array<Label>
  ) {
    this.title = title
    this.url = url
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.labels = labels
  }
}

export default defineComponent({
  name: 'IssueContent',
  props: {
    issue: {
      type: Issue,
      required: true
    }
  }
})
</script>
