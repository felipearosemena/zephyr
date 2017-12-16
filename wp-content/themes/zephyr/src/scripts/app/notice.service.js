import Vue from 'vue'
import store from 'app/store'
import { apiFetch } from 'modules/load'

const NoticeService = new Vue({
  data: {
    notices: {}
  },

  methods: {
    getNotices() {
      apiFetch(Global.api_namespace + '/notices?time=' + Date.now())
        .then(res => this.hydrate(res))
    },

    hydrate(res) {

      return res.json().then(notices => {

        store.setState({ notices: notices })

      })

    }
  }

})

export default NoticeService
