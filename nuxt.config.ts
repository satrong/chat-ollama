import { LanguageList } from './config/i18n'
import { APP_NAME } from './config/index'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui', '@vueuse/nuxt',
    ['@nuxtjs/i18n', {
      vueI18n: "@/config/nuxtjsI18n"
    }]
  ],
  nitro: {
    experimental: {
      openAPI: true
    }
  },
  ui: {
    icons: ['heroicons', 'iconoir', 'material-symbols', 'mdi', 'svg-spinners']
  },
  css: [
    '~/assets/index.scss',
  ],
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/logo.svg?1',
        },
      ],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width',
        }
      ],
      title: APP_NAME,
    }
  },
  runtimeConfig: {
    public: {
      kb: {
        create: {
          role: ''
        }
      },
      modelProxyEnabled: false,
      chatMaxAttachedMessages: 50,
      appName: APP_NAME,
    },
    modelProxyUrl: ''
  },
  i18n: {
    //Asynchronous call, on-demand loading
    locales: LanguageList,
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'en-US',//def Language, please use Language code
    strategy: "no_prefix",
    compilation: {
      strictMessage: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
  vite: {
    worker: {
      format: 'es'
    }
  }
})
