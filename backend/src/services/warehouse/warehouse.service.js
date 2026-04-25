const { Warehouse, Inventory, StockMovement, Shipment, sequelize } = require('../../models');
const { Op } = require('sequelize');

class WarehouseService {
  /**
   * Create a new warehouse
   */
  async createWarehouse(data) {
    return await Warehouse.create(data);
  }

  /**
   * List all warehouses
   */
  async listWarehouses(filters = {}) {
    const where = {};
    if (filters.city) where.city = filters.city;
    if (filters.is_active !== undefined) where.is_active = filters.is_active;
    
    return await Warehouse.findAll({ where });
  }

  /**
   * Get warehouse by ID with current inventory
   */
  async getWarehouseDetails(id) {
    return await Warehouse.findByPk(id, {
      include: [{ model: Inventory, as: 'items' }]
    });
  }

  /**
   * Stock In: Add or update inventory and record movement
   */
  async stockIn(warehouseId, data, performedBy) {
    const t = await sequelize.transaction();
    try {
      let item = await Inventory.findOne({
        where: { warehouse_id: warehouseId, sku_code: data.sku_code, batch_number: data.batch_number || null },
        transaction: t
      });

      if (item) {
        item.quantity += data.quantity;
        await item.save({ transaction: t });
      } else {
        item = await Inventory.create({
          ...data,
          warehouse_id: warehouseId
        }, { transaction: t });
      }

      const movement = await StockMovement.create({
        warehouse_id: warehouseId,
        inventory_id: item.id,
        shipment_id: data.shipment_id || null,
        type: 'inbound',
        quantity: data.quantity,
        reference_number: data.reference_number,
        notes: data.notes,
        performed_by: performedBy
      }, { transaction: t });

      await t.commit();
      return { item, movement };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Stock Out: Deduct inventory and record movement
   */
  async stockOut(warehouseId, data, performedBy) {
    const t = await sequelize.transaction();
    try {
      const item = await Inventory.findOne({
        where: { warehouse_id: warehouseId, sku_code: data.sku_code, batch_number: data.batch_number || null },
        transaction: t
      });

      if (!item || item.quantity < data.quantity) {
        throw new Error('Insufficient stock or item not found');
      }

      item.quantity -= data.quantity;
      await item.save({ transaction: t });

      const movement = await StockMovement.create({
        warehouse_id: warehouseId,
        inventory_id: item.id,
        shipment_id: data.shipment_id || null,
        type: 'outbound',
        quantity: data.quantity,
        reference_number: data.reference_number,
        notes: data.notes,
        performed_by: performedBy
      }, { transaction: t });

      await t.commit();
      return { item, movement };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Get stock movements for a warehouse
   */
  async getMovements(warehouseId, limit = 50) {
    return await StockMovement.findAll({
      where: { warehouse_id: warehouseId },
      include: [{ model: Inventory, as: 'item' }],
      order: [['created_at', 'DESC']],
      limit
    });
  }
}

module.exports = new WarehouseService();
