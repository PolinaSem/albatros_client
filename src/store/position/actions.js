import { api } from "src/boot/axios"

export const fetchPositions = async ({commit}) => {
  try {
    const { data } = await api.get('positions')
    commit('SET_POSITIONS', data)
    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

export const createPosition = async ({commit, rootGetters}, name) => {
  try {
    await api.post('/position', {
      position: { name }
    }, {
      headers: {
        'Authorization': `Token ${rootGetters['user/getUser'].token}`
      }
    })

    return await fetchPositions({commit})
  } catch (err) {
    return Promise.reject(err)
  }
}

export const deletePosition = async ({commit, rootGetters}, id) => {
  try {
    await api.delete(`/position/${id}`, {
      headers: {
        'Authorization': `Token ${rootGetters['user/getUser'].token}`
      }
    })

    return await fetchPositions({commit})
  } catch (err) {
    return Promise.reject(err)
  }
}
