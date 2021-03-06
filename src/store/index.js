import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'
import createPersistPlugin from '@rematch/persist'

import auth from './modules/auth'
import user from './modules/user'

const loading = createLoadingPlugin({})
const persist = createPersistPlugin({
  whitelist: ['auth'],
  version: 1,
})

const store = init({
  models: { auth, user },
  plugins: [loading, persist],
})

export default store
