/** 
*
* Toggle
* 
* Toggles target element active class
*
* Usage:
*
* <button class="{selector}" data-target="#toggle-target" data-toggle>Toggle</button>
* <div id="toggle-target">Toggle Target</div>
* 
*/

import EventBus from './EventBus'
import { collection, delegate } from './utils'

const ACTIVE_CLASS = 'is-active'

/**
 *
 * Get all elements related to particular toggle element
 *
 * @return {Object} elements - Elements object
 * @return {HTMLElement} elements.clickedToggle - Current toggle element
 * @return {HTMLElement} elements.target - The target of the current toggle element
 * @return {Array} elements.targetAndToggles - An array of all toggle elements for a particular target,
 * concatenated with said target
 * @return {HTMLElement} elements.group - The group element that contains this and possibly other toggle targets with different 
 * toggle elements, for collapsing any related siblings within the same group
 * 
 */

function getElements(el) {

  const dataTarget = el.dataset.target
  const target = document.querySelector(dataTarget)
  const targetToggles = collection('[data-target="' + dataTarget + '"]')
  
  return {
    clickedToggle: el,
    target: target,
    targetAndToggles: targetToggles.concat(target),
    group: document.querySelector(el.dataset.group)
  }
}

/**
 * Remove the active class from any other target & toggles within the same group, excluding a current target
 * 
 * @param  {HTMLElement} group - The group element
 * @param  {String} selector - The toggle selector for the current toggleTarget instance
 * @param  {HTMLElement} currentElement - Currently active toggle, any elements that contain the same [data-target]
 * attribute value as this element, will be filtered out from this function
 * 
 * @return {null} 
 */
function hideOthers(group, selector, currentElement) {

  collection(group.querySelectorAll(selector))
    .filter(el => el.dataset.target !== currentElement.dataset.target)
    .map(el => {

      getElements(el)
        .targetAndToggles
        .map(el => el.classList.remove(ACTIVE_CLASS))

    })

}


/**
 *
 * Initialize the toggle Target for a given selector
 *
 * - The selector represents the toggle element, used to hide or show a certain target
 * - The toggle element must have a `data-target` attribute, referencing a unique element on the page to be toggled
 * Make sure to use an ID for the target
 * - The toggle element can have an optional `data-toggle` attribute, which will make the button toggle the target ON/OFF
 * If the attribute is not defined, the button will only toggle it's target ON.
 * - The toggle element can have an options `data-group` attribute, which would contain the selector of the parent group element.
 * eg: data-group="#parent-element". The group allows for siblings to be toggled off, when toggling any item in the group on.
 * 
 * @param  {String} selector - selector for the toggle element
 * @param  {Object} config - Configuration Object
 * @param  {Function} config.onToggleClose - Fires when the toggle gets closed, gets passed an object
 *                                         containing the current toggle elements
 * @param  {Function} config.onToggleOpen - Fires when the toggle gets opened, gets passed an object
 *                                         containing the current toggle elements 
 * @return {Object} Toggle Controller object
 * 
 */

export default function toggleTarget(selector, config = {}) {

  const options = Object.assign({}, {
    onToggleOpen() {},
    onToggleClose() {},
  }, config)

  document.addEventListener('click', delegate(selector, e => {

    e.preventDefault();

    const els = getElements(e.target)
    const { target, targetAndToggles, group } = els
    const shouldToggle = e.target.dataset.toggle == 'true'

    if(target) {

      const isActive = target.classList.contains(ACTIVE_CLASS)

      if(shouldToggle && isActive) {

        targetAndToggles.map(el => el.classList.remove(ACTIVE_CLASS))
        options.onToggleClose(els)
        EventBus.publish('toggle-target:close', els)

      } 

      if(!isActive) {

        targetAndToggles.map(el => el.classList.add(ACTIVE_CLASS))
        options.onToggleOpen(els)
        EventBus.publish('toggle-target:open', els)

      }

      if(group) {
        hideOthers(group, selector, e.target)
      }

    }

  }))

  const allTargetAndToggles = collection(selector)
    .map(el => getElements(el).targetAndToggles)


  // Controller Object
  return {

    activeClass: ACTIVE_CLASS,

    /**
     * Get all elements for this tabs intance
     *
     * @return {array} Array of objects, containing all the elements related to this tab instance
     */
    getElements() {
      return collection(selector)
        .map(el => getElements(el))
    },

    /**
     * Reset the tabs, setting the first target in each group as active
     * 
     * @return {null}
     */
    reset() {

      const groups = []

      collection(selector)
        .map(el => getElements(el))
        .filter(els => els.group)
        .map(els => els.group)
        .map(group => {
          if(groups.indexOf(group) == -1) {
            groups.push(group)
          }
        })

      groups.map(group => {
        const firstToggle = group.querySelector(selector)

        if(firstToggle) {
          firstToggle.click()
        }
      })
    },

    /**
     *
     * Remove all active classes from all toggles in the instance
     * 
     * @return {null}
     */
    closeAll() {
      allTargetAndToggles.map(els => {
        els.map(el => el.classList.remove(ACTIVE_CLASS))
      })
    }
  }

}