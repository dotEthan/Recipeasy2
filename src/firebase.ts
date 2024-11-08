import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// const config = {
//   apiKey: 'AIzaSyAqTVk0Qloy0TY9QyOmUyx4h21QUUUNHGM',
//   authDomain: 'recipeasy-15c55.firebaseapp.com',
//   projectId: 'recipeasy-15c55',
//   storageBucket: 'recipeasy-15c55.appspot.com',
//   messagingSenderId: '854529536469',
//   appId: '1:854529536469:web:109e808c4f6afc9189cd5c'
// }

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const firebaseapp = initializeApp(config)
export const auth = getAuth()
