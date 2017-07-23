import './modules/polyfills'
import './modules/modernizrTests'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import Cookies from 'js-cookie'
import smoothScroll from 'smooth-scroll'

import AppFactory    from 'app'
import HeaderFactory from 'app/header'
import NavFactory    from 'app/nav'

import router from './modules/router'
import EventBus from './modules/EventBus'
import { collection, getBpObj, toggleClass, debounce, whichTransitionEnd } from './modules/utils'
import { keyDownEscape, windowResized } from './modules/globalEvents'

import sharePost from './modules/sharePost'
import toggleTarget from './modules/toggleTarget'
import { initModal, initVideoModal } from './modules/modal'

// import createVideoIframe from './modules/video'
// import createLoader from './modules/ajaxLoader'

// Stub the console, if it doesn't exist
window.console = window.console || { log() {} } 

Vue.use(VueRouter)
Vue.use(VueResource)

/**
 *
 * Initialize App
 * 
 */

const app    = AppFactory(document.querySelector('.page-wrap'))
const header = HeaderFactory(document.querySelector('.site-header'))
const nav    = NavFactory(document.querySelector('#site-nav'))

const breakpoints = getBpObj()

/**
 * 
 * Listen for card elements click, and trigger click on the links inside,
 * making the whole card clickable
 * 
 */

collection('[data-card-click]').map(card => {
  card.addEventListener('click', e => {
    const link = card.querySelector('[data-card-link]')
    if(link) { link.click() }
  })
})


/**
 *
 * Smooth scroll for links within the same page
 * 
 */

EventBus.subscribe(windowResized, e => {
  smoothScroll.init({
    speed: 1000,
    offset: document.querySelector('#site-header').offsetHeight,
  })
})

/**
 *
 * Search Bar Toggle
 * 
 */

const siteSearch = document.querySelector('#site-search')

// Focuses automatically when opening
const toggleSearchController = toggleTarget('.js-toggle-search', {
  onToggleOpen: (els) => siteSearch.querySelector('input').focus()
})

// Close the search bar on `esc` press
EventBus.subscribe(keyDownEscape, () => {
  toggleSearchController.closeAll()
})

/**
 *
 *  Generic Toggle
 * 
 */

toggleTarget('.js-toggle')


/**
 *
 * Tabs Toggles
 * 
 */

const tabsToggles = toggleTarget('.js-toggle-tab') 

/**
 *
 * Accordion Toggles
 * 
 */

const accordionToggles = toggleTarget('.js-toggle-accordion') 

/**
 * 
 * Set CSS `max-height` for the tabs & accordions, to allow animating the opening/closing 
 * via CSS transitions.
 * 
 */

const setTogglesMaxHeight = (toggles) => {

  toggles.getElements()
    .map(els => els.target)
    // Filter out duplicate targets
    .filter((target, i, arr) => {
      return arr.indexOf(target) == i
    })
    .map(target => {

      const { activeClass } = toggles
      const isActive = target.classList.contains(activeClass)

      target.style.maxHeight = 'none'

      if(!isActive) {
        target.classList.add(activeClass)
      }

      target.style.maxHeight = target.offsetHeight + 'px'

      if(!isActive) {
        target.classList.remove(activeClass)
      }

    })

}

EventBus.subscribe(windowResized, e => {

  // Refresh the max heights
  setTogglesMaxHeight(tabsToggles)
  setTogglesMaxHeight(accordionToggles)

  // Reset the tabs when on
  if(window.innerWidth > breakpoints.tabs) {
    tabsToggles.reset()
  }
})

/**
 *
 *  Sliders
 * 
 */

collection('.js-slider')
  .filter(el => el.children.length > 1)
  .map(el => new Flickity(el, {
    pageDots: el.dataset.pageDots == 'false' ? false : true
  }))

/**
 *
 * Mobile Slider instantiation.
 *
 * If the window is below a certain width (in this case our 'lg' CSS breakpoint), initialize the slider
 * otherwise, destroy it.
 * 
 */
EventBus.subscribe(windowResized, () => {

  const sliders = collection('.js-mobile-slider')

  if(window.innerWidth <= breakpoints.lg) {
    sliders
      .filter(el => !Flickity.data(el))
      .map(el => new Flickity(el, {
        pageDots: true,
        prevNextButtons: false
      }))
  } else {
    sliders
      .map(el => Flickity.data(el))
      .filter(flickity => flickity)
      .map(flickity => flickity.destroy())
  }

})

/**
 *
 * Modals
 * 
 */

collection('.js-modal').map(modalEl => initModal(modalEl))

/**
 *
 * Video Modals
 * 
 */

collection('.js-video-modal').map(modalEl => initVideoModal(modalEl, '[data-video-player]'))

/**
 *
 * Video Players
 * 
 */

collection('.js-video-player').map(videoEl => createVideoIframe(videoEl))


/**
 *
 * Share Post
 * 
 */

sharePost('.js-share-post')

/**
 *
 * Shape Terms
 * 
 */

function randomFromArray(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}

function animateShrapnel(shrapnel, container, shape, svg) {

  const directionOptions = [-1, 1]
  const direction = [randomFromArray(directionOptions), randomFromArray(directionOptions)]
  const { offsetWidth, offsetHeight } = container
  const box  = shape.getBBox()
  const rect = svg.getBoundingClientRect()
  const position  = [ 'width', 'height' ].map((coord, i) => {
    return box[coord] * rect[coord] / svg[coord].baseVal.value * 0.5 * direction[i]
  })

  shrapnel.map(s => {
    s.style.transform = `translate3d(${ position[0] }px, ${ position[1]}px, 0)`
  })

}

function resetShrapnel(shrapnel) {
  shrapnel.map(s => {
    s.style.transform = `translate3d(0px, 0px, 0)`
  })
}

// collection('.js-shape-term').map(el => {

//   let promise = new Promise(resolve => resolve())
//   let direction = false

//   const { href }  = el
//   const shapeSVG = el.querySelector('[data-shape-icon] svg')
//   const shape = shapeSVG.querySelector('path, circle, polygon, ellipse, rect')
//   const shrapnelContainer = el.querySelector('[data-shrapnel]')
//   const shrapnelEls = []

//   const toggle = bool => {
//     toggleClass(el, 'is-hovered', bool)

//     if(bool) {
//       animateShrapnel(shrapnelEls, shrapnelContainer, shape, shapeSVG)
//     } else {
//       resetShrapnel(shrapnelEls)
//     }
//   }

//   let shrapnelCount = 4

//   if(shape) {
 
//     // while(shrapnelCount--) {
//     //   shrapnelEls.push(shrapnelContainer.appendChild(shapeSVG.cloneNode(true)))
//     // }

//     shape.addEventListener('mouseover' , () => toggle(true))
//     shape.addEventListener('mouseleave', () => toggle(false))
//     shape.addEventListener('click', () => window.location = href)
//     el.addEventListener('click', e => e.preventDefault())

//   }

// })


// Fire initial custom events
EventBus.publish(windowResized)
