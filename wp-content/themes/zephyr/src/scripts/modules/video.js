/**
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

import { createElement, serializeObject, delegate } from './utils';
import EventBus from './EventBus';
import initVideoService from './videoService';

const ACTIVE_CLASS = 'is-active'
const LOADING_CLASS = 'is-loading'

/**
 * Returns a unique id within this module
 */

let id = 1;
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
  }
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
  let src = service.url + videoId + '?' + serializeObject(service.params);

  return createElement('iframe', {
    id: iframeId,
    src: src,
    frameborder: 0,
    allowfullscreen: true
  })
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

let controlsInitialized = false;
function initVideoControls() {

  // Only want to attach this listener once
  if(!controlsInitialized) {

    document.addEventListener('click', delegate('[data-video-play]', function(e) {

      const delegatedEl = this;
      const wrapperEl = document.querySelector(delegatedEl.dataset.target);

      // The wrapper element service should be assigned when calling `createVideoIframe`
      if(wrapperEl && wrapperEl.serviceController) {
        wrapperEl.serviceController.play()
      }
      
    }))

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

  if(!wrapperEl || !wrapperEl.nodeType) {
    console.log('You must provide a DOM element to `createVideoIframe`');
    return false;
  }

  const data = wrapperEl.dataset;
  const videoId = data.videoId;
  const playerId = 'iframe-player-' + uid();
  const serviceConfig = servicesConfig(playerId)[data.videoService];

  if(!serviceConfig || !videoId) {
    console.log('The player wrapper must have "data-video-service" and "data-video-id" attributes');
    return;
  }

  // Create and append the player iframe to the wrapper 
  wrapperEl
    .appendChild(getIframe(serviceConfig, videoId, playerId))
  
  const iframe = wrapperEl.querySelector('iframe') // Then get it
  const serviceController = initVideoService(data.videoService, iframe)


  // Custom event listeners, triggered by the respective service API

  serviceController.subscribe('video-service:loading', () => {
    wrapperEl.classList.add(LOADING_CLASS)
  })

  serviceController.subscribe('video-service:play', () => {
    wrapperEl.classList.add(ACTIVE_CLASS)
    wrapperEl.classList.remove(LOADING_CLASS)
  })

  serviceController.subscribe('video-service:finish', () => {
    wrapperEl.classList.remove(ACTIVE_CLASS, LOADING_CLASS)
  })

  // Expose the service object to the outside by assigning it to the wrapper element
  wrapperEl.serviceController = serviceController;
  initVideoControls();

  return serviceController;
}

export default createVideoIframe;
