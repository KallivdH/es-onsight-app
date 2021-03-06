// import * as configs from '../utils/firebase/configs.js'
import firebase from 'firebase/app'
import 'firebase/firestore'
import VueFire from 'vuefire'
require('firebase/auth')

export default ({ app, router, Vue }) => {
  Vue.use(VueFire)

  // Initialize app
  const currentConfig = process.env.firebaseConfig

  let firestore = null

  console.log('PROCESS ENV OBJECT', process.env)
  // Make sure the firebase keys have been set accordingly
  if (currentConfig) {
    firebase.initializeApp(currentConfig)

    // Initialize Cloud Firestore through Firebase
    firestore = firebase.firestore()

    // Add props to our Vue instance for easy access
    // in our app
    Vue.prototype.$fb = firebase
    Vue.prototype.$db = firestore
  }

  // Add auth methods to our Vue instance
  Vue.prototype.$login = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          resolve(user)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  Vue.prototype.$registerUser = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          user.user.sendEmailVerification().then(() => {
            firestore.collection('users').doc(user.user.uid).set({
              displayName: '',
              groups: []
            }).then(() => {
              resolve(user)
            }).catch(error => {
              reject(error)
            })
          }).catch((error) => {
            reject(error)
          })
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  // make all the group date update to the current day in the week
  const moment = require('moment')

  firestore.collection('groups').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let date = moment(new Date(doc.data().date.seconds * 1000))
      let updatedDate = moment().set({
        'day': date.day(),
        'hour': date.hour(),
        'minute': date.minute(),
        'second': 0
      })

      if (updatedDate.isBefore(new Date(moment()))) {
        updatedDate.day(updatedDate.day() + 7)
      }

      firestore.collection('groups').doc(doc.id).update({
        date: new Date(updatedDate)
      })
    })
  })
}
