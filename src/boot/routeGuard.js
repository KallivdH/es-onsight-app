import firebase from 'firebase/app'
require('firebase/auth')

export default ({ app, router, Vue }) => {
  const currentConfig = process.env.firebaseConfig

  // Make sure the firebase API keys have been set accordingly
  if (currentConfig) {
    router.beforeEach((to, from, next) => {
      firebase.auth().onAuthStateChanged(() => {
        const currentUser = firebase.auth().currentUser
        let isVerified
        if (currentUser) {
          isVerified = currentUser.emailVerified
        }
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
        const verifiedAcc = to.matched.some(record => record.meta.verifiedAcc)
        if (requiresAuth && !currentUser) next('login')
        if (verifiedAcc && !isVerified) next('user')
        else if (to.path === '/login' && (!requiresAuth && isVerified)) next('user')
        else if (to.path === '/register' && (!requiresAuth && isVerified)) next('user')
        else next()
      })
    })
  }
}
