import Vue from 'vue'

const SelectQuantity = {
  template: `
    <div class="select-wrapper select-quantity">
      <select v-on:change="onChange" :name="name">
        <option v-for="n in 9" :selected="value == n">{{ n }}</option>
        <option v-if="value > 9" selected>{{ value }}</option>
      </select>
    </div>
  `,
  props: {
    onChange: {
      default: () => {},
      type: Function
    },
    value: {
      default: '0',
      type: String
    },
    name: {
      type: String
    },
  }
}

Vue.component('select-quantity', SelectQuantity)

export default SelectQuantity
