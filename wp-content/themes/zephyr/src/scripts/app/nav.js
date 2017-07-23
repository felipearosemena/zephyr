import Vue from 'vue'

import router from 'app/router'
import store from 'app/store'

import { toggleClass } from 'modules/utils'
import { initModal } from 'modules/modal'


export default function NavFactory(el) {

  const nav = new Vue({
    el: el,
    router: router,
    data: store.state
  })

  const modal = initModal(document.querySelector('#site-nav'))
  const toggle = toggleClass(document.body, 'is-nav-active')
  
  modal.subscribe('open', () => toggle(true))
  modal.subscribe('close', () => toggle(false))

  router.beforeEach((to, from, next) => {
    modal.close()
    next()
  })

  return nav

}