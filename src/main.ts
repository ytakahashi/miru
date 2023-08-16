import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router'
import binder from '@/plugins/di/binder'

createApp(App).use(router).use(binder).mount('#app')
