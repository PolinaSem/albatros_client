<template>
  <q-page class="flex flex-center">
    <div class="q-pa-ma" style="width: 90%">
      <template v-if="quiz?.questions !== undefined && !isEnd">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          alternative-labels
        >
          <q-step
            v-for="(question, index) in quiz.questions"
            :name="index+1"
            :title="`Вопрос ${index+1} из ${quiz.questions.length}`"
            :done="step > index+1"
          >
            <q-item>
              <q-item-section>
                <q-item-label class="text-h5">{{question.title}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced></q-separator>
            <q-list class="q-mt-md" bordered separator v-if="interviewerAnswers">
              <template v-for="(answer, answerId) in interviewerAnswers[index].answers">
                <q-item tag="label" v-ripple>
                  <q-item-section side top>
                    <q-checkbox
                      v-model="answer.isTrue"
                      @update:model-value="(value, evt) => onCheckboxUpdate(value, index, answerId)"
                    ></q-checkbox>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1">{{answer.label}}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                flat
                color="positive"
                label="Следущий вопрос"
                :disable="!(step < quiz.questions.length)"
                @click="$refs.stepper.next()"></q-btn>
                <q-btn
                flat
                color="positive"
                label="пердыдущий вопрос"
                :disable="!(step <= quiz.questions.length && step > 1)"
                @click="$refs.stepper.previous()"></q-btn>
              <q-btn flat color="negative" label="Завершить тестирование" @click="onQuizSave"></q-btn>
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </template>
      <template v-else>
        <span class="text-h4 text-grey-9" v-if="!isEnd">Тест не найден</span>
        <span v-else class="text-h4 text-grey-9">Тест завершен!</span>
      </template>
    </div>
    <q-dialog
      v-model="interviewerInforamationDialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section>
          <span class="text-h4 text-positive">JOIN.</span>
          <span class="text-h4">Albatros</span>
        </q-card-section>
        <q-card-section>
          <q-form
            ref="interviewerForm"
          >
            <div class="row q-col-gutter-sm">
              <div class="col-md-4 col-12">
                <q-input
                  v-model="interviewerBio"
                  label="ФИО"
                  outlined
                  :rules="[val => val && val.length > 0 || 'Данные введены не верно']"
                ></q-input>
              </div>
              <div class="col-md-4 col-12">
                <q-input
                  v-model="interviewerEmail"
                  label="Email"
                  type="email"
                  outlined
                  :rules="[val => val && val.length > 0 || 'Данные введены не верно', val => isValidEmail(val)]"
                ></q-input>
              </div>
              <div class="col-md-4 col-12">
                <q-input
                  v-model="interviewerPhone"
                  type="tel"
                  filled
                  mask="# (###) ### - ####"
                  fill-mask
                  hint="Телефон"
                  :rules="[val => val && val.length > 10 || 'Данные введены не верно']"
                ></q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn flat color="positive" @click="onStartTest">Приступить к тестированию</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, toRaw, onMounted } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { useQuasar } from "quasar"

export default defineComponent({
  name: 'JoinQuiz',
  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const $route = useRoute()

    const quiz = computed(() => $store.getters['quiz/getQuiz'].filter(q => q.link.split('/').pop() === $route.params.quizLink).pop())

    const interviewerAnswers = ref(null)

    onMounted(() => {
      setTimeout(() => {
        if (typeof quiz.value !== 'undefined') {
          interviewerAnswers.value = JSON.parse(JSON.stringify(toRaw(quiz.value).questions.map(q => {
            q.answers = q.answers.map(a => {
              a.isTrue = false
              return a
            })
            return q
          })))
        } else {
          interviewerInforamationDialog.value = false
        }
      }, 1500)
    })

    const onCheckboxUpdate = (value, index, answerId) => {
      interviewerAnswers.value[index].answers.forEach((el, idx) => {
        el.isTrue = idx === answerId
      })
    }
    const isEnd = ref(false)

    const onQuizSave = () => {
      $store.dispatch('interviewer/createInterviewer', {
        bio: interviewerBio.value,
        email: interviewerEmail.value,
        phone: interviewerPhone.value,
        quiz: quiz.value.id,
        results: interviewerAnswers.value
      }).then(link => {
        $q.notify({
          color: 'teal',
          message: 'Данные успешно сохранены!'
        })
        $q.notify({
          color: 'orange',
          message: `Результаты: ${window.location.origin}/join/result/${link}`,
          timeout: 10000
        })
        isEnd.value = true
      }).catch(err => {
        $q.notify({
          color: 'negative',
          message: err.message
        })
      })
    }

    const isValidEmail = val => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Invalid email';
    }

    const step = ref(1)
    const interviewerInforamationDialog = ref(true)
    const interviewerBio = ref(null)
    const interviewerEmail = ref(null)
    const interviewerPhone = ref(null)
    const interviewerForm = ref(null)

    const onStartTest = () => {
      interviewerForm.value.validate().then( async result => {
        if (result) {
          interviewerInforamationDialog.value = false
        }
      })
    }


    return {
      quiz,
      step,
      interviewerAnswers,
      onCheckboxUpdate,
      onQuizSave,
      interviewerInforamationDialog,
      interviewerBio,
      interviewerEmail,
      interviewerPhone,
      interviewerForm,
      onStartTest,
      isEnd,
      isValidEmail
    }
  }
})
</script>
