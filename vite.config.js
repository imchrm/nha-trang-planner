import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/tours/nha_trang_planner/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
