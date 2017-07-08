/**
 *
 * Custom Modernizr Tests
 *
 */

import { isMobile } from './utils'

function matchesIE() {
  return !!navigator.userAgent.match(/(?:ms|\()(ie)\s([\w\.]+)/i);
}

function matchesIE11() {
  return !!navigator.userAgent.match(/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i);
}

Modernizr.addTest('ie', () => {
  return matchesIE11() || matchesIE()
})

Modernizr.addTest('ie11', matchesIE11)

Modernizr.addTest('mobile', isMobile)