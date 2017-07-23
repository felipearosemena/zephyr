import Vue from 'vue'

import router from 'app/router'
import store from 'app/store'

export default function HeaderFactory(el) {

  const header = new Vue({
    el: el,
    router: router,
    data: store.state
  })

  return header

}