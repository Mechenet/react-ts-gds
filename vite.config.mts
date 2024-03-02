/// <reference types="vitest" />

import { defineConfig } from "vite"
import { viteStaticCopy, Target } from "vite-plugin-static-copy"
import svgr from "vite-plugin-svgr"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ command }) => {
  const copyTargets: Target[] = []
  if (command === "serve") {
    copyTargets.push({
      src: "src/data/mocks/**/*",
      dest: "/mocks"
    })
  }

  const config = {
    plugins: [
      svgr(),
      react(),
      tsconfigPaths(),
      viteStaticCopy({
        targets: copyTargets
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true
        }
      }
    },
    resolve: {
      alias: [
        {
          find: /^~(.*)$/,
          replacement: "$1"
        }
      ]
    },
    test: {
      setupFiles: ["./setupTests.ts"],
      globals: true,
      environment: "jsdom",
      css: true,
      environmentOptions: {
        jsdom: {
          resources: "usable"
        }
      }
    }
  }

  return config
})
