import { defineStore } from 'pinia'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  type User
} from 'firebase/auth'
import { firebaseApp } from '@/plugins/firebase'
import { getDatabase, set } from 'firebase/database'
import { ref as dbRef } from 'firebase/database'

const auth = getAuth(firebaseApp)
const db = getDatabase()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | User,
    isLoggedIn: false
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        this.isLoggedIn = true
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error: any) {
        const errorMessage = error.message
        alert(JSON.stringify(errorMessage, null, 2))
        return false
      }
    },
    async sginUp(email: string, password: string, username: string): Promise<boolean> {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        await updateProfile(this.user, {
          displayName: username
        })

        await set(dbRef(db, 'users/' + this.user.uid), {
          username: username,
          email: email
        })
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error: any) {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)

        return false
      }
    },
    async logout(): Promise<boolean> {
      try {
        await signOut(auth)
        this.isLoggedIn = false
        this.user = null
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('user')
        return true
      } catch (error: any) {
        console.log(error)
        return false
      }
    }
  }
})

export default useAuthStore
