<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="row window-height">
          <div class="col-8">

          </div>
          <div class="col-4 bg-primary text-white">
            <div class="row q-col-gutter-sm justify-center items-center full-height">
              <div class="col-10 text-center">
                <span class="text-h4">Albatros</span>
                <span class="text-h4 text-light-green-5">.Guard</span>
                <q-card class="full-width">
                   <q-form
                      ref="loginForm"
                      @submit="onFormSubmit"
                    >
                      <q-card-section>
                        <q-input
                          v-model="email"
                          outlined
                          label="E-mail"
                          type="email"
                          :rules="[val => val && val.length > 1 || 'Поле заполненно не правильно']"
                        ></q-input>

                        <q-input
                          v-model="password"
                          outlined
                          label="Пароль"
                          type="password"
                          :rules="[val => val && val.length > 1 || 'Поле заполненно не правильно']"
                        ></q-input>

                    </q-card-section>
                    <q-card-actions>
                      <q-space></q-space>
                      <q-btn flat color="grey-14">Забыли пароль?</q-btn>
                      <q-btn outline color="primary" :loading="onLoginBtn" type="submit">Вход</q-btn>
                    </q-card-actions>
                  </q-form>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"

export default defineComponent({
  name: 'Auth',
  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const $router = useRouter()

    const email = ref(null)
    const password = ref(null)
    const onLoginBtn = ref(false)
    const loginForm = ref(null)

    const onFormSubmit = () => {
      onLoginBtn.value = true
      loginForm.value.validate().then(async resultValidate => {
        if (resultValidate) {
          await $store.dispatch('user/loginUser', {
            email: email.value,
            password: password.value
          }).then(bio => {
            $q.notify({
              color: 'teal',
              icon: 'mdi-progress-alert',
              message: `Добро пожаловать, ${bio}!`
            })
            $router.push('/')
          }).catch(err => {
            console.log(err)
            $q.notify({
              color: 'red-5',
              icon: 'mdi-progress-alert',
              message: 'Ошибка авторизации'
            })
            onLoginBtn.value = false
          })
        }
      })
    }

    return {
      email,
      password,
      onLoginBtn,
      loginForm,
      onFormSubmit
    }
  }
})

</script>
