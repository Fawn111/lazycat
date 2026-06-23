import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// 1. Go to https://console.firebase.google.com
// 2. Create a project → Add app (Web) → copy the config below
// 3. In Firebase console: Authentication → Sign-in method → enable Google

const firebaseConfig = {
  apiKey: "AIzaSyCDe3KlD-v0Ohj-vz71e58_Qe4hRBGfEe4",
  authDomain: "lazy-cat-15710.firebaseapp.com",
  projectId: "lazy-cat-15710",
  storageBucket: "lazy-cat-15710.firebasestorage.app",
  messagingSenderId: "1076030049935",
  appId: "1:1076030049935:web:a335982429b1d41586aafa",
  measurementId: "G-RP10RJ6DX8"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
