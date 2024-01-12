import React, { useState } from 'react'
import axios from 'axios'
import { City, CityData } from './types/index'

const App = () => {
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<null | City>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [weatherData, setWeatherData] = useState<null | CityData>(null)

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value) searchCity(value) //value가 없으면 실행하지 않음
    setInputValue(value)
  }

  const searchCity = async (value: string) => {
    try {
      const res = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&lang=en&appid=${process.env.REACT_APP_API_KEY}`
      )
      const { data } = res
      setCities(data)
    } catch (error) {
      console.error(error)
    }
  }

  const onClickItem = (item: City) => {
    setSelectedCity(item)
    setInputValue(`${item.name}, ${item.country}`)
    setCities([])
  }

  const getWeatherData = async () => {
    try {
      const res = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${
          selectedCity!.lat
        }&lon=${selectedCity!.lon}&units=metric&appid=${
          process.env.REACT_APP_API_KEY
        }`
      )
      const { data } = res
      console.log('data__', data)
      setWeatherData(data)
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = () => {
    getWeatherData()
  }

  return (
    <main className="flex justify-center items-center bg-gradient-to-b from-pink-400 via-purple-400 to-sky-400 h-[100vh] w-full">
      {weatherData ? (
        <section className="w-full p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-24 h-full bg-white bg-opacity-20 backdrop-blur-ls rounded drop-shadow-lg text-zinc-700">
          <h1 className="text-4xl font-thin">
            <span className="font-black">{`${selectedCity!.name}, ${
              selectedCity!.country
            }의 날씨를 찾고 있어요 🤓`}</span>
          </h1>
          <br />
          <p className="text-sm mt-2">잠시만 기다려주세요!</p>
        </section>
      ) : (
        <section className="w-full p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-24 h-full bg-white bg-opacity-20 backdrop-blur-ls rounded drop-shadow-lg text-zinc-700">
          <h1 className="text-4xl font-thin">
            <span className="font-black">Weather App</span>
          </h1>
          <p className="text-sm mt-2">어느 도시의 날씨가 궁금하신가요?</p>

          <div className="relative flex mt-10 md:mt-4">
            <input
              type="text"
              value={inputValue}
              onChange={onChangeHandler}
              className="px-2 py-1 rounded-l-md border-2 border-white"
            />

            <ul className="absolute top-9 bg-white ml-1 rounded-b-md">
              {cities.map((item, index) => (
                <li key={`${item.lat} ${index}`}>
                  <button
                    onClick={() => onClickItem(item)}
                    className="text-left text-sm w-full hover:bg-zinc-700 hover:text-white px-2 py-1 cursor-pointer"
                  >
                    {`${item.name}, ${item.country}`}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={onSubmit}
              className="rounded-r-md border-2 border-zinc-100 hover:border-zinc-500 hover:text-zinc-500  text-zinc-100 px-2 py-1 cursor-pointer"
            >
              search
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
