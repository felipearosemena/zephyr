import Vue from 'vue'
import store from 'app/store'

const SingleProductSlider = {
  template: `
  <div class="single-product-slider" v-on:click="toggle" v-bind:class="{ 'is-active' : active }">
    <carousel class="w-12-12" :per-page="1" :loop="true" :navigationEnabled="navigationEnabled" :paginationEnabled="paginationEnabled">
      <slot>
      </slot>
    </carousel>
    </div>
  `,
  data() {
    return {
      paginationEnabled: !!Modernizr.mobile
    }
  },
  methods: {
    toggle(e) {
      if(e.target.dataset.bg !== undefined) {
        store.toggleProductSlider()
      }
    }
  },
  mounted() {},
  props: ['active', 'navigation-enabled']
}

Vue.component('single-product-slider', SingleProductSlider)

export default SingleProductSlider
