<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-center" v-if="!quizList">
        <span class="text-h3">Тесты еще не созданы</span><br>
        <q-btn flat color="orange" to="/quiz/create">Создать тест</q-btn>
      </div>
      <template v-else>
        <div
          class="col-lg-4 col-md-6 col-12"
          v-for="quiz in quizList"
        >
          <q-card>
            <q-item>
              <q-item-section>
                <q-item-label class="text-h5">{{quiz.title}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-5">
                  Должность: <span class="text-grey-9">{{quiz.position.name}}</span>
                </div>
                <div class="col-3">
                  Вопросов: <span class="text-grey-9">{{quiz.questions.length}}</span>
                </div>
                <div class="col-4">
                  Статус:
                  <span
                    :class="[quiz.status === 'active' ? 'text-positive' : 'text-grey-9', 'text-bold']">
                    {{quiz.status}}
                  </span>
                </div>
              </div>
            </q-card-section>
            <q-card-actions>
              <div class="row fit q-col-gutter-sm">
                <div class="col-9">
                  <q-input
                    disable
                    filled
                    :label="quiz.link"
                  >
                    <template v-slot:after>
                      <q-btn
                        round
                        dense
                        flat
                        icon="mdi-content-copy"
                        @click="setLinkOnBuffer(quiz.link)"
                        :disable="quiz.status !== 'active'"
                      ></q-btn>
                    </template>
                  </q-input>
                </div>
                <div class="col-3">
                  <q-btn flat dense color="primary" @click="onEditQuiz(quiz)">Редактировать</q-btn>
                  <q-btn flat dense color="negative" @click="onDeleteQuiz(quiz.id)">Удалить</q-btn>
                </div>
                <div class="col-12 text-right">
                  Автор:
                  <span class="text-primary">{{quiz.author.bio}}</span>
                </div>
              </div>
            </q-card-actions>
          </q-card>
          <q-dialog
            v-model="editDialog"
            persistent
            maximized
            transition-show="slide-up"
            transition-hide="slide-down"
          >
            <q-card>
              <q-bar class="bg-dark text-white">
                <q-space></q-space>
                <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                </q-btn>
              </q-bar>
              <q-card-section>
                <span>Редактируем тест id: {{editQuizProps.id}}</span>
                <create-quiz
                  :isEdit="true"
                  :id="editQuizProps.id"
                  :title="editQuizProps.title"
                  :questions="editQuizProps.questions"
                  :position="editQuizProps.position"
                  :status="editQuizProps.status"
                ></create-quiz>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </template>
    </div>
  </q-page>

</template>

<script>
import { defineComponent, computed, ref, provide } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"
import CreateQuiz from "./Create.vue"

export default defineComponent({
  name: 'QuizControl',
  components: {
    CreateQuiz
  },
  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const editDialog = ref(false)
    const editQuizProps = ref(null)

    const updateStateQuiz = props => {
      editDialog.value = props
    }

    provide('updateQuiz', {
      updateStateQuiz
    })

    const quizList = computed(() => $store.getters['quiz/getQuiz'].length > 0 ? $store.getters['quiz/getQuiz'] : null)

    const setLinkOnBuffer = (link) => {
      navigator.clipboard.writeText(window.location.origin + '/' + link).then(() => {
        $q.notify({
          color: 'teal',
          message: 'Ссылка скопирована в буфер обмена!'
        })
      })
    }

    const onEditQuiz = ({ id, title, position, questions, status }) => {
      editDialog.value = true
      editQuizProps.value = {id, title, position, questions, status}
    }

    const onDeleteQuiz = quizId => {
      $store.dispatch('quiz/deleteQuiz', quizId).then(() => {
        $q.notify({
          color: 'orange',
          message: 'Тест успешно удален'
        })
      }).catch(err => {
        $q.notify({
          color: 'negative',
          message: err.message
        })
      })
    }

    return {
      quizList,
      setLinkOnBuffer,
      onEditQuiz,
      editDialog,
      editQuizProps,
      onDeleteQuiz
    }
  }
})

</script>
