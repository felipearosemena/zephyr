/**
 *
 * Utility functions
 *
 * Keep these functions as pure as possible (ie: input -> output ).
 * You can use globally available variables such as window and document.
 *
 */

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
 * @returns {HTMLElement} The DOM element
 *
 */


export function createElement(tagname, attributes = {}) {
  let el = document.createElement(tagname)

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

function closest(el, selector) {

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

export function whichTransitionEnd() {

  let transEndEventNames = {
    WebkitTransition : 'webkitTransitionEnd',
    MozTransition    : 'transitionend',
    OTransition      : 'oTransitionEnd otransitionend',
    transition       : 'transitionend'
  }

  for (let name in transEndEventNames) {
    if (document.body.style[name] !== undefined) {
      return transEndEventNames[name]
    }
  }

  return false
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
        obj[par[0]] = par[1]
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
    window.addEventListener('scroll', e => {
      scrollPos = window.pageYOffset
    })

    attachedScrollY = true
  }

  return scrollPos
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

  if (selectorOrNodeList instanceof NodeList) {
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