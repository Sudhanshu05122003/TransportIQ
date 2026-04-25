const { AuditLog } = require('../models');

/**
 * Audit Logging Middleware
 * Captures critical state changes
 */
const auditLog = (module, action) => async (req, res, next) => {
  const originalJson = res.json;
  const oldValues = req.body; // In a real app, you might fetch current state from DB first

  res.json = async function(body) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        await AuditLog.create({
          user_id: req.userId,
          action,
          module,
          resource_id: body.id || req.params.id,
          old_values: oldValues,
          new_values: body,
          ip_address: req.ip,
          user_agent: req.get('User-Agent'),
          status: 'success'
        });
      } catch (err) {
        console.error('Audit Log Error:', err);
      }
    }
    return originalJson.call(this, body);
  };

  next();
};

module.exports = auditLog;
