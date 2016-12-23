import {api, axiosDefault as axios} from 'create-api'

export function fetchWeather() {
  const CACHE_KEY = 'WEATHER'

  // TOKYO
  const CITY_CODE = 130010
  const API_URL = `http://weather.livedoor.com/forecast/webservice/json/v1?city=${CITY_CODE}`

  // Cacheチェック
  const cache = api.cachedItems
  if (cache && cache.has(CACHE_KEY)) {
    return Promise.resolve(cache.get(CACHE_KEY))
  }

  return axios.get(API_URL)
    .then(response => {
      return response.data
    }).then(json => {
      // 今日の天気だけ出す.
      return {
        title: json.title,
        state: json.forecasts[0].telop
      }
    }).then(weather => {
      // キャッシュに入れる.
      cache && cache.set(CACHE_KEY, weather)
      return weather
    })

}
