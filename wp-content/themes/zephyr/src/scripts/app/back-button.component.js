import Vue from 'vue'
import router from 'app/router'
import store from 'app/store'

const BackButton = {
  template: `
    <button v-on:click="goBack" tabindex="0" aria-label="Back one page">
      <slot></slot>
    </button>
  `,
  props: ['default'],
  methods: {
    goBack() {
      if(store.state.hasNavigated) {
        router.go(-1)
      } else if(this.default) {
        router.push(this.default)
      }
    }
  }
}

Vue.component('back-button', BackButton)
