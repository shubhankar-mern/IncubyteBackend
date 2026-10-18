
class AnalyticsService {
  constructor(analyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  async getOverview() {
    return this.analyticsRepository.getOverview();
  }

  async getEmployeesByCountry() {
    return this.analyticsRepository.getEmployeesByCountry();
  }

  async getEmployeesByDepartment() {
    return this.analyticsRepository.getEmployeesByDepartment();
  }
  async getPayroll(filters) {
  return this.analyticsRepository.getPayroll(filters);
}
async getSalaryTrends(filters) {
  return this.analyticsRepository.getSalaryTrends(filters);
}
}

module.exports = AnalyticsService;
