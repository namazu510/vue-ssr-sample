import 'es6-promise/auto'
import { app, store } from './app'

// window.__INITIAL_STATE__にサーバー側でのstateが入ってる
// サーバから渡されたStateにstoreの状態を設定する
store.replaceState(window.__INITIAL_STATE__)

// actually mount to DOM
app.$mount('#app')
