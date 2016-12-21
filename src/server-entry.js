import { app, router, store} from './app'

export default context => {
  // set router's location
  router.push(context.url)
  const matchedComponents = router.getMatchedComponents()

  // no matched routes
  if (!matchedComponents.length) {
    return Promise.reject({ code: '404' })
  }
  context.initialState = store.state
  return app
}
