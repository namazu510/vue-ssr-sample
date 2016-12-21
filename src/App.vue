<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/counter">Counter</router-link></li>
        <li><router-link to="/weather">Weather</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>
