import Vue from 'vue'
import Vuex from 'vuex'
import {fetchWeather} from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    weather: {
      title: '',
      state: ''
    }
  },

  actions: {
    SHOW_WEATHER: ({state, dispatch}) => {
      // Promiseを返すのを忘れない！！
      if (state.weather.title.length !== 0) {
        return Promise.resolve()
      }
      return dispatch('FETCH_WEATHER')
    },
    FETCH_WEATHER: ({commit}) => {
      return fetchWeather()
        .then((weather) => {
          commit('SET_WEATHER', weather)
        })
    }
  },

  mutations: {
    SET_WEATHER: (state, weather) => {
      state.weather = weather
    }
  },

  getters: {
  }
})

export default store
