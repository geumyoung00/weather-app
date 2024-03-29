import { ForecastType } from '../types'
import { Degree } from './Degree'
import { Cell } from './Cell'
import Sunrise from './Icons/Sunrise'
import Sunset from './Icons/Sunset'
import {
  getHumidityValue,
  getPop,
  getSunTime,
  getVisibilityValue,
  getWindDirection,
} from '../helpers'

export const Weather = ({ data }: { data: ForecastType }) => {
  const lastDate = data.list[data.list.length - 1]
  const firstData = data.list[0]
  console.log(data)

  return (
    <div className="w-full md:max-w-[500px] py-4 md:py-4 md:px-10 lg:px-24 h-full lg:h-auto bg-white bg-opacity-20 backdrop-blur-ls rounded drop-shadow-lg">
      <div className="mx-auto w-[300px]">
        <section className="text-center">
          <h2 className="text-2xl font-black">
            {/* 아래처럼 도시 이름과 국가 이니셜 보여주기 */}
            {data.name} <span className="font-thin">{data.country}</span>
          </h2>
          <h1 className="text-4xl font-extrabold">
            {/* <Degree />를 사용해서 날씨 배열(list)의 가장 최근 기온을 반내림해서 보여주기 */}
            <Degree temp={Math.floor(firstData.main.temp)} />
          </h1>
          <p className="text-sm">
            {/* 날씨 배열(list) 가장 첫번째의 weather 안의 main의 텍스트 가져오기 */}
            {/* 날씨 배열(list) 가장 첫번째의 weather 안의 description 텍스트 가져와서 괄호 안에 보여주기 */}
            {firstData.weather.map((item) => item.main)},{' '}
            {`(${firstData.weather.map((item) => item.description)})`}
          </p>
          <p className="text-sm">
            {/* <Degree />를 사용해서 날씨 배열(list)의 가장 최근 & 최고 온도를 반올림해서 보여주기 */}
            H: <Degree temp={Math.ceil(lastDate.main.temp_max)} />
            &ensp;
            {/* <Degree />를 사용해서 날씨 배열(list)의 가장 최근 & 최저 온도를 반올림해서 보여주기 */}
            L: <Degree temp={Math.ceil(lastDate.main.temp_max)} />
          </p>
        </section>

        <section className="flex overflow-x-scroll mt-4 pb-2 mb-5">
          {/* 아래의 div가 날씨 배열의 개수만큼 여러 개로 나타나도록 */}
          {data.list.map((item, idx) => (
            <div
              className="inline-block text-center w-[50px] flex-shrink-0"
              key={item.dt}
            >
              <p className="text-sm">
                {/* 배열 아이템의 dt를 사용해서 시간 나타내기 */}
                {/* 단, 첫번째 아이템은 "Now"라고 뜬다 */}
                {idx === 0 ? 'Now' : new Date(item.dt * 1000).getHours()}
              </p>
              <img
                // alt 값으로 아이템의 description을 사용:
                alt={`${item.weather[0].description}`}
                // 배열 내의 weather 안에 있는 icon을 사용:
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              />
              <p className="text-sm font-bold">
                {/* <Degree />를 사용해서 item의 main.temp를 가장 가까운 정수로 보여주기 */}
                <Degree temp={Math.round(item.main.temp)} />
              </p>
            </div>
          ))}
        </section>

        <section className="flex flex-wrap justify-between text-zinc-700">
          <div className="w-[140px] text-xs font-bold flex flex-col items-center bg-white/20 backdrop-blur-ls rounded drop-shadow-lg py-4 mb-5">
            {/* /helpers 폴더 내에 getSunTime을 사용해 일출 시간이 hh:mm 형태로 보여질 수 있도록 한다 */}
            <Sunrise /> <span className="mt-2">{getSunTime(data.sunrise)}</span>
          </div>
          <div className="w-[140px] text-xs font-bold flex flex-col items-center bg-white/20 backdrop-blur-ls rounded drop-shadow-lg py-4 mb-5">
            {/* /helpers 폴더 내에 getSunTime을 사용해 일몰 시간이 hh:mm 형태로 보여질 수 있도록 한다 */}
            <Sunset /> <span className="mt-2">{getSunTime(data.sunset)}</span>
          </div>

          {/* 티켓에 있는 스펙과 <Cell />을 참고해서 icon과 title 값 입력 */}
          {/* 아래에 있는 값들은 모두 날씨 배열(list)의 가장 첫번째 아이템에 관한 값들 */}
          <Cell
            icon="wind"
            title="Wind"
            // info 적절히 수정해 주세요:
            info={`${firstData.wind.speed.toFixed(0)} km/h`}
            // getWindDirection를 사용해 동서남북을 E, W, S 또는 N로 나타낸 후,
            // 풍속(gust) 값을 사용해 소수점 한 자리를 가진 수를 보여줍니다:
            description={`${getWindDirection(
              firstData.wind.deg
            )}, gusts ${firstData.wind.gust.toFixed(1)} km/h`}
          />
          <Cell
            icon="feels"
            title="Feels like"
            // temp를 적절히 수정해 주세요:
            info={<Degree temp={firstData.main.temp.toFixed(0)} />}
            // main.feels_like가 main.temp 보다 작으면 Feels colder, 크면 Feels warmer로 보이도록
            description={
              firstData.main.feels_like < firstData.main.temp
                ? 'Feels colder'
                : 'Feels warmer'
            }
          />
          <Cell
            icon="humidity"
            title="Humidity"
            // info를 적절히 수정해 주세요:
            info={`${firstData.main.humidity} %`}
            // getHumidityValue를 이용해 description이 보이도록 합니다:
            // description="Dry and comfortable"
            description={getHumidityValue(firstData.main.humidity)}
          />
          <Cell
            icon="pop"
            title="Precipitation"
            // pop(강수확률)값을 사용해 info를 적절히 수정해 주세요:
            info={`${firstData.pop * 100}%`}
            // helpers의 getPop을 사용하여 description을 받아오고, clouds.all을 %로 보여줍니다:
            description={`${getPop(firstData.pop)}, clouds at ${
              firstData.clouds.all
            }%`}
            // description="High probability, clouds at 75%"
          />
          <Cell
            icon="pressure"
            title="Pressure"
            // main.pressure 값을 사용해 info를 적절히 수정해 주세요:
            info={`${firstData.main.pressure} hPa`}
            // main.pressure가 1013 보다 작으면 "Lower than standard", 크면 "Higher than standard"
            description={`${
              firstData.main.pressure > 1013 ? 'Higher' : 'Lower'
            } than standard`}
          />
          <Cell
            icon="visibility"
            title="Visibility"
            // visibility의 단위는 m인데 km로 보일 수 있도록 바꿔주세요:
            info={`${firstData.visibility / 1000} km`}
            // visibility를 인자로 하는 helpers의 getVisibilityValue를 써서 description을 받아와주세요:
            description={getVisibilityValue(firstData.visibility)}
          />
        </section>
      </div>
    </div>
  )
}
