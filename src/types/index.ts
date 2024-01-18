export interface City {
  country: string
  lat: string
  lon: string
  name: string
}

export interface ForecastType {
  country: string
  name: string
  sunrise: number
  sunset: number
  list: [
    {
      clouds: { all: number }
      dt: number
      main: {
        feels_like: number
        humidity: number
        pressure: number
        temp: number
        temp_max: number
        temp_min: number
      }
      pop: number
      rain: { '3h': number }
      visibility: number
      weather: [
        {
          main: string
          description: string
          icon: string
        }
      ]
      wind: { speed: number; deg: number; gust: number }
    }
  ]
}
