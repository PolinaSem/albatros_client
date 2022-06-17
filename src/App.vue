<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  preFetch({store}) {
    store.dispatch('user/checkUser')
    store.dispatch('quiz/fetchQuiz')
    store.dispatch('position/fetchPositions')
    store.dispatch('interviewer/fetchInterviewers')
  }
})
</script>
