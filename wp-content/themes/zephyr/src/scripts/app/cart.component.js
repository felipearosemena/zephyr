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
    isLoading() {
      this.subtotal = mapObject(
        this.cart.contents,
        (k, { line_subtotal }) => line_subtotal
      ).reduce((curr, next) => curr + next, 0)
    }
  },
  methods: {
    toggleCart: () => store.toggleCart()
  }
}

export default Cart
