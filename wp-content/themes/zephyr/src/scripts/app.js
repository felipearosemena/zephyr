import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import router from 'app/router'
import store from 'app/store'
import Default from 'app/default.component'
import Cart from 'app/cart.component'
import CartService from 'app/cart.service'
import ProductService from 'app/product.service'


import { arrayToObj } from 'modules/utils'

Vue.use(VueRouter)
Vue.use(VueResource)

const options = {

  data:  {
    state: store.state,
    routeComponents: {},
    currentView: 'default',
    sections: arrayToObj(['hero', 'content', 'bottom', 'newsletter', 'footer'], s => s),
    CartService: CartService,
    cacheExclude: [ '/cart' ]
  },

  methods: {

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
        template: doc.querySelector(selector).outerHTML 
      })

    }
  },

  components: {
    default: Default
  }
}

const setCurrentView = (app, html) => {
  app.createSectionComponent('page-content', '.page-content', html)
  app.currentView = app.getRouteComponentId('page-content')
}

export default function AppFactory(el) {

  const app = new Vue(Object.assign(options, {
    el: el,
    router: router
  }))

  setCurrentView(app, el.innerHTML)

  router.addRoutes([
    {
      path: '/product/:slug',
      beforeEnter: (to, from, next) => {

        const { slug } = to.params

        store.setProduct(slug)

        next()
      }
    },
    { 
      path: '*', 
      components: { 
        default: Default,
        cart: Cart
      }
    }
  ])


  router
    .beforeEach((to, from, next) => {

      next()

      const finalize = html => {

        setCurrentView(app, html)
        store.cacheResponse(to.path, html)

        setTimeout(() => {
          store.setState('transiting', false)
        }, 0)

      }

      store.setState('transiting', true)

      if(store.isCached(to.path) && app.cacheExclude.indexOf(to.path) == -1) {
        finalize(store.state.cachedResponses[to.path])
      } else {

        app.$http.get(to.path, {
          before: request => {

            if (app.previousRequest) {
              app.previousRequest.abort()
            }

            // set previous request on Vue instance
            app.previousRequest = request

          }
        })
        .then(res => finalize(res.body))
        .catch(err => console.log(err))

      }

    })

  return app

}