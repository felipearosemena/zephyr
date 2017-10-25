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
    navOpen: false,
    overlayActive: false,
    filtersActive: false,
    cart: CartService.cart,
    products: ProductService.products,
    productArray: [],
    allProductsLoaded: false,
    product: {},
    filters: {},
    query: {}
  },

  setState(newOpts) {
    Object.assign(this.state, newOpts)
  },

  setProduct(slug) {
    return ProductService
      .loadProducts({ slug: slug })
      .then(products => {

        if(products.length) {

          const product = products[0]

          this.setState({ product: Object.assign(product, {
            canAddToCart: !Object.keys(product.variations).length
          }) })
        }

      })
  },

  productCanAdd(bool) {
    this.state.product.canAddToCart = bool
  },

  getAllProducts() {

    if(this.state.allProductsLoaded) {
      return new Promise(r => r())
    }

    return ProductService
      .loadProducts({ per_page: 99 })
      .then(products => {

        if(products.length) {
          this.setState({
            productArray: products,
            allProductsLoaded: true
          })
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

  toggleFlyout(propK, bool) {
    const prop = this.state[propK]
    const active = (bool !== null && bool !== undefined) ? bool : !prop
    const newState = { overlayActive: active }
    newState[propK] = active
    this.setState(newState)
  },

  toggleCart(bool) {
    this.toggleFlyout('cartActive', bool)
  },

  toggleNav(bool) {
    this.toggleFlyout('navOpen', bool)
  },

  toggleShopFilters(bool) {
    this.toggleFlyout('filtersActive', bool)
  },

  closeFlyouts() {
    this.setState({
      navOpen: false,
      overlayActive: false,
      filtersActive: false
    })
  },

  clearFilters() {
    this.state.filters = {}
  },

  setQuery(query) {
    this.toggleShopFilters(false)

    this.setState({
      query: query
    })
  }

}

export default store
