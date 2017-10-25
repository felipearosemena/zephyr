import store from 'app/store'

const Cart = {
  template: require('templates/cart.component.html'),
  props: [ 'cart', 'is-active', 'products' ],
  mounted() {},
  methods: {
    toggleCart: () => store.toggleCart()
  }
}

export default Cart