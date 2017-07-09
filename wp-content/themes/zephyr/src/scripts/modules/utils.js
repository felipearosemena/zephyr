/**
 *
 * Utility functions
 *
 * Keep these functions as pure as possible (ie: input -> output ).
 * You can use globally available variables such as window and document.
 *
 */

import EventBus from './EventBus'
import { windowScrolled } from './globalEvents'

/**
 *
 * @returns {boolean}
 *
 */

export function inArray(item, array) {
  return array.indexOf(item) > -1
}

/**
 *
 * Create a new DOM element
 *
 * @param {string} tagname - Element tagname ('iframe', 'div')
 * @param {object} attributes - Object of attributes to be assigned to the object.
 * @param {String/False} namespace Optional namespace, used to create SVG and SVG inner elements
 * @returns {HTMLElement} The DOM element
 *
 */


export function createElement(tagname, attributes = {}, namespace = false) {

  let el

  if(namespace) {
    el = document.createElementNS(namespace, tagname)
  } else {
    el = document.createElement(tagname)
  }

  if(el.setAttribute) {
    for (var k in  attributes) {
      if (attributes.hasOwnProperty(k)) {
        el.setAttribute(k, attributes[k])
      }
    }
  }

  return el
}


/**
 *
 * Element.matches polyfill
 *
 * @param {HTMLElement} el - DOM element to check selector against
 * @param {string} selector - Selector string to use for matching
 *
 * @returns {boolean} Whether the selector matches or not.
 */

export function selectorMatches(el, selector) {
  let p = Element.prototype
  let fn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1
  }
  return fn.call(el, selector)
}

/**
 *
 * Return the first matched element by provided selector, traversing from current element to document.
 *
 * @param {HTMLElement} el - Element to find closest element to 
 * @param {string} selector - Selector to use for matching
 *
 * @return {HTMLElement|null} - The matching closest element or null
 * 
 */

export function closest(el, selector) {

  while (el) {
    if (selectorMatches(el, selector)) {
      return el;
    } else {
      el = el.parentElement;
    }
  }
  return null;
}

/**
 *
 *  Thunk function for event delegation using `addEventListener`
 *
 *  Usage:
 *
 *  element.addEventListener('click', delegate(selector, e => {
 *  
 *    // your callback
 *
 *  }))
 *
 *  @param {string} delegate - Selector string to use for delegation
 *  @param {function} handler - Event handler function
 *
 *  @returns {undefined}
 * 
 */

export function delegate(selector, handler) {
  return function(e) {

    const closestEl = closest(e.target, selector)

    if(closestEl) {
      handler.call(closestEl, e)
    }

  }
}

/**
 * 
 * Map over an object
 * 
 */
export function mapObject(object, callback = (key, val) => val) {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  })
}

/**
 *   Returns a function, that, as long as it continues to be invoked, will not
 *   be triggered. The function will be called after it stops being called for
 *   N milliseconds. If `immediate` is passed, trigger the function on the
 *   leading edge, instead of the trailing.
 */

export function debounce(func, wait, immediate) {
  let timeout
  return function() {
    let context = this, args = arguments
    let later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}



/**
 *
 * Detect if browser supports transitionend event.
 * 
 * @returns {string|false} The prefixed (or unprefixed) supported event name 
 *                         or false if it doesn't support any.
 *
 */

let transitionEndEventName = false

export function whichTransitionEnd() {

  if(!transitionEndEventName) {
    let transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (let name in transEndEventNames) {
      if (document.body.style[name] !== undefined) {
        transitionEndEventName = transEndEventNames[name]
      }
    }
  }

  return transitionEndEventName
}

/**
 *
 * Covert Object into URL parameters
 *
 */

export function serializeObject(obj) {

  let str = ''

  for (let k in obj) {
    if (str != '') {
      str += '&'
    }

    str += k + '=' + encodeURIComponent(obj[k]);
  }

  return str
}

/**
 *
 * Convert URL parameters to object
 *
 */

export function extractURLParameters(str) {

  let obj = {}

  if(document.location.search) {
    document.location.search
      .replace(/(^\?)/,'')
      .split('&')
      .map(n => {
        const par = n.split('=')
        obj[par[0]] = decodeURIComponent(par[1])
      })
  }

  return obj
}

/**
 *
 * User agent matching for IOS or Android devices
 *
 * @returns {boolean} If the UA matches for IOS or Android
 * 
 */

export function isIOSorAndroid() {
  return navigator.userAgent.match(/iPad|iPhone|iPod|Android/i)
}

/**
 *
 * User agent matching for mobile devices
 *
 * @returns {boolean} If the UA matches for a mobile device
 * 
 */

export function isMobile() {
  return navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)
}


