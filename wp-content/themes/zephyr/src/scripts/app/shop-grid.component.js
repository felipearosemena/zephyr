import Vue from 'vue'
import store from 'app/store'

const ShopGrid = {
  template: require('templates/shop-grid.component.html'),
  props: [ 'products' ],
  methods: {}
}

Vue.component('shop-grid', ShopGrid)
