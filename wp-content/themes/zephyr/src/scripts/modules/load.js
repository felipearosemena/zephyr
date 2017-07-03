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

export function loadScriptOnce(src) {

  // Check if we've already requested this script
  if(src in requestedURLs) {

    // If so, return this script's promise
    return requestedURLs[src]
  }

  let s = document.createElement('script');

  s.type = 'text/javascript';
  s.async = true;
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

export function loadOnce(url) {

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