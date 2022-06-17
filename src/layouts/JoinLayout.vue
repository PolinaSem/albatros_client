<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar
        class="bg-white"
      >
        <q-toolbar-title to="/">
          <span class="text-positive">Join</span><span class="text-black">.Albatros</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
 
})
</script>
