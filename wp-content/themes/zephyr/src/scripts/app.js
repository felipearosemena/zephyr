import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueCarousel from 'vue-carousel'

import router from 'app/router'
import store from 'app/store'
import CartService from 'app/cart.service'
import ProductService from 'app/product.service'

import 'app/default.component'
import 'app/cart.component'
import 'app/cart-item.component'
import 'app/shop-grid.component'
import 'app/shop-item.component'
import 'app/filters.component'
import 'app/image-zoom.component'
import 'app/thumbnail.component'
import 'app/single-product-form.component'
import SingleProductSlider from 'app/single-product-slider.component'
import 'app/modal.component'
import 'app/add-to-cart.component'
import 'app/shape-item.component'
import 'app/product-tooltip.component'
import 'app/back-button.component'
import 'app/select-quantity.component'
import 'app/message.component'
import 'app/format-currency.filter'

import { arrayToObj, mapObject, delegate, serializeObject, isCheckout } from 'modules/utils'
import { logPageView } from 'modules/analytics'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueCarousel)

const methods = {
  setupRoutes() {

    router.addRoutes([
      {
        path: '/product/:slug',
        components: { singleProductSlider: SingleProductSlider },
        beforeEnter(to, from, next) {
          const { slug } = to.params
          store.setProduct(slug)
            .then(next)
        }
      },
      {
        path: '/shop',
        beforeEnter(to, from, next) {
          store.getAllProducts()
            .then(next)
        }
      },
      {
        path: '/product-category/:slug',
        beforeEnter(to, from, next) {
          store.getAllProducts()
            .then(next)
        },
      },
      {
        path: '*'
      }
    ])

    router.beforeEach((to, from, next) => {

      if(from.path.indexOf('/product/') == 0) {
        store.toggleProductSlider(false)
      }

      store.closeFlyouts()

      this.routerBeforeEach(to, from, next)
    })

    // document.addEventListener('click', delegate('a[href]', function(e) {

    //   if(this.getAttribute('href').indexOf(window.location.host) > -1 || isCheckout()) {
    //     return
    //   }

    //   if(this.getAttribute('href') == '#' || !this.getAttribute('href').length) {
    //     e.preventDefault()
    //     return
    //   }

    //   if(this.href.indexOf(window.location.host) > -1){
    //     e.preventDefault()
    //     router.push(this.getAttribute('href'))
    //   }
    // }))

  },

  routerBeforeEach(to, from, next) {

    if(!store.state.hasNavigated) {
      store.setState({ hasNavigated: true })
    }

    if(to.path == from.path) {
      return
    }

    store.setState({ transiting: true })

    if(store.isCached(to.path) && this.cacheExclude.indexOf(to.path) == -1) {
      setTimeout(() => {
        this.finalizeRouteTransition(to, store.state.cachedResponses[to.path], next)
      }, 0)
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
        this.finalizeRouteTransition(to, res.body, next)
      })
      .catch(err => {
        window.location = err.url
      })

    }
  },

  finalizeRouteTransition(to, html, next) {

    this.updateDocumentTitle(html)
    this.updateBodyClass(html)
    this.setCurrentView(html)

    store.cacheResponse(to.path, html)

    setTimeout(() => {
      store.setState({ transiting: false })
      next()
    }, 0)

  },

  setCurrentView(html) {
    const component = this.createSectionComponent('page-view', '.page-view-wrap', html)
    this.currentView = this.getRouteComponentId('page-view')
  },

  getRouteComponentId(namespace) {
    return `${namespace + this.$route.path.replace(/\//g, '-')}`.replace(/-+$/g, '')
  },

  setCurrent(namespace) {
    this.currenView = this.getRouteComponentId(namespace)
  },

  getDocFromHTML(html) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html')
  },

  createSectionComponent(namespace, selector, html) {

    const doc = this.getDocFromHTML(html)
    const id = this.getRouteComponentId(namespace)

    Vue.component(id, {
      data() {
        return Object.assign({
          title: doc.title
        }, options.data)
      },
      methods: methods,
      template: doc.querySelector(selector).outerHTML
    })

  },

  updateDocumentTitle(html) {
    const doc = this.getDocFromHTML(html)
    document.title = doc.querySelector('title').innerHTML
  },

  updateBodyClass(html) {
    const doc = this.getDocFromHTML(html)

    if(doc.body.className) {
      document.body.className = doc.body.className
    }

    document.body.classList.add('is-loaded')

    setTimeout(() => {
      document.body.classList.remove('is-loading')
    }, 1000)

  },

  closeOverlay() {
    store.closeFlyouts()
  },

  setQuery() {

    const query = {}

    mapObject(this.$route.query, (k, v) => {
      query[k] = v.split(',')
    })

    this.store.setQuery(query)

  },

  bindGlobalEvents() {

    window.addEventListener('keydown', e => {
      switch(e.keyCode) {
        case 27: {
          store.closeFlyouts()
          break;
        }
      }

    })
  }

}

const options = {

  data:  {
    store: store,
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
    store.cacheResponse(location.pathname, document.documentElement.innerHTML)

    this.setupRoutes()
    this.updateBodyClass(this.$el.innerHTML)
    this.setCurrentView(this.$el.innerHTML)
    this.bindGlobalEvents()

    this.CartService.subscribe('cart-fetched', (cart, res) => {

      const product_ids = mapObject(cart.cart_contents, (k, p) => p.product_id)

      if(product_ids.length) {

        this.ProductService
          .loadProducts({
            include: product_ids
          })
          .then(() => {
            store.setState({ cartLoading: false })
          })

      } else {
        store.setState({ cartLoading: false })
      }

    })

    this.CartService.subscribe('cart-added', cart => {
      store.toggleCart()
    })

    this.CartService.getCart()


  },

  watch: {
    '$route': function(newRoute, oldRoute) {
      // Log it
      logPageView(newRoute.path)

      const isShop = newRoute.path.indexOf('shop') > -1

      if(newRoute.path.indexOf('/product-category/') == 0) {
        store.setQuery({ product_cat: [ newRoute.params.slug]  })
      }

      if(isShop) {
        this.setQuery()
      }
    }
  },

  components: {}
}

export default function AppFactory(el) {

  const app = new Vue(Object.assign(options, {
    el: el,
    router: router
  }))

  return app

}
