import Vue from 'vue'

const Thumbnail = {
  props: [ 'image', 'size' ],
  methods: {
    getSizeProp(key) {
      const { image } = this
      const { sizes } = image
      const size = sizes[this.size]
      return  size ? size[key] : image[key]
    }
  },
  computed: {
    src() {
      return this.getSizeProp('src')
    },
    width() {
      return this.getSizeProp('width')
    },
    height() {
      return this.getSizeProp('height')
    }

  },
  template: `
    <img v-if="src" :src="src" :title="image.title" :alt="image.alt" :width="width" :height="height" />
  `
}

Vue.component('thumbnail', Thumbnail)