/**
 *
 * Get the value for the scrollY window position. 
 *
 * Note: Getting window.pageYOffset or window.scrollY causes layout reflow.
 * By caching the value we minimize this.
 * 
 * @returns {int} Current Y scroll distance
 * 
 */

let attachedScrollY = false
let scrollPos = window.pageYOffset

export function scrollY() {

  if(!attachedScrollY) {
    EventBus.subscribe(windowScrolled, e => {
      scrollPos = window.pageYOffset
    })

    attachedScrollY = true
  }

  return scrollPos
}


/**
 * Track mouse/touchmove x,y position
 * @return {Object} x, y position object
 */

export function mouseTracker() {

  const position = { x: 0, y: 0 }

  const updatePosition = e => {
    position.x = e.pageX
    position.y = e.pageY
  }

  window.addEventListener('mousemove', updatePosition)
  window.addEventListener('touchmove' , updatePosition)
  
  return position

}


/**
 *
 * Collection
 *
 * Interface for querySelectorAll, returning an array of elements, instead of a nodeList 
 *
 * @param {string|NodeList} selectorOrNodeList - Either a selector string or a nodeList
 * @return {array} Array of DOM elements
 * 
 */

export function collection(selectorOrNodeList) {

  const arr = []

  let nodeList

  if (selectorOrNodeList instanceof NodeList || selectorOrNodeList instanceof HTMLCollection) {
    nodeList = selectorOrNodeList
  } else if(typeof selectorOrNodeList == 'string') {
    nodeList = document.querySelectorAll(selectorOrNodeList)
  } else {
    return arr
  }

  for(let i = 0; i < nodeList.length; i++) {
    arr[i] = nodeList[i]
  }

  return arr

}


/**
*
* Get Breakpoints Object
*
* This is a custom technique to gain access to our SCSS defined media query breakpoints 
* in JS.
*
* To get the technique working you need the following:
*
* 1. Define a `$bp-array` variable in your SCSS, with the following format:
*    
*   $bp-array  : '{"xs": "#{$bp-xs}" }';
*
* 2. To make it the value accessible from JS, we attach that property as
*    the font size of the document head.
*
*  head {
*   font-family: $bp-array;
*  }
* 
* 
* This function will take care of querying and parsing that value, returning an object
* with the media query values that you define on your SCSS
*
*
*/

export function getBpObj() {
  const style = window.getComputedStyle(document.head)['font-family']

  let bpObj = {}
  // Remove all unwanted character to make it possible to parse this as JSON
  const bpJSON = style.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g,"")
 
  try {
    bpObj = JSON.parse(bpJSON)
    
    for(let k in bpObj) {
      if(bpObj.hasOwnProperty(k)) {
        bpObj[k] = parseInt(bpObj[k])
      }
    }
  } catch(e) {}

  return bpObj
}

/**
 * 
 * Recursive curry function
 *
 * Usage:
 * 
 * function add(a, b) {
 *   return a + b;
 * }
 * 
 * curry(add, 1, 2); // 3
 * curry(add)(1)(2); // 3
 * curry(add)(1, 2); // 3
 * curry(add, 1)(2);
 * 
 * @param  {Function}  fn   Function to be curried
 * @param  {...[Any]} args X number of arguments the function can receive
 * @return {Function}  The function will keep returning a function until all parameters have been passed
 * 
 */
export function curry(fn, ...args) {

  if (args.length === fn.length) {
    return fn(...args);
  }

  return curry.bind(this, fn, ...args);

}

