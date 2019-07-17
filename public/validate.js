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

function parseJsonText(text) {
  const textArea = $('#fileText')
  textArea.text(text).show()
  let obj
  try {
    obj = JSON.parse(text)
  } catch (e) {
    const pos = parseInt(
      e
        .toString()
        .split(' ')
        .pop()
    )
    if (pos !== NaN) {
      error(
        'File Format Error',
        'The highlighted section contains invalid JSON'
      )
      let html = textArea.text() // Prevent html injection
      html = html.splice(pos + 5, 0, '</span>')
      html = html.splice(
        Math.max(pos - 15, 0),
        0,
        '<span style="background-color:yellow">'
      )
      textArea.html(html)
    } else {
      error('File Format Error', e)
    }
    return
  }
  validate(obj)
}

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
  reader.onload = e => parseJsonText(reader.result)
  reader.readAsText(file)
}

//------------------------------------------------------------------------------
/*
function addLineNumbers(data) {
  let n = 0
  const array = data.split(/(\r?\n)/).map(line => {
    const save = n.toString().padEnd(5, ' ')
    n += line.length
    return line.endsWith('\n') ? line : save + '┃' + line
  })
  return array.join('')
}
*/
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
  $.get(url, text => parseJsonText(text), 'text')
    .fail((resp, eType, eText) => error('Loading Error', eText))
    .always(() => endWait())
}

//------------------------------------------------------------------------------

function validate(data) {
  var valid = validateFn(data)
  if (valid) {
    success('File is valid')
  } else {
    const array = validateFn.errors.map(
      o => `Invalid key "${o.dataPath.substring(1)}": ${o.message}`
    )
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

if (!String.prototype.splice) {
  /**
   * {JSDoc}
   *
   * The splice() method changes the content of a string by removing a range of
   * characters and/or adding new characters.
   *
   * @this {String}
   * @param {number} start Index at which to start changing the string.
   * @param {number} delCount An integer indicating the number of old chars to remove.
   * @param {string} newSubStr The String that is spliced in.
   * @return {string} A new string with the spliced substring.
   */
  String.prototype.splice = function(start, delCount, newSubStr) {
    return (
      this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount))
    )
  }
}

//------------------------------------------------------------------------------
