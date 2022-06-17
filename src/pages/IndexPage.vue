<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-12 text-center" v-if="interviewers.length == 0">
          <span class="text-h4 text-grey-9">Тестирование еще не проводилось</span>
      </div>
      <div
        v-else
        class="col-xl-3 col-md-6 col-12"
        v-for="interviewer in interviewers"
      >
        <q-card>
          <q-item>
            <q-item-section>
              <q-item-label class="text-h5">{{interviewer.bio}}</q-item-label>
              <q-item-label caption>{{interviewer.email}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                <span v-if="!interviewer.results">Тест еще не пройден</span>
                <span v-else class="text-positive">Тест пройден</span>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              Тест: {{interviewer.quiz.title}}
            </q-item-section>
            <q-item-section side>
              <q-input
                disable
                filled
                :label="interviewer.quiz.link"
              >
                <template v-slot:after>
                  <q-btn
                    round
                    dense
                    flat
                    icon="mdi-content-copy"
                    @click="setLinkOnBuffer(interviewer.quiz.link)"
                  ></q-btn>
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              Ссылка на результат:
            </q-item-section>
            <q-item-section side>
              <span v-if="!interviewer.results" class="text-negative">Результаты временно недоступны</span>
              <template v-else>
                <q-input
                  disable
                  filled
                  :label="interviewer.link"
                >
                  <template v-slot:after>
                    <q-btn
                      round
                      dense
                      flat
                      icon="mdi-content-copy"
                      @click="setLinkOnBuffer(interviewer.link)"
                    ></q-btn>
                  </template>
                </q-input>
              </template>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const $q = useQuasar()
    const $store = useStore()

    const interviewers = computed(() => $store.getters['interviewer/getInterviewers'])

    const setLinkOnBuffer = link => {
      navigator.clipboard.writeText(window.location.origin + '/' + link).then(() => {
        $q.notify({
          color: 'teal',
          message: 'Ссылка скопирована в буфер обмена!'
        })
      })
    }

    return {
      interviewers,
      setLinkOnBuffer
    }
  }
})
</script>
