import Vue from 'vue'
import store from 'app/store'

const Shop = {
  template: `
    <section class="section">
      <slot></slot>
    </section>
  `,
  props: ['products', 'filters'],
  methods: {},
  mounted() {
    console.log(this.products);
  },
  data() {
    return {}
  },
}

Vue.component('shop', Shop)

export default Shop
