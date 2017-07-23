/**
 *
 * Modal
 *
 * Toggleable modal panels
 *
 */

import EventBus, { eventBusFactory } from './EventBus';
import createVideoIframe from './video';
import { whichTransitionEnd, selectorMatches, collection } from './utils';

const rootEl = document.querySelector('html');
const ACTIVE_CLASS = 'is-active';
const TRANS_CLASS  = 'is-transiting';

// Add a global class to the root element, for styling
rootEl.className += ' modal-root';

const modalProto = {

  isOpen: false,

  /**
   *
   * Open the modal
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  open() {

    const { els } = this;

    els.map(el => el.classList.add(ACTIVE_CLASS, TRANS_CLASS))

    this.isOpen = true;
    this.publish('open', this)
  },

  /**
   *
   * Close the modal
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  close() {
    
    const { els } = this;

    els.map(el => el.classList.add(TRANS_CLASS))
    els.map(el => el.classList.remove(ACTIVE_CLASS))

    if(!whichTransitionEnd()) {
      els.map(el => el.classList.remove(TRANS_CLASS))
    }

    this.isOpen = false;
    this.publish('close', this)
  },

  /**
   *
   * Toggle the modal open/close
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  toggle() {

    if(this.isOpen) {
      this.close();
    } else {
      this.open();
    }

  }
}

/**
 *
 * Instantiate the modal, adding click listeners to it's triggers,
 * as well as controls for closing it.
 *
 * @param {HTMLElement} modalEl - Modal DOM element
 * @param {object} config - Configuration object, with callbacks for the modals open/close events
 * @returns {object} instance - Modal instance
 */

export function initModal(modalEl, config = {}) {

  if(!modalEl || !modalEl.nodeType) {
    console.log('You must provide a DOM element to `initModal`');
    return false;
  }

  // Find the elements that toggles this modal
  const toggleEls = collection('[data-toggle-modal="#' + modalEl.id + '"]');
  const allEls = toggleEls.concat(modalEl, rootEl)
  const closeEls = collection(modalEl.querySelectorAll('[data-close-modal]'))

  // Create the modal instance object
  const instance = Object.create(Object.assign({}, modalProto, eventBusFactory()))

  Object.assign(instance, {
    modalEl: modalEl,
    els: allEls
  })

  const options = Object.assign({}, {
    onOpen() {},
    onClose(){}
  }, config)

  // Listen for toggle button clicks
  toggleEls.map(el => {
    console.log(el)
    el.addEventListener('click', e => {

      console.log('click')
      e.preventDefault();
      instance.toggle()
    })
  })

  // Esc Keydown
  document.addEventListener('keydown', (e) => {
    if(e.keyCode == 27 && instance.isOpen) {
      instance.close()
    } 
  });

  // Listen for click to any elements that close the modal
  if (closeEls.length) {

    closeEls.map(el => {
      el.addEventListener('click', e => {
        if(selectorMatches(e.target, '[data-close-modal]') && instance.isOpen) {
          e.preventDefault();
          instance.close()          
        }
      })
    })

  }

  // Listen for transition end to remove transition class
  modalEl.addEventListener(whichTransitionEnd(), e => {
    if(e.target == modalEl) {
      instance.els.map(el => el.classList.remove(TRANS_CLASS))
    }
  });

  // Subscribe this modal to it's open/close events
  instance.subscribe('open', openedInstance => {
    options.onOpen(instance)
  })

  instance.subscribe('close', openedInstance => {
    options.onClose(instance)
  })

  // Move the element to the end of the document (prevent any z-index issues)
  document.body.appendChild(modalEl)

  // Expose the modal instance controller
  return instance;

}


/**
 *
 * Create a modal with a video player inside
 *
 * @param {HTMLElement} modalEl - Modal DOM element
 * @param {string} playerSelector - Query selector for the player inside the modal
 * @param {object} config - Configuration object, used to override the default video modal behaviour
 * 
 * @returns {object} instance - Modal instance with an attached video service controller
 * 
 */

export function initVideoModal(modalEl, playerSelector, config = {}) {

  if(!modalEl || !modalEl.nodeType) {
    console.log('You must provide a DOM element to `initVideoModal`');
    return false;
  }

  const playerEl = modalEl.querySelector(playerSelector);
  const service = createVideoIframe(playerEl);

  // By default, make the player play when the modal opens
  // And stop when it closes
  const options = Object.assign({}, {
    onOpen() {
      service.play();
    },
    onClose(){
      service.stop();
    }
  }, config)
  
  const instance = initModal(modalEl, options)
  instance.service = service // Assign the video service to the modal instance

  // Expose the modal instance controller
  return instance;
}