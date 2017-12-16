import Vue from 'vue'
import { eventBusFactory } from 'modules/eventBus'

import store from 'app/store'
import NoticeService from 'app/notice.service'
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

    post(endpoint, params = {}) {
      return apiFetch(endpoint,  'post', params)
        .then(res => store.updateNonce(res.headers.get('nonce')))
        .then(res => {
          NoticeService.getNotices()
          return this.getCart()
        })
    },

    addToCart(id, params = {}) {
      return this
        .post(Global.api_namespace + '/cart/add/' + id, params)
        .then(res => {
          this.publish('cart-added')
          return res
        })
    },

    remove(key) {
      return this.post(Global.api_namespace + '/cart/remove/' + key)
    },

    setQuantity(key, qty) {
      return this.post(`${ Global.api_namespace }/cart/set_quantity/${ key }/${ qty }`)
    },

    getCart() {
      return apiFetch(Global.api_namespace + '/cart', 'get', {}, {
        'pragma': 'no-cache',
        'cache-control' : 'no-cache'
      })
        .then(res => this.hydrate(res))
    },

    hydrate(res) {

      return res.json().then(cart => {
        this.publish('cart-fetched', cart, res)
        this.cart.contents = cart.cart_contents
        this.cart.count    = cart.count
        this.cart.subtotal = cart.cart_subtotal

        return cart

      })

    }

  }, eventBusFactory())

})

export default CartService
