const { AuditLog } = require('../../models');

/**
 * Enterprise Audit Service
 * Centralized logic for immutable logging
 */
class AuditService {
  /**
   * Log a security or operational event
   */
  async log(data) {
    try {
      // In a high-scale environment, this should also emit to a Kafka topic
      // called 'security.audit' for external SIEM integration
      const entry = await AuditLog.create({
        user_id: data.userId,
        action: data.action,
        module: data.module,
        resource_id: data.resourceId,
        old_values: data.oldValues,
        new_values: data.newValues,
        ip_address: data.ip,
        user_agent: data.userAgent,
        status: data.status || 'success',
        metadata: {
          organization_id: data.organizationId,
          severity: data.severity || 'info'
        }
      });

      return entry;
    } catch (error) {
      // Fail-safe: Audit logging should not crash the main application
      console.error('CRITICAL: Audit logging failed:', error.message);
    }
  }

  /**
   * Get high-severity logs for admin review
   */
  async getSecurityAlerts() {
    return await AuditLog.findAll({
      where: { 'metadata.severity': 'critical' },
      order: [['created_at', 'DESC']],
      limit: 50
    });
  }
}

module.exports = new AuditService();
