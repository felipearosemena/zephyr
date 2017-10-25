import Vue from 'vue'
import router from 'app/router'
import { mapObject } from 'modules/utils'

const Filters = {
  template: `
    <div id="filters">
      <slot
        :toggleVisibility="toggleVisibility"
        :applyFilter="applyFilter"
        :clearFilters="clearFilters"
        :currentFilters="currentFilters"
        :hasFilters="hasFilters"></slot>
    </div>
  `,
  props: ['store', 'query'],

  data() {
    return {
      currentFilters: {
        product_cat: [],
        product_tag: []
      },
      instance: this
    }
  },

  mounted() {
    this.getFiltersFromQuery()
  },

  computed: {
    hasFilters() {
      return this.currentFilters.product_cat.length || this.currentFilters.product_tag.length
    }
  },

  watch: {
    query() {
      this.getFiltersFromQuery()
    }
  },

  methods: {

    getFiltersFromQuery() {
      mapObject(this.store.state.query, (taxonomy, slugs) => {
        this.currentFilters[taxonomy] = slugs.map(s => s) // Map it to new object to prevent reactivity
      })
    },

    toggleVisibility() {
      this.store.toggleShopFilters()
    },

    applyFilter() {

      const querystring = {}

      for (let k in this.currentFilters) {
        const slugs = this.currentFilters[k].map(s => s)
        if(slugs.length) {
          querystring[k] = slugs.join(',')
        }
      }

      router.push({ query: querystring })

    },

    clearFilters() {

      mapObject(this.currentFilters, k => {
        this.currentFilters[k] = []
      })

      router.push({ query: {} })
    }
  }
}

Vue.component('filters', Filters)
