/**
 *
 * DOM based router
 *
 * Fires when class on element, matches the name of any method.
 * Router also adds a 'common' call for JS that fires on any page.
 * 
 */

'use strict';

let namespace;  
let fire = (func) => {
  if (func !== '' && namespace[func] && typeof namespace[func] == 'function'){
    namespace[func]();
  }
}

let loadEvents = () => {

  // hit up common first.
  fire('common');

  // do all the classes too.
  document.body.className
    .replace(/-/g, '_')
    .split(/\s+/)
    .forEach((classnm) => {
      fire(classnm);
    });

}

const router = function(routes){
  namespace = routes;
  loadEvents();
};

export default router;

