/**
 *
 * Forms
 *
 * Form presentational and behavioural scripts
 *
 * Uses global jQuery reference exposed by forms plugin
 *
 */

import EventBus from './EventBus'

let $ = false;

// Very Important
// Must ensure we are using the same jquery instance as Gforms
if(window.jQuery) {
  $ = window.jQuery;
}

const fileUploadLabelAttr = 'data-label-text'

function fileUploadOnChange(e, defaultLabel) {

  const $customLabel = $(e.currentTarget).parent().find(`[${ fileUploadLabelAttr }]`)
  const val = e.currentTarget.value.replace('C:\\fakepath\\', '')

  $customLabel.text(val || defaultLabel)

}

/**
 *
 * Custom Mask for File Upload Inputs
 *
 */

export function customFileUpload(input, label = 'Choose file') {

  if(!$) { return }

  const $input = $(input)
  const $customLabel = $(`<span ${ fileUploadLabelAttr }>${ label }</span>`)

  $input.on('change', e => fileUploadOnChange(e, label))
  
  $input.wrapAll(`
    <label for="${ input.id }">
    </label>
  `)
    .parent()
    .prepend($customLabel)

  return {
    setLabelText(label) {
      $customLabel.text(label)
      return this
    },

    getLabelText() {
      return $customLabel.text()
    }
  }
}


function getGformId(formEl) {
  return formEl.id.replace('gform_', '')
}


/**
 *
 * Submit Gravity Forms via AJAX
 *
 * In this function we also setup custom file upload inputs, see `customFileUpload`
 *
 * @param {string} selector jQuery selector for the forms to be submitted via AJAX
 *
 * @event 'form:submitting' - Fires when the user submits the form
 * @event 'form:submit-done' - Fires after Gravity Forms succesfully submits the form
 *
 */

export function ajaxSubmitGforms(selector) {

  if(!$) { return }

  $(document).on('gform_post_render', function(e, formId){

    $('#gform_wrapper_' + formId)
      .filter((i, el) => {

        const hiddenIdField = el.querySelector('[name=gform_submit]')

        /**
         *
         * If using the 'Multiple Form Instance' plugin for Gforms,
         * it changes the DOM form ID's
         *
         * The caveat is that the initial 'gform_post_render' will
         * return a 'formId' equal to the actual form ID (usually a low digit
         * like 1, 2, 3), whereas subsequent `gform_post_render` (eg: after an ajax submit), return
         * the ID set by the 'Multiple Form Instance' plugin (which looks more like a large random
         * number, eg: 2108960147)
         *
         */

        // Check if the 'formID' matched the ID on the DOM element (used after an ajax submission)
        if(getGformId(el) == formId) {
          return el
        }
        // otherwise, check agains the hidden field containing the actual form ID (used on initial render)
        else if (hiddenIdField && hiddenIdField.value == formId) {
          return el
        }
      })
      .each((i, form) => {

        const $form = $(form)
        const $wrapper = $form.closest('.gform_wrapper')

        $wrapper.removeClass('is-submitting')

        $form
          .find('[type=file]')
          .each((i, input) => {
            customFileUpload(input)
          })

      })
  });

  $(document).on('gform_confirmation_loaded', function(e, formId) {
    const $wrapper = $('#gform_wrapper_' + formId)
    $wrapper.removeClass('is-submitting')

    EventBus.publish('form:submit-done', $wrapper)
  })

  $(document).on('submit', selector , e => {

    const form = e.currentTarget
    const formId = getGformId(form)
    const $wrapper = $('#gform_wrapper_' + formId)
    $wrapper.addClass('is-submitting')

    EventBus.publish('form:submitting', $wrapper)
  })
}


/**
 *
 * Reposition the form submit button, so that it's easier
 * to align with the the input field
 *
 */

export function newsletterMoveSubmit(form) {
  if(!$) { return }

  const $form = $(form)
  $form.find('[type=submit]').appendTo($form.find('.gform_body'))
}