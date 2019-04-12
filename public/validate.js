//------------------------------------------------------------------------------

const schemaUrl = '../json/schema.json'

//------------------------------------------------------------------------------

let validateFn

$(document).ready(() => {
  // Load the schema
  $.getJSON(schemaUrl, data => {
    try {
      // See this issue: https://github.com/epoberezkin/ajv/issues/472
      delete data['$schema']
      validateFn = Ajv().compile(data)
    } catch (e) {
      $('.nav, .tab-content, button').hide()
      error('Init Error', `Unable to parse ${schemaUrl}.`, e)
    }
  }).fail(() => {
    $('.nav, .tab-content, button').hide()
    error(
      'Init Error',
      `Unable to load ${schemaUrl}.`,
      `Possible causes: the file is missing or is not in JSON format.`
    )
  })

  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    $('#feedback, #fileText').hide()
    const idOldTab = $(e.relatedTarget).attr('id')
    const idNewTab = $(e.target).attr('id')
    $(`.tab-pane input[name=${idOldTab}]`).removeAttr('required')
    $(`.tab-pane input[name=${idNewTab}]`)
      .attr('required', true)
      .focus()
    $('.tab-pane input').val('')
  })

  $('.tab-pane input[name=file]').change(() => {
    $('#docuss-form').submit()
  })
  $('.tab-pane input[name=url]').focus(() => {
    $('#feedback, #fileText').hide()
  })

  $('#docuss-form').on('submit', e => {
    const activeTab = $('.nav-link.active').attr('id')
    if (activeTab === 'file') {
      const file = $('.tab-pane input[name=file]')[0].files[0]
      loadFile(file)
    } else if (activeTab === 'url') {
      const url = $('.tab-pane input[name=url]').val()
      loadUrl(url)
    }
    return false
  })
})

//------------------------------------------------------------------------------

function loadFile(file) {
  if (file.type !== 'application/json') {
    error(
      'File Format Error',
      `Unsupported file format "${file.type}". Only JSON files are supported.`
    )
    return false
  }
  const reader = new FileReader()
  reader.onload = e => {
    const data = reader.result
    $('#fileText')
      .text(data)
      .show()
    let obj
    try {
      obj = JSON.parse(data)
    } catch (e) {
      error('File Format Error', `File content doesn't seem to be JSON.`)
      return
    }
    validate(obj)
  }
  reader.readAsText(file)
}

//------------------------------------------------------------------------------

function loadUrl(url) {
  const button = $('button')
  function beginWait() {
    button.attr('disabled', true)
    $('body').addClass('wait')
  }
  function endWait() {
    button.attr('disabled', false).css('cursor', 'auto')
    $('body').removeClass('wait')
  }
  beginWait()
  $.getJSON(url, data => {
    endWait()
    $('#fileText')
      .text(JSON.stringify(data, null, 2))
      .show()
    validate(data)
  }).fail(() => {
    endWait()
    error(
      'Loading Error',
      'Unable to load the file. Possible causes: the file is missing or is not in JSON format.'
    )
  })
}

//------------------------------------------------------------------------------

function validate(data) {
  var valid = validateFn(data)
  if (valid) {
    success('File is valid')
  } else {
    const array = validateFn.errors.map((o, i) => {
      const err = Object.assign({}, o)
      //delete err.dataPath
      //delete err.schemaPath
      return `Error ${i + 1}<pre>${JSON.stringify(err, null, 4)}</pre>`
    })
    error('Validation Error(s)', ...array)
  }
}

//------------------------------------------------------------------------------

function alertContent(title, ...args) {
  $('#feedback > .alert-heading').text(title)
  if (args.length) {
    const paragraphs = '<p>' + args.join('</p><p>') + '</p>'
    $('#feedback > .alert-content').html(paragraphs)
  }
}

function error(title, ...arg) {
  alertContent(title, ...arg)
  $('#feedback')
    .removeClass('alert-success')
    .addClass('alert-danger')
    .show()
}

function success(title, ...arg) {
  alertContent(title, ...arg)
  $('#feedback')
    .removeClass('alert-danger')
    .addClass('alert-success')
    .show()
}

//------------------------------------------------------------------------------
