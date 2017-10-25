import Vue from 'vue'
import store from 'app/store'

const ShopItem = {
  template: require('templates/shop-item.component.html'),
  props: [ 'product' ],
  mounted() {},
  methods: {}
}

Vue.component('shop-item', ShopItem)
