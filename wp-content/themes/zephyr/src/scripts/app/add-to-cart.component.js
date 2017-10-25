import Vue from 'vue'

const AddToCartComponent = {
  template: `
    <button
      type="submit"
      class="btn btn--body btn--full"
      :name="name"
      :value="value"
      v-bind:class="{
        'is-disabled' : !canAdd,
        'shake' : canAdd
      }">
      <div v-if="loading" class="spinner"></div>
      <span>
        <slot></slot>
      </span>
    </button>
  `,
  props: [ 'canAdd', 'name', 'value', 'loading' ],
}

Vue.component('add-to-cart', AddToCartComponent)
