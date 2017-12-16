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
      selected: this.value,
      min: 5
    }
  },
  watch: {
    value() {
      this.selected = this.value
    }
  },
  computed: {
    count() {
      return this.getCount()
    }
  },
  methods: {
    getCount() {
      return (this.value && this.value > this.min) ? this.value : this.min
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
      default: '1'
    }
  }
}

Vue.component('select-quantity', SelectQuantity)

export default SelectQuantity
