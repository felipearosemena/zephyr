import Vue from 'vue'
import { apiFetch } from 'modules/load'
import { eventBusFactory } from 'modules/eventBus'
import { mapObject, arrayToObj, serializeObject } from 'modules/utils'
import store from 'app/store'

const ProductService = {

  products: {},
  requests: {},

  addProducts(products) {

    if(products.length) {
      products.map(product => {
        this.products[product.id] = product
      })
    }

    store.setState({ products: this.products })

  },

  cacheRequest(url, req) {
    this.requests[url] = req
  },

  getFromCache(url) {
    return this.requests[url]
  },

  inCache(url) {
    return this.requests[url] !== undefined
  },

  loadProducts(params = {}) {

    params.orderby = 'menu_order'
    params.order = 'asc'

    const requestURL = `wp/v2/product?${ serializeObject(params) }`

    return apiFetch(requestURL)
      .then(res => res.json())
      .then(products => {
        this.addProducts(products)
        return products
      })

    if(this.inCache(requestURL)) {
      return this.getFromCache(requestURL)
    } else {
      const def =

      this.cacheRequest(requestURL, def)

      return def
    }
  }

}

export default ProductService
