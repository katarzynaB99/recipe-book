import tailwindcss from '@tailwindcss/vite';
import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module'
  ],
  vite: {
    server: {
      allowedHosts: [ 'recipe-book-demo.devest.dev' ]
    },
    plugins: [
      tailwindcss()
    ]
  },
  primevue: {
    options: {
        theme: {
            preset: Aura
        }
    }
  },
  runtimeConfig: {
    jwtSecret: process.env.NUXT_JWT_SECRET,
    public: {
      baseURL: 'http://recipe-book-demo.devest.dev'
    }
  },
  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
  }
})