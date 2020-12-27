<template>
  <div class="hello">
    <input v-model="pat" placeholder="personal access token">
    <p>Access Token: {{ pat }}</p>
    <button v-on:click="setPat()">store</button>

    <p v-if="userName">Hello, {{ userName }}</p>
    <p v-if="profileUrl">profile: {{ profileUrl }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserSettingService } from '@/domain/userSettingService'

const apiEndpoint = 'https://api.github.com/graphql'

export default defineComponent({
  name: 'HelloWorld',
  data () {
    return {
      pat: '',
      userName: '',
      profileUrl: '',
      userSettingService: new UserSettingService(apiEndpoint)
    }
  },
  methods: {
    setPat () {
      this.userSettingService.updatePat(this.pat)
      this.updateProfile()
    },
    async updateProfile () {
      try {
        const user = await this.userSettingService.getUser()
        if (user !== undefined) {
          this.userName = user.login
          this.profileUrl = user.url
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  async mounted () {
    this.updateProfile()
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
