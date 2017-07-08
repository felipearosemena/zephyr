/**
 *
 * Polyfills
 *
 * Including this module will automatically call all specified polyfills
 * 
 */


import 'input-placeholder-polyfill'; // Required for older IE
import vuBuggyfill from 'viewport-units-buggyfill' // Required for IOS devices
import Promise from 'promise-polyfill'; // Required for IE
import 'whatwg-fetch' // Required for IE & Safari
import objectAssign from 'object-assign' // Required for IE

// Assign to the Object constructor
if(!Object.assign) {
  Object.assign = objectAssign
}

// Assign Promise to window, if not defined
if (!window.Promise) {
  window.Promise = Promise;
}

// Patch Buggy Viewport units on IOS devices
vuBuggyfill.init()

/**
 *
 * Dataset Polyfill
 *
 * Element.dataset polyfill for IE10-
 *
 */

function dataset() {

  if (!('dataset' in document.createElement('span')) &&
      'Element' in global && Element.prototype && Object.defineProperty) {
    Object.defineProperty(Element.prototype, 'dataset', { get: function() {
      let result = Object.create(null);

      for (let i = 0; i < this.attributes.length; ++i) {
        let attr = this.attributes[i];
        if (attr.specified && attr.name.substring(0, 5) === 'data-') {
          (function(element, name) {
            let prop = name.replace(/-([a-z])/g, function(m, p) {
              return p.toUpperCase();
            });
            result[prop] = element.getAttribute('data-' + name); // Read-only, for IE8-
            Object.defineProperty(result, prop, {
              get: function() {
                return element.getAttribute('data-' + name);
              },
              set: function(value) {
                element.setAttribute('data-' + name, value);
              }});
          }(this, attr.name.substring(5)));
        }
      }
      return result;
    }});
  }

}

// Add cross browser support for dataset
dataset()

