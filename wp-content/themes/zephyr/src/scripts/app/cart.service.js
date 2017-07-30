import Vue from 'vue'
import { eventBusFactory } from 'modules/eventBus'

import { apiFetch } from 'modules/load'
import { mapObject, arrayToObj } from 'modules/utils'

const CartService = new Vue({
  data: {
    cart: {
      count: 0,
      contents: [],
      products: {}
    }
  },

  methods: Object.assign({

    addToCart(id) {

      fetch(`?add-to-cart=${ id }`, { credentials: 'same-origin' })
        .then(res => res.text())
        .then(res => {
          this.getCart()
        })

    },

    getCart() {
      apiFetch(Global.api_namespace + '/cart')
        .then(res => res.json())
        .then(cart => {

          this.publish('cart-fetched', cart)
          this.cart.contents = cart.cart_contents
          this.cart.count    = cart.count

        })
    }
  }, eventBusFactory())

})

CartService.getCart() 

export default CartService