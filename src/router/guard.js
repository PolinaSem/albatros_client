import cookie from 'boot/cookie'

export default function (to, from, next) {
  if (cookie.getCookie('user') !== undefined && cookie.getCookie('user') !== null) {
    next()
  } else {
    next('/404')
  }
}
