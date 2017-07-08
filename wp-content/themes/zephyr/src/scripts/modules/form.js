/**
 *
 * Forms
 *
 * Form presentational and behavioural scripts
 *
 * Uses global jQuery reference exposed by forms plugin
 *
 */

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