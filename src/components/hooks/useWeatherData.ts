import axios from 'axios'
import React, { useState } from 'react'
import { City, CityData } from '../../types/index'

export const useWeatherData = () => {
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

  const getWeatherData = async (selectedCity: City) => {
    try {
      const res = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${
          selectedCity!.lat
        }&lon=${selectedCity!.lon}&units=metric&appid=${
          process.env.REACT_APP_API_KEY
        }`
      )
      const { data } = res
      setWeatherData(data)
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = (selectedCity: City) => {
    getWeatherData(selectedCity)
  }

  return {
    weatherData,
    inputValue,
    cities,
    onChangeHandler,
    onClickItem,
    onSubmit,
  }
}
