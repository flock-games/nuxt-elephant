// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/sanity"],
  sanity: {
    projectId: "bd59g34x",
    dataset: "production",
  },
});
