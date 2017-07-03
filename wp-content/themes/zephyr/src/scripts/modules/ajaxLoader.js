/**
 *
 * Load More
 *
 * Handles loading more posts at the end of a list of posts
 * 
 */

import { eventBusFactory } from './EventBus'
import { inArray, extractURLParameters, serializeObject, createElement, collection } from './utils'
import { loadOnce } from './load'

const LOADING_CLASS = 'is-loading'

/**
 *
 * Filter the items found from the XHR request,
 * removing the ones with a `data-post-id` already pushed to the
 * `loadedItems` array
 *
 * @returns {boolean} Whether the item was found in the passed array or not
 *
 */

function filterLoaded(itemId, loadedItems) {
  let alreadyLoaded = inArray(itemId, loadedItems)
  loadedItems.push(itemId)
  return !alreadyLoaded
}

const defaults = {
  loadMore: null
}

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

  loader.subscribe('ajax-loader:next-requested', () => button.classList.add(LOADING_CLASS))
  loader.subscribe('ajax-loader:next-fetched', () => button.classList.remove(LOADING_CLASS))
  loader.subscribe('ajax-loader:next-page-length', l => {
    button.disabled = l ? false : true
  })

  button.addEventListener('click', loader.next)

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


export default function createLoader(selector, config) {

  // Following WP structure for paged lists
  // Note: If working with a localhost:3000 server,
  // location.origin will return undefined when accessing via
  // the external IP (192.136.....)
  const { pathname, search } = window.location
  const buffer = createElement('div') // Buffer for temporarily storing returned HTML
  const options = Object.assign({}, defaults, config)

  let loading = false
  let finished = false

  let currentPage = 1
  let loadedItems = collection(selector).map(item => item.dataset.postId)

  const params = extractURLParameters()

  const url = page => {
    params.paged = page
    return pathname + '?' + serializeObject(params)
  }

  const setUrlState = () => {

    const stateParams = Object.assign({}, params)
    delete stateParams['paged']
    const serializedParams = serializeObject(stateParams)
    const nextState = serializedParams.length ? pathname + '?' + serializedParams : pathname

    window.history.pushState({}, null, nextState)

  }

  const publishFinished = () => {
    finished = true
    instance.publish('ajax-loader:finished')
  }

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
  const checkIfNext = () => {

    let nextPage = url(currentPage + 1)

    instance.publish('ajax-loader:next-requested')

    loadOnce(nextPage)
      .catch(publishFinished)
      .then(res => {

        instance.publish('ajax-loader:next-fetched')

        buffer.innerHTML = res

        let results = collection(buffer.querySelectorAll(selector))
          // Remove WP 'Sticky' posts from subsequent pages
          .filter(item => filterLoaded(item.dataset.postId, [].concat(loadedItems)))

        instance.publish('ajax-loader:next-page-length', results.length)

        if(results.length == 0) {
          publishFinished()
        }
      })
  }

  /**
   *
   * Load the next set of posts
   *
   * @fires `ajax-loader:loaded` - 'Loaded' event with the resulting posts
   * as the subscribe callback parameter
   *
   */

  const next = (query = false) => {

    if(loading || finished) {
      return
    }

    loading = true

    let nextUrl = url(++currentPage)

    setUrlState()
    
    // increment 'currentPage' and request it
    loadOnce(nextUrl)
      .then(res => {

        buffer.innerHTML = res

        let results = collection(buffer.querySelectorAll(selector))
          // Remove WP 'Sticky' posts from subsequent pages
          .filter(item => filterLoaded(item.dataset.postId, loadedItems))

        if(results.length) {
          instance.publish('ajax-loader:loaded', results, currentPage)
        }

        if(query && !results.length) {
          instance.publish('ajax-loader:no-results', query)
        }

        loading = false

      })

    checkIfNext()

  }

  const setQuery = (key, value) => {
    currentPage = 0
    loadedItems = []
    finished = false

    if(loading) {
      return
    }

    // do nothing if the query made is the same as the current one
    if(params[key] == value || (!value && !params[key])) {
      return
    }

    if(!value) {
      delete params[key]
    } else {
      params[key] = value
    }

    instance.publish('ajax-loader:query-set')

    next(params)
  }

  const getQuery = () => params

  const instance = Object.assign({}, {
    next: next,
    setQuery: setQuery,
    getQuery: getQuery
  } , eventBusFactory())

  // Bind load more button events
  if(options.loadButton) {
    initLoadMoreButton(instance, options.loadButton)
  }

  // Do the initial check to see if there is a page #2
  checkIfNext()

  return instance
}