type WeatherCondition = 'clear' | 'clouds' | 'fog' | 'rain' | 'thunderstorm' | 'snow'

// Chennai
const LAT = 13.08
const LON = 80.27

/** Map OpenWeatherMap condition IDs → our buckets.
 *  https://openweathermap.org/weather-conditions */
function idToCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return 'thunderstorm'
  if (id >= 300 && id < 600) return 'rain'   // drizzle (3xx) + rain (5xx)
  if (id >= 600 && id < 700) return 'snow'
  if (id >= 700 && id < 800) return 'fog'    // mist, smoke, haze, fog, sand, dust, ash, squall
  if (id === 800)            return 'clear'
  if (id > 800 && id < 900)  return 'clouds'
  return 'clear'
}

export async function GET() {
  const key = process.env.OPENWEATHER_API_KEY
  if (!key) {
    return Response.json({ error: 'OPENWEATHER_API_KEY not set' }, { status: 500 })
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${key}`
  const res = await fetch(url, { next: { revalidate: 900 } })

  if (!res.ok) {
    return Response.json({ error: 'weather fetch failed' }, { status: res.status })
  }

  const data = await res.json()
  const id = data?.weather?.[0]?.id
  const temperature = data?.main?.temp

  return Response.json({
    condition: typeof id === 'number' ? idToCondition(id) : 'clear',
    temperature: typeof temperature === 'number' ? temperature : null,
  })
}
