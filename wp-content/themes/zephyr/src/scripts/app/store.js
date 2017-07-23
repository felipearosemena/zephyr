import { apiFetch } from 'modules/load'

const store = {

  initialized: false,

  state: {
    pageContent: '',
    cachedResponses: {},
    transiting: false,
    initialized: true,
    cart: {
      total: 0,
      items: []
    }
  },

  getCart() {
    apiFetch(Global.api_namespace + '/cart')
      .then(res => res.json())
      .then(res => console.log(res))
  },

  setState(k, v) {

    if(this.state[k] == v) {
      return
    }

    this.state[k] = v

  },

  cacheResponse(k, html) {
    this.state.cachedResponses[k] = html
  },

  isCached(k) {
    return this.state.cachedResponses[k] !== undefined
  },

  setPageContent(html) {

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html')

    this.setState('pageContent', doc.querySelector('.page-content').innerHTML)

  },

  init() {

    if(this.initialized) {
      return
    }

    this.getCart()

    this.initialized = true

  },
}

export default store