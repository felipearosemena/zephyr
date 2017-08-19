import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'history',
  watch: {
    '$route' (to, from) {}
  }
})

export default router
