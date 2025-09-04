import { defineNuxtPlugin } from '#app'
import { create, NButton, NDialog, NDialogProvider, createDiscreteApi } from 'naive-ui'

const naive = create({
  components: [NButton]
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(naive)
  return {}
})