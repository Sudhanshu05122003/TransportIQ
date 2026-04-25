const DocumentService = require('./document.service');
const { successResponse, errorResponse } = require('../../utils/response');

class DocumentController {
  async upload(req, res) {
    try {
      const doc = await DocumentService.uploadDocument(req.userId, req.body);
      return successResponse(res, doc, 'Document uploaded successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getByShipment(req, res) {
    try {
      const docs = await DocumentService.getShipmentDocuments(req.params.shipmentId);
      return successResponse(res, docs);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async verify(req, res) {
    try {
      const doc = await DocumentService.verifyDocument(req.userId, req.params.id);
      return successResponse(res, doc, 'Document verified successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async generateLR(req, res) {
    try {
      const doc = await DocumentService.generateLorryReceipt(req.params.shipmentId);
      return successResponse(res, doc, 'Lorry Receipt generated');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async generateInvoice(req, res) {
    try {
      const doc = await DocumentService.generateGSTInvoice(req.params.shipmentId);
      return successResponse(res, doc, 'GST Tax Invoice generated');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async syncEWayBill(req, res) {
    try {
      const { e_way_bill_number } = req.body;
      const doc = await DocumentService.syncEWayBill(req.params.shipmentId, e_way_bill_number);
      return successResponse(res, doc, 'E-Way Bill synced');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}


module.exports = new DocumentController();
