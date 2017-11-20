import store from 'app/store'
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
    toggleCart: () => store.toggleCart()
  }
}

export default Cart
