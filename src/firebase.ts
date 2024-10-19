import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// import {
//   getFirestore,
//   Firestore,
//   collection,
//   CollectionReference,
//   doc,
//   setDoc,
//   getDocs
// } from 'firebase/firestore/lite'

// import { computed, onMounted, onUnmounted, ref } from 'vue'
// import type { User } from 'firebase/auth'

const config = {
  apiKey: 'AIzaSyAqTVk0Qloy0TY9QyOmUyx4h21QUUUNHGM',
  authDomain: 'recipeasy-15c55.firebaseapp.com',
  projectId: 'recipeasy-15c55',
  storageBucket: 'recipeasy-15c55.appspot.com',
  messagingSenderId: '854529536469',
  appId: '1:854529536469:web:109e808c4f6afc9189cd5c'
}

const firebaseapp = initializeApp(config)
export const auth = getAuth()

// Auth Controls

// export const useAuthState = () => {
//   const user = ref<User | null>(null)
//   const error = ref<FirebaseError | null>(null)

//   let unsubscribe: (() => void) | undefined
//   onMounted(() => {
//     unsubscribe = onAuthStateChanged(
//       auth,
//       (u) => (user.value = u),
//       (e) => {
//         if (e instanceof FirebaseError) {
//           error.value = e
//         } else {
//           console.error('An non-firebase unknown error occurred', e)
//         }
//       }
//     )
//   })
//   onUnmounted(() => {
//     if (unsubscribe) {
//       unsubscribe()
//     }
//   })

//   const isAuthenticated = computed(() => user.value != null)

//   return { user, error, isAuthenticated }
// }

// function registerNewUser(e: Event) {
//   if (e.target) {
//     const { email, password } = e?.target?.elements
//   }
//   console.log('registering')
//   // createUserWithEmailAndPassword(auth, email, password)
//   //   .then((userCredential) => {
//   //     // Signed up
//   //     const user = userCredential.user
//   //     console.log('user: ', user)
//   //     // ...
//   //   })
//   //   .catch((error) => {
//   //     const errorCode = error.code
//   //     const errorMessage = error.message
//   //     console.log('code: ', errorCode)
//   //     console.log('MSG: ', errorMessage)
//   //   })
// }

// export const getUserState = () =>
//   new Promise((resolve, reject) => onAuthStateChanged(getAuth(), resolve, reject))

// async function getRecipes(db) {
//   const citiesCol = collection(db, 'recipes')
//   const citySnapshot = await getDocs(citiesCol)
//   const cityList = citySnapshot.docs.map((doc) => doc.data())
//   return cityList
// }
