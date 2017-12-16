import Vue from 'vue'
import store from 'app/store'
import CartService from 'app/cart.service'

const Cart = {
  template: require('templates/cart.component.html'),
  props: [ 'cart', 'is-active', 'is-loading', 'is-checkout', 'products', 'notices' ],
  mounted() {},
  data() {
    return {
      subtotal: '',
    }
  },
  methods: {
    toggleCart() {
      store.toggleCart()
    },
    onErrorsClose() {
      store.setState({
        notices: Object.assign({}, store.notices, {
          error: []
        })
      })
    }
  }
}

Vue.component('cart', Cart)

export default Cart
