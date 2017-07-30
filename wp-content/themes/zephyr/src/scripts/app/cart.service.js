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

    handleCartResponse(res) {

      res.json().then(cart => {

        this.publish('cart-fetched', cart)
        this.cart.contents = cart.cart_contents
        this.cart.count    = cart.count

      })

    },

    addToCart(id) {
      apiFetch(Global.api_namespace + '/cart/add/' + id)
        .then(res => this.handleCartResponse(res))
    },

    getCart() {
      apiFetch(Global.api_namespace + '/cart')
        .then(res => this.handleCartResponse(res))
    }
  }, eventBusFactory())

})

CartService.getCart() 

export default CartService