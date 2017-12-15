import Vue from 'vue'

const ImageZoom = {
  template: `
    <div ref="rootEl" class="image-zoom" :class="{ 'is-active' : activeHover }" v-on:mousemove="onMouseMove"
      v-on:mouseenter="onMouseEnter"
      v-on:mouseleave="onMouseLeave">
      <div ref="container" class="image-zoom__container">
        <slot>
        </slot>
      </div>
    </div>
  `,

  props: ['active'],
  data() {
    return {
      scale: 40,
      activeHover: false
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

      if(!rect || !activeHover || rect.x !== this.rect.x || rect.y !== this.rect.y) {
        this.rect = rect
        return
      }

      const x = (e.clientX - rect.x) / rect.width
      const y = (e.clientY - rect.y) / rect.height

      this.setTransform(x, y)

    },

    setTransform(x, y) {
      this.$refs.container.style.transformOrigin = `${ x * 100 }% ${ y * 100 }%`
    }
  }

}

Vue.component('image-zoom', ImageZoom)

export default ImageZoom
