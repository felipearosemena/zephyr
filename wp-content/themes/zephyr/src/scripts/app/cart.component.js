import Vue from 'vue'
import store from 'app/store'
import CartService from 'app/cart.service'

const Cart = {
  template: require('templates/cart.component.html'),
  props: [ 'cart', 'is-active', 'is-loading', 'is-checkout', 'products' ],
  mounted() {},
  data() {
    return {
      subtotal: '',
    }
  },
  watch: {
    isLoading() {}
  },
  methods: {
    toggleCart() {
      store.toggleCart()
    }
  }
}

Vue.component('cart', Cart)

export default Cart
