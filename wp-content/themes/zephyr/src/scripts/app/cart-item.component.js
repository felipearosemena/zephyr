import Vue from 'vue'
import store from 'app/store'
import CartService from 'app/cart.service'

const CartItem = {
  template: require('templates/cart-item.component.html'),
  props: {
    itemKey: {
      type: String,
    },
    item: {
      type: Object,
    },
    product: {
      type: Object,
    },
    onTitleClick: {
      type: Function,
      default: () => {}
    },
    isCheckout: {
      type: Boolean
    }
  },
  watch: {
    item() {
      this.quantity = this.item.quantity
    }
  },
  mounted() {},
  data() {
    return {
      quantity: this.item.quantity
    }
  },
  methods: {
    remove() {
      this.isRemoving = true
      CartService.remove(this.itemKey)
        .then(() => {
          this.isRemoving = false
        })
    },
    setQuantity(e) {

      this.isSettingQuantity = true
      this.quantity = e.target.value

      CartService.setQuantity(this.itemKey, e.target.value)
        .then(() => {
          this.quantity = this.item.quantity
          this.isSettingQuantity = false
        })
    }
  }
}

Vue.component('cart-item', CartItem)

export default CartItem
