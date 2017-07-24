import Vue from 'vue'
import { apiFetch } from 'modules/load'
import { mapObject, arrayToObj, serializeObject } from 'modules/utils'

const ProductService = {

  products: {},

  loadProducts(params = {}) {

    return apiFetch(`wc/v2/products?${ serializeObject(params) }`)
      .then(res => res.json())
      .then(products => {

        if(products.length) {
          products.map(product => {
            this.products[product.slug] = product
          })
        }

        return  products

      })
  }

}

export default ProductService