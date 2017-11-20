import Vue from 'vue'

Vue.filter('format-currency', v => `$${v}`)
