import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import binder from './di/binder'

createApp(App)
  .use(router)
  .use(binder)
  .mount('#app')
