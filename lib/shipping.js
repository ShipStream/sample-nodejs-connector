const {HTTPResponseError, showLogAndHeader} = require('./helper')
const {sendGlobalApiRequest} = require('./shipstream-api')

/**
 * Request a label and return it in the response
 *
 * @param req
 * @param request
 * @returns {Promise<{data: *, message: string, status: number}|string|*>}
 */
async function createLabel(req, request) {
  // do an external request and handle errors
  if (process.env.DEBUG) {
    showLogAndHeader(req, 'TODO create_label')
  }
}

/**
 * Cancel an existing label
 *
 * @param req
 * @param request
 * @returns {Promise<{data: *, message: string, status: number}|string|*>}
 */
async function cancelLabel(req, request) {
  if (process.env.DEBUG) {
    showLogAndHeader(req, 'TODO cancel_label')
  }
}

/**
 * Get tracking information using only the tracking number
 *
 * @param req
 * @param request
 * @returns {Promise<{errors: string}>}
 */
async function fetchTracking(req, request) {
  if (process.env.DEBUG) {
    showLogAndHeader(req, 'TODO fetch_tracking')
  }
}

module.exports = {
  createLabel,
  cancelLabel,
  fetchTracking,
}
