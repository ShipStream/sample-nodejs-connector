const micro = require('micro')
const {send} = micro
const util = require('util')
const fetch = require('node-fetch')

const replaceMeApiUrl = process.env.REPLACEME_BASE_URL || 'https://REPLACEME'
const globalApiUrl = process.env.SHIPSTREAM_GLOBAL_API_URL || 'http://localhost:8888/api/global'
const globalApiKey = process.env.SHIPSTREAM_GLOBAL_API_KEY
let logId = ''

class HTTPResponseError extends Error {
  constructor(response, context, text) {
    let detail
    try {
      if (text) {
        let data = text
        if (typeof text !== 'string') {
          data = JSON.parse(text)
        }
        detail = data
        if (data.message && data.code) {
          detail = `${data.message} (code:${data.code})`
        } else if (data.accepted !== undefined && data.reason !== undefined) {
          detail = `${data.reason} (code:${response.status})`
        }
      }
    } catch (e) {
      detail = e.message || e
    }
    let message = `${response.status} ${response.statusText}`
    if (detail) {
      message = `${detail} [${message}]`
    }
    super(message)
    this.name = `${context} http error`
    this.reason = message
  }
}

function generateLogId(len, arr) {
  let ans = ''
  for (let i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)]
  }
  logId = ans
}

function sendResponse(req, res, statusCode, message) {
  if (process.env.DEBUG) {
    showLogAndHeader(req, 'SEND RESPONSE', message)
  }
  return send(res, statusCode, message)
}

/**
 * Display standard header with log data for debugging
 * @param req
 * @param header
 * @param log
 * @param inspectOptions
 */
function showLogAndHeader(req, header, log, inspectOptions) {
  if (process.env.NODE_ENV === 'production') {
    console.log(`${logId} *********** ${header} ***********`)
    if (log && typeof log !== 'undefined') {
      try {
        if (typeof log === 'object') {
          console.log(logId + ' JSON: ' + JSON.stringify(log))
        } else {
          console.log(logId + ' RAW: ' + JSON.stringify(log))
        }
      } catch (e) {
        console.log('Error stringifying object: ' + log)
      }
    }
  } else {
    console.log(`\n${logId} *********** ${header} ***********`)
    if (log) {
      console.log(util.inspect(log, Object.assign({depth: null, colors: true, maxStringLength: 512}, inspectOptions)))
    }
  }
}

module.exports = {
  HTTPResponseError,
  sendResponse,
  showLogAndHeader,
  generateLogId,
  logId,
  replaceMeApiUrl,
  fetch,
  globalApiUrl,
  globalApiKey,
}
