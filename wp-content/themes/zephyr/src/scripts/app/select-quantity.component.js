import Vue from 'vue'

const SelectQuantity = {
  template: `
    <div class="select-wrapper select-quantity">
      <select v-on:change="onChange" :name="name" v-model="selected">
        <option v-for="n in count" :value="n">{{ n }}</option>
      </select>
    </div>
  `,
  data() {
    return {
      count: 5,
      selected: this.value
    }
  },
  watch: {
    value() {
      this.selected = this.value
    }
  },
  props: {
    onChange: {
      default: () => {},
      type: Function
    },
    name: {
      type: String
    },
    refresh: {
      type: Boolean
    },
    value: {
      type: String,
      default: '1'
    }
  }
}

Vue.component('select-quantity', SelectQuantity)

export default SelectQuantity
