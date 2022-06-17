<template>
  <q-page class="flex flex-center">
    <div class="q-ma-pa" style="max-width: 600px">
      <q-card v-if="interviewer">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h5">{{interviewer.bio}}</q-item-label>
            <q-item-label caption>{{interviewer.email}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label :class="interviewer.results ? 'text-positive' : 'text-negative'">
              <span v-text="interviewer.results ? 'Тест пройден': 'Тест не пройдет'"></span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="text-center">
          <q-item-section>
            <q-item-label class="text-h3">{{rightAnswers}}</q-item-label>
            <q-item-label caption>правильных ответов</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>Тест из {{interviewer.quiz.questions.length}} вопросов</q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
      <q-card v-else>
        <q-card-section>Данные временно недоступны, попробуйте позже</q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import { useRoute } from "vue-router"

export default defineComponent({
  name: 'QuizResult',
  setup() {
    const $route = useRoute()
    const $store = useStore()

    const resultHash = $route.params.resultLink
    const interviewer = computed(() => $store.getters['interviewer/getInterviewers']
                                          .filter(i => i.link.split('/').pop() === resultHash).pop())

    const rightAnswers = ref(0)

    onMounted(() => {
      setTimeout(() => {
        if (interviewer.value) {
          interviewer.value.results.forEach((result, indexResult) => {
            result.answers.forEach((answer, indexAnswer) => {
              if ( interviewer.value.quiz.questions[indexResult].answers[indexAnswer].isTrue &&
                  interviewer.value.quiz.questions[indexResult].answers[indexAnswer].isTrue == answer.isTrue) {
                rightAnswers.value = rightAnswers.value + 1
              }
            })
          })
        }
      }, 1000)
    })

    return {
      resultHash,
      interviewer,
      rightAnswers
    }
  }
})
</script>
