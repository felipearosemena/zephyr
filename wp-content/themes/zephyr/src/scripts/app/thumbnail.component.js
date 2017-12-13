import Vue from 'vue'

const Thumbnail = {
  props: [ 'image', 'size' ],
  data() {
    return {
      loaded: false
    }
  },
  methods: {
    getSizeProp(key) {
      const { image } = this
      const { sizes } = image
      const size = sizes[this.size]
      return  size ? size[key] : image[key]
    },
    onLoad() {
      this.loaded = true;
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
    <div :class="['thumbnail', loaded ? 'is-loaded' : '']" :style="{ paddingBottom: width/height * 100 + '%' }">
      <img v-on:load="onLoad" v-if="src" :src="src" :title="image.title" :alt="image.alt" :width="width" :height="height"/>
    </div>
  `
}

Vue.component('thumbnail', Thumbnail)
