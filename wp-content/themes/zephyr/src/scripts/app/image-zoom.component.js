import Vue from 'vue'

const ImageZoom = {
  template: `
    <div ref="rootEl" class="image-zoom" :class="{ 'is-active' : activeHover, 'is-loaded': loaded }" v-on:mousemove="onMouseMove"
      v-on:mouseenter="onMouseEnter"
      v-on:mouseleave="onMouseLeave"
      v-on:load="onLoad">
      <div ref="container" class="image-zoom__container">
        <slot :onLoad="onLoad">
        </slot>
      </div>
    </div>
  `,

  props: ['active'],
  data() {
    return {
      scale: 40,
      activeHover: false,
      loaded: false
    }
  },
  watch: {
    active() {

      if(!this.active) {
        this.activeHover = false
      }

      this.onResize()
    }
  },

  mounted() {
    window.addEventListener('resize', () => this.onResize())
  },

  updated() {
    this.onResize()
  },

  beforeDestroy() {
    window.removeEventListener('resize', () => this.onResize())
  },

  methods: {

    onLoad() {
      this.loaded = true
    },

    onResize() {
      if(this.$refs.rootEl) {
        this.rect = this.$refs.rootEl.getBoundingClientRect()
      }
    },

    onMouseEnter() {
      this.mouseover = true

      if(this.active) {
        this.activeHover = true
      }
    },

    onMouseLeave() {
      this.activeHover = false
      this.mouseover = false
    },

    onMouseMove(e) {

      if(!this.$refs.rootEl) {
        return
      }

      if(this.active && !this.activeHover) {
        this.activeHover = true
      }

      const { scale, activeHover } = this
      const rect = this.$refs.rootEl.getBoundingClientRect()

      if(!rect || !activeHover || rect.left !== this.rect.left || rect.top !== this.rect.top) {
        this.rect = rect
        return
      }

      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      this.setTransform(x, y)

    },

    setTransform(x, y) {
      this.$refs.container.style.transformOrigin = `${ x * 100 }% ${ y * 100 }%`
    }
  }

}

Vue.component('image-zoom', ImageZoom)

export default ImageZoom
