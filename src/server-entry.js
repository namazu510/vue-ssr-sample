import { app, router, store} from './app'

export default context => {
  // set router's location
  router.push(context.url)
  const matchedComponents = router.getMatchedComponents()

  // no matched routes
  if (!matchedComponents.length) {
    return Promise.reject({ code: '404' })
  }

  // preFetchメソッドをサーバー側で呼んでactionの実行やmutationをさせる
  // stateにSSR時に必要な情報を入れる.
  return Promise.all(matchedComponents.map(component => {
    if (component.preFetch) {
      return component.preFetch(store)
    }
  })).then(() => {
    context.initialState = store.state
    return app
  })

  return app
}
