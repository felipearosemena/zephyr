import Vue from 'vue'
import CartService from 'app/cart.service'
import ProductService from 'app/product.service'

const merge = Vue.config.optionMergeStrategies.computed

const store = {

  initialized: false,

  state: {
    pageContent: '',
    cachedResponses: {},
    transiting: false,
    initialized: true,
    cartActive: false,
    cart: CartService.cart,
    products: ProductService.products,
    product : {}
  },

  setState(newOpts) {
    Object.assign(this.state, newOpts)
  },

  setProduct(slug) {
    ProductService
      .loadProducts({ slug: slug })
      .then(products => {
        if(products.length) {
          this.setState({ product: products[0] })
        }
      })
  },

  cacheResponse(k, html) {
    this.state.cachedResponses[k] = html
  },

  isCached(k) {
    return this.state.cachedResponses[k] !== undefined
  },

  setPageContent(html) {

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html')

    this.setState({ pageContent : doc.querySelector('.page-content').innerHTML })

  },

  toggleCart(bool) {

    const { cartActive } = this.state
    const active = (bool !== null && bool !== undefined) ? bool : !cartActive

    this.setState({ cartActive: active })
  }

}

window.store = store

export default store