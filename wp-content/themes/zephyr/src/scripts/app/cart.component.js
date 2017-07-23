import store from 'app/store'

const Cart = {
  template: require('templates/cart.component.html'),
  data: function() {
    return store.state.cart
  }
}

export default Cart