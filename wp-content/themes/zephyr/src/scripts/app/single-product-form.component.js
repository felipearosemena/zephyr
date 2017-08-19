import Vue from 'vue'
import store from 'app/store'

const SingleProductForm = {
  template: `
    <form enctype='multipart/form-data'  v-on:submit.prevent="handleFormSubmit">
      <slot></slot>
    </form>
  `,
  mounted() {
    console.log(this.refs)
    // this.$refs.submit = this.$el.querySelector('[type=submit]')
    // console.log(this.$refs)
    // console.log(this.cartActive)
  },
  props: ['product', 'refs'],
  data() {
    return {

    }
  },
  methods: {
    handleFormSubmit(e) {
      store.setState({ canSubmit: true })
    }
  }
}

Vue.component('single-product-form', SingleProductForm)

export default SingleProductForm
