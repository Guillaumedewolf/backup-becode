// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.



import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/firestore'
import VueFire from 'vuefire'
import App from './App'
import linkify from 'vue-linkify'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import EmojiConvertor from 'emoji-js/lib/emoji.js'



export const emojiConvertor = new EmojiConvertor();






// import GoogleAuth from 'vue-google-auth'

// explicit installation required in module environments
Vue.use(VueFire)
// activation DB
 var config = {
    apiKey: "AIzaSyBiyOTVA_t9bmtw-5uNqBmzZWsIAnhClOU",
    authDomain: "chat-ryverbis.firebaseapp.com",
    databaseURL: "https://chat-ryverbis.firebaseio.com",
    projectId: "chat-ryverbis",
    storageBucket: "chat-ryverbis.appspot.com",
    messagingSenderId: "156374615732"
  }

const settings = {timestampsInSnapshots: true}
var firebaseApp = firebase.initializeApp(config)
export const db = firebase.firestore()
export const dbRef = firebase.database()
db.settings(settings)

export const storage = firebase.storage();



Vue.config.productionTip = false



// variable global



Vue.mixin({
  data: function() {
    return {
      get etatConnexion() {
        return false;
      },
      get userName() {
        return '';
      }
    }
  }
})



Vue.directive('linkified', linkify)
Vue.use(BootstrapVue);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
  
  
})


// actif -test 

// var userId = firebase.auth().currentUser.uid;
// // const db = firebase.firestore(); --> up

// const usersRef = db.collection('users');
// const onlineRef = dbRef.ref('.info/connected'); // Get a reference to the list of connections

// onlineRef.on('value', snapshot => {
  
//   oldRealTimeDb
//     .ref(`/status/${userId}`)
//     .onDisconnect() // Set up the disconnect hook
//     .set('offline') // The value to be set for this key when the client disconnects
//     .then(() => {
//         // Set the Firestore User's online status to true
//         usersRef
//           .doc(userId)
//           .set({
//             online: true,
//           }, { merge: true});  

//         // Let's also create a key in our real-time database
//         // The value is set to 'online'
//         oldRealTimeDb.ref(`/status/${userId}`).set('online');
//     });
  
// });









// exports.onUserStatusChanged = functions.database
//   .ref('/status/{userId}') // Reference to the Firebase RealTime database key
//   .onUpdate(event => {
//     const usersRef = db.collection('/users'); // Create a reference to the Firestore Collection
  
//     return event.data.ref.once('value')
//       .then(statusSnapshot => snapShot.val()) // Get the latest value from the Firebase Realtime database
//       .then(status => {
//         // check if the value is 'offline'
//         if (status === 'offline') {
//           // Set the Firestore's document's online value to false
//           usersRef
//             .doc(event.params.userId)
//             .set({
//               online: false
//             }, { merge: true });
//         }
//       })
// });

















///////////////////////

// Actifs () {
//   var uid = firebase.auth().currentUser.uid;
//   var userId = firebase.auth().currentUser.uid;
//   // const db = firebase.firestore(); --> up

//   var usersRef = db.collection('users');
//   var onlineRef = dbRef.ref('.info/connected'); // Get a reference to the list of connections

//   onlineRef.on('value', snapshot => {
    
//     dbRef
//       .ref(`/status/${userId}`)
//       .onDisconnect() // Set up the disconnect hook
//       .set('offline') // The value to be set for this key when the client disconnects
//       .then(() => {
//           // Set the Firestore User's online status to true
//           usersRef
//             .doc(userId)
//             .set({
//               online: true,
//             }, { merge: true});  

//           // Let's also create a key in our real-time database
//           // The value is set to 'online'
//           dbRef.ref(`/status/${userId}`).set('online');
//         });
  
//     });



//   //partie 2 
//   dbRef.ref('/status/{userId}') // Reference to the Firebase RealTime database key
//   .onUpdate(event => {
//     return event.data.ref.once('value')
//       .then(statusSnapshot => snapShot.val()) // Get the latest value from the Firebase Realtime database
//       .then(status => {
//         // check if the value is 'offline'
//         if (status === 'offline') {
//           // Set the Firestore's document's online value to false
//           usersRef
//             .doc(event.params.userId)
//             .set({
//               online: false
//             }, { merge: true });
//         }
//       })
// });
//     }