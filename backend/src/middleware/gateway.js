const { authenticate } = require('./auth');
const rbac = require('./rbac');
const { apiLimiter } = require('./rateLimiter');
const AuditService = require('../services/reliability/audit.service');

/**
 * Enterprise API Gateway (Consolidated)
 * Handles:
 * 1. Authentication
 * 2. Multi-tier Rate Limiting
 * 3. Role-Based Access (RBAC)
 * 4. Automated Audit Logging
 */
const gateway = (options) => {
  const { module, action, roles = [], limiter = apiLimiter } = options;

  return [
    // 1. Rate Limiting
    limiter,

    // 2. Authentication
    authenticate,

    // 3. Authorization (RBAC)
    rbac(roles),

    // 4. Injected Audit Logic
    async (req, res, next) => {
      const originalJson = res.json;
      
      res.json = async function(body) {
        // Only log successful modifications
        if (req.method !== 'GET' && res.statusCode >= 200 && res.statusCode < 300) {
          await AuditService.log({
            userId: req.userId,
            organizationId: req.organizationId,
            action,
            module,
            resourceId: body.id || req.params.id,
            oldValues: req.body,
            newValues: body,
            ip: req.ip,
            userAgent: req.get('User-Agent')
          });
        }
        return originalJson.call(this, body);
      };
      
      next();
    }
  ];
};

module.exports = gateway;
