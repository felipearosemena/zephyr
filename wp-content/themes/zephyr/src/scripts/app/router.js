import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'history',
  watch: { 
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }
})

export default router