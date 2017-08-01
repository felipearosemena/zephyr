import Vue from 'vue'
import { apiFetch } from 'modules/load'
import { eventBusFactory } from 'modules/eventBus'
import { mapObject, arrayToObj, serializeObject } from 'modules/utils'

const ProductService = {

  products: {},

  addProducts(products) {

    if(products.length) {
      products.map(product => {
        this.products[product.id] = product
      })
    }

  },

  loadProducts(params = {}) {

    return apiFetch(`wp/v2/product?${ serializeObject(params) }`)
      .then(res => res.json())
      .then(products => {
        this.addProducts(products)
        return products
      })
  }

}

export default ProductService