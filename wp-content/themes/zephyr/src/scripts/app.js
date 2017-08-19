import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import router from 'app/router'
import store from 'app/store'
import Default from 'app/default.component'
import Cart from 'app/cart.component'
import CartService from 'app/cart.service'
import ProductService from 'app/product.service'
import 'app/shop.component'
import 'app/single-product-form.component'

import { arrayToObj, delegate } from 'modules/utils'

Vue.use(VueRouter)
Vue.use(VueResource)

const methods = {
  setupRoutes() {

    router.addRoutes([
      {
        path: '/product/:slug',
        beforeEnter(to, from, next) {
          const { slug } = to.params
          store.setProduct(slug)
            .then(next)
        }
      }
      ,{
        path: '*',
        components: { default: Default }
      }
    ])

    router.beforeEach((to, from, next) => {
      this.routerBeforeEach(to, from, next)
    })

    document.addEventListener('click', delegate('a[href]', function(e) {
      e.preventDefault()
      if(this.href.indexOf(window.location.host) > -1){
        router.push(this.getAttribute('href'))
      }
    }))

  },

  routerBeforeEach(to, from, next) {

    next()

    store.setState({ transiting: true })

    if(store.isCached(to.path) && this.cacheExclude.indexOf(to.path) == -1) {
      this.finalizeRouteTransition(to, store.state.cachedResponses[to.path])
    } else {

      this.$http.get(to.path, {
        before: request => {

          if (this.previousRequest) {
            this.previousRequest.abort()
          }

          // set previous request on Vue instance
          this.previousRequest = request

        }
      })
      .then(res => {
        this.finalizeRouteTransition(to, res.body)
      })
      .catch(err => console.log(err))

    }
  },

  finalizeRouteTransition(to, html) {

    this.setCurrentView(html)
    store.cacheResponse(to.path, html)

    setTimeout(() => {
      store.setState({ transiting: false })
    }, 0)

  },

  setCurrentView(html) {
    this.createSectionComponent('page-view', '.page-view-wrap', html)
    this.currentView = this.getRouteComponentId('page-view')
  },

  getRouteComponentId(namespace) {
    return `${namespace + this.$route.path.replace(/\//g, '-')}`.replace(/-+$/g, '')
  },

  setCurrent(namespace) {
    this.currenView = this.getRouteComponentId(namespace)
  },

  createSectionComponent(namespace, selector, html) {

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html')
    const id = this.getRouteComponentId(namespace)

    Vue.component(id, {
      data() {
        return options.data
      },
      methods: methods,
      template: doc.querySelector(selector).outerHTML
    })

  },

  closeOverlay() {
    store.closeFlyouts()
  },

  toggleFilters() {
    store.toggleShopFilters()
  },

  bindGlobalEvents() {
    window.addEventListener('keydown', e => {
      switch(e.keyCode) {
        case 27: {
          store.toggleCart(false)
          break;
        }
      }

    })
  }

}

const options = {

  data:  {
    state: store.state,
    routeComponents: {},
    currentView: 'default',
    sections: arrayToObj(['hero', 'content', 'bottom', 'newsletter', 'footer'], s => s),
    CartService: CartService,
    ProductService: ProductService,
    cacheExclude: [ '/cart', '/checkout' ]
  },

  methods: methods,

  beforeMount() {
    this.setupRoutes()
    this.setCurrentView(this.$el.innerHTML)
    this.bindGlobalEvents()

    this.CartService.subscribe('cart-fetched', cart => {
      this.ProductService.addProducts(cart.products)
    })

    this.CartService.subscribe('cart-added', cart => {
      store.setState({ cartActive: true })
    })
  },

  components: {
    default: Default,
    cart: Cart
  }
}

export default function AppFactory(el) {

  const app = new Vue(Object.assign(options, {
    el: el,
    router: router
  }))

  return app

}
