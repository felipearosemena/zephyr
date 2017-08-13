import Vue from 'vue'

import router from 'app/router'
import store from 'app/store'

import { toggleClass } from 'modules/utils'
import { initModal } from 'modules/modal'

export default function NavFactory(el) {

  const nav = new Vue({
    el: el,
    router: router,
    data: store.state,
    mounted() {
      this.toggle = toggleClass(document.body, 'is-nav-active')
      this.modal = initModal(document.querySelector('#site-nav'))
      this.modal.subscribe('open', () => this.onOpen())
      this.modal.subscribe('close', () => this.onClose())
    },
    methods: {
      toggleCart: bool => store.toggleCart(bool),
      onOpen() {
        this.toggle(true)
        store.setState({ navOpen: true })
      },
      onClose() {
        this.toggle(false)
        store.setState({ navOpen: false })
      },
    }
  })

  router.beforeEach((to, from, next) => {
    nav.modal.close()
    next()
  })

  return nav

}
