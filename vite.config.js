import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function localWeatherProxy() {
  return {
    name: 'local-weather-proxy',
    configureServer(server) {
      server.middlewares.use('/api/weather', async (req, res) => {
        const requestUrl = new URL(req.url || '/', 'http://localhost')
        const latitude = requestUrl.searchParams.get('latitude')
        const longitude = requestUrl.searchParams.get('longitude')

        if (!latitude || !longitude) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Latitude and longitude are required.' }))
          return
        }

        try {
          const upstreamResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          )

          const payload = await upstreamResponse.text()

          res.statusCode = upstreamResponse.status
          res.setHeader('Content-Type', 'application/json')
          res.end(payload)
        } catch {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'The weather service is temporarily unavailable.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/here-frontend/' : '/',
  plugins: [react(), localWeatherProxy()],
}))
