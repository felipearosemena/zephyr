import CartService from 'app/cart.service'
import ProductService from 'app/product.service'

const store = {

  initialized: false,

  state: {
    pageContent: '',
    cachedResponses: {},
    transiting: false,
    initialized: true,
    cart: CartService.cart,
    products: ProductService.products,
    product : {}
  },


  setState(k, v) {

    if(this.state[k] == v) {
      return
    }

    this.state[k] = v

  },

  setProduct(slug) {
    ProductService
      .loadProducts({ slug: slug })
      .then(products => {

        if(products.length) {
          this.setState('product', products[0])
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

    this.setState('pageContent', doc.querySelector('.page-content').innerHTML)

  }

}

export default store