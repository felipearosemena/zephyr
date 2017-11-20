import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'history',
  watch: {
    '$route' (to, from) {}
  },
  scrollBehavior(to, from, savedPosition) {

    if (to.hash) {
      return {
        selector: to.hash,
        offset: { x: 0, y: 50 }
      }
    }

    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
