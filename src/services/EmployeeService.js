class EmployeeService {
  constructor(employeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  async getEmployeeById(id) {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  async getEmployees(filters) {
    return this.employeeRepository.findAll(filters);
  }

  async createEmployee(data) {
    if (!data.name?.trim()) {
      throw new Error("Employee name is required");
    }

    if (!data.departmentId) {
      throw new Error("Department is required");
    }

    return this.employeeRepository.create(data);
  }

  async updateEmployee(id, data) {
    await this.getEmployeeById(id);

    return this.employeeRepository.update(id, data);
  }

  async deleteEmployee(id) {
    await this.getEmployeeById(id);

    return this.employeeRepository.delete(id);
  }
}

module.exports = EmployeeService;