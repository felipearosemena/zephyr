import Vue from 'vue'
import { eventBusFactory } from 'modules/eventBus'

import { apiFetch } from 'modules/load'
import { mapObject, arrayToObj } from 'modules/utils'

const CartService = new Vue({
  data: {
    cart: {
      count: 0,
      contents: []
    }
  },

  methods: Object.assign({

    handleCartResponse(res) {

      res.json().then(cart => {

        this.publish('cart-fetched', cart)
        this.cart.contents = cart.cart_contents
        this.cart.count    = cart.count
        this.cart.subtotal = cart.cart_subtotal

      })

    },

    addToCart(id, params = {}) {

      return apiFetch(Global.api_namespace + '/cart/add/' + id, 'post', params)
        .then(res => {
          this.handleCartResponse(res)
          this.publish('cart-added')
          return res
        })
    },

    getCart() {
      apiFetch(Global.api_namespace + '/cart')
        .then(res => this.handleCartResponse(res))
    }
  }, eventBusFactory())

})

export default CartService