/**
 * 
 * Curried function to toggle an element's class name.
 *
 * Usage:
 *
 * const toggle = toggleClass(el, 'is-active', someBooleanCondition) // Applies the class immediately
 * 
 * const toggle  = toggleClass(el) // Just set the element to operate on
 * toggle('is-active')(true)  // Runs once the third argument has been passed
 * toggle('is-hidden')(false) // Runs once the third argument has been passed
 *
 * const toggle2 = toggleClass(el, 'is-active') // Curry element & class
 * const toggle3 = toggle2(someBooleanCondition) // The third argument has been pass, class gets applied & returns
 * toggle function that can receive new conditions for toggling
 *
 * setTimeout(function() {
 *   toggle3(newBooleanCondition) // Toggle the class again, based on a different boolean
 * }, 500)
 * 
 * @param  {HTMLElement/DOMTokenList}   source    Either an element or an element.classList. Both cases end up operating on the classList.
 * @param  {String}   className Classname srting to toggle
 * @param  {Boolean} condition Condition to evaluate the toggling of the class (if true class is added, if false removed). Defaults to adding
 * 
 * @return {Function} Will return a function expecting the next parameter until all paramters have been added. The 
 * class will only be toggled when the last paramter is provided.
 *
 * @return {Function} Toggle function that will keep toggling the class on/off based on the condition passed to it
 * 
 */

export const toggleClass = curry(function toggleClass(source, className, condition) {

  const classList = source instanceof HTMLElement ? 
    source.classList : 
    source instanceof DOMTokenList ?
      source : false

  if(!classList) {
    console.warn('The first paramter passed to `toggleClass` must be either an HTMLElement or a DOMDOMTokenList instance')
    return () => {} // Noop function
  }

  if(typeof className !== 'string') {
    console.warn('The first paramter passed to `toggleClass` must be a className string')
  }

  const toggle = bool => {
    classList[!!bool ? 'add' : 'remove'](className)
  }

  // Apply the className once when all parameters have been set 
  toggle(condition)

  // Return toggle fuction to keep toggling the className afterwards based on new conditions passed
  return conditionAfter => toggle(conditionAfter)

})


/**
 * 
 * Add event listener, run only once, then detach the listener
 * 
 * @param {HTMLElement} el  Element to attach the event
 * @param {String}   event Name of the event ('scroll', 'click', etc)
 * @param {Function} cb    Callback to run
 *
 * @return {null}
 */

export function addEventOnce(el, event = '', cb = () => {}) {

  if(!el) {
    return
  }

  const handler = e => {
    el.removeEventListener(event, handler)
    cb(e)
  }

  el.addEventListener(event, handler)

}

/**
 * Vanilla JS element offset function (ala jQuery flavor)
 * 
 * @param  {HTMLElement} el Element to get offset from
 * @return {Object}   Object containing the top & left offset values
 */
export function offset(el) {

  const rect = el.getBoundingClientRect()
  const { body } = document

  return {
    top: rect.top + body.scrollTop,
    left: rect.left + body.scrollLeft
  }

}

/**
 * 
 * Remove HTML markup from string
 * 
 * @param  {String} str String to format
 * @return {String} Formatted string
 * 
 */
export function stripTags(str = '') {
  return str.replace(/<(?:.|\n)*?>/gm, '');
}

/**
 * 
 * Truncate a string by X characters. If the truncation happens in the middle of a word, the whole word is ommitted.
 * 
 * @param  {String}  str   String to truncate
 * @param  {Number}  count    Number of characters to accept
 * @param  {Boolean} ellipsis Whether or not to add ellipsis at the end of the string
 * 
 * @return {String} Truncated/Formatted string. If the string is shorter than the count, return the original string.
 * 
 */
export function truncateWords(str = '', characters = 10, ellipsis = true) {

  const strippedStr = stripTags(str)
  const words = strippedStr.split(' ')

  if(strippedStr.length <= characters) {
    return strippedStr
  }

  let count = 0

  return words
    .filter(word => {
      count += word.length

      return count <= characters
    })
    .join(' ') + (ellipsis ? '...' : '')
}


/** 
*
* Convert array to object
*
* @param {array} array - Array to be converted
* @param {function} fn - Function to apply to each item in array, whatever is 
*  returned will become the key for object item 
*
* @returns {object} The converted object
*
*/

export function arrayToObj(array, fn) {

  const obj = {}
  const len = array.length

  for (let i = 0; i < len; i++) {
    const curVal = array[i]
    const key = fn(curVal, i, array)
    obj[key] = curVal
  }

  return obj
}


/**
 * Get a WP Rest meta_query formatted object
 * 
 * @param  {String} key Key for the query
 * @param  {String} value Value for the query
 * @return {[type]} Formatted meta_query object
 */
export function getMetaQuery(key = '', value = '') {
  const query = {}
  query[`meta_query[0][key]`] = key
  query[`meta_query[0][value]`] = value
  return query
}