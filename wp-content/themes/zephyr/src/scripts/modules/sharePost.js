/**
 *
 * Share Post
 *
 * JS to handle Share Post links.
 * Opens the link in a blank window
 *
 */

import { isIOSorAndroid, delegate } from './utils';

function tweetInApp(href) {

  let tweet = href
    .split('?')[1] // get all url parameters
    .split('&') // separate keys and values
    .map(par => { return par.split('=')[1] }) // get just the values
    .filter(parsArr => parsArr.length) // filter empty paramters
    .join(' ') // concatenate into single string

  window.location = 'twitter://post?message=' + tweet
}


export default function sharePost(selector) {

  document.addEventListener('click', delegate(selector, e => {

    e.preventDefault();
    let href = e.target.getAttribute('href');
    let width = 400;
    let height = 500;
    let left = (window.innerWidth/2) - width/2;
    let top = (window.innerHeight/2) - height/2;
    let config = 'status = no,height = ' + width + ',width  = ' + height + ',resizable = yes,top  = ' + top + ',left = ' + left + ',toolbar = no,menubar = no,scrollbars = no,location = no,directories = no';

    // Tweet in app
    if(href.indexOf('twitter') > -1 && isIOSorAndroid()) {
      // Attempt to open the share in the the Twitter app
      // If it fails, then just redirect the user to the page
      setTimeout(tweetInApp.bind(href), 25)
      // This shouldn't run if 'tweetInApp' is successful
      window.location = href

    // Or just open the share in a new window
    } else {
      window.open(href,'',config);
    }

  }))

}