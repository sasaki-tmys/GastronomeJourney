// import { defineStore } from 'pinia'

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     user: null,
//     isLoggedIn: false,
//   }),
//   actions: {
//     login(userData: any) {
//       if (userData.name === 'sasaki' && userData.password === 'Pass12345') {
//         this.user = userData
//         return true
//       } else {
//         return false
//       }
//     },
//     setIsLoggedIn(value: any) {
//       this.isLoggedIn = value;
//     },
//     setUser(user: any) {
//       this.user = user
//     },
//     logout() {
//       this.user = null
//       this.isLoggedIn = false
//       return true
//     },
//   },
//   getters: {
//     isAuthenticated(state) {
//       return !!state.user;
//     }
//   },
// })

import { defineStore } from 'pinia'

interface userData {
  name: string
  email: string
  accountName: string
  avatar: string
  background: string
  address: string
  useStartDate: string
  contents: string
  currentFollow: string
  currentFollower: string
  postCounts:string
  password?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    login(userData: any) {
      if (userData.name === 'sasaki' && userData.password === 'Pass12345') {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      } else {
        return false
      }
    },
    setIsLoggedIn(value: any) {
      this.isLoggedIn = value
    },
    setUser(user: any) {
      this.user = user
    },
    logout() {
      this.isLoggedIn = false
      this.user = null
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('user')
      return true
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    }
  },
})

export default useAuthStore