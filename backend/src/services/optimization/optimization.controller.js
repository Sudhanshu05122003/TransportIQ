const OptimizationService = require('./optimization.service');
const { successResponse, errorResponse } = require('../../utils/response');

class OptimizationController {
  async optimizeRoute(req, res) {
    try {
      const { pickup, stops, drop } = req.body;
      const optimized = OptimizationService.optimizeRoute(pickup, stops, drop);
      return successResponse(res, optimized, 'Route optimized successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getDriverLoad(req, res) {
    try {
      const { id } = req.params;
      const score = await OptimizationService.getDriverLoadScore(id);
      return successResponse(res, { load_score: score }, 'Driver load retrieved');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async optimizeNetwork(req, res) {
    try {
      const { region } = req.body;
      const OptimizationEngine = require('./engine/optimization.engine');
      const result = await OptimizationEngine.optimizeNetwork(region);
      return successResponse(res, result, 'Global network optimized');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async runBenchmark(req, res) {
    try {
      const count = parseInt(req.query.count) || 100;
      const BenchmarkService = require('./engine/benchmark.service');
      const results = await BenchmarkService.runSimulation(count);
      return successResponse(res, results, 'Benchmarking simulation complete');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}



module.exports = new OptimizationController();
