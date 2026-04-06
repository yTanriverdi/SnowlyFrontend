import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
   plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Snowly',
        short_name: 'Snowly',
        description: 'Snowly mesajlaşma uygulaması',
        theme_color: '#1D4ED8',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
            {
              src: '/pwa-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
      }
    })
  ],
  server: {
    host: true
  }
})
