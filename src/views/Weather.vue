<template>
  <div id="weather">
    <h1> WeatherComp </h1>
    <p> {{weather.title}} </p>
    <p> {{weather.state}} </p>
  </div>
</template>
<script>
export default {
  name: 'weather',

  preFetch(store) {
    store.dispatch('SHOW_WEATHER')
  },
  beforeMount() {
    this.$store.dispatch('SHOW_WEATHER')
  },

  computed: {
    weather () {
      return this.$store.state.weather
    }
  }
}
</script>