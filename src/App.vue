<script>
import { defineComponent } from 'vue'
import { useStoreGlobal } from './stores/storeGlobal.js'
import { useStoreUser } from './stores/storeUser.js'

export default defineComponent({
  name: 'App',
  setup() {
    const storeGlobal = useStoreGlobal()
    const storeUser = useStoreUser()

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
