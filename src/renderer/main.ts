import { createApp } from 'vue'
import App from '@/renderer/App.vue'
import { createPinia } from 'pinia'

// import "@/renderer/styles/element/index.scss";

import ElementPlus from 'element-plus'
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import '@/renderer/styles/index.scss'
import 'uno.css'

// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    mainApi?: any
  }
}

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
