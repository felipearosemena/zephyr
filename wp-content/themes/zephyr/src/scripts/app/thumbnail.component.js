import Vue from 'vue'

const Thumbnail = {
  props: [ 'image', 'size' ],
  data() {

    const { image } = this
    const { sizes } = image
    const size = sizes[this.size]

    return Object.assign({}, image, {
      src: size ? size['src'] : image.src,
      width: size ? size['width'] : image.width,
      height: size ? size['height'] : image.height,
    })

  },
  template: `
    <img v-if="src" :src="src" :title="title" :alt="alt" :width="width" :height="height" />
  `
}

Vue.component('thumbnail', Thumbnail)
