import store from 'app/store'
import CartService from 'app/cart.service'
import { mapObject } from 'modules/utils'

const Cart = {
  template: require('templates/cart.component.html'),
  props: [ 'cart', 'is-active', 'is-loading', 'is-checkout', 'products' ],
  mounted() {},
  data() {
    return {
      subtotal: ''
    }
  },
  watch: {
    isLoading() {}
  },
  methods: {
    toggleCart() {
      store.toggleCart()
    },
    remove(key) {
      CartService.remove(key)
    },
    setQuantity(key, qty) {
      CartService.setQuantity(key, qty)
    }
  }
}

export default Cart
