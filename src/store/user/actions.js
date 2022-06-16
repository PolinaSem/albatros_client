import { api } from 'boot/axios'
import cookie from 'boot/cookie'

export const loginUser = async ({commit}, {email, password}) => {
  try {
    const response = await api.post('/login', {
      user: {
        email,
        password
      }
    })
    const { bio, token } = response.data.user
    cookie.setCookie('user', JSON.stringify({bio, token}))
    commit('SET_USER', { bio, token })
    return bio
  } catch (err) {
    return Promise.reject(err)
  }
}

export const checkUser = ({commit}) => {
  if (cookie.getCookie('user') !== undefined && cookie.getCookie('user') !== null) {
    commit('SET_USER', cookie.getCookie('user'))
  }
}

export const logOut = ({commit}) => {
  cookie.deleteCookie('user')
  commit('SET_USER', null)
}
