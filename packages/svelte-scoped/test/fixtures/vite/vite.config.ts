import { defineConfig } from 'vite'
import transformerDirectives from '@unocss/transformer-directives'
import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from '@unocss/svelte-scoped/vite'

export default defineConfig({
  build: {
    minify: false,
  },
  clearScreen: false,
  plugins: [
    UnoCSS({
      // no Uno config specified here or with a uno.config.ts to test using default preset
      cssFileTransformers: [transformerDirectives()],
    }),
    sveltekit(),
  ],
})
