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

import EventBus, { eventBusFactory } from './EventBus'
import { loadScriptOnce } from './load'

let playerOrigin = '*';

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

  if(value) {
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

  window.addEventListener('message', (e) => {

    let data = JSON.parse(e.data);
    
    // Handle messages from the vimeo player only
    if (!(/^https?:\/\/player.vimeo.com/).test(e.origin)) {
      return false;
    }
    
    // Return if the message is not from this iframe
    if(iframe.id !== data.player_id) {
      return false;
    }

    if (playerOrigin === '*') {
      playerOrigin = e.origin;
    }

    // Execute the handler for this event, if it's a valid function
    if(typeof config[data.event] == 'function') {
      config[data.event]()
    }

  }, false);
}


/**
 *
 * Youtube calls this function automatically once the API has loaded
 *
 */

const youtubeAPIPromise = new Promise(resolve => {
  window.onYouTubeIframeAPIReady = () => {
    resolve();
  }
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
  const serviceController = Object.assign({}, 
    // Create an eventBus instance unique for this video service instance
    eventBusFactory()
  )

  const serviceReady = new Promise(resolve => {
    serviceController.subscribe('video-service:ready', player => {
      resolve(player)
    })
  });

  const onServiceReady = (afterCb = () => {}, beforeCb = () => {}) => {
    return () => {
      beforeCb()
      serviceReady.then(player => {
        afterCb(player)
      })
    }
  }

  const publishLoading = () => serviceController.publish('video-service:loading')

  // Since each service has a very different API, 
  // We have to assemble the `serviceController` for each type
  // in a different way, while still providing a consistent interface.
  switch (serviceName) {

    case 'vimeo':

      // Assign the controls methods for vimeo
      serviceController.play = onServiceReady(() => {
        postToVimeo('play', null, iframe)
      }, publishLoading)

      serviceController.stop = onServiceReady(() => {
        postToVimeo('pause', null, iframe)
      })

      initVimeo({
        ready() {
          // Need to tell Vimeo that we want to listen for this events
          postToVimeo('addEventListener', 'play', iframe);
          postToVimeo('addEventListener', 'finish', iframe);

          serviceController.publish('video-service:ready')

        },
        play() {
          serviceController.publish('video-service:play')
        },

        finish() {
          serviceController.publish('video-service:finish')
        }
      }, iframe)
    break;

    case 'youtube':

      // Assign control methods for youtube
      serviceController.play = onServiceReady(
        player => player.playVideo(), 
        publishLoading
      )
      serviceController.stop = onServiceReady(player => player.stopVideo())

      loadScriptOnce('https://www.youtube.com/iframe_api');

      youtubeAPIPromise.then(() => {
        
        let player = new YT.Player(iframe, {
          events: {
            onReady() {
              serviceController.publish('video-service:ready', player)
            },
            onStateChange(e) {

              if(e.data == 1) {
                serviceController.publish('video-service:play')
              } else if (e.data == 0) {
                serviceController.publish('video-service:finish')
              }
            }
          }
        })

      })

    break;
  }

  return serviceController
}

export default initVideoService