/**
 *
 * Analytics
 *
 * Custom event analytics helper functions
 *
 */

/**
 * If ssing Yoast Google Analytics plugin to add analytics
 *
 * The plugin uses the __gaTracker variable instead of the global window.ga variable
 *
 * Here we assing __gaTracker to window.ga to make sure it works with both
 *
 */

if(window.__gaTracker) {

  __gaTracker( function() {
    window.ga = __gaTracker;
  })

} else {
  window.ga = window.ga || function() {}
}

export function logPageView (path) {
  window.ga('set', 'page', path || location.pathname);
  window.ga('send', 'pageview');
}

export function logEvent(category, action, label, value) {
  window.ga('send', 'event', category, action, label, value);
}

export function logSocial(network, action, url) {
  window.ga('send', 'social', network, action, url);
}
