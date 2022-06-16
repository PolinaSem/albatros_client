<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar
        class="bg-white"
      >

        <q-toolbar-title>
          <span class="text-positive">Join</span><span class="text-black">.Albatros</span>
        </q-toolbar-title>

        <div class="text-grey q-mr-md">{{bio}}</div>

        <q-btn flat color="red" @click="logoutUser">Выход</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      side="left"
      v-model="sideMenu"
      show-if-above
      bordered
    >
      <q-list separator>
        <q-item v-for="link in appNavigation" :to="link.path">
          <q-item-section>
            <q-item-label>{{link.label}}</q-item-label>
            <q-item-label caption>{{link.caption}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',
  preFetch({store}) {
    store.dispatch('user/checkUser')
    store.dispatch('quiz/fetchQuiz')
    store.dispatch('position/fetchPositions')
  },
  setup () {
    const $store = useStore()
    const $router = useRouter()
    const {bio} = $store.getters['user/getUser']

    const appNavigation = [
      {
        path: '/',
        label: 'Главное меню',
        caption: 'Информация о приложени'
      },
      {
        path: '/quiz/create',
        label: 'Создать тестирование',
        caption: 'Администрирование'
      },
      {
        path: '/quiz/control',
        label: 'Управление тестами',
        caption: 'Администрирование'
      },
      {
        path: '/quiz/positions',
        label: 'Управление должностями',
        caption: 'Должности'
      }
    ]

    const logoutUser = () => {
      $store.dispatch('user/logOut')
      $router.push('/auth')
    }

    return {
      sideMenu: ref(true),
      appNavigation,
      bio,
      logoutUser
    }
  }
})
</script>
