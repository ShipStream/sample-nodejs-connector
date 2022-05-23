const {showLogAndHeader, globalApiKey, globalApiUrl, fetch} = require('./helper')

/**
 * Send API request to ShipStream Global API
 * @param req
 * @param method
 * @param path
 * @param query
 * @param body {Object}
 * @returns {Promise<any>}
 */
async function sendGlobalApiRequest(req, method, path, query, body) {
  if (!globalApiUrl || !globalApiKey) {
    throw 'Missing Global API configuration, please set the appropriate environment variables.'
  }
  let requestUrl = globalApiUrl + path
  if (query) {
    requestUrl += '?' + query
  }
  if (process.env.DEBUG) {
    const globalApiRequest = {
      method: method,
      query: query,
      body: body,
    }
    showLogAndHeader(req, 'GLOBAL API REQUEST: /api/global' + path, globalApiRequest)
  }
  const options = {
    method: method,
    headers: {
      'X-AutomationV1-Auth': globalApiKey,
      'X-ShipStream-API-Version': '2020-10',
      'Content-Type': body ? 'application/json' : 'text/plain;charset=UTF8',
    },
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  return fetch(requestUrl, options)
}

module.exports = {
  sendGlobalApiRequest,
}
