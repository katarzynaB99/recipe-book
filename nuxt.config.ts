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
}
})
