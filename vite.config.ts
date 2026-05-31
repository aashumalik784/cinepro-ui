base: '/',+O
+import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
}+O

+// @ts-ignore just absorb
export { default } from "./vite.config.client.js"
