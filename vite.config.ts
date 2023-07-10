import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import electronPlugin from 'vite-plugin-electron'
import rendererPlugin from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
import { rmSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { builtinModules } from 'module'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, ElementUiResolver } from 'unplugin-vue-components/resolvers'

import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'

import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig(() => {
  rmSync('dist', { recursive: true, force: true })

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.vue', '.json', '.scss'],
      alias: {
        '@': join(__dirname, './src')
      }
    },
    base: './',
    root: resolve('./src/renderer'),
    publicDir: resolve('./src/renderer/public'),
    clearScreen: false,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/renderer/styles/element/index.scss" as *;`
        }
      }
    },
    build: {
      assetsDir: '', // See: https://github.com/electron-vite/electron-vite-vue/issues/287
      outDir: resolve('./dist')
    },
    server: {
      port: 5174
    },
    plugins: [
      vue(),
      // Docs: https://github.com/electron-vite/vite-plugin-electron
      electronPlugin([
        {
          entry: ['src/main/index.ts'],
          onstart: (options) => {
            options.startup()
          },
          vite: {
            build: {
              assetsDir: '.',
              outDir: 'dist/main',
              rollupOptions: {
                external: ['electron', ...builtinModules]
              }
            }
          }
        },
        {
          entry: ['src/preload/index.ts'],
          onstart: (options) => {
            options.reload()
          },
          vite: {
            build: {
              outDir: 'dist/preload'
            }
          }
        }
      ]),
      rendererPlugin(),
      AutoImport({
        imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
        dts: true,
        dirs: ['./composables'],
        vueTemplate: true
      }),
      // Components({
      //   dirs: ['src/renderer/components', 'src/renderer/components/layouts'],
      //   // dts: '../components.d.ts',
      //   dts: true,
      //   // allow auto load markdown components under `./src/components/`
      //   extensions: ['vue', 'md', 'ts'],
      //   // allow auto import and register components used in markdown
      //   include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      //   resolvers: [
      //     ElementPlusResolver({
      //       importStyle: 'sass'
      //     }),
      //     ElementUiResolver({
      //       importStyle: 'sass'
      //     })
      //   ]
      // }),
      Components({
        dirs: ['./components'],
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: './components.d.ts',
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ]
      }),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()]
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss({
        presets: [
          presetUno(),
          presetAttributify(),
          presetIcons({
            scale: 1.2,
            warn: true
          })
        ],
        transformers: [transformerDirectives(), transformerVariantGroup()]
      })
    ]
  }
})
