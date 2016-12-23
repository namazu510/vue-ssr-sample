import LRU from 'lru-cache'
import axios from 'axios'

let api

if (process.__API__) {
  api = process.__API__
} else {
  api = {}

  // SSRのプリフェッチデータキャッシュ
  api.cachedItems = LRU({
    max: 10000,
    maxAge: 1000 * 60 * 15 // 15 min cache
  })
  process.__API__ = api
}

const axiosDefault = axios.create()

export {
  api,
  axiosDefault
}
