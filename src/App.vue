<script>
import { defineComponent } from 'vue'
import { useGlobalStore } from './stores/storeGlobal.js'
import { useUserStore } from './stores/storeUser.js'

export default defineComponent({
  name: 'App',
  setup() {
    const storeGlobal = useGlobalStore()
    const storeUser = useUserStore()

    const data = window.userAPI.getData
    storeUser.login = data.login
    storeUser.computer = data.computer

    storeGlobal.onSocket()
    return {}
  },
})
</script>

<template>
  <router-view />
</template>
