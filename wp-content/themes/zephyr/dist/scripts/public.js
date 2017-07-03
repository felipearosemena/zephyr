(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Felipe/Sites/base/node_modules/desandro-matches-selector/matches-selector.js":[function(require,module,exports){
/**
 * matchesSelector v2.0.1
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  /*global define: false, module: false */
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.matchesSelector = factory();
  }

}( window, function factory() {
  'use strict';

  var matchesMethod = ( function() {
    var ElemProto = Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  return function matchesSelector( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  };

}));

},{}],"/Users/Felipe/Sites/base/node_modules/ev-emitter/ev-emitter.js":[function(require,module,exports){
/**
 * EvEmitter v1.0.3
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var i = 0;
  var listener = listeners[i];
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  while ( listener ) {
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
    // get next listener
    i += isOnce ? 0 : 1;
    listener = listeners[i];
  }

  return this;
};

return EvEmitter;

}));

},{}],"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js":[function(require,module,exports){
/**
 * Fizzy UI utils v2.0.3
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'desandro-matches-selector/matches-selector'
    ], function( matchesSelector ) {
      return factory( window, matchesSelector );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('desandro-matches-selector')
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.matchesSelector
    );
  }

}( window, function factory( window, matchesSelector ) {

'use strict';

var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  var ary = [];
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0; i < obj.length; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = ary.indexOf( obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  elems.forEach( function( elem ) {
    // check that elem is an actual element
    if ( !( elem instanceof HTMLElement ) ) {
      return;
    }
    // add elem if no selector
    if ( !selector ) {
      ffElems.push( elem );
      return;
    }
    // filter & find items if we have a selector
    // filter
    if ( matchesSelector( elem, selector ) ) {
      ffElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( selector );
    // concat childElems to filterFound array
    for ( var i=0; i < childElems.length; i++ ) {
      ffElems.push( childElems[i] );
    }
  });

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    if ( timeout ) {
      clearTimeout( timeout );
    }
    var args = arguments;

    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold || 100 );
  };
};

// ----- docReady ----- //

utils.docReady = function( callback ) {
  var readyState = document.readyState;
  if ( readyState == 'complete' || readyState == 'interactive' ) {
    // do async to allow for other scripts to run. metafizzy/flickity#441
    setTimeout( callback );
  } else {
    document.addEventListener( 'DOMContentLoaded', callback );
  }
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via [data-namespace] or .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-options
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  utils.docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var dataAttr = 'data-' + dashedNamespace;
    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
    var elems = utils.makeArray( dataAttrElems )
      .concat( utils.makeArray( jsDashElems ) );
    var dataOptionsAttr = dataAttr + '-options';
    var jQuery = window.jQuery;

    elems.forEach( function( elem ) {
      var attr = elem.getAttribute( dataAttr ) ||
        elem.getAttribute( dataOptionsAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
          ': ' + error );
        }
        return;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('namespace')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    });

  });
};

// -----  ----- //

return utils;

}));

},{"desandro-matches-selector":"/Users/Felipe/Sites/base/node_modules/desandro-matches-selector/matches-selector.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/add-remove-cell.js":[function(require,module,exports){
// add, remove cell
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'fizzy-ui-utils/utils'
    ], function( Flickity, utils ) {
      return factory( window, Flickity, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, utils ) {

'use strict';

// append cells to a document fragment
function getCellsFragment( cells ) {
  var fragment = document.createDocumentFragment();
  cells.forEach( function( cell ) {
    fragment.appendChild( cell.element );
  });
  return fragment;
}

// -------------------------- add/remove cell prototype -------------------------- //

var proto = Flickity.prototype;

/**
 * Insert, prepend, or append cells
 * @param {Element, Array, NodeList} elems
 * @param {Integer} index
 */
proto.insert = function( elems, index ) {
  var cells = this._makeCells( elems );
  if ( !cells || !cells.length ) {
    return;
  }
  var len = this.cells.length;
  // default to append
  index = index === undefined ? len : index;
  // add cells with document fragment
  var fragment = getCellsFragment( cells );
  // append to slider
  var isAppend = index == len;
  if ( isAppend ) {
    this.slider.appendChild( fragment );
  } else {
    var insertCellElement = this.cells[ index ].element;
    this.slider.insertBefore( fragment, insertCellElement );
  }
  // add to this.cells
  if ( index === 0 ) {
    // prepend, add to start
    this.cells = cells.concat( this.cells );
  } else if ( isAppend ) {
    // append, add to end
    this.cells = this.cells.concat( cells );
  } else {
    // insert in this.cells
    var endCells = this.cells.splice( index, len - index );
    this.cells = this.cells.concat( cells ).concat( endCells );
  }

  this._sizeCells( cells );

  var selectedIndexDelta = index > this.selectedIndex ? 0 : cells.length;
  this._cellAddedRemoved( index, selectedIndexDelta );
};

proto.append = function( elems ) {
  this.insert( elems, this.cells.length );
};

proto.prepend = function( elems ) {
  this.insert( elems, 0 );
};

/**
 * Remove cells
 * @param {Element, Array, NodeList} elems
 */
proto.remove = function( elems ) {
  var cells = this.getCells( elems );
  var selectedIndexDelta = 0;
  var len = cells.length;
  var i, cell;
  // calculate selectedIndexDelta, easier if done in seperate loop
  for ( i=0; i < len; i++ ) {
    cell = cells[i];
    var wasBefore = this.cells.indexOf( cell ) < this.selectedIndex;
    selectedIndexDelta -= wasBefore ? 1 : 0;
  }

  for ( i=0; i < len; i++ ) {
    cell = cells[i];
    cell.remove();
    // remove item from collection
    utils.removeFrom( this.cells, cell );
  }

  if ( cells.length ) {
    // update stuff
    this._cellAddedRemoved( 0, selectedIndexDelta );
  }
};

// updates when cells are added or removed
proto._cellAddedRemoved = function( changedCellIndex, selectedIndexDelta ) {
  // TODO this math isn't perfect with grouped slides
  selectedIndexDelta = selectedIndexDelta || 0;
  this.selectedIndex += selectedIndexDelta;
  this.selectedIndex = Math.max( 0, Math.min( this.slides.length - 1, this.selectedIndex ) );

  this.cellChange( changedCellIndex, true );
  // backwards compatibility
  this.emitEvent( 'cellAddedRemoved', [ changedCellIndex, selectedIndexDelta ] );
};

/**
 * logic to be run after a cell's size changes
 * @param {Element} elem - cell's element
 */
proto.cellSizeChange = function( elem ) {
  var cell = this.getCell( elem );
  if ( !cell ) {
    return;
  }
  cell.getSize();

  var index = this.cells.indexOf( cell );
  this.cellChange( index );
};

/**
 * logic any time a cell is changed: added, removed, or size changed
 * @param {Integer} changedCellIndex - index of the changed cell, optional
 */
proto.cellChange = function( changedCellIndex, isPositioningSlider ) {
  var prevSlideableWidth = this.slideableWidth;
  this._positionCells( changedCellIndex );
  this._getWrapShiftCells();
  this.setGallerySize();
  this.emitEvent( 'cellChange', [ changedCellIndex ] );
  // position slider
  if ( this.options.freeScroll ) {
    // shift x by change in slideableWidth
    // TODO fix position shifts when prepending w/ freeScroll
    var deltaX = prevSlideableWidth - this.slideableWidth;
    this.x += deltaX * this.cellAlign;
    this.positionSlider();
  } else {
    // do not position slider after lazy load
    if ( isPositioningSlider ) {
      this.positionSliderAtSelected();
    }
    this.select( this.selectedIndex );
  }
};

// -----  ----- //

return Flickity;

}));

},{"./flickity":"/Users/Felipe/Sites/base/node_modules/flickity/js/flickity.js","fizzy-ui-utils":"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/animate.js":[function(require,module,exports){
// animate
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'fizzy-ui-utils/utils'
    ], function( utils ) {
      return factory( window, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.animatePrototype = factory(
      window,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, utils ) {

'use strict';

// -------------------------- requestAnimationFrame -------------------------- //

// get rAF, prefixed, if present
var requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame;

// fallback to setTimeout
var lastTime = 0;
if ( !requestAnimationFrame )  {
  requestAnimationFrame = function( callback ) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
    var id = setTimeout( callback, timeToCall );
    lastTime = currTime + timeToCall;
    return id;
  };
}

// -------------------------- animate -------------------------- //

var proto = {};

proto.startAnimation = function() {
  if ( this.isAnimating ) {
    return;
  }

  this.isAnimating = true;
  this.restingFrames = 0;
  this.animate();
};

proto.animate = function() {
  this.applyDragForce();
  this.applySelectedAttraction();

  var previousX = this.x;

  this.integratePhysics();
  this.positionSlider();
  this.settle( previousX );
  // animate next frame
  if ( this.isAnimating ) {
    var _this = this;
    requestAnimationFrame( function animateFrame() {
      _this.animate();
    });
  }
};


var transformProperty = ( function () {
  var style = document.documentElement.style;
  if ( typeof style.transform == 'string' ) {
    return 'transform';
  }
  return 'WebkitTransform';
})();

proto.positionSlider = function() {
  var x = this.x;
  // wrap position around
  if ( this.options.wrapAround && this.cells.length > 1 ) {
    x = utils.modulo( x, this.slideableWidth );
    x = x - this.slideableWidth;
    this.shiftWrapCells( x );
  }

  x = x + this.cursorPosition;
  // reverse if right-to-left and using transform
  x = this.options.rightToLeft && transformProperty ? -x : x;
  var value = this.getPositionValue( x );
  // use 3D tranforms for hardware acceleration on iOS
  // but use 2D when settled, for better font-rendering
  this.slider.style[ transformProperty ] = this.isAnimating ?
    'translate3d(' + value + ',0,0)' : 'translateX(' + value + ')';

  // scroll event
  var firstSlide = this.slides[0];
  if ( firstSlide ) {
    var positionX = -this.x - firstSlide.target;
    var progress = positionX / this.slidesWidth;
    this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
  }
};

proto.positionSliderAtSelected = function() {
  if ( !this.cells.length ) {
    return;
  }
  this.x = -this.selectedSlide.target;
  this.positionSlider();
};

proto.getPositionValue = function( position ) {
  if ( this.options.percentPosition ) {
    // percent position, round to 2 digits, like 12.34%
    return ( Math.round( ( position / this.size.innerWidth ) * 10000 ) * 0.01 )+ '%';
  } else {
    // pixel positioning
    return Math.round( position ) + 'px';
  }
};

proto.settle = function( previousX ) {
  // keep track of frames where x hasn't moved
  if ( !this.isPointerDown && Math.round( this.x * 100 ) == Math.round( previousX * 100 ) ) {
    this.restingFrames++;
  }
  // stop animating if resting for 3 or more frames
  if ( this.restingFrames > 2 ) {
    this.isAnimating = false;
    delete this.isFreeScrolling;
    // render position with translateX when settled
    this.positionSlider();
    this.dispatchEvent('settle');
  }
};

proto.shiftWrapCells = function( x ) {
  // shift before cells
  var beforeGap = this.cursorPosition + x;
  this._shiftCells( this.beforeShiftCells, beforeGap, -1 );
  // shift after cells
  var afterGap = this.size.innerWidth - ( x + this.slideableWidth + this.cursorPosition );
  this._shiftCells( this.afterShiftCells, afterGap, 1 );
};

proto._shiftCells = function( cells, gap, shift ) {
  for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    var cellShift = gap > 0 ? shift : 0;
    cell.wrapShift( cellShift );
    gap -= cell.size.outerWidth;
  }
};

proto._unshiftCells = function( cells ) {
  if ( !cells || !cells.length ) {
    return;
  }
  for ( var i=0; i < cells.length; i++ ) {
    cells[i].wrapShift( 0 );
  }
};

// -------------------------- physics -------------------------- //

proto.integratePhysics = function() {
  this.x += this.velocity;
  this.velocity *= this.getFrictionFactor();
};

proto.applyForce = function( force ) {
  this.velocity += force;
};

proto.getFrictionFactor = function() {
  return 1 - this.options[ this.isFreeScrolling ? 'freeScrollFriction' : 'friction' ];
};

proto.getRestingPosition = function() {
  // my thanks to Steven Wittens, who simplified this math greatly
  return this.x + this.velocity / ( 1 - this.getFrictionFactor() );
};

proto.applyDragForce = function() {
  if ( !this.isPointerDown ) {
    return;
  }
  // change the position to drag position by applying force
  var dragVelocity = this.dragX - this.x;
  var dragForce = dragVelocity - this.velocity;
  this.applyForce( dragForce );
};

proto.applySelectedAttraction = function() {
  // do not attract if pointer down or no cells
  if ( this.isPointerDown || this.isFreeScrolling || !this.cells.length ) {
    return;
  }
  var distance = this.selectedSlide.target * -1 - this.x;
  var force = distance * this.options.selectedAttraction;
  this.applyForce( force );
};

return proto;

}));

},{"fizzy-ui-utils":"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/cell.js":[function(require,module,exports){
// Flickity.Cell
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'get-size/get-size'
    ], function( getSize ) {
      return factory( window, getSize );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('get-size')
    );
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.Cell = factory(
      window,
      window.getSize
    );
  }

}( window, function factory( window, getSize ) {

'use strict';

function Cell( elem, parent ) {
  this.element = elem;
  this.parent = parent;

  this.create();
}

var proto = Cell.prototype;

proto.create = function() {
  this.element.style.position = 'absolute';
  this.x = 0;
  this.shift = 0;
};

proto.destroy = function() {
  // reset style
  this.element.style.position = '';
  var side = this.parent.originSide;
  this.element.style[ side ] = '';
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

proto.setPosition = function( x ) {
  this.x = x;
  this.updateTarget();
  this.renderPosition( x );
};

// setDefaultTarget v1 method, backwards compatibility, remove in v3
proto.updateTarget = proto.setDefaultTarget = function() {
  var marginProperty = this.parent.originSide == 'left' ? 'marginLeft' : 'marginRight';
  this.target = this.x + this.size[ marginProperty ] +
    this.size.width * this.parent.cellAlign;
};

proto.renderPosition = function( x ) {
  // render position of cell with in slider
  var side = this.parent.originSide;
  this.element.style[ side ] = this.parent.getPositionValue( x );
};

/**
 * @param {Integer} factor - 0, 1, or -1
**/
proto.wrapShift = function( shift ) {
  this.shift = shift;
  this.renderPosition( this.x + this.parent.slideableWidth * shift );
};

proto.remove = function() {
  this.element.parentNode.removeChild( this.element );
};

return Cell;

}));

},{"get-size":"/Users/Felipe/Sites/base/node_modules/get-size/get-size.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/drag.js":[function(require,module,exports){
// drag
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'unidragger/unidragger',
      'fizzy-ui-utils/utils'
    ], function( Flickity, Unidragger, utils ) {
      return factory( window, Flickity, Unidragger, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('unidragger'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    window.Flickity = factory(
      window,
      window.Flickity,
      window.Unidragger,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, Unidragger, utils ) {

'use strict';

// ----- defaults ----- //

utils.extend( Flickity.defaults, {
  draggable: true,
  dragThreshold: 3,
});

// ----- create ----- //

Flickity.createMethods.push('_createDrag');

// -------------------------- drag prototype -------------------------- //

var proto = Flickity.prototype;
utils.extend( proto, Unidragger.prototype );

// --------------------------  -------------------------- //

var isTouch = 'createTouch' in document;
var isTouchmoveScrollCanceled = false;

proto._createDrag = function() {
  this.on( 'activate', this.bindDrag );
  this.on( 'uiChange', this._uiChangeDrag );
  this.on( 'childUIPointerDown', this._childUIPointerDownDrag );
  this.on( 'deactivate', this.unbindDrag );
  // HACK - add seemingly innocuous handler to fix iOS 10 scroll behavior
  // #457, RubaXa/Sortable#973
  if ( isTouch && !isTouchmoveScrollCanceled ) {
    window.addEventListener( 'touchmove', function() {});
    isTouchmoveScrollCanceled = true;
  }
};

proto.bindDrag = function() {
  if ( !this.options.draggable || this.isDragBound ) {
    return;
  }
  this.element.classList.add('is-draggable');
  this.handles = [ this.viewport ];
  this.bindHandles();
  this.isDragBound = true;
};

proto.unbindDrag = function() {
  if ( !this.isDragBound ) {
    return;
  }
  this.element.classList.remove('is-draggable');
  this.unbindHandles();
  delete this.isDragBound;
};

proto._uiChangeDrag = function() {
  delete this.isFreeScrolling;
};

proto._childUIPointerDownDrag = function( event ) {
  event.preventDefault();
  this.pointerDownFocus( event );
};

// -------------------------- pointer events -------------------------- //

// nodes that have text fields
var cursorNodes = {
  TEXTAREA: true,
  INPUT: true,
  OPTION: true,
};

// input types that do not have text fields
var clickTypes = {
  radio: true,
  checkbox: true,
  button: true,
  submit: true,
  image: true,
  file: true,
};

proto.pointerDown = function( event, pointer ) {
  // dismiss inputs with text fields. #403, #404
  var isCursorInput = cursorNodes[ event.target.nodeName ] &&
    !clickTypes[ event.target.type ];
  if ( isCursorInput ) {
    // reset pointerDown logic
    this.isPointerDown = false;
    delete this.pointerIdentifier;
    return;
  }

  this._dragPointerDown( event, pointer );

  // kludge to blur focused inputs in dragger
  var focused = document.activeElement;
  if ( focused && focused.blur && focused != this.element &&
    // do not blur body for IE9 & 10, #117
    focused != document.body ) {
    focused.blur();
  }
  this.pointerDownFocus( event );
  // stop if it was moving
  this.dragX = this.x;
  this.viewport.classList.add('is-pointer-down');
  // bind move and end events
  this._bindPostStartEvents( event );
  // track scrolling
  this.pointerDownScroll = getScrollPosition();
  window.addEventListener( 'scroll', this );

  this.dispatchEvent( 'pointerDown', event, [ pointer ] );
};

var touchStartEvents = {
  touchstart: true,
  MSPointerDown: true
};

var focusNodes = {
  INPUT: true,
  SELECT: true
};

proto.pointerDownFocus = function( event ) {
  // focus element, if not touch, and its not an input or select
  if ( !this.options.accessibility || touchStartEvents[ event.type ] ||
      focusNodes[ event.target.nodeName ] ) {
    return;
  }
  var prevScrollY = window.pageYOffset;
  this.element.focus();
  // hack to fix scroll jump after focus, #76
  if ( window.pageYOffset != prevScrollY ) {
    window.scrollTo( window.pageXOffset, prevScrollY );
  }
};

proto.canPreventDefaultOnPointerDown = function( event ) {
  // prevent default, unless touchstart or <select>
  var isTouchstart = event.type == 'touchstart';
  var targetNodeName = event.target.nodeName;
  return !isTouchstart && targetNodeName != 'SELECT';
};

// ----- move ----- //

proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > this.options.dragThreshold;
};

// ----- up ----- //

proto.pointerUp = function( event, pointer ) {
  delete this.isTouchScrolling;
  this.viewport.classList.remove('is-pointer-down');
  this.dispatchEvent( 'pointerUp', event, [ pointer ] );
  this._dragPointerUp( event, pointer );
};

proto.pointerDone = function() {
  window.removeEventListener( 'scroll', this );
  delete this.pointerDownScroll;
};

// -------------------------- dragging -------------------------- //

proto.dragStart = function( event, pointer ) {
  this.dragStartPosition = this.x;
  this.startAnimation();
  window.removeEventListener( 'scroll', this );
  this.dispatchEvent( 'dragStart', event, [ pointer ] );
};

proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.dispatchEvent( 'pointerMove', event, [ pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  event.preventDefault();

  this.previousDragX = this.dragX;
  // reverse if right-to-left
  var direction = this.options.rightToLeft ? -1 : 1;
  var dragX = this.dragStartPosition + moveVector.x * direction;

  if ( !this.options.wrapAround && this.slides.length ) {
    // slow drag
    var originBound = Math.max( -this.slides[0].target, this.dragStartPosition );
    dragX = dragX > originBound ? ( dragX + originBound ) * 0.5 : dragX;
    var endBound = Math.min( -this.getLastSlide().target, this.dragStartPosition );
    dragX = dragX < endBound ? ( dragX + endBound ) * 0.5 : dragX;
  }

  this.dragX = dragX;

  this.dragMoveTime = new Date();
  this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
};

proto.dragEnd = function( event, pointer ) {
  if ( this.options.freeScroll ) {
    this.isFreeScrolling = true;
  }
  // set selectedIndex based on where flick will end up
  var index = this.dragEndRestingSelect();

  if ( this.options.freeScroll && !this.options.wrapAround ) {
    // if free-scroll & not wrap around
    // do not free-scroll if going outside of bounding slides
    // so bounding slides can attract slider, and keep it in bounds
    var restingX = this.getRestingPosition();
    this.isFreeScrolling = -restingX > this.slides[0].target &&
      -restingX < this.getLastSlide().target;
  } else if ( !this.options.freeScroll && index == this.selectedIndex ) {
    // boost selection if selected index has not changed
    index += this.dragEndBoostSelect();
  }
  delete this.previousDragX;
  // apply selection
  // TODO refactor this, selecting here feels weird
  // HACK, set flag so dragging stays in correct direction
  this.isDragSelect = this.options.wrapAround;
  this.select( index );
  delete this.isDragSelect;
  this.dispatchEvent( 'dragEnd', event, [ pointer ] );
};

proto.dragEndRestingSelect = function() {
  var restingX = this.getRestingPosition();
  // how far away from selected slide
  var distance = Math.abs( this.getSlideDistance( -restingX, this.selectedIndex ) );
  // get closet resting going up and going down
  var positiveResting = this._getClosestResting( restingX, distance, 1 );
  var negativeResting = this._getClosestResting( restingX, distance, -1 );
  // use closer resting for wrap-around
  var index = positiveResting.distance < negativeResting.distance ?
    positiveResting.index : negativeResting.index;
  return index;
};

/**
 * given resting X and distance to selected cell
 * get the distance and index of the closest cell
 * @param {Number} restingX - estimated post-flick resting position
 * @param {Number} distance - distance to selected cell
 * @param {Integer} increment - +1 or -1, going up or down
 * @returns {Object} - { distance: {Number}, index: {Integer} }
 */
proto._getClosestResting = function( restingX, distance, increment ) {
  var index = this.selectedIndex;
  var minDistance = Infinity;
  var condition = this.options.contain && !this.options.wrapAround ?
    // if contain, keep going if distance is equal to minDistance
    function( d, md ) { return d <= md; } : function( d, md ) { return d < md; };
  while ( condition( distance, minDistance ) ) {
    // measure distance to next cell
    index += increment;
    minDistance = distance;
    distance = this.getSlideDistance( -restingX, index );
    if ( distance === null ) {
      break;
    }
    distance = Math.abs( distance );
  }
  return {
    distance: minDistance,
    // selected was previous index
    index: index - increment
  };
};

/**
 * measure distance between x and a slide target
 * @param {Number} x
 * @param {Integer} index - slide index
 */
proto.getSlideDistance = function( x, index ) {
  var len = this.slides.length;
  // wrap around if at least 2 slides
  var isWrapAround = this.options.wrapAround && len > 1;
  var slideIndex = isWrapAround ? utils.modulo( index, len ) : index;
  var slide = this.slides[ slideIndex ];
  if ( !slide ) {
    return null;
  }
  // add distance for wrap-around slides
  var wrap = isWrapAround ? this.slideableWidth * Math.floor( index / len ) : 0;
  return x - ( slide.target + wrap );
};

proto.dragEndBoostSelect = function() {
  // do not boost if no previousDragX or dragMoveTime
  if ( this.previousDragX === undefined || !this.dragMoveTime ||
    // or if drag was held for 100 ms
    new Date() - this.dragMoveTime > 100 ) {
    return 0;
  }

  var distance = this.getSlideDistance( -this.dragX, this.selectedIndex );
  var delta = this.previousDragX - this.dragX;
  if ( distance > 0 && delta > 0 ) {
    // boost to next if moving towards the right, and positive velocity
    return 1;
  } else if ( distance < 0 && delta < 0 ) {
    // boost to previous if moving towards the left, and negative velocity
    return -1;
  }
  return 0;
};

// ----- staticClick ----- //

proto.staticClick = function( event, pointer ) {
  // get clickedCell, if cell was clicked
  var clickedCell = this.getParentCell( event.target );
  var cellElem = clickedCell && clickedCell.element;
  var cellIndex = clickedCell && this.cells.indexOf( clickedCell );
  this.dispatchEvent( 'staticClick', event, [ pointer, cellElem, cellIndex ] );
};

// ----- scroll ----- //

proto.onscroll = function() {
  var scroll = getScrollPosition();
  var scrollMoveX = this.pointerDownScroll.x - scroll.x;
  var scrollMoveY = this.pointerDownScroll.y - scroll.y;
  // cancel click/tap if scroll is too much
  if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
    this._pointerDone();
  }
};

// ----- utils ----- //

function getScrollPosition() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
}

// -----  ----- //

return Flickity;

}));

},{"./flickity":"/Users/Felipe/Sites/base/node_modules/flickity/js/flickity.js","fizzy-ui-utils":"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js","unidragger":"/Users/Felipe/Sites/base/node_modules/unidragger/unidragger.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/flickity.js":[function(require,module,exports){
// Flickity main
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter',
      'get-size/get-size',
      'fizzy-ui-utils/utils',
      './cell',
      './slide',
      './animate'
    ], function( EvEmitter, getSize, utils, Cell, Slide, animatePrototype ) {
      return factory( window, EvEmitter, getSize, utils, Cell, Slide, animatePrototype );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter'),
      require('get-size'),
      require('fizzy-ui-utils'),
      require('./cell'),
      require('./slide'),
      require('./animate')
    );
  } else {
    // browser global
    var _Flickity = window.Flickity;

    window.Flickity = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      _Flickity.Cell,
      _Flickity.Slide,
      _Flickity.animatePrototype
    );
  }

}( window, function factory( window, EvEmitter, getSize,
  utils, Cell, Slide, animatePrototype ) {

'use strict';

// vars
var jQuery = window.jQuery;
var getComputedStyle = window.getComputedStyle;
var console = window.console;

function moveElements( elems, toElem ) {
  elems = utils.makeArray( elems );
  while ( elems.length ) {
    toElem.appendChild( elems.shift() );
  }
}

// -------------------------- Flickity -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Flickity intances
var instances = {};

function Flickity( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for Flickity: ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // do not initialize twice on same element
  if ( this.element.flickityGUID ) {
    var instance = instances[ this.element.flickityGUID ];
    instance.option( options );
    return instance;
  }

  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }
  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // kick things off
  this._create();
}

Flickity.defaults = {
  accessibility: true,
  // adaptiveHeight: false,
  cellAlign: 'center',
  // cellSelector: undefined,
  // contain: false,
  freeScrollFriction: 0.075, // friction when free-scrolling
  friction: 0.28, // friction when selecting
  namespaceJQueryEvents: true,
  // initialIndex: 0,
  percentPosition: true,
  resize: true,
  selectedAttraction: 0.025,
  setGallerySize: true
  // watchCSS: false,
  // wrapAround: false
};

// hash of methods triggered on _create()
Flickity.createMethods = [];

var proto = Flickity.prototype;
// inherit EventEmitter
utils.extend( proto, EvEmitter.prototype );

proto._create = function() {
  // add id for Flickity.data
  var id = this.guid = ++GUID;
  this.element.flickityGUID = id; // expando
  instances[ id ] = this; // associate via id
  // initial properties
  this.selectedIndex = 0;
  // how many frames slider has been in same position
  this.restingFrames = 0;
  // initial physics properties
  this.x = 0;
  this.velocity = 0;
  this.originSide = this.options.rightToLeft ? 'right' : 'left';
  // create viewport & slider
  this.viewport = document.createElement('div');
  this.viewport.className = 'flickity-viewport';
  this._createSlider();

  if ( this.options.resize || this.options.watchCSS ) {
    window.addEventListener( 'resize', this );
  }

  Flickity.createMethods.forEach( function( method ) {
    this[ method ]();
  }, this );

  if ( this.options.watchCSS ) {
    this.watchCSS();
  } else {
    this.activate();
  }

};

/**
 * set options
 * @param {Object} opts
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

proto.activate = function() {
  if ( this.isActive ) {
    return;
  }
  this.isActive = true;
  this.element.classList.add('flickity-enabled');
  if ( this.options.rightToLeft ) {
    this.element.classList.add('flickity-rtl');
  }

  this.getSize();
  // move initial cell elements so they can be loaded as cells
  var cellElems = this._filterFindCellElements( this.element.children );
  moveElements( cellElems, this.slider );
  this.viewport.appendChild( this.slider );
  this.element.appendChild( this.viewport );
  // get cells from children
  this.reloadCells();

  if ( this.options.accessibility ) {
    // allow element to focusable
    this.element.tabIndex = 0;
    // listen for key presses
    this.element.addEventListener( 'keydown', this );
  }

  this.emitEvent('activate');

  var index;
  var initialIndex = this.options.initialIndex;
  if ( this.isInitActivated ) {
    index = this.selectedIndex;
  } else if ( initialIndex !== undefined ) {
    index = this.cells[ initialIndex ] ? initialIndex : 0;
  } else {
    index = 0;
  }
  // select instantly
  this.select( index, false, true );
  // flag for initial activation, for using initialIndex
  this.isInitActivated = true;
};

// slider positions the cells
proto._createSlider = function() {
  // slider element does all the positioning
  var slider = document.createElement('div');
  slider.className = 'flickity-slider';
  slider.style[ this.originSide ] = 0;
  this.slider = slider;
};

proto._filterFindCellElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.cellSelector );
};

// goes through all children
proto.reloadCells = function() {
  // collection of item elements
  this.cells = this._makeCells( this.slider.children );
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
};

/**
 * turn elements into Flickity.Cells
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Flickity Cells
 */
proto._makeCells = function( elems ) {
  var cellElems = this._filterFindCellElements( elems );

  // create new Flickity for collection
  var cells = cellElems.map( function( cellElem ) {
    return new Cell( cellElem, this );
  }, this );

  return cells;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.getLastSlide = function() {
  return this.slides[ this.slides.length - 1 ];
};

// positions all cells
proto.positionCells = function() {
  // size all cells
  this._sizeCells( this.cells );
  // position all cells
  this._positionCells( 0 );
};

/**
 * position certain cells
 * @param {Integer} index - which cell to start with
 */
proto._positionCells = function( index ) {
  index = index || 0;
  // also measure maxCellHeight
  // start 0 if positioning all cells
  this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
  var cellX = 0;
  // get cellX
  if ( index > 0 ) {
    var startCell = this.cells[ index - 1 ];
    cellX = startCell.x + startCell.size.outerWidth;
  }
  var len = this.cells.length;
  for ( var i=index; i < len; i++ ) {
    var cell = this.cells[i];
    cell.setPosition( cellX );
    cellX += cell.size.outerWidth;
    this.maxCellHeight = Math.max( cell.size.outerHeight, this.maxCellHeight );
  }
  // keep track of cellX for wrap-around
  this.slideableWidth = cellX;
  // slides
  this.updateSlides();
  // contain slides target
  this._containSlides();
  // update slidesWidth
  this.slidesWidth = len ? this.getLastSlide().target - this.slides[0].target : 0;
};

/**
 * cell.getSize() on multiple cells
 * @param {Array} cells
 */
proto._sizeCells = function( cells ) {
  cells.forEach( function( cell ) {
    cell.getSize();
  });
};

// --------------------------  -------------------------- //

proto.updateSlides = function() {
  this.slides = [];
  if ( !this.cells.length ) {
    return;
  }

  var slide = new Slide( this );
  this.slides.push( slide );
  var isOriginLeft = this.originSide == 'left';
  var nextMargin = isOriginLeft ? 'marginRight' : 'marginLeft';

  var canCellFit = this._getCanCellFit();

  this.cells.forEach( function( cell, i ) {
    // just add cell if first cell in slide
    if ( !slide.cells.length ) {
      slide.addCell( cell );
      return;
    }

    var slideWidth = ( slide.outerWidth - slide.firstMargin ) +
      ( cell.size.outerWidth - cell.size[ nextMargin ] );

    if ( canCellFit.call( this, i, slideWidth ) ) {
      slide.addCell( cell );
    } else {
      // doesn't fit, new slide
      slide.updateTarget();

      slide = new Slide( this );
      this.slides.push( slide );
      slide.addCell( cell );
    }
  }, this );
  // last slide
  slide.updateTarget();
  // update .selectedSlide
  this.updateSelectedSlide();
};

proto._getCanCellFit = function() {
  var groupCells = this.options.groupCells;
  if ( !groupCells ) {
    return function() {
      return false;
    };
  } else if ( typeof groupCells == 'number' ) {
    // group by number. 3 -> [0,1,2], [3,4,5], ...
    var number = parseInt( groupCells, 10 );
    return function( i ) {
      return ( i % number ) !== 0;
    };
  }
  // default, group by width of slide
  // parse '75%
  var percentMatch = typeof groupCells == 'string' &&
    groupCells.match(/^(\d+)%$/);
  var percent = percentMatch ? parseInt( percentMatch[1], 10 ) / 100 : 1;
  return function( i, slideWidth ) {
    return slideWidth <= ( this.size.innerWidth + 1 ) * percent;
  };
};

// alias _init for jQuery plugin .flickity()
proto._init =
proto.reposition = function() {
  this.positionCells();
  this.positionSliderAtSelected();
};

proto.getSize = function() {
  this.size = getSize( this.element );
  this.setCellAlign();
  this.cursorPosition = this.size.innerWidth * this.cellAlign;
};

var cellAlignShorthands = {
  // cell align, then based on origin side
  center: {
    left: 0.5,
    right: 0.5
  },
  left: {
    left: 0,
    right: 1
  },
  right: {
    right: 0,
    left: 1
  }
};

proto.setCellAlign = function() {
  var shorthand = cellAlignShorthands[ this.options.cellAlign ];
  this.cellAlign = shorthand ? shorthand[ this.originSide ] : this.options.cellAlign;
};

proto.setGallerySize = function() {
  if ( this.options.setGallerySize ) {
    var height = this.options.adaptiveHeight && this.selectedSlide ?
      this.selectedSlide.height : this.maxCellHeight;
    this.viewport.style.height = height + 'px';
  }
};

proto._getWrapShiftCells = function() {
  // only for wrap-around
  if ( !this.options.wrapAround ) {
    return;
  }
  // unshift previous cells
  this._unshiftCells( this.beforeShiftCells );
  this._unshiftCells( this.afterShiftCells );
  // get before cells
  // initial gap
  var gapX = this.cursorPosition;
  var cellIndex = this.cells.length - 1;
  this.beforeShiftCells = this._getGapCells( gapX, cellIndex, -1 );
  // get after cells
  // ending gap between last cell and end of gallery viewport
  gapX = this.size.innerWidth - this.cursorPosition;
  // start cloning at first cell, working forwards
  this.afterShiftCells = this._getGapCells( gapX, 0, 1 );
};

proto._getGapCells = function( gapX, cellIndex, increment ) {
  // keep adding cells until the cover the initial gap
  var cells = [];
  while ( gapX > 0 ) {
    var cell = this.cells[ cellIndex ];
    if ( !cell ) {
      break;
    }
    cells.push( cell );
    cellIndex += increment;
    gapX -= cell.size.outerWidth;
  }
  return cells;
};

// ----- contain ----- //

// contain cell targets so no excess sliding
proto._containSlides = function() {
  if ( !this.options.contain || this.options.wrapAround || !this.cells.length ) {
    return;
  }
  var isRightToLeft = this.options.rightToLeft;
  var beginMargin = isRightToLeft ? 'marginRight' : 'marginLeft';
  var endMargin = isRightToLeft ? 'marginLeft' : 'marginRight';
  var contentWidth = this.slideableWidth - this.getLastCell().size[ endMargin ];
  // content is less than gallery size
  var isContentSmaller = contentWidth < this.size.innerWidth;
  // bounds
  var beginBound = this.cursorPosition + this.cells[0].size[ beginMargin ];
  var endBound = contentWidth - this.size.innerWidth * ( 1 - this.cellAlign );
  // contain each cell target
  this.slides.forEach( function( slide ) {
    if ( isContentSmaller ) {
      // all cells fit inside gallery
      slide.target = contentWidth * this.cellAlign;
    } else {
      // contain to bounds
      slide.target = Math.max( slide.target, beginBound );
      slide.target = Math.min( slide.target, endBound );
    }
  }, this );
};

// -----  ----- //

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery && this.$element ) {
    // default trigger with type if no event
    type += this.options.namespaceJQueryEvents ? '.flickity' : '';
    var $event = type;
    if ( event ) {
      // create jQuery event
      var jQEvent = jQuery.Event( event );
      jQEvent.type = type;
      $event = jQEvent;
    }
    this.$element.trigger( $event, args );
  }
};

// -------------------------- select -------------------------- //

/**
 * @param {Integer} index - index of the slide
 * @param {Boolean} isWrap - will wrap-around to last/first if at the end
 * @param {Boolean} isInstant - will immediately set position at selected cell
 */
proto.select = function( index, isWrap, isInstant ) {
  if ( !this.isActive ) {
    return;
  }
  index = parseInt( index, 10 );
  this._wrapSelect( index );

  if ( this.options.wrapAround || isWrap ) {
    index = utils.modulo( index, this.slides.length );
  }
  // bail if invalid index
  if ( !this.slides[ index ] ) {
    return;
  }
  this.selectedIndex = index;
  this.updateSelectedSlide();
  if ( isInstant ) {
    this.positionSliderAtSelected();
  } else {
    this.startAnimation();
  }
  if ( this.options.adaptiveHeight ) {
    this.setGallerySize();
  }

  this.dispatchEvent('select');
  // old v1 event name, remove in v3
  this.dispatchEvent('cellSelect');
};

// wraps position for wrapAround, to move to closest slide. #113
proto._wrapSelect = function( index ) {
  var len = this.slides.length;
  var isWrapping = this.options.wrapAround && len > 1;
  if ( !isWrapping ) {
    return index;
  }
  var wrapIndex = utils.modulo( index, len );
  // go to shortest
  var delta = Math.abs( wrapIndex - this.selectedIndex );
  var backWrapDelta = Math.abs( ( wrapIndex + len ) - this.selectedIndex );
  var forewardWrapDelta = Math.abs( ( wrapIndex - len ) - this.selectedIndex );
  if ( !this.isDragSelect && backWrapDelta < delta ) {
    index += len;
  } else if ( !this.isDragSelect && forewardWrapDelta < delta ) {
    index -= len;
  }
  // wrap position so slider is within normal area
  if ( index < 0 ) {
    this.x -= this.slideableWidth;
  } else if ( index >= len ) {
    this.x += this.slideableWidth;
  }
};

proto.previous = function( isWrap, isInstant ) {
  this.select( this.selectedIndex - 1, isWrap, isInstant );
};

proto.next = function( isWrap, isInstant ) {
  this.select( this.selectedIndex + 1, isWrap, isInstant );
};

proto.updateSelectedSlide = function() {
  var slide = this.slides[ this.selectedIndex ];
  // selectedIndex could be outside of slides, if triggered before resize()
  if ( !slide ) {
    return;
  }
  // unselect previous selected slide
  this.unselectSelectedSlide();
  // update new selected slide
  this.selectedSlide = slide;
  slide.select();
  this.selectedCells = slide.cells;
  this.selectedElements = slide.getCellElements();
  // HACK: selectedCell & selectedElement is first cell in slide, backwards compatibility
  // Remove in v3?
  this.selectedCell = slide.cells[0];
  this.selectedElement = this.selectedElements[0];
};

proto.unselectSelectedSlide = function() {
  if ( this.selectedSlide ) {
    this.selectedSlide.unselect();
  }
};

/**
 * select slide from number or cell element
 * @param {Element or Number} elem
 */
proto.selectCell = function( value, isWrap, isInstant ) {
  // get cell
  var cell;
  if ( typeof value == 'number' ) {
    cell = this.cells[ value ];
  } else {
    // use string as selector
    if ( typeof value == 'string' ) {
      value = this.element.querySelector( value );
    }
    // get cell from element
    cell = this.getCell( value );
  }
  // select slide that has cell
  for ( var i=0; cell && i < this.slides.length; i++ ) {
    var slide = this.slides[i];
    var index = slide.cells.indexOf( cell );
    if ( index != -1 ) {
      this.select( i, isWrap, isInstant );
      return;
    }
  }
};

// -------------------------- get cells -------------------------- //

/**
 * get Flickity.Cell, given an Element
 * @param {Element} elem
 * @returns {Flickity.Cell} item
 */
proto.getCell = function( elem ) {
  // loop through cells to get the one that matches
  for ( var i=0; i < this.cells.length; i++ ) {
    var cell = this.cells[i];
    if ( cell.element == elem ) {
      return cell;
    }
  }
};

/**
 * get collection of Flickity.Cells, given Elements
 * @param {Element, Array, NodeList} elems
 * @returns {Array} cells - Flickity.Cells
 */
proto.getCells = function( elems ) {
  elems = utils.makeArray( elems );
  var cells = [];
  elems.forEach( function( elem ) {
    var cell = this.getCell( elem );
    if ( cell ) {
      cells.push( cell );
    }
  }, this );
  return cells;
};

/**
 * get cell elements
 * @returns {Array} cellElems
 */
proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  });
};

/**
 * get parent cell from an element
 * @param {Element} elem
 * @returns {Flickit.Cell} cell
 */
proto.getParentCell = function( elem ) {
  // first check if elem is cell
  var cell = this.getCell( elem );
  if ( cell ) {
    return cell;
  }
  // try to get parent cell elem
  elem = utils.getParent( elem, '.flickity-slider > *' );
  return this.getCell( elem );
};

/**
 * get cells adjacent to a slide
 * @param {Integer} adjCount - number of adjacent slides
 * @param {Integer} index - index of slide to start
 * @returns {Array} cells - array of Flickity.Cells
 */
proto.getAdjacentCellElements = function( adjCount, index ) {
  if ( !adjCount ) {
    return this.selectedSlide.getCellElements();
  }
  index = index === undefined ? this.selectedIndex : index;

  var len = this.slides.length;
  if ( 1 + ( adjCount * 2 ) >= len ) {
    return this.getCellElements();
  }

  var cellElems = [];
  for ( var i = index - adjCount; i <= index + adjCount ; i++ ) {
    var slideIndex = this.options.wrapAround ? utils.modulo( i, len ) : i;
    var slide = this.slides[ slideIndex ];
    if ( slide ) {
      cellElems = cellElems.concat( slide.getCellElements() );
    }
  }
  return cellElems;
};

// -------------------------- events -------------------------- //

proto.uiChange = function() {
  this.emitEvent('uiChange');
};

proto.childUIPointerDown = function( event ) {
  this.emitEvent( 'childUIPointerDown', [ event ] );
};

// ----- resize ----- //

proto.onresize = function() {
  this.watchCSS();
  this.resize();
};

utils.debounceMethod( Flickity, 'onresize', 150 );

proto.resize = function() {
  if ( !this.isActive ) {
    return;
  }
  this.getSize();
  // wrap values
  if ( this.options.wrapAround ) {
    this.x = utils.modulo( this.x, this.slideableWidth );
  }
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
  this.emitEvent('resize');
  // update selected index for group slides, instant
  // TODO: position can be lost between groups of various numbers
  var selectedElement = this.selectedElements && this.selectedElements[0];
  this.selectCell( selectedElement, false, true );
};

// watches the :after property, activates/deactivates
proto.watchCSS = function() {
  var watchOption = this.options.watchCSS;
  if ( !watchOption ) {
    return;
  }

  var afterContent = getComputedStyle( this.element, ':after' ).content;
  // activate if :after { content: 'flickity' }
  if ( afterContent.indexOf('flickity') != -1 ) {
    this.activate();
  } else {
    this.deactivate();
  }
};

// ----- keydown ----- //

// go previous/next if left/right keys pressed
proto.onkeydown = function( event ) {
  // only work if element is in focus
  if ( !this.options.accessibility ||
    ( document.activeElement && document.activeElement != this.element ) ) {
    return;
  }

  if ( event.keyCode == 37 ) {
    // go left
    var leftMethod = this.options.rightToLeft ? 'next' : 'previous';
    this.uiChange();
    this[ leftMethod ]();
  } else if ( event.keyCode == 39 ) {
    // go right
    var rightMethod = this.options.rightToLeft ? 'previous' : 'next';
    this.uiChange();
    this[ rightMethod ]();
  }
};

// -------------------------- destroy -------------------------- //

// deactivate all Flickity functionality, but keep stuff available
proto.deactivate = function() {
  if ( !this.isActive ) {
    return;
  }
  this.element.classList.remove('flickity-enabled');
  this.element.classList.remove('flickity-rtl');
  // destroy cells
  this.cells.forEach( function( cell ) {
    cell.destroy();
  });
  this.unselectSelectedSlide();
  this.element.removeChild( this.viewport );
  // move child elements back into element
  moveElements( this.slider.children, this.element );
  if ( this.options.accessibility ) {
    this.element.removeAttribute('tabIndex');
    this.element.removeEventListener( 'keydown', this );
  }
  // set flags
  this.isActive = false;
  this.emitEvent('deactivate');
};

proto.destroy = function() {
  this.deactivate();
  window.removeEventListener( 'resize', this );
  this.emitEvent('destroy');
  if ( jQuery && this.$element ) {
    jQuery.removeData( this.element, 'flickity' );
  }
  delete this.element.flickityGUID;
  delete instances[ this.guid ];
};

// -------------------------- prototype -------------------------- //

utils.extend( proto, animatePrototype );

// -------------------------- extras -------------------------- //

/**
 * get Flickity instance from element
 * @param {Element} elem
 * @returns {Flickity}
 */
Flickity.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.flickityGUID;
  return id && instances[ id ];
};

utils.htmlInit( Flickity, 'flickity' );

if ( jQuery && jQuery.bridget ) {
  jQuery.bridget( 'flickity', Flickity );
}

Flickity.Cell = Cell;

return Flickity;

}));

},{"./animate":"/Users/Felipe/Sites/base/node_modules/flickity/js/animate.js","./cell":"/Users/Felipe/Sites/base/node_modules/flickity/js/cell.js","./slide":"/Users/Felipe/Sites/base/node_modules/flickity/js/slide.js","ev-emitter":"/Users/Felipe/Sites/base/node_modules/ev-emitter/ev-emitter.js","fizzy-ui-utils":"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js","get-size":"/Users/Felipe/Sites/base/node_modules/get-size/get-size.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/index.js":[function(require,module,exports){
/*!
 * Flickity v2.0.5
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://flickity.metafizzy.co
 * Copyright 2016 Metafizzy
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      './drag',
      './prev-next-button',
      './page-dots',
      './player',
      './add-remove-cell',
      './lazyload'
    ], factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('./flickity'),
      require('./drag'),
      require('./prev-next-button'),
      require('./page-dots'),
      require('./player'),
      require('./add-remove-cell'),
      require('./lazyload')
    );
  }

})( window, function factory( Flickity ) {
  /*jshint strict: false*/
  return Flickity;
});

},{"./add-remove-cell":"/Users/Felipe/Sites/base/node_modules/flickity/js/add-remove-cell.js","./drag":"/Users/Felipe/Sites/base/node_modules/flickity/js/drag.js","./flickity":"/Users/Felipe/Sites/base/node_modules/flickity/js/flickity.js","./lazyload":"/Users/Felipe/Sites/base/node_modules/flickity/js/lazyload.js","./page-dots":"/Users/Felipe/Sites/base/node_modules/flickity/js/page-dots.js","./player":"/Users/Felipe/Sites/base/node_modules/flickity/js/player.js","./prev-next-button":"/Users/Felipe/Sites/base/node_modules/flickity/js/prev-next-button.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/lazyload.js":[function(require,module,exports){
// lazyload
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'fizzy-ui-utils/utils'
    ], function( Flickity, utils ) {
      return factory( window, Flickity, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, utils ) {
'use strict';

Flickity.createMethods.push('_createLazyload');
var proto = Flickity.prototype;

proto._createLazyload = function() {
  this.on( 'select', this.lazyLoad );
};

proto.lazyLoad = function() {
  var lazyLoad = this.options.lazyLoad;
  if ( !lazyLoad ) {
    return;
  }
  // get adjacent cells, use lazyLoad option for adjacent count
  var adjCount = typeof lazyLoad == 'number' ? lazyLoad : 0;
  var cellElems = this.getAdjacentCellElements( adjCount );
  // get lazy images in those cells
  var lazyImages = [];
  cellElems.forEach( function( cellElem ) {
    var lazyCellImages = getCellLazyImages( cellElem );
    lazyImages = lazyImages.concat( lazyCellImages );
  });
  // load lazy images
  lazyImages.forEach( function( img ) {
    new LazyLoader( img, this );
  }, this );
};

function getCellLazyImages( cellElem ) {
  // check if cell element is lazy image
  if ( cellElem.nodeName == 'IMG' &&
    cellElem.getAttribute('data-flickity-lazyload') ) {
    return [ cellElem ];
  }
  // select lazy images in cell
  var imgs = cellElem.querySelectorAll('img[data-flickity-lazyload]');
  return utils.makeArray( imgs );
}

// -------------------------- LazyLoader -------------------------- //

/**
 * class to handle loading images
 */
function LazyLoader( img, flickity ) {
  this.img = img;
  this.flickity = flickity;
  this.load();
}

LazyLoader.prototype.handleEvent = utils.handleEvent;

LazyLoader.prototype.load = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  // load image
  this.img.src = this.img.getAttribute('data-flickity-lazyload');
  // remove attr
  this.img.removeAttribute('data-flickity-lazyload');
};

LazyLoader.prototype.onload = function( event ) {
  this.complete( event, 'flickity-lazyloaded' );
};

LazyLoader.prototype.onerror = function( event ) {
  this.complete( event, 'flickity-lazyerror' );
};

LazyLoader.prototype.complete = function( event, className ) {
  // unbind events
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );

  var cell = this.flickity.getParentCell( this.img );
  var cellElem = cell && cell.element;
  this.flickity.cellSizeChange( cellElem );

  this.img.classList.add( className );
  this.flickity.dispatchEvent( 'lazyLoad', event, cellElem );
};

// -----  ----- //

Flickity.LazyLoader = LazyLoader;

return Flickity;

}));

},{"./flickity":"/Users/Felipe/Sites/base/node_modules/flickity/js/flickity.js","fizzy-ui-utils":"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/page-dots.js":[function(require,module,exports){
// page dots
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'tap-listener/tap-listener',
      'fizzy-ui-utils/utils'
    ], function( Flickity, TapListener, utils ) {
      return factory( window, Flickity, TapListener, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('tap-listener'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.TapListener,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, TapListener, utils ) {

// -------------------------- PageDots -------------------------- //

'use strict';

function PageDots( parent ) {
  this.parent = parent;
  this._create();
}

PageDots.prototype = new TapListener();

PageDots.prototype._create = function() {
  // create holder element
  this.holder = document.createElement('ol');
  this.holder.className = 'flickity-page-dots';
  // create dots, array of elements
  this.dots = [];
  // events
  this.on( 'tap', this.onTap );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PageDots.prototype.activate = function() {
  this.setDots();
  this.bindTap( this.holder );
  // add to DOM
  this.parent.element.appendChild( this.holder );
};

PageDots.prototype.deactivate = function() {
  // remove from DOM
  this.parent.element.removeChild( this.holder );
  TapListener.prototype.destroy.call( this );
};

PageDots.prototype.setDots = function() {
  // get difference between number of slides and number of dots
  var delta = this.parent.slides.length - this.dots.length;
  if ( delta > 0 ) {
    this.addDots( delta );
  } else if ( delta < 0 ) {
    this.removeDots( -delta );
  }
};

PageDots.prototype.addDots = function( count ) {
  var fragment = document.createDocumentFragment();
  var newDots = [];
  while ( count ) {
    var dot = document.createElement('li');
    dot.className = 'dot';
    fragment.appendChild( dot );
    newDots.push( dot );
    count--;
  }
  this.holder.appendChild( fragment );
  this.dots = this.dots.concat( newDots );
};

PageDots.prototype.removeDots = function( count ) {
  // remove from this.dots collection
  var removeDots = this.dots.splice( this.dots.length - count, count );
  // remove from DOM
  removeDots.forEach( function( dot ) {
    this.holder.removeChild( dot );
  }, this );
};

PageDots.prototype.updateSelected = function() {
  // remove selected class on previous
  if ( this.selectedDot ) {
    this.selectedDot.className = 'dot';
  }
  // don't proceed if no dots
  if ( !this.dots.length ) {
    return;
  }
  this.selectedDot = this.dots[ this.parent.selectedIndex ];
  this.selectedDot.className = 'dot is-selected';
};

PageDots.prototype.onTap = function( event ) {
  var target = event.target;
  // only care about dot clicks
  if ( target.nodeName != 'LI' ) {
    return;
  }

  this.parent.uiChange();
  var index = this.dots.indexOf( target );
  this.parent.select( index );
};

PageDots.prototype.destroy = function() {
  this.deactivate();
};

Flickity.PageDots = PageDots;

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pageDots: true
});

Flickity.createMethods.push('_createPageDots');

var proto = Flickity.prototype;

proto._createPageDots = function() {
  if ( !this.options.pageDots ) {
    return;
  }
  this.pageDots = new PageDots( this );
  // events
  this.on( 'activate', this.activatePageDots );
  this.on( 'select', this.updateSelectedPageDots );
  this.on( 'cellChange', this.updatePageDots );
  this.on( 'resize', this.updatePageDots );
  this.on( 'deactivate', this.deactivatePageDots );
};

proto.activatePageDots = function() {
  this.pageDots.activate();
};

proto.updateSelectedPageDots = function() {
  this.pageDots.updateSelected();
};

proto.updatePageDots = function() {
  this.pageDots.setDots();
};

proto.deactivatePageDots = function() {
  this.pageDots.deactivate();
};

// -----  ----- //

Flickity.PageDots = PageDots;

return Flickity;

}));

},{"./flickity":"/Users/Felipe/Sites/base/node_modules/flickity/js/flickity.js","fizzy-ui-utils":"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js","tap-listener":"/Users/Felipe/Sites/base/node_modules/tap-listener/tap-listener.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/player.js":[function(require,module,exports){
// player & autoPlay
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter',
      'fizzy-ui-utils/utils',
      './flickity'
    ], function( EvEmitter, utils, Flickity ) {
      return factory( EvEmitter, utils, Flickity );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      require('ev-emitter'),
      require('fizzy-ui-utils'),
      require('./flickity')
    );
  } else {
    // browser global
    factory(
      window.EvEmitter,
      window.fizzyUIUtils,
      window.Flickity
    );
  }

}( window, function factory( EvEmitter, utils, Flickity ) {

'use strict';

// -------------------------- Page Visibility -------------------------- //
// https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API

var hiddenProperty, visibilityEvent;
if ( 'hidden' in document ) {
  hiddenProperty = 'hidden';
  visibilityEvent = 'visibilitychange';
} else if ( 'webkitHidden' in document ) {
  hiddenProperty = 'webkitHidden';
  visibilityEvent = 'webkitvisibilitychange';
}

// -------------------------- Player -------------------------- //

function Player( parent ) {
  this.parent = parent;
  this.state = 'stopped';
  // visibility change event handler
  if ( visibilityEvent ) {
    this.onVisibilityChange = function() {
      this.visibilityChange();
    }.bind( this );
    this.onVisibilityPlay = function() {
      this.visibilityPlay();
    }.bind( this );
  }
}

Player.prototype = Object.create( EvEmitter.prototype );

// start play
Player.prototype.play = function() {
  if ( this.state == 'playing' ) {
    return;
  }
  // do not play if page is hidden, start playing when page is visible
  var isPageHidden = document[ hiddenProperty ];
  if ( visibilityEvent && isPageHidden ) {
    document.addEventListener( visibilityEvent, this.onVisibilityPlay );
    return;
  }

  this.state = 'playing';
  // listen to visibility change
  if ( visibilityEvent ) {
    document.addEventListener( visibilityEvent, this.onVisibilityChange );
  }
  // start ticking
  this.tick();
};

Player.prototype.tick = function() {
  // do not tick if not playing
  if ( this.state != 'playing' ) {
    return;
  }

  var time = this.parent.options.autoPlay;
  // default to 3 seconds
  time = typeof time == 'number' ? time : 3000;
  var _this = this;
  // HACK: reset ticks if stopped and started within interval
  this.clear();
  this.timeout = setTimeout( function() {
    _this.parent.next( true );
    _this.tick();
  }, time );
};

Player.prototype.stop = function() {
  this.state = 'stopped';
  this.clear();
  // remove visibility change event
  if ( visibilityEvent ) {
    document.removeEventListener( visibilityEvent, this.onVisibilityChange );
  }
};

Player.prototype.clear = function() {
  clearTimeout( this.timeout );
};

Player.prototype.pause = function() {
  if ( this.state == 'playing' ) {
    this.state = 'paused';
    this.clear();
  }
};

Player.prototype.unpause = function() {
  // re-start play if paused
  if ( this.state == 'paused' ) {
    this.play();
  }
};

// pause if page visibility is hidden, unpause if visible
Player.prototype.visibilityChange = function() {
  var isPageHidden = document[ hiddenProperty ];
  this[ isPageHidden ? 'pause' : 'unpause' ]();
};

Player.prototype.visibilityPlay = function() {
  this.play();
  document.removeEventListener( visibilityEvent, this.onVisibilityPlay );
};

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pauseAutoPlayOnHover: true
});

Flickity.createMethods.push('_createPlayer');
var proto = Flickity.prototype;

proto._createPlayer = function() {
  this.player = new Player( this );

  this.on( 'activate', this.activatePlayer );
  this.on( 'uiChange', this.stopPlayer );
  this.on( 'pointerDown', this.stopPlayer );
  this.on( 'deactivate', this.deactivatePlayer );
};

proto.activatePlayer = function() {
  if ( !this.options.autoPlay ) {
    return;
  }
  this.player.play();
  this.element.addEventListener( 'mouseenter', this );
};

// Player API, don't hate the ... thanks I know where the door is

proto.playPlayer = function() {
  this.player.play();
};

proto.stopPlayer = function() {
  this.player.stop();
};

proto.pausePlayer = function() {
  this.player.pause();
};

proto.unpausePlayer = function() {
  this.player.unpause();
};

proto.deactivatePlayer = function() {
  this.player.stop();
  this.element.removeEventListener( 'mouseenter', this );
};

// ----- mouseenter/leave ----- //

// pause auto-play on hover
proto.onmouseenter = function() {
  if ( !this.options.pauseAutoPlayOnHover ) {
    return;
  }
  this.player.pause();
  this.element.addEventListener( 'mouseleave', this );
};

// resume auto-play on hover off
proto.onmouseleave = function() {
  this.player.unpause();
  this.element.removeEventListener( 'mouseleave', this );
};

// -----  ----- //

Flickity.Player = Player;

return Flickity;

}));

},{"./flickity":"/Users/Felipe/Sites/base/node_modules/flickity/js/flickity.js","ev-emitter":"/Users/Felipe/Sites/base/node_modules/ev-emitter/ev-emitter.js","fizzy-ui-utils":"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/prev-next-button.js":[function(require,module,exports){
// prev/next buttons
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      './flickity',
      'tap-listener/tap-listener',
      'fizzy-ui-utils/utils'
    ], function( Flickity, TapListener, utils ) {
      return factory( window, Flickity, TapListener, utils );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('./flickity'),
      require('tap-listener'),
      require('fizzy-ui-utils')
    );
  } else {
    // browser global
    factory(
      window,
      window.Flickity,
      window.TapListener,
      window.fizzyUIUtils
    );
  }

}( window, function factory( window, Flickity, TapListener, utils ) {
'use strict';

var svgURI = 'http://www.w3.org/2000/svg';

// -------------------------- PrevNextButton -------------------------- //

function PrevNextButton( direction, parent ) {
  this.direction = direction;
  this.parent = parent;
  this._create();
}

PrevNextButton.prototype = new TapListener();

PrevNextButton.prototype._create = function() {
  // properties
  this.isEnabled = true;
  this.isPrevious = this.direction == -1;
  var leftDirection = this.parent.options.rightToLeft ? 1 : -1;
  this.isLeft = this.direction == leftDirection;

  var element = this.element = document.createElement('button');
  element.className = 'flickity-prev-next-button';
  element.className += this.isPrevious ? ' previous' : ' next';
  // prevent button from submitting form http://stackoverflow.com/a/10836076/182183
  element.setAttribute( 'type', 'button' );
  // init as disabled
  this.disable();

  element.setAttribute( 'aria-label', this.isPrevious ? 'previous' : 'next' );

  // create arrow
  var svg = this.createSVG();
  element.appendChild( svg );
  // events
  this.on( 'tap', this.onTap );
  this.parent.on( 'select', this.update.bind( this ) );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PrevNextButton.prototype.activate = function() {
  this.bindTap( this.element );
  // click events from keyboard
  this.element.addEventListener( 'click', this );
  // add to DOM
  this.parent.element.appendChild( this.element );
};

PrevNextButton.prototype.deactivate = function() {
  // remove from DOM
  this.parent.element.removeChild( this.element );
  // do regular TapListener destroy
  TapListener.prototype.destroy.call( this );
  // click events from keyboard
  this.element.removeEventListener( 'click', this );
};

PrevNextButton.prototype.createSVG = function() {
  var svg = document.createElementNS( svgURI, 'svg');
  svg.setAttribute( 'viewBox', '0 0 100 100' );
  var path = document.createElementNS( svgURI, 'path');
  var pathMovements = getArrowMovements( this.parent.options.arrowShape );
  path.setAttribute( 'd', pathMovements );
  path.setAttribute( 'class', 'arrow' );
  // rotate arrow
  if ( !this.isLeft ) {
    path.setAttribute( 'transform', 'translate(100, 100) rotate(180) ' );
  }
  svg.appendChild( path );
  return svg;
};

// get SVG path movmement
function getArrowMovements( shape ) {
  // use shape as movement if string
  if ( typeof shape == 'string' ) {
    return shape;
  }
  // create movement string
  return 'M ' + shape.x0 + ',50' +
    ' L ' + shape.x1 + ',' + ( shape.y1 + 50 ) +
    ' L ' + shape.x2 + ',' + ( shape.y2 + 50 ) +
    ' L ' + shape.x3 + ',50 ' +
    ' L ' + shape.x2 + ',' + ( 50 - shape.y2 ) +
    ' L ' + shape.x1 + ',' + ( 50 - shape.y1 ) +
    ' Z';
}

PrevNextButton.prototype.onTap = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.parent.uiChange();
  var method = this.isPrevious ? 'previous' : 'next';
  this.parent[ method ]();
};

PrevNextButton.prototype.handleEvent = utils.handleEvent;

PrevNextButton.prototype.onclick = function() {
  // only allow clicks from keyboard
  var focused = document.activeElement;
  if ( focused && focused == this.element ) {
    this.onTap();
  }
};

// -----  ----- //

PrevNextButton.prototype.enable = function() {
  if ( this.isEnabled ) {
    return;
  }
  this.element.disabled = false;
  this.isEnabled = true;
};

PrevNextButton.prototype.disable = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.element.disabled = true;
  this.isEnabled = false;
};

PrevNextButton.prototype.update = function() {
  // index of first or last slide, if previous or next
  var slides = this.parent.slides;
  // enable is wrapAround and at least 2 slides
  if ( this.parent.options.wrapAround && slides.length > 1 ) {
    this.enable();
    return;
  }
  var lastIndex = slides.length ? slides.length - 1 : 0;
  var boundIndex = this.isPrevious ? 0 : lastIndex;
  var method = this.parent.selectedIndex == boundIndex ? 'disable' : 'enable';
  this[ method ]();
};

PrevNextButton.prototype.destroy = function() {
  this.deactivate();
};

// -------------------------- Flickity prototype -------------------------- //

utils.extend( Flickity.defaults, {
  prevNextButtons: true,
  arrowShape: {
    x0: 10,
    x1: 60, y1: 50,
    x2: 70, y2: 40,
    x3: 30
  }
});

Flickity.createMethods.push('_createPrevNextButtons');
var proto = Flickity.prototype;

proto._createPrevNextButtons = function() {
  if ( !this.options.prevNextButtons ) {
    return;
  }

  this.prevButton = new PrevNextButton( -1, this );
  this.nextButton = new PrevNextButton( 1, this );

  this.on( 'activate', this.activatePrevNextButtons );
};

proto.activatePrevNextButtons = function() {
  this.prevButton.activate();
  this.nextButton.activate();
  this.on( 'deactivate', this.deactivatePrevNextButtons );
};

proto.deactivatePrevNextButtons = function() {
  this.prevButton.deactivate();
  this.nextButton.deactivate();
  this.off( 'deactivate', this.deactivatePrevNextButtons );
};

// --------------------------  -------------------------- //

Flickity.PrevNextButton = PrevNextButton;

return Flickity;

}));

},{"./flickity":"/Users/Felipe/Sites/base/node_modules/flickity/js/flickity.js","fizzy-ui-utils":"/Users/Felipe/Sites/base/node_modules/fizzy-ui-utils/utils.js","tap-listener":"/Users/Felipe/Sites/base/node_modules/tap-listener/tap-listener.js"}],"/Users/Felipe/Sites/base/node_modules/flickity/js/slide.js":[function(require,module,exports){
// slide
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.Flickity = window.Flickity || {};
    window.Flickity.Slide = factory();
  }

}( window, function factory() {
'use strict';

function Slide( parent ) {
  this.parent = parent;
  this.isOriginLeft = parent.originSide == 'left';
  this.cells = [];
  this.outerWidth = 0;
  this.height = 0;
}

var proto = Slide.prototype;

proto.addCell = function( cell ) {
  this.cells.push( cell );
  this.outerWidth += cell.size.outerWidth;
  this.height = Math.max( cell.size.outerHeight, this.height );
  // first cell stuff
  if ( this.cells.length == 1 ) {
    this.x = cell.x; // x comes from first cell
    var beginMargin = this.isOriginLeft ? 'marginLeft' : 'marginRight';
    this.firstMargin = cell.size[ beginMargin ];
  }
};

proto.updateTarget = function() {
  var endMargin = this.isOriginLeft ? 'marginRight' : 'marginLeft';
  var lastCell = this.getLastCell();
  var lastMargin = lastCell ? lastCell.size[ endMargin ] : 0;
  var slideWidth = this.outerWidth - ( this.firstMargin + lastMargin );
  this.target = this.x + this.firstMargin + slideWidth * this.parent.cellAlign;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.select = function() {
  this.changeSelectedClass('add');
};

proto.unselect = function() {
  this.changeSelectedClass('remove');
};

proto.changeSelectedClass = function( method ) {
  this.cells.forEach( function( cell ) {
    cell.element.classList[ method ]('is-selected');
  });
};

proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  });
};

return Slide;

}));

},{}],"/Users/Felipe/Sites/base/node_modules/get-size/get-size.js":[function(require,module,exports){
/*!
 * getSize v2.0.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false, console: false */

( function( window, factory ) {
  'use strict';

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( function() {
      return factory();
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.getSize = factory();
  }

})( window, function factory() {
'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') == -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console == 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

var measurementsLength = measurements.length;

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}

// -------------------------- getStyle -------------------------- //

/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function getStyle( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    logError( 'Style returned ' + style +
      '. Are you running this code in a hidden iframe on Firefox? ' +
      'See http://bit.ly/getsizebug1' );
  }
  return style;
}

// -------------------------- setup -------------------------- //

var isSetup = false;

var isBoxSizeOuter;

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  // -------------------------- box sizing -------------------------- //

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox<29 measures the inner-width
   */
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );

  getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize( style.width ) == 200;
  body.removeChild( div );

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem == 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display == 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

  // get all measurements
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

return getSize;

});

},{}],"/Users/Felipe/Sites/base/node_modules/input-placeholder-polyfill/dist/main.min.js":[function(require,module,exports){
function hidePlaceholderOnFocus(a){target=a.currentTarget?a.currentTarget:a.srcElement,target.value==target.getAttribute("placeholder")&&(target.value="")}function unfocusOnAnElement(a){target=a.currentTarget?a.currentTarget:a.srcElement,""==target.value&&(target.value=target.getAttribute("placeholder"))}if(!("placeholder"in document.createElement("input")))for(var inputs=document.getElementsByTagName("input"),i=0;i<inputs.length;i++)inputs[i].value||(inputs[i].value=inputs[i].getAttribute("placeholder")),inputs[i].addEventListener?(inputs[i].addEventListener("click",hidePlaceholderOnFocus,!1),inputs[i].addEventListener("blur",unfocusOnAnElement,!1)):inputs[i].attachEvent&&(inputs[i].attachEvent("onclick",hidePlaceholderOnFocus),inputs[i].attachEvent("onblur",unfocusOnAnElement));
},{}],"/Users/Felipe/Sites/base/node_modules/object-assign/index.js":[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],"/Users/Felipe/Sites/base/node_modules/promise-polyfill/promise.js":[function(require,module,exports){
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],"/Users/Felipe/Sites/base/node_modules/smooth-scroll/dist/js/smooth-scroll.min.js":[function(require,module,exports){
(function (global){
/*! smooth-scroll v10.2.1 | (c) 2016 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/smooth-scroll */
!(function(e,t){"function"==typeof define&&define.amd?define([],t(e)):"object"==typeof exports?module.exports=t(e):e.smoothScroll=t(e)})("undefined"!=typeof global?global:this.window||this.global,(function(e){"use strict";var t,n,o,r,a,c,l,i={},u="querySelector"in document&&"addEventListener"in e,s={selector:"[data-scroll]",selectorHeader:null,speed:500,easing:"easeInOutCubic",offset:0,callback:function(){}},d=function(){var e={},t=!1,n=0,o=arguments.length;"[object Boolean]"===Object.prototype.toString.call(arguments[0])&&(t=arguments[0],n++);for(var r=function(n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t&&"[object Object]"===Object.prototype.toString.call(n[o])?e[o]=d(!0,e[o],n[o]):e[o]=n[o])};n<o;n++){var a=arguments[n];r(a)}return e},f=function(e){return Math.max(e.scrollHeight,e.offsetHeight,e.clientHeight)},h=function(e,t){for(Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(e){for(var t=(this.document||this.ownerDocument).querySelectorAll(e),n=t.length;--n>=0&&t.item(n)!==this;);return n>-1});e&&e!==document;e=e.parentNode)if(e.matches(t))return e;return null},m=function(e){"#"===e.charAt(0)&&(e=e.substr(1));for(var t,n=String(e),o=n.length,r=-1,a="",c=n.charCodeAt(0);++r<o;){if(t=n.charCodeAt(r),0===t)throw new InvalidCharacterError("Invalid character: the input contains U+0000.");a+=t>=1&&t<=31||127==t||0===r&&t>=48&&t<=57||1===r&&t>=48&&t<=57&&45===c?"\\"+t.toString(16)+" ":t>=128||45===t||95===t||t>=48&&t<=57||t>=65&&t<=90||t>=97&&t<=122?n.charAt(r):"\\"+n.charAt(r)}return"#"+a},p=function(e,t){var n;return"easeInQuad"===e&&(n=t*t),"easeOutQuad"===e&&(n=t*(2-t)),"easeInOutQuad"===e&&(n=t<.5?2*t*t:-1+(4-2*t)*t),"easeInCubic"===e&&(n=t*t*t),"easeOutCubic"===e&&(n=--t*t*t+1),"easeInOutCubic"===e&&(n=t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1),"easeInQuart"===e&&(n=t*t*t*t),"easeOutQuart"===e&&(n=1- --t*t*t*t),"easeInOutQuart"===e&&(n=t<.5?8*t*t*t*t:1-8*--t*t*t*t),"easeInQuint"===e&&(n=t*t*t*t*t),"easeOutQuint"===e&&(n=1+--t*t*t*t*t),"easeInOutQuint"===e&&(n=t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t),n||t},g=function(e,t,n){var o=0;if(e.offsetParent)do o+=e.offsetTop,e=e.offsetParent;while(e);return o=Math.max(o-t-n,0),Math.min(o,v()-b())},b=function(){return Math.max(document.documentElement.clientHeight,e.innerHeight||0)},v=function(){return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)},y=function(e){return e&&"object"==typeof JSON&&"function"==typeof JSON.parse?JSON.parse(e):{}},O=function(e){return e?f(e)+e.offsetTop:0},S=function(t,n,o){o||(t.focus(),document.activeElement.id!==t.id&&(t.setAttribute("tabindex","-1"),t.focus(),t.style.outline="none"),e.scrollTo(0,n))};i.animateScroll=function(n,o,c){var i=y(o?o.getAttribute("data-options"):null),u=d(t||s,c||{},i),f="[object Number]"===Object.prototype.toString.call(n),h=f||!n.tagName?null:n;if(f||h){var m=e.pageYOffset;u.selectorHeader&&!r&&(r=document.querySelector(u.selectorHeader)),a||(a=O(r));var b,E,I=f?n:g(h,a,parseInt(u.offset,10)),H=I-m,A=v(),j=0,C=function(t,r,a){var c=e.pageYOffset;(t==r||c==r||e.innerHeight+c>=A)&&(clearInterval(a),S(n,r,f),u.callback(n,o))},M=function(){j+=16,b=j/parseInt(u.speed,10),b=b>1?1:b,E=m+H*p(u.easing,b),e.scrollTo(0,Math.floor(E)),C(E,I,l)},w=function(){clearInterval(l),l=setInterval(M,16)};0===e.pageYOffset&&e.scrollTo(0,0),w()}};var E=function(t){var r;try{r=m(decodeURIComponent(e.location.hash))}catch(t){r=m(e.location.hash)}n&&(n.id=n.getAttribute("data-scroll-id"),i.animateScroll(n,o),n=null,o=null)},I=function(r){if(0===r.button&&!r.metaKey&&!r.ctrlKey&&(o=h(r.target,t.selector),o&&"a"===o.tagName.toLowerCase()&&o.hostname===e.location.hostname&&o.pathname===e.location.pathname&&/#/.test(o.href))){var a;try{a=m(decodeURIComponent(o.hash))}catch(e){a=m(o.hash)}if("#"===a){r.preventDefault(),n=document.body;var c=n.id?n.id:"smooth-scroll-top";return n.setAttribute("data-scroll-id",c),n.id="",void(e.location.hash.substring(1)===c?E():e.location.hash=c)}n=document.querySelector(a),n&&(n.setAttribute("data-scroll-id",n.id),n.id="",o.hash===e.location.hash&&(r.preventDefault(),E()))}},H=function(e){c||(c=setTimeout((function(){c=null,a=O(r)}),66))};return i.destroy=function(){t&&(document.removeEventListener("click",I,!1),e.removeEventListener("resize",H,!1),t=null,n=null,o=null,r=null,a=null,c=null,l=null)},i.init=function(n){u&&(i.destroy(),t=d(s,n||{}),r=t.selectorHeader?document.querySelector(t.selectorHeader):null,a=O(r),document.addEventListener("click",I,!1),e.addEventListener("hashchange",E,!1),r&&e.addEventListener("resize",H,!1))},i}));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/Felipe/Sites/base/node_modules/tap-listener/tap-listener.js":[function(require,module,exports){
/*!
 * Tap listener v2.0.0
 * listens to taps
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false*/ /*globals define, module, require */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'unipointer/unipointer'
    ], function( Unipointer ) {
      return factory( window, Unipointer );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('unipointer')
    );
  } else {
    // browser global
    window.TapListener = factory(
      window,
      window.Unipointer
    );
  }

}( window, function factory( window, Unipointer ) {

'use strict';

// --------------------------  TapListener -------------------------- //

function TapListener( elem ) {
  this.bindTap( elem );
}

// inherit Unipointer & EventEmitter
var proto = TapListener.prototype = Object.create( Unipointer.prototype );

/**
 * bind tap event to element
 * @param {Element} elem
 */
proto.bindTap = function( elem ) {
  if ( !elem ) {
    return;
  }
  this.unbindTap();
  this.tapElement = elem;
  this._bindStartEvent( elem, true );
};

proto.unbindTap = function() {
  if ( !this.tapElement ) {
    return;
  }
  this._bindStartEvent( this.tapElement, true );
  delete this.tapElement;
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerUp = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  var pointerPoint = Unipointer.getPointerPoint( pointer );
  var boundingRect = this.tapElement.getBoundingClientRect();
  var scrollX = window.pageXOffset;
  var scrollY = window.pageYOffset;
  // calculate if pointer is inside tapElement
  var isInside = pointerPoint.x >= boundingRect.left + scrollX &&
    pointerPoint.x <= boundingRect.right + scrollX &&
    pointerPoint.y >= boundingRect.top + scrollY &&
    pointerPoint.y <= boundingRect.bottom + scrollY;
  // trigger callback if pointer is inside element
  if ( isInside ) {
    this.emitEvent( 'tap', [ event, pointer ] );
  }

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    // reset flag after 300ms
    var _this = this;
    setTimeout( function() {
      delete _this.isIgnoringMouseUp;
    }, 400 );
  }
};

proto.destroy = function() {
  this.pointerDone();
  this.unbindTap();
};

// -----  ----- //

return TapListener;

}));

},{"unipointer":"/Users/Felipe/Sites/base/node_modules/unipointer/unipointer.js"}],"/Users/Felipe/Sites/base/node_modules/unidragger/unidragger.js":[function(require,module,exports){
/*!
 * Unidragger v2.1.0
 * Draggable base class
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'unipointer/unipointer'
    ], function( Unipointer ) {
      return factory( window, Unipointer );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('unipointer')
    );
  } else {
    // browser global
    window.Unidragger = factory(
      window,
      window.Unipointer
    );
  }

}( window, function factory( window, Unipointer ) {

'use strict';

// -----  ----- //

function noop() {}

// -------------------------- Unidragger -------------------------- //

function Unidragger() {}

// inherit Unipointer & EvEmitter
var proto = Unidragger.prototype = Object.create( Unipointer.prototype );

// ----- bind start ----- //

proto.bindHandles = function() {
  this._bindHandles( true );
};

proto.unbindHandles = function() {
  this._bindHandles( false );
};

var navigator = window.navigator;
/**
 * works as unbinder, as you can .bindHandles( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
proto._bindHandles = function( isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  // extra bind logic
  var binderExtra;
  if ( navigator.pointerEnabled ) {
    binderExtra = function( handle ) {
      // disable scrolling on the element
      handle.style.touchAction = isBind ? 'none' : '';
    };
  } else if ( navigator.msPointerEnabled ) {
    binderExtra = function( handle ) {
      // disable scrolling on the element
      handle.style.msTouchAction = isBind ? 'none' : '';
    };
  } else {
    binderExtra = noop;
  }
  // bind each handle
  var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
  for ( var i=0; i < this.handles.length; i++ ) {
    var handle = this.handles[i];
    this._bindStartEvent( handle, isBind );
    binderExtra( handle );
    handle[ bindMethod ]( 'click', this );
  }
};

// ----- start event ----- //

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerDown = function( event, pointer ) {
  // dismiss range sliders
  if ( event.target.nodeName == 'INPUT' && event.target.type == 'range' ) {
    // reset pointerDown logic
    this.isPointerDown = false;
    delete this.pointerIdentifier;
    return;
  }

  this._dragPointerDown( event, pointer );
  // kludge to blur focused inputs in dragger
  var focused = document.activeElement;
  if ( focused && focused.blur ) {
    focused.blur();
  }
  // bind move and end events
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// base pointer down logic
proto._dragPointerDown = function( event, pointer ) {
  // track to see when dragging starts
  this.pointerDownPoint = Unipointer.getPointerPoint( pointer );

  var canPreventDefault = this.canPreventDefaultOnPointerDown( event, pointer );
  if ( canPreventDefault ) {
    event.preventDefault();
  }
};

// overwriteable method so Flickity can prevent for scrolling
proto.canPreventDefaultOnPointerDown = function( event ) {
  // prevent default, unless touchstart or <select>
  return event.target.nodeName != 'SELECT';
};

// ----- move event ----- //

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

// base pointer move logic
proto._dragPointerMove = function( event, pointer ) {
  var movePoint = Unipointer.getPointerPoint( pointer );
  var moveVector = {
    x: movePoint.x - this.pointerDownPoint.x,
    y: movePoint.y - this.pointerDownPoint.y
  };
  // start drag if pointer has moved far enough to start drag
  if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
    this._dragStart( event, pointer );
  }
  return moveVector;
};

// condition if pointer has moved far enough to start drag
proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
};


// ----- end event ----- //

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
  this._dragPointerUp( event, pointer );
};

proto._dragPointerUp = function( event, pointer ) {
  if ( this.isDragging ) {
    this._dragEnd( event, pointer );
  } else {
    // pointer didn't move enough for drag to start
    this._staticClick( event, pointer );
  }
};

// -------------------------- drag -------------------------- //

// dragStart
proto._dragStart = function( event, pointer ) {
  this.isDragging = true;
  this.dragStartPoint = Unipointer.getPointerPoint( pointer );
  // prevent clicks
  this.isPreventingClicks = true;

  this.dragStart( event, pointer );
};

proto.dragStart = function( event, pointer ) {
  this.emitEvent( 'dragStart', [ event, pointer ] );
};

// dragMove
proto._dragMove = function( event, pointer, moveVector ) {
  // do not drag if not dragging yet
  if ( !this.isDragging ) {
    return;
  }

  this.dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  event.preventDefault();
  this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
};

// dragEnd
proto._dragEnd = function( event, pointer ) {
  // set flags
  this.isDragging = false;
  // re-enable clicking async
  setTimeout( function() {
    delete this.isPreventingClicks;
  }.bind( this ) );

  this.dragEnd( event, pointer );
};

proto.dragEnd = function( event, pointer ) {
  this.emitEvent( 'dragEnd', [ event, pointer ] );
};

// ----- onclick ----- //

// handle all clicks and prevent clicks when dragging
proto.onclick = function( event ) {
  if ( this.isPreventingClicks ) {
    event.preventDefault();
  }
};

// ----- staticClick ----- //

// triggered after pointer down & up with no/tiny movement
proto._staticClick = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  // allow click in <input>s and <textarea>s
  var nodeName = event.target.nodeName;
  if ( nodeName == 'INPUT' || nodeName == 'TEXTAREA' ) {
    event.target.focus();
  }
  this.staticClick( event, pointer );

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    // reset flag after 300ms
    setTimeout( function() {
      delete this.isIgnoringMouseUp;
    }.bind( this ), 400 );
  }
};

proto.staticClick = function( event, pointer ) {
  this.emitEvent( 'staticClick', [ event, pointer ] );
};

// ----- utils ----- //

Unidragger.getPointerPoint = Unipointer.getPointerPoint;

// -----  ----- //

return Unidragger;

}));

},{"unipointer":"/Users/Felipe/Sites/base/node_modules/unipointer/unipointer.js"}],"/Users/Felipe/Sites/base/node_modules/unipointer/unipointer.js":[function(require,module,exports){
/*!
 * Unipointer v2.1.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*global define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter'
    ], function( EvEmitter ) {
      return factory( window, EvEmitter );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter')
    );
  } else {
    // browser global
    window.Unipointer = factory(
      window,
      window.EvEmitter
    );
  }

}( window, function factory( window, EvEmitter ) {

'use strict';

function noop() {}

function Unipointer() {}

// inherit EvEmitter
var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

proto.bindStartEvent = function( elem ) {
  this._bindStartEvent( elem, true );
};

proto.unbindStartEvent = function( elem ) {
  this._bindStartEvent( elem, false );
};

/**
 * works as unbinder, as you can ._bindStart( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
proto._bindStartEvent = function( elem, isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  var bindMethod = isBind ? 'addEventListener' : 'removeEventListener';

  if ( window.navigator.pointerEnabled ) {
    // W3C Pointer Events, IE11. See https://coderwall.com/p/mfreca
    elem[ bindMethod ]( 'pointerdown', this );
  } else if ( window.navigator.msPointerEnabled ) {
    // IE10 Pointer Events
    elem[ bindMethod ]( 'MSPointerDown', this );
  } else {
    // listen for both, for devices like Chrome Pixel
    elem[ bindMethod ]( 'mousedown', this );
    elem[ bindMethod ]( 'touchstart', this );
  }
};

// trigger handler methods for events
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// returns the touch that we're keeping track of
proto.getTouch = function( touches ) {
  for ( var i=0; i < touches.length; i++ ) {
    var touch = touches[i];
    if ( touch.identifier == this.pointerIdentifier ) {
      return touch;
    }
  }
};

// ----- start event ----- //

proto.onmousedown = function( event ) {
  // dismiss clicks from right or middle buttons
  var button = event.button;
  if ( button && ( button !== 0 && button !== 1 ) ) {
    return;
  }
  this._pointerDown( event, event );
};

proto.ontouchstart = function( event ) {
  this._pointerDown( event, event.changedTouches[0] );
};

proto.onMSPointerDown =
proto.onpointerdown = function( event ) {
  this._pointerDown( event, event );
};

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto._pointerDown = function( event, pointer ) {
  // dismiss other pointers
  if ( this.isPointerDown ) {
    return;
  }

  this.isPointerDown = true;
  // save pointer identifier to match up touch events
  this.pointerIdentifier = pointer.pointerId !== undefined ?
    // pointerId for pointer events, touch.indentifier for touch events
    pointer.pointerId : pointer.identifier;

  this.pointerDown( event, pointer );
};

proto.pointerDown = function( event, pointer ) {
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// hash of events to be bound after start event
var postStartEvents = {
  mousedown: [ 'mousemove', 'mouseup' ],
  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
  MSPointerDown: [ 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel' ]
};

proto._bindPostStartEvents = function( event ) {
  if ( !event ) {
    return;
  }
  // get proper events to match start event
  var events = postStartEvents[ event.type ];
  // bind events to node
  events.forEach( function( eventName ) {
    window.addEventListener( eventName, this );
  }, this );
  // save these arguments
  this._boundPointerEvents = events;
};

proto._unbindPostStartEvents = function() {
  // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
  if ( !this._boundPointerEvents ) {
    return;
  }
  this._boundPointerEvents.forEach( function( eventName ) {
    window.removeEventListener( eventName, this );
  }, this );

  delete this._boundPointerEvents;
};

// ----- move event ----- //

proto.onmousemove = function( event ) {
  this._pointerMove( event, event );
};

proto.onMSPointerMove =
proto.onpointermove = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerMove( event, event );
  }
};

proto.ontouchmove = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerMove( event, touch );
  }
};

/**
 * pointer move
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerMove = function( event, pointer ) {
  this.pointerMove( event, pointer );
};

// public
proto.pointerMove = function( event, pointer ) {
  this.emitEvent( 'pointerMove', [ event, pointer ] );
};

// ----- end event ----- //


proto.onmouseup = function( event ) {
  this._pointerUp( event, event );
};

proto.onMSPointerUp =
proto.onpointerup = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerUp( event, event );
  }
};

proto.ontouchend = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerUp( event, touch );
  }
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerUp = function( event, pointer ) {
  this._pointerDone();
  this.pointerUp( event, pointer );
};

// public
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
proto._pointerDone = function() {
  // reset properties
  this.isPointerDown = false;
  delete this.pointerIdentifier;
  // remove events
  this._unbindPostStartEvents();
  this.pointerDone();
};

proto.pointerDone = noop;

// ----- pointer cancel ----- //

proto.onMSPointerCancel =
proto.onpointercancel = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerCancel( event, event );
  }
};

proto.ontouchcancel = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerCancel( event, touch );
  }
};

/**
 * pointer cancel
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerCancel = function( event, pointer ) {
  this._pointerDone();
  this.pointerCancel( event, pointer );
};

// public
proto.pointerCancel = function( event, pointer ) {
  this.emitEvent( 'pointerCancel', [ event, pointer ] );
};

// -----  ----- //

// utility function for getting x/y coords from event
Unipointer.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX,
    y: pointer.pageY
  };
};

// -----  ----- //

return Unipointer;

}));

},{"ev-emitter":"/Users/Felipe/Sites/base/node_modules/ev-emitter/ev-emitter.js"}],"/Users/Felipe/Sites/base/node_modules/viewport-units-buggyfill/viewport-units-buggyfill.js":[function(require,module,exports){
/*!
 * viewport-units-buggyfill v0.6.0
 * @web: https://github.com/rodneyrehm/viewport-units-buggyfill/
 * @author: Rodney Rehm - http://rodneyrehm.de/en/
 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.viewportUnitsBuggyfill = factory();
  }
}(this, function () {
  'use strict';
  /*global document, window, navigator, location, XMLHttpRequest, XDomainRequest, CustomEvent*/

  var initialized = false;
  var options;
  var userAgent = window.navigator.userAgent;
  var viewportUnitExpression = /([+-]?[0-9.]+)(vh|vw|vmin|vmax)/g;
  var forEach = [].forEach;
  var dimensions;
  var declarations;
  var styleNode;
  var isBuggyIE = /MSIE [0-9]\./i.test(userAgent);
  var isOldIE = /MSIE [0-8]\./i.test(userAgent);
  var isOperaMini = userAgent.indexOf('Opera Mini') > -1;

  var isMobileSafari = /(iPhone|iPod|iPad).+AppleWebKit/i.test(userAgent) && (function() {
    // Regexp for iOS-version tested against the following userAgent strings:
    // Example WebView UserAgents:
    // * iOS Chrome on iOS8: "Mozilla/5.0 (iPad; CPU OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/39.0.2171.50 Mobile/12B410 Safari/600.1.4"
    // * iOS Facebook on iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D201 [FBAN/FBIOS;FBAV/12.1.0.24.20; FBBV/3214247; FBDV/iPhone6,1;FBMD/iPhone; FBSN/iPhone OS;FBSV/7.1.1; FBSS/2; FBCR/AT&T;FBID/phone;FBLC/en_US;FBOP/5]"
    // Example Safari UserAgents:
    // * Safari iOS8: "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4"
    // * Safari iOS7: "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A4449d Safari/9537.53"
    var iOSversion = userAgent.match(/OS (\d)/);
    // viewport units work fine in mobile Safari and webView on iOS 8+
    return iOSversion && iOSversion.length>1 && parseInt(iOSversion[1]) < 10;
  })();

  var isBadStockAndroid = (function() {
    // Android stock browser test derived from
    // http://stackoverflow.com/questions/24926221/distinguish-android-chrome-from-stock-browser-stock-browsers-user-agent-contai
    var isAndroid = userAgent.indexOf(' Android ') > -1;
    if (!isAndroid) {
      return false;
    }

    var isStockAndroid = userAgent.indexOf('Version/') > -1;
    if (!isStockAndroid) {
      return false;
    }

    var versionNumber = parseFloat((userAgent.match('Android ([0-9.]+)') || [])[1]);
    // anything below 4.4 uses WebKit without *any* viewport support,
    // 4.4 has issues with viewport units within calc()
    return versionNumber <= 4.4;
  })();

  // added check for IE10, IE11 and Edge < 20, since it *still* doesn't understand vmax
  // http://caniuse.com/#feat=viewport-units
  if (!isBuggyIE) {
    isBuggyIE = !!navigator.userAgent.match(/Trident.*rv[ :]*1[01]\.| Edge\/1\d\./);
  }

  // Polyfill for creating CustomEvents on IE9/10/11
  // from https://github.com/krambuhl/custom-event-polyfill
  try {
    new CustomEvent('test');
  } catch(e) {
    var CustomEvent = function(event, params) {
      var evt;
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
  }

  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var callback = function() {
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  }

  // from http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function initialize(initOptions) {
    if (initialized) {
      return;
    }

    if (initOptions === true) {
      initOptions = {
        force: true
      };
    }

    options = initOptions || {};
    options.isMobileSafari = isMobileSafari;
    options.isBadStockAndroid = isBadStockAndroid;

    if (options.ignoreVmax && !options.force && !isOldIE) {
      // modern IE (10 and up) do not support vmin/vmax,
      // but chances are this unit is not even used, so
      // allow overwriting the "hacktivation"
      // https://github.com/rodneyrehm/viewport-units-buggyfill/issues/56
      isBuggyIE = false;
    }

    if (isOldIE || (!options.force && !isMobileSafari && !isBuggyIE && !isBadStockAndroid && !isOperaMini && (!options.hacks || !options.hacks.required(options)))) {
      // this buggyfill only applies to mobile safari, IE9-10 and the Stock Android Browser.
      if (window.console && isOldIE) {
        console.info('viewport-units-buggyfill requires a proper CSSOM and basic viewport unit support, which are not available in IE8 and below');
      }

      return {
        init: function () {}
      };
    }

    // fire a custom event that buggyfill was initialize
    window.dispatchEvent(new CustomEvent('viewport-units-buggyfill-init'));

    options.hacks && options.hacks.initialize(options);

    initialized = true;
    styleNode = document.createElement('style');
    styleNode.id = 'patched-viewport';
    document.head.appendChild(styleNode);

    // Issue #6: Cross Origin Stylesheets are not accessible through CSSOM,
    // therefore download and inject them as <style> to circumvent SOP.
    importCrossOriginLinks(function() {
      var _refresh = debounce(refresh, options.refreshDebounceWait || 100);
      // doing a full refresh rather than updateStyles because an orientationchange
      // could activate different stylesheets
      window.addEventListener('orientationchange', _refresh, true);
      // orientationchange might have happened while in a different window
      window.addEventListener('pageshow', _refresh, true);

      if (options.force || isBuggyIE || inIframe()) {
        window.addEventListener('resize', _refresh, true);
        options._listeningToResize = true;
      }

      options.hacks && options.hacks.initializeEvents(options, refresh, _refresh);

      refresh();
    });
  }

  function updateStyles() {
    styleNode.textContent = getReplacedViewportUnits();
    // move to the end in case inline <style>s were added dynamically
    styleNode.parentNode.appendChild(styleNode);
    // fire a custom event that styles were updated
    window.dispatchEvent(new CustomEvent('viewport-units-buggyfill-style'));
  }

  function refresh() {
    if (!initialized) {
      return;
    }

    findProperties();

    // iOS Safari will report window.innerWidth and .innerHeight as 0 unless a timeout is used here.
    // TODO: figure out WHY innerWidth === 0
    setTimeout(function() {
      updateStyles();
    }, 1);
  }
  
  // http://stackoverflow.com/a/23613052
  function processStylesheet(ss) {
    // cssRules respects same-origin policy, as per
    // https://code.google.com/p/chromium/issues/detail?id=49001#c10.
    try {
      if (!ss.cssRules) { return; }
    } catch(e) {
      if (e.name !== 'SecurityError') { throw e; }
      return;
    }
    // ss.cssRules is available, so proceed with desired operations.
    var rules = [];
    for (var i = 0; i < ss.cssRules.length; i++) {
      var rule = ss.cssRules[i];
      rules.push(rule);
    }
    return rules;
  }

  function findProperties() {
    declarations = [];
    forEach.call(document.styleSheets, function(sheet) {
      var cssRules = processStylesheet(sheet);

      if (!cssRules || sheet.ownerNode.id === 'patched-viewport' || sheet.ownerNode.getAttribute('data-viewport-units-buggyfill') === 'ignore') {
        // skip entire sheet because no rules are present, it's supposed to be ignored or it's the target-element of the buggyfill
        return;
      }

      if (sheet.media && sheet.media.mediaText && window.matchMedia && !window.matchMedia(sheet.media.mediaText).matches) {
        // skip entire sheet because media attribute doesn't match
        return;
      }

      forEach.call(cssRules, findDeclarations);
    });

    return declarations;
  }

  function findDeclarations(rule) {
    if (rule.type === 7) {
      var value;

      // there may be a case where accessing cssText throws an error.
      // I could not reproduce this issue, but the worst that can happen
      // this way is an animation not running properly.
      // not awesome, but probably better than a script error
      // see https://github.com/rodneyrehm/viewport-units-buggyfill/issues/21
      try {
        value = rule.cssText;
      } catch(e) {
        return;
      }

      viewportUnitExpression.lastIndex = 0;
      if (viewportUnitExpression.test(value)) {
        // KeyframesRule does not have a CSS-PropertyName
        declarations.push([rule, null, value]);
        options.hacks && options.hacks.findDeclarations(declarations, rule, null, value);
      }

      return;
    }

    if (!rule.style) {
      if (!rule.cssRules) {
        return;
      }

      forEach.call(rule.cssRules, function(_rule) {
        findDeclarations(_rule);
      });

      return;
    }

    forEach.call(rule.style, function(name) {
      var value = rule.style.getPropertyValue(name);
      // preserve those !important rules
      if (rule.style.getPropertyPriority(name)) {
        value += ' !important';
      }

      viewportUnitExpression.lastIndex = 0;
      if (viewportUnitExpression.test(value)) {
        declarations.push([rule, name, value]);
        options.hacks && options.hacks.findDeclarations(declarations, rule, name, value);
      }
    });
  }

  function getReplacedViewportUnits() {
    dimensions = getViewport();

    var css = [];
    var buffer = [];
    var open;
    var close;

    declarations.forEach(function(item) {
      var _item = overwriteDeclaration.apply(null, item);
      var _open = _item.selector.length ? (_item.selector.join(' {\n') + ' {\n') : '';
      var _close = new Array(_item.selector.length + 1).join('\n}');

      if (!_open || _open !== open) {
        if (buffer.length) {
          css.push(open + buffer.join('\n') + close);
          buffer.length = 0;
        }

        if (_open) {
          open = _open;
          close = _close;
          buffer.push(_item.content);
        } else {
          css.push(_item.content);
          open = null;
          close = null;
        }

        return;
      }

      if (_open && !open) {
        open = _open;
        close = _close;
      }

      buffer.push(_item.content);
    });

    if (buffer.length) {
      css.push(open + buffer.join('\n') + close);
    }

    // Opera Mini messes up on the content hack (it replaces the DOM node's innerHTML with the value).
    // This fixes it. We test for Opera Mini only since it is the most expensive CSS selector
    // see https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors
    if (isOperaMini) {
      css.push('* { content: normal !important; }');
    }

    return css.join('\n\n');
  }

  function overwriteDeclaration(rule, name, value) {
    var _value;
    var _selectors = [];

    _value = value.replace(viewportUnitExpression, replaceValues);

    if (options.hacks) {
      _value = options.hacks.overwriteDeclaration(rule, name, _value);
    }

    if (name) {
      // skipping KeyframesRule
      _selectors.push(rule.selectorText);
      _value = name + ': ' + _value + ';';
    }

    var _rule = rule.parentRule;
    while (_rule) {
      _selectors.unshift('@media ' + _rule.media.mediaText);
      _rule = _rule.parentRule;
    }

    return {
      selector: _selectors,
      content: _value
    };
  }

  function replaceValues(match, number, unit) {
    var _base = dimensions[unit];
    var _number = parseFloat(number) / 100;
    return (_number * _base) + 'px';
  }

  function getViewport() {
    var vh = window.innerHeight;
    var vw = window.innerWidth;

    return {
      vh: vh,
      vw: vw,
      vmax: Math.max(vw, vh),
      vmin: Math.min(vw, vh)
    };
  }

  function importCrossOriginLinks(next) {
    var _waiting = 0;
    var decrease = function() {
      _waiting--;
      if (!_waiting) {
        next();
      }
    };

    forEach.call(document.styleSheets, function(sheet) {
      if (!sheet.href || origin(sheet.href) === origin(location.href) || sheet.ownerNode.getAttribute('data-viewport-units-buggyfill') === 'ignore') {
        // skip <style> and <link> from same origin or explicitly declared to ignore
        return;
      }

      _waiting++;
      convertLinkToStyle(sheet.ownerNode, decrease);
    });

    if (!_waiting) {
      next();
    }
  }

  function origin(url) {
    return url.slice(0, url.indexOf('/', url.indexOf('://') + 3));
  }

  function convertLinkToStyle(link, next) {
    getCors(link.href, function() {
      var style = document.createElement('style');
      style.media = link.media;
      style.setAttribute('data-href', link.href);
      style.textContent = this.responseText;
      link.parentNode.replaceChild(style, link);
      next();
    }, next);
  }

  function getCors(url, success, error) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open('GET', url, true);
    } else if (typeof XDomainRequest !== 'undefined') {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open('GET', url);
    } else {
      throw new Error('cross-domain XHR not supported');
    }

    xhr.onload = success;
    xhr.onerror = error;
    xhr.send();
    return xhr;
  }

  return {
    version: '0.6.0',
    findProperties: findProperties,
    getCss: getReplacedViewportUnits,
    init: initialize,
    refresh: refresh
  };

}));

},{}],"/Users/Felipe/Sites/base/node_modules/whatwg-fetch/fetch.js":[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *
 * Event Bus
 *
 * Pub/Sub system for custom event communication between modules.
 *
 * Exports a single EventBus instance, as well as a factory function 
 * for implementing pub/sub functionality into individual objects
 *
 */

function factory() {

  var topics = {};

  var EventBus = {

    /**
     *
     * Subscribe to topic, passing a callback function
     *
     * @param {string} topic - event name to subscribe to. You can subscribe to multiple custom events at once by entering the event names separated by a space.
     * eg: 'event1 event2 ...'
     * @param {function} listener - Callback function when event gets published
     *
     * @returns {object} Cancellable subscription object.
     *
     * 
     */

    subscribe: function subscribe(topic, listener) {

      topic = topic.split(' ');

      // Create object to hold topics and their indexes
      var current = {};

      topic.map(function (item) {
        // Create the topic's object if not yet created
        if (!topics.hasOwnProperty(item)) {
          topics[item] = [];
        }

        // Add the listener to queue
        var index = topics[item].push(listener) - 1;

        current[item] = index;
      });

      // Provide handle back for removal of topic
      return {
        remove: function remove() {
          // Go through current list and get their indexes to delete
          for (var item in current) {
            delete topics[item][current[item]];
          }
        }
      };
    },


    /**
     *
     * Trigger event
     *
     * @param {string} topic - event name to publish
     * @param {...*} args - Any number of custom data to be passed to the callback
     * 
     */

    publish: function publish(topic) {
      var _arguments = arguments;


      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!topics.hasOwnProperty(topic)) {
        return;
      }

      topics[topic].forEach(function (item) {
        item.apply(null, Array.prototype.slice.call(_arguments, 1));
      });
    }
  };

  return EventBus;
}

var eventBusFactory = exports.eventBusFactory = factory;

exports.default = factory();

},{}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/ajaxLoader.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLoader;

var _EventBus = require('./EventBus');

var _utils = require('./utils');

var _load = require('./load');

var LOADING_CLASS = 'is-loading';

/**
 *
 * Filter the items found from the XHR request,
 * removing the ones with a `data-post-id` already pushed to the
 * `loadedItems` array
 *
 * @returns {boolean} Whether the item was found in the passed array or not
 *
 */

/**
 *
 * Load More
 *
 * Handles loading more posts at the end of a list of posts
 * 
 */

function filterLoaded(itemId, loadedItems) {
  var alreadyLoaded = (0, _utils.inArray)(itemId, loadedItems);
  loadedItems.push(itemId);
  return !alreadyLoaded;
}

var defaults = {
  loadMore: null
};

/**
 * 
 * Bind DOM and custom loader events to the loadMore button, triggering loading the next set of posts on click
 * and setting it's loading/disabled states depending on the events that the loader fires. 
 *
 * @param {object} loader instance from `createLoader`
 * @param {HTMLElement} button Load more button passed into the `createLoader` instance
 * @return {null}
 * 
 */

function initLoadMoreButton(loader, button) {

  loader.subscribe('ajax-loader:next-requested', function () {
    return button.classList.add(LOADING_CLASS);
  });
  loader.subscribe('ajax-loader:next-fetched', function () {
    return button.classList.remove(LOADING_CLASS);
  });
  loader.subscribe('ajax-loader:next-page-length', function (l) {
    button.disabled = l ? false : true;
  });

  button.addEventListener('click', loader.next);
}

/**
 *
 * Create a loader instance
 *
 * @important Your `selector` elements should have a `data-post-id` attribute, with it's corresponding 
 * post id. The script uses this to filter out any sticky posts that may have already been loaded 
 * 
 * @events 'ajax-loader:finished', 'ajax-loader:next-fetched', 'ajax-loader:loaded' 
 * @param {string} selector The selector to be used to extract the desired listing
 *                          items from the XHR response
 * @param {object} config Configuration object for the loader instance
 * @param {HTMLElement} config.loadButton - Button element that will trigger loading the next set of posts, by passing it
 * to the config it will get the click DOM listener bound to load the next set, as well as receive the loading and disabled states accordingly.
 * 
 * @returns {object} Controller object to request the next set of posts or set the the active query
 *
 */

function createLoader(selector, config) {

  // Following WP structure for paged lists
  // Note: If working with a localhost:3000 server,
  // location.origin will return undefined when accessing via
  // the external IP (192.136.....)
  var _window$location = window.location,
      pathname = _window$location.pathname,
      search = _window$location.search;

  var buffer = (0, _utils.createElement)('div'); // Buffer for temporarily storing returned HTML
  var options = Object.assign({}, defaults, config);

  var loading = false;
  var finished = false;

  var currentPage = 1;
  var loadedItems = (0, _utils.collection)(selector).map(function (item) {
    return item.dataset.postId;
  });

  var params = (0, _utils.extractURLParameters)();

  var url = function url(page) {
    params.paged = page;
    return pathname + '?' + (0, _utils.serializeObject)(params);
  };

  var setUrlState = function setUrlState() {

    var stateParams = Object.assign({}, params);
    delete stateParams['paged'];
    var serializedParams = (0, _utils.serializeObject)(stateParams);
    var nextState = serializedParams.length ? pathname + '?' + serializedParams : pathname;

    window.history.pushState({}, null, nextState);
  };

  var publishFinished = function publishFinished() {
    finished = true;
    instance.publish('ajax-loader:finished');
  };

  /**
   *
   * Check if there is a next page to be loaded.
   *
   * Doesn't update the currentpage counter
   *
   * @fires `ajax-loader:next-requested` when the next page is requested
   * @fires `ajax-loader:finished` when there's no next page to load
   * @fires 'ajax-loader:next-fetched' when the request for the next page is finished
   * 
   * This will also cause caching of the next response, making the 'Load More' button
   * load virtually instantly when clicked
   * 
  */
  var checkIfNext = function checkIfNext() {

    var nextPage = url(currentPage + 1);

    instance.publish('ajax-loader:next-requested');

    (0, _load.loadOnce)(nextPage).catch(publishFinished).then(function (res) {

      instance.publish('ajax-loader:next-fetched');

      buffer.innerHTML = res;

      var results = (0, _utils.collection)(buffer.querySelectorAll(selector))
      // Remove WP 'Sticky' posts from subsequent pages
      .filter(function (item) {
        return filterLoaded(item.dataset.postId, [].concat(loadedItems));
      });

      instance.publish('ajax-loader:next-page-length', results.length);

      if (results.length == 0) {
        publishFinished();
      }
    });
  };

  /**
   *
   * Load the next set of posts
   *
   * @fires `ajax-loader:loaded` - 'Loaded' event with the resulting posts
   * as the subscribe callback parameter
   *
   */

  var next = function next() {
    var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


    if (loading || finished) {
      return;
    }

    loading = true;

    var nextUrl = url(++currentPage);

    setUrlState();

    // increment 'currentPage' and request it
    (0, _load.loadOnce)(nextUrl).then(function (res) {

      buffer.innerHTML = res;

      var results = (0, _utils.collection)(buffer.querySelectorAll(selector))
      // Remove WP 'Sticky' posts from subsequent pages
      .filter(function (item) {
        return filterLoaded(item.dataset.postId, loadedItems);
      });

      if (results.length) {
        instance.publish('ajax-loader:loaded', results, currentPage);
      }

      if (query && !results.length) {
        instance.publish('ajax-loader:no-results', query);
      }

      loading = false;
    });

    checkIfNext();
  };

  var setQuery = function setQuery(key, value) {
    currentPage = 0;
    loadedItems = [];
    finished = false;

    if (loading) {
      return;
    }

    // do nothing if the query made is the same as the current one
    if (params[key] == value || !value && !params[key]) {
      return;
    }

    if (!value) {
      delete params[key];
    } else {
      params[key] = value;
    }

    instance.publish('ajax-loader:query-set');

    next(params);
  };

  var getQuery = function getQuery() {
    return params;
  };

  var instance = Object.assign({}, {
    next: next,
    setQuery: setQuery,
    getQuery: getQuery
  }, (0, _EventBus.eventBusFactory)());

  // Bind load more button events
  if (options.loadButton) {
    initLoadMoreButton(instance, options.loadButton);
  }

  // Do the initial check to see if there is a page #2
  checkIfNext();

  return instance;
}

},{"./EventBus":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js","./load":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/load.js","./utils":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/form.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customFileUpload = customFileUpload;
exports.ajaxSubmitGforms = ajaxSubmitGforms;
exports.newsletterMoveSubmit = newsletterMoveSubmit;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = false;

// Very Important
// Must ensure we are using the same jquery instance as Gforms
/**
 *
 * Forms
 *
 * Form presentational and behavioural scripts
 *
 * Uses global jQuery reference exposed by forms plugin
 *
 */

if (window.jQuery) {
  $ = window.jQuery;
}

var fileUploadLabelAttr = 'data-label-text';

function fileUploadOnChange(e, defaultLabel) {

  var $customLabel = $(e.currentTarget).parent().find('[' + fileUploadLabelAttr + ']');
  var val = e.currentTarget.value.replace('C:\\fakepath\\', '');

  $customLabel.text(val || defaultLabel);
}

/**
 *
 * Custom Mask for File Upload Inputs
 *
 */

function customFileUpload(input) {
  var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Choose file';


  if (!$) {
    return;
  }

  var $input = $(input);
  var $customLabel = $('<span ' + fileUploadLabelAttr + '>' + label + '</span>');

  $input.on('change', function (e) {
    return fileUploadOnChange(e, label);
  });

  $input.wrapAll('\n    <label for="' + input.id + '">\n    </label>\n  ').parent().prepend($customLabel);

  return {
    setLabelText: function setLabelText(label) {
      $customLabel.text(label);
      return this;
    },
    getLabelText: function getLabelText() {
      return $customLabel.text();
    }
  };
}

function getGformId(formEl) {
  return formEl.id.replace('gform_', '');
}

/**
 *
 * Submit Gravity Forms via AJAX
 *
 * In this function we also setup custom file upload inputs, see `customFileUpload`
 *
 * @param {string} selector jQuery selector for the forms to be submitted via AJAX
 *
 * @event 'form:submitting' - Fires when the user submits the form
 * @event 'form:submit-done' - Fires after Gravity Forms succesfully submits the form
 *
 */

function ajaxSubmitGforms(selector) {

  if (!$) {
    return;
  }

  $(document).on('gform_post_render', function (e, formId) {

    $('#gform_wrapper_' + formId).filter(function (i, el) {

      var hiddenIdField = el.querySelector('[name=gform_submit]');

      /**
       *
       * If using the 'Multiple Form Instance' plugin for Gforms,
       * it changes the DOM form ID's
       *
       * The caveat is that the initial 'gform_post_render' will
       * return a 'formId' equal to the actual form ID (usually a low digit
       * like 1, 2, 3), whereas subsequent `gform_post_render` (eg: after an ajax submit), return
       * the ID set by the 'Multiple Form Instance' plugin (which looks more like a large random
       * number, eg: 2108960147)
       *
       */

      // Check if the 'formID' matched the ID on the DOM element (used after an ajax submission)
      if (getGformId(el) == formId) {
        return el;
      }
      // otherwise, check agains the hidden field containing the actual form ID (used on initial render)
      else if (hiddenIdField && hiddenIdField.value == formId) {
          return el;
        }
    }).each(function (i, form) {

      var $form = $(form);
      var $wrapper = $form.closest('.gform_wrapper');

      $wrapper.removeClass('is-submitting');

      $form.find('[type=file]').each(function (i, input) {
        customFileUpload(input);
      });
    });
  });

  $(document).on('gform_confirmation_loaded', function (e, formId) {
    var $wrapper = $('#gform_wrapper_' + formId);
    $wrapper.removeClass('is-submitting');

    _EventBus2.default.publish('form:submit-done', $wrapper);
  });

  $(document).on('submit', selector, function (e) {

    var form = e.currentTarget;
    var formId = getGformId(form);
    var $wrapper = $('#gform_wrapper_' + formId);
    $wrapper.addClass('is-submitting');

    _EventBus2.default.publish('form:submitting', $wrapper);
  });
}

/**
 *
 * Reposition the form submit button, so that it's easier
 * to align with the the input field
 *
 */

function newsletterMoveSubmit(form) {
  if (!$) {
    return;
  }

  var $form = $(form);
  $form.find('[type=submit]').appendTo($form.find('.gform_body'));
}

},{"./EventBus":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/globalEvents.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.windowLoaded = exports.windowScrolled = exports.windowResized = exports.keyDownEscape = undefined;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Global DOM Event Listeners, to be used in conjunction with the `EventBus`
 *
 * Use this module for listeners on elements that will always be present, eg: window, document, body.
 *
 * For more specific event listeners, you can just add them on public.js
 *
 */

var keyDownEscape = exports.keyDownEscape = 'keydown:escape';
var windowResized = exports.windowResized = 'window:resized';
var windowScrolled = exports.windowScrolled = 'window:scrolled';
var windowLoaded = exports.windowLoaded = 'window:loaded';

window.addEventListener('keydown', function (e) {
  switch (e.keyCode) {
    case 27:
      _EventBus2.default.publish(keyDownEscape);
      break;
    default:
      break;
  }
});

window.addEventListener('resize', (0, _utils.debounce)(function () {
  _EventBus2.default.publish(windowResized);
}, 100));

window.addEventListener('scroll', function () {
  _EventBus2.default.publish(windowScrolled);
});

window.addEventListener('load', function () {
  _EventBus2.default.publish(windowLoaded);
});

},{"./EventBus":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js","./utils":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/load.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadScriptOnce = loadScriptOnce;
exports.loadOnce = loadOnce;
/**
 *
 * Load
 *
 * Requires the fetch API to be available
 * 
 */

/**
 *
 * Cache of promises of requested objects
 * 
 */

var requestedURLs = {};

/**
 *
 * Load a script only once, regardless if its requested multiple times.
 *
 * @param {string} src - Source URL
 *
 * @returns {object} promise object for that specific source
 *  
 */

function loadScriptOnce(src) {

  // Check if we've already requested this script
  if (src in requestedURLs) {

    // If so, return this script's promise
    return requestedURLs[src];
  }

  var s = document.createElement('script');

  s.type = 'text/javascript';
  s.async = true;
  s.src = src;

  var promise = new Promise(function (resolve, reject) {
    // Resolve the promise when the script has loaded.
    s.addEventListener('load', function (e) {
      resolve(e);
    }, false);
  });

  var head = document.getElementsByTagName('head')[0];
  head.appendChild(s);

  // Store the promise, for next time this `src` is requested
  requestedURLs[src] = promise;

  // Return the promise
  return requestedURLs[src];
}

/**
 *
 * Load a URL only once, regardless if its requested multiple times.
 *
 * @param {string} url - Source URL
 *
 * @returns {object} promise object for that specific source
 *  
 */

function loadOnce(url) {

  // Check if we've already requested this script
  if (url in requestedURLs) {

    // If so, return this script's promise
    return requestedURLs[url];
  }

  var promise = fetch(url)
  // res.text() can only be called once,
  // it returns another promise
  .then(function (res) {
    return res.text();
  });

  // Store the promise, for next time this `url` is requested
  requestedURLs[url] = promise;

  // Return the promise
  return requestedURLs[url];
}

},{}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/modal.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initModal = initModal;
exports.initVideoModal = initVideoModal;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _video = require('./video');

var _video2 = _interopRequireDefault(_video);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootEl = document.querySelector('html'); /**
                                              *
                                              * Modal
                                              *
                                              * Toggleable modal panels
                                              *
                                              */

var ACTIVE_CLASS = 'is-active';
var TRANS_CLASS = 'is-transiting';

// Add a global class to the root element, for styling
rootEl.className += ' modal-root';

var modalProto = {

  isOpen: false,

  /**
   *
   * Open the modal
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  open: function open() {
    var els = this.els;


    els.map(function (el) {
      return el.classList.add(ACTIVE_CLASS, TRANS_CLASS);
    });

    this.isOpen = true;
    _EventBus2.default.publish('modal:open', this);
  },


  /**
   *
   * Close the modal
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  close: function close() {
    var els = this.els;


    els.map(function (el) {
      return el.classList.add(TRANS_CLASS);
    });
    els.map(function (el) {
      return el.classList.remove(ACTIVE_CLASS);
    });

    if (!(0, _utils.whichTransitionEnd)()) {
      els.map(function (el) {
        return el.classList.remove(TRANS_CLASS);
      });
    }

    this.isOpen = false;
    _EventBus2.default.publish('modal:close', this);
  },


  /**
   *
   * Toggle the modal open/close
   *
   * @param {obj} instance - Modal instance created when calling `modal()`
   *
   */
  toggle: function toggle() {

    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
};

/**
 *
 * Instantiate the modal, adding click listeners to it's triggers,
 * as well as controls for closing it.
 *
 * @param {HTMLElement} modalEl - Modal DOM element
 * @param {object} config - Configuration object, with callbacks for the modals open/close events
 * @returns {object} instance - Modal instance
 */

function initModal(modalEl) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (!modalEl || !modalEl.nodeType) {
    console.log('You must provide a DOM element to `initModal`');
    return false;
  }

  // Find the elements that toggles this modal
  var toggleEls = (0, _utils.collection)('[data-toggle-modal="#' + modalEl.id + '"]');
  var allEls = toggleEls.concat(modalEl, rootEl);
  var closeEls = (0, _utils.collection)(modalEl.querySelectorAll('[data-close-modal]'));

  // Create the modal instance object
  var instance = Object.create(modalProto);

  Object.assign(instance, {
    modalEl: modalEl,
    els: allEls
  });

  var options = Object.assign({}, {
    onOpen: function onOpen() {},
    onClose: function onClose() {}
  }, config);

  // Listen for toggle button clicks
  toggleEls.map(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      instance.toggle();
    });
  });

  // Esc Keydown
  document.addEventListener('keydown', function (e) {
    if (e.keyCode == 27 && instance.isOpen) {
      instance.close();
    }
  });

  // Listen for click to any elements that close the modal
  if (closeEls.length) {

    closeEls.map(function (el) {
      el.addEventListener('click', function (e) {
        if ((0, _utils.selectorMatches)(e.target, '[data-close-modal]') && instance.isOpen) {
          e.preventDefault();
          instance.close();
        }
      });
    });
  }

  // Listen for transition end to remove transition class
  modalEl.addEventListener((0, _utils.whichTransitionEnd)(), function (e) {
    if (e.target == modalEl) {
      instance.els.map(function (el) {
        return el.classList.remove(TRANS_CLASS);
      });
    }
  });

  // Subscribe this modal to it's open/close events
  _EventBus2.default.subscribe('modal:open', function (openedInstance) {
    if (instance == openedInstance) {
      options.onOpen(instance);
    }
  });

  _EventBus2.default.subscribe('modal:close', function (openedInstance) {
    if (instance == openedInstance) {
      options.onClose(instance);
    }
  });

  // Move the element to the end of the document (prevent any z-index issues)
  document.body.appendChild(modalEl);

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

function initVideoModal(modalEl, playerSelector) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


  if (!modalEl || !modalEl.nodeType) {
    console.log('You must provide a DOM element to `initVideoModal`');
    return false;
  }

  var playerEl = modalEl.querySelector(playerSelector);
  var service = (0, _video2.default)(playerEl);

  // By default, make the player play when the modal opens
  // And stop when it closes
  var options = Object.assign({}, {
    onOpen: function onOpen() {
      service.play();
    },
    onClose: function onClose() {
      service.stop();
    }
  }, config);

  var instance = initModal(modalEl, options);
  instance.service = service; // Assign the video service to the modal instance

  // Expose the modal instance controller
  return instance;
}

},{"./EventBus":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js","./utils":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js","./video":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/video.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/modernizrTests.js":[function(require,module,exports){
'use strict';

var _utils = require('./utils');

function matchesIE() {
  return !!navigator.userAgent.match(/(?:ms|\()(ie)\s([\w\.]+)/i);
} /**
   *
   * Custom Modernizr Tests
   *
   */

function matchesIE11() {
  return !!navigator.userAgent.match(/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i);
}

Modernizr.addTest('ie', function () {
  return matchesIE11() || matchesIE();
});

Modernizr.addTest('ie11', matchesIE11);

Modernizr.addTest('mobile', _utils.isMobile);

},{"./utils":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/polyfills.js":[function(require,module,exports){
(function (global){
'use strict';

require('input-placeholder-polyfill');

var _viewportUnitsBuggyfill = require('viewport-units-buggyfill');

var _viewportUnitsBuggyfill2 = _interopRequireDefault(_viewportUnitsBuggyfill);

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

require('whatwg-fetch');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Required for IE

// Assign to the Object constructor
// Required for IE
// Required for older IE
if (!Object.assign) {
  Object.assign = _objectAssign2.default;
}

// Assign Promise to window, if not defined
// Required for IE & Safari
// Required for IOS devices
/**
 *
 * Polyfills
 *
 * Including this module will automatically call all specified polyfills
 * 
 */

if (!window.Promise) {
  window.Promise = _promisePolyfill2.default;
}

// Patch Buggy Viewport units on IOS devices
_viewportUnitsBuggyfill2.default.init();

/**
 *
 * Dataset Polyfill
 *
 * Element.dataset polyfill for IE10-
 *
 */

function dataset() {

  if (!('dataset' in document.createElement('span')) && 'Element' in global && Element.prototype && Object.defineProperty) {
    Object.defineProperty(Element.prototype, 'dataset', { get: function get() {
        var result = Object.create(null);

        for (var i = 0; i < this.attributes.length; ++i) {
          var attr = this.attributes[i];
          if (attr.specified && attr.name.substring(0, 5) === 'data-') {
            (function (element, name) {
              var prop = name.replace(/-([a-z])/g, function (m, p) {
                return p.toUpperCase();
              });
              result[prop] = element.getAttribute('data-' + name); // Read-only, for IE8-
              Object.defineProperty(result, prop, {
                get: function get() {
                  return element.getAttribute('data-' + name);
                },
                set: function set(value) {
                  element.setAttribute('data-' + name, value);
                } });
            })(this, attr.name.substring(5));
          }
        }
        return result;
      } });
  }
}

// Add cross browser support for dataset
dataset();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"input-placeholder-polyfill":"/Users/Felipe/Sites/base/node_modules/input-placeholder-polyfill/dist/main.min.js","object-assign":"/Users/Felipe/Sites/base/node_modules/object-assign/index.js","promise-polyfill":"/Users/Felipe/Sites/base/node_modules/promise-polyfill/promise.js","viewport-units-buggyfill":"/Users/Felipe/Sites/base/node_modules/viewport-units-buggyfill/viewport-units-buggyfill.js","whatwg-fetch":"/Users/Felipe/Sites/base/node_modules/whatwg-fetch/fetch.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/router.js":[function(require,module,exports){
/**
 *
 * DOM based router
 *
 * Fires when class on element, matches the name of any method.
 * Router also adds a 'common' call for JS that fires on any page.
 * 
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var namespace = void 0;
var fire = function fire(func) {
  if (func !== '' && namespace[func] && typeof namespace[func] == 'function') {
    namespace[func]();
  }
};

var loadEvents = function loadEvents() {

  // hit up common first.
  fire('common');

  // do all the classes too.
  document.body.className.replace(/-/g, '_').split(/\s+/).forEach(function (classnm) {
    fire(classnm);
  });
};

var router = function router(routes) {
  namespace = routes;
  loadEvents();
};

exports.default = router;

},{}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/sharePost.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sharePost;

var _utils = require('./utils');

function tweetInApp(href) {

  var tweet = href.split('?')[1] // get all url parameters
  .split('&') // separate keys and values
  .map(function (par) {
    return par.split('=')[1];
  }) // get just the values
  .filter(function (parsArr) {
    return parsArr.length;
  }) // filter empty paramters
  .join(' '); // concatenate into single string

  window.location = 'twitter://post?message=' + tweet;
} /**
   *
   * Share Post
   *
   * JS to handle Share Post links.
   * Opens the link in a blank window
   *
   */

function sharePost(selector) {

  document.addEventListener('click', (0, _utils.delegate)(selector, function (e) {

    e.preventDefault();
    var href = e.target.getAttribute('href');
    var width = 400;
    var height = 500;
    var left = window.innerWidth / 2 - width / 2;
    var top = window.innerHeight / 2 - height / 2;
    var config = 'status = no,height = ' + width + ',width  = ' + height + ',resizable = yes,top  = ' + top + ',left = ' + left + ',toolbar = no,menubar = no,scrollbars = no,location = no,directories = no';

    // Tweet in app
    if (href.indexOf('twitter') > -1 && (0, _utils.isIOSorAndroid)()) {
      // Attempt to open the share in the the Twitter app
      // If it fails, then just redirect the user to the page
      setTimeout(tweetInApp.bind(href), 25);
      // This shouldn't run if 'tweetInApp' is successful
      window.location = href;

      // Or just open the share in a new window
    } else {
      window.open(href, '', config);
    }
  }));
}

},{"./utils":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/toggleTarget.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleTarget;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var ACTIVE_CLASS = 'is-active';

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

function _getElements(el) {

  var dataTarget = el.dataset.target;
  var target = document.querySelector(dataTarget);
  var targetToggles = (0, _utils.collection)('[data-target="' + dataTarget + '"]');

  return {
    clickedToggle: el,
    target: target,
    targetAndToggles: targetToggles.concat(target),
    group: document.querySelector(el.dataset.group)
  };
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

  (0, _utils.collection)(group.querySelectorAll(selector)).filter(function (el) {
    return el.dataset.target !== currentElement.dataset.target;
  }).map(function (el) {

    _getElements(el).targetAndToggles.map(function (el) {
      return el.classList.remove(ACTIVE_CLASS);
    });
  });
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

function toggleTarget(selector) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var options = Object.assign({}, {
    onToggleOpen: function onToggleOpen() {},
    onToggleClose: function onToggleClose() {}
  }, config);

  document.addEventListener('click', (0, _utils.delegate)(selector, function (e) {

    e.preventDefault();

    var els = _getElements(e.target);
    var target = els.target,
        targetAndToggles = els.targetAndToggles,
        group = els.group;

    var shouldToggle = e.target.dataset.toggle == 'true';

    if (target) {

      var isActive = target.classList.contains(ACTIVE_CLASS);

      if (shouldToggle && isActive) {

        targetAndToggles.map(function (el) {
          return el.classList.remove(ACTIVE_CLASS);
        });
        options.onToggleClose(els);
        _EventBus2.default.publish('toggle-target:close', els);
      }

      if (!isActive) {

        targetAndToggles.map(function (el) {
          return el.classList.add(ACTIVE_CLASS);
        });
        options.onToggleOpen(els);
        _EventBus2.default.publish('toggle-target:open', els);
      }

      if (group) {
        hideOthers(group, selector, e.target);
      }
    }
  }));

  var allTargetAndToggles = (0, _utils.collection)(selector).map(function (el) {
    return _getElements(el).targetAndToggles;
  });

  // Controller Object
  return {

    activeClass: ACTIVE_CLASS,

    /**
     * Get all elements for this tabs intance
     *
     * @return {array} Array of objects, containing all the elements related to this tab instance
     */
    getElements: function getElements() {
      return (0, _utils.collection)(selector).map(function (el) {
        return _getElements(el);
      });
    },


    /**
     * Reset the tabs, setting the first target in each group as active
     * 
     * @return {null}
     */
    reset: function reset() {

      var groups = [];

      (0, _utils.collection)(selector).map(function (el) {
        return _getElements(el);
      }).filter(function (els) {
        return els.group;
      }).map(function (els) {
        return els.group;
      }).map(function (group) {
        if (groups.indexOf(group) == -1) {
          groups.push(group);
        }
      });

      groups.map(function (group) {
        var firstToggle = group.querySelector(selector);

        if (firstToggle) {
          firstToggle.click();
        }
      });
    },


    /**
     *
     * Remove all active classes from all toggles in the instance
     * 
     * @return {null}
     */
    closeAll: function closeAll() {
      allTargetAndToggles.map(function (els) {
        els.map(function (el) {
          return el.classList.remove(ACTIVE_CLASS);
        });
      });
    }
  };
}

},{"./EventBus":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js","./utils":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inArray = inArray;
exports.createElement = createElement;
exports.selectorMatches = selectorMatches;
exports.delegate = delegate;
exports.debounce = debounce;
exports.whichTransitionEnd = whichTransitionEnd;
exports.serializeObject = serializeObject;
exports.extractURLParameters = extractURLParameters;
exports.isIOSorAndroid = isIOSorAndroid;
exports.isMobile = isMobile;
exports.scrollY = scrollY;
exports.collection = collection;
exports.getBpObj = getBpObj;
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

function inArray(item, array) {
  return array.indexOf(item) > -1;
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

function createElement(tagname) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var el = document.createElement(tagname);

  if (el.setAttribute) {
    for (var k in attributes) {
      if (attributes.hasOwnProperty(k)) {
        el.setAttribute(k, attributes[k]);
      }
    }
  }

  return el;
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

function selectorMatches(el, selector) {
  var p = Element.prototype;
  var fn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
  };
  return fn.call(el, selector);
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

function delegate(selector, handler) {
  return function (e) {

    var closestEl = closest(e.target, selector);

    if (closestEl) {
      handler.call(closestEl, e);
    }
  };
}

/**
 *   Returns a function, that, as long as it continues to be invoked, will not
 *   be triggered. The function will be called after it stops being called for
 *   N milliseconds. If `immediate` is passed, trigger the function on the
 *   leading edge, instead of the trailing.
 */

function debounce(func, wait, immediate) {
  var timeout = void 0;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 *
 * Detect if browser supports transitionend event.
 * 
 * @returns {string|false} The prefixed (or unprefixed) supported event name 
 *                         or false if it doesn't support any.
 *
 */

function whichTransitionEnd() {

  var transEndEventNames = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend'
  };

  for (var name in transEndEventNames) {
    if (document.body.style[name] !== undefined) {
      return transEndEventNames[name];
    }
  }

  return false;
}

/**
 *
 * Covert Object into URL parameters
 *
 */

function serializeObject(obj) {

  var str = '';

  for (var k in obj) {
    if (str != '') {
      str += '&';
    }

    str += k + '=' + encodeURIComponent(obj[k]);
  }

  return str;
}

/**
 *
 * Convert URL parameters to object
 *
 */

function extractURLParameters(str) {

  var obj = {};

  if (document.location.search) {
    document.location.search.replace(/(^\?)/, '').split('&').map(function (n) {
      var par = n.split('=');
      obj[par[0]] = par[1];
    });
  }

  return obj;
}

/**
 *
 * User agent matching for IOS or Android devices
 *
 * @returns {boolean} If the UA matches for IOS or Android
 * 
 */

function isIOSorAndroid() {
  return navigator.userAgent.match(/iPad|iPhone|iPod|Android/i);
}

/**
 *
 * User agent matching for mobile devices
 *
 * @returns {boolean} If the UA matches for a mobile device
 * 
 */

function isMobile() {
  return navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
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

var attachedScrollY = false;
var scrollPos = window.pageYOffset;

function scrollY() {

  if (!attachedScrollY) {
    window.addEventListener('scroll', function (e) {
      scrollPos = window.pageYOffset;
    });

    attachedScrollY = true;
  }

  return scrollPos;
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

function collection(selectorOrNodeList) {

  var arr = [];

  var nodeList = void 0;

  if (selectorOrNodeList instanceof NodeList) {
    nodeList = selectorOrNodeList;
  } else if (typeof selectorOrNodeList == 'string') {
    nodeList = document.querySelectorAll(selectorOrNodeList);
  } else {
    return arr;
  }

  for (var i = 0; i < nodeList.length; i++) {
    arr[i] = nodeList[i];
  }

  return arr;
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

function getBpObj() {
  var style = window.getComputedStyle(document.head)['font-family'];

  var bpObj = {};
  // Remove all unwanted character to make it possible to parse this as JSON
  var bpJSON = style.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, "");

  try {
    bpObj = JSON.parse(bpJSON);

    for (var k in bpObj) {
      if (bpObj.hasOwnProperty(k)) {
        bpObj[k] = parseInt(bpObj[k]);
      }
    }
  } catch (e) {}

  return bpObj;
}

},{}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/video.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _videoService = require('./videoService');

var _videoService2 = _interopRequireDefault(_videoService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTIVE_CLASS = 'is-active'; /**
                                 *
                                 * Video Iframe
                                 *
                                 * Setup video iframes, instantantiating it's corresponding player api 
                                 * and external custom controls.
                                 *
                                 * Any service specific api logic should be abstracted to it's corresponding 'videoService'
                                 *
                                 * IMPORTANT: IOS devices don't allow you to use the service API to trigger play on the iframe.
                                 * Instead, allow the user to click directly on the iframe, which will work fine.
                                 * 
                                 */

var LOADING_CLASS = 'is-loading';

/**
 * Returns a unique id within this module
 */

var id = 1;
function uid() {
  return id++;
}

/**
 * 
 * Returns an object with the different services 
 * we support and the parameters each service requires.
 *
 * @param {string} playerId - Id of the player iframe.
 * 
 */

function servicesConfig(playerId) {

  // Configuration object for each video service
  return {
    youtube: {
      url: location.protocol + '//www.youtube.com/embed/',
      params: {
        enablejsapi: 1,
        rel: 0,
        autoplay: 0,
        modestbranding: 1,
        controls: 1,
        showinfo: 0,
        wmode: 'transparent',
        vq: 'hd720'
      }
    },

    vimeo: {
      url: location.protocol + '//player.vimeo.com/video/',
      params: {
        autoplay: 0,
        api: 1,
        player_id: playerId
      }
    }
  };
}

/**
 *
 * Returns the markup for the player iframe
 *
 * @param {object} service - Value of the corresponding service key from `servicesConfig`.
 * @param {string} videoId - Id of the video provided by the video service.
 * @param {string} iframeId - Id of the iframe DOM element.
 * 
 */

function getIframe(service, videoId, iframeId) {
  var src = service.url + videoId + '?' + (0, _utils.serializeObject)(service.params);

  return (0, _utils.createElement)('iframe', {
    id: iframeId,
    src: src,
    frameborder: 0,
    allowfullscreen: true
  });
}

/**
 *
 * Attaches event listener for any external controls for the player 
 * (A custom play button for example)
 *
 * Play button: <button> element must have a `data-video-play` attribute
 * to indicate it's a play button and a `data-target` with the id of the `wrapperEl` iframe
 * wrapper to be targeted.
 *
 */

var controlsInitialized = false;
function initVideoControls() {

  // Only want to attach this listener once
  if (!controlsInitialized) {

    document.addEventListener('click', (0, _utils.delegate)('[data-video-play]', function (e) {

      var delegatedEl = this;
      var wrapperEl = document.querySelector(delegatedEl.dataset.target);

      // The wrapper element service should be assigned when calling `createVideoIframe`
      if (wrapperEl && wrapperEl.serviceController) {
        wrapperEl.serviceController.play();
      }
    }));

    controlsInitialized = true;
  }
}

/**
 *
 * Creates the video iframe player.
 *
 * @param {HTMLElement} wrapperEl - Root element where the player will be inserted.
 * @returns {object} serviceController - service video service controller instance.
 */

function createVideoIframe(wrapperEl) {

  if (!wrapperEl || !wrapperEl.nodeType) {
    console.log('You must provide a DOM element to `createVideoIframe`');
    return false;
  }

  var data = wrapperEl.dataset;
  var videoId = data.videoId;
  var playerId = 'iframe-player-' + uid();
  var serviceConfig = servicesConfig(playerId)[data.videoService];

  if (!serviceConfig || !videoId) {
    console.log('The player wrapper must have "data-video-service" and "data-video-id" attributes');
    return;
  }

  // Create and append the player iframe to the wrapper 
  wrapperEl.appendChild(getIframe(serviceConfig, videoId, playerId));

  var iframe = wrapperEl.querySelector('iframe'); // Then get it
  var serviceController = (0, _videoService2.default)(data.videoService, iframe);

  // Custom event listeners, triggered by the respective service API

  serviceController.subscribe('video-service:loading', function () {
    wrapperEl.classList.add(LOADING_CLASS);
  });

  serviceController.subscribe('video-service:play', function () {
    wrapperEl.classList.add(ACTIVE_CLASS);
    wrapperEl.classList.remove(LOADING_CLASS);
  });

  serviceController.subscribe('video-service:finish', function () {
    wrapperEl.classList.remove(ACTIVE_CLASS, LOADING_CLASS);
  });

  // Expose the service object to the outside by assigning it to the wrapper element
  wrapperEl.serviceController = serviceController;
  initVideoControls();

  return serviceController;
}

exports.default = createVideoIframe;

},{"./EventBus":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js","./utils":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js","./videoService":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/videoService.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/videoService.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _load = require('./load');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * Video Service
 *
 * Logic to setup different video iframe api services (currently Youtube and Vimeo)
 *
 * IMPORTANT: IOS devices don't allow you to use the service API to trigger play on the iframe.
 * Instead, allow the user to click directly on the ifram, which will work fine.
 * 
 */

var playerOrigin = '*';

/**
 *
 * Helper function for sending a message to the vimeo player, taken from {@link Vimeo API}
 * {@link https://developer.vimeo.com/player/js-api Vimeo API}
 * 
 * @param {string} action - Name of the action to be posted to the iframe
 * @param {string} value - Value of the action to be posted to the iframe
 * @param {HTMLIFrameElement} playerIframe - Iframe DOM element of the player
 * 
 */

function postToVimeo(action, value, playerIframe) {

  var data = {
    method: action
  };

  if (value) {
    data.value = value;
  }

  var message = JSON.stringify(data);
  playerIframe.contentWindow.postMessage(message, playerOrigin);
}

/**
 *
 * Listen for 'message' events from the VIMEO iframe, and call the corresponding
 * handler from a provied configuration object
 *
 * @param {object} config - instance configuration object. Must have valid methods
 *                        Corresponding to the Vimeo API events
 * @param {HTMLIframeElement} iframe - Vimeo iframe video player
 *
 */

function initVimeo(config, iframe) {

  window.addEventListener('message', function (e) {

    var data = JSON.parse(e.data);

    // Handle messages from the vimeo player only
    if (!/^https?:\/\/player.vimeo.com/.test(e.origin)) {
      return false;
    }

    // Return if the message is not from this iframe
    if (iframe.id !== data.player_id) {
      return false;
    }

    if (playerOrigin === '*') {
      playerOrigin = e.origin;
    }

    // Execute the handler for this event, if it's a valid function
    if (typeof config[data.event] == 'function') {
      config[data.event]();
    }
  }, false);
}

/**
 *
 * Youtube calls this function automatically once the API has loaded
 *
 */

var youtubeAPIPromise = new Promise(function (resolve) {
  window.onYouTubeIframeAPIReady = function () {
    resolve();
  };
});

/**
 *
 * Initialize a video service instance. Returns a `serviceController`
 * object for listening to API events  and controlling player with custom elements.
 *
 * @param {string} serviceName - Name of the service to initialize
 * @param {HTMLIframeElement} iframe - Iframe video player
 * @returns {object} serviceController - service video service controller instance.
 */

function initVideoService(serviceName, iframe) {

  // Instace controller
  var serviceController = Object.assign({},
  // Create an eventBus instance unique for this video service instance
  (0, _EventBus.eventBusFactory)());

  var serviceReady = new Promise(function (resolve) {
    serviceController.subscribe('video-service:ready', function (player) {
      resolve(player);
    });
  });

  var onServiceReady = function onServiceReady() {
    var afterCb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
    var beforeCb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    return function () {
      beforeCb();
      serviceReady.then(function (player) {
        afterCb(player);
      });
    };
  };

  var publishLoading = function publishLoading() {
    return serviceController.publish('video-service:loading');
  };

  // Since each service has a very different API, 
  // We have to assemble the `serviceController` for each type
  // in a different way, while still providing a consistent interface.
  switch (serviceName) {

    case 'vimeo':

      // Assign the controls methods for vimeo
      serviceController.play = onServiceReady(function () {
        postToVimeo('play', null, iframe);
      }, publishLoading);

      serviceController.stop = onServiceReady(function () {
        postToVimeo('pause', null, iframe);
      });

      initVimeo({
        ready: function ready() {
          // Need to tell Vimeo that we want to listen for this events
          postToVimeo('addEventListener', 'play', iframe);
          postToVimeo('addEventListener', 'finish', iframe);

          serviceController.publish('video-service:ready');
        },
        play: function play() {
          serviceController.publish('video-service:play');
        },
        finish: function finish() {
          serviceController.publish('video-service:finish');
        }
      }, iframe);
      break;

    case 'youtube':

      // Assign control methods for youtube
      serviceController.play = onServiceReady(function (player) {
        return player.playVideo();
      }, publishLoading);
      serviceController.stop = onServiceReady(function (player) {
        return player.stopVideo();
      });

      (0, _load.loadScriptOnce)('https://www.youtube.com/iframe_api');

      youtubeAPIPromise.then(function () {

        var player = new YT.Player(iframe, {
          events: {
            onReady: function onReady() {
              serviceController.publish('video-service:ready', player);
            },
            onStateChange: function onStateChange(e) {

              if (e.data == 1) {
                serviceController.publish('video-service:play');
              } else if (e.data == 0) {
                serviceController.publish('video-service:finish');
              }
            }
          }
        });
      });

      break;
  }

  return serviceController;
}

exports.default = initVideoService;

},{"./EventBus":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js","./load":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/load.js"}],"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/public.js":[function(require,module,exports){
'use strict';

require('./modules/polyfills');

require('./modules/modernizrTests');

var _flickity = require('flickity');

var _flickity2 = _interopRequireDefault(_flickity);

var _smoothScroll = require('smooth-scroll');

var _smoothScroll2 = _interopRequireDefault(_smoothScroll);

var _router = require('./modules/router');

var _router2 = _interopRequireDefault(_router);

var _EventBus = require('./modules/EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

var _modal = require('./modules/modal');

var _video = require('./modules/video');

var _video2 = _interopRequireDefault(_video);

var _form = require('./modules/form');

var _toggleTarget = require('./modules/toggleTarget');

var _toggleTarget2 = _interopRequireDefault(_toggleTarget);

var _sharePost = require('./modules/sharePost');

var _sharePost2 = _interopRequireDefault(_sharePost);

var _globalEvents = require('./modules/globalEvents');

var _utils = require('./modules/utils');

var _ajaxLoader = require('./modules/ajaxLoader');

var _ajaxLoader2 = _interopRequireDefault(_ajaxLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Stub the console, if it doesn't exist
window.console = window.console || {
  log: function log() {}
};

/*----------  Common Function Definitions  ----------*/

/**
 * 
 * Ajax Post Loader
 * 
 */

function postLoader() {

  var wrapper = document.querySelector('.js-listing-wrapper');
  var listing = wrapper.querySelector('.js-listing');

  var loader = (0, _ajaxLoader2.default)('.js-listing-item', {
    loadButton: wrapper.querySelector('.js-load-more')
  });

  var searchForm = wrapper.querySelector('.js-listing-search');
  var filters = (0, _utils.collection)(wrapper.querySelectorAll('.js-listing-filter'));
  var noResults = wrapper.querySelector('.js-no-results');

  loader.subscribe('ajax-loader:no-results', function () {
    listing.innerHTML = '';
    listing.appendChild(noResults);
  });

  loader.subscribe('ajax-loader:loaded', function (items, page) {

    if (page == 1) {
      listing.innerHTML = '';
    }

    items.map(function (item) {
      return listing.appendChild(item);
    });
  });

  // Helper method to set the query
  var setQuery = function setQuery(el) {
    return loader.setQuery(el.name, el.value);
  };

  // DOM event listeners

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      setQuery(e.target.querySelector('input'));
    });
  }

  if (filters.length) {
    filters.map(function (filter) {
      filter.addEventListener('change', function (e) {
        return setQuery(e.target);
      });
    });
  }
}

/*----------  Scripts to Fire on Every Page  ----------*/

var breakpoints = (0, _utils.getBpObj)();

/**
 * 
 * Listen for card elements click, and trigger click on the links inside,
 * making the whole card clickable
 * 
 */

(0, _utils.collection)('[data-card-click]').map(function (card) {
  card.addEventListener('click', function (e) {
    var link = card.querySelector('[data-card-link]');
    if (link) {
      link.click();
    }
  });
});

/**
 *
 * Smooth scroll for links within the same page
 * 
 */

_EventBus2.default.subscribe(_globalEvents.windowResized, function (e) {
  _smoothScroll2.default.init({
    speed: 1000,
    offset: document.querySelector('#site-header').offsetHeight
  });
});

/**
 *
 * Search Bar Toggle
 * 
 */

var siteSearch = document.querySelector('#site-search');

// Focuses automatically when opening
var toggleSearchController = (0, _toggleTarget2.default)('.js-toggle-search', {
  onToggleOpen: function onToggleOpen(els) {
    return siteSearch.querySelector('input').focus();
  }
});

// Close the search bar on `esc` press
_EventBus2.default.subscribe(_globalEvents.keyDownEscape, function () {
  toggleSearchController.closeAll();
});

/**
 *
 *  Generic Toggle
 * 
 */

(0, _toggleTarget2.default)('.js-toggle');

/**
 *
 * Tabs Toggles
 * 
 */

var tabsToggles = (0, _toggleTarget2.default)('.js-toggle-tab');

/**
 *
 * Accordion Toggles
 * 
 */

var accordionToggles = (0, _toggleTarget2.default)('.js-toggle-accordion');

/**
 * 
 * Set CSS `max-height` for the tabs & accordions, to allow animating the opening/closing 
 * via CSS transitions.
 * 
 */

var setTogglesMaxHeight = function setTogglesMaxHeight(toggles) {

  toggles.getElements().map(function (els) {
    return els.target;
  })
  // Filter out duplicate targets
  .filter(function (target, i, arr) {
    return arr.indexOf(target) == i;
  }).map(function (target) {
    var activeClass = toggles.activeClass;

    var isActive = target.classList.contains(activeClass);

    target.style.maxHeight = 'none';

    if (!isActive) {
      target.classList.add(activeClass);
    }

    target.style.maxHeight = target.offsetHeight + 'px';

    if (!isActive) {
      target.classList.remove(activeClass);
    }
  });
};

_EventBus2.default.subscribe(_globalEvents.windowResized, function (e) {

  // Refresh the max heights
  setTogglesMaxHeight(tabsToggles);
  setTogglesMaxHeight(accordionToggles);

  // Reset the tabs when on
  if (window.innerWidth > breakpoints.tabs) {
    tabsToggles.reset();
  }
});

/**
 *
 * Mobile Navigation
 * 
 */

var mobileNav = (0, _modal.initModal)(document.querySelector('#mobile-nav'));

// Close mobile nav if resizing above main breakpoint
_EventBus2.default.subscribe(_globalEvents.windowResized, function () {
  if (window.innerWidth > breakpoints.lg && mobileNav.isOpen) {
    mobileNav.close();
  }
});

/**
 *
 *  Sliders
 * 
 */

(0, _utils.collection)('.js-slider').filter(function (el) {
  return el.children.length > 1;
}).map(function (el) {
  return new _flickity2.default(el, {
    pageDots: el.dataset.pageDots == 'false' ? false : true
  });
});

/**
 *
 * Mobile Slider instantiation.
 *
 * If the window is below a certain width (in this case our 'lg' CSS breakpoint), initialize the slider
 * otherwise, destroy it.
 * 
 */
_EventBus2.default.subscribe(_globalEvents.windowResized, function () {

  var sliders = (0, _utils.collection)('.js-mobile-slider');

  if (window.innerWidth <= breakpoints.lg) {
    sliders.filter(function (el) {
      return !_flickity2.default.data(el);
    }).map(function (el) {
      return new _flickity2.default(el, {
        pageDots: true,
        prevNextButtons: false
      });
    });
  } else {
    sliders.map(function (el) {
      return _flickity2.default.data(el);
    }).filter(function (flickity) {
      return flickity;
    }).map(function (flickity) {
      return flickity.destroy();
    });
  }
});

/**
 *
 * Modals
 * 
 */

(0, _utils.collection)('.js-modal').map(function (modalEl) {
  return (0, _modal.initModal)(modalEl);
});

/**
 *
 * Video Modals
 * 
 */

(0, _utils.collection)('.js-video-modal').map(function (modalEl) {
  return (0, _modal.initVideoModal)(modalEl, '[data-video-player]');
});

/**
 *
 * Video Players
 * 
 */

(0, _utils.collection)('.js-video-player').map(function (videoEl) {
  return (0, _video2.default)(videoEl);
});

/**
 *
 * Handler for ajax submitted gravity forms
 * 
 */

(0, _form.ajaxSubmitGforms)('.gform_wrapper form');

/**
 *
 * Share Post
 * 
 */

(0, _sharePost2.default)('.js-share-post');

/*----------  Route Specific  ----------*/

(0, _router2.default)({
  home: function home() {},
  blog: function blog() {
    postLoader();
  },
  team: function team() {
    postLoader();
  },
  search: function search() {
    postLoader();
  }
});

// Fire initial custom events

_EventBus2.default.publish(_globalEvents.windowResized);

},{"./modules/EventBus":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/EventBus.js","./modules/ajaxLoader":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/ajaxLoader.js","./modules/form":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/form.js","./modules/globalEvents":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/globalEvents.js","./modules/modal":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/modal.js","./modules/modernizrTests":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/modernizrTests.js","./modules/polyfills":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/polyfills.js","./modules/router":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/router.js","./modules/sharePost":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/sharePost.js","./modules/toggleTarget":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/toggleTarget.js","./modules/utils":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/utils.js","./modules/video":"/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/modules/video.js","flickity":"/Users/Felipe/Sites/base/node_modules/flickity/js/index.js","smooth-scroll":"/Users/Felipe/Sites/base/node_modules/smooth-scroll/dist/js/smooth-scroll.min.js"}]},{},["/Users/Felipe/Sites/base/wp-content/themes/base-theme/src/scripts/public.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGVzYW5kcm8tbWF0Y2hlcy1zZWxlY3Rvci9tYXRjaGVzLXNlbGVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2V2LWVtaXR0ZXIvZXYtZW1pdHRlci5qcyIsIm5vZGVfbW9kdWxlcy9maXp6eS11aS11dGlscy91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9mbGlja2l0eS9qcy9hZGQtcmVtb3ZlLWNlbGwuanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvYW5pbWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9mbGlja2l0eS9qcy9jZWxsLmpzIiwibm9kZV9tb2R1bGVzL2ZsaWNraXR5L2pzL2RyYWcuanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvZmxpY2tpdHkuanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvbGF6eWxvYWQuanMiLCJub2RlX21vZHVsZXMvZmxpY2tpdHkvanMvcGFnZS1kb3RzLmpzIiwibm9kZV9tb2R1bGVzL2ZsaWNraXR5L2pzL3BsYXllci5qcyIsIm5vZGVfbW9kdWxlcy9mbGlja2l0eS9qcy9wcmV2LW5leHQtYnV0dG9uLmpzIiwibm9kZV9tb2R1bGVzL2ZsaWNraXR5L2pzL3NsaWRlLmpzIiwibm9kZV9tb2R1bGVzL2dldC1zaXplL2dldC1zaXplLmpzIiwibm9kZV9tb2R1bGVzL2lucHV0LXBsYWNlaG9sZGVyLXBvbHlmaWxsL2Rpc3QvbWFpbi5taW4uanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlLXBvbHlmaWxsL3Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvc21vb3RoLXNjcm9sbC9kaXN0L2pzL3Ntb290aC1zY3JvbGwubWluLmpzIiwibm9kZV9tb2R1bGVzL3RhcC1saXN0ZW5lci90YXAtbGlzdGVuZXIuanMiLCJub2RlX21vZHVsZXMvdW5pZHJhZ2dlci91bmlkcmFnZ2VyLmpzIiwibm9kZV9tb2R1bGVzL3VuaXBvaW50ZXIvdW5pcG9pbnRlci5qcyIsIm5vZGVfbW9kdWxlcy92aWV3cG9ydC11bml0cy1idWdneWZpbGwvdmlld3BvcnQtdW5pdHMtYnVnZ3lmaWxsLmpzIiwibm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvbW9kdWxlcy9FdmVudEJ1cy5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvbW9kdWxlcy9hamF4TG9hZGVyLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL2Zvcm0uanMiLCJ3cC1jb250ZW50L3RoZW1lcy9iYXNlLXRoZW1lL3NyYy9zY3JpcHRzL21vZHVsZXMvZ2xvYmFsRXZlbnRzLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL2xvYWQuanMiLCJ3cC1jb250ZW50L3RoZW1lcy9iYXNlLXRoZW1lL3NyYy9zY3JpcHRzL21vZHVsZXMvbW9kYWwuanMiLCJ3cC1jb250ZW50L3RoZW1lcy9iYXNlLXRoZW1lL3NyYy9zY3JpcHRzL21vZHVsZXMvbW9kZXJuaXpyVGVzdHMuanMiLCJ3cC1jb250ZW50L3RoZW1lcy9iYXNlLXRoZW1lL3NyYy9zY3JpcHRzL21vZHVsZXMvcG9seWZpbGxzLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL3JvdXRlci5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvbW9kdWxlcy9zaGFyZVBvc3QuanMiLCJ3cC1jb250ZW50L3RoZW1lcy9iYXNlLXRoZW1lL3NyYy9zY3JpcHRzL21vZHVsZXMvdG9nZ2xlVGFyZ2V0LmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL3V0aWxzLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL3ZpZGVvLmpzIiwid3AtY29udGVudC90aGVtZXMvYmFzZS10aGVtZS9zcmMvc2NyaXB0cy9tb2R1bGVzL3ZpZGVvU2VydmljZS5qcyIsIndwLWNvbnRlbnQvdGhlbWVzL2Jhc2UtdGhlbWUvc3JjL3NjcmlwdHMvcHVibGljLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2wxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDek9BO0FBQ0E7Ozs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDMWNBOzs7Ozs7Ozs7OztBQVdBLFNBQVMsT0FB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ZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBtYXRjaGVzU2VsZWN0b3IgdjIuMC4xXG4gKiBtYXRjaGVzU2VsZWN0b3IoIGVsZW1lbnQsICcuc2VsZWN0b3InIClcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgc3RyaWN0OiB0cnVlLCB1bmRlZjogdHJ1ZSwgdW51c2VkOiB0cnVlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLypnbG9iYWwgZGVmaW5lOiBmYWxzZSwgbW9kdWxlOiBmYWxzZSAqL1xuICAndXNlIHN0cmljdCc7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggZmFjdG9yeSApO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cubWF0Y2hlc1NlbGVjdG9yID0gZmFjdG9yeSgpO1xuICB9XG5cbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBtYXRjaGVzTWV0aG9kID0gKCBmdW5jdGlvbigpIHtcbiAgICB2YXIgRWxlbVByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XG4gICAgLy8gY2hlY2sgZm9yIHRoZSBzdGFuZGFyZCBtZXRob2QgbmFtZSBmaXJzdFxuICAgIGlmICggRWxlbVByb3RvLm1hdGNoZXMgKSB7XG4gICAgICByZXR1cm4gJ21hdGNoZXMnO1xuICAgIH1cbiAgICAvLyBjaGVjayB1bi1wcmVmaXhlZFxuICAgIGlmICggRWxlbVByb3RvLm1hdGNoZXNTZWxlY3RvciApIHtcbiAgICAgIHJldHVybiAnbWF0Y2hlc1NlbGVjdG9yJztcbiAgICB9XG4gICAgLy8gY2hlY2sgdmVuZG9yIHByZWZpeGVzXG4gICAgdmFyIHByZWZpeGVzID0gWyAnd2Via2l0JywgJ21veicsICdtcycsICdvJyBdO1xuXG4gICAgZm9yICggdmFyIGk9MDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgdmFyIHByZWZpeCA9IHByZWZpeGVzW2ldO1xuICAgICAgdmFyIG1ldGhvZCA9IHByZWZpeCArICdNYXRjaGVzU2VsZWN0b3InO1xuICAgICAgaWYgKCBFbGVtUHJvdG9bIG1ldGhvZCBdICkge1xuICAgICAgICByZXR1cm4gbWV0aG9kO1xuICAgICAgfVxuICAgIH1cbiAgfSkoKTtcblxuICByZXR1cm4gZnVuY3Rpb24gbWF0Y2hlc1NlbGVjdG9yKCBlbGVtLCBzZWxlY3RvciApIHtcbiAgICByZXR1cm4gZWxlbVsgbWF0Y2hlc01ldGhvZCBdKCBzZWxlY3RvciApO1xuICB9O1xuXG59KSk7XG4iLCIvKipcbiAqIEV2RW1pdHRlciB2MS4wLjNcbiAqIExpbCcgZXZlbnQgZW1pdHRlclxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG4vKiBqc2hpbnQgdW51c2VkOiB0cnVlLCB1bmRlZjogdHJ1ZSwgc3RyaWN0OiB0cnVlICovXG5cbiggZnVuY3Rpb24oIGdsb2JhbCwgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qIGdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHdpbmRvdyAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRCAtIFJlcXVpcmVKU1xuICAgIGRlZmluZSggZmFjdG9yeSApO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTIC0gQnJvd3NlcmlmeSwgV2VicGFja1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIGdsb2JhbC5FdkVtaXR0ZXIgPSBmYWN0b3J5KCk7XG4gIH1cblxufSggdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uKCkge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gRXZFbWl0dGVyKCkge31cblxudmFyIHByb3RvID0gRXZFbWl0dGVyLnByb3RvdHlwZTtcblxucHJvdG8ub24gPSBmdW5jdGlvbiggZXZlbnROYW1lLCBsaXN0ZW5lciApIHtcbiAgaWYgKCAhZXZlbnROYW1lIHx8ICFsaXN0ZW5lciApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gc2V0IGV2ZW50cyBoYXNoXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIC8vIHNldCBsaXN0ZW5lcnMgYXJyYXlcbiAgdmFyIGxpc3RlbmVycyA9IGV2ZW50c1sgZXZlbnROYW1lIF0gPSBldmVudHNbIGV2ZW50TmFtZSBdIHx8IFtdO1xuICAvLyBvbmx5IGFkZCBvbmNlXG4gIGlmICggbGlzdGVuZXJzLmluZGV4T2YoIGxpc3RlbmVyICkgPT0gLTEgKSB7XG4gICAgbGlzdGVuZXJzLnB1c2goIGxpc3RlbmVyICk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbnByb3RvLm9uY2UgPSBmdW5jdGlvbiggZXZlbnROYW1lLCBsaXN0ZW5lciApIHtcbiAgaWYgKCAhZXZlbnROYW1lIHx8ICFsaXN0ZW5lciApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gYWRkIGV2ZW50XG4gIHRoaXMub24oIGV2ZW50TmFtZSwgbGlzdGVuZXIgKTtcbiAgLy8gc2V0IG9uY2UgZmxhZ1xuICAvLyBzZXQgb25jZUV2ZW50cyBoYXNoXG4gIHZhciBvbmNlRXZlbnRzID0gdGhpcy5fb25jZUV2ZW50cyA9IHRoaXMuX29uY2VFdmVudHMgfHwge307XG4gIC8vIHNldCBvbmNlTGlzdGVuZXJzIG9iamVjdFxuICB2YXIgb25jZUxpc3RlbmVycyA9IG9uY2VFdmVudHNbIGV2ZW50TmFtZSBdID0gb25jZUV2ZW50c1sgZXZlbnROYW1lIF0gfHwge307XG4gIC8vIHNldCBmbGFnXG4gIG9uY2VMaXN0ZW5lcnNbIGxpc3RlbmVyIF0gPSB0cnVlO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxucHJvdG8ub2ZmID0gZnVuY3Rpb24oIGV2ZW50TmFtZSwgbGlzdGVuZXIgKSB7XG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzWyBldmVudE5hbWUgXTtcbiAgaWYgKCAhbGlzdGVuZXJzIHx8ICFsaXN0ZW5lcnMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZiggbGlzdGVuZXIgKTtcbiAgaWYgKCBpbmRleCAhPSAtMSApIHtcbiAgICBsaXN0ZW5lcnMuc3BsaWNlKCBpbmRleCwgMSApO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wcm90by5lbWl0RXZlbnQgPSBmdW5jdGlvbiggZXZlbnROYW1lLCBhcmdzICkge1xuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1sgZXZlbnROYW1lIF07XG4gIGlmICggIWxpc3RlbmVycyB8fCAhbGlzdGVuZXJzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGkgPSAwO1xuICB2YXIgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gIGFyZ3MgPSBhcmdzIHx8IFtdO1xuICAvLyBvbmNlIHN0dWZmXG4gIHZhciBvbmNlTGlzdGVuZXJzID0gdGhpcy5fb25jZUV2ZW50cyAmJiB0aGlzLl9vbmNlRXZlbnRzWyBldmVudE5hbWUgXTtcblxuICB3aGlsZSAoIGxpc3RlbmVyICkge1xuICAgIHZhciBpc09uY2UgPSBvbmNlTGlzdGVuZXJzICYmIG9uY2VMaXN0ZW5lcnNbIGxpc3RlbmVyIF07XG4gICAgaWYgKCBpc09uY2UgKSB7XG4gICAgICAvLyByZW1vdmUgbGlzdGVuZXJcbiAgICAgIC8vIHJlbW92ZSBiZWZvcmUgdHJpZ2dlciB0byBwcmV2ZW50IHJlY3Vyc2lvblxuICAgICAgdGhpcy5vZmYoIGV2ZW50TmFtZSwgbGlzdGVuZXIgKTtcbiAgICAgIC8vIHVuc2V0IG9uY2UgZmxhZ1xuICAgICAgZGVsZXRlIG9uY2VMaXN0ZW5lcnNbIGxpc3RlbmVyIF07XG4gICAgfVxuICAgIC8vIHRyaWdnZXIgbGlzdGVuZXJcbiAgICBsaXN0ZW5lci5hcHBseSggdGhpcywgYXJncyApO1xuICAgIC8vIGdldCBuZXh0IGxpc3RlbmVyXG4gICAgaSArPSBpc09uY2UgPyAwIDogMTtcbiAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxucmV0dXJuIEV2RW1pdHRlcjtcblxufSkpO1xuIiwiLyoqXG4gKiBGaXp6eSBVSSB1dGlscyB2Mi4wLjNcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSwgc3RyaWN0OiB0cnVlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qanNoaW50IHN0cmljdDogZmFsc2UgKi8gLypnbG9iYWxzIGRlZmluZSwgbW9kdWxlLCByZXF1aXJlICovXG5cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICdkZXNhbmRyby1tYXRjaGVzLXNlbGVjdG9yL21hdGNoZXMtc2VsZWN0b3InXG4gICAgXSwgZnVuY3Rpb24oIG1hdGNoZXNTZWxlY3RvciApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIG1hdGNoZXNTZWxlY3RvciApO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnZGVzYW5kcm8tbWF0Y2hlcy1zZWxlY3RvcicpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5maXp6eVVJVXRpbHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93Lm1hdGNoZXNTZWxlY3RvclxuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIG1hdGNoZXNTZWxlY3RvciApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSB7fTtcblxuLy8gLS0tLS0gZXh0ZW5kIC0tLS0tIC8vXG5cbi8vIGV4dGVuZHMgb2JqZWN0c1xudXRpbHMuZXh0ZW5kID0gZnVuY3Rpb24oIGEsIGIgKSB7XG4gIGZvciAoIHZhciBwcm9wIGluIGIgKSB7XG4gICAgYVsgcHJvcCBdID0gYlsgcHJvcCBdO1xuICB9XG4gIHJldHVybiBhO1xufTtcblxuLy8gLS0tLS0gbW9kdWxvIC0tLS0tIC8vXG5cbnV0aWxzLm1vZHVsbyA9IGZ1bmN0aW9uKCBudW0sIGRpdiApIHtcbiAgcmV0dXJuICggKCBudW0gJSBkaXYgKSArIGRpdiApICUgZGl2O1xufTtcblxuLy8gLS0tLS0gbWFrZUFycmF5IC0tLS0tIC8vXG5cbi8vIHR1cm4gZWxlbWVudCBvciBub2RlTGlzdCBpbnRvIGFuIGFycmF5XG51dGlscy5tYWtlQXJyYXkgPSBmdW5jdGlvbiggb2JqICkge1xuICB2YXIgYXJ5ID0gW107XG4gIGlmICggQXJyYXkuaXNBcnJheSggb2JqICkgKSB7XG4gICAgLy8gdXNlIG9iamVjdCBpZiBhbHJlYWR5IGFuIGFycmF5XG4gICAgYXJ5ID0gb2JqO1xuICB9IGVsc2UgaWYgKCBvYmogJiYgdHlwZW9mIG9iai5sZW5ndGggPT0gJ251bWJlcicgKSB7XG4gICAgLy8gY29udmVydCBub2RlTGlzdCB0byBhcnJheVxuICAgIGZvciAoIHZhciBpPTA7IGkgPCBvYmoubGVuZ3RoOyBpKysgKSB7XG4gICAgICBhcnkucHVzaCggb2JqW2ldICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGFycmF5IG9mIHNpbmdsZSBpbmRleFxuICAgIGFyeS5wdXNoKCBvYmogKTtcbiAgfVxuICByZXR1cm4gYXJ5O1xufTtcblxuLy8gLS0tLS0gcmVtb3ZlRnJvbSAtLS0tLSAvL1xuXG51dGlscy5yZW1vdmVGcm9tID0gZnVuY3Rpb24oIGFyeSwgb2JqICkge1xuICB2YXIgaW5kZXggPSBhcnkuaW5kZXhPZiggb2JqICk7XG4gIGlmICggaW5kZXggIT0gLTEgKSB7XG4gICAgYXJ5LnNwbGljZSggaW5kZXgsIDEgKTtcbiAgfVxufTtcblxuLy8gLS0tLS0gZ2V0UGFyZW50IC0tLS0tIC8vXG5cbnV0aWxzLmdldFBhcmVudCA9IGZ1bmN0aW9uKCBlbGVtLCBzZWxlY3RvciApIHtcbiAgd2hpbGUgKCBlbGVtICE9IGRvY3VtZW50LmJvZHkgKSB7XG4gICAgZWxlbSA9IGVsZW0ucGFyZW50Tm9kZTtcbiAgICBpZiAoIG1hdGNoZXNTZWxlY3RvciggZWxlbSwgc2VsZWN0b3IgKSApIHtcbiAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0gZ2V0UXVlcnlFbGVtZW50IC0tLS0tIC8vXG5cbi8vIHVzZSBlbGVtZW50IGFzIHNlbGVjdG9yIHN0cmluZ1xudXRpbHMuZ2V0UXVlcnlFbGVtZW50ID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIGlmICggdHlwZW9mIGVsZW0gPT0gJ3N0cmluZycgKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIGVsZW0gKTtcbiAgfVxuICByZXR1cm4gZWxlbTtcbn07XG5cbi8vIC0tLS0tIGhhbmRsZUV2ZW50IC0tLS0tIC8vXG5cbi8vIGVuYWJsZSAub250eXBlIHRvIHRyaWdnZXIgZnJvbSAuYWRkRXZlbnRMaXN0ZW5lciggZWxlbSwgJ3R5cGUnIClcbnV0aWxzLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB2YXIgbWV0aG9kID0gJ29uJyArIGV2ZW50LnR5cGU7XG4gIGlmICggdGhpc1sgbWV0aG9kIF0gKSB7XG4gICAgdGhpc1sgbWV0aG9kIF0oIGV2ZW50ICk7XG4gIH1cbn07XG5cbi8vIC0tLS0tIGZpbHRlckZpbmRFbGVtZW50cyAtLS0tLSAvL1xuXG51dGlscy5maWx0ZXJGaW5kRWxlbWVudHMgPSBmdW5jdGlvbiggZWxlbXMsIHNlbGVjdG9yICkge1xuICAvLyBtYWtlIGFycmF5IG9mIGVsZW1zXG4gIGVsZW1zID0gdXRpbHMubWFrZUFycmF5KCBlbGVtcyApO1xuICB2YXIgZmZFbGVtcyA9IFtdO1xuXG4gIGVsZW1zLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtICkge1xuICAgIC8vIGNoZWNrIHRoYXQgZWxlbSBpcyBhbiBhY3R1YWwgZWxlbWVudFxuICAgIGlmICggISggZWxlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGFkZCBlbGVtIGlmIG5vIHNlbGVjdG9yXG4gICAgaWYgKCAhc2VsZWN0b3IgKSB7XG4gICAgICBmZkVsZW1zLnB1c2goIGVsZW0gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZmlsdGVyICYgZmluZCBpdGVtcyBpZiB3ZSBoYXZlIGEgc2VsZWN0b3JcbiAgICAvLyBmaWx0ZXJcbiAgICBpZiAoIG1hdGNoZXNTZWxlY3RvciggZWxlbSwgc2VsZWN0b3IgKSApIHtcbiAgICAgIGZmRWxlbXMucHVzaCggZWxlbSApO1xuICAgIH1cbiAgICAvLyBmaW5kIGNoaWxkcmVuXG4gICAgdmFyIGNoaWxkRWxlbXMgPSBlbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICk7XG4gICAgLy8gY29uY2F0IGNoaWxkRWxlbXMgdG8gZmlsdGVyRm91bmQgYXJyYXlcbiAgICBmb3IgKCB2YXIgaT0wOyBpIDwgY2hpbGRFbGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGZmRWxlbXMucHVzaCggY2hpbGRFbGVtc1tpXSApO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGZmRWxlbXM7XG59O1xuXG4vLyAtLS0tLSBkZWJvdW5jZU1ldGhvZCAtLS0tLSAvL1xuXG51dGlscy5kZWJvdW5jZU1ldGhvZCA9IGZ1bmN0aW9uKCBfY2xhc3MsIG1ldGhvZE5hbWUsIHRocmVzaG9sZCApIHtcbiAgLy8gb3JpZ2luYWwgbWV0aG9kXG4gIHZhciBtZXRob2QgPSBfY2xhc3MucHJvdG90eXBlWyBtZXRob2ROYW1lIF07XG4gIHZhciB0aW1lb3V0TmFtZSA9IG1ldGhvZE5hbWUgKyAnVGltZW91dCc7XG5cbiAgX2NsYXNzLnByb3RvdHlwZVsgbWV0aG9kTmFtZSBdID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRpbWVvdXQgPSB0aGlzWyB0aW1lb3V0TmFtZSBdO1xuICAgIGlmICggdGltZW91dCApIHtcbiAgICAgIGNsZWFyVGltZW91dCggdGltZW91dCApO1xuICAgIH1cbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpc1sgdGltZW91dE5hbWUgXSA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgbWV0aG9kLmFwcGx5KCBfdGhpcywgYXJncyApO1xuICAgICAgZGVsZXRlIF90aGlzWyB0aW1lb3V0TmFtZSBdO1xuICAgIH0sIHRocmVzaG9sZCB8fCAxMDAgKTtcbiAgfTtcbn07XG5cbi8vIC0tLS0tIGRvY1JlYWR5IC0tLS0tIC8vXG5cbnV0aWxzLmRvY1JlYWR5ID0gZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuICB2YXIgcmVhZHlTdGF0ZSA9IGRvY3VtZW50LnJlYWR5U3RhdGU7XG4gIGlmICggcmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnIHx8IHJlYWR5U3RhdGUgPT0gJ2ludGVyYWN0aXZlJyApIHtcbiAgICAvLyBkbyBhc3luYyB0byBhbGxvdyBmb3Igb3RoZXIgc2NyaXB0cyB0byBydW4uIG1ldGFmaXp6eS9mbGlja2l0eSM0NDFcbiAgICBzZXRUaW1lb3V0KCBjYWxsYmFjayApO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2sgKTtcbiAgfVxufTtcblxuLy8gLS0tLS0gaHRtbEluaXQgLS0tLS0gLy9cblxuLy8gaHR0cDovL2phbWVzcm9iZXJ0cy5uYW1lL2Jsb2cvMjAxMC8wMi8yMi9zdHJpbmctZnVuY3Rpb25zLWZvci1qYXZhc2NyaXB0LXRyaW0tdG8tY2FtZWwtY2FzZS10by1kYXNoZWQtYW5kLXRvLXVuZGVyc2NvcmUvXG51dGlscy50b0Rhc2hlZCA9IGZ1bmN0aW9uKCBzdHIgKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSggLyguKShbQS1aXSkvZywgZnVuY3Rpb24oIG1hdGNoLCAkMSwgJDIgKSB7XG4gICAgcmV0dXJuICQxICsgJy0nICsgJDI7XG4gIH0pLnRvTG93ZXJDYXNlKCk7XG59O1xuXG52YXIgY29uc29sZSA9IHdpbmRvdy5jb25zb2xlO1xuLyoqXG4gKiBhbGxvdyB1c2VyIHRvIGluaXRpYWxpemUgY2xhc3NlcyB2aWEgW2RhdGEtbmFtZXNwYWNlXSBvciAuanMtbmFtZXNwYWNlIGNsYXNzXG4gKiBodG1sSW5pdCggV2lkZ2V0LCAnd2lkZ2V0TmFtZScgKVxuICogb3B0aW9ucyBhcmUgcGFyc2VkIGZyb20gZGF0YS1uYW1lc3BhY2Utb3B0aW9uc1xuICovXG51dGlscy5odG1sSW5pdCA9IGZ1bmN0aW9uKCBXaWRnZXRDbGFzcywgbmFtZXNwYWNlICkge1xuICB1dGlscy5kb2NSZWFkeSggZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRhc2hlZE5hbWVzcGFjZSA9IHV0aWxzLnRvRGFzaGVkKCBuYW1lc3BhY2UgKTtcbiAgICB2YXIgZGF0YUF0dHIgPSAnZGF0YS0nICsgZGFzaGVkTmFtZXNwYWNlO1xuICAgIHZhciBkYXRhQXR0ckVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ1snICsgZGF0YUF0dHIgKyAnXScgKTtcbiAgICB2YXIganNEYXNoRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmpzLScgKyBkYXNoZWROYW1lc3BhY2UgKTtcbiAgICB2YXIgZWxlbXMgPSB1dGlscy5tYWtlQXJyYXkoIGRhdGFBdHRyRWxlbXMgKVxuICAgICAgLmNvbmNhdCggdXRpbHMubWFrZUFycmF5KCBqc0Rhc2hFbGVtcyApICk7XG4gICAgdmFyIGRhdGFPcHRpb25zQXR0ciA9IGRhdGFBdHRyICsgJy1vcHRpb25zJztcbiAgICB2YXIgalF1ZXJ5ID0gd2luZG93LmpRdWVyeTtcblxuICAgIGVsZW1zLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtICkge1xuICAgICAgdmFyIGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSggZGF0YUF0dHIgKSB8fFxuICAgICAgICBlbGVtLmdldEF0dHJpYnV0ZSggZGF0YU9wdGlvbnNBdHRyICk7XG4gICAgICB2YXIgb3B0aW9ucztcbiAgICAgIHRyeSB7XG4gICAgICAgIG9wdGlvbnMgPSBhdHRyICYmIEpTT04ucGFyc2UoIGF0dHIgKTtcbiAgICAgIH0gY2F0Y2ggKCBlcnJvciApIHtcbiAgICAgICAgLy8gbG9nIGVycm9yLCBkbyBub3QgaW5pdGlhbGl6ZVxuICAgICAgICBpZiAoIGNvbnNvbGUgKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvciggJ0Vycm9yIHBhcnNpbmcgJyArIGRhdGFBdHRyICsgJyBvbiAnICsgZWxlbS5jbGFzc05hbWUgK1xuICAgICAgICAgICc6ICcgKyBlcnJvciApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGluaXRpYWxpemVcbiAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBXaWRnZXRDbGFzcyggZWxlbSwgb3B0aW9ucyApO1xuICAgICAgLy8gbWFrZSBhdmFpbGFibGUgdmlhICQoKS5kYXRhKCduYW1lc3BhY2UnKVxuICAgICAgaWYgKCBqUXVlcnkgKSB7XG4gICAgICAgIGpRdWVyeS5kYXRhKCBlbGVtLCBuYW1lc3BhY2UsIGluc3RhbmNlICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSk7XG59O1xuXG4vLyAtLS0tLSAgLS0tLS0gLy9cblxucmV0dXJuIHV0aWxzO1xuXG59KSk7XG4iLCIvLyBhZGQsIHJlbW92ZSBjZWxsXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJy4vZmxpY2tpdHknLFxuICAgICAgJ2Zpenp5LXVpLXV0aWxzL3V0aWxzJ1xuICAgIF0sIGZ1bmN0aW9uKCBGbGlja2l0eSwgdXRpbHMgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBGbGlja2l0eSwgdXRpbHMgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJy4vZmxpY2tpdHknKSxcbiAgICAgIHJlcXVpcmUoJ2Zpenp5LXVpLXV0aWxzJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5GbGlja2l0eSxcbiAgICAgIHdpbmRvdy5maXp6eVVJVXRpbHNcbiAgICApO1xuICB9XG5cbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBGbGlja2l0eSwgdXRpbHMgKSB7XG5cbid1c2Ugc3RyaWN0JztcblxuLy8gYXBwZW5kIGNlbGxzIHRvIGEgZG9jdW1lbnQgZnJhZ21lbnRcbmZ1bmN0aW9uIGdldENlbGxzRnJhZ21lbnQoIGNlbGxzICkge1xuICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIGNlbGxzLmZvckVhY2goIGZ1bmN0aW9uKCBjZWxsICkge1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBjZWxsLmVsZW1lbnQgKTtcbiAgfSk7XG4gIHJldHVybiBmcmFnbWVudDtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gYWRkL3JlbW92ZSBjZWxsIHByb3RvdHlwZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG52YXIgcHJvdG8gPSBGbGlja2l0eS5wcm90b3R5cGU7XG5cbi8qKlxuICogSW5zZXJ0LCBwcmVwZW5kLCBvciBhcHBlbmQgY2VsbHNcbiAqIEBwYXJhbSB7RWxlbWVudCwgQXJyYXksIE5vZGVMaXN0fSBlbGVtc1xuICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleFxuICovXG5wcm90by5pbnNlcnQgPSBmdW5jdGlvbiggZWxlbXMsIGluZGV4ICkge1xuICB2YXIgY2VsbHMgPSB0aGlzLl9tYWtlQ2VsbHMoIGVsZW1zICk7XG4gIGlmICggIWNlbGxzIHx8ICFjZWxscy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBsZW4gPSB0aGlzLmNlbGxzLmxlbmd0aDtcbiAgLy8gZGVmYXVsdCB0byBhcHBlbmRcbiAgaW5kZXggPSBpbmRleCA9PT0gdW5kZWZpbmVkID8gbGVuIDogaW5kZXg7XG4gIC8vIGFkZCBjZWxscyB3aXRoIGRvY3VtZW50IGZyYWdtZW50XG4gIHZhciBmcmFnbWVudCA9IGdldENlbGxzRnJhZ21lbnQoIGNlbGxzICk7XG4gIC8vIGFwcGVuZCB0byBzbGlkZXJcbiAgdmFyIGlzQXBwZW5kID0gaW5kZXggPT0gbGVuO1xuICBpZiAoIGlzQXBwZW5kICkge1xuICAgIHRoaXMuc2xpZGVyLmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnNlcnRDZWxsRWxlbWVudCA9IHRoaXMuY2VsbHNbIGluZGV4IF0uZWxlbWVudDtcbiAgICB0aGlzLnNsaWRlci5pbnNlcnRCZWZvcmUoIGZyYWdtZW50LCBpbnNlcnRDZWxsRWxlbWVudCApO1xuICB9XG4gIC8vIGFkZCB0byB0aGlzLmNlbGxzXG4gIGlmICggaW5kZXggPT09IDAgKSB7XG4gICAgLy8gcHJlcGVuZCwgYWRkIHRvIHN0YXJ0XG4gICAgdGhpcy5jZWxscyA9IGNlbGxzLmNvbmNhdCggdGhpcy5jZWxscyApO1xuICB9IGVsc2UgaWYgKCBpc0FwcGVuZCApIHtcbiAgICAvLyBhcHBlbmQsIGFkZCB0byBlbmRcbiAgICB0aGlzLmNlbGxzID0gdGhpcy5jZWxscy5jb25jYXQoIGNlbGxzICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gaW5zZXJ0IGluIHRoaXMuY2VsbHNcbiAgICB2YXIgZW5kQ2VsbHMgPSB0aGlzLmNlbGxzLnNwbGljZSggaW5kZXgsIGxlbiAtIGluZGV4ICk7XG4gICAgdGhpcy5jZWxscyA9IHRoaXMuY2VsbHMuY29uY2F0KCBjZWxscyApLmNvbmNhdCggZW5kQ2VsbHMgKTtcbiAgfVxuXG4gIHRoaXMuX3NpemVDZWxscyggY2VsbHMgKTtcblxuICB2YXIgc2VsZWN0ZWRJbmRleERlbHRhID0gaW5kZXggPiB0aGlzLnNlbGVjdGVkSW5kZXggPyAwIDogY2VsbHMubGVuZ3RoO1xuICB0aGlzLl9jZWxsQWRkZWRSZW1vdmVkKCBpbmRleCwgc2VsZWN0ZWRJbmRleERlbHRhICk7XG59O1xuXG5wcm90by5hcHBlbmQgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIHRoaXMuaW5zZXJ0KCBlbGVtcywgdGhpcy5jZWxscy5sZW5ndGggKTtcbn07XG5cbnByb3RvLnByZXBlbmQgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIHRoaXMuaW5zZXJ0KCBlbGVtcywgMCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgY2VsbHNcbiAqIEBwYXJhbSB7RWxlbWVudCwgQXJyYXksIE5vZGVMaXN0fSBlbGVtc1xuICovXG5wcm90by5yZW1vdmUgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIHZhciBjZWxscyA9IHRoaXMuZ2V0Q2VsbHMoIGVsZW1zICk7XG4gIHZhciBzZWxlY3RlZEluZGV4RGVsdGEgPSAwO1xuICB2YXIgbGVuID0gY2VsbHMubGVuZ3RoO1xuICB2YXIgaSwgY2VsbDtcbiAgLy8gY2FsY3VsYXRlIHNlbGVjdGVkSW5kZXhEZWx0YSwgZWFzaWVyIGlmIGRvbmUgaW4gc2VwZXJhdGUgbG9vcFxuICBmb3IgKCBpPTA7IGkgPCBsZW47IGkrKyApIHtcbiAgICBjZWxsID0gY2VsbHNbaV07XG4gICAgdmFyIHdhc0JlZm9yZSA9IHRoaXMuY2VsbHMuaW5kZXhPZiggY2VsbCApIDwgdGhpcy5zZWxlY3RlZEluZGV4O1xuICAgIHNlbGVjdGVkSW5kZXhEZWx0YSAtPSB3YXNCZWZvcmUgPyAxIDogMDtcbiAgfVxuXG4gIGZvciAoIGk9MDsgaSA8IGxlbjsgaSsrICkge1xuICAgIGNlbGwgPSBjZWxsc1tpXTtcbiAgICBjZWxsLnJlbW92ZSgpO1xuICAgIC8vIHJlbW92ZSBpdGVtIGZyb20gY29sbGVjdGlvblxuICAgIHV0aWxzLnJlbW92ZUZyb20oIHRoaXMuY2VsbHMsIGNlbGwgKTtcbiAgfVxuXG4gIGlmICggY2VsbHMubGVuZ3RoICkge1xuICAgIC8vIHVwZGF0ZSBzdHVmZlxuICAgIHRoaXMuX2NlbGxBZGRlZFJlbW92ZWQoIDAsIHNlbGVjdGVkSW5kZXhEZWx0YSApO1xuICB9XG59O1xuXG4vLyB1cGRhdGVzIHdoZW4gY2VsbHMgYXJlIGFkZGVkIG9yIHJlbW92ZWRcbnByb3RvLl9jZWxsQWRkZWRSZW1vdmVkID0gZnVuY3Rpb24oIGNoYW5nZWRDZWxsSW5kZXgsIHNlbGVjdGVkSW5kZXhEZWx0YSApIHtcbiAgLy8gVE9ETyB0aGlzIG1hdGggaXNuJ3QgcGVyZmVjdCB3aXRoIGdyb3VwZWQgc2xpZGVzXG4gIHNlbGVjdGVkSW5kZXhEZWx0YSA9IHNlbGVjdGVkSW5kZXhEZWx0YSB8fCAwO1xuICB0aGlzLnNlbGVjdGVkSW5kZXggKz0gc2VsZWN0ZWRJbmRleERlbHRhO1xuICB0aGlzLnNlbGVjdGVkSW5kZXggPSBNYXRoLm1heCggMCwgTWF0aC5taW4oIHRoaXMuc2xpZGVzLmxlbmd0aCAtIDEsIHRoaXMuc2VsZWN0ZWRJbmRleCApICk7XG5cbiAgdGhpcy5jZWxsQ2hhbmdlKCBjaGFuZ2VkQ2VsbEluZGV4LCB0cnVlICk7XG4gIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gIHRoaXMuZW1pdEV2ZW50KCAnY2VsbEFkZGVkUmVtb3ZlZCcsIFsgY2hhbmdlZENlbGxJbmRleCwgc2VsZWN0ZWRJbmRleERlbHRhIF0gKTtcbn07XG5cbi8qKlxuICogbG9naWMgdG8gYmUgcnVuIGFmdGVyIGEgY2VsbCdzIHNpemUgY2hhbmdlc1xuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtIC0gY2VsbCdzIGVsZW1lbnRcbiAqL1xucHJvdG8uY2VsbFNpemVDaGFuZ2UgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgdmFyIGNlbGwgPSB0aGlzLmdldENlbGwoIGVsZW0gKTtcbiAgaWYgKCAhY2VsbCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY2VsbC5nZXRTaXplKCk7XG5cbiAgdmFyIGluZGV4ID0gdGhpcy5jZWxscy5pbmRleE9mKCBjZWxsICk7XG4gIHRoaXMuY2VsbENoYW5nZSggaW5kZXggKTtcbn07XG5cbi8qKlxuICogbG9naWMgYW55IHRpbWUgYSBjZWxsIGlzIGNoYW5nZWQ6IGFkZGVkLCByZW1vdmVkLCBvciBzaXplIGNoYW5nZWRcbiAqIEBwYXJhbSB7SW50ZWdlcn0gY2hhbmdlZENlbGxJbmRleCAtIGluZGV4IG9mIHRoZSBjaGFuZ2VkIGNlbGwsIG9wdGlvbmFsXG4gKi9cbnByb3RvLmNlbGxDaGFuZ2UgPSBmdW5jdGlvbiggY2hhbmdlZENlbGxJbmRleCwgaXNQb3NpdGlvbmluZ1NsaWRlciApIHtcbiAgdmFyIHByZXZTbGlkZWFibGVXaWR0aCA9IHRoaXMuc2xpZGVhYmxlV2lkdGg7XG4gIHRoaXMuX3Bvc2l0aW9uQ2VsbHMoIGNoYW5nZWRDZWxsSW5kZXggKTtcbiAgdGhpcy5fZ2V0V3JhcFNoaWZ0Q2VsbHMoKTtcbiAgdGhpcy5zZXRHYWxsZXJ5U2l6ZSgpO1xuICB0aGlzLmVtaXRFdmVudCggJ2NlbGxDaGFuZ2UnLCBbIGNoYW5nZWRDZWxsSW5kZXggXSApO1xuICAvLyBwb3NpdGlvbiBzbGlkZXJcbiAgaWYgKCB0aGlzLm9wdGlvbnMuZnJlZVNjcm9sbCApIHtcbiAgICAvLyBzaGlmdCB4IGJ5IGNoYW5nZSBpbiBzbGlkZWFibGVXaWR0aFxuICAgIC8vIFRPRE8gZml4IHBvc2l0aW9uIHNoaWZ0cyB3aGVuIHByZXBlbmRpbmcgdy8gZnJlZVNjcm9sbFxuICAgIHZhciBkZWx0YVggPSBwcmV2U2xpZGVhYmxlV2lkdGggLSB0aGlzLnNsaWRlYWJsZVdpZHRoO1xuICAgIHRoaXMueCArPSBkZWx0YVggKiB0aGlzLmNlbGxBbGlnbjtcbiAgICB0aGlzLnBvc2l0aW9uU2xpZGVyKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gZG8gbm90IHBvc2l0aW9uIHNsaWRlciBhZnRlciBsYXp5IGxvYWRcbiAgICBpZiAoIGlzUG9zaXRpb25pbmdTbGlkZXIgKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uU2xpZGVyQXRTZWxlY3RlZCgpO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdCggdGhpcy5zZWxlY3RlZEluZGV4ICk7XG4gIH1cbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5yZXR1cm4gRmxpY2tpdHk7XG5cbn0pKTtcbiIsIi8vIGFuaW1hdGVcbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnZml6enktdWktdXRpbHMvdXRpbHMnXG4gICAgXSwgZnVuY3Rpb24oIHV0aWxzICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgdXRpbHMgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJ2Zpenp5LXVpLXV0aWxzJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgd2luZG93LkZsaWNraXR5ID0gd2luZG93LkZsaWNraXR5IHx8IHt9O1xuICAgIHdpbmRvdy5GbGlja2l0eS5hbmltYXRlUHJvdG90eXBlID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5maXp6eVVJVXRpbHNcbiAgICApO1xuICB9XG5cbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCB1dGlscyApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gZ2V0IHJBRiwgcHJlZml4ZWQsIGlmIHByZXNlbnRcbnZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbi8vIGZhbGxiYWNrIHRvIHNldFRpbWVvdXRcbnZhciBsYXN0VGltZSA9IDA7XG5pZiAoICFyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKSAge1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG4gICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCggMCwgMTYgLSAoIGN1cnJUaW1lIC0gbGFzdFRpbWUgKSApO1xuICAgIHZhciBpZCA9IHNldFRpbWVvdXQoIGNhbGxiYWNrLCB0aW1lVG9DYWxsICk7XG4gICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBhbmltYXRlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnZhciBwcm90byA9IHt9O1xuXG5wcm90by5zdGFydEFuaW1hdGlvbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIHRoaXMuaXNBbmltYXRpbmcgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5pc0FuaW1hdGluZyA9IHRydWU7XG4gIHRoaXMucmVzdGluZ0ZyYW1lcyA9IDA7XG4gIHRoaXMuYW5pbWF0ZSgpO1xufTtcblxucHJvdG8uYW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmFwcGx5RHJhZ0ZvcmNlKCk7XG4gIHRoaXMuYXBwbHlTZWxlY3RlZEF0dHJhY3Rpb24oKTtcblxuICB2YXIgcHJldmlvdXNYID0gdGhpcy54O1xuXG4gIHRoaXMuaW50ZWdyYXRlUGh5c2ljcygpO1xuICB0aGlzLnBvc2l0aW9uU2xpZGVyKCk7XG4gIHRoaXMuc2V0dGxlKCBwcmV2aW91c1ggKTtcbiAgLy8gYW5pbWF0ZSBuZXh0IGZyYW1lXG4gIGlmICggdGhpcy5pc0FuaW1hdGluZyApIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggZnVuY3Rpb24gYW5pbWF0ZUZyYW1lKCkge1xuICAgICAgX3RoaXMuYW5pbWF0ZSgpO1xuICAgIH0pO1xuICB9XG59O1xuXG5cbnZhciB0cmFuc2Zvcm1Qcm9wZXJ0eSA9ICggZnVuY3Rpb24gKCkge1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGU7XG4gIGlmICggdHlwZW9mIHN0eWxlLnRyYW5zZm9ybSA9PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gJ3RyYW5zZm9ybSc7XG4gIH1cbiAgcmV0dXJuICdXZWJraXRUcmFuc2Zvcm0nO1xufSkoKTtcblxucHJvdG8ucG9zaXRpb25TbGlkZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHggPSB0aGlzLng7XG4gIC8vIHdyYXAgcG9zaXRpb24gYXJvdW5kXG4gIGlmICggdGhpcy5vcHRpb25zLndyYXBBcm91bmQgJiYgdGhpcy5jZWxscy5sZW5ndGggPiAxICkge1xuICAgIHggPSB1dGlscy5tb2R1bG8oIHgsIHRoaXMuc2xpZGVhYmxlV2lkdGggKTtcbiAgICB4ID0geCAtIHRoaXMuc2xpZGVhYmxlV2lkdGg7XG4gICAgdGhpcy5zaGlmdFdyYXBDZWxscyggeCApO1xuICB9XG5cbiAgeCA9IHggKyB0aGlzLmN1cnNvclBvc2l0aW9uO1xuICAvLyByZXZlcnNlIGlmIHJpZ2h0LXRvLWxlZnQgYW5kIHVzaW5nIHRyYW5zZm9ybVxuICB4ID0gdGhpcy5vcHRpb25zLnJpZ2h0VG9MZWZ0ICYmIHRyYW5zZm9ybVByb3BlcnR5ID8gLXggOiB4O1xuICB2YXIgdmFsdWUgPSB0aGlzLmdldFBvc2l0aW9uVmFsdWUoIHggKTtcbiAgLy8gdXNlIDNEIHRyYW5mb3JtcyBmb3IgaGFyZHdhcmUgYWNjZWxlcmF0aW9uIG9uIGlPU1xuICAvLyBidXQgdXNlIDJEIHdoZW4gc2V0dGxlZCwgZm9yIGJldHRlciBmb250LXJlbmRlcmluZ1xuICB0aGlzLnNsaWRlci5zdHlsZVsgdHJhbnNmb3JtUHJvcGVydHkgXSA9IHRoaXMuaXNBbmltYXRpbmcgP1xuICAgICd0cmFuc2xhdGUzZCgnICsgdmFsdWUgKyAnLDAsMCknIDogJ3RyYW5zbGF0ZVgoJyArIHZhbHVlICsgJyknO1xuXG4gIC8vIHNjcm9sbCBldmVudFxuICB2YXIgZmlyc3RTbGlkZSA9IHRoaXMuc2xpZGVzWzBdO1xuICBpZiAoIGZpcnN0U2xpZGUgKSB7XG4gICAgdmFyIHBvc2l0aW9uWCA9IC10aGlzLnggLSBmaXJzdFNsaWRlLnRhcmdldDtcbiAgICB2YXIgcHJvZ3Jlc3MgPSBwb3NpdGlvblggLyB0aGlzLnNsaWRlc1dpZHRoO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudCggJ3Njcm9sbCcsIG51bGwsIFsgcHJvZ3Jlc3MsIHBvc2l0aW9uWCBdICk7XG4gIH1cbn07XG5cbnByb3RvLnBvc2l0aW9uU2xpZGVyQXRTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoICF0aGlzLmNlbGxzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy54ID0gLXRoaXMuc2VsZWN0ZWRTbGlkZS50YXJnZXQ7XG4gIHRoaXMucG9zaXRpb25TbGlkZXIoKTtcbn07XG5cbnByb3RvLmdldFBvc2l0aW9uVmFsdWUgPSBmdW5jdGlvbiggcG9zaXRpb24gKSB7XG4gIGlmICggdGhpcy5vcHRpb25zLnBlcmNlbnRQb3NpdGlvbiApIHtcbiAgICAvLyBwZXJjZW50IHBvc2l0aW9uLCByb3VuZCB0byAyIGRpZ2l0cywgbGlrZSAxMi4zNCVcbiAgICByZXR1cm4gKCBNYXRoLnJvdW5kKCAoIHBvc2l0aW9uIC8gdGhpcy5zaXplLmlubmVyV2lkdGggKSAqIDEwMDAwICkgKiAwLjAxICkrICclJztcbiAgfSBlbHNlIHtcbiAgICAvLyBwaXhlbCBwb3NpdGlvbmluZ1xuICAgIHJldHVybiBNYXRoLnJvdW5kKCBwb3NpdGlvbiApICsgJ3B4JztcbiAgfVxufTtcblxucHJvdG8uc2V0dGxlID0gZnVuY3Rpb24oIHByZXZpb3VzWCApIHtcbiAgLy8ga2VlcCB0cmFjayBvZiBmcmFtZXMgd2hlcmUgeCBoYXNuJ3QgbW92ZWRcbiAgaWYgKCAhdGhpcy5pc1BvaW50ZXJEb3duICYmIE1hdGgucm91bmQoIHRoaXMueCAqIDEwMCApID09IE1hdGgucm91bmQoIHByZXZpb3VzWCAqIDEwMCApICkge1xuICAgIHRoaXMucmVzdGluZ0ZyYW1lcysrO1xuICB9XG4gIC8vIHN0b3AgYW5pbWF0aW5nIGlmIHJlc3RpbmcgZm9yIDMgb3IgbW9yZSBmcmFtZXNcbiAgaWYgKCB0aGlzLnJlc3RpbmdGcmFtZXMgPiAyICkge1xuICAgIHRoaXMuaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICBkZWxldGUgdGhpcy5pc0ZyZWVTY3JvbGxpbmc7XG4gICAgLy8gcmVuZGVyIHBvc2l0aW9uIHdpdGggdHJhbnNsYXRlWCB3aGVuIHNldHRsZWRcbiAgICB0aGlzLnBvc2l0aW9uU2xpZGVyKCk7XG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdzZXR0bGUnKTtcbiAgfVxufTtcblxucHJvdG8uc2hpZnRXcmFwQ2VsbHMgPSBmdW5jdGlvbiggeCApIHtcbiAgLy8gc2hpZnQgYmVmb3JlIGNlbGxzXG4gIHZhciBiZWZvcmVHYXAgPSB0aGlzLmN1cnNvclBvc2l0aW9uICsgeDtcbiAgdGhpcy5fc2hpZnRDZWxscyggdGhpcy5iZWZvcmVTaGlmdENlbGxzLCBiZWZvcmVHYXAsIC0xICk7XG4gIC8vIHNoaWZ0IGFmdGVyIGNlbGxzXG4gIHZhciBhZnRlckdhcCA9IHRoaXMuc2l6ZS5pbm5lcldpZHRoIC0gKCB4ICsgdGhpcy5zbGlkZWFibGVXaWR0aCArIHRoaXMuY3Vyc29yUG9zaXRpb24gKTtcbiAgdGhpcy5fc2hpZnRDZWxscyggdGhpcy5hZnRlclNoaWZ0Q2VsbHMsIGFmdGVyR2FwLCAxICk7XG59O1xuXG5wcm90by5fc2hpZnRDZWxscyA9IGZ1bmN0aW9uKCBjZWxscywgZ2FwLCBzaGlmdCApIHtcbiAgZm9yICggdmFyIGk9MDsgaSA8IGNlbGxzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBjZWxsID0gY2VsbHNbaV07XG4gICAgdmFyIGNlbGxTaGlmdCA9IGdhcCA+IDAgPyBzaGlmdCA6IDA7XG4gICAgY2VsbC53cmFwU2hpZnQoIGNlbGxTaGlmdCApO1xuICAgIGdhcCAtPSBjZWxsLnNpemUub3V0ZXJXaWR0aDtcbiAgfVxufTtcblxucHJvdG8uX3Vuc2hpZnRDZWxscyA9IGZ1bmN0aW9uKCBjZWxscyApIHtcbiAgaWYgKCAhY2VsbHMgfHwgIWNlbGxzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICggdmFyIGk9MDsgaSA8IGNlbGxzLmxlbmd0aDsgaSsrICkge1xuICAgIGNlbGxzW2ldLndyYXBTaGlmdCggMCApO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBwaHlzaWNzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnByb3RvLmludGVncmF0ZVBoeXNpY3MgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy54ICs9IHRoaXMudmVsb2NpdHk7XG4gIHRoaXMudmVsb2NpdHkgKj0gdGhpcy5nZXRGcmljdGlvbkZhY3RvcigpO1xufTtcblxucHJvdG8uYXBwbHlGb3JjZSA9IGZ1bmN0aW9uKCBmb3JjZSApIHtcbiAgdGhpcy52ZWxvY2l0eSArPSBmb3JjZTtcbn07XG5cbnByb3RvLmdldEZyaWN0aW9uRmFjdG9yID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAxIC0gdGhpcy5vcHRpb25zWyB0aGlzLmlzRnJlZVNjcm9sbGluZyA/ICdmcmVlU2Nyb2xsRnJpY3Rpb24nIDogJ2ZyaWN0aW9uJyBdO1xufTtcblxucHJvdG8uZ2V0UmVzdGluZ1Bvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIC8vIG15IHRoYW5rcyB0byBTdGV2ZW4gV2l0dGVucywgd2hvIHNpbXBsaWZpZWQgdGhpcyBtYXRoIGdyZWF0bHlcbiAgcmV0dXJuIHRoaXMueCArIHRoaXMudmVsb2NpdHkgLyAoIDEgLSB0aGlzLmdldEZyaWN0aW9uRmFjdG9yKCkgKTtcbn07XG5cbnByb3RvLmFwcGx5RHJhZ0ZvcmNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMuaXNQb2ludGVyRG93biApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gY2hhbmdlIHRoZSBwb3NpdGlvbiB0byBkcmFnIHBvc2l0aW9uIGJ5IGFwcGx5aW5nIGZvcmNlXG4gIHZhciBkcmFnVmVsb2NpdHkgPSB0aGlzLmRyYWdYIC0gdGhpcy54O1xuICB2YXIgZHJhZ0ZvcmNlID0gZHJhZ1ZlbG9jaXR5IC0gdGhpcy52ZWxvY2l0eTtcbiAgdGhpcy5hcHBseUZvcmNlKCBkcmFnRm9yY2UgKTtcbn07XG5cbnByb3RvLmFwcGx5U2VsZWN0ZWRBdHRyYWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gIC8vIGRvIG5vdCBhdHRyYWN0IGlmIHBvaW50ZXIgZG93biBvciBubyBjZWxsc1xuICBpZiAoIHRoaXMuaXNQb2ludGVyRG93biB8fCB0aGlzLmlzRnJlZVNjcm9sbGluZyB8fCAhdGhpcy5jZWxscy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBkaXN0YW5jZSA9IHRoaXMuc2VsZWN0ZWRTbGlkZS50YXJnZXQgKiAtMSAtIHRoaXMueDtcbiAgdmFyIGZvcmNlID0gZGlzdGFuY2UgKiB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRBdHRyYWN0aW9uO1xuICB0aGlzLmFwcGx5Rm9yY2UoIGZvcmNlICk7XG59O1xuXG5yZXR1cm4gcHJvdG87XG5cbn0pKTtcbiIsIi8vIEZsaWNraXR5LkNlbGxcbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnZ2V0LXNpemUvZ2V0LXNpemUnXG4gICAgXSwgZnVuY3Rpb24oIGdldFNpemUgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBnZXRTaXplICk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICByZXF1aXJlKCdnZXQtc2l6ZScpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5GbGlja2l0eSA9IHdpbmRvdy5GbGlja2l0eSB8fCB7fTtcbiAgICB3aW5kb3cuRmxpY2tpdHkuQ2VsbCA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICB3aW5kb3cuZ2V0U2l6ZVxuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIGdldFNpemUgKSB7XG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gQ2VsbCggZWxlbSwgcGFyZW50ICkge1xuICB0aGlzLmVsZW1lbnQgPSBlbGVtO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICB0aGlzLmNyZWF0ZSgpO1xufVxuXG52YXIgcHJvdG8gPSBDZWxsLnByb3RvdHlwZTtcblxucHJvdG8uY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gIHRoaXMueCA9IDA7XG4gIHRoaXMuc2hpZnQgPSAwO1xufTtcblxucHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAvLyByZXNldCBzdHlsZVxuICB0aGlzLmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgdmFyIHNpZGUgPSB0aGlzLnBhcmVudC5vcmlnaW5TaWRlO1xuICB0aGlzLmVsZW1lbnQuc3R5bGVbIHNpZGUgXSA9ICcnO1xufTtcblxucHJvdG8uZ2V0U2l6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNpemUgPSBnZXRTaXplKCB0aGlzLmVsZW1lbnQgKTtcbn07XG5cbnByb3RvLnNldFBvc2l0aW9uID0gZnVuY3Rpb24oIHggKSB7XG4gIHRoaXMueCA9IHg7XG4gIHRoaXMudXBkYXRlVGFyZ2V0KCk7XG4gIHRoaXMucmVuZGVyUG9zaXRpb24oIHggKTtcbn07XG5cbi8vIHNldERlZmF1bHRUYXJnZXQgdjEgbWV0aG9kLCBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgcmVtb3ZlIGluIHYzXG5wcm90by51cGRhdGVUYXJnZXQgPSBwcm90by5zZXREZWZhdWx0VGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtYXJnaW5Qcm9wZXJ0eSA9IHRoaXMucGFyZW50Lm9yaWdpblNpZGUgPT0gJ2xlZnQnID8gJ21hcmdpbkxlZnQnIDogJ21hcmdpblJpZ2h0JztcbiAgdGhpcy50YXJnZXQgPSB0aGlzLnggKyB0aGlzLnNpemVbIG1hcmdpblByb3BlcnR5IF0gK1xuICAgIHRoaXMuc2l6ZS53aWR0aCAqIHRoaXMucGFyZW50LmNlbGxBbGlnbjtcbn07XG5cbnByb3RvLnJlbmRlclBvc2l0aW9uID0gZnVuY3Rpb24oIHggKSB7XG4gIC8vIHJlbmRlciBwb3NpdGlvbiBvZiBjZWxsIHdpdGggaW4gc2xpZGVyXG4gIHZhciBzaWRlID0gdGhpcy5wYXJlbnQub3JpZ2luU2lkZTtcbiAgdGhpcy5lbGVtZW50LnN0eWxlWyBzaWRlIF0gPSB0aGlzLnBhcmVudC5nZXRQb3NpdGlvblZhbHVlKCB4ICk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7SW50ZWdlcn0gZmFjdG9yIC0gMCwgMSwgb3IgLTFcbioqL1xucHJvdG8ud3JhcFNoaWZ0ID0gZnVuY3Rpb24oIHNoaWZ0ICkge1xuICB0aGlzLnNoaWZ0ID0gc2hpZnQ7XG4gIHRoaXMucmVuZGVyUG9zaXRpb24oIHRoaXMueCArIHRoaXMucGFyZW50LnNsaWRlYWJsZVdpZHRoICogc2hpZnQgKTtcbn07XG5cbnByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggdGhpcy5lbGVtZW50ICk7XG59O1xuXG5yZXR1cm4gQ2VsbDtcblxufSkpO1xuIiwiLy8gZHJhZ1xuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICcuL2ZsaWNraXR5JyxcbiAgICAgICd1bmlkcmFnZ2VyL3VuaWRyYWdnZXInLFxuICAgICAgJ2Zpenp5LXVpLXV0aWxzL3V0aWxzJ1xuICAgIF0sIGZ1bmN0aW9uKCBGbGlja2l0eSwgVW5pZHJhZ2dlciwgdXRpbHMgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBGbGlja2l0eSwgVW5pZHJhZ2dlciwgdXRpbHMgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJy4vZmxpY2tpdHknKSxcbiAgICAgIHJlcXVpcmUoJ3VuaWRyYWdnZXInKSxcbiAgICAgIHJlcXVpcmUoJ2Zpenp5LXVpLXV0aWxzJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgd2luZG93LkZsaWNraXR5ID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5GbGlja2l0eSxcbiAgICAgIHdpbmRvdy5VbmlkcmFnZ2VyLFxuICAgICAgd2luZG93LmZpenp5VUlVdGlsc1xuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIEZsaWNraXR5LCBVbmlkcmFnZ2VyLCB1dGlscyApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLSBkZWZhdWx0cyAtLS0tLSAvL1xuXG51dGlscy5leHRlbmQoIEZsaWNraXR5LmRlZmF1bHRzLCB7XG4gIGRyYWdnYWJsZTogdHJ1ZSxcbiAgZHJhZ1RocmVzaG9sZDogMyxcbn0pO1xuXG4vLyAtLS0tLSBjcmVhdGUgLS0tLS0gLy9cblxuRmxpY2tpdHkuY3JlYXRlTWV0aG9kcy5wdXNoKCdfY3JlYXRlRHJhZycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkcmFnIHByb3RvdHlwZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG52YXIgcHJvdG8gPSBGbGlja2l0eS5wcm90b3R5cGU7XG51dGlscy5leHRlbmQoIHByb3RvLCBVbmlkcmFnZ2VyLnByb3RvdHlwZSApO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxudmFyIGlzVG91Y2ggPSAnY3JlYXRlVG91Y2gnIGluIGRvY3VtZW50O1xudmFyIGlzVG91Y2htb3ZlU2Nyb2xsQ2FuY2VsZWQgPSBmYWxzZTtcblxucHJvdG8uX2NyZWF0ZURyYWcgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vbiggJ2FjdGl2YXRlJywgdGhpcy5iaW5kRHJhZyApO1xuICB0aGlzLm9uKCAndWlDaGFuZ2UnLCB0aGlzLl91aUNoYW5nZURyYWcgKTtcbiAgdGhpcy5vbiggJ2NoaWxkVUlQb2ludGVyRG93bicsIHRoaXMuX2NoaWxkVUlQb2ludGVyRG93bkRyYWcgKTtcbiAgdGhpcy5vbiggJ2RlYWN0aXZhdGUnLCB0aGlzLnVuYmluZERyYWcgKTtcbiAgLy8gSEFDSyAtIGFkZCBzZWVtaW5nbHkgaW5ub2N1b3VzIGhhbmRsZXIgdG8gZml4IGlPUyAxMCBzY3JvbGwgYmVoYXZpb3JcbiAgLy8gIzQ1NywgUnViYVhhL1NvcnRhYmxlIzk3M1xuICBpZiAoIGlzVG91Y2ggJiYgIWlzVG91Y2htb3ZlU2Nyb2xsQ2FuY2VsZWQgKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCBmdW5jdGlvbigpIHt9KTtcbiAgICBpc1RvdWNobW92ZVNjcm9sbENhbmNlbGVkID0gdHJ1ZTtcbiAgfVxufTtcblxucHJvdG8uYmluZERyYWcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5vcHRpb25zLmRyYWdnYWJsZSB8fCB0aGlzLmlzRHJhZ0JvdW5kICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtZHJhZ2dhYmxlJyk7XG4gIHRoaXMuaGFuZGxlcyA9IFsgdGhpcy52aWV3cG9ydCBdO1xuICB0aGlzLmJpbmRIYW5kbGVzKCk7XG4gIHRoaXMuaXNEcmFnQm91bmQgPSB0cnVlO1xufTtcblxucHJvdG8udW5iaW5kRHJhZyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoICF0aGlzLmlzRHJhZ0JvdW5kICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZHJhZ2dhYmxlJyk7XG4gIHRoaXMudW5iaW5kSGFuZGxlcygpO1xuICBkZWxldGUgdGhpcy5pc0RyYWdCb3VuZDtcbn07XG5cbnByb3RvLl91aUNoYW5nZURyYWcgPSBmdW5jdGlvbigpIHtcbiAgZGVsZXRlIHRoaXMuaXNGcmVlU2Nyb2xsaW5nO1xufTtcblxucHJvdG8uX2NoaWxkVUlQb2ludGVyRG93bkRyYWcgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIHRoaXMucG9pbnRlckRvd25Gb2N1cyggZXZlbnQgKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHBvaW50ZXIgZXZlbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIG5vZGVzIHRoYXQgaGF2ZSB0ZXh0IGZpZWxkc1xudmFyIGN1cnNvck5vZGVzID0ge1xuICBURVhUQVJFQTogdHJ1ZSxcbiAgSU5QVVQ6IHRydWUsXG4gIE9QVElPTjogdHJ1ZSxcbn07XG5cbi8vIGlucHV0IHR5cGVzIHRoYXQgZG8gbm90IGhhdmUgdGV4dCBmaWVsZHNcbnZhciBjbGlja1R5cGVzID0ge1xuICByYWRpbzogdHJ1ZSxcbiAgY2hlY2tib3g6IHRydWUsXG4gIGJ1dHRvbjogdHJ1ZSxcbiAgc3VibWl0OiB0cnVlLFxuICBpbWFnZTogdHJ1ZSxcbiAgZmlsZTogdHJ1ZSxcbn07XG5cbnByb3RvLnBvaW50ZXJEb3duID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICAvLyBkaXNtaXNzIGlucHV0cyB3aXRoIHRleHQgZmllbGRzLiAjNDAzLCAjNDA0XG4gIHZhciBpc0N1cnNvcklucHV0ID0gY3Vyc29yTm9kZXNbIGV2ZW50LnRhcmdldC5ub2RlTmFtZSBdICYmXG4gICAgIWNsaWNrVHlwZXNbIGV2ZW50LnRhcmdldC50eXBlIF07XG4gIGlmICggaXNDdXJzb3JJbnB1dCApIHtcbiAgICAvLyByZXNldCBwb2ludGVyRG93biBsb2dpY1xuICAgIHRoaXMuaXNQb2ludGVyRG93biA9IGZhbHNlO1xuICAgIGRlbGV0ZSB0aGlzLnBvaW50ZXJJZGVudGlmaWVyO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2RyYWdQb2ludGVyRG93biggZXZlbnQsIHBvaW50ZXIgKTtcblxuICAvLyBrbHVkZ2UgdG8gYmx1ciBmb2N1c2VkIGlucHV0cyBpbiBkcmFnZ2VyXG4gIHZhciBmb2N1c2VkID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgaWYgKCBmb2N1c2VkICYmIGZvY3VzZWQuYmx1ciAmJiBmb2N1c2VkICE9IHRoaXMuZWxlbWVudCAmJlxuICAgIC8vIGRvIG5vdCBibHVyIGJvZHkgZm9yIElFOSAmIDEwLCAjMTE3XG4gICAgZm9jdXNlZCAhPSBkb2N1bWVudC5ib2R5ICkge1xuICAgIGZvY3VzZWQuYmx1cigpO1xuICB9XG4gIHRoaXMucG9pbnRlckRvd25Gb2N1cyggZXZlbnQgKTtcbiAgLy8gc3RvcCBpZiBpdCB3YXMgbW92aW5nXG4gIHRoaXMuZHJhZ1ggPSB0aGlzLng7XG4gIHRoaXMudmlld3BvcnQuY2xhc3NMaXN0LmFkZCgnaXMtcG9pbnRlci1kb3duJyk7XG4gIC8vIGJpbmQgbW92ZSBhbmQgZW5kIGV2ZW50c1xuICB0aGlzLl9iaW5kUG9zdFN0YXJ0RXZlbnRzKCBldmVudCApO1xuICAvLyB0cmFjayBzY3JvbGxpbmdcbiAgdGhpcy5wb2ludGVyRG93blNjcm9sbCA9IGdldFNjcm9sbFBvc2l0aW9uKCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnc2Nyb2xsJywgdGhpcyApO1xuXG4gIHRoaXMuZGlzcGF0Y2hFdmVudCggJ3BvaW50ZXJEb3duJywgZXZlbnQsIFsgcG9pbnRlciBdICk7XG59O1xuXG52YXIgdG91Y2hTdGFydEV2ZW50cyA9IHtcbiAgdG91Y2hzdGFydDogdHJ1ZSxcbiAgTVNQb2ludGVyRG93bjogdHJ1ZVxufTtcblxudmFyIGZvY3VzTm9kZXMgPSB7XG4gIElOUFVUOiB0cnVlLFxuICBTRUxFQ1Q6IHRydWVcbn07XG5cbnByb3RvLnBvaW50ZXJEb3duRm9jdXMgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIC8vIGZvY3VzIGVsZW1lbnQsIGlmIG5vdCB0b3VjaCwgYW5kIGl0cyBub3QgYW4gaW5wdXQgb3Igc2VsZWN0XG4gIGlmICggIXRoaXMub3B0aW9ucy5hY2Nlc3NpYmlsaXR5IHx8IHRvdWNoU3RhcnRFdmVudHNbIGV2ZW50LnR5cGUgXSB8fFxuICAgICAgZm9jdXNOb2Rlc1sgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lIF0gKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBwcmV2U2Nyb2xsWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgdGhpcy5lbGVtZW50LmZvY3VzKCk7XG4gIC8vIGhhY2sgdG8gZml4IHNjcm9sbCBqdW1wIGFmdGVyIGZvY3VzLCAjNzZcbiAgaWYgKCB3aW5kb3cucGFnZVlPZmZzZXQgIT0gcHJldlNjcm9sbFkgKSB7XG4gICAgd2luZG93LnNjcm9sbFRvKCB3aW5kb3cucGFnZVhPZmZzZXQsIHByZXZTY3JvbGxZICk7XG4gIH1cbn07XG5cbnByb3RvLmNhblByZXZlbnREZWZhdWx0T25Qb2ludGVyRG93biA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgLy8gcHJldmVudCBkZWZhdWx0LCB1bmxlc3MgdG91Y2hzdGFydCBvciA8c2VsZWN0PlxuICB2YXIgaXNUb3VjaHN0YXJ0ID0gZXZlbnQudHlwZSA9PSAndG91Y2hzdGFydCc7XG4gIHZhciB0YXJnZXROb2RlTmFtZSA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZTtcbiAgcmV0dXJuICFpc1RvdWNoc3RhcnQgJiYgdGFyZ2V0Tm9kZU5hbWUgIT0gJ1NFTEVDVCc7XG59O1xuXG4vLyAtLS0tLSBtb3ZlIC0tLS0tIC8vXG5cbnByb3RvLmhhc0RyYWdTdGFydGVkID0gZnVuY3Rpb24oIG1vdmVWZWN0b3IgKSB7XG4gIHJldHVybiBNYXRoLmFicyggbW92ZVZlY3Rvci54ICkgPiB0aGlzLm9wdGlvbnMuZHJhZ1RocmVzaG9sZDtcbn07XG5cbi8vIC0tLS0tIHVwIC0tLS0tIC8vXG5cbnByb3RvLnBvaW50ZXJVcCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgZGVsZXRlIHRoaXMuaXNUb3VjaFNjcm9sbGluZztcbiAgdGhpcy52aWV3cG9ydC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1wb2ludGVyLWRvd24nKTtcbiAgdGhpcy5kaXNwYXRjaEV2ZW50KCAncG9pbnRlclVwJywgZXZlbnQsIFsgcG9pbnRlciBdICk7XG4gIHRoaXMuX2RyYWdQb2ludGVyVXAoIGV2ZW50LCBwb2ludGVyICk7XG59O1xuXG5wcm90by5wb2ludGVyRG9uZSA9IGZ1bmN0aW9uKCkge1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIHRoaXMgKTtcbiAgZGVsZXRlIHRoaXMucG9pbnRlckRvd25TY3JvbGw7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkcmFnZ2luZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5wcm90by5kcmFnU3RhcnQgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHRoaXMuZHJhZ1N0YXJ0UG9zaXRpb24gPSB0aGlzLng7XG4gIHRoaXMuc3RhcnRBbmltYXRpb24oKTtcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCB0aGlzICk7XG4gIHRoaXMuZGlzcGF0Y2hFdmVudCggJ2RyYWdTdGFydCcsIGV2ZW50LCBbIHBvaW50ZXIgXSApO1xufTtcblxucHJvdG8ucG9pbnRlck1vdmUgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHZhciBtb3ZlVmVjdG9yID0gdGhpcy5fZHJhZ1BvaW50ZXJNb3ZlKCBldmVudCwgcG9pbnRlciApO1xuICB0aGlzLmRpc3BhdGNoRXZlbnQoICdwb2ludGVyTW92ZScsIGV2ZW50LCBbIHBvaW50ZXIsIG1vdmVWZWN0b3IgXSApO1xuICB0aGlzLl9kcmFnTW92ZSggZXZlbnQsIHBvaW50ZXIsIG1vdmVWZWN0b3IgKTtcbn07XG5cbnByb3RvLmRyYWdNb3ZlID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyLCBtb3ZlVmVjdG9yICkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIHRoaXMucHJldmlvdXNEcmFnWCA9IHRoaXMuZHJhZ1g7XG4gIC8vIHJldmVyc2UgaWYgcmlnaHQtdG8tbGVmdFxuICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLnJpZ2h0VG9MZWZ0ID8gLTEgOiAxO1xuICB2YXIgZHJhZ1ggPSB0aGlzLmRyYWdTdGFydFBvc2l0aW9uICsgbW92ZVZlY3Rvci54ICogZGlyZWN0aW9uO1xuXG4gIGlmICggIXRoaXMub3B0aW9ucy53cmFwQXJvdW5kICYmIHRoaXMuc2xpZGVzLmxlbmd0aCApIHtcbiAgICAvLyBzbG93IGRyYWdcbiAgICB2YXIgb3JpZ2luQm91bmQgPSBNYXRoLm1heCggLXRoaXMuc2xpZGVzWzBdLnRhcmdldCwgdGhpcy5kcmFnU3RhcnRQb3NpdGlvbiApO1xuICAgIGRyYWdYID0gZHJhZ1ggPiBvcmlnaW5Cb3VuZCA/ICggZHJhZ1ggKyBvcmlnaW5Cb3VuZCApICogMC41IDogZHJhZ1g7XG4gICAgdmFyIGVuZEJvdW5kID0gTWF0aC5taW4oIC10aGlzLmdldExhc3RTbGlkZSgpLnRhcmdldCwgdGhpcy5kcmFnU3RhcnRQb3NpdGlvbiApO1xuICAgIGRyYWdYID0gZHJhZ1ggPCBlbmRCb3VuZCA/ICggZHJhZ1ggKyBlbmRCb3VuZCApICogMC41IDogZHJhZ1g7XG4gIH1cblxuICB0aGlzLmRyYWdYID0gZHJhZ1g7XG5cbiAgdGhpcy5kcmFnTW92ZVRpbWUgPSBuZXcgRGF0ZSgpO1xuICB0aGlzLmRpc3BhdGNoRXZlbnQoICdkcmFnTW92ZScsIGV2ZW50LCBbIHBvaW50ZXIsIG1vdmVWZWN0b3IgXSApO1xufTtcblxucHJvdG8uZHJhZ0VuZCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgaWYgKCB0aGlzLm9wdGlvbnMuZnJlZVNjcm9sbCApIHtcbiAgICB0aGlzLmlzRnJlZVNjcm9sbGluZyA9IHRydWU7XG4gIH1cbiAgLy8gc2V0IHNlbGVjdGVkSW5kZXggYmFzZWQgb24gd2hlcmUgZmxpY2sgd2lsbCBlbmQgdXBcbiAgdmFyIGluZGV4ID0gdGhpcy5kcmFnRW5kUmVzdGluZ1NlbGVjdCgpO1xuXG4gIGlmICggdGhpcy5vcHRpb25zLmZyZWVTY3JvbGwgJiYgIXRoaXMub3B0aW9ucy53cmFwQXJvdW5kICkge1xuICAgIC8vIGlmIGZyZWUtc2Nyb2xsICYgbm90IHdyYXAgYXJvdW5kXG4gICAgLy8gZG8gbm90IGZyZWUtc2Nyb2xsIGlmIGdvaW5nIG91dHNpZGUgb2YgYm91bmRpbmcgc2xpZGVzXG4gICAgLy8gc28gYm91bmRpbmcgc2xpZGVzIGNhbiBhdHRyYWN0IHNsaWRlciwgYW5kIGtlZXAgaXQgaW4gYm91bmRzXG4gICAgdmFyIHJlc3RpbmdYID0gdGhpcy5nZXRSZXN0aW5nUG9zaXRpb24oKTtcbiAgICB0aGlzLmlzRnJlZVNjcm9sbGluZyA9IC1yZXN0aW5nWCA+IHRoaXMuc2xpZGVzWzBdLnRhcmdldCAmJlxuICAgICAgLXJlc3RpbmdYIDwgdGhpcy5nZXRMYXN0U2xpZGUoKS50YXJnZXQ7XG4gIH0gZWxzZSBpZiAoICF0aGlzLm9wdGlvbnMuZnJlZVNjcm9sbCAmJiBpbmRleCA9PSB0aGlzLnNlbGVjdGVkSW5kZXggKSB7XG4gICAgLy8gYm9vc3Qgc2VsZWN0aW9uIGlmIHNlbGVjdGVkIGluZGV4IGhhcyBub3QgY2hhbmdlZFxuICAgIGluZGV4ICs9IHRoaXMuZHJhZ0VuZEJvb3N0U2VsZWN0KCk7XG4gIH1cbiAgZGVsZXRlIHRoaXMucHJldmlvdXNEcmFnWDtcbiAgLy8gYXBwbHkgc2VsZWN0aW9uXG4gIC8vIFRPRE8gcmVmYWN0b3IgdGhpcywgc2VsZWN0aW5nIGhlcmUgZmVlbHMgd2VpcmRcbiAgLy8gSEFDSywgc2V0IGZsYWcgc28gZHJhZ2dpbmcgc3RheXMgaW4gY29ycmVjdCBkaXJlY3Rpb25cbiAgdGhpcy5pc0RyYWdTZWxlY3QgPSB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZDtcbiAgdGhpcy5zZWxlY3QoIGluZGV4ICk7XG4gIGRlbGV0ZSB0aGlzLmlzRHJhZ1NlbGVjdDtcbiAgdGhpcy5kaXNwYXRjaEV2ZW50KCAnZHJhZ0VuZCcsIGV2ZW50LCBbIHBvaW50ZXIgXSApO1xufTtcblxucHJvdG8uZHJhZ0VuZFJlc3RpbmdTZWxlY3QgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc3RpbmdYID0gdGhpcy5nZXRSZXN0aW5nUG9zaXRpb24oKTtcbiAgLy8gaG93IGZhciBhd2F5IGZyb20gc2VsZWN0ZWQgc2xpZGVcbiAgdmFyIGRpc3RhbmNlID0gTWF0aC5hYnMoIHRoaXMuZ2V0U2xpZGVEaXN0YW5jZSggLXJlc3RpbmdYLCB0aGlzLnNlbGVjdGVkSW5kZXggKSApO1xuICAvLyBnZXQgY2xvc2V0IHJlc3RpbmcgZ29pbmcgdXAgYW5kIGdvaW5nIGRvd25cbiAgdmFyIHBvc2l0aXZlUmVzdGluZyA9IHRoaXMuX2dldENsb3Nlc3RSZXN0aW5nKCByZXN0aW5nWCwgZGlzdGFuY2UsIDEgKTtcbiAgdmFyIG5lZ2F0aXZlUmVzdGluZyA9IHRoaXMuX2dldENsb3Nlc3RSZXN0aW5nKCByZXN0aW5nWCwgZGlzdGFuY2UsIC0xICk7XG4gIC8vIHVzZSBjbG9zZXIgcmVzdGluZyBmb3Igd3JhcC1hcm91bmRcbiAgdmFyIGluZGV4ID0gcG9zaXRpdmVSZXN0aW5nLmRpc3RhbmNlIDwgbmVnYXRpdmVSZXN0aW5nLmRpc3RhbmNlID9cbiAgICBwb3NpdGl2ZVJlc3RpbmcuaW5kZXggOiBuZWdhdGl2ZVJlc3RpbmcuaW5kZXg7XG4gIHJldHVybiBpbmRleDtcbn07XG5cbi8qKlxuICogZ2l2ZW4gcmVzdGluZyBYIGFuZCBkaXN0YW5jZSB0byBzZWxlY3RlZCBjZWxsXG4gKiBnZXQgdGhlIGRpc3RhbmNlIGFuZCBpbmRleCBvZiB0aGUgY2xvc2VzdCBjZWxsXG4gKiBAcGFyYW0ge051bWJlcn0gcmVzdGluZ1ggLSBlc3RpbWF0ZWQgcG9zdC1mbGljayByZXN0aW5nIHBvc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBkaXN0YW5jZSB0byBzZWxlY3RlZCBjZWxsXG4gKiBAcGFyYW0ge0ludGVnZXJ9IGluY3JlbWVudCAtICsxIG9yIC0xLCBnb2luZyB1cCBvciBkb3duXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAtIHsgZGlzdGFuY2U6IHtOdW1iZXJ9LCBpbmRleDoge0ludGVnZXJ9IH1cbiAqL1xucHJvdG8uX2dldENsb3Nlc3RSZXN0aW5nID0gZnVuY3Rpb24oIHJlc3RpbmdYLCBkaXN0YW5jZSwgaW5jcmVtZW50ICkge1xuICB2YXIgaW5kZXggPSB0aGlzLnNlbGVjdGVkSW5kZXg7XG4gIHZhciBtaW5EaXN0YW5jZSA9IEluZmluaXR5O1xuICB2YXIgY29uZGl0aW9uID0gdGhpcy5vcHRpb25zLmNvbnRhaW4gJiYgIXRoaXMub3B0aW9ucy53cmFwQXJvdW5kID9cbiAgICAvLyBpZiBjb250YWluLCBrZWVwIGdvaW5nIGlmIGRpc3RhbmNlIGlzIGVxdWFsIHRvIG1pbkRpc3RhbmNlXG4gICAgZnVuY3Rpb24oIGQsIG1kICkgeyByZXR1cm4gZCA8PSBtZDsgfSA6IGZ1bmN0aW9uKCBkLCBtZCApIHsgcmV0dXJuIGQgPCBtZDsgfTtcbiAgd2hpbGUgKCBjb25kaXRpb24oIGRpc3RhbmNlLCBtaW5EaXN0YW5jZSApICkge1xuICAgIC8vIG1lYXN1cmUgZGlzdGFuY2UgdG8gbmV4dCBjZWxsXG4gICAgaW5kZXggKz0gaW5jcmVtZW50O1xuICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgZGlzdGFuY2UgPSB0aGlzLmdldFNsaWRlRGlzdGFuY2UoIC1yZXN0aW5nWCwgaW5kZXggKTtcbiAgICBpZiAoIGRpc3RhbmNlID09PSBudWxsICkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGRpc3RhbmNlID0gTWF0aC5hYnMoIGRpc3RhbmNlICk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBkaXN0YW5jZTogbWluRGlzdGFuY2UsXG4gICAgLy8gc2VsZWN0ZWQgd2FzIHByZXZpb3VzIGluZGV4XG4gICAgaW5kZXg6IGluZGV4IC0gaW5jcmVtZW50XG4gIH07XG59O1xuXG4vKipcbiAqIG1lYXN1cmUgZGlzdGFuY2UgYmV0d2VlbiB4IGFuZCBhIHNsaWRlIHRhcmdldFxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaW5kZXggLSBzbGlkZSBpbmRleFxuICovXG5wcm90by5nZXRTbGlkZURpc3RhbmNlID0gZnVuY3Rpb24oIHgsIGluZGV4ICkge1xuICB2YXIgbGVuID0gdGhpcy5zbGlkZXMubGVuZ3RoO1xuICAvLyB3cmFwIGFyb3VuZCBpZiBhdCBsZWFzdCAyIHNsaWRlc1xuICB2YXIgaXNXcmFwQXJvdW5kID0gdGhpcy5vcHRpb25zLndyYXBBcm91bmQgJiYgbGVuID4gMTtcbiAgdmFyIHNsaWRlSW5kZXggPSBpc1dyYXBBcm91bmQgPyB1dGlscy5tb2R1bG8oIGluZGV4LCBsZW4gKSA6IGluZGV4O1xuICB2YXIgc2xpZGUgPSB0aGlzLnNsaWRlc1sgc2xpZGVJbmRleCBdO1xuICBpZiAoICFzbGlkZSApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvLyBhZGQgZGlzdGFuY2UgZm9yIHdyYXAtYXJvdW5kIHNsaWRlc1xuICB2YXIgd3JhcCA9IGlzV3JhcEFyb3VuZCA/IHRoaXMuc2xpZGVhYmxlV2lkdGggKiBNYXRoLmZsb29yKCBpbmRleCAvIGxlbiApIDogMDtcbiAgcmV0dXJuIHggLSAoIHNsaWRlLnRhcmdldCArIHdyYXAgKTtcbn07XG5cbnByb3RvLmRyYWdFbmRCb29zdFNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuICAvLyBkbyBub3QgYm9vc3QgaWYgbm8gcHJldmlvdXNEcmFnWCBvciBkcmFnTW92ZVRpbWVcbiAgaWYgKCB0aGlzLnByZXZpb3VzRHJhZ1ggPT09IHVuZGVmaW5lZCB8fCAhdGhpcy5kcmFnTW92ZVRpbWUgfHxcbiAgICAvLyBvciBpZiBkcmFnIHdhcyBoZWxkIGZvciAxMDAgbXNcbiAgICBuZXcgRGF0ZSgpIC0gdGhpcy5kcmFnTW92ZVRpbWUgPiAxMDAgKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICB2YXIgZGlzdGFuY2UgPSB0aGlzLmdldFNsaWRlRGlzdGFuY2UoIC10aGlzLmRyYWdYLCB0aGlzLnNlbGVjdGVkSW5kZXggKTtcbiAgdmFyIGRlbHRhID0gdGhpcy5wcmV2aW91c0RyYWdYIC0gdGhpcy5kcmFnWDtcbiAgaWYgKCBkaXN0YW5jZSA+IDAgJiYgZGVsdGEgPiAwICkge1xuICAgIC8vIGJvb3N0IHRvIG5leHQgaWYgbW92aW5nIHRvd2FyZHMgdGhlIHJpZ2h0LCBhbmQgcG9zaXRpdmUgdmVsb2NpdHlcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmICggZGlzdGFuY2UgPCAwICYmIGRlbHRhIDwgMCApIHtcbiAgICAvLyBib29zdCB0byBwcmV2aW91cyBpZiBtb3ZpbmcgdG93YXJkcyB0aGUgbGVmdCwgYW5kIG5lZ2F0aXZlIHZlbG9jaXR5XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuLy8gLS0tLS0gc3RhdGljQ2xpY2sgLS0tLS0gLy9cblxucHJvdG8uc3RhdGljQ2xpY2sgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIC8vIGdldCBjbGlja2VkQ2VsbCwgaWYgY2VsbCB3YXMgY2xpY2tlZFxuICB2YXIgY2xpY2tlZENlbGwgPSB0aGlzLmdldFBhcmVudENlbGwoIGV2ZW50LnRhcmdldCApO1xuICB2YXIgY2VsbEVsZW0gPSBjbGlja2VkQ2VsbCAmJiBjbGlja2VkQ2VsbC5lbGVtZW50O1xuICB2YXIgY2VsbEluZGV4ID0gY2xpY2tlZENlbGwgJiYgdGhpcy5jZWxscy5pbmRleE9mKCBjbGlja2VkQ2VsbCApO1xuICB0aGlzLmRpc3BhdGNoRXZlbnQoICdzdGF0aWNDbGljaycsIGV2ZW50LCBbIHBvaW50ZXIsIGNlbGxFbGVtLCBjZWxsSW5kZXggXSApO1xufTtcblxuLy8gLS0tLS0gc2Nyb2xsIC0tLS0tIC8vXG5cbnByb3RvLm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzY3JvbGwgPSBnZXRTY3JvbGxQb3NpdGlvbigpO1xuICB2YXIgc2Nyb2xsTW92ZVggPSB0aGlzLnBvaW50ZXJEb3duU2Nyb2xsLnggLSBzY3JvbGwueDtcbiAgdmFyIHNjcm9sbE1vdmVZID0gdGhpcy5wb2ludGVyRG93blNjcm9sbC55IC0gc2Nyb2xsLnk7XG4gIC8vIGNhbmNlbCBjbGljay90YXAgaWYgc2Nyb2xsIGlzIHRvbyBtdWNoXG4gIGlmICggTWF0aC5hYnMoIHNjcm9sbE1vdmVYICkgPiAzIHx8IE1hdGguYWJzKCBzY3JvbGxNb3ZlWSApID4gMyApIHtcbiAgICB0aGlzLl9wb2ludGVyRG9uZSgpO1xuICB9XG59O1xuXG4vLyAtLS0tLSB1dGlscyAtLS0tLSAvL1xuXG5mdW5jdGlvbiBnZXRTY3JvbGxQb3NpdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICB4OiB3aW5kb3cucGFnZVhPZmZzZXQsXG4gICAgeTogd2luZG93LnBhZ2VZT2Zmc2V0XG4gIH07XG59XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5yZXR1cm4gRmxpY2tpdHk7XG5cbn0pKTtcbiIsIi8vIEZsaWNraXR5IG1haW5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnZXYtZW1pdHRlci9ldi1lbWl0dGVyJyxcbiAgICAgICdnZXQtc2l6ZS9nZXQtc2l6ZScsXG4gICAgICAnZml6enktdWktdXRpbHMvdXRpbHMnLFxuICAgICAgJy4vY2VsbCcsXG4gICAgICAnLi9zbGlkZScsXG4gICAgICAnLi9hbmltYXRlJ1xuICAgIF0sIGZ1bmN0aW9uKCBFdkVtaXR0ZXIsIGdldFNpemUsIHV0aWxzLCBDZWxsLCBTbGlkZSwgYW5pbWF0ZVByb3RvdHlwZSApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIEV2RW1pdHRlciwgZ2V0U2l6ZSwgdXRpbHMsIENlbGwsIFNsaWRlLCBhbmltYXRlUHJvdG90eXBlICk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICByZXF1aXJlKCdldi1lbWl0dGVyJyksXG4gICAgICByZXF1aXJlKCdnZXQtc2l6ZScpLFxuICAgICAgcmVxdWlyZSgnZml6enktdWktdXRpbHMnKSxcbiAgICAgIHJlcXVpcmUoJy4vY2VsbCcpLFxuICAgICAgcmVxdWlyZSgnLi9zbGlkZScpLFxuICAgICAgcmVxdWlyZSgnLi9hbmltYXRlJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgdmFyIF9GbGlja2l0eSA9IHdpbmRvdy5GbGlja2l0eTtcblxuICAgIHdpbmRvdy5GbGlja2l0eSA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICB3aW5kb3cuRXZFbWl0dGVyLFxuICAgICAgd2luZG93LmdldFNpemUsXG4gICAgICB3aW5kb3cuZml6enlVSVV0aWxzLFxuICAgICAgX0ZsaWNraXR5LkNlbGwsXG4gICAgICBfRmxpY2tpdHkuU2xpZGUsXG4gICAgICBfRmxpY2tpdHkuYW5pbWF0ZVByb3RvdHlwZVxuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIEV2RW1pdHRlciwgZ2V0U2l6ZSxcbiAgdXRpbHMsIENlbGwsIFNsaWRlLCBhbmltYXRlUHJvdG90eXBlICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIHZhcnNcbnZhciBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5O1xudmFyIGdldENvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZTtcbnZhciBjb25zb2xlID0gd2luZG93LmNvbnNvbGU7XG5cbmZ1bmN0aW9uIG1vdmVFbGVtZW50cyggZWxlbXMsIHRvRWxlbSApIHtcbiAgZWxlbXMgPSB1dGlscy5tYWtlQXJyYXkoIGVsZW1zICk7XG4gIHdoaWxlICggZWxlbXMubGVuZ3RoICkge1xuICAgIHRvRWxlbS5hcHBlbmRDaGlsZCggZWxlbXMuc2hpZnQoKSApO1xuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEZsaWNraXR5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIGdsb2JhbGx5IHVuaXF1ZSBpZGVudGlmaWVyc1xudmFyIEdVSUQgPSAwO1xuLy8gaW50ZXJuYWwgc3RvcmUgb2YgYWxsIEZsaWNraXR5IGludGFuY2VzXG52YXIgaW5zdGFuY2VzID0ge307XG5cbmZ1bmN0aW9uIEZsaWNraXR5KCBlbGVtZW50LCBvcHRpb25zICkge1xuICB2YXIgcXVlcnlFbGVtZW50ID0gdXRpbHMuZ2V0UXVlcnlFbGVtZW50KCBlbGVtZW50ICk7XG4gIGlmICggIXF1ZXJ5RWxlbWVudCApIHtcbiAgICBpZiAoIGNvbnNvbGUgKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCAnQmFkIGVsZW1lbnQgZm9yIEZsaWNraXR5OiAnICsgKCBxdWVyeUVsZW1lbnQgfHwgZWxlbWVudCApICk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmVsZW1lbnQgPSBxdWVyeUVsZW1lbnQ7XG4gIC8vIGRvIG5vdCBpbml0aWFsaXplIHR3aWNlIG9uIHNhbWUgZWxlbWVudFxuICBpZiAoIHRoaXMuZWxlbWVudC5mbGlja2l0eUdVSUQgKSB7XG4gICAgdmFyIGluc3RhbmNlID0gaW5zdGFuY2VzWyB0aGlzLmVsZW1lbnQuZmxpY2tpdHlHVUlEIF07XG4gICAgaW5zdGFuY2Uub3B0aW9uKCBvcHRpb25zICk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgLy8gYWRkIGpRdWVyeVxuICBpZiAoIGpRdWVyeSApIHtcbiAgICB0aGlzLiRlbGVtZW50ID0galF1ZXJ5KCB0aGlzLmVsZW1lbnQgKTtcbiAgfVxuICAvLyBvcHRpb25zXG4gIHRoaXMub3B0aW9ucyA9IHV0aWxzLmV4dGVuZCgge30sIHRoaXMuY29uc3RydWN0b3IuZGVmYXVsdHMgKTtcbiAgdGhpcy5vcHRpb24oIG9wdGlvbnMgKTtcblxuICAvLyBraWNrIHRoaW5ncyBvZmZcbiAgdGhpcy5fY3JlYXRlKCk7XG59XG5cbkZsaWNraXR5LmRlZmF1bHRzID0ge1xuICBhY2Nlc3NpYmlsaXR5OiB0cnVlLFxuICAvLyBhZGFwdGl2ZUhlaWdodDogZmFsc2UsXG4gIGNlbGxBbGlnbjogJ2NlbnRlcicsXG4gIC8vIGNlbGxTZWxlY3RvcjogdW5kZWZpbmVkLFxuICAvLyBjb250YWluOiBmYWxzZSxcbiAgZnJlZVNjcm9sbEZyaWN0aW9uOiAwLjA3NSwgLy8gZnJpY3Rpb24gd2hlbiBmcmVlLXNjcm9sbGluZ1xuICBmcmljdGlvbjogMC4yOCwgLy8gZnJpY3Rpb24gd2hlbiBzZWxlY3RpbmdcbiAgbmFtZXNwYWNlSlF1ZXJ5RXZlbnRzOiB0cnVlLFxuICAvLyBpbml0aWFsSW5kZXg6IDAsXG4gIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZSxcbiAgcmVzaXplOiB0cnVlLFxuICBzZWxlY3RlZEF0dHJhY3Rpb246IDAuMDI1LFxuICBzZXRHYWxsZXJ5U2l6ZTogdHJ1ZVxuICAvLyB3YXRjaENTUzogZmFsc2UsXG4gIC8vIHdyYXBBcm91bmQ6IGZhbHNlXG59O1xuXG4vLyBoYXNoIG9mIG1ldGhvZHMgdHJpZ2dlcmVkIG9uIF9jcmVhdGUoKVxuRmxpY2tpdHkuY3JlYXRlTWV0aG9kcyA9IFtdO1xuXG52YXIgcHJvdG8gPSBGbGlja2l0eS5wcm90b3R5cGU7XG4vLyBpbmhlcml0IEV2ZW50RW1pdHRlclxudXRpbHMuZXh0ZW5kKCBwcm90bywgRXZFbWl0dGVyLnByb3RvdHlwZSApO1xuXG5wcm90by5fY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIC8vIGFkZCBpZCBmb3IgRmxpY2tpdHkuZGF0YVxuICB2YXIgaWQgPSB0aGlzLmd1aWQgPSArK0dVSUQ7XG4gIHRoaXMuZWxlbWVudC5mbGlja2l0eUdVSUQgPSBpZDsgLy8gZXhwYW5kb1xuICBpbnN0YW5jZXNbIGlkIF0gPSB0aGlzOyAvLyBhc3NvY2lhdGUgdmlhIGlkXG4gIC8vIGluaXRpYWwgcHJvcGVydGllc1xuICB0aGlzLnNlbGVjdGVkSW5kZXggPSAwO1xuICAvLyBob3cgbWFueSBmcmFtZXMgc2xpZGVyIGhhcyBiZWVuIGluIHNhbWUgcG9zaXRpb25cbiAgdGhpcy5yZXN0aW5nRnJhbWVzID0gMDtcbiAgLy8gaW5pdGlhbCBwaHlzaWNzIHByb3BlcnRpZXNcbiAgdGhpcy54ID0gMDtcbiAgdGhpcy52ZWxvY2l0eSA9IDA7XG4gIHRoaXMub3JpZ2luU2lkZSA9IHRoaXMub3B0aW9ucy5yaWdodFRvTGVmdCA/ICdyaWdodCcgOiAnbGVmdCc7XG4gIC8vIGNyZWF0ZSB2aWV3cG9ydCAmIHNsaWRlclxuICB0aGlzLnZpZXdwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMudmlld3BvcnQuY2xhc3NOYW1lID0gJ2ZsaWNraXR5LXZpZXdwb3J0JztcbiAgdGhpcy5fY3JlYXRlU2xpZGVyKCk7XG5cbiAgaWYgKCB0aGlzLm9wdGlvbnMucmVzaXplIHx8IHRoaXMub3B0aW9ucy53YXRjaENTUyApIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIHRoaXMgKTtcbiAgfVxuXG4gIEZsaWNraXR5LmNyZWF0ZU1ldGhvZHMuZm9yRWFjaCggZnVuY3Rpb24oIG1ldGhvZCApIHtcbiAgICB0aGlzWyBtZXRob2QgXSgpO1xuICB9LCB0aGlzICk7XG5cbiAgaWYgKCB0aGlzLm9wdGlvbnMud2F0Y2hDU1MgKSB7XG4gICAgdGhpcy53YXRjaENTUygpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgfVxuXG59O1xuXG4vKipcbiAqIHNldCBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICovXG5wcm90by5vcHRpb24gPSBmdW5jdGlvbiggb3B0cyApIHtcbiAgdXRpbHMuZXh0ZW5kKCB0aGlzLm9wdGlvbnMsIG9wdHMgKTtcbn07XG5cbnByb3RvLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7XG4gIGlmICggdGhpcy5pc0FjdGl2ZSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmbGlja2l0eS1lbmFibGVkJyk7XG4gIGlmICggdGhpcy5vcHRpb25zLnJpZ2h0VG9MZWZ0ICkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmbGlja2l0eS1ydGwnKTtcbiAgfVxuXG4gIHRoaXMuZ2V0U2l6ZSgpO1xuICAvLyBtb3ZlIGluaXRpYWwgY2VsbCBlbGVtZW50cyBzbyB0aGV5IGNhbiBiZSBsb2FkZWQgYXMgY2VsbHNcbiAgdmFyIGNlbGxFbGVtcyA9IHRoaXMuX2ZpbHRlckZpbmRDZWxsRWxlbWVudHMoIHRoaXMuZWxlbWVudC5jaGlsZHJlbiApO1xuICBtb3ZlRWxlbWVudHMoIGNlbGxFbGVtcywgdGhpcy5zbGlkZXIgKTtcbiAgdGhpcy52aWV3cG9ydC5hcHBlbmRDaGlsZCggdGhpcy5zbGlkZXIgKTtcbiAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKCB0aGlzLnZpZXdwb3J0ICk7XG4gIC8vIGdldCBjZWxscyBmcm9tIGNoaWxkcmVuXG4gIHRoaXMucmVsb2FkQ2VsbHMoKTtcblxuICBpZiAoIHRoaXMub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ICkge1xuICAgIC8vIGFsbG93IGVsZW1lbnQgdG8gZm9jdXNhYmxlXG4gICAgdGhpcy5lbGVtZW50LnRhYkluZGV4ID0gMDtcbiAgICAvLyBsaXN0ZW4gZm9yIGtleSBwcmVzc2VzXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgdGhpcyApO1xuICB9XG5cbiAgdGhpcy5lbWl0RXZlbnQoJ2FjdGl2YXRlJyk7XG5cbiAgdmFyIGluZGV4O1xuICB2YXIgaW5pdGlhbEluZGV4ID0gdGhpcy5vcHRpb25zLmluaXRpYWxJbmRleDtcbiAgaWYgKCB0aGlzLmlzSW5pdEFjdGl2YXRlZCApIHtcbiAgICBpbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleDtcbiAgfSBlbHNlIGlmICggaW5pdGlhbEluZGV4ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgaW5kZXggPSB0aGlzLmNlbGxzWyBpbml0aWFsSW5kZXggXSA/IGluaXRpYWxJbmRleCA6IDA7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSAwO1xuICB9XG4gIC8vIHNlbGVjdCBpbnN0YW50bHlcbiAgdGhpcy5zZWxlY3QoIGluZGV4LCBmYWxzZSwgdHJ1ZSApO1xuICAvLyBmbGFnIGZvciBpbml0aWFsIGFjdGl2YXRpb24sIGZvciB1c2luZyBpbml0aWFsSW5kZXhcbiAgdGhpcy5pc0luaXRBY3RpdmF0ZWQgPSB0cnVlO1xufTtcblxuLy8gc2xpZGVyIHBvc2l0aW9ucyB0aGUgY2VsbHNcbnByb3RvLl9jcmVhdGVTbGlkZXIgPSBmdW5jdGlvbigpIHtcbiAgLy8gc2xpZGVyIGVsZW1lbnQgZG9lcyBhbGwgdGhlIHBvc2l0aW9uaW5nXG4gIHZhciBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgc2xpZGVyLmNsYXNzTmFtZSA9ICdmbGlja2l0eS1zbGlkZXInO1xuICBzbGlkZXIuc3R5bGVbIHRoaXMub3JpZ2luU2lkZSBdID0gMDtcbiAgdGhpcy5zbGlkZXIgPSBzbGlkZXI7XG59O1xuXG5wcm90by5fZmlsdGVyRmluZENlbGxFbGVtZW50cyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgcmV0dXJuIHV0aWxzLmZpbHRlckZpbmRFbGVtZW50cyggZWxlbXMsIHRoaXMub3B0aW9ucy5jZWxsU2VsZWN0b3IgKTtcbn07XG5cbi8vIGdvZXMgdGhyb3VnaCBhbGwgY2hpbGRyZW5cbnByb3RvLnJlbG9hZENlbGxzID0gZnVuY3Rpb24oKSB7XG4gIC8vIGNvbGxlY3Rpb24gb2YgaXRlbSBlbGVtZW50c1xuICB0aGlzLmNlbGxzID0gdGhpcy5fbWFrZUNlbGxzKCB0aGlzLnNsaWRlci5jaGlsZHJlbiApO1xuICB0aGlzLnBvc2l0aW9uQ2VsbHMoKTtcbiAgdGhpcy5fZ2V0V3JhcFNoaWZ0Q2VsbHMoKTtcbiAgdGhpcy5zZXRHYWxsZXJ5U2l6ZSgpO1xufTtcblxuLyoqXG4gKiB0dXJuIGVsZW1lbnRzIGludG8gRmxpY2tpdHkuQ2VsbHNcbiAqIEBwYXJhbSB7QXJyYXkgb3IgTm9kZUxpc3Qgb3IgSFRNTEVsZW1lbnR9IGVsZW1zXG4gKiBAcmV0dXJucyB7QXJyYXl9IGl0ZW1zIC0gY29sbGVjdGlvbiBvZiBuZXcgRmxpY2tpdHkgQ2VsbHNcbiAqL1xucHJvdG8uX21ha2VDZWxscyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgdmFyIGNlbGxFbGVtcyA9IHRoaXMuX2ZpbHRlckZpbmRDZWxsRWxlbWVudHMoIGVsZW1zICk7XG5cbiAgLy8gY3JlYXRlIG5ldyBGbGlja2l0eSBmb3IgY29sbGVjdGlvblxuICB2YXIgY2VsbHMgPSBjZWxsRWxlbXMubWFwKCBmdW5jdGlvbiggY2VsbEVsZW0gKSB7XG4gICAgcmV0dXJuIG5ldyBDZWxsKCBjZWxsRWxlbSwgdGhpcyApO1xuICB9LCB0aGlzICk7XG5cbiAgcmV0dXJuIGNlbGxzO1xufTtcblxucHJvdG8uZ2V0TGFzdENlbGwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY2VsbHNbIHRoaXMuY2VsbHMubGVuZ3RoIC0gMSBdO1xufTtcblxucHJvdG8uZ2V0TGFzdFNsaWRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnNsaWRlc1sgdGhpcy5zbGlkZXMubGVuZ3RoIC0gMSBdO1xufTtcblxuLy8gcG9zaXRpb25zIGFsbCBjZWxsc1xucHJvdG8ucG9zaXRpb25DZWxscyA9IGZ1bmN0aW9uKCkge1xuICAvLyBzaXplIGFsbCBjZWxsc1xuICB0aGlzLl9zaXplQ2VsbHMoIHRoaXMuY2VsbHMgKTtcbiAgLy8gcG9zaXRpb24gYWxsIGNlbGxzXG4gIHRoaXMuX3Bvc2l0aW9uQ2VsbHMoIDAgKTtcbn07XG5cbi8qKlxuICogcG9zaXRpb24gY2VydGFpbiBjZWxsc1xuICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleCAtIHdoaWNoIGNlbGwgdG8gc3RhcnQgd2l0aFxuICovXG5wcm90by5fcG9zaXRpb25DZWxscyA9IGZ1bmN0aW9uKCBpbmRleCApIHtcbiAgaW5kZXggPSBpbmRleCB8fCAwO1xuICAvLyBhbHNvIG1lYXN1cmUgbWF4Q2VsbEhlaWdodFxuICAvLyBzdGFydCAwIGlmIHBvc2l0aW9uaW5nIGFsbCBjZWxsc1xuICB0aGlzLm1heENlbGxIZWlnaHQgPSBpbmRleCA/IHRoaXMubWF4Q2VsbEhlaWdodCB8fCAwIDogMDtcbiAgdmFyIGNlbGxYID0gMDtcbiAgLy8gZ2V0IGNlbGxYXG4gIGlmICggaW5kZXggPiAwICkge1xuICAgIHZhciBzdGFydENlbGwgPSB0aGlzLmNlbGxzWyBpbmRleCAtIDEgXTtcbiAgICBjZWxsWCA9IHN0YXJ0Q2VsbC54ICsgc3RhcnRDZWxsLnNpemUub3V0ZXJXaWR0aDtcbiAgfVxuICB2YXIgbGVuID0gdGhpcy5jZWxscy5sZW5ndGg7XG4gIGZvciAoIHZhciBpPWluZGV4OyBpIDwgbGVuOyBpKysgKSB7XG4gICAgdmFyIGNlbGwgPSB0aGlzLmNlbGxzW2ldO1xuICAgIGNlbGwuc2V0UG9zaXRpb24oIGNlbGxYICk7XG4gICAgY2VsbFggKz0gY2VsbC5zaXplLm91dGVyV2lkdGg7XG4gICAgdGhpcy5tYXhDZWxsSGVpZ2h0ID0gTWF0aC5tYXgoIGNlbGwuc2l6ZS5vdXRlckhlaWdodCwgdGhpcy5tYXhDZWxsSGVpZ2h0ICk7XG4gIH1cbiAgLy8ga2VlcCB0cmFjayBvZiBjZWxsWCBmb3Igd3JhcC1hcm91bmRcbiAgdGhpcy5zbGlkZWFibGVXaWR0aCA9IGNlbGxYO1xuICAvLyBzbGlkZXNcbiAgdGhpcy51cGRhdGVTbGlkZXMoKTtcbiAgLy8gY29udGFpbiBzbGlkZXMgdGFyZ2V0XG4gIHRoaXMuX2NvbnRhaW5TbGlkZXMoKTtcbiAgLy8gdXBkYXRlIHNsaWRlc1dpZHRoXG4gIHRoaXMuc2xpZGVzV2lkdGggPSBsZW4gPyB0aGlzLmdldExhc3RTbGlkZSgpLnRhcmdldCAtIHRoaXMuc2xpZGVzWzBdLnRhcmdldCA6IDA7XG59O1xuXG4vKipcbiAqIGNlbGwuZ2V0U2l6ZSgpIG9uIG11bHRpcGxlIGNlbGxzXG4gKiBAcGFyYW0ge0FycmF5fSBjZWxsc1xuICovXG5wcm90by5fc2l6ZUNlbGxzID0gZnVuY3Rpb24oIGNlbGxzICkge1xuICBjZWxscy5mb3JFYWNoKCBmdW5jdGlvbiggY2VsbCApIHtcbiAgICBjZWxsLmdldFNpemUoKTtcbiAgfSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxucHJvdG8udXBkYXRlU2xpZGVzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc2xpZGVzID0gW107XG4gIGlmICggIXRoaXMuY2VsbHMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBzbGlkZSA9IG5ldyBTbGlkZSggdGhpcyApO1xuICB0aGlzLnNsaWRlcy5wdXNoKCBzbGlkZSApO1xuICB2YXIgaXNPcmlnaW5MZWZ0ID0gdGhpcy5vcmlnaW5TaWRlID09ICdsZWZ0JztcbiAgdmFyIG5leHRNYXJnaW4gPSBpc09yaWdpbkxlZnQgPyAnbWFyZ2luUmlnaHQnIDogJ21hcmdpbkxlZnQnO1xuXG4gIHZhciBjYW5DZWxsRml0ID0gdGhpcy5fZ2V0Q2FuQ2VsbEZpdCgpO1xuXG4gIHRoaXMuY2VsbHMuZm9yRWFjaCggZnVuY3Rpb24oIGNlbGwsIGkgKSB7XG4gICAgLy8ganVzdCBhZGQgY2VsbCBpZiBmaXJzdCBjZWxsIGluIHNsaWRlXG4gICAgaWYgKCAhc2xpZGUuY2VsbHMubGVuZ3RoICkge1xuICAgICAgc2xpZGUuYWRkQ2VsbCggY2VsbCApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBzbGlkZVdpZHRoID0gKCBzbGlkZS5vdXRlcldpZHRoIC0gc2xpZGUuZmlyc3RNYXJnaW4gKSArXG4gICAgICAoIGNlbGwuc2l6ZS5vdXRlcldpZHRoIC0gY2VsbC5zaXplWyBuZXh0TWFyZ2luIF0gKTtcblxuICAgIGlmICggY2FuQ2VsbEZpdC5jYWxsKCB0aGlzLCBpLCBzbGlkZVdpZHRoICkgKSB7XG4gICAgICBzbGlkZS5hZGRDZWxsKCBjZWxsICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRvZXNuJ3QgZml0LCBuZXcgc2xpZGVcbiAgICAgIHNsaWRlLnVwZGF0ZVRhcmdldCgpO1xuXG4gICAgICBzbGlkZSA9IG5ldyBTbGlkZSggdGhpcyApO1xuICAgICAgdGhpcy5zbGlkZXMucHVzaCggc2xpZGUgKTtcbiAgICAgIHNsaWRlLmFkZENlbGwoIGNlbGwgKTtcbiAgICB9XG4gIH0sIHRoaXMgKTtcbiAgLy8gbGFzdCBzbGlkZVxuICBzbGlkZS51cGRhdGVUYXJnZXQoKTtcbiAgLy8gdXBkYXRlIC5zZWxlY3RlZFNsaWRlXG4gIHRoaXMudXBkYXRlU2VsZWN0ZWRTbGlkZSgpO1xufTtcblxucHJvdG8uX2dldENhbkNlbGxGaXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGdyb3VwQ2VsbHMgPSB0aGlzLm9wdGlvbnMuZ3JvdXBDZWxscztcbiAgaWYgKCAhZ3JvdXBDZWxscyApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIGdyb3VwQ2VsbHMgPT0gJ251bWJlcicgKSB7XG4gICAgLy8gZ3JvdXAgYnkgbnVtYmVyLiAzIC0+IFswLDEsMl0sIFszLDQsNV0sIC4uLlxuICAgIHZhciBudW1iZXIgPSBwYXJzZUludCggZ3JvdXBDZWxscywgMTAgKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oIGkgKSB7XG4gICAgICByZXR1cm4gKCBpICUgbnVtYmVyICkgIT09IDA7XG4gICAgfTtcbiAgfVxuICAvLyBkZWZhdWx0LCBncm91cCBieSB3aWR0aCBvZiBzbGlkZVxuICAvLyBwYXJzZSAnNzUlXG4gIHZhciBwZXJjZW50TWF0Y2ggPSB0eXBlb2YgZ3JvdXBDZWxscyA9PSAnc3RyaW5nJyAmJlxuICAgIGdyb3VwQ2VsbHMubWF0Y2goL14oXFxkKyklJC8pO1xuICB2YXIgcGVyY2VudCA9IHBlcmNlbnRNYXRjaCA/IHBhcnNlSW50KCBwZXJjZW50TWF0Y2hbMV0sIDEwICkgLyAxMDAgOiAxO1xuICByZXR1cm4gZnVuY3Rpb24oIGksIHNsaWRlV2lkdGggKSB7XG4gICAgcmV0dXJuIHNsaWRlV2lkdGggPD0gKCB0aGlzLnNpemUuaW5uZXJXaWR0aCArIDEgKSAqIHBlcmNlbnQ7XG4gIH07XG59O1xuXG4vLyBhbGlhcyBfaW5pdCBmb3IgalF1ZXJ5IHBsdWdpbiAuZmxpY2tpdHkoKVxucHJvdG8uX2luaXQgPVxucHJvdG8ucmVwb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBvc2l0aW9uQ2VsbHMoKTtcbiAgdGhpcy5wb3NpdGlvblNsaWRlckF0U2VsZWN0ZWQoKTtcbn07XG5cbnByb3RvLmdldFNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zaXplID0gZ2V0U2l6ZSggdGhpcy5lbGVtZW50ICk7XG4gIHRoaXMuc2V0Q2VsbEFsaWduKCk7XG4gIHRoaXMuY3Vyc29yUG9zaXRpb24gPSB0aGlzLnNpemUuaW5uZXJXaWR0aCAqIHRoaXMuY2VsbEFsaWduO1xufTtcblxudmFyIGNlbGxBbGlnblNob3J0aGFuZHMgPSB7XG4gIC8vIGNlbGwgYWxpZ24sIHRoZW4gYmFzZWQgb24gb3JpZ2luIHNpZGVcbiAgY2VudGVyOiB7XG4gICAgbGVmdDogMC41LFxuICAgIHJpZ2h0OiAwLjVcbiAgfSxcbiAgbGVmdDoge1xuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDFcbiAgfSxcbiAgcmlnaHQ6IHtcbiAgICByaWdodDogMCxcbiAgICBsZWZ0OiAxXG4gIH1cbn07XG5cbnByb3RvLnNldENlbGxBbGlnbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2hvcnRoYW5kID0gY2VsbEFsaWduU2hvcnRoYW5kc1sgdGhpcy5vcHRpb25zLmNlbGxBbGlnbiBdO1xuICB0aGlzLmNlbGxBbGlnbiA9IHNob3J0aGFuZCA/IHNob3J0aGFuZFsgdGhpcy5vcmlnaW5TaWRlIF0gOiB0aGlzLm9wdGlvbnMuY2VsbEFsaWduO1xufTtcblxucHJvdG8uc2V0R2FsbGVyeVNpemUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCB0aGlzLm9wdGlvbnMuc2V0R2FsbGVyeVNpemUgKSB7XG4gICAgdmFyIGhlaWdodCA9IHRoaXMub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCAmJiB0aGlzLnNlbGVjdGVkU2xpZGUgP1xuICAgICAgdGhpcy5zZWxlY3RlZFNsaWRlLmhlaWdodCA6IHRoaXMubWF4Q2VsbEhlaWdodDtcbiAgICB0aGlzLnZpZXdwb3J0LnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gIH1cbn07XG5cbnByb3RvLl9nZXRXcmFwU2hpZnRDZWxscyA9IGZ1bmN0aW9uKCkge1xuICAvLyBvbmx5IGZvciB3cmFwLWFyb3VuZFxuICBpZiAoICF0aGlzLm9wdGlvbnMud3JhcEFyb3VuZCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gdW5zaGlmdCBwcmV2aW91cyBjZWxsc1xuICB0aGlzLl91bnNoaWZ0Q2VsbHMoIHRoaXMuYmVmb3JlU2hpZnRDZWxscyApO1xuICB0aGlzLl91bnNoaWZ0Q2VsbHMoIHRoaXMuYWZ0ZXJTaGlmdENlbGxzICk7XG4gIC8vIGdldCBiZWZvcmUgY2VsbHNcbiAgLy8gaW5pdGlhbCBnYXBcbiAgdmFyIGdhcFggPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xuICB2YXIgY2VsbEluZGV4ID0gdGhpcy5jZWxscy5sZW5ndGggLSAxO1xuICB0aGlzLmJlZm9yZVNoaWZ0Q2VsbHMgPSB0aGlzLl9nZXRHYXBDZWxscyggZ2FwWCwgY2VsbEluZGV4LCAtMSApO1xuICAvLyBnZXQgYWZ0ZXIgY2VsbHNcbiAgLy8gZW5kaW5nIGdhcCBiZXR3ZWVuIGxhc3QgY2VsbCBhbmQgZW5kIG9mIGdhbGxlcnkgdmlld3BvcnRcbiAgZ2FwWCA9IHRoaXMuc2l6ZS5pbm5lcldpZHRoIC0gdGhpcy5jdXJzb3JQb3NpdGlvbjtcbiAgLy8gc3RhcnQgY2xvbmluZyBhdCBmaXJzdCBjZWxsLCB3b3JraW5nIGZvcndhcmRzXG4gIHRoaXMuYWZ0ZXJTaGlmdENlbGxzID0gdGhpcy5fZ2V0R2FwQ2VsbHMoIGdhcFgsIDAsIDEgKTtcbn07XG5cbnByb3RvLl9nZXRHYXBDZWxscyA9IGZ1bmN0aW9uKCBnYXBYLCBjZWxsSW5kZXgsIGluY3JlbWVudCApIHtcbiAgLy8ga2VlcCBhZGRpbmcgY2VsbHMgdW50aWwgdGhlIGNvdmVyIHRoZSBpbml0aWFsIGdhcFxuICB2YXIgY2VsbHMgPSBbXTtcbiAgd2hpbGUgKCBnYXBYID4gMCApIHtcbiAgICB2YXIgY2VsbCA9IHRoaXMuY2VsbHNbIGNlbGxJbmRleCBdO1xuICAgIGlmICggIWNlbGwgKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2VsbHMucHVzaCggY2VsbCApO1xuICAgIGNlbGxJbmRleCArPSBpbmNyZW1lbnQ7XG4gICAgZ2FwWCAtPSBjZWxsLnNpemUub3V0ZXJXaWR0aDtcbiAgfVxuICByZXR1cm4gY2VsbHM7XG59O1xuXG4vLyAtLS0tLSBjb250YWluIC0tLS0tIC8vXG5cbi8vIGNvbnRhaW4gY2VsbCB0YXJnZXRzIHNvIG5vIGV4Y2VzcyBzbGlkaW5nXG5wcm90by5fY29udGFpblNsaWRlcyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoICF0aGlzLm9wdGlvbnMuY29udGFpbiB8fCB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZCB8fCAhdGhpcy5jZWxscy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBpc1JpZ2h0VG9MZWZ0ID0gdGhpcy5vcHRpb25zLnJpZ2h0VG9MZWZ0O1xuICB2YXIgYmVnaW5NYXJnaW4gPSBpc1JpZ2h0VG9MZWZ0ID8gJ21hcmdpblJpZ2h0JyA6ICdtYXJnaW5MZWZ0JztcbiAgdmFyIGVuZE1hcmdpbiA9IGlzUmlnaHRUb0xlZnQgPyAnbWFyZ2luTGVmdCcgOiAnbWFyZ2luUmlnaHQnO1xuICB2YXIgY29udGVudFdpZHRoID0gdGhpcy5zbGlkZWFibGVXaWR0aCAtIHRoaXMuZ2V0TGFzdENlbGwoKS5zaXplWyBlbmRNYXJnaW4gXTtcbiAgLy8gY29udGVudCBpcyBsZXNzIHRoYW4gZ2FsbGVyeSBzaXplXG4gIHZhciBpc0NvbnRlbnRTbWFsbGVyID0gY29udGVudFdpZHRoIDwgdGhpcy5zaXplLmlubmVyV2lkdGg7XG4gIC8vIGJvdW5kc1xuICB2YXIgYmVnaW5Cb3VuZCA9IHRoaXMuY3Vyc29yUG9zaXRpb24gKyB0aGlzLmNlbGxzWzBdLnNpemVbIGJlZ2luTWFyZ2luIF07XG4gIHZhciBlbmRCb3VuZCA9IGNvbnRlbnRXaWR0aCAtIHRoaXMuc2l6ZS5pbm5lcldpZHRoICogKCAxIC0gdGhpcy5jZWxsQWxpZ24gKTtcbiAgLy8gY29udGFpbiBlYWNoIGNlbGwgdGFyZ2V0XG4gIHRoaXMuc2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZSApIHtcbiAgICBpZiAoIGlzQ29udGVudFNtYWxsZXIgKSB7XG4gICAgICAvLyBhbGwgY2VsbHMgZml0IGluc2lkZSBnYWxsZXJ5XG4gICAgICBzbGlkZS50YXJnZXQgPSBjb250ZW50V2lkdGggKiB0aGlzLmNlbGxBbGlnbjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29udGFpbiB0byBib3VuZHNcbiAgICAgIHNsaWRlLnRhcmdldCA9IE1hdGgubWF4KCBzbGlkZS50YXJnZXQsIGJlZ2luQm91bmQgKTtcbiAgICAgIHNsaWRlLnRhcmdldCA9IE1hdGgubWluKCBzbGlkZS50YXJnZXQsIGVuZEJvdW5kICk7XG4gICAgfVxuICB9LCB0aGlzICk7XG59O1xuXG4vLyAtLS0tLSAgLS0tLS0gLy9cblxuLyoqXG4gKiBlbWl0cyBldmVudHMgdmlhIGV2ZW50RW1pdHRlciBhbmQgalF1ZXJ5IGV2ZW50c1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBuYW1lIG9mIGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudCAtIG9yaWdpbmFsIGV2ZW50XG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIC0gZXh0cmEgYXJndW1lbnRzXG4gKi9cbnByb3RvLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbiggdHlwZSwgZXZlbnQsIGFyZ3MgKSB7XG4gIHZhciBlbWl0QXJncyA9IGV2ZW50ID8gWyBldmVudCBdLmNvbmNhdCggYXJncyApIDogYXJncztcbiAgdGhpcy5lbWl0RXZlbnQoIHR5cGUsIGVtaXRBcmdzICk7XG5cbiAgaWYgKCBqUXVlcnkgJiYgdGhpcy4kZWxlbWVudCApIHtcbiAgICAvLyBkZWZhdWx0IHRyaWdnZXIgd2l0aCB0eXBlIGlmIG5vIGV2ZW50XG4gICAgdHlwZSArPSB0aGlzLm9wdGlvbnMubmFtZXNwYWNlSlF1ZXJ5RXZlbnRzID8gJy5mbGlja2l0eScgOiAnJztcbiAgICB2YXIgJGV2ZW50ID0gdHlwZTtcbiAgICBpZiAoIGV2ZW50ICkge1xuICAgICAgLy8gY3JlYXRlIGpRdWVyeSBldmVudFxuICAgICAgdmFyIGpRRXZlbnQgPSBqUXVlcnkuRXZlbnQoIGV2ZW50ICk7XG4gICAgICBqUUV2ZW50LnR5cGUgPSB0eXBlO1xuICAgICAgJGV2ZW50ID0galFFdmVudDtcbiAgICB9XG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCAkZXZlbnQsIGFyZ3MgKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gc2VsZWN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleCAtIGluZGV4IG9mIHRoZSBzbGlkZVxuICogQHBhcmFtIHtCb29sZWFufSBpc1dyYXAgLSB3aWxsIHdyYXAtYXJvdW5kIHRvIGxhc3QvZmlyc3QgaWYgYXQgdGhlIGVuZFxuICogQHBhcmFtIHtCb29sZWFufSBpc0luc3RhbnQgLSB3aWxsIGltbWVkaWF0ZWx5IHNldCBwb3NpdGlvbiBhdCBzZWxlY3RlZCBjZWxsXG4gKi9cbnByb3RvLnNlbGVjdCA9IGZ1bmN0aW9uKCBpbmRleCwgaXNXcmFwLCBpc0luc3RhbnQgKSB7XG4gIGlmICggIXRoaXMuaXNBY3RpdmUgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGluZGV4ID0gcGFyc2VJbnQoIGluZGV4LCAxMCApO1xuICB0aGlzLl93cmFwU2VsZWN0KCBpbmRleCApO1xuXG4gIGlmICggdGhpcy5vcHRpb25zLndyYXBBcm91bmQgfHwgaXNXcmFwICkge1xuICAgIGluZGV4ID0gdXRpbHMubW9kdWxvKCBpbmRleCwgdGhpcy5zbGlkZXMubGVuZ3RoICk7XG4gIH1cbiAgLy8gYmFpbCBpZiBpbnZhbGlkIGluZGV4XG4gIGlmICggIXRoaXMuc2xpZGVzWyBpbmRleCBdICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcbiAgdGhpcy51cGRhdGVTZWxlY3RlZFNsaWRlKCk7XG4gIGlmICggaXNJbnN0YW50ICkge1xuICAgIHRoaXMucG9zaXRpb25TbGlkZXJBdFNlbGVjdGVkKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zdGFydEFuaW1hdGlvbigpO1xuICB9XG4gIGlmICggdGhpcy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ICkge1xuICAgIHRoaXMuc2V0R2FsbGVyeVNpemUoKTtcbiAgfVxuXG4gIHRoaXMuZGlzcGF0Y2hFdmVudCgnc2VsZWN0Jyk7XG4gIC8vIG9sZCB2MSBldmVudCBuYW1lLCByZW1vdmUgaW4gdjNcbiAgdGhpcy5kaXNwYXRjaEV2ZW50KCdjZWxsU2VsZWN0Jyk7XG59O1xuXG4vLyB3cmFwcyBwb3NpdGlvbiBmb3Igd3JhcEFyb3VuZCwgdG8gbW92ZSB0byBjbG9zZXN0IHNsaWRlLiAjMTEzXG5wcm90by5fd3JhcFNlbGVjdCA9IGZ1bmN0aW9uKCBpbmRleCApIHtcbiAgdmFyIGxlbiA9IHRoaXMuc2xpZGVzLmxlbmd0aDtcbiAgdmFyIGlzV3JhcHBpbmcgPSB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZCAmJiBsZW4gPiAxO1xuICBpZiAoICFpc1dyYXBwaW5nICkge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuICB2YXIgd3JhcEluZGV4ID0gdXRpbHMubW9kdWxvKCBpbmRleCwgbGVuICk7XG4gIC8vIGdvIHRvIHNob3J0ZXN0XG4gIHZhciBkZWx0YSA9IE1hdGguYWJzKCB3cmFwSW5kZXggLSB0aGlzLnNlbGVjdGVkSW5kZXggKTtcbiAgdmFyIGJhY2tXcmFwRGVsdGEgPSBNYXRoLmFicyggKCB3cmFwSW5kZXggKyBsZW4gKSAtIHRoaXMuc2VsZWN0ZWRJbmRleCApO1xuICB2YXIgZm9yZXdhcmRXcmFwRGVsdGEgPSBNYXRoLmFicyggKCB3cmFwSW5kZXggLSBsZW4gKSAtIHRoaXMuc2VsZWN0ZWRJbmRleCApO1xuICBpZiAoICF0aGlzLmlzRHJhZ1NlbGVjdCAmJiBiYWNrV3JhcERlbHRhIDwgZGVsdGEgKSB7XG4gICAgaW5kZXggKz0gbGVuO1xuICB9IGVsc2UgaWYgKCAhdGhpcy5pc0RyYWdTZWxlY3QgJiYgZm9yZXdhcmRXcmFwRGVsdGEgPCBkZWx0YSApIHtcbiAgICBpbmRleCAtPSBsZW47XG4gIH1cbiAgLy8gd3JhcCBwb3NpdGlvbiBzbyBzbGlkZXIgaXMgd2l0aGluIG5vcm1hbCBhcmVhXG4gIGlmICggaW5kZXggPCAwICkge1xuICAgIHRoaXMueCAtPSB0aGlzLnNsaWRlYWJsZVdpZHRoO1xuICB9IGVsc2UgaWYgKCBpbmRleCA+PSBsZW4gKSB7XG4gICAgdGhpcy54ICs9IHRoaXMuc2xpZGVhYmxlV2lkdGg7XG4gIH1cbn07XG5cbnByb3RvLnByZXZpb3VzID0gZnVuY3Rpb24oIGlzV3JhcCwgaXNJbnN0YW50ICkge1xuICB0aGlzLnNlbGVjdCggdGhpcy5zZWxlY3RlZEluZGV4IC0gMSwgaXNXcmFwLCBpc0luc3RhbnQgKTtcbn07XG5cbnByb3RvLm5leHQgPSBmdW5jdGlvbiggaXNXcmFwLCBpc0luc3RhbnQgKSB7XG4gIHRoaXMuc2VsZWN0KCB0aGlzLnNlbGVjdGVkSW5kZXggKyAxLCBpc1dyYXAsIGlzSW5zdGFudCApO1xufTtcblxucHJvdG8udXBkYXRlU2VsZWN0ZWRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2xpZGUgPSB0aGlzLnNsaWRlc1sgdGhpcy5zZWxlY3RlZEluZGV4IF07XG4gIC8vIHNlbGVjdGVkSW5kZXggY291bGQgYmUgb3V0c2lkZSBvZiBzbGlkZXMsIGlmIHRyaWdnZXJlZCBiZWZvcmUgcmVzaXplKClcbiAgaWYgKCAhc2xpZGUgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIHVuc2VsZWN0IHByZXZpb3VzIHNlbGVjdGVkIHNsaWRlXG4gIHRoaXMudW5zZWxlY3RTZWxlY3RlZFNsaWRlKCk7XG4gIC8vIHVwZGF0ZSBuZXcgc2VsZWN0ZWQgc2xpZGVcbiAgdGhpcy5zZWxlY3RlZFNsaWRlID0gc2xpZGU7XG4gIHNsaWRlLnNlbGVjdCgpO1xuICB0aGlzLnNlbGVjdGVkQ2VsbHMgPSBzbGlkZS5jZWxscztcbiAgdGhpcy5zZWxlY3RlZEVsZW1lbnRzID0gc2xpZGUuZ2V0Q2VsbEVsZW1lbnRzKCk7XG4gIC8vIEhBQ0s6IHNlbGVjdGVkQ2VsbCAmIHNlbGVjdGVkRWxlbWVudCBpcyBmaXJzdCBjZWxsIGluIHNsaWRlLCBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAvLyBSZW1vdmUgaW4gdjM/XG4gIHRoaXMuc2VsZWN0ZWRDZWxsID0gc2xpZGUuY2VsbHNbMF07XG4gIHRoaXMuc2VsZWN0ZWRFbGVtZW50ID0gdGhpcy5zZWxlY3RlZEVsZW1lbnRzWzBdO1xufTtcblxucHJvdG8udW5zZWxlY3RTZWxlY3RlZFNsaWRlID0gZnVuY3Rpb24oKSB7XG4gIGlmICggdGhpcy5zZWxlY3RlZFNsaWRlICkge1xuICAgIHRoaXMuc2VsZWN0ZWRTbGlkZS51bnNlbGVjdCgpO1xuICB9XG59O1xuXG4vKipcbiAqIHNlbGVjdCBzbGlkZSBmcm9tIG51bWJlciBvciBjZWxsIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudCBvciBOdW1iZXJ9IGVsZW1cbiAqL1xucHJvdG8uc2VsZWN0Q2VsbCA9IGZ1bmN0aW9uKCB2YWx1ZSwgaXNXcmFwLCBpc0luc3RhbnQgKSB7XG4gIC8vIGdldCBjZWxsXG4gIHZhciBjZWxsO1xuICBpZiAoIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyApIHtcbiAgICBjZWxsID0gdGhpcy5jZWxsc1sgdmFsdWUgXTtcbiAgfSBlbHNlIHtcbiAgICAvLyB1c2Ugc3RyaW5nIGFzIHNlbGVjdG9yXG4gICAgaWYgKCB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCB2YWx1ZSApO1xuICAgIH1cbiAgICAvLyBnZXQgY2VsbCBmcm9tIGVsZW1lbnRcbiAgICBjZWxsID0gdGhpcy5nZXRDZWxsKCB2YWx1ZSApO1xuICB9XG4gIC8vIHNlbGVjdCBzbGlkZSB0aGF0IGhhcyBjZWxsXG4gIGZvciAoIHZhciBpPTA7IGNlbGwgJiYgaSA8IHRoaXMuc2xpZGVzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBzbGlkZSA9IHRoaXMuc2xpZGVzW2ldO1xuICAgIHZhciBpbmRleCA9IHNsaWRlLmNlbGxzLmluZGV4T2YoIGNlbGwgKTtcbiAgICBpZiAoIGluZGV4ICE9IC0xICkge1xuICAgICAgdGhpcy5zZWxlY3QoIGksIGlzV3JhcCwgaXNJbnN0YW50ICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBnZXQgY2VsbHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLyoqXG4gKiBnZXQgRmxpY2tpdHkuQ2VsbCwgZ2l2ZW4gYW4gRWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKiBAcmV0dXJucyB7RmxpY2tpdHkuQ2VsbH0gaXRlbVxuICovXG5wcm90by5nZXRDZWxsID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIC8vIGxvb3AgdGhyb3VnaCBjZWxscyB0byBnZXQgdGhlIG9uZSB0aGF0IG1hdGNoZXNcbiAgZm9yICggdmFyIGk9MDsgaSA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIGNlbGwgPSB0aGlzLmNlbGxzW2ldO1xuICAgIGlmICggY2VsbC5lbGVtZW50ID09IGVsZW0gKSB7XG4gICAgICByZXR1cm4gY2VsbDtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogZ2V0IGNvbGxlY3Rpb24gb2YgRmxpY2tpdHkuQ2VsbHMsIGdpdmVuIEVsZW1lbnRzXG4gKiBAcGFyYW0ge0VsZW1lbnQsIEFycmF5LCBOb2RlTGlzdH0gZWxlbXNcbiAqIEByZXR1cm5zIHtBcnJheX0gY2VsbHMgLSBGbGlja2l0eS5DZWxsc1xuICovXG5wcm90by5nZXRDZWxscyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgZWxlbXMgPSB1dGlscy5tYWtlQXJyYXkoIGVsZW1zICk7XG4gIHZhciBjZWxscyA9IFtdO1xuICBlbGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbSApIHtcbiAgICB2YXIgY2VsbCA9IHRoaXMuZ2V0Q2VsbCggZWxlbSApO1xuICAgIGlmICggY2VsbCApIHtcbiAgICAgIGNlbGxzLnB1c2goIGNlbGwgKTtcbiAgICB9XG4gIH0sIHRoaXMgKTtcbiAgcmV0dXJuIGNlbGxzO1xufTtcblxuLyoqXG4gKiBnZXQgY2VsbCBlbGVtZW50c1xuICogQHJldHVybnMge0FycmF5fSBjZWxsRWxlbXNcbiAqL1xucHJvdG8uZ2V0Q2VsbEVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNlbGxzLm1hcCggZnVuY3Rpb24oIGNlbGwgKSB7XG4gICAgcmV0dXJuIGNlbGwuZWxlbWVudDtcbiAgfSk7XG59O1xuXG4vKipcbiAqIGdldCBwYXJlbnQgY2VsbCBmcm9tIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxuICogQHJldHVybnMge0ZsaWNraXQuQ2VsbH0gY2VsbFxuICovXG5wcm90by5nZXRQYXJlbnRDZWxsID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIC8vIGZpcnN0IGNoZWNrIGlmIGVsZW0gaXMgY2VsbFxuICB2YXIgY2VsbCA9IHRoaXMuZ2V0Q2VsbCggZWxlbSApO1xuICBpZiAoIGNlbGwgKSB7XG4gICAgcmV0dXJuIGNlbGw7XG4gIH1cbiAgLy8gdHJ5IHRvIGdldCBwYXJlbnQgY2VsbCBlbGVtXG4gIGVsZW0gPSB1dGlscy5nZXRQYXJlbnQoIGVsZW0sICcuZmxpY2tpdHktc2xpZGVyID4gKicgKTtcbiAgcmV0dXJuIHRoaXMuZ2V0Q2VsbCggZWxlbSApO1xufTtcblxuLyoqXG4gKiBnZXQgY2VsbHMgYWRqYWNlbnQgdG8gYSBzbGlkZVxuICogQHBhcmFtIHtJbnRlZ2VyfSBhZGpDb3VudCAtIG51bWJlciBvZiBhZGphY2VudCBzbGlkZXNcbiAqIEBwYXJhbSB7SW50ZWdlcn0gaW5kZXggLSBpbmRleCBvZiBzbGlkZSB0byBzdGFydFxuICogQHJldHVybnMge0FycmF5fSBjZWxscyAtIGFycmF5IG9mIEZsaWNraXR5LkNlbGxzXG4gKi9cbnByb3RvLmdldEFkamFjZW50Q2VsbEVsZW1lbnRzID0gZnVuY3Rpb24oIGFkakNvdW50LCBpbmRleCApIHtcbiAgaWYgKCAhYWRqQ291bnQgKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRTbGlkZS5nZXRDZWxsRWxlbWVudHMoKTtcbiAgfVxuICBpbmRleCA9IGluZGV4ID09PSB1bmRlZmluZWQgPyB0aGlzLnNlbGVjdGVkSW5kZXggOiBpbmRleDtcblxuICB2YXIgbGVuID0gdGhpcy5zbGlkZXMubGVuZ3RoO1xuICBpZiAoIDEgKyAoIGFkakNvdW50ICogMiApID49IGxlbiApIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDZWxsRWxlbWVudHMoKTtcbiAgfVxuXG4gIHZhciBjZWxsRWxlbXMgPSBbXTtcbiAgZm9yICggdmFyIGkgPSBpbmRleCAtIGFkakNvdW50OyBpIDw9IGluZGV4ICsgYWRqQ291bnQgOyBpKysgKSB7XG4gICAgdmFyIHNsaWRlSW5kZXggPSB0aGlzLm9wdGlvbnMud3JhcEFyb3VuZCA/IHV0aWxzLm1vZHVsbyggaSwgbGVuICkgOiBpO1xuICAgIHZhciBzbGlkZSA9IHRoaXMuc2xpZGVzWyBzbGlkZUluZGV4IF07XG4gICAgaWYgKCBzbGlkZSApIHtcbiAgICAgIGNlbGxFbGVtcyA9IGNlbGxFbGVtcy5jb25jYXQoIHNsaWRlLmdldENlbGxFbGVtZW50cygpICk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjZWxsRWxlbXM7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBldmVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxucHJvdG8udWlDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0RXZlbnQoJ3VpQ2hhbmdlJyk7XG59O1xuXG5wcm90by5jaGlsZFVJUG9pbnRlckRvd24gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIHRoaXMuZW1pdEV2ZW50KCAnY2hpbGRVSVBvaW50ZXJEb3duJywgWyBldmVudCBdICk7XG59O1xuXG4vLyAtLS0tLSByZXNpemUgLS0tLS0gLy9cblxucHJvdG8ub25yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy53YXRjaENTUygpO1xuICB0aGlzLnJlc2l6ZSgpO1xufTtcblxudXRpbHMuZGVib3VuY2VNZXRob2QoIEZsaWNraXR5LCAnb25yZXNpemUnLCAxNTAgKTtcblxucHJvdG8ucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMuaXNBY3RpdmUgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuZ2V0U2l6ZSgpO1xuICAvLyB3cmFwIHZhbHVlc1xuICBpZiAoIHRoaXMub3B0aW9ucy53cmFwQXJvdW5kICkge1xuICAgIHRoaXMueCA9IHV0aWxzLm1vZHVsbyggdGhpcy54LCB0aGlzLnNsaWRlYWJsZVdpZHRoICk7XG4gIH1cbiAgdGhpcy5wb3NpdGlvbkNlbGxzKCk7XG4gIHRoaXMuX2dldFdyYXBTaGlmdENlbGxzKCk7XG4gIHRoaXMuc2V0R2FsbGVyeVNpemUoKTtcbiAgdGhpcy5lbWl0RXZlbnQoJ3Jlc2l6ZScpO1xuICAvLyB1cGRhdGUgc2VsZWN0ZWQgaW5kZXggZm9yIGdyb3VwIHNsaWRlcywgaW5zdGFudFxuICAvLyBUT0RPOiBwb3NpdGlvbiBjYW4gYmUgbG9zdCBiZXR3ZWVuIGdyb3VwcyBvZiB2YXJpb3VzIG51bWJlcnNcbiAgdmFyIHNlbGVjdGVkRWxlbWVudCA9IHRoaXMuc2VsZWN0ZWRFbGVtZW50cyAmJiB0aGlzLnNlbGVjdGVkRWxlbWVudHNbMF07XG4gIHRoaXMuc2VsZWN0Q2VsbCggc2VsZWN0ZWRFbGVtZW50LCBmYWxzZSwgdHJ1ZSApO1xufTtcblxuLy8gd2F0Y2hlcyB0aGUgOmFmdGVyIHByb3BlcnR5LCBhY3RpdmF0ZXMvZGVhY3RpdmF0ZXNcbnByb3RvLndhdGNoQ1NTID0gZnVuY3Rpb24oKSB7XG4gIHZhciB3YXRjaE9wdGlvbiA9IHRoaXMub3B0aW9ucy53YXRjaENTUztcbiAgaWYgKCAhd2F0Y2hPcHRpb24gKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGFmdGVyQ29udGVudCA9IGdldENvbXB1dGVkU3R5bGUoIHRoaXMuZWxlbWVudCwgJzphZnRlcicgKS5jb250ZW50O1xuICAvLyBhY3RpdmF0ZSBpZiA6YWZ0ZXIgeyBjb250ZW50OiAnZmxpY2tpdHknIH1cbiAgaWYgKCBhZnRlckNvbnRlbnQuaW5kZXhPZignZmxpY2tpdHknKSAhPSAtMSApIHtcbiAgICB0aGlzLmFjdGl2YXRlKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gIH1cbn07XG5cbi8vIC0tLS0tIGtleWRvd24gLS0tLS0gLy9cblxuLy8gZ28gcHJldmlvdXMvbmV4dCBpZiBsZWZ0L3JpZ2h0IGtleXMgcHJlc3NlZFxucHJvdG8ub25rZXlkb3duID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICAvLyBvbmx5IHdvcmsgaWYgZWxlbWVudCBpcyBpbiBmb2N1c1xuICBpZiAoICF0aGlzLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSB8fFxuICAgICggZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9IHRoaXMuZWxlbWVudCApICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICggZXZlbnQua2V5Q29kZSA9PSAzNyApIHtcbiAgICAvLyBnbyBsZWZ0XG4gICAgdmFyIGxlZnRNZXRob2QgPSB0aGlzLm9wdGlvbnMucmlnaHRUb0xlZnQgPyAnbmV4dCcgOiAncHJldmlvdXMnO1xuICAgIHRoaXMudWlDaGFuZ2UoKTtcbiAgICB0aGlzWyBsZWZ0TWV0aG9kIF0oKTtcbiAgfSBlbHNlIGlmICggZXZlbnQua2V5Q29kZSA9PSAzOSApIHtcbiAgICAvLyBnbyByaWdodFxuICAgIHZhciByaWdodE1ldGhvZCA9IHRoaXMub3B0aW9ucy5yaWdodFRvTGVmdCA/ICdwcmV2aW91cycgOiAnbmV4dCc7XG4gICAgdGhpcy51aUNoYW5nZSgpO1xuICAgIHRoaXNbIHJpZ2h0TWV0aG9kIF0oKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGVzdHJveSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vLyBkZWFjdGl2YXRlIGFsbCBGbGlja2l0eSBmdW5jdGlvbmFsaXR5LCBidXQga2VlcCBzdHVmZiBhdmFpbGFibGVcbnByb3RvLmRlYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5pc0FjdGl2ZSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZsaWNraXR5LWVuYWJsZWQnKTtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZsaWNraXR5LXJ0bCcpO1xuICAvLyBkZXN0cm95IGNlbGxzXG4gIHRoaXMuY2VsbHMuZm9yRWFjaCggZnVuY3Rpb24oIGNlbGwgKSB7XG4gICAgY2VsbC5kZXN0cm95KCk7XG4gIH0pO1xuICB0aGlzLnVuc2VsZWN0U2VsZWN0ZWRTbGlkZSgpO1xuICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2hpbGQoIHRoaXMudmlld3BvcnQgKTtcbiAgLy8gbW92ZSBjaGlsZCBlbGVtZW50cyBiYWNrIGludG8gZWxlbWVudFxuICBtb3ZlRWxlbWVudHMoIHRoaXMuc2xpZGVyLmNoaWxkcmVuLCB0aGlzLmVsZW1lbnQgKTtcbiAgaWYgKCB0aGlzLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSApIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJJbmRleCcpO1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIHRoaXMgKTtcbiAgfVxuICAvLyBzZXQgZmxhZ3NcbiAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICB0aGlzLmVtaXRFdmVudCgnZGVhY3RpdmF0ZScpO1xufTtcblxucHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCB0aGlzICk7XG4gIHRoaXMuZW1pdEV2ZW50KCdkZXN0cm95Jyk7XG4gIGlmICggalF1ZXJ5ICYmIHRoaXMuJGVsZW1lbnQgKSB7XG4gICAgalF1ZXJ5LnJlbW92ZURhdGEoIHRoaXMuZWxlbWVudCwgJ2ZsaWNraXR5JyApO1xuICB9XG4gIGRlbGV0ZSB0aGlzLmVsZW1lbnQuZmxpY2tpdHlHVUlEO1xuICBkZWxldGUgaW5zdGFuY2VzWyB0aGlzLmd1aWQgXTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHByb3RvdHlwZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG51dGlscy5leHRlbmQoIHByb3RvLCBhbmltYXRlUHJvdG90eXBlICk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGV4dHJhcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vKipcbiAqIGdldCBGbGlja2l0eSBpbnN0YW5jZSBmcm9tIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxuICogQHJldHVybnMge0ZsaWNraXR5fVxuICovXG5GbGlja2l0eS5kYXRhID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIGVsZW0gPSB1dGlscy5nZXRRdWVyeUVsZW1lbnQoIGVsZW0gKTtcbiAgdmFyIGlkID0gZWxlbSAmJiBlbGVtLmZsaWNraXR5R1VJRDtcbiAgcmV0dXJuIGlkICYmIGluc3RhbmNlc1sgaWQgXTtcbn07XG5cbnV0aWxzLmh0bWxJbml0KCBGbGlja2l0eSwgJ2ZsaWNraXR5JyApO1xuXG5pZiAoIGpRdWVyeSAmJiBqUXVlcnkuYnJpZGdldCApIHtcbiAgalF1ZXJ5LmJyaWRnZXQoICdmbGlja2l0eScsIEZsaWNraXR5ICk7XG59XG5cbkZsaWNraXR5LkNlbGwgPSBDZWxsO1xuXG5yZXR1cm4gRmxpY2tpdHk7XG5cbn0pKTtcbiIsIi8qIVxuICogRmxpY2tpdHkgdjIuMC41XG4gKiBUb3VjaCwgcmVzcG9uc2l2ZSwgZmxpY2thYmxlIGNhcm91c2Vsc1xuICpcbiAqIExpY2Vuc2VkIEdQTHYzIGZvciBvcGVuIHNvdXJjZSB1c2VcbiAqIG9yIEZsaWNraXR5IENvbW1lcmNpYWwgTGljZW5zZSBmb3IgY29tbWVyY2lhbCB1c2VcbiAqXG4gKiBodHRwOi8vZmxpY2tpdHkubWV0YWZpenp5LmNvXG4gKiBDb3B5cmlnaHQgMjAxNiBNZXRhZml6enlcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJy4vZmxpY2tpdHknLFxuICAgICAgJy4vZHJhZycsXG4gICAgICAnLi9wcmV2LW5leHQtYnV0dG9uJyxcbiAgICAgICcuL3BhZ2UtZG90cycsXG4gICAgICAnLi9wbGF5ZXInLFxuICAgICAgJy4vYWRkLXJlbW92ZS1jZWxsJyxcbiAgICAgICcuL2xhenlsb2FkJ1xuICAgIF0sIGZhY3RvcnkgKTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHJlcXVpcmUoJy4vZmxpY2tpdHknKSxcbiAgICAgIHJlcXVpcmUoJy4vZHJhZycpLFxuICAgICAgcmVxdWlyZSgnLi9wcmV2LW5leHQtYnV0dG9uJyksXG4gICAgICByZXF1aXJlKCcuL3BhZ2UtZG90cycpLFxuICAgICAgcmVxdWlyZSgnLi9wbGF5ZXInKSxcbiAgICAgIHJlcXVpcmUoJy4vYWRkLXJlbW92ZS1jZWxsJyksXG4gICAgICByZXF1aXJlKCcuL2xhenlsb2FkJylcbiAgICApO1xuICB9XG5cbn0pKCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIEZsaWNraXR5ICkge1xuICAvKmpzaGludCBzdHJpY3Q6IGZhbHNlKi9cbiAgcmV0dXJuIEZsaWNraXR5O1xufSk7XG4iLCIvLyBsYXp5bG9hZFxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICcuL2ZsaWNraXR5JyxcbiAgICAgICdmaXp6eS11aS11dGlscy91dGlscydcbiAgICBdLCBmdW5jdGlvbiggRmxpY2tpdHksIHV0aWxzICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgRmxpY2tpdHksIHV0aWxzICk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICByZXF1aXJlKCcuL2ZsaWNraXR5JyksXG4gICAgICByZXF1aXJlKCdmaXp6eS11aS11dGlscycpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICB3aW5kb3cuRmxpY2tpdHksXG4gICAgICB3aW5kb3cuZml6enlVSVV0aWxzXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgRmxpY2tpdHksIHV0aWxzICkge1xuJ3VzZSBzdHJpY3QnO1xuXG5GbGlja2l0eS5jcmVhdGVNZXRob2RzLnB1c2goJ19jcmVhdGVMYXp5bG9hZCcpO1xudmFyIHByb3RvID0gRmxpY2tpdHkucHJvdG90eXBlO1xuXG5wcm90by5fY3JlYXRlTGF6eWxvYWQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vbiggJ3NlbGVjdCcsIHRoaXMubGF6eUxvYWQgKTtcbn07XG5cbnByb3RvLmxhenlMb2FkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBsYXp5TG9hZCA9IHRoaXMub3B0aW9ucy5sYXp5TG9hZDtcbiAgaWYgKCAhbGF6eUxvYWQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGdldCBhZGphY2VudCBjZWxscywgdXNlIGxhenlMb2FkIG9wdGlvbiBmb3IgYWRqYWNlbnQgY291bnRcbiAgdmFyIGFkakNvdW50ID0gdHlwZW9mIGxhenlMb2FkID09ICdudW1iZXInID8gbGF6eUxvYWQgOiAwO1xuICB2YXIgY2VsbEVsZW1zID0gdGhpcy5nZXRBZGphY2VudENlbGxFbGVtZW50cyggYWRqQ291bnQgKTtcbiAgLy8gZ2V0IGxhenkgaW1hZ2VzIGluIHRob3NlIGNlbGxzXG4gIHZhciBsYXp5SW1hZ2VzID0gW107XG4gIGNlbGxFbGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggY2VsbEVsZW0gKSB7XG4gICAgdmFyIGxhenlDZWxsSW1hZ2VzID0gZ2V0Q2VsbExhenlJbWFnZXMoIGNlbGxFbGVtICk7XG4gICAgbGF6eUltYWdlcyA9IGxhenlJbWFnZXMuY29uY2F0KCBsYXp5Q2VsbEltYWdlcyApO1xuICB9KTtcbiAgLy8gbG9hZCBsYXp5IGltYWdlc1xuICBsYXp5SW1hZ2VzLmZvckVhY2goIGZ1bmN0aW9uKCBpbWcgKSB7XG4gICAgbmV3IExhenlMb2FkZXIoIGltZywgdGhpcyApO1xuICB9LCB0aGlzICk7XG59O1xuXG5mdW5jdGlvbiBnZXRDZWxsTGF6eUltYWdlcyggY2VsbEVsZW0gKSB7XG4gIC8vIGNoZWNrIGlmIGNlbGwgZWxlbWVudCBpcyBsYXp5IGltYWdlXG4gIGlmICggY2VsbEVsZW0ubm9kZU5hbWUgPT0gJ0lNRycgJiZcbiAgICBjZWxsRWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmxpY2tpdHktbGF6eWxvYWQnKSApIHtcbiAgICByZXR1cm4gWyBjZWxsRWxlbSBdO1xuICB9XG4gIC8vIHNlbGVjdCBsYXp5IGltYWdlcyBpbiBjZWxsXG4gIHZhciBpbWdzID0gY2VsbEVsZW0ucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtZmxpY2tpdHktbGF6eWxvYWRdJyk7XG4gIHJldHVybiB1dGlscy5tYWtlQXJyYXkoIGltZ3MgKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gTGF6eUxvYWRlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vKipcbiAqIGNsYXNzIHRvIGhhbmRsZSBsb2FkaW5nIGltYWdlc1xuICovXG5mdW5jdGlvbiBMYXp5TG9hZGVyKCBpbWcsIGZsaWNraXR5ICkge1xuICB0aGlzLmltZyA9IGltZztcbiAgdGhpcy5mbGlja2l0eSA9IGZsaWNraXR5O1xuICB0aGlzLmxvYWQoKTtcbn1cblxuTGF6eUxvYWRlci5wcm90b3R5cGUuaGFuZGxlRXZlbnQgPSB1dGlscy5oYW5kbGVFdmVudDtcblxuTGF6eUxvYWRlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmltZy5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIHRoaXMgKTtcbiAgdGhpcy5pbWcuYWRkRXZlbnRMaXN0ZW5lciggJ2Vycm9yJywgdGhpcyApO1xuICAvLyBsb2FkIGltYWdlXG4gIHRoaXMuaW1nLnNyYyA9IHRoaXMuaW1nLmdldEF0dHJpYnV0ZSgnZGF0YS1mbGlja2l0eS1sYXp5bG9hZCcpO1xuICAvLyByZW1vdmUgYXR0clxuICB0aGlzLmltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZmxpY2tpdHktbGF6eWxvYWQnKTtcbn07XG5cbkxhenlMb2FkZXIucHJvdG90eXBlLm9ubG9hZCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdGhpcy5jb21wbGV0ZSggZXZlbnQsICdmbGlja2l0eS1sYXp5bG9hZGVkJyApO1xufTtcblxuTGF6eUxvYWRlci5wcm90b3R5cGUub25lcnJvciA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdGhpcy5jb21wbGV0ZSggZXZlbnQsICdmbGlja2l0eS1sYXp5ZXJyb3InICk7XG59O1xuXG5MYXp5TG9hZGVyLnByb3RvdHlwZS5jb21wbGV0ZSA9IGZ1bmN0aW9uKCBldmVudCwgY2xhc3NOYW1lICkge1xuICAvLyB1bmJpbmQgZXZlbnRzXG4gIHRoaXMuaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdsb2FkJywgdGhpcyApO1xuICB0aGlzLmltZy5yZW1vdmVFdmVudExpc3RlbmVyKCAnZXJyb3InLCB0aGlzICk7XG5cbiAgdmFyIGNlbGwgPSB0aGlzLmZsaWNraXR5LmdldFBhcmVudENlbGwoIHRoaXMuaW1nICk7XG4gIHZhciBjZWxsRWxlbSA9IGNlbGwgJiYgY2VsbC5lbGVtZW50O1xuICB0aGlzLmZsaWNraXR5LmNlbGxTaXplQ2hhbmdlKCBjZWxsRWxlbSApO1xuXG4gIHRoaXMuaW1nLmNsYXNzTGlzdC5hZGQoIGNsYXNzTmFtZSApO1xuICB0aGlzLmZsaWNraXR5LmRpc3BhdGNoRXZlbnQoICdsYXp5TG9hZCcsIGV2ZW50LCBjZWxsRWxlbSApO1xufTtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbkZsaWNraXR5LkxhenlMb2FkZXIgPSBMYXp5TG9hZGVyO1xuXG5yZXR1cm4gRmxpY2tpdHk7XG5cbn0pKTtcbiIsIi8vIHBhZ2UgZG90c1xuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICcuL2ZsaWNraXR5JyxcbiAgICAgICd0YXAtbGlzdGVuZXIvdGFwLWxpc3RlbmVyJyxcbiAgICAgICdmaXp6eS11aS11dGlscy91dGlscydcbiAgICBdLCBmdW5jdGlvbiggRmxpY2tpdHksIFRhcExpc3RlbmVyLCB1dGlscyApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIEZsaWNraXR5LCBUYXBMaXN0ZW5lciwgdXRpbHMgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJy4vZmxpY2tpdHknKSxcbiAgICAgIHJlcXVpcmUoJ3RhcC1saXN0ZW5lcicpLFxuICAgICAgcmVxdWlyZSgnZml6enktdWktdXRpbHMnKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LkZsaWNraXR5LFxuICAgICAgd2luZG93LlRhcExpc3RlbmVyLFxuICAgICAgd2luZG93LmZpenp5VUlVdGlsc1xuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIEZsaWNraXR5LCBUYXBMaXN0ZW5lciwgdXRpbHMgKSB7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBhZ2VEb3RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gUGFnZURvdHMoIHBhcmVudCApIHtcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuX2NyZWF0ZSgpO1xufVxuXG5QYWdlRG90cy5wcm90b3R5cGUgPSBuZXcgVGFwTGlzdGVuZXIoKTtcblxuUGFnZURvdHMucHJvdG90eXBlLl9jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgLy8gY3JlYXRlIGhvbGRlciBlbGVtZW50XG4gIHRoaXMuaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2wnKTtcbiAgdGhpcy5ob2xkZXIuY2xhc3NOYW1lID0gJ2ZsaWNraXR5LXBhZ2UtZG90cyc7XG4gIC8vIGNyZWF0ZSBkb3RzLCBhcnJheSBvZiBlbGVtZW50c1xuICB0aGlzLmRvdHMgPSBbXTtcbiAgLy8gZXZlbnRzXG4gIHRoaXMub24oICd0YXAnLCB0aGlzLm9uVGFwICk7XG4gIHRoaXMub24oICdwb2ludGVyRG93bicsIHRoaXMucGFyZW50LmNoaWxkVUlQb2ludGVyRG93bi5iaW5kKCB0aGlzLnBhcmVudCApICk7XG59O1xuXG5QYWdlRG90cy5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zZXREb3RzKCk7XG4gIHRoaXMuYmluZFRhcCggdGhpcy5ob2xkZXIgKTtcbiAgLy8gYWRkIHRvIERPTVxuICB0aGlzLnBhcmVudC5lbGVtZW50LmFwcGVuZENoaWxkKCB0aGlzLmhvbGRlciApO1xufTtcblxuUGFnZURvdHMucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcbiAgLy8gcmVtb3ZlIGZyb20gRE9NXG4gIHRoaXMucGFyZW50LmVsZW1lbnQucmVtb3ZlQ2hpbGQoIHRoaXMuaG9sZGVyICk7XG4gIFRhcExpc3RlbmVyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwoIHRoaXMgKTtcbn07XG5cblBhZ2VEb3RzLnByb3RvdHlwZS5zZXREb3RzID0gZnVuY3Rpb24oKSB7XG4gIC8vIGdldCBkaWZmZXJlbmNlIGJldHdlZW4gbnVtYmVyIG9mIHNsaWRlcyBhbmQgbnVtYmVyIG9mIGRvdHNcbiAgdmFyIGRlbHRhID0gdGhpcy5wYXJlbnQuc2xpZGVzLmxlbmd0aCAtIHRoaXMuZG90cy5sZW5ndGg7XG4gIGlmICggZGVsdGEgPiAwICkge1xuICAgIHRoaXMuYWRkRG90cyggZGVsdGEgKTtcbiAgfSBlbHNlIGlmICggZGVsdGEgPCAwICkge1xuICAgIHRoaXMucmVtb3ZlRG90cyggLWRlbHRhICk7XG4gIH1cbn07XG5cblBhZ2VEb3RzLnByb3RvdHlwZS5hZGREb3RzID0gZnVuY3Rpb24oIGNvdW50ICkge1xuICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBuZXdEb3RzID0gW107XG4gIHdoaWxlICggY291bnQgKSB7XG4gICAgdmFyIGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgZG90LmNsYXNzTmFtZSA9ICdkb3QnO1xuICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKCBkb3QgKTtcbiAgICBuZXdEb3RzLnB1c2goIGRvdCApO1xuICAgIGNvdW50LS07XG4gIH1cbiAgdGhpcy5ob2xkZXIuYXBwZW5kQ2hpbGQoIGZyYWdtZW50ICk7XG4gIHRoaXMuZG90cyA9IHRoaXMuZG90cy5jb25jYXQoIG5ld0RvdHMgKTtcbn07XG5cblBhZ2VEb3RzLnByb3RvdHlwZS5yZW1vdmVEb3RzID0gZnVuY3Rpb24oIGNvdW50ICkge1xuICAvLyByZW1vdmUgZnJvbSB0aGlzLmRvdHMgY29sbGVjdGlvblxuICB2YXIgcmVtb3ZlRG90cyA9IHRoaXMuZG90cy5zcGxpY2UoIHRoaXMuZG90cy5sZW5ndGggLSBjb3VudCwgY291bnQgKTtcbiAgLy8gcmVtb3ZlIGZyb20gRE9NXG4gIHJlbW92ZURvdHMuZm9yRWFjaCggZnVuY3Rpb24oIGRvdCApIHtcbiAgICB0aGlzLmhvbGRlci5yZW1vdmVDaGlsZCggZG90ICk7XG4gIH0sIHRoaXMgKTtcbn07XG5cblBhZ2VEb3RzLnByb3RvdHlwZS51cGRhdGVTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xuICAvLyByZW1vdmUgc2VsZWN0ZWQgY2xhc3Mgb24gcHJldmlvdXNcbiAgaWYgKCB0aGlzLnNlbGVjdGVkRG90ICkge1xuICAgIHRoaXMuc2VsZWN0ZWREb3QuY2xhc3NOYW1lID0gJ2RvdCc7XG4gIH1cbiAgLy8gZG9uJ3QgcHJvY2VlZCBpZiBubyBkb3RzXG4gIGlmICggIXRoaXMuZG90cy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuc2VsZWN0ZWREb3QgPSB0aGlzLmRvdHNbIHRoaXMucGFyZW50LnNlbGVjdGVkSW5kZXggXTtcbiAgdGhpcy5zZWxlY3RlZERvdC5jbGFzc05hbWUgPSAnZG90IGlzLXNlbGVjdGVkJztcbn07XG5cblBhZ2VEb3RzLnByb3RvdHlwZS5vblRhcCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgLy8gb25seSBjYXJlIGFib3V0IGRvdCBjbGlja3NcbiAgaWYgKCB0YXJnZXQubm9kZU5hbWUgIT0gJ0xJJyApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLnBhcmVudC51aUNoYW5nZSgpO1xuICB2YXIgaW5kZXggPSB0aGlzLmRvdHMuaW5kZXhPZiggdGFyZ2V0ICk7XG4gIHRoaXMucGFyZW50LnNlbGVjdCggaW5kZXggKTtcbn07XG5cblBhZ2VEb3RzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZGVhY3RpdmF0ZSgpO1xufTtcblxuRmxpY2tpdHkuUGFnZURvdHMgPSBQYWdlRG90cztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRmxpY2tpdHkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxudXRpbHMuZXh0ZW5kKCBGbGlja2l0eS5kZWZhdWx0cywge1xuICBwYWdlRG90czogdHJ1ZVxufSk7XG5cbkZsaWNraXR5LmNyZWF0ZU1ldGhvZHMucHVzaCgnX2NyZWF0ZVBhZ2VEb3RzJyk7XG5cbnZhciBwcm90byA9IEZsaWNraXR5LnByb3RvdHlwZTtcblxucHJvdG8uX2NyZWF0ZVBhZ2VEb3RzID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMub3B0aW9ucy5wYWdlRG90cyApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5wYWdlRG90cyA9IG5ldyBQYWdlRG90cyggdGhpcyApO1xuICAvLyBldmVudHNcbiAgdGhpcy5vbiggJ2FjdGl2YXRlJywgdGhpcy5hY3RpdmF0ZVBhZ2VEb3RzICk7XG4gIHRoaXMub24oICdzZWxlY3QnLCB0aGlzLnVwZGF0ZVNlbGVjdGVkUGFnZURvdHMgKTtcbiAgdGhpcy5vbiggJ2NlbGxDaGFuZ2UnLCB0aGlzLnVwZGF0ZVBhZ2VEb3RzICk7XG4gIHRoaXMub24oICdyZXNpemUnLCB0aGlzLnVwZGF0ZVBhZ2VEb3RzICk7XG4gIHRoaXMub24oICdkZWFjdGl2YXRlJywgdGhpcy5kZWFjdGl2YXRlUGFnZURvdHMgKTtcbn07XG5cbnByb3RvLmFjdGl2YXRlUGFnZURvdHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wYWdlRG90cy5hY3RpdmF0ZSgpO1xufTtcblxucHJvdG8udXBkYXRlU2VsZWN0ZWRQYWdlRG90cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBhZ2VEb3RzLnVwZGF0ZVNlbGVjdGVkKCk7XG59O1xuXG5wcm90by51cGRhdGVQYWdlRG90cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBhZ2VEb3RzLnNldERvdHMoKTtcbn07XG5cbnByb3RvLmRlYWN0aXZhdGVQYWdlRG90cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBhZ2VEb3RzLmRlYWN0aXZhdGUoKTtcbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5GbGlja2l0eS5QYWdlRG90cyA9IFBhZ2VEb3RzO1xuXG5yZXR1cm4gRmxpY2tpdHk7XG5cbn0pKTtcbiIsIi8vIHBsYXllciAmIGF1dG9QbGF5XG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJ2V2LWVtaXR0ZXIvZXYtZW1pdHRlcicsXG4gICAgICAnZml6enktdWktdXRpbHMvdXRpbHMnLFxuICAgICAgJy4vZmxpY2tpdHknXG4gICAgXSwgZnVuY3Rpb24oIEV2RW1pdHRlciwgdXRpbHMsIEZsaWNraXR5ICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIEV2RW1pdHRlciwgdXRpbHMsIEZsaWNraXR5ICk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICByZXF1aXJlKCdldi1lbWl0dGVyJyksXG4gICAgICByZXF1aXJlKCdmaXp6eS11aS11dGlscycpLFxuICAgICAgcmVxdWlyZSgnLi9mbGlja2l0eScpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIGZhY3RvcnkoXG4gICAgICB3aW5kb3cuRXZFbWl0dGVyLFxuICAgICAgd2luZG93LmZpenp5VUlVdGlscyxcbiAgICAgIHdpbmRvdy5GbGlja2l0eVxuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCBFdkVtaXR0ZXIsIHV0aWxzLCBGbGlja2l0eSApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQYWdlIFZpc2liaWxpdHkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0d1aWRlL1VzZXJfZXhwZXJpZW5jZS9Vc2luZ190aGVfUGFnZV9WaXNpYmlsaXR5X0FQSVxuXG52YXIgaGlkZGVuUHJvcGVydHksIHZpc2liaWxpdHlFdmVudDtcbmlmICggJ2hpZGRlbicgaW4gZG9jdW1lbnQgKSB7XG4gIGhpZGRlblByb3BlcnR5ID0gJ2hpZGRlbic7XG4gIHZpc2liaWxpdHlFdmVudCA9ICd2aXNpYmlsaXR5Y2hhbmdlJztcbn0gZWxzZSBpZiAoICd3ZWJraXRIaWRkZW4nIGluIGRvY3VtZW50ICkge1xuICBoaWRkZW5Qcm9wZXJ0eSA9ICd3ZWJraXRIaWRkZW4nO1xuICB2aXNpYmlsaXR5RXZlbnQgPSAnd2Via2l0dmlzaWJpbGl0eWNoYW5nZSc7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBsYXllciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBQbGF5ZXIoIHBhcmVudCApIHtcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuc3RhdGUgPSAnc3RvcHBlZCc7XG4gIC8vIHZpc2liaWxpdHkgY2hhbmdlIGV2ZW50IGhhbmRsZXJcbiAgaWYgKCB2aXNpYmlsaXR5RXZlbnQgKSB7XG4gICAgdGhpcy5vblZpc2liaWxpdHlDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudmlzaWJpbGl0eUNoYW5nZSgpO1xuICAgIH0uYmluZCggdGhpcyApO1xuICAgIHRoaXMub25WaXNpYmlsaXR5UGxheSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy52aXNpYmlsaXR5UGxheSgpO1xuICAgIH0uYmluZCggdGhpcyApO1xuICB9XG59XG5cblBsYXllci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBFdkVtaXR0ZXIucHJvdG90eXBlICk7XG5cbi8vIHN0YXJ0IHBsYXlcblBsYXllci5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIHRoaXMuc3RhdGUgPT0gJ3BsYXlpbmcnICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBkbyBub3QgcGxheSBpZiBwYWdlIGlzIGhpZGRlbiwgc3RhcnQgcGxheWluZyB3aGVuIHBhZ2UgaXMgdmlzaWJsZVxuICB2YXIgaXNQYWdlSGlkZGVuID0gZG9jdW1lbnRbIGhpZGRlblByb3BlcnR5IF07XG4gIGlmICggdmlzaWJpbGl0eUV2ZW50ICYmIGlzUGFnZUhpZGRlbiApIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCB2aXNpYmlsaXR5RXZlbnQsIHRoaXMub25WaXNpYmlsaXR5UGxheSApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuc3RhdGUgPSAncGxheWluZyc7XG4gIC8vIGxpc3RlbiB0byB2aXNpYmlsaXR5IGNoYW5nZVxuICBpZiAoIHZpc2liaWxpdHlFdmVudCApIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCB2aXNpYmlsaXR5RXZlbnQsIHRoaXMub25WaXNpYmlsaXR5Q2hhbmdlICk7XG4gIH1cbiAgLy8gc3RhcnQgdGlja2luZ1xuICB0aGlzLnRpY2soKTtcbn07XG5cblBsYXllci5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKCkge1xuICAvLyBkbyBub3QgdGljayBpZiBub3QgcGxheWluZ1xuICBpZiAoIHRoaXMuc3RhdGUgIT0gJ3BsYXlpbmcnICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0aW1lID0gdGhpcy5wYXJlbnQub3B0aW9ucy5hdXRvUGxheTtcbiAgLy8gZGVmYXVsdCB0byAzIHNlY29uZHNcbiAgdGltZSA9IHR5cGVvZiB0aW1lID09ICdudW1iZXInID8gdGltZSA6IDMwMDA7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIC8vIEhBQ0s6IHJlc2V0IHRpY2tzIGlmIHN0b3BwZWQgYW5kIHN0YXJ0ZWQgd2l0aGluIGludGVydmFsXG4gIHRoaXMuY2xlYXIoKTtcbiAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgX3RoaXMucGFyZW50Lm5leHQoIHRydWUgKTtcbiAgICBfdGhpcy50aWNrKCk7XG4gIH0sIHRpbWUgKTtcbn07XG5cblBsYXllci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnN0YXRlID0gJ3N0b3BwZWQnO1xuICB0aGlzLmNsZWFyKCk7XG4gIC8vIHJlbW92ZSB2aXNpYmlsaXR5IGNoYW5nZSBldmVudFxuICBpZiAoIHZpc2liaWxpdHlFdmVudCApIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCB2aXNpYmlsaXR5RXZlbnQsIHRoaXMub25WaXNpYmlsaXR5Q2hhbmdlICk7XG4gIH1cbn07XG5cblBsYXllci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgY2xlYXJUaW1lb3V0KCB0aGlzLnRpbWVvdXQgKTtcbn07XG5cblBsYXllci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCB0aGlzLnN0YXRlID09ICdwbGF5aW5nJyApIHtcbiAgICB0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG4gICAgdGhpcy5jbGVhcigpO1xuICB9XG59O1xuXG5QbGF5ZXIucHJvdG90eXBlLnVucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgLy8gcmUtc3RhcnQgcGxheSBpZiBwYXVzZWRcbiAgaWYgKCB0aGlzLnN0YXRlID09ICdwYXVzZWQnICkge1xuICAgIHRoaXMucGxheSgpO1xuICB9XG59O1xuXG4vLyBwYXVzZSBpZiBwYWdlIHZpc2liaWxpdHkgaXMgaGlkZGVuLCB1bnBhdXNlIGlmIHZpc2libGVcblBsYXllci5wcm90b3R5cGUudmlzaWJpbGl0eUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXNQYWdlSGlkZGVuID0gZG9jdW1lbnRbIGhpZGRlblByb3BlcnR5IF07XG4gIHRoaXNbIGlzUGFnZUhpZGRlbiA/ICdwYXVzZScgOiAndW5wYXVzZScgXSgpO1xufTtcblxuUGxheWVyLnByb3RvdHlwZS52aXNpYmlsaXR5UGxheSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBsYXkoKTtcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggdmlzaWJpbGl0eUV2ZW50LCB0aGlzLm9uVmlzaWJpbGl0eVBsYXkgKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEZsaWNraXR5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnV0aWxzLmV4dGVuZCggRmxpY2tpdHkuZGVmYXVsdHMsIHtcbiAgcGF1c2VBdXRvUGxheU9uSG92ZXI6IHRydWVcbn0pO1xuXG5GbGlja2l0eS5jcmVhdGVNZXRob2RzLnB1c2goJ19jcmVhdGVQbGF5ZXInKTtcbnZhciBwcm90byA9IEZsaWNraXR5LnByb3RvdHlwZTtcblxucHJvdG8uX2NyZWF0ZVBsYXllciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoIHRoaXMgKTtcblxuICB0aGlzLm9uKCAnYWN0aXZhdGUnLCB0aGlzLmFjdGl2YXRlUGxheWVyICk7XG4gIHRoaXMub24oICd1aUNoYW5nZScsIHRoaXMuc3RvcFBsYXllciApO1xuICB0aGlzLm9uKCAncG9pbnRlckRvd24nLCB0aGlzLnN0b3BQbGF5ZXIgKTtcbiAgdGhpcy5vbiggJ2RlYWN0aXZhdGUnLCB0aGlzLmRlYWN0aXZhdGVQbGF5ZXIgKTtcbn07XG5cbnByb3RvLmFjdGl2YXRlUGxheWVyID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMub3B0aW9ucy5hdXRvUGxheSApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5wbGF5ZXIucGxheSgpO1xuICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZW50ZXInLCB0aGlzICk7XG59O1xuXG4vLyBQbGF5ZXIgQVBJLCBkb24ndCBoYXRlIHRoZSAuLi4gdGhhbmtzIEkga25vdyB3aGVyZSB0aGUgZG9vciBpc1xuXG5wcm90by5wbGF5UGxheWVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGxheWVyLnBsYXkoKTtcbn07XG5cbnByb3RvLnN0b3BQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wbGF5ZXIuc3RvcCgpO1xufTtcblxucHJvdG8ucGF1c2VQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wbGF5ZXIucGF1c2UoKTtcbn07XG5cbnByb3RvLnVucGF1c2VQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wbGF5ZXIudW5wYXVzZSgpO1xufTtcblxucHJvdG8uZGVhY3RpdmF0ZVBsYXllciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBsYXllci5zdG9wKCk7XG4gIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2VlbnRlcicsIHRoaXMgKTtcbn07XG5cbi8vIC0tLS0tIG1vdXNlZW50ZXIvbGVhdmUgLS0tLS0gLy9cblxuLy8gcGF1c2UgYXV0by1wbGF5IG9uIGhvdmVyXG5wcm90by5vbm1vdXNlZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5vcHRpb25zLnBhdXNlQXV0b1BsYXlPbkhvdmVyICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnBsYXllci5wYXVzZSgpO1xuICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbGVhdmUnLCB0aGlzICk7XG59O1xuXG4vLyByZXN1bWUgYXV0by1wbGF5IG9uIGhvdmVyIG9mZlxucHJvdG8ub25tb3VzZWxlYXZlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGxheWVyLnVucGF1c2UoKTtcbiAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZWxlYXZlJywgdGhpcyApO1xufTtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbkZsaWNraXR5LlBsYXllciA9IFBsYXllcjtcblxucmV0dXJuIEZsaWNraXR5O1xuXG59KSk7XG4iLCIvLyBwcmV2L25leHQgYnV0dG9uc1xuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICcuL2ZsaWNraXR5JyxcbiAgICAgICd0YXAtbGlzdGVuZXIvdGFwLWxpc3RlbmVyJyxcbiAgICAgICdmaXp6eS11aS11dGlscy91dGlscydcbiAgICBdLCBmdW5jdGlvbiggRmxpY2tpdHksIFRhcExpc3RlbmVyLCB1dGlscyApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIEZsaWNraXR5LCBUYXBMaXN0ZW5lciwgdXRpbHMgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJy4vZmxpY2tpdHknKSxcbiAgICAgIHJlcXVpcmUoJ3RhcC1saXN0ZW5lcicpLFxuICAgICAgcmVxdWlyZSgnZml6enktdWktdXRpbHMnKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LkZsaWNraXR5LFxuICAgICAgd2luZG93LlRhcExpc3RlbmVyLFxuICAgICAgd2luZG93LmZpenp5VUlVdGlsc1xuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIEZsaWNraXR5LCBUYXBMaXN0ZW5lciwgdXRpbHMgKSB7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdmdVUkkgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQcmV2TmV4dEJ1dHRvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBQcmV2TmV4dEJ1dHRvbiggZGlyZWN0aW9uLCBwYXJlbnQgKSB7XG4gIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5fY3JlYXRlKCk7XG59XG5cblByZXZOZXh0QnV0dG9uLnByb3RvdHlwZSA9IG5ldyBUYXBMaXN0ZW5lcigpO1xuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUuX2NyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBwcm9wZXJ0aWVzXG4gIHRoaXMuaXNFbmFibGVkID0gdHJ1ZTtcbiAgdGhpcy5pc1ByZXZpb3VzID0gdGhpcy5kaXJlY3Rpb24gPT0gLTE7XG4gIHZhciBsZWZ0RGlyZWN0aW9uID0gdGhpcy5wYXJlbnQub3B0aW9ucy5yaWdodFRvTGVmdCA/IDEgOiAtMTtcbiAgdGhpcy5pc0xlZnQgPSB0aGlzLmRpcmVjdGlvbiA9PSBsZWZ0RGlyZWN0aW9uO1xuXG4gIHZhciBlbGVtZW50ID0gdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gJ2ZsaWNraXR5LXByZXYtbmV4dC1idXR0b24nO1xuICBlbGVtZW50LmNsYXNzTmFtZSArPSB0aGlzLmlzUHJldmlvdXMgPyAnIHByZXZpb3VzJyA6ICcgbmV4dCc7XG4gIC8vIHByZXZlbnQgYnV0dG9uIGZyb20gc3VibWl0dGluZyBmb3JtIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEwODM2MDc2LzE4MjE4M1xuICBlbGVtZW50LnNldEF0dHJpYnV0ZSggJ3R5cGUnLCAnYnV0dG9uJyApO1xuICAvLyBpbml0IGFzIGRpc2FibGVkXG4gIHRoaXMuZGlzYWJsZSgpO1xuXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnYXJpYS1sYWJlbCcsIHRoaXMuaXNQcmV2aW91cyA/ICdwcmV2aW91cycgOiAnbmV4dCcgKTtcblxuICAvLyBjcmVhdGUgYXJyb3dcbiAgdmFyIHN2ZyA9IHRoaXMuY3JlYXRlU1ZHKCk7XG4gIGVsZW1lbnQuYXBwZW5kQ2hpbGQoIHN2ZyApO1xuICAvLyBldmVudHNcbiAgdGhpcy5vbiggJ3RhcCcsIHRoaXMub25UYXAgKTtcbiAgdGhpcy5wYXJlbnQub24oICdzZWxlY3QnLCB0aGlzLnVwZGF0ZS5iaW5kKCB0aGlzICkgKTtcbiAgdGhpcy5vbiggJ3BvaW50ZXJEb3duJywgdGhpcy5wYXJlbnQuY2hpbGRVSVBvaW50ZXJEb3duLmJpbmQoIHRoaXMucGFyZW50ICkgKTtcbn07XG5cblByZXZOZXh0QnV0dG9uLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmJpbmRUYXAoIHRoaXMuZWxlbWVudCApO1xuICAvLyBjbGljayBldmVudHMgZnJvbSBrZXlib2FyZFxuICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgdGhpcyApO1xuICAvLyBhZGQgdG8gRE9NXG4gIHRoaXMucGFyZW50LmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHRoaXMuZWxlbWVudCApO1xufTtcblxuUHJldk5leHRCdXR0b24ucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbigpIHtcbiAgLy8gcmVtb3ZlIGZyb20gRE9NXG4gIHRoaXMucGFyZW50LmVsZW1lbnQucmVtb3ZlQ2hpbGQoIHRoaXMuZWxlbWVudCApO1xuICAvLyBkbyByZWd1bGFyIFRhcExpc3RlbmVyIGRlc3Ryb3lcbiAgVGFwTGlzdGVuZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCggdGhpcyApO1xuICAvLyBjbGljayBldmVudHMgZnJvbSBrZXlib2FyZFxuICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgdGhpcyApO1xufTtcblxuUHJldk5leHRCdXR0b24ucHJvdG90eXBlLmNyZWF0ZVNWRyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCBzdmdVUkksICdzdmcnKTtcbiAgc3ZnLnNldEF0dHJpYnV0ZSggJ3ZpZXdCb3gnLCAnMCAwIDEwMCAxMDAnICk7XG4gIHZhciBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCBzdmdVUkksICdwYXRoJyk7XG4gIHZhciBwYXRoTW92ZW1lbnRzID0gZ2V0QXJyb3dNb3ZlbWVudHMoIHRoaXMucGFyZW50Lm9wdGlvbnMuYXJyb3dTaGFwZSApO1xuICBwYXRoLnNldEF0dHJpYnV0ZSggJ2QnLCBwYXRoTW92ZW1lbnRzICk7XG4gIHBhdGguc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnYXJyb3cnICk7XG4gIC8vIHJvdGF0ZSBhcnJvd1xuICBpZiAoICF0aGlzLmlzTGVmdCApIHtcbiAgICBwYXRoLnNldEF0dHJpYnV0ZSggJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMTAwLCAxMDApIHJvdGF0ZSgxODApICcgKTtcbiAgfVxuICBzdmcuYXBwZW5kQ2hpbGQoIHBhdGggKTtcbiAgcmV0dXJuIHN2Zztcbn07XG5cbi8vIGdldCBTVkcgcGF0aCBtb3ZtZW1lbnRcbmZ1bmN0aW9uIGdldEFycm93TW92ZW1lbnRzKCBzaGFwZSApIHtcbiAgLy8gdXNlIHNoYXBlIGFzIG1vdmVtZW50IGlmIHN0cmluZ1xuICBpZiAoIHR5cGVvZiBzaGFwZSA9PSAnc3RyaW5nJyApIHtcbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cbiAgLy8gY3JlYXRlIG1vdmVtZW50IHN0cmluZ1xuICByZXR1cm4gJ00gJyArIHNoYXBlLngwICsgJyw1MCcgK1xuICAgICcgTCAnICsgc2hhcGUueDEgKyAnLCcgKyAoIHNoYXBlLnkxICsgNTAgKSArXG4gICAgJyBMICcgKyBzaGFwZS54MiArICcsJyArICggc2hhcGUueTIgKyA1MCApICtcbiAgICAnIEwgJyArIHNoYXBlLngzICsgJyw1MCAnICtcbiAgICAnIEwgJyArIHNoYXBlLngyICsgJywnICsgKCA1MCAtIHNoYXBlLnkyICkgK1xuICAgICcgTCAnICsgc2hhcGUueDEgKyAnLCcgKyAoIDUwIC0gc2hhcGUueTEgKSArXG4gICAgJyBaJztcbn1cblxuUHJldk5leHRCdXR0b24ucHJvdG90eXBlLm9uVGFwID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMuaXNFbmFibGVkICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnBhcmVudC51aUNoYW5nZSgpO1xuICB2YXIgbWV0aG9kID0gdGhpcy5pc1ByZXZpb3VzID8gJ3ByZXZpb3VzJyA6ICduZXh0JztcbiAgdGhpcy5wYXJlbnRbIG1ldGhvZCBdKCk7XG59O1xuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUuaGFuZGxlRXZlbnQgPSB1dGlscy5oYW5kbGVFdmVudDtcblxuUHJldk5leHRCdXR0b24ucHJvdG90eXBlLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgLy8gb25seSBhbGxvdyBjbGlja3MgZnJvbSBrZXlib2FyZFxuICB2YXIgZm9jdXNlZCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gIGlmICggZm9jdXNlZCAmJiBmb2N1c2VkID09IHRoaXMuZWxlbWVudCApIHtcbiAgICB0aGlzLm9uVGFwKCk7XG4gIH1cbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24oKSB7XG4gIGlmICggdGhpcy5pc0VuYWJsZWQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuZWxlbWVudC5kaXNhYmxlZCA9IGZhbHNlO1xuICB0aGlzLmlzRW5hYmxlZCA9IHRydWU7XG59O1xuXG5QcmV2TmV4dEJ1dHRvbi5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoICF0aGlzLmlzRW5hYmxlZCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5lbGVtZW50LmRpc2FibGVkID0gdHJ1ZTtcbiAgdGhpcy5pc0VuYWJsZWQgPSBmYWxzZTtcbn07XG5cblByZXZOZXh0QnV0dG9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgLy8gaW5kZXggb2YgZmlyc3Qgb3IgbGFzdCBzbGlkZSwgaWYgcHJldmlvdXMgb3IgbmV4dFxuICB2YXIgc2xpZGVzID0gdGhpcy5wYXJlbnQuc2xpZGVzO1xuICAvLyBlbmFibGUgaXMgd3JhcEFyb3VuZCBhbmQgYXQgbGVhc3QgMiBzbGlkZXNcbiAgaWYgKCB0aGlzLnBhcmVudC5vcHRpb25zLndyYXBBcm91bmQgJiYgc2xpZGVzLmxlbmd0aCA+IDEgKSB7XG4gICAgdGhpcy5lbmFibGUoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IHNsaWRlcy5sZW5ndGggPyBzbGlkZXMubGVuZ3RoIC0gMSA6IDA7XG4gIHZhciBib3VuZEluZGV4ID0gdGhpcy5pc1ByZXZpb3VzID8gMCA6IGxhc3RJbmRleDtcbiAgdmFyIG1ldGhvZCA9IHRoaXMucGFyZW50LnNlbGVjdGVkSW5kZXggPT0gYm91bmRJbmRleCA/ICdkaXNhYmxlJyA6ICdlbmFibGUnO1xuICB0aGlzWyBtZXRob2QgXSgpO1xufTtcblxuUHJldk5leHRCdXR0b24ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5kZWFjdGl2YXRlKCk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGbGlja2l0eSBwcm90b3R5cGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxudXRpbHMuZXh0ZW5kKCBGbGlja2l0eS5kZWZhdWx0cywge1xuICBwcmV2TmV4dEJ1dHRvbnM6IHRydWUsXG4gIGFycm93U2hhcGU6IHtcbiAgICB4MDogMTAsXG4gICAgeDE6IDYwLCB5MTogNTAsXG4gICAgeDI6IDcwLCB5MjogNDAsXG4gICAgeDM6IDMwXG4gIH1cbn0pO1xuXG5GbGlja2l0eS5jcmVhdGVNZXRob2RzLnB1c2goJ19jcmVhdGVQcmV2TmV4dEJ1dHRvbnMnKTtcbnZhciBwcm90byA9IEZsaWNraXR5LnByb3RvdHlwZTtcblxucHJvdG8uX2NyZWF0ZVByZXZOZXh0QnV0dG9ucyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoICF0aGlzLm9wdGlvbnMucHJldk5leHRCdXR0b25zICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMucHJldkJ1dHRvbiA9IG5ldyBQcmV2TmV4dEJ1dHRvbiggLTEsIHRoaXMgKTtcbiAgdGhpcy5uZXh0QnV0dG9uID0gbmV3IFByZXZOZXh0QnV0dG9uKCAxLCB0aGlzICk7XG5cbiAgdGhpcy5vbiggJ2FjdGl2YXRlJywgdGhpcy5hY3RpdmF0ZVByZXZOZXh0QnV0dG9ucyApO1xufTtcblxucHJvdG8uYWN0aXZhdGVQcmV2TmV4dEJ1dHRvbnMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcmV2QnV0dG9uLmFjdGl2YXRlKCk7XG4gIHRoaXMubmV4dEJ1dHRvbi5hY3RpdmF0ZSgpO1xuICB0aGlzLm9uKCAnZGVhY3RpdmF0ZScsIHRoaXMuZGVhY3RpdmF0ZVByZXZOZXh0QnV0dG9ucyApO1xufTtcblxucHJvdG8uZGVhY3RpdmF0ZVByZXZOZXh0QnV0dG9ucyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByZXZCdXR0b24uZGVhY3RpdmF0ZSgpO1xuICB0aGlzLm5leHRCdXR0b24uZGVhY3RpdmF0ZSgpO1xuICB0aGlzLm9mZiggJ2RlYWN0aXZhdGUnLCB0aGlzLmRlYWN0aXZhdGVQcmV2TmV4dEJ1dHRvbnMgKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5GbGlja2l0eS5QcmV2TmV4dEJ1dHRvbiA9IFByZXZOZXh0QnV0dG9uO1xuXG5yZXR1cm4gRmxpY2tpdHk7XG5cbn0pKTtcbiIsIi8vIHNsaWRlXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggZmFjdG9yeSApO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuRmxpY2tpdHkgPSB3aW5kb3cuRmxpY2tpdHkgfHwge307XG4gICAgd2luZG93LkZsaWNraXR5LlNsaWRlID0gZmFjdG9yeSgpO1xuICB9XG5cbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSgpIHtcbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gU2xpZGUoIHBhcmVudCApIHtcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuaXNPcmlnaW5MZWZ0ID0gcGFyZW50Lm9yaWdpblNpZGUgPT0gJ2xlZnQnO1xuICB0aGlzLmNlbGxzID0gW107XG4gIHRoaXMub3V0ZXJXaWR0aCA9IDA7XG4gIHRoaXMuaGVpZ2h0ID0gMDtcbn1cblxudmFyIHByb3RvID0gU2xpZGUucHJvdG90eXBlO1xuXG5wcm90by5hZGRDZWxsID0gZnVuY3Rpb24oIGNlbGwgKSB7XG4gIHRoaXMuY2VsbHMucHVzaCggY2VsbCApO1xuICB0aGlzLm91dGVyV2lkdGggKz0gY2VsbC5zaXplLm91dGVyV2lkdGg7XG4gIHRoaXMuaGVpZ2h0ID0gTWF0aC5tYXgoIGNlbGwuc2l6ZS5vdXRlckhlaWdodCwgdGhpcy5oZWlnaHQgKTtcbiAgLy8gZmlyc3QgY2VsbCBzdHVmZlxuICBpZiAoIHRoaXMuY2VsbHMubGVuZ3RoID09IDEgKSB7XG4gICAgdGhpcy54ID0gY2VsbC54OyAvLyB4IGNvbWVzIGZyb20gZmlyc3QgY2VsbFxuICAgIHZhciBiZWdpbk1hcmdpbiA9IHRoaXMuaXNPcmlnaW5MZWZ0ID8gJ21hcmdpbkxlZnQnIDogJ21hcmdpblJpZ2h0JztcbiAgICB0aGlzLmZpcnN0TWFyZ2luID0gY2VsbC5zaXplWyBiZWdpbk1hcmdpbiBdO1xuICB9XG59O1xuXG5wcm90by51cGRhdGVUYXJnZXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGVuZE1hcmdpbiA9IHRoaXMuaXNPcmlnaW5MZWZ0ID8gJ21hcmdpblJpZ2h0JyA6ICdtYXJnaW5MZWZ0JztcbiAgdmFyIGxhc3RDZWxsID0gdGhpcy5nZXRMYXN0Q2VsbCgpO1xuICB2YXIgbGFzdE1hcmdpbiA9IGxhc3RDZWxsID8gbGFzdENlbGwuc2l6ZVsgZW5kTWFyZ2luIF0gOiAwO1xuICB2YXIgc2xpZGVXaWR0aCA9IHRoaXMub3V0ZXJXaWR0aCAtICggdGhpcy5maXJzdE1hcmdpbiArIGxhc3RNYXJnaW4gKTtcbiAgdGhpcy50YXJnZXQgPSB0aGlzLnggKyB0aGlzLmZpcnN0TWFyZ2luICsgc2xpZGVXaWR0aCAqIHRoaXMucGFyZW50LmNlbGxBbGlnbjtcbn07XG5cbnByb3RvLmdldExhc3RDZWxsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNlbGxzWyB0aGlzLmNlbGxzLmxlbmd0aCAtIDEgXTtcbn07XG5cbnByb3RvLnNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmNoYW5nZVNlbGVjdGVkQ2xhc3MoJ2FkZCcpO1xufTtcblxucHJvdG8udW5zZWxlY3QgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jaGFuZ2VTZWxlY3RlZENsYXNzKCdyZW1vdmUnKTtcbn07XG5cbnByb3RvLmNoYW5nZVNlbGVjdGVkQ2xhc3MgPSBmdW5jdGlvbiggbWV0aG9kICkge1xuICB0aGlzLmNlbGxzLmZvckVhY2goIGZ1bmN0aW9uKCBjZWxsICkge1xuICAgIGNlbGwuZWxlbWVudC5jbGFzc0xpc3RbIG1ldGhvZCBdKCdpcy1zZWxlY3RlZCcpO1xuICB9KTtcbn07XG5cbnByb3RvLmdldENlbGxFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jZWxscy5tYXAoIGZ1bmN0aW9uKCBjZWxsICkge1xuICAgIHJldHVybiBjZWxsLmVsZW1lbnQ7XG4gIH0pO1xufTtcblxucmV0dXJuIFNsaWRlO1xuXG59KSk7XG4iLCIvKiFcbiAqIGdldFNpemUgdjIuMC4yXG4gKiBtZWFzdXJlIHNpemUgb2YgZWxlbWVudHNcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgc3RyaWN0OiB0cnVlLCB1bmRlZjogdHJ1ZSwgdW51c2VkOiB0cnVlICovXG4vKmdsb2JhbCBkZWZpbmU6IGZhbHNlLCBtb2R1bGU6IGZhbHNlLCBjb25zb2xlOiBmYWxzZSAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSgpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuZ2V0U2l6ZSA9IGZhY3RvcnkoKTtcbiAgfVxuXG59KSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBoZWxwZXJzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIGdldCBhIG51bWJlciBmcm9tIGEgc3RyaW5nLCBub3QgYSBwZXJjZW50YWdlXG5mdW5jdGlvbiBnZXRTdHlsZVNpemUoIHZhbHVlICkge1xuICB2YXIgbnVtID0gcGFyc2VGbG9hdCggdmFsdWUgKTtcbiAgLy8gbm90IGEgcGVyY2VudCBsaWtlICcxMDAlJywgYW5kIGEgbnVtYmVyXG4gIHZhciBpc1ZhbGlkID0gdmFsdWUuaW5kZXhPZignJScpID09IC0xICYmICFpc05hTiggbnVtICk7XG4gIHJldHVybiBpc1ZhbGlkICYmIG51bTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBsb2dFcnJvciA9IHR5cGVvZiBjb25zb2xlID09ICd1bmRlZmluZWQnID8gbm9vcCA6XG4gIGZ1bmN0aW9uKCBtZXNzYWdlICkge1xuICAgIGNvbnNvbGUuZXJyb3IoIG1lc3NhZ2UgKTtcbiAgfTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWVhc3VyZW1lbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbnZhciBtZWFzdXJlbWVudHMgPSBbXG4gICdwYWRkaW5nTGVmdCcsXG4gICdwYWRkaW5nUmlnaHQnLFxuICAncGFkZGluZ1RvcCcsXG4gICdwYWRkaW5nQm90dG9tJyxcbiAgJ21hcmdpbkxlZnQnLFxuICAnbWFyZ2luUmlnaHQnLFxuICAnbWFyZ2luVG9wJyxcbiAgJ21hcmdpbkJvdHRvbScsXG4gICdib3JkZXJMZWZ0V2lkdGgnLFxuICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJUb3BXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCdcbl07XG5cbnZhciBtZWFzdXJlbWVudHNMZW5ndGggPSBtZWFzdXJlbWVudHMubGVuZ3RoO1xuXG5mdW5jdGlvbiBnZXRaZXJvU2l6ZSgpIHtcbiAgdmFyIHNpemUgPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICAgIGlubmVyV2lkdGg6IDAsXG4gICAgaW5uZXJIZWlnaHQ6IDAsXG4gICAgb3V0ZXJXaWR0aDogMCxcbiAgICBvdXRlckhlaWdodDogMFxuICB9O1xuICBmb3IgKCB2YXIgaT0wOyBpIDwgbWVhc3VyZW1lbnRzTGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIG1lYXN1cmVtZW50ID0gbWVhc3VyZW1lbnRzW2ldO1xuICAgIHNpemVbIG1lYXN1cmVtZW50IF0gPSAwO1xuICB9XG4gIHJldHVybiBzaXplO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBnZXRTdHlsZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vKipcbiAqIGdldFN0eWxlLCBnZXQgc3R5bGUgb2YgZWxlbWVudCwgY2hlY2sgZm9yIEZpcmVmb3ggYnVnXG4gKiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD01NDgzOTdcbiAqL1xuZnVuY3Rpb24gZ2V0U3R5bGUoIGVsZW0gKSB7XG4gIHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoIGVsZW0gKTtcbiAgaWYgKCAhc3R5bGUgKSB7XG4gICAgbG9nRXJyb3IoICdTdHlsZSByZXR1cm5lZCAnICsgc3R5bGUgK1xuICAgICAgJy4gQXJlIHlvdSBydW5uaW5nIHRoaXMgY29kZSBpbiBhIGhpZGRlbiBpZnJhbWUgb24gRmlyZWZveD8gJyArXG4gICAgICAnU2VlIGh0dHA6Ly9iaXQubHkvZ2V0c2l6ZWJ1ZzEnICk7XG4gIH1cbiAgcmV0dXJuIHN0eWxlO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBzZXR1cCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG52YXIgaXNTZXR1cCA9IGZhbHNlO1xuXG52YXIgaXNCb3hTaXplT3V0ZXI7XG5cbi8qKlxuICogc2V0dXBcbiAqIGNoZWNrIGlzQm94U2l6ZXJPdXRlclxuICogZG8gb24gZmlyc3QgZ2V0U2l6ZSgpIHJhdGhlciB0aGFuIG9uIHBhZ2UgbG9hZCBmb3IgRmlyZWZveCBidWdcbiAqL1xuZnVuY3Rpb24gc2V0dXAoKSB7XG4gIC8vIHNldHVwIG9uY2VcbiAgaWYgKCBpc1NldHVwICkge1xuICAgIHJldHVybjtcbiAgfVxuICBpc1NldHVwID0gdHJ1ZTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBib3ggc2l6aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgLyoqXG4gICAqIFdlYktpdCBtZWFzdXJlcyB0aGUgb3V0ZXItd2lkdGggb24gc3R5bGUud2lkdGggb24gYm9yZGVyLWJveCBlbGVtc1xuICAgKiBJRSAmIEZpcmVmb3g8MjkgbWVhc3VyZXMgdGhlIGlubmVyLXdpZHRoXG4gICAqL1xuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5zdHlsZS53aWR0aCA9ICcyMDBweCc7XG4gIGRpdi5zdHlsZS5wYWRkaW5nID0gJzFweCAycHggM3B4IDRweCc7XG4gIGRpdi5zdHlsZS5ib3JkZXJTdHlsZSA9ICdzb2xpZCc7XG4gIGRpdi5zdHlsZS5ib3JkZXJXaWR0aCA9ICcxcHggMnB4IDNweCA0cHgnO1xuICBkaXYuc3R5bGUuYm94U2l6aW5nID0gJ2JvcmRlci1ib3gnO1xuXG4gIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGJvZHkuYXBwZW5kQ2hpbGQoIGRpdiApO1xuICB2YXIgc3R5bGUgPSBnZXRTdHlsZSggZGl2ICk7XG5cbiAgZ2V0U2l6ZS5pc0JveFNpemVPdXRlciA9IGlzQm94U2l6ZU91dGVyID0gZ2V0U3R5bGVTaXplKCBzdHlsZS53aWR0aCApID09IDIwMDtcbiAgYm9keS5yZW1vdmVDaGlsZCggZGl2ICk7XG5cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZ2V0U2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBnZXRTaXplKCBlbGVtICkge1xuICBzZXR1cCgpO1xuXG4gIC8vIHVzZSBxdWVyeVNlbGV0b3IgaWYgZWxlbSBpcyBzdHJpbmdcbiAgaWYgKCB0eXBlb2YgZWxlbSA9PSAnc3RyaW5nJyApIHtcbiAgICBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggZWxlbSApO1xuICB9XG5cbiAgLy8gZG8gbm90IHByb2NlZWQgb24gbm9uLW9iamVjdHNcbiAgaWYgKCAhZWxlbSB8fCB0eXBlb2YgZWxlbSAhPSAnb2JqZWN0JyB8fCAhZWxlbS5ub2RlVHlwZSApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgc3R5bGUgPSBnZXRTdHlsZSggZWxlbSApO1xuXG4gIC8vIGlmIGhpZGRlbiwgZXZlcnl0aGluZyBpcyAwXG4gIGlmICggc3R5bGUuZGlzcGxheSA9PSAnbm9uZScgKSB7XG4gICAgcmV0dXJuIGdldFplcm9TaXplKCk7XG4gIH1cblxuICB2YXIgc2l6ZSA9IHt9O1xuICBzaXplLndpZHRoID0gZWxlbS5vZmZzZXRXaWR0aDtcbiAgc2l6ZS5oZWlnaHQgPSBlbGVtLm9mZnNldEhlaWdodDtcblxuICB2YXIgaXNCb3JkZXJCb3ggPSBzaXplLmlzQm9yZGVyQm94ID0gc3R5bGUuYm94U2l6aW5nID09ICdib3JkZXItYm94JztcblxuICAvLyBnZXQgYWxsIG1lYXN1cmVtZW50c1xuICBmb3IgKCB2YXIgaT0wOyBpIDwgbWVhc3VyZW1lbnRzTGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIG1lYXN1cmVtZW50ID0gbWVhc3VyZW1lbnRzW2ldO1xuICAgIHZhciB2YWx1ZSA9IHN0eWxlWyBtZWFzdXJlbWVudCBdO1xuICAgIHZhciBudW0gPSBwYXJzZUZsb2F0KCB2YWx1ZSApO1xuICAgIC8vIGFueSAnYXV0bycsICdtZWRpdW0nIHZhbHVlIHdpbGwgYmUgMFxuICAgIHNpemVbIG1lYXN1cmVtZW50IF0gPSAhaXNOYU4oIG51bSApID8gbnVtIDogMDtcbiAgfVxuXG4gIHZhciBwYWRkaW5nV2lkdGggPSBzaXplLnBhZGRpbmdMZWZ0ICsgc2l6ZS5wYWRkaW5nUmlnaHQ7XG4gIHZhciBwYWRkaW5nSGVpZ2h0ID0gc2l6ZS5wYWRkaW5nVG9wICsgc2l6ZS5wYWRkaW5nQm90dG9tO1xuICB2YXIgbWFyZ2luV2lkdGggPSBzaXplLm1hcmdpbkxlZnQgKyBzaXplLm1hcmdpblJpZ2h0O1xuICB2YXIgbWFyZ2luSGVpZ2h0ID0gc2l6ZS5tYXJnaW5Ub3AgKyBzaXplLm1hcmdpbkJvdHRvbTtcbiAgdmFyIGJvcmRlcldpZHRoID0gc2l6ZS5ib3JkZXJMZWZ0V2lkdGggKyBzaXplLmJvcmRlclJpZ2h0V2lkdGg7XG4gIHZhciBib3JkZXJIZWlnaHQgPSBzaXplLmJvcmRlclRvcFdpZHRoICsgc2l6ZS5ib3JkZXJCb3R0b21XaWR0aDtcblxuICB2YXIgaXNCb3JkZXJCb3hTaXplT3V0ZXIgPSBpc0JvcmRlckJveCAmJiBpc0JveFNpemVPdXRlcjtcblxuICAvLyBvdmVyd3JpdGUgd2lkdGggYW5kIGhlaWdodCBpZiB3ZSBjYW4gZ2V0IGl0IGZyb20gc3R5bGVcbiAgdmFyIHN0eWxlV2lkdGggPSBnZXRTdHlsZVNpemUoIHN0eWxlLndpZHRoICk7XG4gIGlmICggc3R5bGVXaWR0aCAhPT0gZmFsc2UgKSB7XG4gICAgc2l6ZS53aWR0aCA9IHN0eWxlV2lkdGggK1xuICAgICAgLy8gYWRkIHBhZGRpbmcgYW5kIGJvcmRlciB1bmxlc3MgaXQncyBhbHJlYWR5IGluY2x1ZGluZyBpdFxuICAgICAgKCBpc0JvcmRlckJveFNpemVPdXRlciA/IDAgOiBwYWRkaW5nV2lkdGggKyBib3JkZXJXaWR0aCApO1xuICB9XG5cbiAgdmFyIHN0eWxlSGVpZ2h0ID0gZ2V0U3R5bGVTaXplKCBzdHlsZS5oZWlnaHQgKTtcbiAgaWYgKCBzdHlsZUhlaWdodCAhPT0gZmFsc2UgKSB7XG4gICAgc2l6ZS5oZWlnaHQgPSBzdHlsZUhlaWdodCArXG4gICAgICAvLyBhZGQgcGFkZGluZyBhbmQgYm9yZGVyIHVubGVzcyBpdCdzIGFscmVhZHkgaW5jbHVkaW5nIGl0XG4gICAgICAoIGlzQm9yZGVyQm94U2l6ZU91dGVyID8gMCA6IHBhZGRpbmdIZWlnaHQgKyBib3JkZXJIZWlnaHQgKTtcbiAgfVxuXG4gIHNpemUuaW5uZXJXaWR0aCA9IHNpemUud2lkdGggLSAoIHBhZGRpbmdXaWR0aCArIGJvcmRlcldpZHRoICk7XG4gIHNpemUuaW5uZXJIZWlnaHQgPSBzaXplLmhlaWdodCAtICggcGFkZGluZ0hlaWdodCArIGJvcmRlckhlaWdodCApO1xuXG4gIHNpemUub3V0ZXJXaWR0aCA9IHNpemUud2lkdGggKyBtYXJnaW5XaWR0aDtcbiAgc2l6ZS5vdXRlckhlaWdodCA9IHNpemUuaGVpZ2h0ICsgbWFyZ2luSGVpZ2h0O1xuXG4gIHJldHVybiBzaXplO1xufVxuXG5yZXR1cm4gZ2V0U2l6ZTtcblxufSk7XG4iLCJmdW5jdGlvbiBoaWRlUGxhY2Vob2xkZXJPbkZvY3VzKGEpe3RhcmdldD1hLmN1cnJlbnRUYXJnZXQ/YS5jdXJyZW50VGFyZ2V0OmEuc3JjRWxlbWVudCx0YXJnZXQudmFsdWU9PXRhcmdldC5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKSYmKHRhcmdldC52YWx1ZT1cIlwiKX1mdW5jdGlvbiB1bmZvY3VzT25BbkVsZW1lbnQoYSl7dGFyZ2V0PWEuY3VycmVudFRhcmdldD9hLmN1cnJlbnRUYXJnZXQ6YS5zcmNFbGVtZW50LFwiXCI9PXRhcmdldC52YWx1ZSYmKHRhcmdldC52YWx1ZT10YXJnZXQuZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIikpfWlmKCEoXCJwbGFjZWhvbGRlclwiaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpKSlmb3IodmFyIGlucHV0cz1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpLGk9MDtpPGlucHV0cy5sZW5ndGg7aSsrKWlucHV0c1tpXS52YWx1ZXx8KGlucHV0c1tpXS52YWx1ZT1pbnB1dHNbaV0uZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIikpLGlucHV0c1tpXS5hZGRFdmVudExpc3RlbmVyPyhpbnB1dHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsaGlkZVBsYWNlaG9sZGVyT25Gb2N1cywhMSksaW5wdXRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsdW5mb2N1c09uQW5FbGVtZW50LCExKSk6aW5wdXRzW2ldLmF0dGFjaEV2ZW50JiYoaW5wdXRzW2ldLmF0dGFjaEV2ZW50KFwib25jbGlja1wiLGhpZGVQbGFjZWhvbGRlck9uRm9jdXMpLGlucHV0c1tpXS5hdHRhY2hFdmVudChcIm9uYmx1clwiLHVuZm9jdXNPbkFuRWxlbWVudCkpOyIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIoZnVuY3Rpb24gKHJvb3QpIHtcblxuICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBwcm9taXNlLXBvbHlmaWxsIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuICAvLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbiAgdmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcblxuICBmdW5jdGlvbiBub29wKCkge31cbiAgXG4gIC8vIFBvbHlmaWxsIGZvciBGdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuICBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICAgIHRoaXMuX3N0YXRlID0gMDtcbiAgICB0aGlzLl9oYW5kbGVkID0gZmFsc2U7XG4gICAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZGVmZXJyZWRzID0gW107XG5cbiAgICBkb1Jlc29sdmUoZm4sIHRoaXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gICAgd2hpbGUgKHNlbGYuX3N0YXRlID09PSAzKSB7XG4gICAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gICAgfVxuICAgIGlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuICAgICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLl9oYW5kbGVkID0gdHJ1ZTtcbiAgICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICAgIGlmIChjYiA9PT0gbnVsbCkge1xuICAgICAgICAoc2VsZi5fc3RhdGUgPT09IDEgPyByZXNvbHZlIDogcmVqZWN0KShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl92YWx1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciByZXQ7XG4gICAgICB0cnkge1xuICAgICAgICByZXQgPSBjYihzZWxmLl92YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpO1xuICAgICAgaWYgKG5ld1ZhbHVlICYmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgdmFyIHRoZW4gPSBuZXdWYWx1ZS50aGVuO1xuICAgICAgICBpZiAobmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGRvUmVzb2x2ZShiaW5kKHRoZW4sIG5ld1ZhbHVlKSwgc2VsZik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgZmluYWxlKHNlbGYpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChzZWxmLCBlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgICBzZWxmLl9zdGF0ZSA9IDI7XG4gICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBmaW5hbGUoc2VsZik7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICAgIGlmIChzZWxmLl9zdGF0ZSA9PT0gMiAmJiBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG4gICAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oc2VsZi5fdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5fZGVmZXJyZWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgICB9XG4gICAgc2VsZi5fZGVmZXJyZWRzID0gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2UpIHtcbiAgICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICAgIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICAgKiBvbkZ1bGZpbGxlZCBhbmQgb25SZWplY3RlZCBhcmUgb25seSBjYWxsZWQgb25jZS5cbiAgICpcbiAgICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICAgKi9cbiAgZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG4gICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgZm4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHNlbGYsIHZhbHVlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlamVjdChzZWxmLCByZWFzb24pO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIHJlamVjdChzZWxmLCBleCk7XG4gICAgfVxuICB9XG5cbiAgUHJvbWlzZS5wcm90b3R5cGVbJ2NhdGNoJ10gPSBmdW5jdGlvbiAob25SZWplY3RlZCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gIH07XG5cbiAgUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgIHZhciBwcm9tID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yKShub29wKTtcblxuICAgIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICAgIHJldHVybiBwcm9tO1xuICB9O1xuXG4gIFByb21pc2UuYWxsID0gZnVuY3Rpb24gKGFycikge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgIHZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcblxuICAgICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIHRoZW4uY2FsbCh2YWwsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICBQcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWplY3QodmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIFByb21pc2UucmFjZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB2YWx1ZXNbaV0udGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8vIFVzZSBwb2x5ZmlsbCBmb3Igc2V0SW1tZWRpYXRlIGZvciBwZXJmb3JtYW5jZSBnYWluc1xuICBQcm9taXNlLl9pbW1lZGlhdGVGbiA9ICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmIGZ1bmN0aW9uIChmbikgeyBzZXRJbW1lZGlhdGUoZm4pOyB9KSB8fFxuICAgIGZ1bmN0aW9uIChmbikge1xuICAgICAgc2V0VGltZW91dEZ1bmMoZm4sIDApO1xuICAgIH07XG5cbiAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjonLCBlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgaW1tZWRpYXRlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgY2FsbGJhY2tzXG4gICAqIEBwYXJhbSBmbiB7ZnVuY3Rpb259IEZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIFByb21pc2UuX3NldEltbWVkaWF0ZUZuID0gZnVuY3Rpb24gX3NldEltbWVkaWF0ZUZuKGZuKSB7XG4gICAgUHJvbWlzZS5faW1tZWRpYXRlRm4gPSBmbjtcbiAgfTtcblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlIG9uIHVuaGFuZGxlZCByZWplY3Rpb25cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiB1bmhhbmRsZWQgcmVqZWN0aW9uXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBQcm9taXNlLl9zZXRVbmhhbmRsZWRSZWplY3Rpb25GbiA9IGZ1bmN0aW9uIF9zZXRVbmhhbmRsZWRSZWplY3Rpb25Gbihmbikge1xuICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZm47XG4gIH07XG4gIFxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4gIH0gZWxzZSBpZiAoIXJvb3QuUHJvbWlzZSkge1xuICAgIHJvb3QuUHJvbWlzZSA9IFByb21pc2U7XG4gIH1cblxufSkodGhpcyk7XG4iLCIvKiEgc21vb3RoLXNjcm9sbCB2MTAuMi4xIHwgKGMpIDIwMTYgQ2hyaXMgRmVyZGluYW5kaSB8IE1JVCBMaWNlbnNlIHwgaHR0cDovL2dpdGh1Yi5jb20vY2ZlcmRpbmFuZGkvc21vb3RoLXNjcm9sbCAqL1xuIShmdW5jdGlvbihlLHQpe1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW10sdChlKSk6XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9dChlKTplLnNtb290aFNjcm9sbD10KGUpfSkoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6dGhpcy53aW5kb3d8fHRoaXMuZ2xvYmFsLChmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjt2YXIgdCxuLG8scixhLGMsbCxpPXt9LHU9XCJxdWVyeVNlbGVjdG9yXCJpbiBkb2N1bWVudCYmXCJhZGRFdmVudExpc3RlbmVyXCJpbiBlLHM9e3NlbGVjdG9yOlwiW2RhdGEtc2Nyb2xsXVwiLHNlbGVjdG9ySGVhZGVyOm51bGwsc3BlZWQ6NTAwLGVhc2luZzpcImVhc2VJbk91dEN1YmljXCIsb2Zmc2V0OjAsY2FsbGJhY2s6ZnVuY3Rpb24oKXt9fSxkPWZ1bmN0aW9uKCl7dmFyIGU9e30sdD0hMSxuPTAsbz1hcmd1bWVudHMubGVuZ3RoO1wiW29iamVjdCBCb29sZWFuXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZ3VtZW50c1swXSkmJih0PWFyZ3VtZW50c1swXSxuKyspO2Zvcih2YXIgcj1mdW5jdGlvbihuKXtmb3IodmFyIG8gaW4gbilPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobixvKSYmKHQmJlwiW29iamVjdCBPYmplY3RdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobltvXSk/ZVtvXT1kKCEwLGVbb10sbltvXSk6ZVtvXT1uW29dKX07bjxvO24rKyl7dmFyIGE9YXJndW1lbnRzW25dO3IoYSl9cmV0dXJuIGV9LGY9ZnVuY3Rpb24oZSl7cmV0dXJuIE1hdGgubWF4KGUuc2Nyb2xsSGVpZ2h0LGUub2Zmc2V0SGVpZ2h0LGUuY2xpZW50SGVpZ2h0KX0saD1mdW5jdGlvbihlLHQpe2ZvcihFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzfHwoRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcz1FbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzU2VsZWN0b3J8fEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3Rvcnx8RWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3J8fEVsZW1lbnQucHJvdG90eXBlLm9NYXRjaGVzU2VsZWN0b3J8fEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3Rvcnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PSh0aGlzLmRvY3VtZW50fHx0aGlzLm93bmVyRG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoZSksbj10Lmxlbmd0aDstLW4+PTAmJnQuaXRlbShuKSE9PXRoaXM7KTtyZXR1cm4gbj4tMX0pO2UmJmUhPT1kb2N1bWVudDtlPWUucGFyZW50Tm9kZSlpZihlLm1hdGNoZXModCkpcmV0dXJuIGU7cmV0dXJuIG51bGx9LG09ZnVuY3Rpb24oZSl7XCIjXCI9PT1lLmNoYXJBdCgwKSYmKGU9ZS5zdWJzdHIoMSkpO2Zvcih2YXIgdCxuPVN0cmluZyhlKSxvPW4ubGVuZ3RoLHI9LTEsYT1cIlwiLGM9bi5jaGFyQ29kZUF0KDApOysrcjxvOyl7aWYodD1uLmNoYXJDb2RlQXQociksMD09PXQpdGhyb3cgbmV3IEludmFsaWRDaGFyYWN0ZXJFcnJvcihcIkludmFsaWQgY2hhcmFjdGVyOiB0aGUgaW5wdXQgY29udGFpbnMgVSswMDAwLlwiKTthKz10Pj0xJiZ0PD0zMXx8MTI3PT10fHwwPT09ciYmdD49NDgmJnQ8PTU3fHwxPT09ciYmdD49NDgmJnQ8PTU3JiY0NT09PWM/XCJcXFxcXCIrdC50b1N0cmluZygxNikrXCIgXCI6dD49MTI4fHw0NT09PXR8fDk1PT09dHx8dD49NDgmJnQ8PTU3fHx0Pj02NSYmdDw9OTB8fHQ+PTk3JiZ0PD0xMjI/bi5jaGFyQXQocik6XCJcXFxcXCIrbi5jaGFyQXQocil9cmV0dXJuXCIjXCIrYX0scD1mdW5jdGlvbihlLHQpe3ZhciBuO3JldHVyblwiZWFzZUluUXVhZFwiPT09ZSYmKG49dCp0KSxcImVhc2VPdXRRdWFkXCI9PT1lJiYobj10KigyLXQpKSxcImVhc2VJbk91dFF1YWRcIj09PWUmJihuPXQ8LjU/Mip0KnQ6LTErKDQtMip0KSp0KSxcImVhc2VJbkN1YmljXCI9PT1lJiYobj10KnQqdCksXCJlYXNlT3V0Q3ViaWNcIj09PWUmJihuPS0tdCp0KnQrMSksXCJlYXNlSW5PdXRDdWJpY1wiPT09ZSYmKG49dDwuNT80KnQqdCp0Oih0LTEpKigyKnQtMikqKDIqdC0yKSsxKSxcImVhc2VJblF1YXJ0XCI9PT1lJiYobj10KnQqdCp0KSxcImVhc2VPdXRRdWFydFwiPT09ZSYmKG49MS0gLS10KnQqdCp0KSxcImVhc2VJbk91dFF1YXJ0XCI9PT1lJiYobj10PC41PzgqdCp0KnQqdDoxLTgqLS10KnQqdCp0KSxcImVhc2VJblF1aW50XCI9PT1lJiYobj10KnQqdCp0KnQpLFwiZWFzZU91dFF1aW50XCI9PT1lJiYobj0xKy0tdCp0KnQqdCp0KSxcImVhc2VJbk91dFF1aW50XCI9PT1lJiYobj10PC41PzE2KnQqdCp0KnQqdDoxKzE2Ki0tdCp0KnQqdCp0KSxufHx0fSxnPWZ1bmN0aW9uKGUsdCxuKXt2YXIgbz0wO2lmKGUub2Zmc2V0UGFyZW50KWRvIG8rPWUub2Zmc2V0VG9wLGU9ZS5vZmZzZXRQYXJlbnQ7d2hpbGUoZSk7cmV0dXJuIG89TWF0aC5tYXgoby10LW4sMCksTWF0aC5taW4obyx2KCktYigpKX0sYj1mdW5jdGlvbigpe3JldHVybiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LGUuaW5uZXJIZWlnaHR8fDApfSx2PWZ1bmN0aW9uKCl7cmV0dXJuIE1hdGgubWF4KGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0LGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQsZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQsZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodCxkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KX0seT1mdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJvYmplY3RcIj09dHlwZW9mIEpTT04mJlwiZnVuY3Rpb25cIj09dHlwZW9mIEpTT04ucGFyc2U/SlNPTi5wYXJzZShlKTp7fX0sTz1mdW5jdGlvbihlKXtyZXR1cm4gZT9mKGUpK2Uub2Zmc2V0VG9wOjB9LFM9ZnVuY3Rpb24odCxuLG8pe298fCh0LmZvY3VzKCksZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5pZCE9PXQuaWQmJih0LnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsXCItMVwiKSx0LmZvY3VzKCksdC5zdHlsZS5vdXRsaW5lPVwibm9uZVwiKSxlLnNjcm9sbFRvKDAsbikpfTtpLmFuaW1hdGVTY3JvbGw9ZnVuY3Rpb24obixvLGMpe3ZhciBpPXkobz9vLmdldEF0dHJpYnV0ZShcImRhdGEtb3B0aW9uc1wiKTpudWxsKSx1PWQodHx8cyxjfHx7fSxpKSxmPVwiW29iamVjdCBOdW1iZXJdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobiksaD1mfHwhbi50YWdOYW1lP251bGw6bjtpZihmfHxoKXt2YXIgbT1lLnBhZ2VZT2Zmc2V0O3Uuc2VsZWN0b3JIZWFkZXImJiFyJiYocj1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHUuc2VsZWN0b3JIZWFkZXIpKSxhfHwoYT1PKHIpKTt2YXIgYixFLEk9Zj9uOmcoaCxhLHBhcnNlSW50KHUub2Zmc2V0LDEwKSksSD1JLW0sQT12KCksaj0wLEM9ZnVuY3Rpb24odCxyLGEpe3ZhciBjPWUucGFnZVlPZmZzZXQ7KHQ9PXJ8fGM9PXJ8fGUuaW5uZXJIZWlnaHQrYz49QSkmJihjbGVhckludGVydmFsKGEpLFMobixyLGYpLHUuY2FsbGJhY2sobixvKSl9LE09ZnVuY3Rpb24oKXtqKz0xNixiPWovcGFyc2VJbnQodS5zcGVlZCwxMCksYj1iPjE/MTpiLEU9bStIKnAodS5lYXNpbmcsYiksZS5zY3JvbGxUbygwLE1hdGguZmxvb3IoRSkpLEMoRSxJLGwpfSx3PWZ1bmN0aW9uKCl7Y2xlYXJJbnRlcnZhbChsKSxsPXNldEludGVydmFsKE0sMTYpfTswPT09ZS5wYWdlWU9mZnNldCYmZS5zY3JvbGxUbygwLDApLHcoKX19O3ZhciBFPWZ1bmN0aW9uKHQpe3ZhciByO3RyeXtyPW0oZGVjb2RlVVJJQ29tcG9uZW50KGUubG9jYXRpb24uaGFzaCkpfWNhdGNoKHQpe3I9bShlLmxvY2F0aW9uLmhhc2gpfW4mJihuLmlkPW4uZ2V0QXR0cmlidXRlKFwiZGF0YS1zY3JvbGwtaWRcIiksaS5hbmltYXRlU2Nyb2xsKG4sbyksbj1udWxsLG89bnVsbCl9LEk9ZnVuY3Rpb24ocil7aWYoMD09PXIuYnV0dG9uJiYhci5tZXRhS2V5JiYhci5jdHJsS2V5JiYobz1oKHIudGFyZ2V0LHQuc2VsZWN0b3IpLG8mJlwiYVwiPT09by50YWdOYW1lLnRvTG93ZXJDYXNlKCkmJm8uaG9zdG5hbWU9PT1lLmxvY2F0aW9uLmhvc3RuYW1lJiZvLnBhdGhuYW1lPT09ZS5sb2NhdGlvbi5wYXRobmFtZSYmLyMvLnRlc3Qoby5ocmVmKSkpe3ZhciBhO3RyeXthPW0oZGVjb2RlVVJJQ29tcG9uZW50KG8uaGFzaCkpfWNhdGNoKGUpe2E9bShvLmhhc2gpfWlmKFwiI1wiPT09YSl7ci5wcmV2ZW50RGVmYXVsdCgpLG49ZG9jdW1lbnQuYm9keTt2YXIgYz1uLmlkP24uaWQ6XCJzbW9vdGgtc2Nyb2xsLXRvcFwiO3JldHVybiBuLnNldEF0dHJpYnV0ZShcImRhdGEtc2Nyb2xsLWlkXCIsYyksbi5pZD1cIlwiLHZvaWQoZS5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKT09PWM/RSgpOmUubG9jYXRpb24uaGFzaD1jKX1uPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYSksbiYmKG4uc2V0QXR0cmlidXRlKFwiZGF0YS1zY3JvbGwtaWRcIixuLmlkKSxuLmlkPVwiXCIsby5oYXNoPT09ZS5sb2NhdGlvbi5oYXNoJiYoci5wcmV2ZW50RGVmYXVsdCgpLEUoKSkpfX0sSD1mdW5jdGlvbihlKXtjfHwoYz1zZXRUaW1lb3V0KChmdW5jdGlvbigpe2M9bnVsbCxhPU8ocil9KSw2NikpfTtyZXR1cm4gaS5kZXN0cm95PWZ1bmN0aW9uKCl7dCYmKGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLEksITEpLGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLEgsITEpLHQ9bnVsbCxuPW51bGwsbz1udWxsLHI9bnVsbCxhPW51bGwsYz1udWxsLGw9bnVsbCl9LGkuaW5pdD1mdW5jdGlvbihuKXt1JiYoaS5kZXN0cm95KCksdD1kKHMsbnx8e30pLHI9dC5zZWxlY3RvckhlYWRlcj9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHQuc2VsZWN0b3JIZWFkZXIpOm51bGwsYT1PKHIpLGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLEksITEpLGUuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIixFLCExKSxyJiZlLmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIixILCExKSl9LGl9KSk7IiwiLyohXG4gKiBUYXAgbGlzdGVuZXIgdjIuMC4wXG4gKiBsaXN0ZW5zIHRvIHRhcHNcbiAqIE1JVCBsaWNlbnNlXG4gKi9cblxuLypqc2hpbnQgYnJvd3NlcjogdHJ1ZSwgdW51c2VkOiB0cnVlLCB1bmRlZjogdHJ1ZSwgc3RyaWN0OiB0cnVlICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qanNoaW50IHN0cmljdDogZmFsc2UqLyAvKmdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHJlcXVpcmUgKi9cblxuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJ3VuaXBvaW50ZXIvdW5pcG9pbnRlcidcbiAgICBdLCBmdW5jdGlvbiggVW5pcG9pbnRlciApIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIFVuaXBvaW50ZXIgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJ3VuaXBvaW50ZXInKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuVGFwTGlzdGVuZXIgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LlVuaXBvaW50ZXJcbiAgICApO1xuICB9XG5cbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBVbmlwb2ludGVyICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICBUYXBMaXN0ZW5lciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG5mdW5jdGlvbiBUYXBMaXN0ZW5lciggZWxlbSApIHtcbiAgdGhpcy5iaW5kVGFwKCBlbGVtICk7XG59XG5cbi8vIGluaGVyaXQgVW5pcG9pbnRlciAmIEV2ZW50RW1pdHRlclxudmFyIHByb3RvID0gVGFwTGlzdGVuZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggVW5pcG9pbnRlci5wcm90b3R5cGUgKTtcblxuLyoqXG4gKiBiaW5kIHRhcCBldmVudCB0byBlbGVtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1cbiAqL1xucHJvdG8uYmluZFRhcCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICBpZiAoICFlbGVtICkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnVuYmluZFRhcCgpO1xuICB0aGlzLnRhcEVsZW1lbnQgPSBlbGVtO1xuICB0aGlzLl9iaW5kU3RhcnRFdmVudCggZWxlbSwgdHJ1ZSApO1xufTtcblxucHJvdG8udW5iaW5kVGFwID0gZnVuY3Rpb24oKSB7XG4gIGlmICggIXRoaXMudGFwRWxlbWVudCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5fYmluZFN0YXJ0RXZlbnQoIHRoaXMudGFwRWxlbWVudCwgdHJ1ZSApO1xuICBkZWxldGUgdGhpcy50YXBFbGVtZW50O1xufTtcblxuLyoqXG4gKiBwb2ludGVyIHVwXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHBhcmFtIHtFdmVudCBvciBUb3VjaH0gcG9pbnRlclxuICovXG5wcm90by5wb2ludGVyVXAgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIC8vIGlnbm9yZSBlbXVsYXRlZCBtb3VzZSB1cCBjbGlja3NcbiAgaWYgKCB0aGlzLmlzSWdub3JpbmdNb3VzZVVwICYmIGV2ZW50LnR5cGUgPT0gJ21vdXNldXAnICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBwb2ludGVyUG9pbnQgPSBVbmlwb2ludGVyLmdldFBvaW50ZXJQb2ludCggcG9pbnRlciApO1xuICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy50YXBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2Nyb2xsWCA9IHdpbmRvdy5wYWdlWE9mZnNldDtcbiAgdmFyIHNjcm9sbFkgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIC8vIGNhbGN1bGF0ZSBpZiBwb2ludGVyIGlzIGluc2lkZSB0YXBFbGVtZW50XG4gIHZhciBpc0luc2lkZSA9IHBvaW50ZXJQb2ludC54ID49IGJvdW5kaW5nUmVjdC5sZWZ0ICsgc2Nyb2xsWCAmJlxuICAgIHBvaW50ZXJQb2ludC54IDw9IGJvdW5kaW5nUmVjdC5yaWdodCArIHNjcm9sbFggJiZcbiAgICBwb2ludGVyUG9pbnQueSA+PSBib3VuZGluZ1JlY3QudG9wICsgc2Nyb2xsWSAmJlxuICAgIHBvaW50ZXJQb2ludC55IDw9IGJvdW5kaW5nUmVjdC5ib3R0b20gKyBzY3JvbGxZO1xuICAvLyB0cmlnZ2VyIGNhbGxiYWNrIGlmIHBvaW50ZXIgaXMgaW5zaWRlIGVsZW1lbnRcbiAgaWYgKCBpc0luc2lkZSApIHtcbiAgICB0aGlzLmVtaXRFdmVudCggJ3RhcCcsIFsgZXZlbnQsIHBvaW50ZXIgXSApO1xuICB9XG5cbiAgLy8gc2V0IGZsYWcgZm9yIGVtdWxhdGVkIGNsaWNrcyAzMDBtcyBhZnRlciB0b3VjaGVuZFxuICBpZiAoIGV2ZW50LnR5cGUgIT0gJ21vdXNldXAnICkge1xuICAgIHRoaXMuaXNJZ25vcmluZ01vdXNlVXAgPSB0cnVlO1xuICAgIC8vIHJlc2V0IGZsYWcgYWZ0ZXIgMzAwbXNcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgZGVsZXRlIF90aGlzLmlzSWdub3JpbmdNb3VzZVVwO1xuICAgIH0sIDQwMCApO1xuICB9XG59O1xuXG5wcm90by5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucG9pbnRlckRvbmUoKTtcbiAgdGhpcy51bmJpbmRUYXAoKTtcbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5yZXR1cm4gVGFwTGlzdGVuZXI7XG5cbn0pKTtcbiIsIi8qIVxuICogVW5pZHJhZ2dlciB2Mi4xLjBcbiAqIERyYWdnYWJsZSBiYXNlIGNsYXNzXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHVudXNlZDogdHJ1ZSwgdW5kZWY6IHRydWUsIHN0cmljdDogdHJ1ZSAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKmpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSwgcmVxdWlyZSAqL1xuXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAndW5pcG9pbnRlci91bmlwb2ludGVyJ1xuICAgIF0sIGZ1bmN0aW9uKCBVbmlwb2ludGVyICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgVW5pcG9pbnRlciApO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgndW5pcG9pbnRlcicpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5VbmlkcmFnZ2VyID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5Vbmlwb2ludGVyXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgVW5pcG9pbnRlciApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLSAgLS0tLS0gLy9cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFVuaWRyYWdnZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gVW5pZHJhZ2dlcigpIHt9XG5cbi8vIGluaGVyaXQgVW5pcG9pbnRlciAmIEV2RW1pdHRlclxudmFyIHByb3RvID0gVW5pZHJhZ2dlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBVbmlwb2ludGVyLnByb3RvdHlwZSApO1xuXG4vLyAtLS0tLSBiaW5kIHN0YXJ0IC0tLS0tIC8vXG5cbnByb3RvLmJpbmRIYW5kbGVzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2JpbmRIYW5kbGVzKCB0cnVlICk7XG59O1xuXG5wcm90by51bmJpbmRIYW5kbGVzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2JpbmRIYW5kbGVzKCBmYWxzZSApO1xufTtcblxudmFyIG5hdmlnYXRvciA9IHdpbmRvdy5uYXZpZ2F0b3I7XG4vKipcbiAqIHdvcmtzIGFzIHVuYmluZGVyLCBhcyB5b3UgY2FuIC5iaW5kSGFuZGxlcyggZmFsc2UgKSB0byB1bmJpbmRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNCaW5kIC0gd2lsbCB1bmJpbmQgaWYgZmFsc2V5XG4gKi9cbnByb3RvLl9iaW5kSGFuZGxlcyA9IGZ1bmN0aW9uKCBpc0JpbmQgKSB7XG4gIC8vIG11bmdlIGlzQmluZCwgZGVmYXVsdCB0byB0cnVlXG4gIGlzQmluZCA9IGlzQmluZCA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6ICEhaXNCaW5kO1xuICAvLyBleHRyYSBiaW5kIGxvZ2ljXG4gIHZhciBiaW5kZXJFeHRyYTtcbiAgaWYgKCBuYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQgKSB7XG4gICAgYmluZGVyRXh0cmEgPSBmdW5jdGlvbiggaGFuZGxlICkge1xuICAgICAgLy8gZGlzYWJsZSBzY3JvbGxpbmcgb24gdGhlIGVsZW1lbnRcbiAgICAgIGhhbmRsZS5zdHlsZS50b3VjaEFjdGlvbiA9IGlzQmluZCA/ICdub25lJyA6ICcnO1xuICAgIH07XG4gIH0gZWxzZSBpZiAoIG5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkICkge1xuICAgIGJpbmRlckV4dHJhID0gZnVuY3Rpb24oIGhhbmRsZSApIHtcbiAgICAgIC8vIGRpc2FibGUgc2Nyb2xsaW5nIG9uIHRoZSBlbGVtZW50XG4gICAgICBoYW5kbGUuc3R5bGUubXNUb3VjaEFjdGlvbiA9IGlzQmluZCA/ICdub25lJyA6ICcnO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgYmluZGVyRXh0cmEgPSBub29wO1xuICB9XG4gIC8vIGJpbmQgZWFjaCBoYW5kbGVcbiAgdmFyIGJpbmRNZXRob2QgPSBpc0JpbmQgPyAnYWRkRXZlbnRMaXN0ZW5lcicgOiAncmVtb3ZlRXZlbnRMaXN0ZW5lcic7XG4gIGZvciAoIHZhciBpPTA7IGkgPCB0aGlzLmhhbmRsZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIGhhbmRsZSA9IHRoaXMuaGFuZGxlc1tpXTtcbiAgICB0aGlzLl9iaW5kU3RhcnRFdmVudCggaGFuZGxlLCBpc0JpbmQgKTtcbiAgICBiaW5kZXJFeHRyYSggaGFuZGxlICk7XG4gICAgaGFuZGxlWyBiaW5kTWV0aG9kIF0oICdjbGljaycsIHRoaXMgKTtcbiAgfVxufTtcblxuLy8gLS0tLS0gc3RhcnQgZXZlbnQgLS0tLS0gLy9cblxuLyoqXG4gKiBwb2ludGVyIHN0YXJ0XG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICogQHBhcmFtIHtFdmVudCBvciBUb3VjaH0gcG9pbnRlclxuICovXG5wcm90by5wb2ludGVyRG93biA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgLy8gZGlzbWlzcyByYW5nZSBzbGlkZXJzXG4gIGlmICggZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09ICdJTlBVVCcgJiYgZXZlbnQudGFyZ2V0LnR5cGUgPT0gJ3JhbmdlJyApIHtcbiAgICAvLyByZXNldCBwb2ludGVyRG93biBsb2dpY1xuICAgIHRoaXMuaXNQb2ludGVyRG93biA9IGZhbHNlO1xuICAgIGRlbGV0ZSB0aGlzLnBvaW50ZXJJZGVudGlmaWVyO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuX2RyYWdQb2ludGVyRG93biggZXZlbnQsIHBvaW50ZXIgKTtcbiAgLy8ga2x1ZGdlIHRvIGJsdXIgZm9jdXNlZCBpbnB1dHMgaW4gZHJhZ2dlclxuICB2YXIgZm9jdXNlZCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gIGlmICggZm9jdXNlZCAmJiBmb2N1c2VkLmJsdXIgKSB7XG4gICAgZm9jdXNlZC5ibHVyKCk7XG4gIH1cbiAgLy8gYmluZCBtb3ZlIGFuZCBlbmQgZXZlbnRzXG4gIHRoaXMuX2JpbmRQb3N0U3RhcnRFdmVudHMoIGV2ZW50ICk7XG4gIHRoaXMuZW1pdEV2ZW50KCAncG9pbnRlckRvd24nLCBbIGV2ZW50LCBwb2ludGVyIF0gKTtcbn07XG5cbi8vIGJhc2UgcG9pbnRlciBkb3duIGxvZ2ljXG5wcm90by5fZHJhZ1BvaW50ZXJEb3duID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICAvLyB0cmFjayB0byBzZWUgd2hlbiBkcmFnZ2luZyBzdGFydHNcbiAgdGhpcy5wb2ludGVyRG93blBvaW50ID0gVW5pcG9pbnRlci5nZXRQb2ludGVyUG9pbnQoIHBvaW50ZXIgKTtcblxuICB2YXIgY2FuUHJldmVudERlZmF1bHQgPSB0aGlzLmNhblByZXZlbnREZWZhdWx0T25Qb2ludGVyRG93biggZXZlbnQsIHBvaW50ZXIgKTtcbiAgaWYgKCBjYW5QcmV2ZW50RGVmYXVsdCApIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59O1xuXG4vLyBvdmVyd3JpdGVhYmxlIG1ldGhvZCBzbyBGbGlja2l0eSBjYW4gcHJldmVudCBmb3Igc2Nyb2xsaW5nXG5wcm90by5jYW5QcmV2ZW50RGVmYXVsdE9uUG9pbnRlckRvd24gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIC8vIHByZXZlbnQgZGVmYXVsdCwgdW5sZXNzIHRvdWNoc3RhcnQgb3IgPHNlbGVjdD5cbiAgcmV0dXJuIGV2ZW50LnRhcmdldC5ub2RlTmFtZSAhPSAnU0VMRUNUJztcbn07XG5cbi8vIC0tLS0tIG1vdmUgZXZlbnQgLS0tLS0gLy9cblxuLyoqXG4gKiBkcmFnIG1vdmVcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50IG9yIFRvdWNofSBwb2ludGVyXG4gKi9cbnByb3RvLnBvaW50ZXJNb3ZlID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB2YXIgbW92ZVZlY3RvciA9IHRoaXMuX2RyYWdQb2ludGVyTW92ZSggZXZlbnQsIHBvaW50ZXIgKTtcbiAgdGhpcy5lbWl0RXZlbnQoICdwb2ludGVyTW92ZScsIFsgZXZlbnQsIHBvaW50ZXIsIG1vdmVWZWN0b3IgXSApO1xuICB0aGlzLl9kcmFnTW92ZSggZXZlbnQsIHBvaW50ZXIsIG1vdmVWZWN0b3IgKTtcbn07XG5cbi8vIGJhc2UgcG9pbnRlciBtb3ZlIGxvZ2ljXG5wcm90by5fZHJhZ1BvaW50ZXJNb3ZlID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB2YXIgbW92ZVBvaW50ID0gVW5pcG9pbnRlci5nZXRQb2ludGVyUG9pbnQoIHBvaW50ZXIgKTtcbiAgdmFyIG1vdmVWZWN0b3IgPSB7XG4gICAgeDogbW92ZVBvaW50LnggLSB0aGlzLnBvaW50ZXJEb3duUG9pbnQueCxcbiAgICB5OiBtb3ZlUG9pbnQueSAtIHRoaXMucG9pbnRlckRvd25Qb2ludC55XG4gIH07XG4gIC8vIHN0YXJ0IGRyYWcgaWYgcG9pbnRlciBoYXMgbW92ZWQgZmFyIGVub3VnaCB0byBzdGFydCBkcmFnXG4gIGlmICggIXRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLmhhc0RyYWdTdGFydGVkKCBtb3ZlVmVjdG9yICkgKSB7XG4gICAgdGhpcy5fZHJhZ1N0YXJ0KCBldmVudCwgcG9pbnRlciApO1xuICB9XG4gIHJldHVybiBtb3ZlVmVjdG9yO1xufTtcblxuLy8gY29uZGl0aW9uIGlmIHBvaW50ZXIgaGFzIG1vdmVkIGZhciBlbm91Z2ggdG8gc3RhcnQgZHJhZ1xucHJvdG8uaGFzRHJhZ1N0YXJ0ZWQgPSBmdW5jdGlvbiggbW92ZVZlY3RvciApIHtcbiAgcmV0dXJuIE1hdGguYWJzKCBtb3ZlVmVjdG9yLnggKSA+IDMgfHwgTWF0aC5hYnMoIG1vdmVWZWN0b3IueSApID4gMztcbn07XG5cblxuLy8gLS0tLS0gZW5kIGV2ZW50IC0tLS0tIC8vXG5cbi8qKlxuICogcG9pbnRlciB1cFxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7RXZlbnQgb3IgVG91Y2h9IHBvaW50ZXJcbiAqL1xucHJvdG8ucG9pbnRlclVwID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLmVtaXRFdmVudCggJ3BvaW50ZXJVcCcsIFsgZXZlbnQsIHBvaW50ZXIgXSApO1xuICB0aGlzLl9kcmFnUG9pbnRlclVwKCBldmVudCwgcG9pbnRlciApO1xufTtcblxucHJvdG8uX2RyYWdQb2ludGVyVXAgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIGlmICggdGhpcy5pc0RyYWdnaW5nICkge1xuICAgIHRoaXMuX2RyYWdFbmQoIGV2ZW50LCBwb2ludGVyICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gcG9pbnRlciBkaWRuJ3QgbW92ZSBlbm91Z2ggZm9yIGRyYWcgdG8gc3RhcnRcbiAgICB0aGlzLl9zdGF0aWNDbGljayggZXZlbnQsIHBvaW50ZXIgKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZHJhZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vLyBkcmFnU3RhcnRcbnByb3RvLl9kcmFnU3RhcnQgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gIHRoaXMuZHJhZ1N0YXJ0UG9pbnQgPSBVbmlwb2ludGVyLmdldFBvaW50ZXJQb2ludCggcG9pbnRlciApO1xuICAvLyBwcmV2ZW50IGNsaWNrc1xuICB0aGlzLmlzUHJldmVudGluZ0NsaWNrcyA9IHRydWU7XG5cbiAgdGhpcy5kcmFnU3RhcnQoIGV2ZW50LCBwb2ludGVyICk7XG59O1xuXG5wcm90by5kcmFnU3RhcnQgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHRoaXMuZW1pdEV2ZW50KCAnZHJhZ1N0YXJ0JywgWyBldmVudCwgcG9pbnRlciBdICk7XG59O1xuXG4vLyBkcmFnTW92ZVxucHJvdG8uX2RyYWdNb3ZlID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyLCBtb3ZlVmVjdG9yICkge1xuICAvLyBkbyBub3QgZHJhZyBpZiBub3QgZHJhZ2dpbmcgeWV0XG4gIGlmICggIXRoaXMuaXNEcmFnZ2luZyApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLmRyYWdNb3ZlKCBldmVudCwgcG9pbnRlciwgbW92ZVZlY3RvciApO1xufTtcblxucHJvdG8uZHJhZ01vdmUgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIsIG1vdmVWZWN0b3IgKSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIHRoaXMuZW1pdEV2ZW50KCAnZHJhZ01vdmUnLCBbIGV2ZW50LCBwb2ludGVyLCBtb3ZlVmVjdG9yIF0gKTtcbn07XG5cbi8vIGRyYWdFbmRcbnByb3RvLl9kcmFnRW5kID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICAvLyBzZXQgZmxhZ3NcbiAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gIC8vIHJlLWVuYWJsZSBjbGlja2luZyBhc3luY1xuICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcbiAgICBkZWxldGUgdGhpcy5pc1ByZXZlbnRpbmdDbGlja3M7XG4gIH0uYmluZCggdGhpcyApICk7XG5cbiAgdGhpcy5kcmFnRW5kKCBldmVudCwgcG9pbnRlciApO1xufTtcblxucHJvdG8uZHJhZ0VuZCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5lbWl0RXZlbnQoICdkcmFnRW5kJywgWyBldmVudCwgcG9pbnRlciBdICk7XG59O1xuXG4vLyAtLS0tLSBvbmNsaWNrIC0tLS0tIC8vXG5cbi8vIGhhbmRsZSBhbGwgY2xpY2tzIGFuZCBwcmV2ZW50IGNsaWNrcyB3aGVuIGRyYWdnaW5nXG5wcm90by5vbmNsaWNrID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICBpZiAoIHRoaXMuaXNQcmV2ZW50aW5nQ2xpY2tzICkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cbn07XG5cbi8vIC0tLS0tIHN0YXRpY0NsaWNrIC0tLS0tIC8vXG5cbi8vIHRyaWdnZXJlZCBhZnRlciBwb2ludGVyIGRvd24gJiB1cCB3aXRoIG5vL3RpbnkgbW92ZW1lbnRcbnByb3RvLl9zdGF0aWNDbGljayA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgLy8gaWdub3JlIGVtdWxhdGVkIG1vdXNlIHVwIGNsaWNrc1xuICBpZiAoIHRoaXMuaXNJZ25vcmluZ01vdXNlVXAgJiYgZXZlbnQudHlwZSA9PSAnbW91c2V1cCcgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gYWxsb3cgY2xpY2sgaW4gPGlucHV0PnMgYW5kIDx0ZXh0YXJlYT5zXG4gIHZhciBub2RlTmFtZSA9IGV2ZW50LnRhcmdldC5ub2RlTmFtZTtcbiAgaWYgKCBub2RlTmFtZSA9PSAnSU5QVVQnIHx8IG5vZGVOYW1lID09ICdURVhUQVJFQScgKSB7XG4gICAgZXZlbnQudGFyZ2V0LmZvY3VzKCk7XG4gIH1cbiAgdGhpcy5zdGF0aWNDbGljayggZXZlbnQsIHBvaW50ZXIgKTtcblxuICAvLyBzZXQgZmxhZyBmb3IgZW11bGF0ZWQgY2xpY2tzIDMwMG1zIGFmdGVyIHRvdWNoZW5kXG4gIGlmICggZXZlbnQudHlwZSAhPSAnbW91c2V1cCcgKSB7XG4gICAgdGhpcy5pc0lnbm9yaW5nTW91c2VVcCA9IHRydWU7XG4gICAgLy8gcmVzZXQgZmxhZyBhZnRlciAzMDBtc1xuICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgZGVsZXRlIHRoaXMuaXNJZ25vcmluZ01vdXNlVXA7XG4gICAgfS5iaW5kKCB0aGlzICksIDQwMCApO1xuICB9XG59O1xuXG5wcm90by5zdGF0aWNDbGljayA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5lbWl0RXZlbnQoICdzdGF0aWNDbGljaycsIFsgZXZlbnQsIHBvaW50ZXIgXSApO1xufTtcblxuLy8gLS0tLS0gdXRpbHMgLS0tLS0gLy9cblxuVW5pZHJhZ2dlci5nZXRQb2ludGVyUG9pbnQgPSBVbmlwb2ludGVyLmdldFBvaW50ZXJQb2ludDtcblxuLy8gLS0tLS0gIC0tLS0tIC8vXG5cbnJldHVybiBVbmlkcmFnZ2VyO1xuXG59KSk7XG4iLCIvKiFcbiAqIFVuaXBvaW50ZXIgdjIuMS4wXG4gKiBiYXNlIGNsYXNzIGZvciBkb2luZyBvbmUgdGhpbmcgd2l0aCBwb2ludGVyIGV2ZW50XG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUsIHN0cmljdDogdHJ1ZSAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqLyAvKmdsb2JhbCBkZWZpbmUsIG1vZHVsZSwgcmVxdWlyZSAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRFxuICAgIGRlZmluZSggW1xuICAgICAgJ2V2LWVtaXR0ZXIvZXYtZW1pdHRlcidcbiAgICBdLCBmdW5jdGlvbiggRXZFbWl0dGVyICkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoIHdpbmRvdywgRXZFbWl0dGVyICk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICB3aW5kb3csXG4gICAgICByZXF1aXJlKCdldi1lbWl0dGVyJylcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgd2luZG93LlVuaXBvaW50ZXIgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LkV2RW1pdHRlclxuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCB3aW5kb3csIEV2RW1pdHRlciApIHtcblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuZnVuY3Rpb24gVW5pcG9pbnRlcigpIHt9XG5cbi8vIGluaGVyaXQgRXZFbWl0dGVyXG52YXIgcHJvdG8gPSBVbmlwb2ludGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEV2RW1pdHRlci5wcm90b3R5cGUgKTtcblxucHJvdG8uYmluZFN0YXJ0RXZlbnQgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgdGhpcy5fYmluZFN0YXJ0RXZlbnQoIGVsZW0sIHRydWUgKTtcbn07XG5cbnByb3RvLnVuYmluZFN0YXJ0RXZlbnQgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgdGhpcy5fYmluZFN0YXJ0RXZlbnQoIGVsZW0sIGZhbHNlICk7XG59O1xuXG4vKipcbiAqIHdvcmtzIGFzIHVuYmluZGVyLCBhcyB5b3UgY2FuIC5fYmluZFN0YXJ0KCBmYWxzZSApIHRvIHVuYmluZFxuICogQHBhcmFtIHtCb29sZWFufSBpc0JpbmQgLSB3aWxsIHVuYmluZCBpZiBmYWxzZXlcbiAqL1xucHJvdG8uX2JpbmRTdGFydEV2ZW50ID0gZnVuY3Rpb24oIGVsZW0sIGlzQmluZCApIHtcbiAgLy8gbXVuZ2UgaXNCaW5kLCBkZWZhdWx0IHRvIHRydWVcbiAgaXNCaW5kID0gaXNCaW5kID09PSB1bmRlZmluZWQgPyB0cnVlIDogISFpc0JpbmQ7XG4gIHZhciBiaW5kTWV0aG9kID0gaXNCaW5kID8gJ2FkZEV2ZW50TGlzdGVuZXInIDogJ3JlbW92ZUV2ZW50TGlzdGVuZXInO1xuXG4gIGlmICggd2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCApIHtcbiAgICAvLyBXM0MgUG9pbnRlciBFdmVudHMsIElFMTEuIFNlZSBodHRwczovL2NvZGVyd2FsbC5jb20vcC9tZnJlY2FcbiAgICBlbGVtWyBiaW5kTWV0aG9kIF0oICdwb2ludGVyZG93bicsIHRoaXMgKTtcbiAgfSBlbHNlIGlmICggd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkICkge1xuICAgIC8vIElFMTAgUG9pbnRlciBFdmVudHNcbiAgICBlbGVtWyBiaW5kTWV0aG9kIF0oICdNU1BvaW50ZXJEb3duJywgdGhpcyApO1xuICB9IGVsc2Uge1xuICAgIC8vIGxpc3RlbiBmb3IgYm90aCwgZm9yIGRldmljZXMgbGlrZSBDaHJvbWUgUGl4ZWxcbiAgICBlbGVtWyBiaW5kTWV0aG9kIF0oICdtb3VzZWRvd24nLCB0aGlzICk7XG4gICAgZWxlbVsgYmluZE1ldGhvZCBdKCAndG91Y2hzdGFydCcsIHRoaXMgKTtcbiAgfVxufTtcblxuLy8gdHJpZ2dlciBoYW5kbGVyIG1ldGhvZHMgZm9yIGV2ZW50c1xucHJvdG8uaGFuZGxlRXZlbnQgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIHZhciBtZXRob2QgPSAnb24nICsgZXZlbnQudHlwZTtcbiAgaWYgKCB0aGlzWyBtZXRob2QgXSApIHtcbiAgICB0aGlzWyBtZXRob2QgXSggZXZlbnQgKTtcbiAgfVxufTtcblxuLy8gcmV0dXJucyB0aGUgdG91Y2ggdGhhdCB3ZSdyZSBrZWVwaW5nIHRyYWNrIG9mXG5wcm90by5nZXRUb3VjaCA9IGZ1bmN0aW9uKCB0b3VjaGVzICkge1xuICBmb3IgKCB2YXIgaT0wOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgdG91Y2ggPSB0b3VjaGVzW2ldO1xuICAgIGlmICggdG91Y2guaWRlbnRpZmllciA9PSB0aGlzLnBvaW50ZXJJZGVudGlmaWVyICkge1xuICAgICAgcmV0dXJuIHRvdWNoO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0gc3RhcnQgZXZlbnQgLS0tLS0gLy9cblxucHJvdG8ub25tb3VzZWRvd24gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIC8vIGRpc21pc3MgY2xpY2tzIGZyb20gcmlnaHQgb3IgbWlkZGxlIGJ1dHRvbnNcbiAgdmFyIGJ1dHRvbiA9IGV2ZW50LmJ1dHRvbjtcbiAgaWYgKCBidXR0b24gJiYgKCBidXR0b24gIT09IDAgJiYgYnV0dG9uICE9PSAxICkgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuX3BvaW50ZXJEb3duKCBldmVudCwgZXZlbnQgKTtcbn07XG5cbnByb3RvLm9udG91Y2hzdGFydCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdGhpcy5fcG9pbnRlckRvd24oIGV2ZW50LCBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSApO1xufTtcblxucHJvdG8ub25NU1BvaW50ZXJEb3duID1cbnByb3RvLm9ucG9pbnRlcmRvd24gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIHRoaXMuX3BvaW50ZXJEb3duKCBldmVudCwgZXZlbnQgKTtcbn07XG5cbi8qKlxuICogcG9pbnRlciBzdGFydFxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7RXZlbnQgb3IgVG91Y2h9IHBvaW50ZXJcbiAqL1xucHJvdG8uX3BvaW50ZXJEb3duID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICAvLyBkaXNtaXNzIG90aGVyIHBvaW50ZXJzXG4gIGlmICggdGhpcy5pc1BvaW50ZXJEb3duICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuaXNQb2ludGVyRG93biA9IHRydWU7XG4gIC8vIHNhdmUgcG9pbnRlciBpZGVudGlmaWVyIHRvIG1hdGNoIHVwIHRvdWNoIGV2ZW50c1xuICB0aGlzLnBvaW50ZXJJZGVudGlmaWVyID0gcG9pbnRlci5wb2ludGVySWQgIT09IHVuZGVmaW5lZCA/XG4gICAgLy8gcG9pbnRlcklkIGZvciBwb2ludGVyIGV2ZW50cywgdG91Y2guaW5kZW50aWZpZXIgZm9yIHRvdWNoIGV2ZW50c1xuICAgIHBvaW50ZXIucG9pbnRlcklkIDogcG9pbnRlci5pZGVudGlmaWVyO1xuXG4gIHRoaXMucG9pbnRlckRvd24oIGV2ZW50LCBwb2ludGVyICk7XG59O1xuXG5wcm90by5wb2ludGVyRG93biA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5fYmluZFBvc3RTdGFydEV2ZW50cyggZXZlbnQgKTtcbiAgdGhpcy5lbWl0RXZlbnQoICdwb2ludGVyRG93bicsIFsgZXZlbnQsIHBvaW50ZXIgXSApO1xufTtcblxuLy8gaGFzaCBvZiBldmVudHMgdG8gYmUgYm91bmQgYWZ0ZXIgc3RhcnQgZXZlbnRcbnZhciBwb3N0U3RhcnRFdmVudHMgPSB7XG4gIG1vdXNlZG93bjogWyAnbW91c2Vtb3ZlJywgJ21vdXNldXAnIF0sXG4gIHRvdWNoc3RhcnQ6IFsgJ3RvdWNobW92ZScsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcgXSxcbiAgcG9pbnRlcmRvd246IFsgJ3BvaW50ZXJtb3ZlJywgJ3BvaW50ZXJ1cCcsICdwb2ludGVyY2FuY2VsJyBdLFxuICBNU1BvaW50ZXJEb3duOiBbICdNU1BvaW50ZXJNb3ZlJywgJ01TUG9pbnRlclVwJywgJ01TUG9pbnRlckNhbmNlbCcgXVxufTtcblxucHJvdG8uX2JpbmRQb3N0U3RhcnRFdmVudHMgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIGlmICggIWV2ZW50ICkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBnZXQgcHJvcGVyIGV2ZW50cyB0byBtYXRjaCBzdGFydCBldmVudFxuICB2YXIgZXZlbnRzID0gcG9zdFN0YXJ0RXZlbnRzWyBldmVudC50eXBlIF07XG4gIC8vIGJpbmQgZXZlbnRzIHRvIG5vZGVcbiAgZXZlbnRzLmZvckVhY2goIGZ1bmN0aW9uKCBldmVudE5hbWUgKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgdGhpcyApO1xuICB9LCB0aGlzICk7XG4gIC8vIHNhdmUgdGhlc2UgYXJndW1lbnRzXG4gIHRoaXMuX2JvdW5kUG9pbnRlckV2ZW50cyA9IGV2ZW50cztcbn07XG5cbnByb3RvLl91bmJpbmRQb3N0U3RhcnRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgLy8gY2hlY2sgZm9yIF9ib3VuZEV2ZW50cywgaW4gY2FzZSBkcmFnRW5kIHRyaWdnZXJlZCB0d2ljZSAob2xkIElFOCBidWcpXG4gIGlmICggIXRoaXMuX2JvdW5kUG9pbnRlckV2ZW50cyApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5fYm91bmRQb2ludGVyRXZlbnRzLmZvckVhY2goIGZ1bmN0aW9uKCBldmVudE5hbWUgKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgdGhpcyApO1xuICB9LCB0aGlzICk7XG5cbiAgZGVsZXRlIHRoaXMuX2JvdW5kUG9pbnRlckV2ZW50cztcbn07XG5cbi8vIC0tLS0tIG1vdmUgZXZlbnQgLS0tLS0gLy9cblxucHJvdG8ub25tb3VzZW1vdmUgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIHRoaXMuX3BvaW50ZXJNb3ZlKCBldmVudCwgZXZlbnQgKTtcbn07XG5cbnByb3RvLm9uTVNQb2ludGVyTW92ZSA9XG5wcm90by5vbnBvaW50ZXJtb3ZlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICBpZiAoIGV2ZW50LnBvaW50ZXJJZCA9PSB0aGlzLnBvaW50ZXJJZGVudGlmaWVyICkge1xuICAgIHRoaXMuX3BvaW50ZXJNb3ZlKCBldmVudCwgZXZlbnQgKTtcbiAgfVxufTtcblxucHJvdG8ub250b3VjaG1vdmUgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIHZhciB0b3VjaCA9IHRoaXMuZ2V0VG91Y2goIGV2ZW50LmNoYW5nZWRUb3VjaGVzICk7XG4gIGlmICggdG91Y2ggKSB7XG4gICAgdGhpcy5fcG9pbnRlck1vdmUoIGV2ZW50LCB0b3VjaCApO1xuICB9XG59O1xuXG4vKipcbiAqIHBvaW50ZXIgbW92ZVxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7RXZlbnQgb3IgVG91Y2h9IHBvaW50ZXJcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvLl9wb2ludGVyTW92ZSA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5wb2ludGVyTW92ZSggZXZlbnQsIHBvaW50ZXIgKTtcbn07XG5cbi8vIHB1YmxpY1xucHJvdG8ucG9pbnRlck1vdmUgPSBmdW5jdGlvbiggZXZlbnQsIHBvaW50ZXIgKSB7XG4gIHRoaXMuZW1pdEV2ZW50KCAncG9pbnRlck1vdmUnLCBbIGV2ZW50LCBwb2ludGVyIF0gKTtcbn07XG5cbi8vIC0tLS0tIGVuZCBldmVudCAtLS0tLSAvL1xuXG5cbnByb3RvLm9ubW91c2V1cCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdGhpcy5fcG9pbnRlclVwKCBldmVudCwgZXZlbnQgKTtcbn07XG5cbnByb3RvLm9uTVNQb2ludGVyVXAgPVxucHJvdG8ub25wb2ludGVydXAgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIGlmICggZXZlbnQucG9pbnRlcklkID09IHRoaXMucG9pbnRlcklkZW50aWZpZXIgKSB7XG4gICAgdGhpcy5fcG9pbnRlclVwKCBldmVudCwgZXZlbnQgKTtcbiAgfVxufTtcblxucHJvdG8ub250b3VjaGVuZCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdmFyIHRvdWNoID0gdGhpcy5nZXRUb3VjaCggZXZlbnQuY2hhbmdlZFRvdWNoZXMgKTtcbiAgaWYgKCB0b3VjaCApIHtcbiAgICB0aGlzLl9wb2ludGVyVXAoIGV2ZW50LCB0b3VjaCApO1xuICB9XG59O1xuXG4vKipcbiAqIHBvaW50ZXIgdXBcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50IG9yIFRvdWNofSBwb2ludGVyXG4gKiBAcHJpdmF0ZVxuICovXG5wcm90by5fcG9pbnRlclVwID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLl9wb2ludGVyRG9uZSgpO1xuICB0aGlzLnBvaW50ZXJVcCggZXZlbnQsIHBvaW50ZXIgKTtcbn07XG5cbi8vIHB1YmxpY1xucHJvdG8ucG9pbnRlclVwID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLmVtaXRFdmVudCggJ3BvaW50ZXJVcCcsIFsgZXZlbnQsIHBvaW50ZXIgXSApO1xufTtcblxuLy8gLS0tLS0gcG9pbnRlciBkb25lIC0tLS0tIC8vXG5cbi8vIHRyaWdnZXJlZCBvbiBwb2ludGVyIHVwICYgcG9pbnRlciBjYW5jZWxcbnByb3RvLl9wb2ludGVyRG9uZSA9IGZ1bmN0aW9uKCkge1xuICAvLyByZXNldCBwcm9wZXJ0aWVzXG4gIHRoaXMuaXNQb2ludGVyRG93biA9IGZhbHNlO1xuICBkZWxldGUgdGhpcy5wb2ludGVySWRlbnRpZmllcjtcbiAgLy8gcmVtb3ZlIGV2ZW50c1xuICB0aGlzLl91bmJpbmRQb3N0U3RhcnRFdmVudHMoKTtcbiAgdGhpcy5wb2ludGVyRG9uZSgpO1xufTtcblxucHJvdG8ucG9pbnRlckRvbmUgPSBub29wO1xuXG4vLyAtLS0tLSBwb2ludGVyIGNhbmNlbCAtLS0tLSAvL1xuXG5wcm90by5vbk1TUG9pbnRlckNhbmNlbCA9XG5wcm90by5vbnBvaW50ZXJjYW5jZWwgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIGlmICggZXZlbnQucG9pbnRlcklkID09IHRoaXMucG9pbnRlcklkZW50aWZpZXIgKSB7XG4gICAgdGhpcy5fcG9pbnRlckNhbmNlbCggZXZlbnQsIGV2ZW50ICk7XG4gIH1cbn07XG5cbnByb3RvLm9udG91Y2hjYW5jZWwgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIHZhciB0b3VjaCA9IHRoaXMuZ2V0VG91Y2goIGV2ZW50LmNoYW5nZWRUb3VjaGVzICk7XG4gIGlmICggdG91Y2ggKSB7XG4gICAgdGhpcy5fcG9pbnRlckNhbmNlbCggZXZlbnQsIHRvdWNoICk7XG4gIH1cbn07XG5cbi8qKlxuICogcG9pbnRlciBjYW5jZWxcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50IG9yIFRvdWNofSBwb2ludGVyXG4gKiBAcHJpdmF0ZVxuICovXG5wcm90by5fcG9pbnRlckNhbmNlbCA9IGZ1bmN0aW9uKCBldmVudCwgcG9pbnRlciApIHtcbiAgdGhpcy5fcG9pbnRlckRvbmUoKTtcbiAgdGhpcy5wb2ludGVyQ2FuY2VsKCBldmVudCwgcG9pbnRlciApO1xufTtcblxuLy8gcHVibGljXG5wcm90by5wb2ludGVyQ2FuY2VsID0gZnVuY3Rpb24oIGV2ZW50LCBwb2ludGVyICkge1xuICB0aGlzLmVtaXRFdmVudCggJ3BvaW50ZXJDYW5jZWwnLCBbIGV2ZW50LCBwb2ludGVyIF0gKTtcbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uIGZvciBnZXR0aW5nIHgveSBjb29yZHMgZnJvbSBldmVudFxuVW5pcG9pbnRlci5nZXRQb2ludGVyUG9pbnQgPSBmdW5jdGlvbiggcG9pbnRlciApIHtcbiAgcmV0dXJuIHtcbiAgICB4OiBwb2ludGVyLnBhZ2VYLFxuICAgIHk6IHBvaW50ZXIucGFnZVlcbiAgfTtcbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5yZXR1cm4gVW5pcG9pbnRlcjtcblxufSkpO1xuIiwiLyohXG4gKiB2aWV3cG9ydC11bml0cy1idWdneWZpbGwgdjAuNi4wXG4gKiBAd2ViOiBodHRwczovL2dpdGh1Yi5jb20vcm9kbmV5cmVobS92aWV3cG9ydC11bml0cy1idWdneWZpbGwvXG4gKiBAYXV0aG9yOiBSb2RuZXkgUmVobSAtIGh0dHA6Ly9yb2RuZXlyZWhtLmRlL2VuL1xuICovXG5cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgIHJvb3Qudmlld3BvcnRVbml0c0J1Z2d5ZmlsbCA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLypnbG9iYWwgZG9jdW1lbnQsIHdpbmRvdywgbmF2aWdhdG9yLCBsb2NhdGlvbiwgWE1MSHR0cFJlcXVlc3QsIFhEb21haW5SZXF1ZXN0LCBDdXN0b21FdmVudCovXG5cbiAgdmFyIGluaXRpYWxpemVkID0gZmFsc2U7XG4gIHZhciBvcHRpb25zO1xuICB2YXIgdXNlckFnZW50ID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gIHZhciB2aWV3cG9ydFVuaXRFeHByZXNzaW9uID0gLyhbKy1dP1swLTkuXSspKHZofHZ3fHZtaW58dm1heCkvZztcbiAgdmFyIGZvckVhY2ggPSBbXS5mb3JFYWNoO1xuICB2YXIgZGltZW5zaW9ucztcbiAgdmFyIGRlY2xhcmF0aW9ucztcbiAgdmFyIHN0eWxlTm9kZTtcbiAgdmFyIGlzQnVnZ3lJRSA9IC9NU0lFIFswLTldXFwuL2kudGVzdCh1c2VyQWdlbnQpO1xuICB2YXIgaXNPbGRJRSA9IC9NU0lFIFswLThdXFwuL2kudGVzdCh1c2VyQWdlbnQpO1xuICB2YXIgaXNPcGVyYU1pbmkgPSB1c2VyQWdlbnQuaW5kZXhPZignT3BlcmEgTWluaScpID4gLTE7XG5cbiAgdmFyIGlzTW9iaWxlU2FmYXJpID0gLyhpUGhvbmV8aVBvZHxpUGFkKS4rQXBwbGVXZWJLaXQvaS50ZXN0KHVzZXJBZ2VudCkgJiYgKGZ1bmN0aW9uKCkge1xuICAgIC8vIFJlZ2V4cCBmb3IgaU9TLXZlcnNpb24gdGVzdGVkIGFnYWluc3QgdGhlIGZvbGxvd2luZyB1c2VyQWdlbnQgc3RyaW5nczpcbiAgICAvLyBFeGFtcGxlIFdlYlZpZXcgVXNlckFnZW50czpcbiAgICAvLyAqIGlPUyBDaHJvbWUgb24gaU9TODogXCJNb3ppbGxhLzUuMCAoaVBhZDsgQ1BVIE9TIDhfMSBsaWtlIE1hYyBPUyBYKSBBcHBsZVdlYktpdC82MDAuMS40IChLSFRNTCwgbGlrZSBHZWNrbykgQ3JpT1MvMzkuMC4yMTcxLjUwIE1vYmlsZS8xMkI0MTAgU2FmYXJpLzYwMC4xLjRcIlxuICAgIC8vICogaU9TIEZhY2Vib29rIG9uIGlPUzc6IFwiTW96aWxsYS81LjAgKGlQaG9uZTsgQ1BVIGlQaG9uZSBPUyA3XzFfMSBsaWtlIE1hYyBPUyBYKSBBcHBsZVdlYktpdC81MzcuNTEuMiAoS0hUTUwsIGxpa2UgR2Vja28pIE1vYmlsZS8xMUQyMDEgW0ZCQU4vRkJJT1M7RkJBVi8xMi4xLjAuMjQuMjA7IEZCQlYvMzIxNDI0NzsgRkJEVi9pUGhvbmU2LDE7RkJNRC9pUGhvbmU7IEZCU04vaVBob25lIE9TO0ZCU1YvNy4xLjE7IEZCU1MvMjsgRkJDUi9BVCZUO0ZCSUQvcGhvbmU7RkJMQy9lbl9VUztGQk9QLzVdXCJcbiAgICAvLyBFeGFtcGxlIFNhZmFyaSBVc2VyQWdlbnRzOlxuICAgIC8vICogU2FmYXJpIGlPUzg6IFwiTW96aWxsYS81LjAgKGlQaG9uZTsgQ1BVIGlQaG9uZSBPUyA4XzAgbGlrZSBNYWMgT1MgWCkgQXBwbGVXZWJLaXQvNjAwLjEuMyAoS0hUTUwsIGxpa2UgR2Vja28pIFZlcnNpb24vOC4wIE1vYmlsZS8xMkE0MzQ1ZCBTYWZhcmkvNjAwLjEuNFwiXG4gICAgLy8gKiBTYWZhcmkgaU9TNzogXCJNb3ppbGxhLzUuMCAoaVBob25lOyBDUFUgaVBob25lIE9TIDdfMCBsaWtlIE1hYyBPUyBYKSBBcHBsZVdlYktpdC81MzcuNTEuMSAoS0hUTUwsIGxpa2UgR2Vja28pIFZlcnNpb24vNy4wIE1vYmlsZS8xMUE0NDQ5ZCBTYWZhcmkvOTUzNy41M1wiXG4gICAgdmFyIGlPU3ZlcnNpb24gPSB1c2VyQWdlbnQubWF0Y2goL09TIChcXGQpLyk7XG4gICAgLy8gdmlld3BvcnQgdW5pdHMgd29yayBmaW5lIGluIG1vYmlsZSBTYWZhcmkgYW5kIHdlYlZpZXcgb24gaU9TIDgrXG4gICAgcmV0dXJuIGlPU3ZlcnNpb24gJiYgaU9TdmVyc2lvbi5sZW5ndGg+MSAmJiBwYXJzZUludChpT1N2ZXJzaW9uWzFdKSA8IDEwO1xuICB9KSgpO1xuXG4gIHZhciBpc0JhZFN0b2NrQW5kcm9pZCA9IChmdW5jdGlvbigpIHtcbiAgICAvLyBBbmRyb2lkIHN0b2NrIGJyb3dzZXIgdGVzdCBkZXJpdmVkIGZyb21cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzI0OTI2MjIxL2Rpc3Rpbmd1aXNoLWFuZHJvaWQtY2hyb21lLWZyb20tc3RvY2stYnJvd3Nlci1zdG9jay1icm93c2Vycy11c2VyLWFnZW50LWNvbnRhaVxuICAgIHZhciBpc0FuZHJvaWQgPSB1c2VyQWdlbnQuaW5kZXhPZignIEFuZHJvaWQgJykgPiAtMTtcbiAgICBpZiAoIWlzQW5kcm9pZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBpc1N0b2NrQW5kcm9pZCA9IHVzZXJBZ2VudC5pbmRleE9mKCdWZXJzaW9uLycpID4gLTE7XG4gICAgaWYgKCFpc1N0b2NrQW5kcm9pZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB2ZXJzaW9uTnVtYmVyID0gcGFyc2VGbG9hdCgodXNlckFnZW50Lm1hdGNoKCdBbmRyb2lkIChbMC05Ll0rKScpIHx8IFtdKVsxXSk7XG4gICAgLy8gYW55dGhpbmcgYmVsb3cgNC40IHVzZXMgV2ViS2l0IHdpdGhvdXQgKmFueSogdmlld3BvcnQgc3VwcG9ydCxcbiAgICAvLyA0LjQgaGFzIGlzc3VlcyB3aXRoIHZpZXdwb3J0IHVuaXRzIHdpdGhpbiBjYWxjKClcbiAgICByZXR1cm4gdmVyc2lvbk51bWJlciA8PSA0LjQ7XG4gIH0pKCk7XG5cbiAgLy8gYWRkZWQgY2hlY2sgZm9yIElFMTAsIElFMTEgYW5kIEVkZ2UgPCAyMCwgc2luY2UgaXQgKnN0aWxsKiBkb2Vzbid0IHVuZGVyc3RhbmQgdm1heFxuICAvLyBodHRwOi8vY2FuaXVzZS5jb20vI2ZlYXQ9dmlld3BvcnQtdW5pdHNcbiAgaWYgKCFpc0J1Z2d5SUUpIHtcbiAgICBpc0J1Z2d5SUUgPSAhIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQuKnJ2WyA6XSoxWzAxXVxcLnwgRWRnZVxcLzFcXGRcXC4vKTtcbiAgfVxuXG4gIC8vIFBvbHlmaWxsIGZvciBjcmVhdGluZyBDdXN0b21FdmVudHMgb24gSUU5LzEwLzExXG4gIC8vIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2tyYW1idWhsL2N1c3RvbS1ldmVudC1wb2x5ZmlsbFxuICB0cnkge1xuICAgIG5ldyBDdXN0b21FdmVudCgndGVzdCcpO1xuICB9IGNhdGNoKGUpIHtcbiAgICB2YXIgQ3VzdG9tRXZlbnQgPSBmdW5jdGlvbihldmVudCwgcGFyYW1zKSB7XG4gICAgICB2YXIgZXZ0O1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtcbiAgICAgICAgYnViYmxlczogZmFsc2UsXG4gICAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgICBkZXRhaWw6IHVuZGVmaW5lZFxuICAgICAgfTtcblxuICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgICAgcmV0dXJuIGV2dDtcbiAgICB9O1xuICAgIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gICAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7IC8vIGV4cG9zZSBkZWZpbml0aW9uIHRvIHdpbmRvd1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICAgIHZhciB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9O1xuXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChjYWxsYmFjaywgd2FpdCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMjYwNjkvaG93LXRvLWlkZW50aWZ5LWlmLWEtd2VicGFnZS1pcy1iZWluZy1sb2FkZWQtaW5zaWRlLWFuLWlmcmFtZS1vci1kaXJlY3RseS1pbnRvLXRcbiAgZnVuY3Rpb24gaW5JZnJhbWUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB3aW5kb3cuc2VsZiAhPT0gd2luZG93LnRvcDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKGluaXRPcHRpb25zKSB7XG4gICAgaWYgKGluaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGluaXRPcHRpb25zID09PSB0cnVlKSB7XG4gICAgICBpbml0T3B0aW9ucyA9IHtcbiAgICAgICAgZm9yY2U6IHRydWVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IGluaXRPcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMuaXNNb2JpbGVTYWZhcmkgPSBpc01vYmlsZVNhZmFyaTtcbiAgICBvcHRpb25zLmlzQmFkU3RvY2tBbmRyb2lkID0gaXNCYWRTdG9ja0FuZHJvaWQ7XG5cbiAgICBpZiAob3B0aW9ucy5pZ25vcmVWbWF4ICYmICFvcHRpb25zLmZvcmNlICYmICFpc09sZElFKSB7XG4gICAgICAvLyBtb2Rlcm4gSUUgKDEwIGFuZCB1cCkgZG8gbm90IHN1cHBvcnQgdm1pbi92bWF4LFxuICAgICAgLy8gYnV0IGNoYW5jZXMgYXJlIHRoaXMgdW5pdCBpcyBub3QgZXZlbiB1c2VkLCBzb1xuICAgICAgLy8gYWxsb3cgb3ZlcndyaXRpbmcgdGhlIFwiaGFja3RpdmF0aW9uXCJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2RuZXlyZWhtL3ZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbC9pc3N1ZXMvNTZcbiAgICAgIGlzQnVnZ3lJRSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc09sZElFIHx8ICghb3B0aW9ucy5mb3JjZSAmJiAhaXNNb2JpbGVTYWZhcmkgJiYgIWlzQnVnZ3lJRSAmJiAhaXNCYWRTdG9ja0FuZHJvaWQgJiYgIWlzT3BlcmFNaW5pICYmICghb3B0aW9ucy5oYWNrcyB8fCAhb3B0aW9ucy5oYWNrcy5yZXF1aXJlZChvcHRpb25zKSkpKSB7XG4gICAgICAvLyB0aGlzIGJ1Z2d5ZmlsbCBvbmx5IGFwcGxpZXMgdG8gbW9iaWxlIHNhZmFyaSwgSUU5LTEwIGFuZCB0aGUgU3RvY2sgQW5kcm9pZCBCcm93c2VyLlxuICAgICAgaWYgKHdpbmRvdy5jb25zb2xlICYmIGlzT2xkSUUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCd2aWV3cG9ydC11bml0cy1idWdneWZpbGwgcmVxdWlyZXMgYSBwcm9wZXIgQ1NTT00gYW5kIGJhc2ljIHZpZXdwb3J0IHVuaXQgc3VwcG9ydCwgd2hpY2ggYXJlIG5vdCBhdmFpbGFibGUgaW4gSUU4IGFuZCBiZWxvdycpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7fVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBmaXJlIGEgY3VzdG9tIGV2ZW50IHRoYXQgYnVnZ3lmaWxsIHdhcyBpbml0aWFsaXplXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd2aWV3cG9ydC11bml0cy1idWdneWZpbGwtaW5pdCcpKTtcblxuICAgIG9wdGlvbnMuaGFja3MgJiYgb3B0aW9ucy5oYWNrcy5pbml0aWFsaXplKG9wdGlvbnMpO1xuXG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHN0eWxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgc3R5bGVOb2RlLmlkID0gJ3BhdGNoZWQtdmlld3BvcnQnO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcblxuICAgIC8vIElzc3VlICM2OiBDcm9zcyBPcmlnaW4gU3R5bGVzaGVldHMgYXJlIG5vdCBhY2Nlc3NpYmxlIHRocm91Z2ggQ1NTT00sXG4gICAgLy8gdGhlcmVmb3JlIGRvd25sb2FkIGFuZCBpbmplY3QgdGhlbSBhcyA8c3R5bGU+IHRvIGNpcmN1bXZlbnQgU09QLlxuICAgIGltcG9ydENyb3NzT3JpZ2luTGlua3MoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3JlZnJlc2ggPSBkZWJvdW5jZShyZWZyZXNoLCBvcHRpb25zLnJlZnJlc2hEZWJvdW5jZVdhaXQgfHwgMTAwKTtcbiAgICAgIC8vIGRvaW5nIGEgZnVsbCByZWZyZXNoIHJhdGhlciB0aGFuIHVwZGF0ZVN0eWxlcyBiZWNhdXNlIGFuIG9yaWVudGF0aW9uY2hhbmdlXG4gICAgICAvLyBjb3VsZCBhY3RpdmF0ZSBkaWZmZXJlbnQgc3R5bGVzaGVldHNcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIF9yZWZyZXNoLCB0cnVlKTtcbiAgICAgIC8vIG9yaWVudGF0aW9uY2hhbmdlIG1pZ2h0IGhhdmUgaGFwcGVuZWQgd2hpbGUgaW4gYSBkaWZmZXJlbnQgd2luZG93XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZXNob3cnLCBfcmVmcmVzaCwgdHJ1ZSk7XG5cbiAgICAgIGlmIChvcHRpb25zLmZvcmNlIHx8IGlzQnVnZ3lJRSB8fCBpbklmcmFtZSgpKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfcmVmcmVzaCwgdHJ1ZSk7XG4gICAgICAgIG9wdGlvbnMuX2xpc3RlbmluZ1RvUmVzaXplID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucy5oYWNrcyAmJiBvcHRpb25zLmhhY2tzLmluaXRpYWxpemVFdmVudHMob3B0aW9ucywgcmVmcmVzaCwgX3JlZnJlc2gpO1xuXG4gICAgICByZWZyZXNoKCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVTdHlsZXMoKSB7XG4gICAgc3R5bGVOb2RlLnRleHRDb250ZW50ID0gZ2V0UmVwbGFjZWRWaWV3cG9ydFVuaXRzKCk7XG4gICAgLy8gbW92ZSB0byB0aGUgZW5kIGluIGNhc2UgaW5saW5lIDxzdHlsZT5zIHdlcmUgYWRkZWQgZHluYW1pY2FsbHlcbiAgICBzdHlsZU5vZGUucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChzdHlsZU5vZGUpO1xuICAgIC8vIGZpcmUgYSBjdXN0b20gZXZlbnQgdGhhdCBzdHlsZXMgd2VyZSB1cGRhdGVkXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCd2aWV3cG9ydC11bml0cy1idWdneWZpbGwtc3R5bGUnKSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgIGlmICghaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmaW5kUHJvcGVydGllcygpO1xuXG4gICAgLy8gaU9TIFNhZmFyaSB3aWxsIHJlcG9ydCB3aW5kb3cuaW5uZXJXaWR0aCBhbmQgLmlubmVySGVpZ2h0IGFzIDAgdW5sZXNzIGEgdGltZW91dCBpcyB1c2VkIGhlcmUuXG4gICAgLy8gVE9ETzogZmlndXJlIG91dCBXSFkgaW5uZXJXaWR0aCA9PT0gMFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB1cGRhdGVTdHlsZXMoKTtcbiAgICB9LCAxKTtcbiAgfVxuICBcbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjM2MTMwNTJcbiAgZnVuY3Rpb24gcHJvY2Vzc1N0eWxlc2hlZXQoc3MpIHtcbiAgICAvLyBjc3NSdWxlcyByZXNwZWN0cyBzYW1lLW9yaWdpbiBwb2xpY3ksIGFzIHBlclxuICAgIC8vIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00OTAwMSNjMTAuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghc3MuY3NzUnVsZXMpIHsgcmV0dXJuOyB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBpZiAoZS5uYW1lICE9PSAnU2VjdXJpdHlFcnJvcicpIHsgdGhyb3cgZTsgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBzcy5jc3NSdWxlcyBpcyBhdmFpbGFibGUsIHNvIHByb2NlZWQgd2l0aCBkZXNpcmVkIG9wZXJhdGlvbnMuXG4gICAgdmFyIHJ1bGVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcy5jc3NSdWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJ1bGUgPSBzcy5jc3NSdWxlc1tpXTtcbiAgICAgIHJ1bGVzLnB1c2gocnVsZSk7XG4gICAgfVxuICAgIHJldHVybiBydWxlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmRQcm9wZXJ0aWVzKCkge1xuICAgIGRlY2xhcmF0aW9ucyA9IFtdO1xuICAgIGZvckVhY2guY2FsbChkb2N1bWVudC5zdHlsZVNoZWV0cywgZnVuY3Rpb24oc2hlZXQpIHtcbiAgICAgIHZhciBjc3NSdWxlcyA9IHByb2Nlc3NTdHlsZXNoZWV0KHNoZWV0KTtcblxuICAgICAgaWYgKCFjc3NSdWxlcyB8fCBzaGVldC5vd25lck5vZGUuaWQgPT09ICdwYXRjaGVkLXZpZXdwb3J0JyB8fCBzaGVldC5vd25lck5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbCcpID09PSAnaWdub3JlJykge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBzaGVldCBiZWNhdXNlIG5vIHJ1bGVzIGFyZSBwcmVzZW50LCBpdCdzIHN1cHBvc2VkIHRvIGJlIGlnbm9yZWQgb3IgaXQncyB0aGUgdGFyZ2V0LWVsZW1lbnQgb2YgdGhlIGJ1Z2d5ZmlsbFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChzaGVldC5tZWRpYSAmJiBzaGVldC5tZWRpYS5tZWRpYVRleHQgJiYgd2luZG93Lm1hdGNoTWVkaWEgJiYgIXdpbmRvdy5tYXRjaE1lZGlhKHNoZWV0Lm1lZGlhLm1lZGlhVGV4dCkubWF0Y2hlcykge1xuICAgICAgICAvLyBza2lwIGVudGlyZSBzaGVldCBiZWNhdXNlIG1lZGlhIGF0dHJpYnV0ZSBkb2Vzbid0IG1hdGNoXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yRWFjaC5jYWxsKGNzc1J1bGVzLCBmaW5kRGVjbGFyYXRpb25zKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkZWNsYXJhdGlvbnM7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5kRGVjbGFyYXRpb25zKHJ1bGUpIHtcbiAgICBpZiAocnVsZS50eXBlID09PSA3KSB7XG4gICAgICB2YXIgdmFsdWU7XG5cbiAgICAgIC8vIHRoZXJlIG1heSBiZSBhIGNhc2Ugd2hlcmUgYWNjZXNzaW5nIGNzc1RleHQgdGhyb3dzIGFuIGVycm9yLlxuICAgICAgLy8gSSBjb3VsZCBub3QgcmVwcm9kdWNlIHRoaXMgaXNzdWUsIGJ1dCB0aGUgd29yc3QgdGhhdCBjYW4gaGFwcGVuXG4gICAgICAvLyB0aGlzIHdheSBpcyBhbiBhbmltYXRpb24gbm90IHJ1bm5pbmcgcHJvcGVybHkuXG4gICAgICAvLyBub3QgYXdlc29tZSwgYnV0IHByb2JhYmx5IGJldHRlciB0aGFuIGEgc2NyaXB0IGVycm9yXG4gICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3JvZG5leXJlaG0vdmlld3BvcnQtdW5pdHMtYnVnZ3lmaWxsL2lzc3Vlcy8yMVxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBydWxlLmNzc1RleHQ7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2aWV3cG9ydFVuaXRFeHByZXNzaW9uLmxhc3RJbmRleCA9IDA7XG4gICAgICBpZiAodmlld3BvcnRVbml0RXhwcmVzc2lvbi50ZXN0KHZhbHVlKSkge1xuICAgICAgICAvLyBLZXlmcmFtZXNSdWxlIGRvZXMgbm90IGhhdmUgYSBDU1MtUHJvcGVydHlOYW1lXG4gICAgICAgIGRlY2xhcmF0aW9ucy5wdXNoKFtydWxlLCBudWxsLCB2YWx1ZV0pO1xuICAgICAgICBvcHRpb25zLmhhY2tzICYmIG9wdGlvbnMuaGFja3MuZmluZERlY2xhcmF0aW9ucyhkZWNsYXJhdGlvbnMsIHJ1bGUsIG51bGwsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghcnVsZS5zdHlsZSkge1xuICAgICAgaWYgKCFydWxlLmNzc1J1bGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yRWFjaC5jYWxsKHJ1bGUuY3NzUnVsZXMsIGZ1bmN0aW9uKF9ydWxlKSB7XG4gICAgICAgIGZpbmREZWNsYXJhdGlvbnMoX3J1bGUpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3JFYWNoLmNhbGwocnVsZS5zdHlsZSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIHZhbHVlID0gcnVsZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xuICAgICAgLy8gcHJlc2VydmUgdGhvc2UgIWltcG9ydGFudCBydWxlc1xuICAgICAgaWYgKHJ1bGUuc3R5bGUuZ2V0UHJvcGVydHlQcmlvcml0eShuYW1lKSkge1xuICAgICAgICB2YWx1ZSArPSAnICFpbXBvcnRhbnQnO1xuICAgICAgfVxuXG4gICAgICB2aWV3cG9ydFVuaXRFeHByZXNzaW9uLmxhc3RJbmRleCA9IDA7XG4gICAgICBpZiAodmlld3BvcnRVbml0RXhwcmVzc2lvbi50ZXN0KHZhbHVlKSkge1xuICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChbcnVsZSwgbmFtZSwgdmFsdWVdKTtcbiAgICAgICAgb3B0aW9ucy5oYWNrcyAmJiBvcHRpb25zLmhhY2tzLmZpbmREZWNsYXJhdGlvbnMoZGVjbGFyYXRpb25zLCBydWxlLCBuYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRSZXBsYWNlZFZpZXdwb3J0VW5pdHMoKSB7XG4gICAgZGltZW5zaW9ucyA9IGdldFZpZXdwb3J0KCk7XG5cbiAgICB2YXIgY3NzID0gW107XG4gICAgdmFyIGJ1ZmZlciA9IFtdO1xuICAgIHZhciBvcGVuO1xuICAgIHZhciBjbG9zZTtcblxuICAgIGRlY2xhcmF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHZhciBfaXRlbSA9IG92ZXJ3cml0ZURlY2xhcmF0aW9uLmFwcGx5KG51bGwsIGl0ZW0pO1xuICAgICAgdmFyIF9vcGVuID0gX2l0ZW0uc2VsZWN0b3IubGVuZ3RoID8gKF9pdGVtLnNlbGVjdG9yLmpvaW4oJyB7XFxuJykgKyAnIHtcXG4nKSA6ICcnO1xuICAgICAgdmFyIF9jbG9zZSA9IG5ldyBBcnJheShfaXRlbS5zZWxlY3Rvci5sZW5ndGggKyAxKS5qb2luKCdcXG59Jyk7XG5cbiAgICAgIGlmICghX29wZW4gfHwgX29wZW4gIT09IG9wZW4pIHtcbiAgICAgICAgaWYgKGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgICBjc3MucHVzaChvcGVuICsgYnVmZmVyLmpvaW4oJ1xcbicpICsgY2xvc2UpO1xuICAgICAgICAgIGJ1ZmZlci5sZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9vcGVuKSB7XG4gICAgICAgICAgb3BlbiA9IF9vcGVuO1xuICAgICAgICAgIGNsb3NlID0gX2Nsb3NlO1xuICAgICAgICAgIGJ1ZmZlci5wdXNoKF9pdGVtLmNvbnRlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNzcy5wdXNoKF9pdGVtLmNvbnRlbnQpO1xuICAgICAgICAgIG9wZW4gPSBudWxsO1xuICAgICAgICAgIGNsb3NlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKF9vcGVuICYmICFvcGVuKSB7XG4gICAgICAgIG9wZW4gPSBfb3BlbjtcbiAgICAgICAgY2xvc2UgPSBfY2xvc2U7XG4gICAgICB9XG5cbiAgICAgIGJ1ZmZlci5wdXNoKF9pdGVtLmNvbnRlbnQpO1xuICAgIH0pO1xuXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgIGNzcy5wdXNoKG9wZW4gKyBidWZmZXIuam9pbignXFxuJykgKyBjbG9zZSk7XG4gICAgfVxuXG4gICAgLy8gT3BlcmEgTWluaSBtZXNzZXMgdXAgb24gdGhlIGNvbnRlbnQgaGFjayAoaXQgcmVwbGFjZXMgdGhlIERPTSBub2RlJ3MgaW5uZXJIVE1MIHdpdGggdGhlIHZhbHVlKS5cbiAgICAvLyBUaGlzIGZpeGVzIGl0LiBXZSB0ZXN0IGZvciBPcGVyYSBNaW5pIG9ubHkgc2luY2UgaXQgaXMgdGhlIG1vc3QgZXhwZW5zaXZlIENTUyBzZWxlY3RvclxuICAgIC8vIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvVW5pdmVyc2FsX3NlbGVjdG9yc1xuICAgIGlmIChpc09wZXJhTWluaSkge1xuICAgICAgY3NzLnB1c2goJyogeyBjb250ZW50OiBub3JtYWwgIWltcG9ydGFudDsgfScpO1xuICAgIH1cblxuICAgIHJldHVybiBjc3Muam9pbignXFxuXFxuJyk7XG4gIH1cblxuICBmdW5jdGlvbiBvdmVyd3JpdGVEZWNsYXJhdGlvbihydWxlLCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBfdmFsdWU7XG4gICAgdmFyIF9zZWxlY3RvcnMgPSBbXTtcblxuICAgIF92YWx1ZSA9IHZhbHVlLnJlcGxhY2Uodmlld3BvcnRVbml0RXhwcmVzc2lvbiwgcmVwbGFjZVZhbHVlcyk7XG5cbiAgICBpZiAob3B0aW9ucy5oYWNrcykge1xuICAgICAgX3ZhbHVlID0gb3B0aW9ucy5oYWNrcy5vdmVyd3JpdGVEZWNsYXJhdGlvbihydWxlLCBuYW1lLCBfdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChuYW1lKSB7XG4gICAgICAvLyBza2lwcGluZyBLZXlmcmFtZXNSdWxlXG4gICAgICBfc2VsZWN0b3JzLnB1c2gocnVsZS5zZWxlY3RvclRleHQpO1xuICAgICAgX3ZhbHVlID0gbmFtZSArICc6ICcgKyBfdmFsdWUgKyAnOyc7XG4gICAgfVxuXG4gICAgdmFyIF9ydWxlID0gcnVsZS5wYXJlbnRSdWxlO1xuICAgIHdoaWxlIChfcnVsZSkge1xuICAgICAgX3NlbGVjdG9ycy51bnNoaWZ0KCdAbWVkaWEgJyArIF9ydWxlLm1lZGlhLm1lZGlhVGV4dCk7XG4gICAgICBfcnVsZSA9IF9ydWxlLnBhcmVudFJ1bGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbGVjdG9yOiBfc2VsZWN0b3JzLFxuICAgICAgY29udGVudDogX3ZhbHVlXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGxhY2VWYWx1ZXMobWF0Y2gsIG51bWJlciwgdW5pdCkge1xuICAgIHZhciBfYmFzZSA9IGRpbWVuc2lvbnNbdW5pdF07XG4gICAgdmFyIF9udW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcikgLyAxMDA7XG4gICAgcmV0dXJuIChfbnVtYmVyICogX2Jhc2UpICsgJ3B4JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZpZXdwb3J0KCkge1xuICAgIHZhciB2aCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB2YXIgdncgPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgIHJldHVybiB7XG4gICAgICB2aDogdmgsXG4gICAgICB2dzogdncsXG4gICAgICB2bWF4OiBNYXRoLm1heCh2dywgdmgpLFxuICAgICAgdm1pbjogTWF0aC5taW4odncsIHZoKVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbXBvcnRDcm9zc09yaWdpbkxpbmtzKG5leHQpIHtcbiAgICB2YXIgX3dhaXRpbmcgPSAwO1xuICAgIHZhciBkZWNyZWFzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgX3dhaXRpbmctLTtcbiAgICAgIGlmICghX3dhaXRpbmcpIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3JFYWNoLmNhbGwoZG9jdW1lbnQuc3R5bGVTaGVldHMsIGZ1bmN0aW9uKHNoZWV0KSB7XG4gICAgICBpZiAoIXNoZWV0LmhyZWYgfHwgb3JpZ2luKHNoZWV0LmhyZWYpID09PSBvcmlnaW4obG9jYXRpb24uaHJlZikgfHwgc2hlZXQub3duZXJOb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS12aWV3cG9ydC11bml0cy1idWdneWZpbGwnKSA9PT0gJ2lnbm9yZScpIHtcbiAgICAgICAgLy8gc2tpcCA8c3R5bGU+IGFuZCA8bGluaz4gZnJvbSBzYW1lIG9yaWdpbiBvciBleHBsaWNpdGx5IGRlY2xhcmVkIHRvIGlnbm9yZVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF93YWl0aW5nKys7XG4gICAgICBjb252ZXJ0TGlua1RvU3R5bGUoc2hlZXQub3duZXJOb2RlLCBkZWNyZWFzZSk7XG4gICAgfSk7XG5cbiAgICBpZiAoIV93YWl0aW5nKSB7XG4gICAgICBuZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3JpZ2luKHVybCkge1xuICAgIHJldHVybiB1cmwuc2xpY2UoMCwgdXJsLmluZGV4T2YoJy8nLCB1cmwuaW5kZXhPZignOi8vJykgKyAzKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0TGlua1RvU3R5bGUobGluaywgbmV4dCkge1xuICAgIGdldENvcnMobGluay5ocmVmLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBzdHlsZS5tZWRpYSA9IGxpbmsubWVkaWE7XG4gICAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaHJlZicsIGxpbmsuaHJlZik7XG4gICAgICBzdHlsZS50ZXh0Q29udGVudCA9IHRoaXMucmVzcG9uc2VUZXh0O1xuICAgICAgbGluay5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChzdHlsZSwgbGluayk7XG4gICAgICBuZXh0KCk7XG4gICAgfSwgbmV4dCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDb3JzKHVybCwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgaWYgKCd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgICAgLy8gWEhSIGZvciBDaHJvbWUvRmlyZWZveC9PcGVyYS9TYWZhcmkuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBYRG9tYWluUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIFhEb21haW5SZXF1ZXN0IGZvciBJRS5cbiAgICAgIHhociA9IG5ldyBYRG9tYWluUmVxdWVzdCgpO1xuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3Jvc3MtZG9tYWluIFhIUiBub3Qgc3VwcG9ydGVkJyk7XG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IHN1Y2Nlc3M7XG4gICAgeGhyLm9uZXJyb3IgPSBlcnJvcjtcbiAgICB4aHIuc2VuZCgpO1xuICAgIHJldHVybiB4aHI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHZlcnNpb246ICcwLjYuMCcsXG4gICAgZmluZFByb3BlcnRpZXM6IGZpbmRQcm9wZXJ0aWVzLFxuICAgIGdldENzczogZ2V0UmVwbGFjZWRWaWV3cG9ydFVuaXRzLFxuICAgIGluaXQ6IGluaXRpYWxpemUsXG4gICAgcmVmcmVzaDogcmVmcmVzaFxuICB9O1xuXG59KSk7XG4iLCIoZnVuY3Rpb24oc2VsZikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKHNlbGYuZmV0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdXBwb3J0ID0ge1xuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfVxuXG4gIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gICAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gICAgXVxuXG4gICAgdmFyIGlzRGF0YVZpZXcgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxuICAgIH1cblxuICAgIHZhciBpc0FycmF5QnVmZmVyVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgICB9XG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH0sIHRoaXMpXG5cbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICAgIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSsnLCcrdmFsdWUgOiB2YWx1ZVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICAgIH1cbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG4gIH1cblxuICBmdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gQm9keSgpIHtcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBCb2R5SW5pdCB0eXBlJylcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICAgIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICByZXR1cm4gKG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xKSA/IHVwY2FzZWQgOiBtZXRob2RcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICAgIH1cbiAgICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgICB9XG4gICAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7IGJvZHk6IHRoaXMuX2JvZHlJbml0IH0pXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvcm1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gICAgcmF3SGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSAnc3RhdHVzJyBpbiBvcHRpb25zID8gb3B0aW9ucy5zdGF0dXMgOiAyMDBcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCdyZXNwb25zZVR5cGUnIGluIHhociAmJiBzdXBwb3J0LmJsb2IpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgICAgfVxuXG4gICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gICAgfSlcbiAgfVxuICBzZWxmLmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMpO1xuIiwiLyoqXG4gKlxuICogRXZlbnQgQnVzXG4gKlxuICogUHViL1N1YiBzeXN0ZW0gZm9yIGN1c3RvbSBldmVudCBjb21tdW5pY2F0aW9uIGJldHdlZW4gbW9kdWxlcy5cbiAqXG4gKiBFeHBvcnRzIGEgc2luZ2xlIEV2ZW50QnVzIGluc3RhbmNlLCBhcyB3ZWxsIGFzIGEgZmFjdG9yeSBmdW5jdGlvbiBcbiAqIGZvciBpbXBsZW1lbnRpbmcgcHViL3N1YiBmdW5jdGlvbmFsaXR5IGludG8gaW5kaXZpZHVhbCBvYmplY3RzXG4gKlxuICovXG5cbmZ1bmN0aW9uIGZhY3RvcnkoKSB7XG5cbiAgY29uc3QgdG9waWNzID0ge307XG5cbiAgY29uc3QgRXZlbnRCdXMgPSB7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIFN1YnNjcmliZSB0byB0b3BpYywgcGFzc2luZyBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBldmVudCBuYW1lIHRvIHN1YnNjcmliZSB0by4gWW91IGNhbiBzdWJzY3JpYmUgdG8gbXVsdGlwbGUgY3VzdG9tIGV2ZW50cyBhdCBvbmNlIGJ5IGVudGVyaW5nIHRoZSBldmVudCBuYW1lcyBzZXBhcmF0ZWQgYnkgYSBzcGFjZS5cbiAgICAgKiBlZzogJ2V2ZW50MSBldmVudDIgLi4uJ1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIC0gQ2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBldmVudCBnZXRzIHB1Ymxpc2hlZFxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gQ2FuY2VsbGFibGUgc3Vic2NyaXB0aW9uIG9iamVjdC5cbiAgICAgKlxuICAgICAqIFxuICAgICAqL1xuXG4gICAgc3Vic2NyaWJlKHRvcGljLCBsaXN0ZW5lcikge1xuXG4gICAgICB0b3BpYyA9IHRvcGljLnNwbGl0KCcgJylcblxuICAgICAgLy8gQ3JlYXRlIG9iamVjdCB0byBob2xkIHRvcGljcyBhbmQgdGhlaXIgaW5kZXhlc1xuICAgICAgbGV0IGN1cnJlbnQgPSB7fTtcbiAgICAgIFxuICAgICAgdG9waWMubWFwKCBpdGVtID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSB0b3BpYydzIG9iamVjdCBpZiBub3QgeWV0IGNyZWF0ZWRcbiAgICAgICAgaWYoIXRvcGljcy5oYXNPd25Qcm9wZXJ0eShpdGVtKSkge1xuICAgICAgICAgIHRvcGljc1tpdGVtXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRoZSBsaXN0ZW5lciB0byBxdWV1ZVxuICAgICAgICBsZXQgaW5kZXggPSB0b3BpY3NbaXRlbV0ucHVzaChsaXN0ZW5lcikgLTE7XG5cbiAgICAgICAgY3VycmVudFtpdGVtXSA9IGluZGV4O1xuICAgICAgfSk7XG4gICAgICBcblxuICAgICAgLy8gUHJvdmlkZSBoYW5kbGUgYmFjayBmb3IgcmVtb3ZhbCBvZiB0b3BpY1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVtb3ZlKCkge1xuICAgICAgICAgIC8vIEdvIHRocm91Z2ggY3VycmVudCBsaXN0IGFuZCBnZXQgdGhlaXIgaW5kZXhlcyB0byBkZWxldGVcbiAgICAgICAgICBmb3IgKCB2YXIgaXRlbSBpbiBjdXJyZW50ICkge1xuICAgICAgICAgICAgZGVsZXRlIHRvcGljc1sgaXRlbSBdWyBjdXJyZW50W2l0ZW1dIF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG5cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBUcmlnZ2VyIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWMgLSBldmVudCBuYW1lIHRvIHB1Ymxpc2hcbiAgICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBbnkgbnVtYmVyIG9mIGN1c3RvbSBkYXRhIHRvIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcbiAgICAgKiBcbiAgICAgKi9cbiAgICBcbiAgICBwdWJsaXNoKHRvcGljKSB7XG5cbiAgICAgIC8vIElmIHRoZSB0b3BpYyBkb2Vzbid0IGV4aXN0LCBvciB0aGVyZSdzIG5vIGxpc3RlbmVycyBpbiBxdWV1ZSwganVzdCBsZWF2ZVxuICAgICAgaWYoIXRvcGljcy5oYXNPd25Qcm9wZXJ0eSh0b3BpYykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0b3BpY3NbdG9waWNdLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgaXRlbS5hcHBseShudWxsLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gRXZlbnRCdXNcblxufVxuXG5leHBvcnQgY29uc3QgZXZlbnRCdXNGYWN0b3J5ID0gZmFjdG9yeVxuXG5leHBvcnQgZGVmYXVsdCBmYWN0b3J5KClcbiIsIi8qKlxuICpcbiAqIExvYWQgTW9yZVxuICpcbiAqIEhhbmRsZXMgbG9hZGluZyBtb3JlIHBvc3RzIGF0IHRoZSBlbmQgb2YgYSBsaXN0IG9mIHBvc3RzXG4gKiBcbiAqL1xuXG5pbXBvcnQgeyBldmVudEJ1c0ZhY3RvcnkgfSBmcm9tICcuL0V2ZW50QnVzJ1xuaW1wb3J0IHsgaW5BcnJheSwgZXh0cmFjdFVSTFBhcmFtZXRlcnMsIHNlcmlhbGl6ZU9iamVjdCwgY3JlYXRlRWxlbWVudCwgY29sbGVjdGlvbiB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgeyBsb2FkT25jZSB9IGZyb20gJy4vbG9hZCdcblxuY29uc3QgTE9BRElOR19DTEFTUyA9ICdpcy1sb2FkaW5nJ1xuXG4vKipcbiAqXG4gKiBGaWx0ZXIgdGhlIGl0ZW1zIGZvdW5kIGZyb20gdGhlIFhIUiByZXF1ZXN0LFxuICogcmVtb3ZpbmcgdGhlIG9uZXMgd2l0aCBhIGBkYXRhLXBvc3QtaWRgIGFscmVhZHkgcHVzaGVkIHRvIHRoZVxuICogYGxvYWRlZEl0ZW1zYCBhcnJheVxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBpdGVtIHdhcyBmb3VuZCBpbiB0aGUgcGFzc2VkIGFycmF5IG9yIG5vdFxuICpcbiAqL1xuXG5mdW5jdGlvbiBmaWx0ZXJMb2FkZWQoaXRlbUlkLCBsb2FkZWRJdGVtcykge1xuICBsZXQgYWxyZWFkeUxvYWRlZCA9IGluQXJyYXkoaXRlbUlkLCBsb2FkZWRJdGVtcylcbiAgbG9hZGVkSXRlbXMucHVzaChpdGVtSWQpXG4gIHJldHVybiAhYWxyZWFkeUxvYWRlZFxufVxuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgbG9hZE1vcmU6IG51bGxcbn1cblxuLyoqXG4gKiBcbiAqIEJpbmQgRE9NIGFuZCBjdXN0b20gbG9hZGVyIGV2ZW50cyB0byB0aGUgbG9hZE1vcmUgYnV0dG9uLCB0cmlnZ2VyaW5nIGxvYWRpbmcgdGhlIG5leHQgc2V0IG9mIHBvc3RzIG9uIGNsaWNrXG4gKiBhbmQgc2V0dGluZyBpdCdzIGxvYWRpbmcvZGlzYWJsZWQgc3RhdGVzIGRlcGVuZGluZyBvbiB0aGUgZXZlbnRzIHRoYXQgdGhlIGxvYWRlciBmaXJlcy4gXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGxvYWRlciBpbnN0YW5jZSBmcm9tIGBjcmVhdGVMb2FkZXJgXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBidXR0b24gTG9hZCBtb3JlIGJ1dHRvbiBwYXNzZWQgaW50byB0aGUgYGNyZWF0ZUxvYWRlcmAgaW5zdGFuY2VcbiAqIEByZXR1cm4ge251bGx9XG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBpbml0TG9hZE1vcmVCdXR0b24obG9hZGVyLCBidXR0b24pIHtcblxuICBsb2FkZXIuc3Vic2NyaWJlKCdhamF4LWxvYWRlcjpuZXh0LXJlcXVlc3RlZCcsICgpID0+IGJ1dHRvbi5jbGFzc0xpc3QuYWRkKExPQURJTkdfQ0xBU1MpKVxuICBsb2FkZXIuc3Vic2NyaWJlKCdhamF4LWxvYWRlcjpuZXh0LWZldGNoZWQnLCAoKSA9PiBidXR0b24uY2xhc3NMaXN0LnJlbW92ZShMT0FESU5HX0NMQVNTKSlcbiAgbG9hZGVyLnN1YnNjcmliZSgnYWpheC1sb2FkZXI6bmV4dC1wYWdlLWxlbmd0aCcsIGwgPT4ge1xuICAgIGJ1dHRvbi5kaXNhYmxlZCA9IGwgPyBmYWxzZSA6IHRydWVcbiAgfSlcblxuICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsb2FkZXIubmV4dClcblxufVxuXG4vKipcbiAqXG4gKiBDcmVhdGUgYSBsb2FkZXIgaW5zdGFuY2VcbiAqXG4gKiBAaW1wb3J0YW50IFlvdXIgYHNlbGVjdG9yYCBlbGVtZW50cyBzaG91bGQgaGF2ZSBhIGBkYXRhLXBvc3QtaWRgIGF0dHJpYnV0ZSwgd2l0aCBpdCdzIGNvcnJlc3BvbmRpbmcgXG4gKiBwb3N0IGlkLiBUaGUgc2NyaXB0IHVzZXMgdGhpcyB0byBmaWx0ZXIgb3V0IGFueSBzdGlja3kgcG9zdHMgdGhhdCBtYXkgaGF2ZSBhbHJlYWR5IGJlZW4gbG9hZGVkIFxuICogXG4gKiBAZXZlbnRzICdhamF4LWxvYWRlcjpmaW5pc2hlZCcsICdhamF4LWxvYWRlcjpuZXh0LWZldGNoZWQnLCAnYWpheC1sb2FkZXI6bG9hZGVkJyBcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBUaGUgc2VsZWN0b3IgdG8gYmUgdXNlZCB0byBleHRyYWN0IHRoZSBkZXNpcmVkIGxpc3RpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyBmcm9tIHRoZSBYSFIgcmVzcG9uc2VcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgQ29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZSBsb2FkZXIgaW5zdGFuY2VcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbmZpZy5sb2FkQnV0dG9uIC0gQnV0dG9uIGVsZW1lbnQgdGhhdCB3aWxsIHRyaWdnZXIgbG9hZGluZyB0aGUgbmV4dCBzZXQgb2YgcG9zdHMsIGJ5IHBhc3NpbmcgaXRcbiAqIHRvIHRoZSBjb25maWcgaXQgd2lsbCBnZXQgdGhlIGNsaWNrIERPTSBsaXN0ZW5lciBib3VuZCB0byBsb2FkIHRoZSBuZXh0IHNldCwgYXMgd2VsbCBhcyByZWNlaXZlIHRoZSBsb2FkaW5nIGFuZCBkaXNhYmxlZCBzdGF0ZXMgYWNjb3JkaW5nbHkuXG4gKiBcbiAqIEByZXR1cm5zIHtvYmplY3R9IENvbnRyb2xsZXIgb2JqZWN0IHRvIHJlcXVlc3QgdGhlIG5leHQgc2V0IG9mIHBvc3RzIG9yIHNldCB0aGUgdGhlIGFjdGl2ZSBxdWVyeVxuICpcbiAqL1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUxvYWRlcihzZWxlY3RvciwgY29uZmlnKSB7XG5cbiAgLy8gRm9sbG93aW5nIFdQIHN0cnVjdHVyZSBmb3IgcGFnZWQgbGlzdHNcbiAgLy8gTm90ZTogSWYgd29ya2luZyB3aXRoIGEgbG9jYWxob3N0OjMwMDAgc2VydmVyLFxuICAvLyBsb2NhdGlvbi5vcmlnaW4gd2lsbCByZXR1cm4gdW5kZWZpbmVkIHdoZW4gYWNjZXNzaW5nIHZpYVxuICAvLyB0aGUgZXh0ZXJuYWwgSVAgKDE5Mi4xMzYuLi4uLilcbiAgY29uc3QgeyBwYXRobmFtZSwgc2VhcmNoIH0gPSB3aW5kb3cubG9jYXRpb25cbiAgY29uc3QgYnVmZmVyID0gY3JlYXRlRWxlbWVudCgnZGl2JykgLy8gQnVmZmVyIGZvciB0ZW1wb3JhcmlseSBzdG9yaW5nIHJldHVybmVkIEhUTUxcbiAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBjb25maWcpXG5cbiAgbGV0IGxvYWRpbmcgPSBmYWxzZVxuICBsZXQgZmluaXNoZWQgPSBmYWxzZVxuXG4gIGxldCBjdXJyZW50UGFnZSA9IDFcbiAgbGV0IGxvYWRlZEl0ZW1zID0gY29sbGVjdGlvbihzZWxlY3RvcikubWFwKGl0ZW0gPT4gaXRlbS5kYXRhc2V0LnBvc3RJZClcblxuICBjb25zdCBwYXJhbXMgPSBleHRyYWN0VVJMUGFyYW1ldGVycygpXG5cbiAgY29uc3QgdXJsID0gcGFnZSA9PiB7XG4gICAgcGFyYW1zLnBhZ2VkID0gcGFnZVxuICAgIHJldHVybiBwYXRobmFtZSArICc/JyArIHNlcmlhbGl6ZU9iamVjdChwYXJhbXMpXG4gIH1cblxuICBjb25zdCBzZXRVcmxTdGF0ZSA9ICgpID0+IHtcblxuICAgIGNvbnN0IHN0YXRlUGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zKVxuICAgIGRlbGV0ZSBzdGF0ZVBhcmFtc1sncGFnZWQnXVxuICAgIGNvbnN0IHNlcmlhbGl6ZWRQYXJhbXMgPSBzZXJpYWxpemVPYmplY3Qoc3RhdGVQYXJhbXMpXG4gICAgY29uc3QgbmV4dFN0YXRlID0gc2VyaWFsaXplZFBhcmFtcy5sZW5ndGggPyBwYXRobmFtZSArICc/JyArIHNlcmlhbGl6ZWRQYXJhbXMgOiBwYXRobmFtZVxuXG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBudWxsLCBuZXh0U3RhdGUpXG5cbiAgfVxuXG4gIGNvbnN0IHB1Ymxpc2hGaW5pc2hlZCA9ICgpID0+IHtcbiAgICBmaW5pc2hlZCA9IHRydWVcbiAgICBpbnN0YW5jZS5wdWJsaXNoKCdhamF4LWxvYWRlcjpmaW5pc2hlZCcpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQ2hlY2sgaWYgdGhlcmUgaXMgYSBuZXh0IHBhZ2UgdG8gYmUgbG9hZGVkLlxuICAgKlxuICAgKiBEb2Vzbid0IHVwZGF0ZSB0aGUgY3VycmVudHBhZ2UgY291bnRlclxuICAgKlxuICAgKiBAZmlyZXMgYGFqYXgtbG9hZGVyOm5leHQtcmVxdWVzdGVkYCB3aGVuIHRoZSBuZXh0IHBhZ2UgaXMgcmVxdWVzdGVkXG4gICAqIEBmaXJlcyBgYWpheC1sb2FkZXI6ZmluaXNoZWRgIHdoZW4gdGhlcmUncyBubyBuZXh0IHBhZ2UgdG8gbG9hZFxuICAgKiBAZmlyZXMgJ2FqYXgtbG9hZGVyOm5leHQtZmV0Y2hlZCcgd2hlbiB0aGUgcmVxdWVzdCBmb3IgdGhlIG5leHQgcGFnZSBpcyBmaW5pc2hlZFxuICAgKiBcbiAgICogVGhpcyB3aWxsIGFsc28gY2F1c2UgY2FjaGluZyBvZiB0aGUgbmV4dCByZXNwb25zZSwgbWFraW5nIHRoZSAnTG9hZCBNb3JlJyBidXR0b25cbiAgICogbG9hZCB2aXJ0dWFsbHkgaW5zdGFudGx5IHdoZW4gY2xpY2tlZFxuICAgKiBcbiAgKi8gXG4gIGNvbnN0IGNoZWNrSWZOZXh0ID0gKCkgPT4ge1xuXG4gICAgbGV0IG5leHRQYWdlID0gdXJsKGN1cnJlbnRQYWdlICsgMSlcblxuICAgIGluc3RhbmNlLnB1Ymxpc2goJ2FqYXgtbG9hZGVyOm5leHQtcmVxdWVzdGVkJylcblxuICAgIGxvYWRPbmNlKG5leHRQYWdlKVxuICAgICAgLmNhdGNoKHB1Ymxpc2hGaW5pc2hlZClcbiAgICAgIC50aGVuKHJlcyA9PiB7XG5cbiAgICAgICAgaW5zdGFuY2UucHVibGlzaCgnYWpheC1sb2FkZXI6bmV4dC1mZXRjaGVkJylcblxuICAgICAgICBidWZmZXIuaW5uZXJIVE1MID0gcmVzXG5cbiAgICAgICAgbGV0IHJlc3VsdHMgPSBjb2xsZWN0aW9uKGJ1ZmZlci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcbiAgICAgICAgICAvLyBSZW1vdmUgV1AgJ1N0aWNreScgcG9zdHMgZnJvbSBzdWJzZXF1ZW50IHBhZ2VzXG4gICAgICAgICAgLmZpbHRlcihpdGVtID0+IGZpbHRlckxvYWRlZChpdGVtLmRhdGFzZXQucG9zdElkLCBbXS5jb25jYXQobG9hZGVkSXRlbXMpKSlcblxuICAgICAgICBpbnN0YW5jZS5wdWJsaXNoKCdhamF4LWxvYWRlcjpuZXh0LXBhZ2UtbGVuZ3RoJywgcmVzdWx0cy5sZW5ndGgpXG5cbiAgICAgICAgaWYocmVzdWx0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgIHB1Ymxpc2hGaW5pc2hlZCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogTG9hZCB0aGUgbmV4dCBzZXQgb2YgcG9zdHNcbiAgICpcbiAgICogQGZpcmVzIGBhamF4LWxvYWRlcjpsb2FkZWRgIC0gJ0xvYWRlZCcgZXZlbnQgd2l0aCB0aGUgcmVzdWx0aW5nIHBvc3RzXG4gICAqIGFzIHRoZSBzdWJzY3JpYmUgY2FsbGJhY2sgcGFyYW1ldGVyXG4gICAqXG4gICAqL1xuXG4gIGNvbnN0IG5leHQgPSAocXVlcnkgPSBmYWxzZSkgPT4ge1xuXG4gICAgaWYobG9hZGluZyB8fCBmaW5pc2hlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbG9hZGluZyA9IHRydWVcblxuICAgIGxldCBuZXh0VXJsID0gdXJsKCsrY3VycmVudFBhZ2UpXG5cbiAgICBzZXRVcmxTdGF0ZSgpXG4gICAgXG4gICAgLy8gaW5jcmVtZW50ICdjdXJyZW50UGFnZScgYW5kIHJlcXVlc3QgaXRcbiAgICBsb2FkT25jZShuZXh0VXJsKVxuICAgICAgLnRoZW4ocmVzID0+IHtcblxuICAgICAgICBidWZmZXIuaW5uZXJIVE1MID0gcmVzXG5cbiAgICAgICAgbGV0IHJlc3VsdHMgPSBjb2xsZWN0aW9uKGJ1ZmZlci5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcbiAgICAgICAgICAvLyBSZW1vdmUgV1AgJ1N0aWNreScgcG9zdHMgZnJvbSBzdWJzZXF1ZW50IHBhZ2VzXG4gICAgICAgICAgLmZpbHRlcihpdGVtID0+IGZpbHRlckxvYWRlZChpdGVtLmRhdGFzZXQucG9zdElkLCBsb2FkZWRJdGVtcykpXG5cbiAgICAgICAgaWYocmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICBpbnN0YW5jZS5wdWJsaXNoKCdhamF4LWxvYWRlcjpsb2FkZWQnLCByZXN1bHRzLCBjdXJyZW50UGFnZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHF1ZXJ5ICYmICFyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICAgIGluc3RhbmNlLnB1Ymxpc2goJ2FqYXgtbG9hZGVyOm5vLXJlc3VsdHMnLCBxdWVyeSlcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRpbmcgPSBmYWxzZVxuXG4gICAgICB9KVxuXG4gICAgY2hlY2tJZk5leHQoKVxuXG4gIH1cblxuICBjb25zdCBzZXRRdWVyeSA9IChrZXksIHZhbHVlKSA9PiB7XG4gICAgY3VycmVudFBhZ2UgPSAwXG4gICAgbG9hZGVkSXRlbXMgPSBbXVxuICAgIGZpbmlzaGVkID0gZmFsc2VcblxuICAgIGlmKGxvYWRpbmcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIGRvIG5vdGhpbmcgaWYgdGhlIHF1ZXJ5IG1hZGUgaXMgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnQgb25lXG4gICAgaWYocGFyYW1zW2tleV0gPT0gdmFsdWUgfHwgKCF2YWx1ZSAmJiAhcGFyYW1zW2tleV0pKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZighdmFsdWUpIHtcbiAgICAgIGRlbGV0ZSBwYXJhbXNba2V5XVxuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhbXNba2V5XSA9IHZhbHVlXG4gICAgfVxuXG4gICAgaW5zdGFuY2UucHVibGlzaCgnYWpheC1sb2FkZXI6cXVlcnktc2V0JylcblxuICAgIG5leHQocGFyYW1zKVxuICB9XG5cbiAgY29uc3QgZ2V0UXVlcnkgPSAoKSA9PiBwYXJhbXNcblxuICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICBuZXh0OiBuZXh0LFxuICAgIHNldFF1ZXJ5OiBzZXRRdWVyeSxcbiAgICBnZXRRdWVyeTogZ2V0UXVlcnlcbiAgfSAsIGV2ZW50QnVzRmFjdG9yeSgpKVxuXG4gIC8vIEJpbmQgbG9hZCBtb3JlIGJ1dHRvbiBldmVudHNcbiAgaWYob3B0aW9ucy5sb2FkQnV0dG9uKSB7XG4gICAgaW5pdExvYWRNb3JlQnV0dG9uKGluc3RhbmNlLCBvcHRpb25zLmxvYWRCdXR0b24pXG4gIH1cblxuICAvLyBEbyB0aGUgaW5pdGlhbCBjaGVjayB0byBzZWUgaWYgdGhlcmUgaXMgYSBwYWdlICMyXG4gIGNoZWNrSWZOZXh0KClcblxuICByZXR1cm4gaW5zdGFuY2Vcbn0iLCIvKipcbiAqXG4gKiBGb3Jtc1xuICpcbiAqIEZvcm0gcHJlc2VudGF0aW9uYWwgYW5kIGJlaGF2aW91cmFsIHNjcmlwdHNcbiAqXG4gKiBVc2VzIGdsb2JhbCBqUXVlcnkgcmVmZXJlbmNlIGV4cG9zZWQgYnkgZm9ybXMgcGx1Z2luXG4gKlxuICovXG5cbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL0V2ZW50QnVzJ1xuXG5sZXQgJCA9IGZhbHNlO1xuXG4vLyBWZXJ5IEltcG9ydGFudFxuLy8gTXVzdCBlbnN1cmUgd2UgYXJlIHVzaW5nIHRoZSBzYW1lIGpxdWVyeSBpbnN0YW5jZSBhcyBHZm9ybXNcbmlmKHdpbmRvdy5qUXVlcnkpIHtcbiAgJCA9IHdpbmRvdy5qUXVlcnk7XG59XG5cbmNvbnN0IGZpbGVVcGxvYWRMYWJlbEF0dHIgPSAnZGF0YS1sYWJlbC10ZXh0J1xuXG5mdW5jdGlvbiBmaWxlVXBsb2FkT25DaGFuZ2UoZSwgZGVmYXVsdExhYmVsKSB7XG5cbiAgY29uc3QgJGN1c3RvbUxhYmVsID0gJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudCgpLmZpbmQoYFskeyBmaWxlVXBsb2FkTGFiZWxBdHRyIH1dYClcbiAgY29uc3QgdmFsID0gZS5jdXJyZW50VGFyZ2V0LnZhbHVlLnJlcGxhY2UoJ0M6XFxcXGZha2VwYXRoXFxcXCcsICcnKVxuXG4gICRjdXN0b21MYWJlbC50ZXh0KHZhbCB8fCBkZWZhdWx0TGFiZWwpXG5cbn1cblxuLyoqXG4gKlxuICogQ3VzdG9tIE1hc2sgZm9yIEZpbGUgVXBsb2FkIElucHV0c1xuICpcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tRmlsZVVwbG9hZChpbnB1dCwgbGFiZWwgPSAnQ2hvb3NlIGZpbGUnKSB7XG5cbiAgaWYoISQpIHsgcmV0dXJuIH1cblxuICBjb25zdCAkaW5wdXQgPSAkKGlucHV0KVxuICBjb25zdCAkY3VzdG9tTGFiZWwgPSAkKGA8c3BhbiAkeyBmaWxlVXBsb2FkTGFiZWxBdHRyIH0+JHsgbGFiZWwgfTwvc3Bhbj5gKVxuXG4gICRpbnB1dC5vbignY2hhbmdlJywgZSA9PiBmaWxlVXBsb2FkT25DaGFuZ2UoZSwgbGFiZWwpKVxuICBcbiAgJGlucHV0LndyYXBBbGwoYFxuICAgIDxsYWJlbCBmb3I9XCIkeyBpbnB1dC5pZCB9XCI+XG4gICAgPC9sYWJlbD5cbiAgYClcbiAgICAucGFyZW50KClcbiAgICAucHJlcGVuZCgkY3VzdG9tTGFiZWwpXG5cbiAgcmV0dXJuIHtcbiAgICBzZXRMYWJlbFRleHQobGFiZWwpIHtcbiAgICAgICRjdXN0b21MYWJlbC50ZXh0KGxhYmVsKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuXG4gICAgZ2V0TGFiZWxUZXh0KCkge1xuICAgICAgcmV0dXJuICRjdXN0b21MYWJlbC50ZXh0KClcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBnZXRHZm9ybUlkKGZvcm1FbCkge1xuICByZXR1cm4gZm9ybUVsLmlkLnJlcGxhY2UoJ2dmb3JtXycsICcnKVxufVxuXG5cbi8qKlxuICpcbiAqIFN1Ym1pdCBHcmF2aXR5IEZvcm1zIHZpYSBBSkFYXG4gKlxuICogSW4gdGhpcyBmdW5jdGlvbiB3ZSBhbHNvIHNldHVwIGN1c3RvbSBmaWxlIHVwbG9hZCBpbnB1dHMsIHNlZSBgY3VzdG9tRmlsZVVwbG9hZGBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgalF1ZXJ5IHNlbGVjdG9yIGZvciB0aGUgZm9ybXMgdG8gYmUgc3VibWl0dGVkIHZpYSBBSkFYXG4gKlxuICogQGV2ZW50ICdmb3JtOnN1Ym1pdHRpbmcnIC0gRmlyZXMgd2hlbiB0aGUgdXNlciBzdWJtaXRzIHRoZSBmb3JtXG4gKiBAZXZlbnQgJ2Zvcm06c3VibWl0LWRvbmUnIC0gRmlyZXMgYWZ0ZXIgR3Jhdml0eSBGb3JtcyBzdWNjZXNmdWxseSBzdWJtaXRzIHRoZSBmb3JtXG4gKlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4U3VibWl0R2Zvcm1zKHNlbGVjdG9yKSB7XG5cbiAgaWYoISQpIHsgcmV0dXJuIH1cblxuICAkKGRvY3VtZW50KS5vbignZ2Zvcm1fcG9zdF9yZW5kZXInLCBmdW5jdGlvbihlLCBmb3JtSWQpe1xuXG4gICAgJCgnI2dmb3JtX3dyYXBwZXJfJyArIGZvcm1JZClcbiAgICAgIC5maWx0ZXIoKGksIGVsKSA9PiB7XG5cbiAgICAgICAgY29uc3QgaGlkZGVuSWRGaWVsZCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPWdmb3JtX3N1Ym1pdF0nKVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB1c2luZyB0aGUgJ011bHRpcGxlIEZvcm0gSW5zdGFuY2UnIHBsdWdpbiBmb3IgR2Zvcm1zLFxuICAgICAgICAgKiBpdCBjaGFuZ2VzIHRoZSBET00gZm9ybSBJRCdzXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBjYXZlYXQgaXMgdGhhdCB0aGUgaW5pdGlhbCAnZ2Zvcm1fcG9zdF9yZW5kZXInIHdpbGxcbiAgICAgICAgICogcmV0dXJuIGEgJ2Zvcm1JZCcgZXF1YWwgdG8gdGhlIGFjdHVhbCBmb3JtIElEICh1c3VhbGx5IGEgbG93IGRpZ2l0XG4gICAgICAgICAqIGxpa2UgMSwgMiwgMyksIHdoZXJlYXMgc3Vic2VxdWVudCBgZ2Zvcm1fcG9zdF9yZW5kZXJgIChlZzogYWZ0ZXIgYW4gYWpheCBzdWJtaXQpLCByZXR1cm5cbiAgICAgICAgICogdGhlIElEIHNldCBieSB0aGUgJ011bHRpcGxlIEZvcm0gSW5zdGFuY2UnIHBsdWdpbiAod2hpY2ggbG9va3MgbW9yZSBsaWtlIGEgbGFyZ2UgcmFuZG9tXG4gICAgICAgICAqIG51bWJlciwgZWc6IDIxMDg5NjAxNDcpXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSAnZm9ybUlEJyBtYXRjaGVkIHRoZSBJRCBvbiB0aGUgRE9NIGVsZW1lbnQgKHVzZWQgYWZ0ZXIgYW4gYWpheCBzdWJtaXNzaW9uKVxuICAgICAgICBpZihnZXRHZm9ybUlkKGVsKSA9PSBmb3JtSWQpIHtcbiAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgfVxuICAgICAgICAvLyBvdGhlcndpc2UsIGNoZWNrIGFnYWlucyB0aGUgaGlkZGVuIGZpZWxkIGNvbnRhaW5pbmcgdGhlIGFjdHVhbCBmb3JtIElEICh1c2VkIG9uIGluaXRpYWwgcmVuZGVyKVxuICAgICAgICBlbHNlIGlmIChoaWRkZW5JZEZpZWxkICYmIGhpZGRlbklkRmllbGQudmFsdWUgPT0gZm9ybUlkKSB7XG4gICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuZWFjaCgoaSwgZm9ybSkgPT4ge1xuXG4gICAgICAgIGNvbnN0ICRmb3JtID0gJChmb3JtKVxuICAgICAgICBjb25zdCAkd3JhcHBlciA9ICRmb3JtLmNsb3Nlc3QoJy5nZm9ybV93cmFwcGVyJylcblxuICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnaXMtc3VibWl0dGluZycpXG5cbiAgICAgICAgJGZvcm1cbiAgICAgICAgICAuZmluZCgnW3R5cGU9ZmlsZV0nKVxuICAgICAgICAgIC5lYWNoKChpLCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgY3VzdG9tRmlsZVVwbG9hZChpbnB1dClcbiAgICAgICAgICB9KVxuXG4gICAgICB9KVxuICB9KTtcblxuICAkKGRvY3VtZW50KS5vbignZ2Zvcm1fY29uZmlybWF0aW9uX2xvYWRlZCcsIGZ1bmN0aW9uKGUsIGZvcm1JZCkge1xuICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnI2dmb3JtX3dyYXBwZXJfJyArIGZvcm1JZClcbiAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnaXMtc3VibWl0dGluZycpXG5cbiAgICBFdmVudEJ1cy5wdWJsaXNoKCdmb3JtOnN1Ym1pdC1kb25lJywgJHdyYXBwZXIpXG4gIH0pXG5cbiAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHNlbGVjdG9yICwgZSA9PiB7XG5cbiAgICBjb25zdCBmb3JtID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgY29uc3QgZm9ybUlkID0gZ2V0R2Zvcm1JZChmb3JtKVxuICAgIGNvbnN0ICR3cmFwcGVyID0gJCgnI2dmb3JtX3dyYXBwZXJfJyArIGZvcm1JZClcbiAgICAkd3JhcHBlci5hZGRDbGFzcygnaXMtc3VibWl0dGluZycpXG5cbiAgICBFdmVudEJ1cy5wdWJsaXNoKCdmb3JtOnN1Ym1pdHRpbmcnLCAkd3JhcHBlcilcbiAgfSlcbn1cblxuXG4vKipcbiAqXG4gKiBSZXBvc2l0aW9uIHRoZSBmb3JtIHN1Ym1pdCBidXR0b24sIHNvIHRoYXQgaXQncyBlYXNpZXJcbiAqIHRvIGFsaWduIHdpdGggdGhlIHRoZSBpbnB1dCBmaWVsZFxuICpcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gbmV3c2xldHRlck1vdmVTdWJtaXQoZm9ybSkge1xuICBpZighJCkgeyByZXR1cm4gfVxuXG4gIGNvbnN0ICRmb3JtID0gJChmb3JtKVxuICAkZm9ybS5maW5kKCdbdHlwZT1zdWJtaXRdJykuYXBwZW5kVG8oJGZvcm0uZmluZCgnLmdmb3JtX2JvZHknKSlcbn0iLCIvKipcbiAqXG4gKiBHbG9iYWwgRE9NIEV2ZW50IExpc3RlbmVycywgdG8gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSBgRXZlbnRCdXNgXG4gKlxuICogVXNlIHRoaXMgbW9kdWxlIGZvciBsaXN0ZW5lcnMgb24gZWxlbWVudHMgdGhhdCB3aWxsIGFsd2F5cyBiZSBwcmVzZW50LCBlZzogd2luZG93LCBkb2N1bWVudCwgYm9keS5cbiAqXG4gKiBGb3IgbW9yZSBzcGVjaWZpYyBldmVudCBsaXN0ZW5lcnMsIHlvdSBjYW4ganVzdCBhZGQgdGhlbSBvbiBwdWJsaWMuanNcbiAqXG4gKi9cblxuaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vRXZlbnRCdXMnXG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBjb25zdCBrZXlEb3duRXNjYXBlID0gJ2tleWRvd246ZXNjYXBlJ1xuZXhwb3J0IGNvbnN0IHdpbmRvd1Jlc2l6ZWQgPSAnd2luZG93OnJlc2l6ZWQnXG5leHBvcnQgY29uc3Qgd2luZG93U2Nyb2xsZWQgPSAnd2luZG93OnNjcm9sbGVkJ1xuZXhwb3J0IGNvbnN0IHdpbmRvd0xvYWRlZCA9ICd3aW5kb3c6bG9hZGVkJ1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgIGNhc2UgMjc6XG4gICAgICBFdmVudEJ1cy5wdWJsaXNoKGtleURvd25Fc2NhcGUpXG4gICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICBicmVhaztcbiAgfVxufSlcblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZGVib3VuY2UoKCkgPT4ge1xuICBFdmVudEJ1cy5wdWJsaXNoKHdpbmRvd1Jlc2l6ZWQpXG59LCAxMDApKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICBFdmVudEJ1cy5wdWJsaXNoKHdpbmRvd1Njcm9sbGVkKVxufSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gIEV2ZW50QnVzLnB1Ymxpc2god2luZG93TG9hZGVkKVxufSkiLCIvKipcbiAqXG4gKiBMb2FkXG4gKlxuICogUmVxdWlyZXMgdGhlIGZldGNoIEFQSSB0byBiZSBhdmFpbGFibGVcbiAqIFxuICovXG5cbi8qKlxuICpcbiAqIENhY2hlIG9mIHByb21pc2VzIG9mIHJlcXVlc3RlZCBvYmplY3RzXG4gKiBcbiAqL1xuXG5jb25zdCByZXF1ZXN0ZWRVUkxzID0ge307XG5cbi8qKlxuICpcbiAqIExvYWQgYSBzY3JpcHQgb25seSBvbmNlLCByZWdhcmRsZXNzIGlmIGl0cyByZXF1ZXN0ZWQgbXVsdGlwbGUgdGltZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNyYyAtIFNvdXJjZSBVUkxcbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBwcm9taXNlIG9iamVjdCBmb3IgdGhhdCBzcGVjaWZpYyBzb3VyY2VcbiAqICBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gbG9hZFNjcmlwdE9uY2Uoc3JjKSB7XG5cbiAgLy8gQ2hlY2sgaWYgd2UndmUgYWxyZWFkeSByZXF1ZXN0ZWQgdGhpcyBzY3JpcHRcbiAgaWYoc3JjIGluIHJlcXVlc3RlZFVSTHMpIHtcblxuICAgIC8vIElmIHNvLCByZXR1cm4gdGhpcyBzY3JpcHQncyBwcm9taXNlXG4gICAgcmV0dXJuIHJlcXVlc3RlZFVSTHNbc3JjXVxuICB9XG5cbiAgbGV0IHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuICBzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgcy5hc3luYyA9IHRydWU7XG4gIHMuc3JjID0gc3JjO1xuICBcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy8gUmVzb2x2ZSB0aGUgcHJvbWlzZSB3aGVuIHRoZSBzY3JpcHQgaGFzIGxvYWRlZC5cbiAgICBzLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgcmVzb2x2ZShlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH0pXG5cbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICBoZWFkLmFwcGVuZENoaWxkKHMpO1xuXG4gIC8vIFN0b3JlIHRoZSBwcm9taXNlLCBmb3IgbmV4dCB0aW1lIHRoaXMgYHNyY2AgaXMgcmVxdWVzdGVkXG4gIHJlcXVlc3RlZFVSTHNbc3JjXSA9IHByb21pc2U7XG5cbiAgLy8gUmV0dXJuIHRoZSBwcm9taXNlXG4gIHJldHVybiByZXF1ZXN0ZWRVUkxzW3NyY107XG5cbn1cblxuLyoqXG4gKlxuICogTG9hZCBhIFVSTCBvbmx5IG9uY2UsIHJlZ2FyZGxlc3MgaWYgaXRzIHJlcXVlc3RlZCBtdWx0aXBsZSB0aW1lcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gU291cmNlIFVSTFxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9IHByb21pc2Ugb2JqZWN0IGZvciB0aGF0IHNwZWNpZmljIHNvdXJjZVxuICogIFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkT25jZSh1cmwpIHtcblxuICAvLyBDaGVjayBpZiB3ZSd2ZSBhbHJlYWR5IHJlcXVlc3RlZCB0aGlzIHNjcmlwdFxuICBpZih1cmwgaW4gcmVxdWVzdGVkVVJMcykge1xuXG4gICAgLy8gSWYgc28sIHJldHVybiB0aGlzIHNjcmlwdCdzIHByb21pc2VcbiAgICByZXR1cm4gcmVxdWVzdGVkVVJMc1t1cmxdXG4gIH1cblxuICBsZXQgcHJvbWlzZSA9IGZldGNoKHVybClcbiAgICAvLyByZXMudGV4dCgpIGNhbiBvbmx5IGJlIGNhbGxlZCBvbmNlLFxuICAgIC8vIGl0IHJldHVybnMgYW5vdGhlciBwcm9taXNlXG4gICAgLnRoZW4ocmVzID0+IHtcbiAgICAgIHJldHVybiByZXMudGV4dCgpXG4gICAgfSlcblxuICAvLyBTdG9yZSB0aGUgcHJvbWlzZSwgZm9yIG5leHQgdGltZSB0aGlzIGB1cmxgIGlzIHJlcXVlc3RlZFxuICByZXF1ZXN0ZWRVUkxzW3VybF0gPSBwcm9taXNlO1xuXG4gIC8vIFJldHVybiB0aGUgcHJvbWlzZVxuICByZXR1cm4gcmVxdWVzdGVkVVJMc1t1cmxdO1xuXG59IiwiLyoqXG4gKlxuICogTW9kYWxcbiAqXG4gKiBUb2dnbGVhYmxlIG1vZGFsIHBhbmVsc1xuICpcbiAqL1xuXG5pbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9FdmVudEJ1cyc7XG5pbXBvcnQgY3JlYXRlVmlkZW9JZnJhbWUgZnJvbSAnLi92aWRlbyc7XG5pbXBvcnQgeyB3aGljaFRyYW5zaXRpb25FbmQsIHNlbGVjdG9yTWF0Y2hlcywgY29sbGVjdGlvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCByb290RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJyk7XG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnaXMtYWN0aXZlJztcbmNvbnN0IFRSQU5TX0NMQVNTICA9ICdpcy10cmFuc2l0aW5nJztcblxuLy8gQWRkIGEgZ2xvYmFsIGNsYXNzIHRvIHRoZSByb290IGVsZW1lbnQsIGZvciBzdHlsaW5nXG5yb290RWwuY2xhc3NOYW1lICs9ICcgbW9kYWwtcm9vdCc7XG5cbmNvbnN0IG1vZGFsUHJvdG8gPSB7XG5cbiAgaXNPcGVuOiBmYWxzZSxcblxuICAvKipcbiAgICpcbiAgICogT3BlbiB0aGUgbW9kYWxcbiAgICpcbiAgICogQHBhcmFtIHtvYmp9IGluc3RhbmNlIC0gTW9kYWwgaW5zdGFuY2UgY3JlYXRlZCB3aGVuIGNhbGxpbmcgYG1vZGFsKClgXG4gICAqXG4gICAqL1xuICBvcGVuKCkge1xuXG4gICAgY29uc3QgeyBlbHMgfSA9IHRoaXM7XG5cbiAgICBlbHMubWFwKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoQUNUSVZFX0NMQVNTLCBUUkFOU19DTEFTUykpXG5cbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgRXZlbnRCdXMucHVibGlzaCgnbW9kYWw6b3BlbicsIHRoaXMpXG4gIH0sXG5cbiAgLyoqXG4gICAqXG4gICAqIENsb3NlIHRoZSBtb2RhbFxuICAgKlxuICAgKiBAcGFyYW0ge29ian0gaW5zdGFuY2UgLSBNb2RhbCBpbnN0YW5jZSBjcmVhdGVkIHdoZW4gY2FsbGluZyBgbW9kYWwoKWBcbiAgICpcbiAgICovXG4gIGNsb3NlKCkge1xuICAgIFxuICAgIGNvbnN0IHsgZWxzIH0gPSB0aGlzO1xuXG4gICAgZWxzLm1hcChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKFRSQU5TX0NMQVNTKSlcbiAgICBlbHMubWFwKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoQUNUSVZFX0NMQVNTKSlcblxuICAgIGlmKCF3aGljaFRyYW5zaXRpb25FbmQoKSkge1xuICAgICAgZWxzLm1hcChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFRSQU5TX0NMQVNTKSlcbiAgICB9XG5cbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIEV2ZW50QnVzLnB1Ymxpc2goJ21vZGFsOmNsb3NlJywgdGhpcylcbiAgfSxcblxuICAvKipcbiAgICpcbiAgICogVG9nZ2xlIHRoZSBtb2RhbCBvcGVuL2Nsb3NlXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqfSBpbnN0YW5jZSAtIE1vZGFsIGluc3RhbmNlIGNyZWF0ZWQgd2hlbiBjYWxsaW5nIGBtb2RhbCgpYFxuICAgKlxuICAgKi9cbiAgdG9nZ2xlKCkge1xuXG4gICAgaWYodGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuXG4gIH1cbn1cblxuLyoqXG4gKlxuICogSW5zdGFudGlhdGUgdGhlIG1vZGFsLCBhZGRpbmcgY2xpY2sgbGlzdGVuZXJzIHRvIGl0J3MgdHJpZ2dlcnMsXG4gKiBhcyB3ZWxsIGFzIGNvbnRyb2xzIGZvciBjbG9zaW5nIGl0LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG1vZGFsRWwgLSBNb2RhbCBET00gZWxlbWVudFxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyAtIENvbmZpZ3VyYXRpb24gb2JqZWN0LCB3aXRoIGNhbGxiYWNrcyBmb3IgdGhlIG1vZGFscyBvcGVuL2Nsb3NlIGV2ZW50c1xuICogQHJldHVybnMge29iamVjdH0gaW5zdGFuY2UgLSBNb2RhbCBpbnN0YW5jZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0TW9kYWwobW9kYWxFbCwgY29uZmlnID0ge30pIHtcblxuICBpZighbW9kYWxFbCB8fCAhbW9kYWxFbC5ub2RlVHlwZSkge1xuICAgIGNvbnNvbGUubG9nKCdZb3UgbXVzdCBwcm92aWRlIGEgRE9NIGVsZW1lbnQgdG8gYGluaXRNb2RhbGAnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBGaW5kIHRoZSBlbGVtZW50cyB0aGF0IHRvZ2dsZXMgdGhpcyBtb2RhbFxuICBjb25zdCB0b2dnbGVFbHMgPSBjb2xsZWN0aW9uKCdbZGF0YS10b2dnbGUtbW9kYWw9XCIjJyArIG1vZGFsRWwuaWQgKyAnXCJdJyk7XG4gIGNvbnN0IGFsbEVscyA9IHRvZ2dsZUVscy5jb25jYXQobW9kYWxFbCwgcm9vdEVsKVxuICBjb25zdCBjbG9zZUVscyA9IGNvbGxlY3Rpb24obW9kYWxFbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jbG9zZS1tb2RhbF0nKSlcblxuICAvLyBDcmVhdGUgdGhlIG1vZGFsIGluc3RhbmNlIG9iamVjdFxuICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUobW9kYWxQcm90bylcblxuICBPYmplY3QuYXNzaWduKGluc3RhbmNlLCB7XG4gICAgbW9kYWxFbDogbW9kYWxFbCxcbiAgICBlbHM6IGFsbEVsc1xuICB9KVxuXG4gIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgb25PcGVuKCkge30sXG4gICAgb25DbG9zZSgpe31cbiAgfSwgY29uZmlnKVxuXG4gIC8vIExpc3RlbiBmb3IgdG9nZ2xlIGJ1dHRvbiBjbGlja3NcbiAgdG9nZ2xlRWxzLm1hcChlbCA9PiB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGluc3RhbmNlLnRvZ2dsZSgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBFc2MgS2V5ZG93blxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICBpZihlLmtleUNvZGUgPT0gMjcgJiYgaW5zdGFuY2UuaXNPcGVuKSB7XG4gICAgICBpbnN0YW5jZS5jbG9zZSgpXG4gICAgfSBcbiAgfSk7XG5cbiAgLy8gTGlzdGVuIGZvciBjbGljayB0byBhbnkgZWxlbWVudHMgdGhhdCBjbG9zZSB0aGUgbW9kYWxcbiAgaWYgKGNsb3NlRWxzLmxlbmd0aCkge1xuXG4gICAgY2xvc2VFbHMubWFwKGVsID0+IHtcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIGlmKHNlbGVjdG9yTWF0Y2hlcyhlLnRhcmdldCwgJ1tkYXRhLWNsb3NlLW1vZGFsXScpICYmIGluc3RhbmNlLmlzT3Blbikge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpbnN0YW5jZS5jbG9zZSgpICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgfVxuXG4gIC8vIExpc3RlbiBmb3IgdHJhbnNpdGlvbiBlbmQgdG8gcmVtb3ZlIHRyYW5zaXRpb24gY2xhc3NcbiAgbW9kYWxFbC5hZGRFdmVudExpc3RlbmVyKHdoaWNoVHJhbnNpdGlvbkVuZCgpLCBlID0+IHtcbiAgICBpZihlLnRhcmdldCA9PSBtb2RhbEVsKSB7XG4gICAgICBpbnN0YW5jZS5lbHMubWFwKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoVFJBTlNfQ0xBU1MpKVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gU3Vic2NyaWJlIHRoaXMgbW9kYWwgdG8gaXQncyBvcGVuL2Nsb3NlIGV2ZW50c1xuICBFdmVudEJ1cy5zdWJzY3JpYmUoJ21vZGFsOm9wZW4nLCBvcGVuZWRJbnN0YW5jZSA9PiB7XG4gICAgaWYoaW5zdGFuY2UgPT0gb3BlbmVkSW5zdGFuY2UpIHtcbiAgICAgIG9wdGlvbnMub25PcGVuKGluc3RhbmNlKVxuICAgIH1cbiAgfSlcblxuICBFdmVudEJ1cy5zdWJzY3JpYmUoJ21vZGFsOmNsb3NlJywgb3BlbmVkSW5zdGFuY2UgPT4ge1xuICAgIGlmKGluc3RhbmNlID09IG9wZW5lZEluc3RhbmNlKSB7XG4gICAgICBvcHRpb25zLm9uQ2xvc2UoaW5zdGFuY2UpXG4gICAgfVxuICB9KVxuXG4gIC8vIE1vdmUgdGhlIGVsZW1lbnQgdG8gdGhlIGVuZCBvZiB0aGUgZG9jdW1lbnQgKHByZXZlbnQgYW55IHotaW5kZXggaXNzdWVzKVxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsRWwpXG5cbiAgLy8gRXhwb3NlIHRoZSBtb2RhbCBpbnN0YW5jZSBjb250cm9sbGVyXG4gIHJldHVybiBpbnN0YW5jZTtcblxufVxuXG5cbi8qKlxuICpcbiAqIENyZWF0ZSBhIG1vZGFsIHdpdGggYSB2aWRlbyBwbGF5ZXIgaW5zaWRlXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbW9kYWxFbCAtIE1vZGFsIERPTSBlbGVtZW50XG4gKiBAcGFyYW0ge3N0cmluZ30gcGxheWVyU2VsZWN0b3IgLSBRdWVyeSBzZWxlY3RvciBmb3IgdGhlIHBsYXllciBpbnNpZGUgdGhlIG1vZGFsXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIC0gQ29uZmlndXJhdGlvbiBvYmplY3QsIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgdmlkZW8gbW9kYWwgYmVoYXZpb3VyXG4gKiBcbiAqIEByZXR1cm5zIHtvYmplY3R9IGluc3RhbmNlIC0gTW9kYWwgaW5zdGFuY2Ugd2l0aCBhbiBhdHRhY2hlZCB2aWRlbyBzZXJ2aWNlIGNvbnRyb2xsZXJcbiAqIFxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0VmlkZW9Nb2RhbChtb2RhbEVsLCBwbGF5ZXJTZWxlY3RvciwgY29uZmlnID0ge30pIHtcblxuICBpZighbW9kYWxFbCB8fCAhbW9kYWxFbC5ub2RlVHlwZSkge1xuICAgIGNvbnNvbGUubG9nKCdZb3UgbXVzdCBwcm92aWRlIGEgRE9NIGVsZW1lbnQgdG8gYGluaXRWaWRlb01vZGFsYCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHBsYXllckVsID0gbW9kYWxFbC5xdWVyeVNlbGVjdG9yKHBsYXllclNlbGVjdG9yKTtcbiAgY29uc3Qgc2VydmljZSA9IGNyZWF0ZVZpZGVvSWZyYW1lKHBsYXllckVsKTtcblxuICAvLyBCeSBkZWZhdWx0LCBtYWtlIHRoZSBwbGF5ZXIgcGxheSB3aGVuIHRoZSBtb2RhbCBvcGVuc1xuICAvLyBBbmQgc3RvcCB3aGVuIGl0IGNsb3Nlc1xuICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgIG9uT3BlbigpIHtcbiAgICAgIHNlcnZpY2UucGxheSgpO1xuICAgIH0sXG4gICAgb25DbG9zZSgpe1xuICAgICAgc2VydmljZS5zdG9wKCk7XG4gICAgfVxuICB9LCBjb25maWcpXG4gIFxuICBjb25zdCBpbnN0YW5jZSA9IGluaXRNb2RhbChtb2RhbEVsLCBvcHRpb25zKVxuICBpbnN0YW5jZS5zZXJ2aWNlID0gc2VydmljZSAvLyBBc3NpZ24gdGhlIHZpZGVvIHNlcnZpY2UgdG8gdGhlIG1vZGFsIGluc3RhbmNlXG5cbiAgLy8gRXhwb3NlIHRoZSBtb2RhbCBpbnN0YW5jZSBjb250cm9sbGVyXG4gIHJldHVybiBpbnN0YW5jZTtcbn0iLCIvKipcbiAqXG4gKiBDdXN0b20gTW9kZXJuaXpyIFRlc3RzXG4gKlxuICovXG5cbmltcG9ydCB7IGlzTW9iaWxlIH0gZnJvbSAnLi91dGlscydcblxuZnVuY3Rpb24gbWF0Y2hlc0lFKCkge1xuICByZXR1cm4gISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oPzptc3xcXCgpKGllKVxccyhbXFx3XFwuXSspL2kpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzSUUxMSgpIHtcbiAgcmV0dXJuICEhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKHRyaWRlbnQpLitydls6XFxzXShbXFx3XFwuXSspLitsaWtlXFxzZ2Vja28vaSk7XG59XG5cbk1vZGVybml6ci5hZGRUZXN0KCdpZScsICgpID0+IHtcbiAgcmV0dXJuIG1hdGNoZXNJRTExKCkgfHwgbWF0Y2hlc0lFKClcbn0pXG5cbk1vZGVybml6ci5hZGRUZXN0KCdpZTExJywgbWF0Y2hlc0lFMTEpXG5cbk1vZGVybml6ci5hZGRUZXN0KCdtb2JpbGUnLCBpc01vYmlsZSkiLCIvKipcbiAqXG4gKiBQb2x5ZmlsbHNcbiAqXG4gKiBJbmNsdWRpbmcgdGhpcyBtb2R1bGUgd2lsbCBhdXRvbWF0aWNhbGx5IGNhbGwgYWxsIHNwZWNpZmllZCBwb2x5ZmlsbHNcbiAqIFxuICovXG5cblxuaW1wb3J0ICdpbnB1dC1wbGFjZWhvbGRlci1wb2x5ZmlsbCc7IC8vIFJlcXVpcmVkIGZvciBvbGRlciBJRVxuaW1wb3J0IHZ1QnVnZ3lmaWxsIGZyb20gJ3ZpZXdwb3J0LXVuaXRzLWJ1Z2d5ZmlsbCcgLy8gUmVxdWlyZWQgZm9yIElPUyBkZXZpY2VzXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdwcm9taXNlLXBvbHlmaWxsJzsgLy8gUmVxdWlyZWQgZm9yIElFXG5pbXBvcnQgJ3doYXR3Zy1mZXRjaCcgLy8gUmVxdWlyZWQgZm9yIElFICYgU2FmYXJpXG5pbXBvcnQgb2JqZWN0QXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nIC8vIFJlcXVpcmVkIGZvciBJRVxuXG4vLyBBc3NpZ24gdG8gdGhlIE9iamVjdCBjb25zdHJ1Y3RvclxuaWYoIU9iamVjdC5hc3NpZ24pIHtcbiAgT2JqZWN0LmFzc2lnbiA9IG9iamVjdEFzc2lnblxufVxuXG4vLyBBc3NpZ24gUHJvbWlzZSB0byB3aW5kb3csIGlmIG5vdCBkZWZpbmVkXG5pZiAoIXdpbmRvdy5Qcm9taXNlKSB7XG4gIHdpbmRvdy5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuLy8gUGF0Y2ggQnVnZ3kgVmlld3BvcnQgdW5pdHMgb24gSU9TIGRldmljZXNcbnZ1QnVnZ3lmaWxsLmluaXQoKVxuXG4vKipcbiAqXG4gKiBEYXRhc2V0IFBvbHlmaWxsXG4gKlxuICogRWxlbWVudC5kYXRhc2V0IHBvbHlmaWxsIGZvciBJRTEwLVxuICpcbiAqL1xuXG5mdW5jdGlvbiBkYXRhc2V0KCkge1xuXG4gIGlmICghKCdkYXRhc2V0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykpICYmXG4gICAgICAnRWxlbWVudCcgaW4gZ2xvYmFsICYmIEVsZW1lbnQucHJvdG90eXBlICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgJ2RhdGFzZXQnLCB7IGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmF0dHJpYnV0ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgbGV0IGF0dHIgPSB0aGlzLmF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGlmIChhdHRyLnNwZWNpZmllZCAmJiBhdHRyLm5hbWUuc3Vic3RyaW5nKDAsIDUpID09PSAnZGF0YS0nKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uKGVsZW1lbnQsIG5hbWUpIHtcbiAgICAgICAgICAgIGxldCBwcm9wID0gbmFtZS5yZXBsYWNlKC8tKFthLXpdKS9nLCBmdW5jdGlvbihtLCBwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3VsdFtwcm9wXSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLScgKyBuYW1lKTsgLy8gUmVhZC1vbmx5LCBmb3IgSUU4LVxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgcHJvcCwge1xuICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS0nICsgbmFtZSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS0nICsgbmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgfSh0aGlzLCBhdHRyLm5hbWUuc3Vic3RyaW5nKDUpKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfX0pO1xuICB9XG5cbn1cblxuLy8gQWRkIGNyb3NzIGJyb3dzZXIgc3VwcG9ydCBmb3IgZGF0YXNldFxuZGF0YXNldCgpXG5cbiIsIi8qKlxuICpcbiAqIERPTSBiYXNlZCByb3V0ZXJcbiAqXG4gKiBGaXJlcyB3aGVuIGNsYXNzIG9uIGVsZW1lbnQsIG1hdGNoZXMgdGhlIG5hbWUgb2YgYW55IG1ldGhvZC5cbiAqIFJvdXRlciBhbHNvIGFkZHMgYSAnY29tbW9uJyBjYWxsIGZvciBKUyB0aGF0IGZpcmVzIG9uIGFueSBwYWdlLlxuICogXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgbmFtZXNwYWNlOyAgXG5sZXQgZmlyZSA9IChmdW5jKSA9PiB7XG4gIGlmIChmdW5jICE9PSAnJyAmJiBuYW1lc3BhY2VbZnVuY10gJiYgdHlwZW9mIG5hbWVzcGFjZVtmdW5jXSA9PSAnZnVuY3Rpb24nKXtcbiAgICBuYW1lc3BhY2VbZnVuY10oKTtcbiAgfVxufVxuXG5sZXQgbG9hZEV2ZW50cyA9ICgpID0+IHtcblxuICAvLyBoaXQgdXAgY29tbW9uIGZpcnN0LlxuICBmaXJlKCdjb21tb24nKTtcblxuICAvLyBkbyBhbGwgdGhlIGNsYXNzZXMgdG9vLlxuICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZVxuICAgIC5yZXBsYWNlKC8tL2csICdfJylcbiAgICAuc3BsaXQoL1xccysvKVxuICAgIC5mb3JFYWNoKChjbGFzc25tKSA9PiB7XG4gICAgICBmaXJlKGNsYXNzbm0pO1xuICAgIH0pO1xuXG59XG5cbmNvbnN0IHJvdXRlciA9IGZ1bmN0aW9uKHJvdXRlcyl7XG4gIG5hbWVzcGFjZSA9IHJvdXRlcztcbiAgbG9hZEV2ZW50cygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xuXG4iLCIvKipcbiAqXG4gKiBTaGFyZSBQb3N0XG4gKlxuICogSlMgdG8gaGFuZGxlIFNoYXJlIFBvc3QgbGlua3MuXG4gKiBPcGVucyB0aGUgbGluayBpbiBhIGJsYW5rIHdpbmRvd1xuICpcbiAqL1xuXG5pbXBvcnQgeyBpc0lPU29yQW5kcm9pZCwgZGVsZWdhdGUgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gdHdlZXRJbkFwcChocmVmKSB7XG5cbiAgbGV0IHR3ZWV0ID0gaHJlZlxuICAgIC5zcGxpdCgnPycpWzFdIC8vIGdldCBhbGwgdXJsIHBhcmFtZXRlcnNcbiAgICAuc3BsaXQoJyYnKSAvLyBzZXBhcmF0ZSBrZXlzIGFuZCB2YWx1ZXNcbiAgICAubWFwKHBhciA9PiB7IHJldHVybiBwYXIuc3BsaXQoJz0nKVsxXSB9KSAvLyBnZXQganVzdCB0aGUgdmFsdWVzXG4gICAgLmZpbHRlcihwYXJzQXJyID0+IHBhcnNBcnIubGVuZ3RoKSAvLyBmaWx0ZXIgZW1wdHkgcGFyYW10ZXJzXG4gICAgLmpvaW4oJyAnKSAvLyBjb25jYXRlbmF0ZSBpbnRvIHNpbmdsZSBzdHJpbmdcblxuICB3aW5kb3cubG9jYXRpb24gPSAndHdpdHRlcjovL3Bvc3Q/bWVzc2FnZT0nICsgdHdlZXRcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGFyZVBvc3Qoc2VsZWN0b3IpIHtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlbGVnYXRlKHNlbGVjdG9yLCBlID0+IHtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgaHJlZiA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGxldCB3aWR0aCA9IDQwMDtcbiAgICBsZXQgaGVpZ2h0ID0gNTAwO1xuICAgIGxldCBsZWZ0ID0gKHdpbmRvdy5pbm5lcldpZHRoLzIpIC0gd2lkdGgvMjtcbiAgICBsZXQgdG9wID0gKHdpbmRvdy5pbm5lckhlaWdodC8yKSAtIGhlaWdodC8yO1xuICAgIGxldCBjb25maWcgPSAnc3RhdHVzID0gbm8saGVpZ2h0ID0gJyArIHdpZHRoICsgJyx3aWR0aCAgPSAnICsgaGVpZ2h0ICsgJyxyZXNpemFibGUgPSB5ZXMsdG9wICA9ICcgKyB0b3AgKyAnLGxlZnQgPSAnICsgbGVmdCArICcsdG9vbGJhciA9IG5vLG1lbnViYXIgPSBubyxzY3JvbGxiYXJzID0gbm8sbG9jYXRpb24gPSBubyxkaXJlY3RvcmllcyA9IG5vJztcblxuICAgIC8vIFR3ZWV0IGluIGFwcFxuICAgIGlmKGhyZWYuaW5kZXhPZigndHdpdHRlcicpID4gLTEgJiYgaXNJT1NvckFuZHJvaWQoKSkge1xuICAgICAgLy8gQXR0ZW1wdCB0byBvcGVuIHRoZSBzaGFyZSBpbiB0aGUgdGhlIFR3aXR0ZXIgYXBwXG4gICAgICAvLyBJZiBpdCBmYWlscywgdGhlbiBqdXN0IHJlZGlyZWN0IHRoZSB1c2VyIHRvIHRoZSBwYWdlXG4gICAgICBzZXRUaW1lb3V0KHR3ZWV0SW5BcHAuYmluZChocmVmKSwgMjUpXG4gICAgICAvLyBUaGlzIHNob3VsZG4ndCBydW4gaWYgJ3R3ZWV0SW5BcHAnIGlzIHN1Y2Nlc3NmdWxcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGhyZWZcblxuICAgIC8vIE9yIGp1c3Qgb3BlbiB0aGUgc2hhcmUgaW4gYSBuZXcgd2luZG93XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5vcGVuKGhyZWYsJycsY29uZmlnKTtcbiAgICB9XG5cbiAgfSkpXG5cbn0iLCIvKiogXG4qXG4qIFRvZ2dsZVxuKiBcbiogVG9nZ2xlcyB0YXJnZXQgZWxlbWVudCBhY3RpdmUgY2xhc3NcbipcbiogVXNhZ2U6XG4qXG4qIDxidXR0b24gY2xhc3M9XCJ7c2VsZWN0b3J9XCIgZGF0YS10YXJnZXQ9XCIjdG9nZ2xlLXRhcmdldFwiIGRhdGEtdG9nZ2xlPlRvZ2dsZTwvYnV0dG9uPlxuKiA8ZGl2IGlkPVwidG9nZ2xlLXRhcmdldFwiPlRvZ2dsZSBUYXJnZXQ8L2Rpdj5cbiogXG4qL1xuXG5pbXBvcnQgRXZlbnRCdXMgZnJvbSAnLi9FdmVudEJ1cydcbmltcG9ydCB7IGNvbGxlY3Rpb24sIGRlbGVnYXRlIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgQUNUSVZFX0NMQVNTID0gJ2lzLWFjdGl2ZSdcblxuLyoqXG4gKlxuICogR2V0IGFsbCBlbGVtZW50cyByZWxhdGVkIHRvIHBhcnRpY3VsYXIgdG9nZ2xlIGVsZW1lbnRcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGVsZW1lbnRzIC0gRWxlbWVudHMgb2JqZWN0XG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gZWxlbWVudHMuY2xpY2tlZFRvZ2dsZSAtIEN1cnJlbnQgdG9nZ2xlIGVsZW1lbnRcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBlbGVtZW50cy50YXJnZXQgLSBUaGUgdGFyZ2V0IG9mIHRoZSBjdXJyZW50IHRvZ2dsZSBlbGVtZW50XG4gKiBAcmV0dXJuIHtBcnJheX0gZWxlbWVudHMudGFyZ2V0QW5kVG9nZ2xlcyAtIEFuIGFycmF5IG9mIGFsbCB0b2dnbGUgZWxlbWVudHMgZm9yIGEgcGFydGljdWxhciB0YXJnZXQsXG4gKiBjb25jYXRlbmF0ZWQgd2l0aCBzYWlkIHRhcmdldFxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IGVsZW1lbnRzLmdyb3VwIC0gVGhlIGdyb3VwIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGlzIGFuZCBwb3NzaWJseSBvdGhlciB0b2dnbGUgdGFyZ2V0cyB3aXRoIGRpZmZlcmVudCBcbiAqIHRvZ2dsZSBlbGVtZW50cywgZm9yIGNvbGxhcHNpbmcgYW55IHJlbGF0ZWQgc2libGluZ3Mgd2l0aGluIHRoZSBzYW1lIGdyb3VwXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBnZXRFbGVtZW50cyhlbCkge1xuXG4gIGNvbnN0IGRhdGFUYXJnZXQgPSBlbC5kYXRhc2V0LnRhcmdldFxuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGRhdGFUYXJnZXQpXG4gIGNvbnN0IHRhcmdldFRvZ2dsZXMgPSBjb2xsZWN0aW9uKCdbZGF0YS10YXJnZXQ9XCInICsgZGF0YVRhcmdldCArICdcIl0nKVxuICBcbiAgcmV0dXJuIHtcbiAgICBjbGlja2VkVG9nZ2xlOiBlbCxcbiAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICB0YXJnZXRBbmRUb2dnbGVzOiB0YXJnZXRUb2dnbGVzLmNvbmNhdCh0YXJnZXQpLFxuICAgIGdyb3VwOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsLmRhdGFzZXQuZ3JvdXApXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGFjdGl2ZSBjbGFzcyBmcm9tIGFueSBvdGhlciB0YXJnZXQgJiB0b2dnbGVzIHdpdGhpbiB0aGUgc2FtZSBncm91cCwgZXhjbHVkaW5nIGEgY3VycmVudCB0YXJnZXRcbiAqIFxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGdyb3VwIC0gVGhlIGdyb3VwIGVsZW1lbnRcbiAqIEBwYXJhbSAge1N0cmluZ30gc2VsZWN0b3IgLSBUaGUgdG9nZ2xlIHNlbGVjdG9yIGZvciB0aGUgY3VycmVudCB0b2dnbGVUYXJnZXQgaW5zdGFuY2VcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBjdXJyZW50RWxlbWVudCAtIEN1cnJlbnRseSBhY3RpdmUgdG9nZ2xlLCBhbnkgZWxlbWVudHMgdGhhdCBjb250YWluIHRoZSBzYW1lIFtkYXRhLXRhcmdldF1cbiAqIGF0dHJpYnV0ZSB2YWx1ZSBhcyB0aGlzIGVsZW1lbnQsIHdpbGwgYmUgZmlsdGVyZWQgb3V0IGZyb20gdGhpcyBmdW5jdGlvblxuICogXG4gKiBAcmV0dXJuIHtudWxsfSBcbiAqL1xuZnVuY3Rpb24gaGlkZU90aGVycyhncm91cCwgc2VsZWN0b3IsIGN1cnJlbnRFbGVtZW50KSB7XG5cbiAgY29sbGVjdGlvbihncm91cC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcbiAgICAuZmlsdGVyKGVsID0+IGVsLmRhdGFzZXQudGFyZ2V0ICE9PSBjdXJyZW50RWxlbWVudC5kYXRhc2V0LnRhcmdldClcbiAgICAubWFwKGVsID0+IHtcblxuICAgICAgZ2V0RWxlbWVudHMoZWwpXG4gICAgICAgIC50YXJnZXRBbmRUb2dnbGVzXG4gICAgICAgIC5tYXAoZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShBQ1RJVkVfQ0xBU1MpKVxuXG4gICAgfSlcblxufVxuXG5cbi8qKlxuICpcbiAqIEluaXRpYWxpemUgdGhlIHRvZ2dsZSBUYXJnZXQgZm9yIGEgZ2l2ZW4gc2VsZWN0b3JcbiAqXG4gKiAtIFRoZSBzZWxlY3RvciByZXByZXNlbnRzIHRoZSB0b2dnbGUgZWxlbWVudCwgdXNlZCB0byBoaWRlIG9yIHNob3cgYSBjZXJ0YWluIHRhcmdldFxuICogLSBUaGUgdG9nZ2xlIGVsZW1lbnQgbXVzdCBoYXZlIGEgYGRhdGEtdGFyZ2V0YCBhdHRyaWJ1dGUsIHJlZmVyZW5jaW5nIGEgdW5pcXVlIGVsZW1lbnQgb24gdGhlIHBhZ2UgdG8gYmUgdG9nZ2xlZFxuICogTWFrZSBzdXJlIHRvIHVzZSBhbiBJRCBmb3IgdGhlIHRhcmdldFxuICogLSBUaGUgdG9nZ2xlIGVsZW1lbnQgY2FuIGhhdmUgYW4gb3B0aW9uYWwgYGRhdGEtdG9nZ2xlYCBhdHRyaWJ1dGUsIHdoaWNoIHdpbGwgbWFrZSB0aGUgYnV0dG9uIHRvZ2dsZSB0aGUgdGFyZ2V0IE9OL09GRlxuICogSWYgdGhlIGF0dHJpYnV0ZSBpcyBub3QgZGVmaW5lZCwgdGhlIGJ1dHRvbiB3aWxsIG9ubHkgdG9nZ2xlIGl0J3MgdGFyZ2V0IE9OLlxuICogLSBUaGUgdG9nZ2xlIGVsZW1lbnQgY2FuIGhhdmUgYW4gb3B0aW9ucyBgZGF0YS1ncm91cGAgYXR0cmlidXRlLCB3aGljaCB3b3VsZCBjb250YWluIHRoZSBzZWxlY3RvciBvZiB0aGUgcGFyZW50IGdyb3VwIGVsZW1lbnQuXG4gKiBlZzogZGF0YS1ncm91cD1cIiNwYXJlbnQtZWxlbWVudFwiLiBUaGUgZ3JvdXAgYWxsb3dzIGZvciBzaWJsaW5ncyB0byBiZSB0b2dnbGVkIG9mZiwgd2hlbiB0b2dnbGluZyBhbnkgaXRlbSBpbiB0aGUgZ3JvdXAgb24uXG4gKiBcbiAqIEBwYXJhbSAge1N0cmluZ30gc2VsZWN0b3IgLSBzZWxlY3RvciBmb3IgdGhlIHRvZ2dsZSBlbGVtZW50XG4gKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZyAtIENvbmZpZ3VyYXRpb24gT2JqZWN0XG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY29uZmlnLm9uVG9nZ2xlQ2xvc2UgLSBGaXJlcyB3aGVuIHRoZSB0b2dnbGUgZ2V0cyBjbG9zZWQsIGdldHMgcGFzc2VkIGFuIG9iamVjdFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5pbmcgdGhlIGN1cnJlbnQgdG9nZ2xlIGVsZW1lbnRzXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gY29uZmlnLm9uVG9nZ2xlT3BlbiAtIEZpcmVzIHdoZW4gdGhlIHRvZ2dsZSBnZXRzIG9wZW5lZCwgZ2V0cyBwYXNzZWQgYW4gb2JqZWN0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmluZyB0aGUgY3VycmVudCB0b2dnbGUgZWxlbWVudHMgXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRvZ2dsZSBDb250cm9sbGVyIG9iamVjdFxuICogXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9nZ2xlVGFyZ2V0KHNlbGVjdG9yLCBjb25maWcgPSB7fSkge1xuXG4gIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgb25Ub2dnbGVPcGVuKCkge30sXG4gICAgb25Ub2dnbGVDbG9zZSgpIHt9LFxuICB9LCBjb25maWcpXG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxlZ2F0ZShzZWxlY3RvciwgZSA9PiB7XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBlbHMgPSBnZXRFbGVtZW50cyhlLnRhcmdldClcbiAgICBjb25zdCB7IHRhcmdldCwgdGFyZ2V0QW5kVG9nZ2xlcywgZ3JvdXAgfSA9IGVsc1xuICAgIGNvbnN0IHNob3VsZFRvZ2dsZSA9IGUudGFyZ2V0LmRhdGFzZXQudG9nZ2xlID09ICd0cnVlJ1xuXG4gICAgaWYodGFyZ2V0KSB7XG5cbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhBQ1RJVkVfQ0xBU1MpXG5cbiAgICAgIGlmKHNob3VsZFRvZ2dsZSAmJiBpc0FjdGl2ZSkge1xuXG4gICAgICAgIHRhcmdldEFuZFRvZ2dsZXMubWFwKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoQUNUSVZFX0NMQVNTKSlcbiAgICAgICAgb3B0aW9ucy5vblRvZ2dsZUNsb3NlKGVscylcbiAgICAgICAgRXZlbnRCdXMucHVibGlzaCgndG9nZ2xlLXRhcmdldDpjbG9zZScsIGVscylcblxuICAgICAgfSBcblxuICAgICAgaWYoIWlzQWN0aXZlKSB7XG5cbiAgICAgICAgdGFyZ2V0QW5kVG9nZ2xlcy5tYXAoZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChBQ1RJVkVfQ0xBU1MpKVxuICAgICAgICBvcHRpb25zLm9uVG9nZ2xlT3BlbihlbHMpXG4gICAgICAgIEV2ZW50QnVzLnB1Ymxpc2goJ3RvZ2dsZS10YXJnZXQ6b3BlbicsIGVscylcblxuICAgICAgfVxuXG4gICAgICBpZihncm91cCkge1xuICAgICAgICBoaWRlT3RoZXJzKGdyb3VwLCBzZWxlY3RvciwgZS50YXJnZXQpXG4gICAgICB9XG5cbiAgICB9XG5cbiAgfSkpXG5cbiAgY29uc3QgYWxsVGFyZ2V0QW5kVG9nZ2xlcyA9IGNvbGxlY3Rpb24oc2VsZWN0b3IpXG4gICAgLm1hcChlbCA9PiBnZXRFbGVtZW50cyhlbCkudGFyZ2V0QW5kVG9nZ2xlcylcblxuXG4gIC8vIENvbnRyb2xsZXIgT2JqZWN0XG4gIHJldHVybiB7XG5cbiAgICBhY3RpdmVDbGFzczogQUNUSVZFX0NMQVNTLFxuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCBlbGVtZW50cyBmb3IgdGhpcyB0YWJzIGludGFuY2VcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2FycmF5fSBBcnJheSBvZiBvYmplY3RzLCBjb250YWluaW5nIGFsbCB0aGUgZWxlbWVudHMgcmVsYXRlZCB0byB0aGlzIHRhYiBpbnN0YW5jZVxuICAgICAqL1xuICAgIGdldEVsZW1lbnRzKCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb24oc2VsZWN0b3IpXG4gICAgICAgIC5tYXAoZWwgPT4gZ2V0RWxlbWVudHMoZWwpKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgdGFicywgc2V0dGluZyB0aGUgZmlyc3QgdGFyZ2V0IGluIGVhY2ggZ3JvdXAgYXMgYWN0aXZlXG4gICAgICogXG4gICAgICogQHJldHVybiB7bnVsbH1cbiAgICAgKi9cbiAgICByZXNldCgpIHtcblxuICAgICAgY29uc3QgZ3JvdXBzID0gW11cblxuICAgICAgY29sbGVjdGlvbihzZWxlY3RvcilcbiAgICAgICAgLm1hcChlbCA9PiBnZXRFbGVtZW50cyhlbCkpXG4gICAgICAgIC5maWx0ZXIoZWxzID0+IGVscy5ncm91cClcbiAgICAgICAgLm1hcChlbHMgPT4gZWxzLmdyb3VwKVxuICAgICAgICAubWFwKGdyb3VwID0+IHtcbiAgICAgICAgICBpZihncm91cHMuaW5kZXhPZihncm91cCkgPT0gLTEpIHtcbiAgICAgICAgICAgIGdyb3Vwcy5wdXNoKGdyb3VwKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgZ3JvdXBzLm1hcChncm91cCA9PiB7XG4gICAgICAgIGNvbnN0IGZpcnN0VG9nZ2xlID0gZ3JvdXAucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcblxuICAgICAgICBpZihmaXJzdFRvZ2dsZSkge1xuICAgICAgICAgIGZpcnN0VG9nZ2xlLmNsaWNrKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIGZyb20gYWxsIHRvZ2dsZXMgaW4gdGhlIGluc3RhbmNlXG4gICAgICogXG4gICAgICogQHJldHVybiB7bnVsbH1cbiAgICAgKi9cbiAgICBjbG9zZUFsbCgpIHtcbiAgICAgIGFsbFRhcmdldEFuZFRvZ2dsZXMubWFwKGVscyA9PiB7XG4gICAgICAgIGVscy5tYXAoZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShBQ1RJVkVfQ0xBU1MpKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxufSIsIi8qKlxuICpcbiAqIFV0aWxpdHkgZnVuY3Rpb25zXG4gKlxuICogS2VlcCB0aGVzZSBmdW5jdGlvbnMgYXMgcHVyZSBhcyBwb3NzaWJsZSAoaWU6IGlucHV0IC0+IG91dHB1dCApLlxuICogWW91IGNhbiB1c2UgZ2xvYmFsbHkgYXZhaWxhYmxlIHZhcmlhYmxlcyBzdWNoIGFzIHdpbmRvdyBhbmQgZG9jdW1lbnQuXG4gKlxuICovXG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICpcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaW5BcnJheShpdGVtLCBhcnJheSkge1xuICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKSA+IC0xXG59XG5cbi8qKlxuICpcbiAqIENyZWF0ZSBhIG5ldyBET00gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWduYW1lIC0gRWxlbWVudCB0YWduYW1lICgnaWZyYW1lJywgJ2RpdicpXG4gKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlcyAtIE9iamVjdCBvZiBhdHRyaWJ1dGVzIHRvIGJlIGFzc2lnbmVkIHRvIHRoZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IFRoZSBET00gZWxlbWVudFxuICpcbiAqL1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZ25hbWUsIGF0dHJpYnV0ZXMgPSB7fSkge1xuICBsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ25hbWUpXG5cbiAgaWYoZWwuc2V0QXR0cmlidXRlKSB7XG4gICAgZm9yICh2YXIgayBpbiAgYXR0cmlidXRlcykge1xuICAgICAgaWYgKGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGssIGF0dHJpYnV0ZXNba10pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsXG59XG5cblxuLyoqXG4gKlxuICogRWxlbWVudC5tYXRjaGVzIHBvbHlmaWxsXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBET00gZWxlbWVudCB0byBjaGVjayBzZWxlY3RvciBhZ2FpbnN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBTZWxlY3RvciBzdHJpbmcgdG8gdXNlIGZvciBtYXRjaGluZ1xuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBzZWxlY3RvciBtYXRjaGVzIG9yIG5vdC5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0b3JNYXRjaGVzKGVsLCBzZWxlY3Rvcikge1xuICBsZXQgcCA9IEVsZW1lbnQucHJvdG90eXBlXG4gIGxldCBmbiA9IHAubWF0Y2hlcyB8fCBwLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBwLm1vek1hdGNoZXNTZWxlY3RvciB8fCBwLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gW10uaW5kZXhPZi5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocyksIHRoaXMpICE9PSAtMVxuICB9XG4gIHJldHVybiBmbi5jYWxsKGVsLCBzZWxlY3Rvcilcbn1cblxuLyoqXG4gKlxuICogUmV0dXJuIHRoZSBmaXJzdCBtYXRjaGVkIGVsZW1lbnQgYnkgcHJvdmlkZWQgc2VsZWN0b3IsIHRyYXZlcnNpbmcgZnJvbSBjdXJyZW50IGVsZW1lbnQgdG8gZG9jdW1lbnQuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBFbGVtZW50IHRvIGZpbmQgY2xvc2VzdCBlbGVtZW50IHRvIFxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gU2VsZWN0b3IgdG8gdXNlIGZvciBtYXRjaGluZ1xuICpcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fG51bGx9IC0gVGhlIG1hdGNoaW5nIGNsb3Nlc3QgZWxlbWVudCBvciBudWxsXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBjbG9zZXN0KGVsLCBzZWxlY3Rvcikge1xuXG4gIHdoaWxlIChlbCkge1xuICAgIGlmIChzZWxlY3Rvck1hdGNoZXMoZWwsIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGVsO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqXG4gKiAgVGh1bmsgZnVuY3Rpb24gZm9yIGV2ZW50IGRlbGVnYXRpb24gdXNpbmcgYGFkZEV2ZW50TGlzdGVuZXJgXG4gKlxuICogIFVzYWdlOlxuICpcbiAqICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZGVsZWdhdGUoc2VsZWN0b3IsIGUgPT4ge1xuICogIFxuICogICAgLy8geW91ciBjYWxsYmFja1xuICpcbiAqICB9KSlcbiAqXG4gKiAgQHBhcmFtIHtzdHJpbmd9IGRlbGVnYXRlIC0gU2VsZWN0b3Igc3RyaW5nIHRvIHVzZSBmb3IgZGVsZWdhdGlvblxuICogIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBFdmVudCBoYW5kbGVyIGZ1bmN0aW9uXG4gKlxuICogIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gKiBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGhhbmRsZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcblxuICAgIGNvbnN0IGNsb3Nlc3RFbCA9IGNsb3Nlc3QoZS50YXJnZXQsIHNlbGVjdG9yKVxuXG4gICAgaWYoY2xvc2VzdEVsKSB7XG4gICAgICBoYW5kbGVyLmNhbGwoY2xvc2VzdEVsLCBlKVxuICAgIH1cblxuICB9XG59XG5cbi8qKlxuICogICBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gKiAgIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAqICAgTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gKiAgIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICBsZXQgdGltZW91dFxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzXG4gICAgbGV0IGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgICB9XG5cbiAgICBsZXQgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dFxuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KVxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KVxuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gIH1cbn1cblxuXG5cbi8qKlxuICpcbiAqIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIHRyYW5zaXRpb25lbmQgZXZlbnQuXG4gKiBcbiAqIEByZXR1cm5zIHtzdHJpbmd8ZmFsc2V9IFRoZSBwcmVmaXhlZCAob3IgdW5wcmVmaXhlZCkgc3VwcG9ydGVkIGV2ZW50IG5hbWUgXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICBvciBmYWxzZSBpZiBpdCBkb2Vzbid0IHN1cHBvcnQgYW55LlxuICpcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gd2hpY2hUcmFuc2l0aW9uRW5kKCkge1xuXG4gIGxldCB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgV2Via2l0VHJhbnNpdGlvbiA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICBNb3pUcmFuc2l0aW9uICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgIE9UcmFuc2l0aW9uICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgIHRyYW5zaXRpb24gICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgfVxuXG4gIGZvciAobGV0IG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgaWYgKGRvY3VtZW50LmJvZHkuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqXG4gKiBDb3ZlcnQgT2JqZWN0IGludG8gVVJMIHBhcmFtZXRlcnNcbiAqXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZU9iamVjdChvYmopIHtcblxuICBsZXQgc3RyID0gJydcblxuICBmb3IgKGxldCBrIGluIG9iaikge1xuICAgIGlmIChzdHIgIT0gJycpIHtcbiAgICAgIHN0ciArPSAnJidcbiAgICB9XG5cbiAgICBzdHIgKz0gayArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChvYmpba10pO1xuICB9XG5cbiAgcmV0dXJuIHN0clxufVxuXG4vKipcbiAqXG4gKiBDb252ZXJ0IFVSTCBwYXJhbWV0ZXJzIHRvIG9iamVjdFxuICpcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFVSTFBhcmFtZXRlcnMoc3RyKSB7XG5cbiAgbGV0IG9iaiA9IHt9XG5cbiAgaWYoZG9jdW1lbnQubG9jYXRpb24uc2VhcmNoKSB7XG4gICAgZG9jdW1lbnQubG9jYXRpb24uc2VhcmNoXG4gICAgICAucmVwbGFjZSgvKF5cXD8pLywnJylcbiAgICAgIC5zcGxpdCgnJicpXG4gICAgICAubWFwKG4gPT4ge1xuICAgICAgICBjb25zdCBwYXIgPSBuLnNwbGl0KCc9JylcbiAgICAgICAgb2JqW3BhclswXV0gPSBwYXJbMV1cbiAgICAgIH0pXG4gIH1cblxuICByZXR1cm4gb2JqXG59XG5cbi8qKlxuICpcbiAqIFVzZXIgYWdlbnQgbWF0Y2hpbmcgZm9yIElPUyBvciBBbmRyb2lkIGRldmljZXNcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgdGhlIFVBIG1hdGNoZXMgZm9yIElPUyBvciBBbmRyb2lkXG4gKiBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJT1NvckFuZHJvaWQoKSB7XG4gIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkfGlQaG9uZXxpUG9kfEFuZHJvaWQvaSlcbn1cblxuLyoqXG4gKlxuICogVXNlciBhZ2VudCBtYXRjaGluZyBmb3IgbW9iaWxlIGRldmljZXNcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgdGhlIFVBIG1hdGNoZXMgZm9yIGEgbW9iaWxlIGRldmljZVxuICogXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9iaWxlKCkge1xuICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pKVxufVxuXG5cbi8qKlxuICpcbiAqIEdldCB0aGUgdmFsdWUgZm9yIHRoZSBzY3JvbGxZIHdpbmRvdyBwb3NpdGlvbi4gXG4gKlxuICogTm90ZTogR2V0dGluZyB3aW5kb3cucGFnZVlPZmZzZXQgb3Igd2luZG93LnNjcm9sbFkgY2F1c2VzIGxheW91dCByZWZsb3cuXG4gKiBCeSBjYWNoaW5nIHRoZSB2YWx1ZSB3ZSBtaW5pbWl6ZSB0aGlzLlxuICogXG4gKiBAcmV0dXJucyB7aW50fSBDdXJyZW50IFkgc2Nyb2xsIGRpc3RhbmNlXG4gKiBcbiAqL1xuXG5sZXQgYXR0YWNoZWRTY3JvbGxZID0gZmFsc2VcbmxldCBzY3JvbGxQb3MgPSB3aW5kb3cucGFnZVlPZmZzZXRcblxuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbFkoKSB7XG5cbiAgaWYoIWF0dGFjaGVkU2Nyb2xsWSkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBlID0+IHtcbiAgICAgIHNjcm9sbFBvcyA9IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgIH0pXG5cbiAgICBhdHRhY2hlZFNjcm9sbFkgPSB0cnVlXG4gIH1cblxuICByZXR1cm4gc2Nyb2xsUG9zXG59XG5cblxuLyoqXG4gKlxuICogQ29sbGVjdGlvblxuICpcbiAqIEludGVyZmFjZSBmb3IgcXVlcnlTZWxlY3RvckFsbCwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGVsZW1lbnRzLCBpbnN0ZWFkIG9mIGEgbm9kZUxpc3QgXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8Tm9kZUxpc3R9IHNlbGVjdG9yT3JOb2RlTGlzdCAtIEVpdGhlciBhIHNlbGVjdG9yIHN0cmluZyBvciBhIG5vZGVMaXN0XG4gKiBAcmV0dXJuIHthcnJheX0gQXJyYXkgb2YgRE9NIGVsZW1lbnRzXG4gKiBcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY29sbGVjdGlvbihzZWxlY3Rvck9yTm9kZUxpc3QpIHtcblxuICBjb25zdCBhcnIgPSBbXVxuXG4gIGxldCBub2RlTGlzdFxuXG4gIGlmIChzZWxlY3Rvck9yTm9kZUxpc3QgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgIG5vZGVMaXN0ID0gc2VsZWN0b3JPck5vZGVMaXN0XG4gIH0gZWxzZSBpZih0eXBlb2Ygc2VsZWN0b3JPck5vZGVMaXN0ID09ICdzdHJpbmcnKSB7XG4gICAgbm9kZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yT3JOb2RlTGlzdClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICBmb3IobGV0IGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICBhcnJbaV0gPSBub2RlTGlzdFtpXVxuICB9XG5cbiAgcmV0dXJuIGFyclxuXG59XG5cblxuLyoqXG4qXG4qIEdldCBCcmVha3BvaW50cyBPYmplY3RcbipcbiogVGhpcyBpcyBhIGN1c3RvbSB0ZWNobmlxdWUgdG8gZ2FpbiBhY2Nlc3MgdG8gb3VyIFNDU1MgZGVmaW5lZCBtZWRpYSBxdWVyeSBicmVha3BvaW50cyBcbiogaW4gSlMuXG4qXG4qIFRvIGdldCB0aGUgdGVjaG5pcXVlIHdvcmtpbmcgeW91IG5lZWQgdGhlIGZvbGxvd2luZzpcbipcbiogMS4gRGVmaW5lIGEgYCRicC1hcnJheWAgdmFyaWFibGUgaW4geW91ciBTQ1NTLCB3aXRoIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuKiAgICBcbiogICAkYnAtYXJyYXkgIDogJ3tcInhzXCI6IFwiI3skYnAteHN9XCIgfSc7XG4qXG4qIDIuIFRvIG1ha2UgaXQgdGhlIHZhbHVlIGFjY2Vzc2libGUgZnJvbSBKUywgd2UgYXR0YWNoIHRoYXQgcHJvcGVydHkgYXNcbiogICAgdGhlIGZvbnQgc2l6ZSBvZiB0aGUgZG9jdW1lbnQgaGVhZC5cbipcbiogIGhlYWQge1xuKiAgIGZvbnQtZmFtaWx5OiAkYnAtYXJyYXk7XG4qICB9XG4qIFxuKiBcbiogVGhpcyBmdW5jdGlvbiB3aWxsIHRha2UgY2FyZSBvZiBxdWVyeWluZyBhbmQgcGFyc2luZyB0aGF0IHZhbHVlLCByZXR1cm5pbmcgYW4gb2JqZWN0XG4qIHdpdGggdGhlIG1lZGlhIHF1ZXJ5IHZhbHVlcyB0aGF0IHlvdSBkZWZpbmUgb24geW91ciBTQ1NTXG4qXG4qXG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnBPYmooKSB7XG4gIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuaGVhZClbJ2ZvbnQtZmFtaWx5J11cblxuICBsZXQgYnBPYmogPSB7fVxuICAvLyBSZW1vdmUgYWxsIHVud2FudGVkIGNoYXJhY3RlciB0byBtYWtlIGl0IHBvc3NpYmxlIHRvIHBhcnNlIHRoaXMgYXMgSlNPTlxuICBjb25zdCBicEpTT04gPSBzdHlsZS5yZXBsYWNlKC9eWydcIl0rfFxccyt8XFxcXHwoO1xccz99KSt8WydcIl0kL2csXCJcIilcbiBcbiAgdHJ5IHtcbiAgICBicE9iaiA9IEpTT04ucGFyc2UoYnBKU09OKVxuICAgIFxuICAgIGZvcihsZXQgayBpbiBicE9iaikge1xuICAgICAgaWYoYnBPYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgYnBPYmpba10gPSBwYXJzZUludChicE9ialtrXSlcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2goZSkge31cblxuICByZXR1cm4gYnBPYmpcbn0iLCIvKipcbiAqXG4gKiBWaWRlbyBJZnJhbWVcbiAqXG4gKiBTZXR1cCB2aWRlbyBpZnJhbWVzLCBpbnN0YW50YW50aWF0aW5nIGl0J3MgY29ycmVzcG9uZGluZyBwbGF5ZXIgYXBpIFxuICogYW5kIGV4dGVybmFsIGN1c3RvbSBjb250cm9scy5cbiAqXG4gKiBBbnkgc2VydmljZSBzcGVjaWZpYyBhcGkgbG9naWMgc2hvdWxkIGJlIGFic3RyYWN0ZWQgdG8gaXQncyBjb3JyZXNwb25kaW5nICd2aWRlb1NlcnZpY2UnXG4gKlxuICogSU1QT1JUQU5UOiBJT1MgZGV2aWNlcyBkb24ndCBhbGxvdyB5b3UgdG8gdXNlIHRoZSBzZXJ2aWNlIEFQSSB0byB0cmlnZ2VyIHBsYXkgb24gdGhlIGlmcmFtZS5cbiAqIEluc3RlYWQsIGFsbG93IHRoZSB1c2VyIHRvIGNsaWNrIGRpcmVjdGx5IG9uIHRoZSBpZnJhbWUsIHdoaWNoIHdpbGwgd29yayBmaW5lLlxuICogXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgc2VyaWFsaXplT2JqZWN0LCBkZWxlZ2F0ZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gJy4vRXZlbnRCdXMnO1xuaW1wb3J0IGluaXRWaWRlb1NlcnZpY2UgZnJvbSAnLi92aWRlb1NlcnZpY2UnO1xuXG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnaXMtYWN0aXZlJ1xuY29uc3QgTE9BRElOR19DTEFTUyA9ICdpcy1sb2FkaW5nJ1xuXG4vKipcbiAqIFJldHVybnMgYSB1bmlxdWUgaWQgd2l0aGluIHRoaXMgbW9kdWxlXG4gKi9cblxubGV0IGlkID0gMTtcbmZ1bmN0aW9uIHVpZCgpIHtcbiAgcmV0dXJuIGlkKys7XG59XG5cblxuLyoqXG4gKiBcbiAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGRpZmZlcmVudCBzZXJ2aWNlcyBcbiAqIHdlIHN1cHBvcnQgYW5kIHRoZSBwYXJhbWV0ZXJzIGVhY2ggc2VydmljZSByZXF1aXJlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGxheWVySWQgLSBJZCBvZiB0aGUgcGxheWVyIGlmcmFtZS5cbiAqIFxuICovXG5cbmZ1bmN0aW9uIHNlcnZpY2VzQ29uZmlnKHBsYXllcklkKSB7XG5cbiAgLy8gQ29uZmlndXJhdGlvbiBvYmplY3QgZm9yIGVhY2ggdmlkZW8gc2VydmljZVxuICByZXR1cm4ge1xuICAgIHlvdXR1YmU6IHtcbiAgICAgIHVybDogbG9jYXRpb24ucHJvdG9jb2wgKyAnLy93d3cueW91dHViZS5jb20vZW1iZWQvJyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBlbmFibGVqc2FwaTogMSxcbiAgICAgICAgcmVsOiAwLFxuICAgICAgICBhdXRvcGxheTogMCxcbiAgICAgICAgbW9kZXN0YnJhbmRpbmc6IDEsXG4gICAgICAgIGNvbnRyb2xzOiAxLFxuICAgICAgICBzaG93aW5mbzogMCxcbiAgICAgICAgd21vZGU6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHZxOiAnaGQ3MjAnXG4gICAgICB9XG4gICAgfSxcblxuICAgIHZpbWVvOiB7XG4gICAgICB1cmw6IGxvY2F0aW9uLnByb3RvY29sICsgJy8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8nLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIGF1dG9wbGF5OiAwLFxuICAgICAgICBhcGk6IDEsXG4gICAgICAgIHBsYXllcl9pZDogcGxheWVySWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqXG4gKiBSZXR1cm5zIHRoZSBtYXJrdXAgZm9yIHRoZSBwbGF5ZXIgaWZyYW1lXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHNlcnZpY2UgLSBWYWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBzZXJ2aWNlIGtleSBmcm9tIGBzZXJ2aWNlc0NvbmZpZ2AuXG4gKiBAcGFyYW0ge3N0cmluZ30gdmlkZW9JZCAtIElkIG9mIHRoZSB2aWRlbyBwcm92aWRlZCBieSB0aGUgdmlkZW8gc2VydmljZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpZnJhbWVJZCAtIElkIG9mIHRoZSBpZnJhbWUgRE9NIGVsZW1lbnQuXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBnZXRJZnJhbWUoc2VydmljZSwgdmlkZW9JZCwgaWZyYW1lSWQpIHtcbiAgbGV0IHNyYyA9IHNlcnZpY2UudXJsICsgdmlkZW9JZCArICc/JyArIHNlcmlhbGl6ZU9iamVjdChzZXJ2aWNlLnBhcmFtcyk7XG5cbiAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScsIHtcbiAgICBpZDogaWZyYW1lSWQsXG4gICAgc3JjOiBzcmMsXG4gICAgZnJhbWVib3JkZXI6IDAsXG4gICAgYWxsb3dmdWxsc2NyZWVuOiB0cnVlXG4gIH0pXG59XG5cblxuLyoqXG4gKlxuICogQXR0YWNoZXMgZXZlbnQgbGlzdGVuZXIgZm9yIGFueSBleHRlcm5hbCBjb250cm9scyBmb3IgdGhlIHBsYXllciBcbiAqIChBIGN1c3RvbSBwbGF5IGJ1dHRvbiBmb3IgZXhhbXBsZSlcbiAqXG4gKiBQbGF5IGJ1dHRvbjogPGJ1dHRvbj4gZWxlbWVudCBtdXN0IGhhdmUgYSBgZGF0YS12aWRlby1wbGF5YCBhdHRyaWJ1dGVcbiAqIHRvIGluZGljYXRlIGl0J3MgYSBwbGF5IGJ1dHRvbiBhbmQgYSBgZGF0YS10YXJnZXRgIHdpdGggdGhlIGlkIG9mIHRoZSBgd3JhcHBlckVsYCBpZnJhbWVcbiAqIHdyYXBwZXIgdG8gYmUgdGFyZ2V0ZWQuXG4gKlxuICovXG5cbmxldCBjb250cm9sc0luaXRpYWxpemVkID0gZmFsc2U7XG5mdW5jdGlvbiBpbml0VmlkZW9Db250cm9scygpIHtcblxuICAvLyBPbmx5IHdhbnQgdG8gYXR0YWNoIHRoaXMgbGlzdGVuZXIgb25jZVxuICBpZighY29udHJvbHNJbml0aWFsaXplZCkge1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxlZ2F0ZSgnW2RhdGEtdmlkZW8tcGxheV0nLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgIGNvbnN0IGRlbGVnYXRlZEVsID0gdGhpcztcbiAgICAgIGNvbnN0IHdyYXBwZXJFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZGVsZWdhdGVkRWwuZGF0YXNldC50YXJnZXQpO1xuXG4gICAgICAvLyBUaGUgd3JhcHBlciBlbGVtZW50IHNlcnZpY2Ugc2hvdWxkIGJlIGFzc2lnbmVkIHdoZW4gY2FsbGluZyBgY3JlYXRlVmlkZW9JZnJhbWVgXG4gICAgICBpZih3cmFwcGVyRWwgJiYgd3JhcHBlckVsLnNlcnZpY2VDb250cm9sbGVyKSB7XG4gICAgICAgIHdyYXBwZXJFbC5zZXJ2aWNlQ29udHJvbGxlci5wbGF5KClcbiAgICAgIH1cbiAgICAgIFxuICAgIH0pKVxuXG4gICAgY29udHJvbHNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxufVxuXG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgdGhlIHZpZGVvIGlmcmFtZSBwbGF5ZXIuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gd3JhcHBlckVsIC0gUm9vdCBlbGVtZW50IHdoZXJlIHRoZSBwbGF5ZXIgd2lsbCBiZSBpbnNlcnRlZC5cbiAqIEByZXR1cm5zIHtvYmplY3R9IHNlcnZpY2VDb250cm9sbGVyIC0gc2VydmljZSB2aWRlbyBzZXJ2aWNlIGNvbnRyb2xsZXIgaW5zdGFuY2UuXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlVmlkZW9JZnJhbWUod3JhcHBlckVsKSB7XG5cbiAgaWYoIXdyYXBwZXJFbCB8fCAhd3JhcHBlckVsLm5vZGVUeXBlKSB7XG4gICAgY29uc29sZS5sb2coJ1lvdSBtdXN0IHByb3ZpZGUgYSBET00gZWxlbWVudCB0byBgY3JlYXRlVmlkZW9JZnJhbWVgJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IHdyYXBwZXJFbC5kYXRhc2V0O1xuICBjb25zdCB2aWRlb0lkID0gZGF0YS52aWRlb0lkO1xuICBjb25zdCBwbGF5ZXJJZCA9ICdpZnJhbWUtcGxheWVyLScgKyB1aWQoKTtcbiAgY29uc3Qgc2VydmljZUNvbmZpZyA9IHNlcnZpY2VzQ29uZmlnKHBsYXllcklkKVtkYXRhLnZpZGVvU2VydmljZV07XG5cbiAgaWYoIXNlcnZpY2VDb25maWcgfHwgIXZpZGVvSWQpIHtcbiAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciB3cmFwcGVyIG11c3QgaGF2ZSBcImRhdGEtdmlkZW8tc2VydmljZVwiIGFuZCBcImRhdGEtdmlkZW8taWRcIiBhdHRyaWJ1dGVzJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHBsYXllciBpZnJhbWUgdG8gdGhlIHdyYXBwZXIgXG4gIHdyYXBwZXJFbFxuICAgIC5hcHBlbmRDaGlsZChnZXRJZnJhbWUoc2VydmljZUNvbmZpZywgdmlkZW9JZCwgcGxheWVySWQpKVxuICBcbiAgY29uc3QgaWZyYW1lID0gd3JhcHBlckVsLnF1ZXJ5U2VsZWN0b3IoJ2lmcmFtZScpIC8vIFRoZW4gZ2V0IGl0XG4gIGNvbnN0IHNlcnZpY2VDb250cm9sbGVyID0gaW5pdFZpZGVvU2VydmljZShkYXRhLnZpZGVvU2VydmljZSwgaWZyYW1lKVxuXG5cbiAgLy8gQ3VzdG9tIGV2ZW50IGxpc3RlbmVycywgdHJpZ2dlcmVkIGJ5IHRoZSByZXNwZWN0aXZlIHNlcnZpY2UgQVBJXG5cbiAgc2VydmljZUNvbnRyb2xsZXIuc3Vic2NyaWJlKCd2aWRlby1zZXJ2aWNlOmxvYWRpbmcnLCAoKSA9PiB7XG4gICAgd3JhcHBlckVsLmNsYXNzTGlzdC5hZGQoTE9BRElOR19DTEFTUylcbiAgfSlcblxuICBzZXJ2aWNlQ29udHJvbGxlci5zdWJzY3JpYmUoJ3ZpZGVvLXNlcnZpY2U6cGxheScsICgpID0+IHtcbiAgICB3cmFwcGVyRWwuY2xhc3NMaXN0LmFkZChBQ1RJVkVfQ0xBU1MpXG4gICAgd3JhcHBlckVsLmNsYXNzTGlzdC5yZW1vdmUoTE9BRElOR19DTEFTUylcbiAgfSlcblxuICBzZXJ2aWNlQ29udHJvbGxlci5zdWJzY3JpYmUoJ3ZpZGVvLXNlcnZpY2U6ZmluaXNoJywgKCkgPT4ge1xuICAgIHdyYXBwZXJFbC5jbGFzc0xpc3QucmVtb3ZlKEFDVElWRV9DTEFTUywgTE9BRElOR19DTEFTUylcbiAgfSlcblxuICAvLyBFeHBvc2UgdGhlIHNlcnZpY2Ugb2JqZWN0IHRvIHRoZSBvdXRzaWRlIGJ5IGFzc2lnbmluZyBpdCB0byB0aGUgd3JhcHBlciBlbGVtZW50XG4gIHdyYXBwZXJFbC5zZXJ2aWNlQ29udHJvbGxlciA9IHNlcnZpY2VDb250cm9sbGVyO1xuICBpbml0VmlkZW9Db250cm9scygpO1xuXG4gIHJldHVybiBzZXJ2aWNlQ29udHJvbGxlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVmlkZW9JZnJhbWU7XG4iLCIvKipcbiAqXG4gKiBWaWRlbyBTZXJ2aWNlXG4gKlxuICogTG9naWMgdG8gc2V0dXAgZGlmZmVyZW50IHZpZGVvIGlmcmFtZSBhcGkgc2VydmljZXMgKGN1cnJlbnRseSBZb3V0dWJlIGFuZCBWaW1lbylcbiAqXG4gKiBJTVBPUlRBTlQ6IElPUyBkZXZpY2VzIGRvbid0IGFsbG93IHlvdSB0byB1c2UgdGhlIHNlcnZpY2UgQVBJIHRvIHRyaWdnZXIgcGxheSBvbiB0aGUgaWZyYW1lLlxuICogSW5zdGVhZCwgYWxsb3cgdGhlIHVzZXIgdG8gY2xpY2sgZGlyZWN0bHkgb24gdGhlIGlmcmFtLCB3aGljaCB3aWxsIHdvcmsgZmluZS5cbiAqIFxuICovXG5cbmltcG9ydCBFdmVudEJ1cywgeyBldmVudEJ1c0ZhY3RvcnkgfSBmcm9tICcuL0V2ZW50QnVzJ1xuaW1wb3J0IHsgbG9hZFNjcmlwdE9uY2UgfSBmcm9tICcuL2xvYWQnXG5cbmxldCBwbGF5ZXJPcmlnaW4gPSAnKic7XG5cbi8qKlxuICpcbiAqIEhlbHBlciBmdW5jdGlvbiBmb3Igc2VuZGluZyBhIG1lc3NhZ2UgdG8gdGhlIHZpbWVvIHBsYXllciwgdGFrZW4gZnJvbSB7QGxpbmsgVmltZW8gQVBJfVxuICoge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLnZpbWVvLmNvbS9wbGF5ZXIvanMtYXBpIFZpbWVvIEFQSX1cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiAtIE5hbWUgb2YgdGhlIGFjdGlvbiB0byBiZSBwb3N0ZWQgdG8gdGhlIGlmcmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIGFjdGlvbiB0byBiZSBwb3N0ZWQgdG8gdGhlIGlmcmFtZVxuICogQHBhcmFtIHtIVE1MSUZyYW1lRWxlbWVudH0gcGxheWVySWZyYW1lIC0gSWZyYW1lIERPTSBlbGVtZW50IG9mIHRoZSBwbGF5ZXJcbiAqIFxuICovXG5cbmZ1bmN0aW9uIHBvc3RUb1ZpbWVvKGFjdGlvbiwgdmFsdWUsIHBsYXllcklmcmFtZSkge1xuXG4gIHZhciBkYXRhID0ge1xuICAgIG1ldGhvZDogYWN0aW9uXG4gIH07XG5cbiAgaWYodmFsdWUpIHtcbiAgICBkYXRhLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICB2YXIgbWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICBwbGF5ZXJJZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShtZXNzYWdlLCBwbGF5ZXJPcmlnaW4pO1xufVxuXG5cbi8qKlxuICpcbiAqIExpc3RlbiBmb3IgJ21lc3NhZ2UnIGV2ZW50cyBmcm9tIHRoZSBWSU1FTyBpZnJhbWUsIGFuZCBjYWxsIHRoZSBjb3JyZXNwb25kaW5nXG4gKiBoYW5kbGVyIGZyb20gYSBwcm92aWVkIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyAtIGluc3RhbmNlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBNdXN0IGhhdmUgdmFsaWQgbWV0aG9kc1xuICogICAgICAgICAgICAgICAgICAgICAgICBDb3JyZXNwb25kaW5nIHRvIHRoZSBWaW1lbyBBUEkgZXZlbnRzXG4gKiBAcGFyYW0ge0hUTUxJZnJhbWVFbGVtZW50fSBpZnJhbWUgLSBWaW1lbyBpZnJhbWUgdmlkZW8gcGxheWVyXG4gKlxuICovXG5cbmZ1bmN0aW9uIGluaXRWaW1lbyhjb25maWcsIGlmcmFtZSkge1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGUpID0+IHtcblxuICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShlLmRhdGEpO1xuICAgIFxuICAgIC8vIEhhbmRsZSBtZXNzYWdlcyBmcm9tIHRoZSB2aW1lbyBwbGF5ZXIgb25seVxuICAgIGlmICghKC9eaHR0cHM/OlxcL1xcL3BsYXllci52aW1lby5jb20vKS50ZXN0KGUub3JpZ2luKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXR1cm4gaWYgdGhlIG1lc3NhZ2UgaXMgbm90IGZyb20gdGhpcyBpZnJhbWVcbiAgICBpZihpZnJhbWUuaWQgIT09IGRhdGEucGxheWVyX2lkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHBsYXllck9yaWdpbiA9PT0gJyonKSB7XG4gICAgICBwbGF5ZXJPcmlnaW4gPSBlLm9yaWdpbjtcbiAgICB9XG5cbiAgICAvLyBFeGVjdXRlIHRoZSBoYW5kbGVyIGZvciB0aGlzIGV2ZW50LCBpZiBpdCdzIGEgdmFsaWQgZnVuY3Rpb25cbiAgICBpZih0eXBlb2YgY29uZmlnW2RhdGEuZXZlbnRdID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbmZpZ1tkYXRhLmV2ZW50XSgpXG4gICAgfVxuXG4gIH0sIGZhbHNlKTtcbn1cblxuXG4vKipcbiAqXG4gKiBZb3V0dWJlIGNhbGxzIHRoaXMgZnVuY3Rpb24gYXV0b21hdGljYWxseSBvbmNlIHRoZSBBUEkgaGFzIGxvYWRlZFxuICpcbiAqL1xuXG5jb25zdCB5b3V0dWJlQVBJUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICB3aW5kb3cub25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSAoKSA9PiB7XG4gICAgcmVzb2x2ZSgpO1xuICB9XG59KTtcblxuLyoqXG4gKlxuICogSW5pdGlhbGl6ZSBhIHZpZGVvIHNlcnZpY2UgaW5zdGFuY2UuIFJldHVybnMgYSBgc2VydmljZUNvbnRyb2xsZXJgXG4gKiBvYmplY3QgZm9yIGxpc3RlbmluZyB0byBBUEkgZXZlbnRzICBhbmQgY29udHJvbGxpbmcgcGxheWVyIHdpdGggY3VzdG9tIGVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXJ2aWNlTmFtZSAtIE5hbWUgb2YgdGhlIHNlcnZpY2UgdG8gaW5pdGlhbGl6ZVxuICogQHBhcmFtIHtIVE1MSWZyYW1lRWxlbWVudH0gaWZyYW1lIC0gSWZyYW1lIHZpZGVvIHBsYXllclxuICogQHJldHVybnMge29iamVjdH0gc2VydmljZUNvbnRyb2xsZXIgLSBzZXJ2aWNlIHZpZGVvIHNlcnZpY2UgY29udHJvbGxlciBpbnN0YW5jZS5cbiAqL1xuXG5mdW5jdGlvbiBpbml0VmlkZW9TZXJ2aWNlKHNlcnZpY2VOYW1lLCBpZnJhbWUpIHtcblxuXG4gIC8vIEluc3RhY2UgY29udHJvbGxlclxuICBjb25zdCBzZXJ2aWNlQ29udHJvbGxlciA9IE9iamVjdC5hc3NpZ24oe30sIFxuICAgIC8vIENyZWF0ZSBhbiBldmVudEJ1cyBpbnN0YW5jZSB1bmlxdWUgZm9yIHRoaXMgdmlkZW8gc2VydmljZSBpbnN0YW5jZVxuICAgIGV2ZW50QnVzRmFjdG9yeSgpXG4gIClcblxuICBjb25zdCBzZXJ2aWNlUmVhZHkgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBzZXJ2aWNlQ29udHJvbGxlci5zdWJzY3JpYmUoJ3ZpZGVvLXNlcnZpY2U6cmVhZHknLCBwbGF5ZXIgPT4ge1xuICAgICAgcmVzb2x2ZShwbGF5ZXIpXG4gICAgfSlcbiAgfSk7XG5cbiAgY29uc3Qgb25TZXJ2aWNlUmVhZHkgPSAoYWZ0ZXJDYiA9ICgpID0+IHt9LCBiZWZvcmVDYiA9ICgpID0+IHt9KSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGJlZm9yZUNiKClcbiAgICAgIHNlcnZpY2VSZWFkeS50aGVuKHBsYXllciA9PiB7XG4gICAgICAgIGFmdGVyQ2IocGxheWVyKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBwdWJsaXNoTG9hZGluZyA9ICgpID0+IHNlcnZpY2VDb250cm9sbGVyLnB1Ymxpc2goJ3ZpZGVvLXNlcnZpY2U6bG9hZGluZycpXG5cbiAgLy8gU2luY2UgZWFjaCBzZXJ2aWNlIGhhcyBhIHZlcnkgZGlmZmVyZW50IEFQSSwgXG4gIC8vIFdlIGhhdmUgdG8gYXNzZW1ibGUgdGhlIGBzZXJ2aWNlQ29udHJvbGxlcmAgZm9yIGVhY2ggdHlwZVxuICAvLyBpbiBhIGRpZmZlcmVudCB3YXksIHdoaWxlIHN0aWxsIHByb3ZpZGluZyBhIGNvbnNpc3RlbnQgaW50ZXJmYWNlLlxuICBzd2l0Y2ggKHNlcnZpY2VOYW1lKSB7XG5cbiAgICBjYXNlICd2aW1lbyc6XG5cbiAgICAgIC8vIEFzc2lnbiB0aGUgY29udHJvbHMgbWV0aG9kcyBmb3IgdmltZW9cbiAgICAgIHNlcnZpY2VDb250cm9sbGVyLnBsYXkgPSBvblNlcnZpY2VSZWFkeSgoKSA9PiB7XG4gICAgICAgIHBvc3RUb1ZpbWVvKCdwbGF5JywgbnVsbCwgaWZyYW1lKVxuICAgICAgfSwgcHVibGlzaExvYWRpbmcpXG5cbiAgICAgIHNlcnZpY2VDb250cm9sbGVyLnN0b3AgPSBvblNlcnZpY2VSZWFkeSgoKSA9PiB7XG4gICAgICAgIHBvc3RUb1ZpbWVvKCdwYXVzZScsIG51bGwsIGlmcmFtZSlcbiAgICAgIH0pXG5cbiAgICAgIGluaXRWaW1lbyh7XG4gICAgICAgIHJlYWR5KCkge1xuICAgICAgICAgIC8vIE5lZWQgdG8gdGVsbCBWaW1lbyB0aGF0IHdlIHdhbnQgdG8gbGlzdGVuIGZvciB0aGlzIGV2ZW50c1xuICAgICAgICAgIHBvc3RUb1ZpbWVvKCdhZGRFdmVudExpc3RlbmVyJywgJ3BsYXknLCBpZnJhbWUpO1xuICAgICAgICAgIHBvc3RUb1ZpbWVvKCdhZGRFdmVudExpc3RlbmVyJywgJ2ZpbmlzaCcsIGlmcmFtZSk7XG5cbiAgICAgICAgICBzZXJ2aWNlQ29udHJvbGxlci5wdWJsaXNoKCd2aWRlby1zZXJ2aWNlOnJlYWR5JylcblxuICAgICAgICB9LFxuICAgICAgICBwbGF5KCkge1xuICAgICAgICAgIHNlcnZpY2VDb250cm9sbGVyLnB1Ymxpc2goJ3ZpZGVvLXNlcnZpY2U6cGxheScpXG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoKCkge1xuICAgICAgICAgIHNlcnZpY2VDb250cm9sbGVyLnB1Ymxpc2goJ3ZpZGVvLXNlcnZpY2U6ZmluaXNoJylcbiAgICAgICAgfVxuICAgICAgfSwgaWZyYW1lKVxuICAgIGJyZWFrO1xuXG4gICAgY2FzZSAneW91dHViZSc6XG5cbiAgICAgIC8vIEFzc2lnbiBjb250cm9sIG1ldGhvZHMgZm9yIHlvdXR1YmVcbiAgICAgIHNlcnZpY2VDb250cm9sbGVyLnBsYXkgPSBvblNlcnZpY2VSZWFkeShcbiAgICAgICAgcGxheWVyID0+IHBsYXllci5wbGF5VmlkZW8oKSwgXG4gICAgICAgIHB1Ymxpc2hMb2FkaW5nXG4gICAgICApXG4gICAgICBzZXJ2aWNlQ29udHJvbGxlci5zdG9wID0gb25TZXJ2aWNlUmVhZHkocGxheWVyID0+IHBsYXllci5zdG9wVmlkZW8oKSlcblxuICAgICAgbG9hZFNjcmlwdE9uY2UoJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGknKTtcblxuICAgICAgeW91dHViZUFQSVByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIFxuICAgICAgICBsZXQgcGxheWVyID0gbmV3IFlULlBsYXllcihpZnJhbWUsIHtcbiAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIG9uUmVhZHkoKSB7XG4gICAgICAgICAgICAgIHNlcnZpY2VDb250cm9sbGVyLnB1Ymxpc2goJ3ZpZGVvLXNlcnZpY2U6cmVhZHknLCBwbGF5ZXIpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25TdGF0ZUNoYW5nZShlKSB7XG5cbiAgICAgICAgICAgICAgaWYoZS5kYXRhID09IDEpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlQ29udHJvbGxlci5wdWJsaXNoKCd2aWRlby1zZXJ2aWNlOnBsYXknKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUuZGF0YSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgc2VydmljZUNvbnRyb2xsZXIucHVibGlzaCgndmlkZW8tc2VydmljZTpmaW5pc2gnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICB9KVxuXG4gICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gc2VydmljZUNvbnRyb2xsZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdFZpZGVvU2VydmljZSIsImltcG9ydCAnLi9tb2R1bGVzL3BvbHlmaWxscydcbmltcG9ydCAnLi9tb2R1bGVzL21vZGVybml6clRlc3RzJ1xuXG5pbXBvcnQgRmxpY2tpdHkgZnJvbSAnZmxpY2tpdHknXG5pbXBvcnQgc21vb3RoU2Nyb2xsIGZyb20gJ3Ntb290aC1zY3JvbGwnXG5cbmltcG9ydCByb3V0ZXIgZnJvbSAnLi9tb2R1bGVzL3JvdXRlcidcbmltcG9ydCBFdmVudEJ1cyBmcm9tICcuL21vZHVsZXMvRXZlbnRCdXMnXG5pbXBvcnQgeyBpbml0TW9kYWwsIGluaXRWaWRlb01vZGFsIH0gZnJvbSAnLi9tb2R1bGVzL21vZGFsJ1xuaW1wb3J0IGNyZWF0ZVZpZGVvSWZyYW1lIGZyb20gJy4vbW9kdWxlcy92aWRlbydcbmltcG9ydCB7IGFqYXhTdWJtaXRHZm9ybXMgfSBmcm9tICcuL21vZHVsZXMvZm9ybSdcbmltcG9ydCB0b2dnbGVUYXJnZXQgZnJvbSAnLi9tb2R1bGVzL3RvZ2dsZVRhcmdldCdcbmltcG9ydCBzaGFyZVBvc3QgZnJvbSAnLi9tb2R1bGVzL3NoYXJlUG9zdCdcbmltcG9ydCB7IGtleURvd25Fc2NhcGUsIHdpbmRvd1Jlc2l6ZWQgfSBmcm9tICcuL21vZHVsZXMvZ2xvYmFsRXZlbnRzJ1xuaW1wb3J0IHsgY29sbGVjdGlvbiwgZ2V0QnBPYmogfSBmcm9tICcuL21vZHVsZXMvdXRpbHMnXG5pbXBvcnQgY3JlYXRlTG9hZGVyIGZyb20gJy4vbW9kdWxlcy9hamF4TG9hZGVyJ1xuXG4vLyBTdHViIHRoZSBjb25zb2xlLCBpZiBpdCBkb2Vzbid0IGV4aXN0XG53aW5kb3cuY29uc29sZSA9IHdpbmRvdy5jb25zb2xlIHx8IHsgbG9nKCkge30gfSBcblxuLyotLS0tLS0tLS0tICBDb21tb24gRnVuY3Rpb24gRGVmaW5pdGlvbnMgIC0tLS0tLS0tLS0qL1xuXG5cbi8qKlxuICogXG4gKiBBamF4IFBvc3QgTG9hZGVyXG4gKiBcbiAqL1xuXG5mdW5jdGlvbiBwb3N0TG9hZGVyKCkge1xuXG4gIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtbGlzdGluZy13cmFwcGVyJylcbiAgY29uc3QgbGlzdGluZyA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignLmpzLWxpc3RpbmcnKVxuXG4gIGNvbnN0IGxvYWRlciA9IGNyZWF0ZUxvYWRlcignLmpzLWxpc3RpbmctaXRlbScsIHtcbiAgICBsb2FkQnV0dG9uOiB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5qcy1sb2FkLW1vcmUnKVxuICB9KVxuXG4gIGNvbnN0IHNlYXJjaEZvcm0gPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5qcy1saXN0aW5nLXNlYXJjaCcpXG4gIGNvbnN0IGZpbHRlcnMgPSBjb2xsZWN0aW9uKHdyYXBwZXIucXVlcnlTZWxlY3RvckFsbCgnLmpzLWxpc3RpbmctZmlsdGVyJykpXG4gIGNvbnN0IG5vUmVzdWx0cyA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignLmpzLW5vLXJlc3VsdHMnKVxuXG4gIGxvYWRlci5zdWJzY3JpYmUoJ2FqYXgtbG9hZGVyOm5vLXJlc3VsdHMnLCAoKSA9PiB7XG4gICAgbGlzdGluZy5pbm5lckhUTUwgPSAnJ1xuICAgIGxpc3RpbmcuYXBwZW5kQ2hpbGQobm9SZXN1bHRzKVxuICB9KVxuICBcbiAgbG9hZGVyLnN1YnNjcmliZSgnYWpheC1sb2FkZXI6bG9hZGVkJywgKGl0ZW1zLCBwYWdlKSA9PiB7XG5cbiAgICBpZihwYWdlID09IDEpIHtcbiAgICAgIGxpc3RpbmcuaW5uZXJIVE1MID0gJydcbiAgICB9XG5cbiAgICBpdGVtcy5tYXAoaXRlbSA9PiBsaXN0aW5nLmFwcGVuZENoaWxkKGl0ZW0pKVxuXG4gIH0pXG5cbiAgLy8gSGVscGVyIG1ldGhvZCB0byBzZXQgdGhlIHF1ZXJ5XG4gIGNvbnN0IHNldFF1ZXJ5ID0gZWwgPT4gbG9hZGVyLnNldFF1ZXJ5KGVsLm5hbWUsIGVsLnZhbHVlKVxuXG4gIC8vIERPTSBldmVudCBsaXN0ZW5lcnNcblxuICBpZiAoc2VhcmNoRm9ybSkge1xuICAgIHNlYXJjaEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIHNldFF1ZXJ5KGUudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykpXG4gICAgfSlcbiAgfVxuXG4gIGlmKGZpbHRlcnMubGVuZ3RoKSB7XG4gICAgZmlsdGVycy5tYXAoZmlsdGVyID0+IHtcbiAgICAgIGZpbHRlci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBlID0+IHNldFF1ZXJ5KGUudGFyZ2V0KSlcbiAgICB9KVxuICB9XG5cbn1cblxuLyotLS0tLS0tLS0tICBTY3JpcHRzIHRvIEZpcmUgb24gRXZlcnkgUGFnZSAgLS0tLS0tLS0tLSovXG5cbmNvbnN0IGJyZWFrcG9pbnRzID0gZ2V0QnBPYmooKVxuXG4vKipcbiAqIFxuICogTGlzdGVuIGZvciBjYXJkIGVsZW1lbnRzIGNsaWNrLCBhbmQgdHJpZ2dlciBjbGljayBvbiB0aGUgbGlua3MgaW5zaWRlLFxuICogbWFraW5nIHRoZSB3aG9sZSBjYXJkIGNsaWNrYWJsZVxuICogXG4gKi9cblxuY29sbGVjdGlvbignW2RhdGEtY2FyZC1jbGlja10nKS5tYXAoY2FyZCA9PiB7XG4gIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICBjb25zdCBsaW5rID0gY2FyZC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1jYXJkLWxpbmtdJylcbiAgICBpZihsaW5rKSB7IGxpbmsuY2xpY2soKSB9XG4gIH0pXG59KVxuXG5cbi8qKlxuICpcbiAqIFNtb290aCBzY3JvbGwgZm9yIGxpbmtzIHdpdGhpbiB0aGUgc2FtZSBwYWdlXG4gKiBcbiAqL1xuXG5FdmVudEJ1cy5zdWJzY3JpYmUod2luZG93UmVzaXplZCwgZSA9PiB7XG4gIHNtb290aFNjcm9sbC5pbml0KHtcbiAgICBzcGVlZDogMTAwMCxcbiAgICBvZmZzZXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaXRlLWhlYWRlcicpLm9mZnNldEhlaWdodCxcbiAgfSlcbn0pXG5cbi8qKlxuICpcbiAqIFNlYXJjaCBCYXIgVG9nZ2xlXG4gKiBcbiAqL1xuXG5jb25zdCBzaXRlU2VhcmNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NpdGUtc2VhcmNoJylcblxuLy8gRm9jdXNlcyBhdXRvbWF0aWNhbGx5IHdoZW4gb3BlbmluZ1xuY29uc3QgdG9nZ2xlU2VhcmNoQ29udHJvbGxlciA9IHRvZ2dsZVRhcmdldCgnLmpzLXRvZ2dsZS1zZWFyY2gnLCB7XG4gIG9uVG9nZ2xlT3BlbjogKGVscykgPT4gc2l0ZVNlYXJjaC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmZvY3VzKClcbn0pXG5cbi8vIENsb3NlIHRoZSBzZWFyY2ggYmFyIG9uIGBlc2NgIHByZXNzXG5FdmVudEJ1cy5zdWJzY3JpYmUoa2V5RG93bkVzY2FwZSwgKCkgPT4ge1xuICB0b2dnbGVTZWFyY2hDb250cm9sbGVyLmNsb3NlQWxsKClcbn0pXG5cbi8qKlxuICpcbiAqICBHZW5lcmljIFRvZ2dsZVxuICogXG4gKi9cblxudG9nZ2xlVGFyZ2V0KCcuanMtdG9nZ2xlJylcblxuXG4vKipcbiAqXG4gKiBUYWJzIFRvZ2dsZXNcbiAqIFxuICovXG5cbmNvbnN0IHRhYnNUb2dnbGVzID0gdG9nZ2xlVGFyZ2V0KCcuanMtdG9nZ2xlLXRhYicpIFxuXG4vKipcbiAqXG4gKiBBY2NvcmRpb24gVG9nZ2xlc1xuICogXG4gKi9cblxuY29uc3QgYWNjb3JkaW9uVG9nZ2xlcyA9IHRvZ2dsZVRhcmdldCgnLmpzLXRvZ2dsZS1hY2NvcmRpb24nKSBcblxuLyoqXG4gKiBcbiAqIFNldCBDU1MgYG1heC1oZWlnaHRgIGZvciB0aGUgdGFicyAmIGFjY29yZGlvbnMsIHRvIGFsbG93IGFuaW1hdGluZyB0aGUgb3BlbmluZy9jbG9zaW5nIFxuICogdmlhIENTUyB0cmFuc2l0aW9ucy5cbiAqIFxuICovXG5cbmNvbnN0IHNldFRvZ2dsZXNNYXhIZWlnaHQgPSAodG9nZ2xlcykgPT4ge1xuXG4gIHRvZ2dsZXMuZ2V0RWxlbWVudHMoKVxuICAgIC5tYXAoZWxzID0+IGVscy50YXJnZXQpXG4gICAgLy8gRmlsdGVyIG91dCBkdXBsaWNhdGUgdGFyZ2V0c1xuICAgIC5maWx0ZXIoKHRhcmdldCwgaSwgYXJyKSA9PiB7XG4gICAgICByZXR1cm4gYXJyLmluZGV4T2YodGFyZ2V0KSA9PSBpXG4gICAgfSlcbiAgICAubWFwKHRhcmdldCA9PiB7XG5cbiAgICAgIGNvbnN0IHsgYWN0aXZlQ2xhc3MgfSA9IHRvZ2dsZXNcbiAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhhY3RpdmVDbGFzcylcblxuICAgICAgdGFyZ2V0LnN0eWxlLm1heEhlaWdodCA9ICdub25lJ1xuXG4gICAgICBpZighaXNBY3RpdmUpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpXG4gICAgICB9XG5cbiAgICAgIHRhcmdldC5zdHlsZS5tYXhIZWlnaHQgPSB0YXJnZXQub2Zmc2V0SGVpZ2h0ICsgJ3B4J1xuXG4gICAgICBpZighaXNBY3RpdmUpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpXG4gICAgICB9XG5cbiAgICB9KVxuXG59XG5cbkV2ZW50QnVzLnN1YnNjcmliZSh3aW5kb3dSZXNpemVkLCBlID0+IHtcblxuICAvLyBSZWZyZXNoIHRoZSBtYXggaGVpZ2h0c1xuICBzZXRUb2dnbGVzTWF4SGVpZ2h0KHRhYnNUb2dnbGVzKVxuICBzZXRUb2dnbGVzTWF4SGVpZ2h0KGFjY29yZGlvblRvZ2dsZXMpXG5cbiAgLy8gUmVzZXQgdGhlIHRhYnMgd2hlbiBvblxuICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+IGJyZWFrcG9pbnRzLnRhYnMpIHtcbiAgICB0YWJzVG9nZ2xlcy5yZXNldCgpXG4gIH1cbn0pXG5cblxuLyoqXG4gKlxuICogTW9iaWxlIE5hdmlnYXRpb25cbiAqIFxuICovXG5cbmNvbnN0IG1vYmlsZU5hdiA9IGluaXRNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9iaWxlLW5hdicpKVxuXG4vLyBDbG9zZSBtb2JpbGUgbmF2IGlmIHJlc2l6aW5nIGFib3ZlIG1haW4gYnJlYWtwb2ludFxuRXZlbnRCdXMuc3Vic2NyaWJlKHdpbmRvd1Jlc2l6ZWQsICgpID0+IHtcbiAgaWYod2luZG93LmlubmVyV2lkdGggPiBicmVha3BvaW50cy5sZyAmJiBtb2JpbGVOYXYuaXNPcGVuKSB7XG4gICAgbW9iaWxlTmF2LmNsb3NlKClcbiAgfVxufSlcblxuLyoqXG4gKlxuICogIFNsaWRlcnNcbiAqIFxuICovXG5cbmNvbGxlY3Rpb24oJy5qcy1zbGlkZXInKVxuICAuZmlsdGVyKGVsID0+IGVsLmNoaWxkcmVuLmxlbmd0aCA+IDEpXG4gIC5tYXAoZWwgPT4gbmV3IEZsaWNraXR5KGVsLCB7XG4gICAgcGFnZURvdHM6IGVsLmRhdGFzZXQucGFnZURvdHMgPT0gJ2ZhbHNlJyA/IGZhbHNlIDogdHJ1ZVxuICB9KSlcblxuLyoqXG4gKlxuICogTW9iaWxlIFNsaWRlciBpbnN0YW50aWF0aW9uLlxuICpcbiAqIElmIHRoZSB3aW5kb3cgaXMgYmVsb3cgYSBjZXJ0YWluIHdpZHRoIChpbiB0aGlzIGNhc2Ugb3VyICdsZycgQ1NTIGJyZWFrcG9pbnQpLCBpbml0aWFsaXplIHRoZSBzbGlkZXJcbiAqIG90aGVyd2lzZSwgZGVzdHJveSBpdC5cbiAqIFxuICovXG5FdmVudEJ1cy5zdWJzY3JpYmUod2luZG93UmVzaXplZCwgKCkgPT4ge1xuXG4gIGNvbnN0IHNsaWRlcnMgPSBjb2xsZWN0aW9uKCcuanMtbW9iaWxlLXNsaWRlcicpXG5cbiAgaWYod2luZG93LmlubmVyV2lkdGggPD0gYnJlYWtwb2ludHMubGcpIHtcbiAgICBzbGlkZXJzXG4gICAgICAuZmlsdGVyKGVsID0+ICFGbGlja2l0eS5kYXRhKGVsKSlcbiAgICAgIC5tYXAoZWwgPT4gbmV3IEZsaWNraXR5KGVsLCB7XG4gICAgICAgIHBhZ2VEb3RzOiB0cnVlLFxuICAgICAgICBwcmV2TmV4dEJ1dHRvbnM6IGZhbHNlXG4gICAgICB9KSlcbiAgfSBlbHNlIHtcbiAgICBzbGlkZXJzXG4gICAgICAubWFwKGVsID0+IEZsaWNraXR5LmRhdGEoZWwpKVxuICAgICAgLmZpbHRlcihmbGlja2l0eSA9PiBmbGlja2l0eSlcbiAgICAgIC5tYXAoZmxpY2tpdHkgPT4gZmxpY2tpdHkuZGVzdHJveSgpKVxuICB9XG5cbn0pXG5cbi8qKlxuICpcbiAqIE1vZGFsc1xuICogXG4gKi9cblxuY29sbGVjdGlvbignLmpzLW1vZGFsJykubWFwKG1vZGFsRWwgPT4gaW5pdE1vZGFsKG1vZGFsRWwpKVxuXG4vKipcbiAqXG4gKiBWaWRlbyBNb2RhbHNcbiAqIFxuICovXG5cbmNvbGxlY3Rpb24oJy5qcy12aWRlby1tb2RhbCcpLm1hcChtb2RhbEVsID0+IGluaXRWaWRlb01vZGFsKG1vZGFsRWwsICdbZGF0YS12aWRlby1wbGF5ZXJdJykpXG5cbi8qKlxuICpcbiAqIFZpZGVvIFBsYXllcnNcbiAqIFxuICovXG5cbmNvbGxlY3Rpb24oJy5qcy12aWRlby1wbGF5ZXInKS5tYXAodmlkZW9FbCA9PiBjcmVhdGVWaWRlb0lmcmFtZSh2aWRlb0VsKSlcblxuLyoqXG4gKlxuICogSGFuZGxlciBmb3IgYWpheCBzdWJtaXR0ZWQgZ3Jhdml0eSBmb3Jtc1xuICogXG4gKi9cblxuYWpheFN1Ym1pdEdmb3JtcygnLmdmb3JtX3dyYXBwZXIgZm9ybScpXG5cbi8qKlxuICpcbiAqIFNoYXJlIFBvc3RcbiAqIFxuICovXG5cbnNoYXJlUG9zdCgnLmpzLXNoYXJlLXBvc3QnKVxuXG4vKi0tLS0tLS0tLS0gIFJvdXRlIFNwZWNpZmljICAtLS0tLS0tLS0tKi9cblxucm91dGVyKHtcbiAgaG9tZSgpIHtcbiAgICBcbiAgfSxcblxuICBibG9nKCkge1xuICAgIHBvc3RMb2FkZXIoKVxuICB9LFxuXG4gIHRlYW0oKSB7XG4gICAgcG9zdExvYWRlcigpXG4gIH0sXG5cbiAgc2VhcmNoKCkge1xuICAgIHBvc3RMb2FkZXIoKVxuICB9XG59KVxuXG4vLyBGaXJlIGluaXRpYWwgY3VzdG9tIGV2ZW50c1xuXG5FdmVudEJ1cy5wdWJsaXNoKHdpbmRvd1Jlc2l6ZWQpXG4iXX0=
