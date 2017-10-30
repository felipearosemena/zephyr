import Vue from 'vue'
import { randomFromArray } from 'modules/utils'
import router from 'app/router'

const ShapeItem = {
  template: `
  <a :href="href" class="shape-item remove-underline" v-bind:class="{ 'is-hovered' : isHovered }" ref="el" v-on:click.stop.prevent>

    <span class="shape-item__shrapnel" ref="shrapnel"></span>

    <div class="shape-item__icon" ref="svg-wrap">

      <slot name="svg">
        <svg></svg>
      </slot>

    </div>

    <div class="shape-item__img" ref="img-wrap">

      <slot name="image">
        <img/>
      </slot>

    </div>

    <div class="shape-item__content">
      <h2 class="shape-item__title">{{ term.name }}</h2>

      <div class="shape-item__label">
        <b>{{ label }}</b>
      </div>
    </div>

  </a>

  `,
  props: [ 'href', 'term', 'label' ],
  data() {
    return {
      isHovered: false,
      shrapnelEls: [],
      shrapnelCount: 3
    }
  },
  methods: {
    animateShrapnel() {

      const { shape, svg, shrapnel, el } = this.$refs
      const { shrapnelEls } = this
      const rect = shape.getBoundingClientRect()

      const directionOptions = {
        x: [-1, 1],
        y: [-1, 1]
      }

      const direction = [ -1,-1 ]

      const { offsetWidth, offsetHeight } = shrapnel
      const box  = { width: 400, height: 300 }
      const clearance = 30

      const setPosition = (s, i) => {

        const position  = [ 'width', 'height' ]
          .map((coord, i) =>
            box[coord] * rect[coord] / svg[coord].baseVal.value * 0.5 * direction[i]
          )
          .map(coord => {
            const rand  = (Math.random() * 120 - 60)
            const value = Math.abs(coord + rand) * (coord > 0 ? 1 : -1)
            return value
          })

        s.style.transform = `scale(1.2) translate3d(${ position[0] }px, ${ position[1]}px, 0)`

      }

      shrapnelEls.map(setPosition)

    },

    resetShrapnel() {
      this.shrapnelEls.map(s => {
        s.style.transform = `translate3d(0px, 0px, 0)`
      })
    },

    toggle(bool) {

      this.isHovered = bool

      if(!bool) {
        this.setTransform(0, 0)
      }
      if(bool) {
        this.animateShrapnel()
      } else {
        this.resetShrapnel()
      }
    },

    setTransform(x, y) {

      const max = 2

      this.$refs.image.setAttribute('style', `transform: translate(${ -x * max }%, ${ -y * max }%)`)

    },

    handleMouseMove({ clientX, clientY }) {

      const { svg } = this.$refs
      const rect = svg.getBoundingClientRect()
      const { width, height } = rect

      const x = (clientX - rect.left - width/2 ) / (width/2)
      const y = (clientY - rect.top - height/2) / (height/2)

      this.setTransform(x, y)

    },

    onLinkClick() {

    }


  },

  mounted() {

    Object.assign(this.$refs, {
      svg: this.$refs['svg-wrap'].querySelector('svg'),
      shape: this.$refs['svg-wrap'].querySelector('.shape-outline'),
      image: this.$refs['img-wrap'].querySelector('img')
    })

    let shrapnelCount = 3
    const { shrapnel, svg } = this.$refs

    if(svg) {
      while(shrapnelCount--) {
        this.shrapnelEls.push(shrapnel.appendChild(svg.cloneNode(true)))
      }
    }

    const { shape, el } = this.$refs

    shape.addEventListener('mouseover' , () => this.toggle(true))
    shape.addEventListener('mouseleave', () => this.toggle(false))
    shape.addEventListener('mousemove' , e => this.handleMouseMove(e))
    shape.addEventListener('click', e => {
      router.push(el.getAttribute('href'))
    })

  }


}

Vue.component('shape-item', ShapeItem)
