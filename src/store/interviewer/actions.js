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

export const createInterviewer = async ({rootGetters}, { bio, email, phone, quiz, results }) => {
  try {
    const { data: { link } } = await api.post('/interviewer', {
      interviewer: {
        bio,
        email,
        phone,
        quiz,
        results
      }
    }, {
      headers: {
        'Authorization': `Token ${rootGetters['user/getUser'].token}`
      }
    })

    return link.split('/').pop()
  } catch (err) {
    return Promise.reject(err)
  }
}
