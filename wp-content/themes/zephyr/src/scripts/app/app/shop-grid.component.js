import Vue from 'vue'
import store from 'app/store'

import { arrayIntersect } from 'modules/utils'

const ShopGrid = {
  template: require('templates/shop-grid.component.html'),
  props: [ 'products', 'query' ],
  computed: {
    activeProducts() {

      if(!this.products.length) {
        return
      }

      const queryKeys = Object.keys(this.query)

      return this.products.filter(p => {

        if(!queryKeys.length) {
          return true
        }

        return queryKeys.reduce((bool, k) => {

          if(!bool) {
            return false
          }

          let a = this.query[k];
          let b = p[k].map(term => term.slug);
          let intersection = [...a].filter(x => b.indexOf(x) > -1);

          return intersection.length

        }, true)

      })
    }
  }
}

Vue.component('shop-grid', ShopGrid)
