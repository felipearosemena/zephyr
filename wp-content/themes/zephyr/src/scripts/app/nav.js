import Vue from 'vue'

import router from 'app/router'
import store from 'app/store'

export default function NavFactory(el) {

  const nav = new Vue({
    el: el,
    router: router,
    data: store.state,
    methods: {
      toggleCart: () => store.toggleCart(),
      toggleNav: () => store.toggleNav()
    }
  })

  router.beforeEach((to, from, next) => {
    next()
  })

  return nav

}
