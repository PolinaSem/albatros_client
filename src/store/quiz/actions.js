import { api } from 'boot/axios'

export const fetchQuiz = async ({commit}) => {
  try {
    const { data } = await api.get('/quiz')
    commit('SET_QUIZ', data.quiz)
  } catch(err) {
    return Promise.reject(err)
  }
}

export const updateQuiz = async ({commit, rootGetters}, { id, title, position, questions, status }) => {
  try {
    const { data } = await api.put(`/quiz/${id}`, {
      quiz: {
        title,
        position,
        questions,
        status
      }
    }, {
      headers: {
        'Authorization': `Token ${rootGetters['user/getUser'].token}`
      }
    })
    return await fetchQuiz({commit, rootGetters})
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deleteQuiz = async ({commit, rootGetters}, quizId) => {
  try {
    await api.delete(`/quiz/${quizId}`, {
      headers: {
        'Authorization': `Token ${rootGetters['user/getUser'].token}`
      }
    })
    return await fetchQuiz({commit, rootGetters})
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createQuiz = async ({commit, rootGetters}, { title, position, questions }) => {
  const {id} = rootGetters['position/getPositions'].filter(p => p.name === position).pop()
  try {
    await api.post('/quiz', {
      quiz: {
        title,
        position: id,
        questions
      }
    },
    {
      headers: {
        'Authorization': `Token ${rootGetters['user/getUser'].token}`
      }
    })
    return await fetchQuiz({commit, rootGetters})
  } catch (err) {
    return Promise.reject(err)
  }
}
