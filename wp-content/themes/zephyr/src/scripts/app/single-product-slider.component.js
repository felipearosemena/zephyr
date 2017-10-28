import Vue from 'vue'
import store from 'app/store'

const SingleProductSlider = {
  template: `
    <div class="single-product-slider" ref="rootEl" v-bind:class="{ 'is-active' : active }">
      <carousel class="w-12-12" :per-page="1" :loop="true" :navigationEnabled="true">
        <slot></slot>
      </carousel>
    </div>
  `,
  props: [],
  mounted() {
    const { rootEl } = this.$refs
    rootEl.addEventListener('click', () => {
      store.toggleProductSlider()
    })
  },
  props: ['active']
}

Vue.component('single-product-slider', SingleProductSlider)
