const {HTTPResponseError, showLogAndHeader} = require('./helper')
const {sendGlobalApiRequest} = require('./shipstream-api')

/**
 * An order has shipments that have been updated
 * @param req
 * @param request
 */
async function updateOrderShipments(req, request) {
  if (process.env.DEBUG) {
    showLogAndHeader(req, 'TODO updateOrderShipments')
  }
}

/**
 * Cancel all shipment ASRs in order, do not regenerate ASRs
 * @param req
 * @param request
 */
async function orderCanceled(req, request) {
  if (process.env.DEBUG) {
    showLogAndHeader(req, 'TODO orderCanceled')
  }
}

/**
 * Revert shipment to the shipment in the request body
 * @param req
 * @param request
 */
async function revertShipment(req, request) {
  if (process.env.DEBUG) {
    showLogAndHeader(req, 'TODO revertShipment')
  }
}

module.exports = {
  updateOrderShipments,
  revertShipment,
  orderCanceled,
}
