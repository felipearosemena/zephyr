/**
 *
 * Load
 *
 * Requires the fetch API to be available
 *
 */

import store from 'app/store'

/**
 *
 * Cache of promises of requested objects
 *
 */

const requestedURLs = {};

/**
 *
 * Load a script only once, regardless if its requested multiple times.
 *
 * @param {string} src - Source URL
 *
 * @returns {object} promise object for that specific source
 *
 */

export function loadScriptOnce(src, fromCache = true) {

  // Check if we've already requested this script
  if(src in requestedURLs && fromCache) {

    // If so, return this script's promise
    return requestedURLs[src]
  }

  let s = document.createElement('script');

  s.type = 'text/javascript';
  s.async = false;
  s.src = src;

  let promise = new Promise((resolve, reject) => {
    // Resolve the promise when the script has loaded.
    s.addEventListener('load', function (e) {
      resolve(e);
    }, false);
  })

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

export function loadOnce(url, type) {

  // Check if we've already requested this script
  if(url in requestedURLs) {

    // If so, return this script's promise
    return requestedURLs[url]
  }

  let promise = fetch(url)
    // res.text() can only be called once,
    // it returns another promise
    .then(res => {
      return res.text()
    })

  // Store the promise, for next time this `url` is requested
  requestedURLs[url] = promise;

  // Return the promise
  return requestedURLs[url];

}

/**
 * Check for the api response to see if errors were found.
 * If so, throws an error otherwise returns the original response
 *
 * @param  {Object} response WP Rest API response
 * @return {Promise/Object} A catcheable promise error or the original response
 */
function handleError(response) {

  if (!response.ok) {
    return response
      .json()
      .then(err => {
        throw new Error(err.code + ': ' + err.message)
      })
  } else {
    return response
  }

}

/**
 *
 * Perform a fetch request to the WP Rest API. Set's the correct headers
 * in order to validate the request.
 *
 *
 * @param  {String} endpoint The url to be requested
 * @param  {String} method   Request method to use ('get' or 'post')
 * @param  {Object} body     Request body, to be used in 'post' request when sending FormData
 * @return {Promise}         Promise containing the request response
 *
 */

export function apiFetch(endpoint, method = 'get', body = {}) {

  console.log(store.state.nonce);

  const headers = {
    'X-WP-Nonce': store.state.nonce
  }

  if(!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const key = endpoint + method + JSON.stringify(body)

  return fetch(Global.api + endpoint, {
    credentials: 'same-origin',
    method: method,
    body: body instanceof FormData ?
      body :
      (method == 'post') ?
        JSON.stringify(body) :
        null,
    headers: new Headers(headers)
  })
  .then(handleError)

}
