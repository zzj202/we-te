// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 4000,// 或其他你想要的端口
  },
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        port: process.env.REDIS_PORT || 6379,
        host: process.env.REDIS_HOST,
        username: process.env.REDIS_USERNAME || '',
        password: process.env.REDIS_PASSWORD,
        db: 0,
      }
    }
  },
  modules: ['@pinia/nuxt', 'dayjs-nuxt', 'pinia-plugin-persistedstate/nuxt',],
  build: {
    transpile: ['naive-ui','vueuc']
  },
  vite: {
    optimizeDeps: {
      include: ['vueuc']
    }
  }
})