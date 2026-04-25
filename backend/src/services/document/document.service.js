const { ShipmentDocument, Shipment, User } = require('../../models');

class DocumentService {
  /**
   * Upload and register a shipment document
   */
  async uploadDocument(userId, data) {
    const shipment = await Shipment.findByPk(data.shipment_id);
    if (!shipment) throw new Error('Shipment not found');

    const document = await ShipmentDocument.create({
      ...data,
      uploaded_by: userId,
      is_verified: false
    });

    return document;
  }

  /**
   * Get all documents for a shipment
   */
  async getShipmentDocuments(shipmentId) {
    return await ShipmentDocument.findAll({
      where: { shipment_id: shipmentId },
      include: [{ model: User, as: 'uploader', attributes: ['first_name', 'last_name', 'role'] }],
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Verify a document (Admin only)
   */
  async verifyDocument(adminId, documentId) {
    const document = await ShipmentDocument.findByPk(documentId);
    if (!document) throw new Error('Document not found');

    await document.update({
      is_verified: true,
      verified_at: new Date(),
      verified_by: adminId
    });

    return document;
  }

  /**
   * Bulk generate placeholder LR (Lorry Receipt)
   * In production, this would use a PDF generation library like PDFKit
   */
  async generateLorryReceipt(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId);
    if (!shipment) throw new Error('Shipment not found');

    // Create record for auto-generated LR
    return await ShipmentDocument.create({
      shipment_id: shipmentId,
      document_type: 'lorry_receipt',
      document_number: `LR-${shipment.tracking_id}`,
      file_url: `https://api.transportiq.com/docs/generated/LR-${shipment.tracking_id}.pdf`,
      file_type: 'pdf',
      metadata: { generated: true }
    });
  }

  /**
   * Generate Tax Invoice (GST Ready)
   */
  async generateGSTInvoice(shipmentId) {
    const shipment = await Shipment.findByPk(shipmentId);
    const taxRate = 0.18; // 18% GST standard for logistics
    const baseFare = parseFloat(shipment.final_fare || shipment.estimated_fare);
    const taxAmount = baseFare * taxRate;
    const totalWithTax = baseFare + taxAmount;

    return await ShipmentDocument.create({
      shipment_id: shipmentId,
      document_type: 'invoice',
      document_number: `INV-${Date.now()}`,
      file_url: `https://api.transportiq.com/docs/generated/INV-${shipment.tracking_id}.pdf`,
      file_type: 'pdf',
      metadata: {
        base_fare: baseFare,
        gst_amount: taxAmount,
        gst_rate: '18%',
        total: totalWithTax,
        generated: true
      }
    });
  }

  /**
   * Integrate E-Way Bill (Mock NIC Integration)
   */
  async syncEWayBill(shipmentId, eWayNumber) {
    // In production: Call NIC e-Way Bill API to validate
    return await ShipmentDocument.create({
      shipment_id: shipmentId,
      document_type: 'e_way_bill',
      document_number: eWayNumber,
      file_url: `https://ewaybillgst.gov.in/view/${eWayNumber}`,
      is_verified: true, // Assuming validation passed
      verified_at: new Date(),
      metadata: { provider: 'NIC', status: 'ACTIVE' }
    });
  }
}


module.exports = new DocumentService();
