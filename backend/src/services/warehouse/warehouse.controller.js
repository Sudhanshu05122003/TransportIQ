const WarehouseService = require('./warehouse.service');
const { successResponse, errorResponse } = require('../../utils/response');

class WarehouseController {
  async create(req, res) {
    try {
      const warehouse = await WarehouseService.createWarehouse(req.body);
      return successResponse(res, warehouse, 'Warehouse created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async list(req, res) {
    try {
      const warehouses = await WarehouseService.listWarehouses(req.query);
      return successResponse(res, warehouses);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getDetails(req, res) {
    try {
      const warehouse = await WarehouseService.getWarehouseDetails(req.params.id);
      if (!warehouse) return errorResponse(res, 'Warehouse not found', 404);
      return successResponse(res, warehouse);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async stockIn(req, res) {
    try {
      const result = await WarehouseService.stockIn(req.params.id, req.body, req.userId);
      return successResponse(res, result, 'Stock in successful');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async stockOut(req, res) {
    try {
      const result = await WarehouseService.stockOut(req.params.id, req.body, req.userId);
      return successResponse(res, result, 'Stock out successful');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getMovements(req, res) {
    try {
      const movements = await WarehouseService.getMovements(req.params.id);
      return successResponse(res, movements);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new WarehouseController();
