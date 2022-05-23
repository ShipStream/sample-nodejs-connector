const {json} = require('micro')
const {parse} = require('url')
const {showLogAndHeader, generateLogId} = require('./lib/helper')
const {createLabel, cancelLabel, fetchTracking} = require('./lib/shipping')
const {updateOrderShipments, revertShipment, orderCanceled} = require('./lib/webhook')

// Only load .env file in local dev environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// TODO UPDATE TO ENV VARIABLE

module.exports = async (req, res) => {
  // Add unique id to each request
  req.uniqueId = require('crypto').randomBytes(6).toString('hex')

  // Wrap helper methods to include req object
  function sendResponse(res, statusCode, message) {
    const {sendResponse} = require('./lib/helper')
    sendResponse(req, res, statusCode, message)
  }

  const url = parse(req.url)
  /*
   * Verify request route
   */
  if (req.method !== 'POST') {
    return sendResponse(res, 405, 'Method Not Allowed')
  }

  /*
   * Ignore paths other than /shipment /webhooks /shipping
   * Allow test:ping topic at when no path present
   */
  if (url.path !== '/webhook' && url.path !== '/shipping') {
    return sendResponse(res, 401, 'Not Found')
  }

  /*
   * Verify request authenticity
   */
  if (process.env.NODE_ENV === 'production') {
    // TODO - ...
  }

  /*
   * Validate request data
   */
  const request = await json(req)
  if (!request) {
    return sendResponse(res, 401, 'Bad Request')
  }

  /*
   * Route /shipping requests based on action value
   */
  if (url.path === '/shipping') {
    if (process.env.DEBUG) {
      showLogAndHeader(req, `RECEIVED ESM REQUEST: ${request.action}`, request)
    }
    try {
      let response
      switch (request.action) {
        case 'create_label':
          response = await createLabel(req, request)
          return sendResponse(res, 200, response)
        case 'cancel_label':
          response = await cancelLabel(req, request)
          return sendResponse(res, 200, response)
        case 'fetch_tracking':
          response = await fetchTracking(req, request)
          return sendResponse(res, 200, response)
        default:
          return sendResponse(res, 401, {errors: `Unrecognized action: ${request.action}`})
      }
    } catch (error) {
      return sendResponse(res, 200, {errors: `${error}`})
    }
  }

  /*
   * Route /webhook requests based on topic
   */
  if (url.path === '/webhook') {
    generateLogId(8, '1234567890abcdefghijklmnopqrstuvwxyz')
    try {
      if (!request.message || !request.topic) {
        return sendResponse(res, 200, 'Invalid payload')
      }
      if (process.env.DEBUG) {
        showLogAndHeader(req, `RECEIVED WEBHOOK: ${request.topic}`, request.message)
      }
      switch (request.topic) {
        case 'test:ping':
          return sendResponse(res, 200, 'pong')
        case 'order:shipments_updated':
          await updateOrderShipments(req, request.message)
          return sendResponse(res, 200)
        case 'order:address_changed':
          await updateOrderShipments(req, request.message)
          return sendResponse(res, 200)
        case 'order:canceled':
          await orderCanceled(req, request.message)
          return sendResponse(res, 200)
        case 'shipment:reverted':
          await revertShipment(req, request.message)
          return sendResponse(res, 200)
        default:
          return sendResponse(res, 401, `Unrecognized topic`)
      }
    } catch (error) {
      return sendResponse(res, 200, error)
    }
  }
}
