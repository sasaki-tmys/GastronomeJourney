// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDDjeg2plvxULXo1ae2X7z07yRy38n20g8',
  authDomain: 'gjourney-project.firebaseapp.com',
  projectId: 'gjourney-project',
  storageBucket: 'gjourney-project.appspot.com',
  messagingSenderId: '596838736327',
  appId: '1:596838736327:web:b9acb31727de9a08ae79e2',
  measurementId: 'G-DCB40LXS7E'
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
