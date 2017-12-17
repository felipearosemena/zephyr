import Vue from 'vue'
import { randomFromArray, mapObject, inArray } from 'modules/utils'
import router from 'app/router'

const getTransformObject = string => {

  const obj = {}
  const res = string
    .split(')').filter(v => v)
    .map(prop => {
      const keyVal = prop.split('(')
      if(keyVal[0].trim() == 'translate3d') {
        const t = keyVal[1].split(',')
        obj[keyVal[0].trim()] = {
          x: t[0],
          y: t[1],
          z: 0,
        }
      } else {
        obj[keyVal[0]] = keyVal[1]
      }

      return obj
    })

  return obj

}

const joinTransformObject = obj => {
  let str = ''

  for(let k in obj) {

    let value = obj[k]

    if(k.trim() == 'translate3d') {
      value = mapObject(obj[k]).join(',')
    }

    str += `${k}(${value}) `

  }

  return str
}

const ShapeItem = {
  template: `
  <a :href="href" :class="[ 'shape-item shape-item--' + term.slug + ' remove-underline' , { 'is-hovered' : isHovered}]" ref="el" v-on:click.stop.prevent>

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
    return Object.assign({}, {
      isHovered: false,
      shrapnelEls: [],
      shrapnelCount: inArray(this.term.slug, ['basics']) ? 0 : 3,
    }, this.shrapnelConfig())
  },
  methods: {

    shrapnelConfig() {

      let w = 500, h = 500, direction = [-1, -1]

      switch (this.term.slug) {
        case 'round':
          break;
        case 'cushion':
          direction = [1, -1]
          break;
        case 'oval':
          direction = [1.5, 1]
          w = 350
          h = 400
          break;
        case 'emerald':
          direction = [-1, 0.5]
          w = 800
          h = 450
          break;
        case 'pear':
          direction = [-1, 1]
          break;
        case 'basics':
          break;
      }

      return { box: { width: w, height: h },  direction: direction}

    },

    animateShrapnel() {

      const { shape, svg, shrapnel, el } = this.$refs
      const { shrapnelEls, box, direction } = this
      const { offsetWidth, offsetHeight } = shrapnel

      const rect = shape.getBoundingClientRect()

      const positions = []

      const validatePosition = position => {
        const { width, height } = shrapnelEls[0].getBoundingClientRect()

        if(!positions.length) {
          return true
        }

        const absolutePositions = positions
          .map(p => p.map(Math.abs))
          .filter(p => {
            const currentValues = position.map(Math.abs)

            return (currentValues[0] > p[0] + width/2 || currentValues[0] < p[0] - width/2) && (currentValues[1] > p[1] + height/2 || currentValues[1] < p[1] - height/2)

          })

        return absolutePositions.length == positions.length

      }

      const getPositionValue = () => {

        const position = [ 'width', 'height' ]
          .map((coord, i) =>
            box[coord] * rect[coord] / svg[coord].baseVal.value * 0.5 * direction[i]
          )
          .map(coord => {
            const rand  = (Math.random() * 120 - 60)
            const value = Math.abs(coord + rand) * (coord > 0 ? 1 : -1)
            return value
          })

        if(validatePosition(position)) {
          positions.push(position)
          return position
        } else {
          return getPositionValue()
        }

      }

      const setPosition = (s, i) => {

        const position  = getPositionValue()

        s.style.transform  = s.dataset.transform = `translate3d(${ position[0] }px, ${ position[1]}px, 0)`

      }

      shrapnelEls.map(setPosition)

    },

    resetShrapnel() {
      this.shrapnelEls.map(s => {
        s.style = ''
      })
    },

    toggle(bool) {

      this.isHovered = bool

      if(bool) {
        this.animateShrapnel()
      } else {
        this.setTransform(0, 0)
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

    let { shrapnelCount } = this
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
