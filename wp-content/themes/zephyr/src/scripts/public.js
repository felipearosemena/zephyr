import './modules/polyfills'
import './modules/modernizrTests'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import SmoothScroll from 'smooth-scroll'

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

const smoothScroll = new SmoothScroll()

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

// Fire initial custom events
EventBus.publish(windowResized)
