import { api } from 'boot/axios'

export const fetchInterviewers = async ({commit, rootGetters}, query = {}) => {
  try {
    const { data: { interviewers } } = await api.get('/interviewer', {
      params: query,
      headers: {
        'Authorization': `Token ${rootGetters['user/getUser'].token}`
      }
    })
    commit('SET_INTERVIEWERS', interviewers)
    return interviewers
  } catch (err) {
    return Promise.reject(err)
  }
}
