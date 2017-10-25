import Vue from 'vue'
import store from 'app/store'
import CartService from 'app/cart.service'

const SingleProductForm = {
  template: `
    <form enctype='multipart/form-data' method="POST"  v-on:submit.prevent="handleFormSubmit">
      <slot></slot>

      <div class="mb-2 mt-1" v-if="product.variations && product.variations.pa_size">
        <button class="btn-text btn-text--sm" @click.prevent="showSizeModal = true">Size Chart</button>

        <modal v-if="showSizeModal" @close="showSizeModal = false">
          <div class="grid" slot="content">
            <div class="grid__item w-12-12 w-sm-4-12">
              <h3>Size Chart</h3>
            </div>
            <div class="grid__item w-12-12 w-sm-8-12">
              <p class="mt-05">Use this chart to help you figure out what size is your finger (I'm looking at you sausage fingerz).</p>
            </div>

            <div class="grid__item w-12-12">
              ${ require('templates/sizing-chart.html') }
            </div>
          </div>
        </modal>
      </div>

    </form>
  `,
  mounted() {

    this.$refs.size     = this.$el.querySelector('[name=attribute_pa_size]')
    this.$refs.quantity = this.$el.querySelector('[name=quantity]')
    this.$refs.submit   = this.$el.querySelector('[type=submit]')

    const { size, submit } = this.$refs;

    if(size) {
      size.addEventListener('change', this.handleSizeChange)

      if(submit) {
        submit.addEventListener('click', this.validateForm)
      }
    }
  },
  beforeDestroy() {

    const { size } = this.$refs;

    if(size) {
      size.removeEventListener('change', this.handleSizeChange)
    }

  },
  props: ['product', 'refs'],
  data() {
    return {
      showSizeModal: false
    }
  },
  methods: {
    validateForm() {
      if(!this.product.canAddToCart) {
        this.$refs.size.classList.add('has-error', 'shake')
      }
    },
    handleFormSubmit(e) {

      if(this.product.canAddToCart) {

        const { size, quantity } = this.$refs
        const variations = {}
        variations[size.name] = size.value

        const params = {
          quantity: quantity.value,
          variations: variations
        }

        CartService.addToCart(this.product.id, params)

      }

    },
    handleSizeChange(e) {

      if(e.target.value) {
        e.target.classList.remove('has-error', 'shake')
      }

      store.productCanAdd(!!e.target.value)
    }
  }
}

Vue.component('single-product-form', SingleProductForm)

export default SingleProductForm
