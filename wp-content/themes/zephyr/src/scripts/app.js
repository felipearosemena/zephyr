import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import router from 'app/router'
import store from 'app/store'
import Cart from 'app/cart.component'

import { arrayToObj } from 'modules/utils'


Vue.use(VueRouter)
Vue.use(VueResource)

store.init()

// const Default = { template: '<h1 class="mt-2 mb-2">Default</h1>' }
const Default = { template: '<span></span>' }

const options = {

  data:  {
    sharedState: store.state,
    routeComponents: {},
    currentView: 'default',
    sections: arrayToObj(['hero', 'content', 'bottom', 'newsletter', 'footer'], s => s)
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
    { path: '*', components: { 
        default: Default,
        cart: Cart
      } 
    }
  ])

  router
    .beforeEach((to, from, next) => {

      next()

      store.setState('transiting', true)

      app.$http
        .get(to.path, {
          before: request => {

            if (app.previousRequest) {
              app.previousRequest.abort()
            }

            // set previous request on Vue instance
            app.previousRequest = request

          }
        })
        .then(res => {

          setCurrentView(app, res.body)
          store.setState('transiting', false)

        })
        .catch(err => console.log(err))

    })

  return app

}