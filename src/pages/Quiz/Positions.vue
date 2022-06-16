<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-12 row q-col-gutter-sm justify-center q-mb-md items-center">
        <div class="col-md-4 col-10">
          <q-input
            v-model="positionName"
            label="Название должности"
            outlined
          ></q-input>
        </div>
        <div class="col-2">
          <q-btn flat color="positive" @click="onCreatePosition">Добавить</q-btn>
        </div>
      </div>
      <div
        v-if="positions.length > 0"
        class="col-lg-3 col-md-4 col-12"
        v-for="position in positions"
      >
        <q-card>
          <q-item>
            <q-item-section>
              <q-item-label caption>id: {{position.id}}</q-item-label>
              <q-item-label class="text-h5">{{position.name}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn color="negative" outline icon="mdi-close" @click="onDeletePosition(position.id)"></q-btn>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
      <div class="col-12 text-center" v-else>
        <span class="text-h4">Должности еще не созданы</span>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref } from "vue"
import { useStore } from "vuex"
import { useQuasar } from "quasar"

export default defineComponent({
  name: 'Positions',
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const positionName = ref(null)
    const positions = computed(() => $store.getters['position/getPositions'])

    const onCreatePosition = () => {
      if (!positionName.value) {
        $q.notify({
          color: 'negative',
          message: 'Введите название должности'
        })
      } else {
        $store.dispatch('position/createPosition', positionName.value).then(() => {
          $q.notify({
            color: 'positive',
            message: 'Должность создана!'
          })
        }).catch(err => {
          $q.notify({
            color: 'negative',
            message: err.message
          })
        })
      }
    }

    const onDeletePosition = id => {
      $store.dispatch('position/deletePosition', id).then(() => {
          $q.notify({
            color: 'positive',
            message: 'Должность удалена!'
          })
        }).catch(err => {
          $q.notify({
            color: 'negative',
            message: err.message
          })
        })
    }

    return {
      positions,
      positionName,
      onCreatePosition,
      onDeletePosition
    }
  }
})

</script>
