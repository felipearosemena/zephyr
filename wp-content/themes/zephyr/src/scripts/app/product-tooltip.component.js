import Vue from 'vue'
import store from 'app/store'
import ProductService from 'app/product.service'

const ProductTooltip = {
  template: `
    <span class="product-tooltip-wrapper" ref="rootEl" v-bind:class="{ 'is-active' : active, 'is-loaded' : loaded }" v-on:mouseover="mouseover" v-on:mouseout="mouseout">

      <span class="product-tooltip" v-if="id">

        <div class="product-tooltip__content">

          <a :href="product.path" class="w-12-12">
            <transition-group name="opacity" class="product-tooltip__image">
              <thumbnail key="product-thumbnail" :image="product.thumbnail" size="sq_large" v-if="product.thumbnail" />
            </transition-group>
            <transition-group name="opacity" class="product-tooltip__labels">
              <div key="product-labels" class="flex justify-between" v-if="product.title">
                <h4 class="label-sm mb-0">
                  {{ product.title.rendered }}
                </h4>
                <small class="align-top tiny-text" v-html="product.price">
                </small>
              </div>
            </transition-group>
          </a>

        </div>

      </span>

      <slot></slot>
    </span>
  `,
  props: ['id'],
  data() {
    return {
      product: {},
      active: false,
      loaded: false
    }
  },
  methods: {
    mouseout() {
      this.active = false
    },
    mouseover(e) {

      this.active = true

      if(this.loaded) {
        return
      }

      ProductService.loadProducts({ include: [this.id] })
        .then(products => {
          if(products.length) {
            this.product = products[0]
            this.loaded = true
          }
        })

    },
  }
}

Vue.component('product-tooltip', ProductTooltip)
