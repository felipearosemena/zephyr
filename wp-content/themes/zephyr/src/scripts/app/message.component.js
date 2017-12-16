import store from 'app/store'
import Vue from 'vue'

const Message = {
  template: `
    <div :class="['message', 'message--close', type ? 'message--' + type : '' ]" :style="{
      display: isClosed ? 'none' : 'block'
    }">
      <p class="message__close">
        <button class="btn-text" v-on:click="close"><i class="icon-close"></i></button>
      </p>
      <slot></slot>
    </div>
  `,
  props: ['type', 'onClose'],
  data() {
    return {
      isClosed: false
    }
  },
  methods: {
    close() {
      this.onClose()
    }
  }
}

Vue.component('message', Message)
