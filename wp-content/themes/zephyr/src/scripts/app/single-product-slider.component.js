import Vue from 'vue'
import store from 'app/store'

const SingleProductSlider = {
  template: `
    <div class="single-product-slider" ref="rootEl" v-bind:class="{ 'is-active' : active }">
      <carousel class="w-12-12" :per-page="1" :loop="true" :navigationEnabled="navigationEnabled" :paginationEnabled="false">
        <slot></slot>
      </carousel>
    </div>
  `,
  mounted() {

    const { rootEl } = this.$refs

    rootEl.addEventListener('click', e => {
      if(e.target.dataset.bg !== undefined) {
        store.toggleProductSlider()
      }
    })
  },
  props: ['active', 'navigation-enabled']
}

Vue.component('single-product-slider', SingleProductSlider)

export default SingleProductSlider
