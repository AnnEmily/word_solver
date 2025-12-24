import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'src/assets/*',
    //       dest: 'assets'
    //     }
    //   ]
    // })
  ],
  build: {
    outDir: 'docs' // Output build to a folder named 'docs'
  },
  base: 'word_solver', // add this before refs to assets in final URL
})
