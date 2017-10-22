import Vue from 'vue'
import store from 'app/store'
import CartService from 'app/cart.service'

const SingleProductForm = {
  template: `
    <form enctype='multipart/form-data' method="POST"  v-on:submit.prevent="handleFormSubmit">
      <slot></slot>
    </form>
  `,
  mounted() {

    this.$refs.size     = this.$el.querySelector('[name=attribute_pa_size]')
    this.$refs.quantity = this.$el.querySelector('[name=quantity]')

    const { size } = this.$refs;

    if(size) {
      size.addEventListener('change', this.handleSizeChange)
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

    }
  },
  methods: {
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
      store.productCanAdd(!!e.target.value)
    }
  }
}

Vue.component('single-product-form', SingleProductForm)

export default SingleProductForm
