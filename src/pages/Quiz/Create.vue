<template>
  <q-page class="flex flex-center">
    <div class="q-pa-ma" style="width: 90%">

        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          alternative-labels
        >
          <q-step
            v-for="(quiz, index) in quizBody"
            :name="index+1"
            :title="`Вопрос ${index+1} из ${quizBody.length}`"
            :done="step > index+1"
          >
            <q-input
              v-model="quizTitle"
              outlined
              hint="Название опросника"
              label="Введи название теста"
              class="q-mb-md"
            ></q-input>

            <q-select
              v-model="currentPosition"
              :options="positions"
              outlined
              hint="Для какой должности"
              label="Выбери должность из списка"
              class="q-mb-md"
            ></q-select>

            <q-select
              v-if="isEdit"
              v-model="quizStatus"
              outlined
              hint="Статус доступности"
              class="q-mb-md"
              :options="['active', 'archive']"
            ></q-select>

            <q-input
              v-model="quiz.title"
              hint="Заголовок"
              outlined
            ></q-input>

            <div class="row q-mt-sm q-col-gutter-sm">
              <template v-for="(answer, answerId) in quiz.answers">
              <div class="col-1">
                <q-item>
                  <q-item-section>
                    <q-btn
                      outline
                      icon="mdi-close"
                      color="negative"
                      @click="onDeleteAnswer(index, answerId)"
                      :disable="quiz.answers.length === 1"
                    ></q-btn>
                  </q-item-section>
                </q-item>
              </div>
                <div class="col-9">
                  <q-input
                    v-model="answer.label"
                    hint="Вариант ответа"
                    outlined
                  ></q-input>
                </div>
                <div class="col-2">
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-checkbox
                        v-model="answer.isTrue"
                        color="teal"
                        label="Правильный ответ"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        @update:model-value="(value, evt) => onCheckboxUpdate(value, index, answerId)"
                        ></q-checkbox>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </template>
              <div class="col-12 text-right">
                <q-btn
                  flat
                  color="orange"
                  label="Добавить вариант ответа"
                  @click="addQuizAnswer(index)"
                  v-if="quiz.answers.length < 5"
                ></q-btn>
              </div>
            </div>
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn flat color="primary" label="Добавить вопрос" @click="addQuizBody()" />
              <q-btn
                flat
                color="positive"
                label="Следущий вопрос"
                v-show="step < quizBody.length"
                @click="$refs.stepper.next()"></q-btn>
                <q-btn
                flat
                color="positive"
                label="пердыдущий вопрос"
                v-show="step <= quizBody.length && step > 1"
                @click="$refs.stepper.previous()"></q-btn>
              <q-btn flat color="negative" label="Завершить" v-if="!isEdit" @click="onCreateQuiz"></q-btn>
              <q-btn falat color="orange" label="Обновить" v-else @click="onUpdateQuiz"></q-btn>
            </q-stepper-navigation>
          </template>
        </q-stepper>
    </div>
  </q-page>
</template>

<script>
  import { ref, inject, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useQuasar } from 'quasar'

  export default {
    name: 'CreateQuiz',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      id: Number,
      title: String,
      questions: Array,
      position: Object,
      status: String
    },
    setup(props) {
      const $q = useQuasar()
      const $store = useStore()

      const positions = computed(() => $store.getters['position/getPositions'].map(p => p.name))
      const currentPosition = props.isEdit ? ref(props.position.name) : ref(positions.value[0])
      let updateStateQuiz = null

      if (props.isEdit) {
        updateStateQuiz = inject('updateQuiz').updateStateQuiz
      }

      const step = props.questions === undefined ? ref(1) : ref(props.questions.length)

      const quizBodyDefault = {
        title: 'Вопрос',
        answers: [
          { label: 'Вариант ответа', isTrue: false }
        ]
      }

      const quizTitle = ref(props.title)
      const quizStatus = ref(props.status)

       /* Убираем привязку к контексту переменной */
      const unBindVariable = payload => JSON.parse(JSON.stringify(payload))
      /**/

      const quizBody = props.questions === undefined ?
                        ref([unBindVariable(quizBodyDefault)]) :
                        ref(unBindVariable(props.questions))

      const addQuizBody = () => quizBody.value.push(unBindVariable(quizBodyDefault))

      const addQuizAnswer = index => {
        quizBody.value[index].answers.push({ label: 'Вариант ответа', isTrue: false })
      }

      const onCheckboxUpdate = (value, index, answerId) => {
        quizBody.value[index].answers.forEach((el, idx) => {
          el.isTrue = idx === answerId
        })
      }

      const onDeleteAnswer = (index, answerId) => {
          quizBody.value[index].answers = quizBody.value[index].answers.filter((a, i) => i !== answerId)
      }

      const onUpdateQuiz = () => {
        $store.dispatch('quiz/updateQuiz', {
          id: props.id,
          title: quizTitle.value,
          position: currentPosition.value,
          questions: quizBody.value,
          status: quizStatus.value
        }).then(() => {
          $q.notify({
            color: 'positive',
            icon: 'mdi-progress-alert',
            message: 'Успешно обновлено!'
          })
          updateStateQuiz(false)
        })
      }

      const onCreateQuiz = () => {
        $store.dispatch('quiz/createQuiz', {
          title: quizTitle.value,
          position: currentPosition.value,
          questions: unBindVariable(quizBody.value)
        }).then(() => {
          $q.notify({
            color: 'positive',
            icon: 'mdi-progress-alert',
            message: 'Успешно обновлено!'
          })
          quizBody.value = [unBindVariable(quizBodyDefault)]
          quizTitle.value = null

        }).catch(err => {
          $q.notify({
            color: 'negative',
            icon: 'mdi-progress-alert',
            message: err.message
          })
        })
      }

      return {
        step,
        quizBody,
        addQuizBody,
        addQuizAnswer,
        onCheckboxUpdate,
        onDeleteAnswer,
        isEdit: props.isEdit,
        onUpdateQuiz,
        quizTitle,
        quizStatus,
        onCreateQuiz,
        positions,
        currentPosition
      }
    }
  }
</script>
